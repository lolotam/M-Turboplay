import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play, Shield, Star, Zap, TrendingUp, ArrowRight, MessageCircle, Gamepad2, CheckCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const HeroCarousel = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // SEO-optimized slide data
  const slides = [
    {
      id: 1,
      h1: isRTL ? 'أحدث الألعاب الرقمية' : 'Latest Digital Games',
      h2: isRTL ? 'مجموعة الألعاب الحصرية' : 'Exclusive Game Collection',
      h3: isRTL ? 'وفر خاصة للمحترفين' : 'Special Offer for Professionals',
      description: isRTL 
        ? 'احصل على أحدث الألعاب الرقمية بأسعار تنافسية. مجموعة محدودة من الألعاب الحصرية متاحة الآن.'
        : 'Get the latest digital games at competitive prices. Limited collection of exclusive games available now.',
      image: 'https://images.unsplash.com/photo-1511512592900-4b5f480c00e45f30?w=800&q=80',
      features: [
        { icon: <Shield className="w-5 h-5" />, text: isRTL ? 'ألعاب أصلية' : 'Original Games' },
        { icon: <Zap className="w-5 h-5" />, text: isRTL ? 'توصيل فوري' : 'Instant Delivery' },
        { icon: <Star className="w-5 h-5" />, text: isRTL ? 'تقييم عالي' : 'High Rated' }
      ],
      price: isRTL ? 'بدأ من 199 ر.س' : 'Starting from 199 SAR',
      ctaText: isRTL ? 'استكشف العروض' : 'Discover Offers'
    },
    {
      id: 2,
      h1: isRTL ? 'ارفع مستواك في الألعاب' : 'Level Up Your Gaming',
      h2: isRTL ? 'خدمات رفع الرانك الاحترافية' : 'Professional Rank Boosting',
      h3: isRTL ? 'لاعبون خبراء ينتظرونك' : 'Expert Players Waiting for You',
      description: isRTL
        ? 'انضم إلى النخبة مع خدمات رفع الرانك الاحترافية. فريق من اللاعبين الخبراء جاهز لرفع مستواك في أسرع وقت.'
        : 'Join the elite with professional rank boosting services. Our team of expert players is ready to level you up in record time.',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
      features: [
        { icon: <TrendingUp className="w-5 h-5" />, text: isRTL ? 'تقدم سريع' : 'Fast Progress' },
        { icon: <Shield className="w-5 h-5" />, text: isRTL ? 'خصوصية تامة' : 'Complete Privacy' },
        { icon: <Gamepad2 className="w-5 h-5" />, text: isRTL ? 'لاعبون محترفون' : 'Pro Players' }
      ],
      price: isRTL ? 'خدمات تبدأ من 50 ر.س' : 'Services from 50 SAR',
      ctaText: isRTL ? 'ارتفع الآن' : 'Level Up Now'
    },
    {
      id: 3,
      h1: isRTL ? 'عروض الأسبوع المميزة' : 'Weekly Special Offers',
      h2: isRTL ? 'تخفيضات تصل إلى 70%' : 'Discounts Up to 70%',
      h3: isRTL ? 'عروض محدودة الوقت' : 'Limited Time Offers',
      description: isRTL
        ? 'لا تفوت فرص العروض الأسبوعية! خصومات حصرية على أحدث الألعاب والخدمات لفترة محدودة.'
        : "Don't miss out on weekly special offers! Exclusive discounts on the latest games and services for a limited time.",
      image: 'https://images.unsplash.com/photo-1612287230217-969a43c4266d?w=800&q=80',
      features: [
        { icon: <Star className="w-5 h-5" />, text: isRTL ? 'توفير كبير' : 'Big Savings' },
        { icon: <Zap className="w-5 h-5" />, text: isRTL ? 'عروض حصرية' : 'Exclusive Deals' },
        { icon: <Shield className="w-5 h-5" />, text: isRTL ? 'ضمان الجودة' : 'Quality Guaranteed' }
      ],
      price: isRTL ? 'وفر تصل إلى 80% خصم' : 'Save up to 80%',
      ctaText: isRTL ? 'اطلب العرض' : 'Claim Offer'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleWhatsAppCTA = () => {
    window.open('https://wa.me/96566980961', '_blank');
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0F0A1F] via-[#1A1A2E] to-[#0F0A1F] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#A855F7]/10 rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#E935C1]/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#10B981]/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-40 right-1/4 w-20 h-20 bg-[#6B46C1]/10 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-[#A855F7] scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Side - Slide Content */}
          <div className={`${isRTL ? 'order-2' : 'order-1'} relative`}>
            <div className="relative">
              {/* Slide Image */}
              <div className="relative mb-8 rounded-2xl overflow-hidden bg-gray-800 min-h-[24rem]">
                <img
                  key={currentSlideData.image}
                  src={currentSlideData.image}
                  alt={currentSlideData.h1}
                  className="w-full h-96 object-cover animate-fadeIn"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* H1 - SEO Optimized */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
                  {currentSlideData.h1}
                </h1>

                {/* H2 - SEO Optimized */}
                <h2 className="text-2xl md:text-3xl font-bold text-[#A855F7] mb-4 leading-tight">
                  {currentSlideData.h2}
                </h2>

                {/* H3 - SEO Optimized */}
                <h3 className="text-xl md:text-2xl font-semibold text-[#E935C1] mb-6 leading-tight">
                  {currentSlideData.h3}
                </h3>

                {/* Description */}
                <p className="text-lg text-[#C4B5FD] mb-8 leading-relaxed">
                  {currentSlideData.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {currentSlideData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-white">
                      <div className="text-[#10B981]">
                        {feature.icon}
                      </div>
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="inline-block">
                    <span className="text-3xl font-bold text-white">{currentSlideData.price}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#A855F7] to-[#E935C1] hover:from-[#E935C1] hover:to-[#A855F7] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                  onClick={handleWhatsAppCTA}
                >
                  {currentSlideData.ctaText}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Static Content */}
          <div className={`${isRTL ? 'order-1' : 'order-2'} text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
            {/* Trust Badge */}
            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mb-8`}>
              <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30 px-6 py-3 text-sm font-semibold">
                <Shield className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span>
                  {isRTL ? 'متجر ألعاب موثوق | أكثر من 10,000 لعبة رقمية' : 'Trusted Gaming Store | 10,000+ Digital Games'}
                </span>
              </Badge>
            </div>

            {/* Static Content */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#1A1A2E]/80 to-[#0F0A1F]/80 rounded-3xl p-8 border border-[#A855F7]/30">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {isRTL ? 'لماذا تختار M-TurboPlay؟' : 'Why Choose M-TurboPlay?'}
                </h3>
                <ul className="space-y-4 text-[#C4B5FD]">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-1" />
                    <span>{isRTL ? 'ألعاب أصلية 100%' : '100% Original Games'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-1" />
                    <span>{isRTL ? 'توصيل فوري خلال دقائق' : 'Instant Delivery Within Minutes'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-1" />
                    <span>{isRTL ? 'دعم فني 24/7' : '24/7 Technical Support'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-1" />
                    <span>{isRTL ? 'أسعار تنافسية' : 'Competitive Prices'}</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  className="border-2 border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                  onClick={() => navigate('/shop')}
                >
                  {isRTL ? 'تسوق الآن' : 'Shop Now'}
                  <Gamepad2 className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;