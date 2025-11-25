import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Loader2,
  Info
} from 'lucide-react';
import { emailService } from '@/services/emailService';

interface EmailSettings {
  serviceId: string;
  templateId: string;
  publicKey: string;
  adminEmail: string;
  enableUserRegistration: boolean;
  enableOrderNotifications: boolean;
  enableContactForm: boolean;
}

const EmailNotificationSettings: React.FC = () => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  
  const [settings, setSettings] = useState<EmailSettings>({
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
    adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'mwaleedtam2016@gmail.com',
    enableUserRegistration: true,
    enableOrderNotifications: true,
    enableContactForm: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleInputChange = (field: keyof EmailSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real application, these would be saved to a backend
    // For now, we'll just show a success message
    toast({
      title: isRTL ? 'تم حفظ الإعدادات' : 'Settings Saved',
      description: isRTL 
        ? 'تم حفظ إعدادات الإشعارات بنجاح' 
        : 'Email notification settings saved successfully',
    });
  };

  const handleTestEmail = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const success = await emailService.testEmailConfiguration();
      setTestResult(success ? 'success' : 'error');
      
      toast({
        title: success 
          ? (isRTL ? 'تم إرسال البريد التجريبي' : 'Test Email Sent')
          : (isRTL ? 'فشل في إرسال البريد' : 'Email Test Failed'),
        description: success
          ? (isRTL ? 'تحقق من بريدك الإلكتروني' : 'Check your email inbox')
          : (isRTL ? 'تحقق من إعدادات EmailJS' : 'Check your EmailJS configuration'),
        variant: success ? 'default' : 'destructive',
      });
    } catch (error) {
      setTestResult('error');
      toast({
        title: isRTL ? 'خطأ في الاختبار' : 'Test Error',
        description: isRTL ? 'حدث خطأ أثناء اختبار البريد الإلكتروني' : 'An error occurred while testing email',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isConfigured = settings.serviceId && settings.templateId && settings.publicKey && 
                      settings.publicKey !== 'your_public_key_here';

  return (
    <div className="space-y-6">
      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {isRTL ? 'حالة التكوين' : 'Configuration Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">
                  {isRTL ? 'تم تكوين البريد الإلكتروني' : 'Email Configured'}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-medium">
                  {isRTL ? 'لم يتم تكوين البريد الإلكتروني' : 'Email Not Configured'}
                </span>
              </>
            )}
          </div>
          
          {!isConfigured && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {isRTL 
                  ? 'لتفعيل الإشعارات عبر البريد الإلكتروني، يرجى إنشاء حساب على EmailJS وإدخال المعلومات المطلوبة.'
                  : 'To enable email notifications, please create an EmailJS account and enter the required configuration.'
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* EmailJS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {isRTL ? 'إعدادات EmailJS' : 'EmailJS Configuration'}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? 'قم بتكوين خدمة EmailJS لإرسال الإشعارات عبر البريد الإلكتروني'
              : 'Configure EmailJS service for sending email notifications'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceId">
                {isRTL ? 'معرف الخدمة' : 'Service ID'}
              </Label>
              <Input
                id="serviceId"
                value={settings.serviceId}
                onChange={(e) => handleInputChange('serviceId', e.target.value)}
                placeholder="service_xxxxxxx"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateId">
                {isRTL ? 'معرف القالب' : 'Template ID'}
              </Label>
              <Input
                id="templateId"
                value={settings.templateId}
                onChange={(e) => handleInputChange('templateId', e.target.value)}
                placeholder="template_xxxxxxx"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicKey">
              {isRTL ? 'المفتاح العام' : 'Public Key'}
            </Label>
            <Input
              id="publicKey"
              value={settings.publicKey}
              onChange={(e) => handleInputChange('publicKey', e.target.value)}
              placeholder="your_public_key_here"
              type="password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">
              {isRTL ? 'بريد المدير الإلكتروني' : 'Admin Email'}
            </Label>
            <Input
              id="adminEmail"
              value={settings.adminEmail}
              onChange={(e) => handleInputChange('adminEmail', e.target.value)}
              placeholder="admin@example.com"
              type="email"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? 'إعدادات الإشعارات' : 'Notification Settings'}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? 'اختر أنواع الإشعارات التي تريد تلقيها'
              : 'Choose which types of notifications you want to receive'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="userRegistration"
              checked={settings.enableUserRegistration}
              onCheckedChange={(checked) => 
                handleInputChange('enableUserRegistration', checked as boolean)
              }
            />
            <Label htmlFor="userRegistration" className="text-sm">
              {isRTL ? 'تسجيل المستخدمين الجدد' : 'New User Registrations'}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="orderNotifications"
              checked={settings.enableOrderNotifications}
              onCheckedChange={(checked) => 
                handleInputChange('enableOrderNotifications', checked as boolean)
              }
            />
            <Label htmlFor="orderNotifications" className="text-sm">
              {isRTL ? 'الطلبات الجديدة' : 'New Orders'}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="contactForm"
              checked={settings.enableContactForm}
              onCheckedChange={(checked) => 
                handleInputChange('enableContactForm', checked as boolean)
              }
            />
            <Label htmlFor="contactForm" className="text-sm">
              {isRTL ? 'نماذج الاتصال' : 'Contact Form Submissions'}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSaveSettings} className="flex-1">
          <Settings className="w-4 h-4 mr-2" />
          {isRTL ? 'حفظ الإعدادات' : 'Save Settings'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleTestEmail}
          disabled={!isConfigured || isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <TestTube className="w-4 h-4 mr-2" />
          )}
          {isRTL ? 'اختبار البريد الإلكتروني' : 'Test Email'}
        </Button>
      </div>

      {/* Test Result */}
      {testResult && (
        <Alert variant={testResult === 'success' ? 'default' : 'destructive'}>
          {testResult === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {testResult === 'success' 
              ? (isRTL ? 'تم إرسال البريد التجريبي بنجاح!' : 'Test email sent successfully!')
              : (isRTL ? 'فشل في إرسال البريد التجريبي' : 'Failed to send test email')
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EmailNotificationSettings;
