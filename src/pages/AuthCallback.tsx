import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuth } = useAuth();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // First check hash parameters (Supabase OAuth standard)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        // Also check query parameters as fallback
        const queryCode = searchParams.get('code');
        const queryError = searchParams.get('error');
        const queryErrorDescription = searchParams.get('error_description');

        if (error || queryError) {
          console.error('OAuth error:', error || queryError, errorDescription || queryErrorDescription);
          setStatus('error');
          setErrorMessage((errorDescription || queryErrorDescription) || (error || queryError));
          return;
        }

        // If we have tokens in hash, Supabase should auto-handle them
        if (accessToken) {
          console.log('Found access token in hash, waiting for Supabase to process...');
          
          // Improved session polling with timeout
          const waitForSession = async (maxAttempts = 10, interval = 500): Promise<{ session: any; error: any }> => {
            for (let i = 0; i < maxAttempts; i++) {
              const { data: { session }, error: sessionError } = await supabase.auth.getSession();
              
              if (session) {
                return { session, error: null };
              }
              
              if (sessionError) {
                return { session: null, error: sessionError };
              }
              
              await new Promise(resolve => setTimeout(resolve, interval));
            }
            return { session: null, error: new Error('Session timeout after multiple attempts') };
          };

          const { session, error: sessionError } = await waitForSession();
            
          if (sessionError) {
            console.error('Error getting session:', sessionError);
            setStatus('error');
            setErrorMessage(sessionError.message);
            return;
          }

          if (session && session.user) {
            console.log('Authentication successful via hash:', session.user.email);
            setStatus('success');
            
            // Refresh auth context
            await checkAuth();
            
            // Redirect to admin dashboard if admin, otherwise to home
            const isAdmin = session.user.email === 'mwaleedtam2016@gmail.com' || session.user.email === 'admin@growgardenstore.com';
            const redirectTo = isAdmin ? '/admin/dashboard' : '/';
            
            setTimeout(() => {
              navigate(redirectTo, { replace: true });
            }, 2000);
          } else {
            setStatus('error');
            setErrorMessage('Session creation failed - please try again');
          }
        }
        
        // Fallback to code exchange if no hash tokens but we have a code
        else if (queryCode) {
          console.log('Processing OAuth callback with code:', queryCode);
          
          // Exchange code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(queryCode);
          
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            setStatus('error');
            setErrorMessage(exchangeError.message);
            return;
          }

          if (data.session && data.user) {
            console.log('Authentication successful via code exchange:', data.user.email);
            setStatus('success');
            
            // Refresh auth context
            await checkAuth();
            
            // Redirect to admin dashboard if admin, otherwise to home
            const isAdmin = data.user.email === 'mwaleedtam2016@gmail.com' || data.user.email === 'admin@growgardenstore.com';
            const redirectTo = isAdmin ? '/admin/dashboard' : '/';
            
            setTimeout(() => {
              navigate(redirectTo, { replace: true });
            }, 2000);
          } else {
            setStatus('error');
            setErrorMessage('No session or user data received');
          }
        } else {
          setStatus('error');
          setErrorMessage('No authorization code or access token received');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, checkAuth]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-12 h-12 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return t('auth.processing', 'Processing authentication...');
      case 'success':
        return t('auth.success', 'Authentication successful! Redirecting...');
      case 'error':
        return t('auth.error', 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          {getStatusIcon()}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {getStatusMessage()}
        </h1>
        
        {status === 'error' && (
          <div className="mb-6">
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {t('common.returnHome', 'Return to Home')}
            </button>
          </div>
        )}
        
        {status === 'loading' && (
          <p className="text-gray-600">
            {t('auth.pleaseWait', 'Please wait while we complete your sign-in...')}
          </p>
        )}
        
        {status === 'success' && (
          <p className="text-gray-600">
            {t('auth.redirecting', 'You will be redirected shortly...')}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
