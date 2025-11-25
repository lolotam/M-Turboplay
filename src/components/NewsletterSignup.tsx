import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Gift, CheckCircle, Sparkles } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useToast } from "@/hooks/use-toast";

const NewsletterSignup = () => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      toast({
        title: isRTL ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!',
        description: isRTL ? 'شكراً لاشتراكك في نشرتنا البريدية' : 'Thank you for subscribing to our newsletter',
      });
    }, 1000);
  };

  const benefits = [
    {
      icon: <Gift className="w-5 h-5" />,
      text: isRTL ? 'خصم 10% على أول طلب' : '10% off your first order'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      text: isRTL ? 'أحدث عروض الألعاب أولاً' : 'Latest game deals first'
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: isRTL ? 'محتوى حصري ونصائح' : 'Exclusive content & tips'
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: isRTL ? 'إلغاء الاشتراك في أي وقت' : 'Unsubscribe anytime'
    }
  ];

  return (
    <section className="newsletter-section py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <div className="mb-12">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 mb-6">
              📧 {isRTL ? 'النشرة البريدية' : 'Newsletter'}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-baloo" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
              {isRTL ? (
                <>
                  <span className="block text-white mb-2">
                    احصل على أحدث
                  </span>
                  <span className="text-white">
                    عروض الألعاب
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-white mb-2">
                    Get the Latest
                  </span>
                  <span className="text-white">
                    Gaming Deals
                  </span>
                </>
              )}
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              {isRTL ? (
                'اشترك في نشرتنا البريدية واحصل على عروض حصرية وأحدث أخبار عالم الألعاب مباشرة في بريدك الإلكتروني'
              ) : (
                'Subscribe to our newsletter and get exclusive offers and the latest gaming news directly in your email'
              )}
            </p>
          </div>

          {/* Subscription Form */}
          {!isSubscribed ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    className="flex-1 px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-[#A855F7] to-[#E935C1] hover:from-[#E935C1] hover:to-[#A855F7] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-purple-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        {isRTL ? 'جاري الاشتراك...' : 'Subscribing...'}
                      </>
                    ) : (
                      <>
                        {isRTL ? 'اشترك الآن' : 'Subscribe Now'}
                        <Mail className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Privacy Note */}
              <p className="text-white/60 text-sm">
                {isRTL ? (
                  'نحن نحترم خصوصيتك. لن نشارك بريدك الإلكتروني مع أي طرف ثالث. يمكنك إلغاء الاشتراك في أي وقت.'
                ) : (
                  'We respect your privacy. We will never share your email with third parties. You can unsubscribe at any time.'
                )}
              </p>
            </div>
          ) : (
            /* Success State */
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <div className="w-20 h-20 bg-[#10B981] rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {isRTL ? 'تم الاشتراك بنجاح!' : 'Successfully Subscribed!'}
              </h3>
              <p className="text-white/80 mb-6">
                {isRTL ? (
                  'شكراً لاشتراكك في نشرتنا البريدية. ستتلقى أحدث العروض والأخبار قريباً.'
                ) : (
                  'Thank you for subscribing to our newsletter. You will receive the latest offers and news soon.'
                )}
              </p>
              <Button
                onClick={() => setIsSubscribed(false)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-[#6B46C1]"
              >
                {isRTL ? 'اشتراك آخر' : 'Subscribe Another Email'}
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/60">
                {isRTL ? 'مشترك نشط' : 'Active Subscribers'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">2x</div>
              <div className="text-white/60">
                {isRTL ? 'عروض أسبوعية' : 'Weekly Offers'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/60">
                {isRTL ? 'دعم متواصل' : 'Continuous Support'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;