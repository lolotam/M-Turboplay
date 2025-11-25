import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * OAuth Callback Component
 * This component handles the OAuth callback from Google
 * It should be rendered at the /auth/callback route
 */
const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuth, isLoading } = useAuth();

  useEffect(() => {
    // Check authentication status when component mounts
    const handleCallback = async () => {
      try {
        await checkAuth();

        // Redirect to admin dashboard after successful authentication
        navigate('/admin/dashboard');
      } catch (error) {
        console.error('OAuth callback error:', error);
        // Redirect to login page if authentication fails
        navigate('/admin/login');
      }
    };

    handleCallback();
  }, [checkAuth, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Completing Google authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">
          Redirecting...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
