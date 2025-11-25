import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, UserPlus, Eye, EyeOff, Calendar, AtSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { emailService } from '@/services/emailService';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, redirectTo = '/login' }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.username.trim()) {
      setError(isRTL ? 'اسم المستخدم مطلوب' : 'Username is required');
      setIsLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError(isRTL ? 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' : 'Username must be at least 3 characters');
      setIsLoading(false);
      return;
    }

    if (!formData.dateOfBirth) {
      setError(isRTL ? 'تاريخ الميلاد مطلوب' : 'Date of birth is required');
      setIsLoading(false);
      return;
    }

    // Check if user is at least 13 years old
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      setError(isRTL ? 'يجب أن تكون 13 سنة على الأقل للتسجيل' : 'You must be at least 13 years old to register');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Try Supabase registration first
      if (supabase) {
        const { data, error: supabaseError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              username: formData.username,
              date_of_birth: formData.dateOfBirth,
            },
          },
        });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (data.user) {
          setSuccess(
            isRTL 
              ? 'تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب.'
              : 'Account created successfully! Check your email to confirm your account.'
          );
          
          // Send notification email to admin (this would be handled by backend in production)
          await sendAdminNotification(formData.name, formData.email);
          
          setTimeout(() => {
            onSuccess?.();
            navigate(redirectTo);
          }, 2000);
          return;
        }
      }

      // Fallback to mock registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage for demo purposes
      const userData = {
        id: `user-${Date.now()}`,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      existingUsers.push(userData);
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));

      setSuccess(
        isRTL 
          ? 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.'
          : 'Account created successfully! You can now sign in.'
      );

      setTimeout(() => {
        onSuccess?.();
        navigate(redirectTo);
      }, 2000);

    } catch (err: any) {
      setError(err.message || (isRTL ? 'حدث خطأ أثناء إنشاء الحساب' : 'An error occurred during registration'));
    } finally {
      setIsLoading(false);
    }
  };

  const sendAdminNotification = async (name: string, email: string) => {
    try {
      // Store notification for admin dashboard
      const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
      notifications.push({
        id: `notif-${Date.now()}`,
        type: 'new_user',
        title: isRTL ? 'مستخدم جديد' : 'New User Registration',
        message: isRTL
          ? `مستخدم جديد ${name} قام بالتسجيل بالبريد الإلكتروني ${email}`
          : `New user ${name} registered with email ${email}`,
        timestamp: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem('admin_notifications', JSON.stringify(notifications));

      // Send email notification to admin
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'mwaleedtam2016@gmail.com';
      const emailSent = await emailService.sendUserRegistrationNotification({
        userName: name,
        userEmail: email,
        registrationDate: new Date().toLocaleDateString('ar-SA'),
        adminEmail: adminEmail
      });

      if (emailSent) {
        console.log('Admin email notification sent successfully');
      } else {
        console.log('Email notification failed, but registration completed');
      }
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't fail registration if notification fails
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setError('');
      await loginWithGoogle();
      // The AuthContext will handle the redirect after successful Google login
      onSuccess?.();
      navigate('/');
    } catch (error: any) {
      setError(error.message || (isRTL ? 'حدث خطأ أثناء تسجيل الدخول بـ Google' : 'An error occurred during Google sign up'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {isRTL ? 'إنشاء حساب جديد' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {isRTL 
            ? 'قم بإنشاء حساب جديد للوصول إلى المتجر' 
            : 'Create a new account to access the store'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              {isRTL ? 'الاسم الكامل' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              {isRTL ? 'اسم المستخدم' : 'Username'}
            </label>
            <div className="relative">
              <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أدخل اسم المستخدم' : 'Enter your username'}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {isRTL ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="dateOfBirth" className="text-sm font-medium">
              {isRTL ? 'تاريخ الميلاد' : 'Date of Birth'}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="pl-10"
                required
                disabled={isLoading}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {isRTL ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                className="pl-10 pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                className="pl-10 pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRTL ? 'جاري إنشاء الحساب...' : 'Creating account...'}
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                {isRTL ? 'إنشاء حساب' : 'Create Account'}
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {isRTL ? 'أو' : 'Or'}
            </span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
          {isRTL ? 'التسجيل باستخدام Google' : 'Sign up with Google'}
        </Button>

        <div className="text-center text-sm text-muted-foreground mt-6">
          {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => navigate('/login')}
          >
            {isRTL ? 'تسجيل الدخول' : 'Sign in'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
