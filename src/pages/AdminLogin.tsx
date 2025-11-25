import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import GlowingRingLogin from '@/components/auth/GlowingRingLogin';

const AdminLogin = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLoginSuccess = () => {
    toast({
      title: isRTL ? "تم تسجيل الدخول بنجاح" : "Login Successful",
      description: isRTL ? "مرحباً بك في لوحة التحكم" : "Welcome to the admin dashboard",
    });
  };

  const redirectTo = location.state?.from?.pathname || '/admin/dashboard';

  return (
    <GlowingRingLogin
      onSuccess={handleLoginSuccess}
      redirectTo={redirectTo}
    />
  );
};

export default AdminLogin;