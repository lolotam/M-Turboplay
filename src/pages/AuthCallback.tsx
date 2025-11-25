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
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus('error');
          setErrorMessage(errorDescription || error);
          return;
        }

        if (code) {
          console.log('Processing OAuth callback with code:', code);
          
          // Exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            setStatus('error');
            setErrorMessage(exchangeError.message);
            return;
          }

          if (data.session && data.user) {
            console.log('Authentication successful:', data.user.email);
            setStatus('success');
            
            // Refresh auth context
            await checkAuth();
            
            // Redirect to admin dashboard if admin, otherwise to home
            const isAdmin = data.user.email === 'admin@growgardenstore.com';
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
          setErrorMessage('No authorization code received');
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
