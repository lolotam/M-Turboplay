import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Sparkles, Monitor, Star, Zap, CheckCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const handleShopNow = () => {
    navigate('/shop');
  };

  const handleLearnMore = () => {
    const categoriesSection = document.querySelector('#categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/shop');
    }
  };

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-[#0F0A1F] via-[#1A1A2E] to-[#0F0A1F] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#A855F7]/10 rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#E935C1]/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#10B981]/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-40 right-1/4 w-20 h-20 bg-[#6B46C1]/10 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Side - Gaming PC Illustration */}
          <div className={`${isRTL ? 'order-2' : 'order-1'} relative`}>
            <div className="relative">
              {/* Gaming PC Illustration */}
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0A1F] rounded-3xl p-8 border border-[#A855F7]/30 shadow-2xl">
                  <div className="flex items-center justify-center mb-6">
                    <Monitor className="w-32 h-32 text-[#A855F7]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#A855F7]/20 rounded-xl p-4 border border-[#A855F7]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-[#10B981]" />
                        <span className="text-white font-semibold">{isRTL ? 'ألعاب أصلية' : 'Original Games'}</span>
                      </div>
                      <p className="text-[#C4B5FD] text-sm">{isRTL ? 'مرخصة بالكامل' : 'Fully Licensed'}</p>
                    </div>
                    <div className="bg-[#E935C1]/20 rounded-xl p-4 border border-[#E935C1]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-[#E935C1]" />
                        <span className="text-white font-semibold">{isRTL ? 'توصيل فوري' : 'Instant Delivery'}</span>
                      </div>
                      <p className="text-[#C4B5FD] text-sm">{isRTL ? 'خلال دقائق' : 'Within Minutes'}</p>
                    </div>
                    <div className="bg-[#10B981]/20 rounded-xl p-4 border border-[#10B981]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-[#10B981]" />
                        <span className="text-white font-semibold">{isRTL ? 'دفع آمن' : 'Secure Payment'}</span>
                      </div>
                      <p className="text-[#C4B5FD] text-sm">{isRTL ? 'مشفرة 100%' : '100% Encrypted'}</p>
                    </div>
                    <div className="bg-[#6B46C1]/20 rounded-xl p-4 border border-[#6B46C1]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-[#6B46C1]" />
                        <span className="text-white font-semibold">{isRTL ? 'دعم 24/7' : '24/7 Support'}</span>
                      </div>
                      <p className="text-[#C4B5FD] text-sm">{isRTL ? 'فريق متخصص' : 'Expert Team'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glow effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#A855F7]/20 to-[#E935C1]/20 rounded-3xl blur-xl -z-10"></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className={`${isRTL ? 'order-1' : 'order-2'} text-center lg:text-${isRTL ? 'right' : 'left'}`}>
            {/* Trust Badge */}
            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mb-8`}>
              <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30 px-6 py-3 text-sm font-semibold">
                <Shield className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span>
                  {isRTL ? 'متجر ألعاب موثوق | أكثر من 10,000 لعبة رقمية' : 'Trusted Gaming Store | 10,000+ Digital Games'}
                </span>
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
              {isRTL ? (
                <>
                  <span className="block mb-4 text-white">
                    احصل على أفضل الألعاب الرقمية
                  </span>
                  <span className="bg-gradient-to-r from-[#A855F7] via-[#E935C1] to-[#10B981] bg-clip-text text-transparent">
                    بأسعار لا تُقاوم
                  </span>
                </>
              ) : (
                <>
                  <span className="block mb-4 text-white">
                    Get Best Digital Games
                  </span>
                  <span className="bg-gradient-to-r from-[#A855F7] via-[#E935C1] to-[#10B981] bg-clip-text text-transparent">
                    at Unbeatable Prices
                  </span>
                </>
              )}
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-[#C4B5FD] mb-8 leading-relaxed">
              {isRTL ? (
                'اكتشف أحدث الألعاب والمحتوى الرقمي لجميع المنصات - بلايستيشن، إكس بوكس، نينتندو، والحاسوب'
              ) : (
                'Discover latest games and digital content for all platforms - PlayStation, Xbox, Nintendo, and PC'
              )}
            </p>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-[#1A1A2E]/80 to-[#0F0A1F]/80 border-[#A855F7]/30 p-6 hover:shadow-purple-glow transition-all duration-300">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-white mb-2">{isRTL ? 'الباقة الأساسية' : 'Basic Pack'}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-[#A855F7]">29</span>
                    <span className="text-[#C4B5FD]">{isRTL ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#C4B5FD]">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      {isRTL ? '5 ألعاب شهرياً' : '5 Games Monthly'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      {isRTL ? 'دعم أساسي' : 'Basic Support'}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#A855F7]/20 to-[#E935C1]/20 border-[#E935C1]/50 p-6 hover:shadow-purple-glow transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[#E935C1] text-white text-xs">{isRTL ? 'الأكثر مبيعاً' : 'Bestseller'}</Badge>
                </div>
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-white mb-2">{isRTL ? 'الباقة المميزة' : 'Premium Pack'}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-[#E935C1]">59</span>
                    <span className="text-[#C4B5FD]">{isRTL ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#C4B5FD]">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      {isRTL ? 'ألعاب غير محدودة' : 'Unlimited Games'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      {isRTL ? 'دعم متميز 24/7' : 'Premium 24/7 Support'}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                className="bg-gradient-to-r from-[#A855F7] to-[#E935C1] hover:from-[#E935C1] hover:to-[#A855F7] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                onClick={handleShopNow}
              >
                {isRTL ? 'تسوق الآن' : 'Shop Now'}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>

              <Button
                variant="outline"
                className="border-2 border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                onClick={handleLearnMore}
              >
                {isRTL ? 'اعرف المزيد' : 'Learn More'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;