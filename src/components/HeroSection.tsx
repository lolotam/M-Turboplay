import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, Shield, Sparkles, Gamepad2, Star, Zap } from "lucide-react";
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
    // Navigate to categories section
    const categoriesSection = document.querySelector('#categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/shop');
    }
  };

  return (
    <section id="home" className="hero-banner">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#A855F7]/10 rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#E935C1]/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#10B981]/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-40 right-1/4 w-20 h-20 bg-[#6B46C1]/10 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        {/* Trust Badge */}
        <div className="flex justify-center mb-8">
          <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30 px-6 py-3 text-sm font-semibold">
            <Shield className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span>
              {isRTL ? 'متجر ألعاب موثوق | أكثر من 10,000 لعبة رقمية' : 'Trusted Gaming Store | 10,000+ Digital Games'}
            </span>
          </Badge>
        </div>

        {/* Main Headline */}
        <h1 className="text-hero mb-6 font-bold" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
          {isRTL ? (
            <>
              <span className="block mb-4 text-white">
                احصل على أفضل الألعاب الرقمية
              </span>
              <span className="text-gradient">
                بأسعار لا تُقاوم
              </span>
            </>
          ) : (
            <>
              <span className="block mb-4 text-white">
                Get the Best Digital Games
              </span>
              <span className="text-gradient">
                at Unbeatable Prices
              </span>
            </>
          )}
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-[#C4B5FD] max-w-4xl mx-auto mb-6 leading-relaxed">
          {isRTL ? (
            'اكتشف أحدث الألعاب والمحتوى الرقمي لجميع المنصات - بلايستيشن، إكس بوكس، نينتندو، والحاسوب'
          ) : (
            'Discover the latest games and digital content for all platforms - PlayStation, Xbox, Nintendo, and PC'
          )}
        </p>

        {/* Secondary description */}
        <p className="text-lg text-[#9CA3AF] mb-12 max-w-2xl mx-auto">
          {isRTL ? (
            'توصيل فوري • أسعار منافسة • ضمان الجودة • دعم 24/7'
          ) : (
            'Instant Delivery • Competitive Prices • Quality Guarantee • 24/7 Support'
          )}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button
            className="btn-primary text-lg px-10 py-5 min-w-[220px] text-lg font-bold"
            onClick={handleShopNow}
          >
            <Gamepad2 className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            {isRTL ? 'تسوق الآن' : 'Shop Now'}
          </Button>

          <Button
            variant="outline"
            className="text-lg px-10 py-5 min-w-[220px] border-2 border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white"
            onClick={handleLearnMore}
          >
            {isRTL ? 'اعرف المزيد' : 'Learn More'}
            <ArrowDown className={`w-6 h-6 ${isRTL ? 'mr-3' : 'ml-3'}`} />
          </Button>
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="bg-[#1A1A2E]/80 border-[#A855F7]/30 text-center hover:shadow-purple-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6B46C1] to-[#A855F7] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-lg text-white">
                {isRTL ? 'توصيل فوري' : 'Instant Delivery'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-[#C4B5FD] text-sm">
                {isRTL ? 'احصل على ألعابك خلال دقائق' : 'Get your games within minutes'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A2E]/80 border-[#A855F7]/30 text-center hover:shadow-purple-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[#A855F7] to-[#E935C1] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-lg text-white">
                {isRTL ? 'دفع آمن' : 'Secure Payment'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-[#C4B5FD] text-sm">
                {isRTL ? 'طرق دفع آمنة ومشفرة بالكامل' : 'Fully encrypted secure payments'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A2E]/80 border-[#A855F7]/30 text-center hover:shadow-purple-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E935C1] to-[#10B981] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-lg text-white">
                {isRTL ? 'ألعاب أصلية' : 'Original Games'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-[#C4B5FD] text-sm">
                {isRTL ? 'جميع الألعاب أصلية ومرخصة' : 'All games are original and licensed'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A2E]/80 border-[#A855F7]/30 text-center hover:shadow-purple-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#6B46C1] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-lg text-white">
                {isRTL ? 'دعم 24/7' : '24/7 Support'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-[#C4B5FD] text-sm">
                {isRTL ? 'فريق دعم متخصص متواجد دائماً' : 'Expert support team always available'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-8 h-8 text-[#C4B5FD]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;