import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Mail, Gift, Bell, Heart, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  const interestOptions = [
    { id: 'offers', label: isRTL ? 'العروض الجديدة' : 'New Offers', icon: Gift },
    { id: 'animals', label: isRTL ? 'الحيوانات الجديدة' : 'New Animals/Pets', icon: Heart },
    { id: 'discounts', label: isRTL ? 'إعلانات الخصم' : 'Discount Announcements', icon: Sparkles },
  ];

  const handleInterestToggle = (interestId: string) => {
    setInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (interests.length === 0) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى اختيار اهتمام واحد على الأقل' : 'Please select at least one interest',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save subscription to localStorage (in production, this would be sent to your backend)
      const subscription = {
        id: Date.now().toString(),
        email,
        name,
        interests,
        subscribedAt: new Date().toISOString(),
        discountClaimed: false,
        discountCode: 'WELCOME10'
      };

      const existingSubscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
      
      // Check if email already exists
      const emailExists = existingSubscriptions.some((sub: any) => sub.email === email);
      
      if (emailExists) {
        toast({
          title: isRTL ? 'تم الاشتراك مسبقاً' : 'Already Subscribed',
          description: isRTL ? 'هذا البريد الإلكتروني مشترك بالفعل' : 'This email is already subscribed',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      existingSubscriptions.push(subscription);
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(existingSubscriptions));

      // Show success message with discount code
      toast({
        title: isRTL ? 'تم الاشتراك بنجاح!' : 'Successfully Subscribed!',
        description: isRTL
          ? 'سيتم إرسال كود الخصم إلى بريدك الإلكتروني في أقرب وقت ممكن. شكراً لاشتراكك!'
          : 'The discount code will be sent to your email as soon as possible. Thanks for your subscription!',
      });

      // Close popup after successful subscription
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الاشتراك' : 'An error occurred while subscribing',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto relative animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} z-10 h-8 w-8 p-0`}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          
          <CardTitle className="text-xl font-bold text-gradient">
            {isRTL ? 'اشترك في النشرة الإخبارية' : 'Subscribe to Newsletter'}
          </CardTitle>
          
          <p className="text-sm text-muted-foreground mt-2">
            {isRTL 
              ? 'احصل على آخر الأخبار والعروض الحصرية'
              : 'Get the latest news and exclusive offers'
            }
          </p>

          {/* Special Offer Badge */}
          <Badge className="bg-success text-success-foreground mt-3 mx-auto">
            <Gift className="w-4 h-4 mr-1" />
            {isRTL ? 'خصم 10% على أول طلب' : '10% off your first purchase'}
          </Badge>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {isRTL ? 'الاسم الكامل' : 'Full Name'} *
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                required
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {isRTL ? 'البريد الإلكتروني' : 'Email Address'} *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                required
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            {/* Interests Selection */}
            <div className="space-y-3">
              <Label>
                {isRTL ? 'اختر اهتماماتك:' : 'Select your interests:'} *
              </Label>
              <div className="space-y-2">
                {interestOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = interests.includes(option.id);
                  
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleInterestToggle(option.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{option.label}</span>
                      {isSelected && (
                        <div className={`ml-auto ${isRTL ? 'mr-auto ml-0' : ''}`}>
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full btn-hero"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  {isRTL ? 'جاري الاشتراك...' : 'Subscribing...'}
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  {isRTL ? 'اشترك واحصل على خصم 10%' : 'Subscribe & Get 10% Off'}
                </>
              )}
            </Button>

            {/* Privacy Notice */}
            <p className="text-xs text-muted-foreground text-center">
              {isRTL 
                ? 'نحن نحترم خصوصيتك ولن نشارك بياناتك مع أطراف ثالثة'
                : 'We respect your privacy and will never share your data with third parties'
              }
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterPopup;
