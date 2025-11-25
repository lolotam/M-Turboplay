import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import './GlowingRingLogin.css';

interface GlowingRingLoginProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const GlowingRingLogin: React.FC<GlowingRingLoginProps> = ({ 
  onSuccess, 
  redirectTo = '/admin/dashboard' 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loginWithGoogle } = useAuth();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        onSuccess?.();
        navigate(redirectTo);
      } else {
        setError(isRTL ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
      }
    } catch (err) {
      setError(isRTL ? 'حدث خطأ أثناء تسجيل الدخول' : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      // The redirect will be handled by the OAuth callback
    } catch (err) {
      setError(isRTL ? 'حدث خطأ أثناء تسجيل الدخول بجوجل' : 'An error occurred during Google login');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <>
      {/* Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600&display=swap" 
        rel="stylesheet" 
      />
      
      <div className="glowing-ring-container">
        {/* Back to Home Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-white/70 hover:text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <Home className="h-4 w-4" />
            {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
        </div>

        {/* Animated Rings */}
        <div className="ring-group">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{isRTL ? 'تسجيل الدخول' : 'Login'}</h2>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder={isRTL ? 'البريد الإلكتروني' : 'Email'}
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={isRTL ? 'كلمة المرور' : 'Password'}
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
            <span
              className="toggle-password"
              onClick={togglePassword}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  togglePassword();
                }
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <button 
            type="submit" 
            className="sign-in-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                {isRTL ? 'جاري تسجيل الدخول...' : 'Signing in...'}
              </>
            ) : (
              isRTL ? 'تسجيل الدخول' : 'Sign in'
            )}
          </button>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isRTL ? 'تسجيل الدخول بجوجل' : 'Continue with Google'}
          </button>

          <div className="links">
            <a href="#" onClick={(e) => { e.preventDefault(); /* Add forgot password logic */ }}>
              {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
              {isRTL ? 'إنشاء حساب' : 'Sign Up'}
            </a>
          </div>
        </form>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-sm text-white/60 z-10">
          <p>
            {isRTL
              ? '© 2025 متجر الألعاب. جميع الحقوق محفوظة.'
              : '© 2025 GamingStore. All rights reserved.'
            }
          </p>
        </div>
      </div>
    </>
  );
};

export default GlowingRingLogin;
