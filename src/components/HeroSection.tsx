import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
      h1: isRTL ? "متجر الألعاب الأول لمنتجات الألعاب الرقمية" : "Premium Gaming Marketplace for Digital Products",
      h2: isRTL ? "تسليم فوري لأهم العناوين العالمية" : "Instant Delivery for Top Titles",
      h3: isRTL ? "منصة آمنة وموثوقة 100%" : "100% Secure & Trusted Platform",
      cta: isRTL ? "تواصل معنا عبر واتساب" : "Contact via WhatsApp"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1511512592900-4b5f480c00e45f30?q=80&w=2070&auto=format&fit=crop",
      h1: isRTL ? "خدمات رفع المستوى الاحترافية" : "Professional Rank Boosting Services",
      h2: isRTL ? "ارتقِ بمستواك بسرعة مع لاعبين خبراء" : "Level Up Fast with Expert Players",
      h3: isRTL ? "أسعار تنافسية وضمان الخصوصية" : "Competitive Rates & Privacy Guaranteed",
      cta: isRTL ? "اطلب الخدمة الآن" : "Order Service Now"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1612287671119-eb9319577152?q=80&w=2070&auto=format&fit=crop",
      h1: isRTL ? "عناصر روبلوكس حصرية وعملات" : "Exclusive Roblox Items & In-Game Currency",
      h2: isRTL ? "أفضل العروض على العملات داخل اللعبة" : "Best Deals on In-Game Currencies",
      h3: isRTL ? "معاملات آمنة وأكواد فورية" : "Safe Transactions & Instant Codes",
      cta: isRTL ? "اشترِ الآن" : "Buy Now"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/96566980961', '_blank');
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.h1}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full container mx-auto px-4 flex items-center">
            <div className={`max-w-2xl space-y-6 ${isRTL ? 'mr-0 ml-auto text-right' : 'ml-0 mr-auto text-left'}`}>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 backdrop-blur-sm text-purple-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <h3 className="text-sm md:text-base font-semibold uppercase tracking-wider">
                  {slide.h3}
                </h3>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                {slide.h1}
              </h1>
              
              <h2 className="text-2xl md:text-3xl text-gray-300 font-light">
                {slide.h2}
              </h2>

              <div className={`pt-8 flex flex-wrap gap-4 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <Button
                  size="lg"
                  onClick={handleWhatsAppClick}
                  className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <MessageCircle className="w-6 h-6" />
                  {slide.cta}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-purple-500 w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;