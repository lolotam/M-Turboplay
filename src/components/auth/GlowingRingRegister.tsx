import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import RegisterForm from '@/components/auth/RegisterForm';
import './GlowingRingRegister.css';

interface GlowingRingRegisterProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const GlowingRingRegister: React.FC<GlowingRingRegisterProps> = ({ 
  onSuccess, 
  redirectTo = '/login' 
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

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
      
      <div className="glowing-ring-register-container">
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
        <div className="register-ring-group">
          <div className="register-ring register-ring-1"></div>
          <div className="register-ring register-ring-2"></div>
          <div className="register-ring register-ring-3"></div>
        </div>

        {/* Register Form Container */}
        <div className="register-form-container">
          <RegisterForm onSuccess={onSuccess} redirectTo={redirectTo} />
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <p className="text-white/60 text-sm text-center">
            {isRTL
              ? '© 2025 متجر جروجارْدن. جميع الحقوق محفوظة.'
              : '© 2025 GrowGardenStore. All rights reserved.'
            }
          </p>
        </div>
      </div>
    </>
  );
};

export default GlowingRingRegister;
