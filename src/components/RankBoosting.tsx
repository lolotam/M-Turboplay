import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Zap,
  Star,
  Target,
  ArrowRight,
  TrendingUp,
  Shield,
  CheckCircle
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const RankBoosting = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const rankServices = [
    {
      id: 'valorant-boost',
      name: isRTL ? 'رفع رانك فالورانت' : 'Valorant Rank Boost',
      nameEn: 'Valorant Rank Boost',
      icon: <Target className="w-8 h-8" />,
      description: isRTL ? 'احترف من برونز إلى الماسة' : 'Climb from Bronze to Diamond',
      price: isRTL ? 'من 50 ر.س' : 'From 50 SAR',
      color: 'from-[#FF4654] to-[#FF6B6B]',
      bgGradient: 'from-[#FF4654]/20 to-[#FF6B6B]/20',
      borderColor: 'border-[#FF4654]/30',
      features: [
        isRTL ? 'توصيل سريع' : 'Fast Delivery',
        isRTL ? 'لاعبون محترفون' : 'Professional Players',
        isRTL ? 'ضمان الخصوصية' : 'Privacy Guaranteed'
      ]
    },
    {
      id: 'csgo-boost',
      name: isRTL ? 'رفع رانك سي إس جو' : 'CS:GO Rank Boost',
      nameEn: 'CS:GO Rank Boost',
      icon: <Trophy className="w-8 h-8" />,
      description: isRTL ? 'ارتفع في الرانك بسرعة وأمان' : 'Rank up quickly and safely',
      price: isRTL ? 'من 40 ر.س' : 'From 40 SAR',
      color: 'from-[#F39C12] to-[#F59E0B]',
      bgGradient: 'from-[#F39C12]/20 to-[#F59E0B]/20',
      borderColor: 'border-[#F39C12]/30',
      features: [
        isRTL ? 'لاعبون خبراء' : 'Experienced Players',
        isRTL ? 'تقدم مباشر' : 'Live Progress',
        isRTL ? 'دعم فوري' : 'Instant Support'
      ]
    },
    {
      id: 'lol-boost',
      name: isRTL ? 'رفع رانك ليج أوف ليجيندز' : 'LoL Rank Boost',
      nameEn: 'LoL Rank Boost',
      icon: <Star className="w-8 h-8" />,
      description: isRTL ? 'وصل إلى الشريك والماستر بسهولة' : 'Reach Challenger and Master easily',
      price: isRTL ? 'من 60 ر.س' : 'From 60 SAR',
      color: 'from-[#C89B3C] to-[#F0E68C]',
      bgGradient: 'from-[#C89B3C]/20 to-[#F0E68C]/20',
      borderColor: 'border-[#C89B3C]/30',
      features: [
        isRTL ? 'فريق محترف' : 'Pro Team',
        isRTL ? 'نتائج مضمونة' : 'Guaranteed Results',
        isRTL ? 'تتبع الرانك' : 'Rank Tracking'
      ]
    },
    {
      id: 'apex-boost',
      name: isRTL ? 'رفع رانك أبيكس ليجيندز' : 'Apex Legends Rank Boost',
      nameEn: 'Apex Legends Rank Boost',
      icon: <Zap className="w-8 h-8" />,
      description: isRTL ? 'كن بطلاً في أبيكس ليجيندز' : 'Become a legend in Apex Legends',
      price: isRTL ? 'من 45 ر.س' : 'From 45 SAR',
      color: 'from-[#A855F7] to-[#E935C1]',
      bgGradient: 'from-[#A855F7]/20 to-[#E935C1]/20',
      borderColor: 'border-[#A855F7]/30',
      features: [
        isRTL ? 'لاعبون أبطال' : 'Champion Players',
        isRTL ? 'تقدم سريع' : 'Fast Progress',
        isRTL ? 'أسعار تنافسية' : 'Competitive Prices'
      ]
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    navigate(`/shop?category=boost-${serviceId}`);
  };

  return (
    <section id="rank-boosting" className="py-20 bg-gradient-to-b from-[#0F0A1F] via-[#1A1A2E] to-[#0F0A1F]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#E935C1]/20 text-[#E935C1] border-[#E935C1]/30 px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            {isRTL ? 'قسم رفع الرانك' : 'Rank Boosting Section'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
            {isRTL ? (
              <span className="bg-gradient-to-r from-[#E935C1] via-[#A855F7] to-[#10B981] bg-clip-text text-transparent">
                قسم رفع الرانك
              </span>
            ) : (
              <span className="bg-gradient-to-r from-[#E935C1] via-[#A855F7] to-[#10B981] bg-clip-text text-transparent">
                Rank Boosting Section
              </span>
            )}
          </h2>
          <p className="text-lg text-[#C4B5FD] max-w-3xl mx-auto">
            {isRTL ? (
              'احترف في ألعابك المفضلة مع فريق من اللاعبين المحترفين. نقدم خدمات رفع الرانك لأشهر الألعاب التنافسية'
            ) : (
              'Level up your favorite games with our team of professional players. We offer rank boosting services for the most popular competitive games'
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {rankServices.map((service, index) => (
            <Card
              key={service.id}
              className={`group relative overflow-hidden bg-gradient-to-br ${service.bgGradient} ${service.borderColor} border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              onClick={() => handleServiceClick(service.id)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${service.color.split(' ')[0]?.replace('from-', '')} 0%, ${service.color.split(' ')[2]?.replace('to-', '')} 100%)`
                }}
              />
              
              <CardContent className="p-0 relative z-10">
                {/* Icon Container */}
                <div className="mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 text-center">
                    {isRTL ? service.name : service.nameEn}
                  </h3>
                  <p className="text-[#C4B5FD] text-sm mb-3 text-center leading-relaxed">
                    {service.description}
                  </p>
                  <Badge variant="secondary" className="text-xs bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30 mx-auto">
                    {service.price}
                  </Badge>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-xs text-[#C4B5FD]">
                      <CheckCircle className="w-3 h-3 text-[#10B981] flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white border-0 group-hover:scale-105 transition-all duration-300 font-semibold`}
                >
                  {isRTL ? 'اطلب الخدمة' : 'Order Service'}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#E935C1] to-[#A855F7] hover:from-[#A855F7] hover:to-[#E935C1] text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-purple-glow"
            onClick={() => navigate('/shop?category=boosting')}
          >
            {isRTL ? 'عرض جميع خدمات رفع الرانك' : 'View All Rank Boosting Services'}
            <TrendingUp className={`w-6 h-6 ${isRTL ? 'mr-3' : 'ml-3'}`} />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {isRTL ? 'آمن وموثوق' : 'Safe & Trusted'}
            </h4>
            <p className="text-[#C4B5FD] text-sm">
              {isRTL ? 'جميع الخدمات آمنة وموثوقة' : 'All services are safe and trusted'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#E935C1] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {isRTL ? 'توصيل فوري' : 'Instant Delivery'}
            </h4>
            <p className="text-[#C4B5FD] text-sm">
              {isRTL ? 'ابدأ فوراً بعد الدفع' : 'Start immediately after payment'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E935C1] to-[#10B981] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {isRTL ? 'لاعبون محترفون' : 'Pro Players'}
            </h4>
            <p className="text-[#C4B5FD] text-sm">
              {isRTL ? 'فريق من اللاعبين الخبراء' : 'Team of experienced players'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RankBoosting;