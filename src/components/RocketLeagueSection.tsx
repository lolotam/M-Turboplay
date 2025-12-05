import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  Trophy,
  Star,
  Users,
  ArrowRight,
  Zap,
  Shield,
  CheckCircle
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const RocketLeagueSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const rocketLeagueServices = [
    {
      id: 'rocket-league-accounts',
      name: isRTL ? 'حسابات روكيت ليق' : 'Rocket League Accounts',
      nameEn: 'Rocket League Accounts',
      icon: <Users className="w-8 h-8" />,
      description: isRTL ? 'حسابات روكيت ليق جاهزة مع عناصر نادرة' : 'Ready Rocket League accounts with rare items',
      price: isRTL ? 'من 35 ر.س' : 'From 35 SAR',
      originalPrice: isRTL ? '50 ر.س' : '50 SAR',
      discount: '30%',
      color: 'from-[#1E40AF] to-[#3B82F6]',
      bgGradient: 'from-[#1E40AF]/20 to-[#3B82F6]/20',
      borderColor: 'border-[#1E40AF]/30',
      features: [
        isRTL ? 'عناصر نادرة' : 'Rare Items',
        isRTL ? 'رانك عالي' : 'High Rank',
        isRTL ? 'توصيل فوري' : 'Instant Delivery'
      ],
      badge: isRTL ? 'الأكثر مبيعاً' : 'Bestseller'
    },
    {
      id: 'rocket-league-boost',
      name: isRTL ? 'رفع رانك روكيت ليق' : 'Rocket League Rank Boost',
      nameEn: 'Rocket League Rank Boost',
      icon: <Trophy className="w-8 h-8" />,
      description: isRTL ? 'ارتفع في رانك روكيت ليق بسرعة وأمان' : 'Rank up quickly and safely in Rocket League',
      price: isRTL ? 'من 40 ر.س' : 'From 40 SAR',
      color: 'from-[#10B981] to-[#059669]',
      bgGradient: 'from-[#10B981]/20 to-[#059669]/20',
      borderColor: 'border-[#10B981]/30',
      features: [
        isRTL ? 'لاعبون محترفون' : 'Professional Players',
        isRTL ? 'تقدم مباشر' : 'Live Progress',
        isRTL ? 'نتائج مضمونة' : 'Guaranteed Results'
      ],
      badge: isRTL ? 'خدمة مميزة' : 'Premium Service'
    },
    {
      id: 'rocket-league-items',
      name: isRTL ? 'عناصر روكيت ليق' : 'Rocket League Items',
      nameEn: 'Rocket League Items',
      icon: <Star className="w-8 h-8" />,
      description: isRTL ? 'عناصر وسيارات روكيت ليق نادرة' : 'Rare Rocket League items and cars',
      price: isRTL ? 'من 15 ر.س' : 'From 15 SAR',
      color: 'from-[#F59E0B] to-[#D97706]',
      bgGradient: 'from-[#F59E0B]/20 to-[#D97706]/20',
      borderColor: 'border-[#F59E0B]/30',
      features: [
        isRTL ? 'عناصر حصرية' : 'Exclusive Items',
        isRTL ? 'أسعار منافسة' : 'Competitive Prices',
        isRTL ? 'تحديثات دورية' : 'Regular Updates'
      ]
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    navigate(`/shop?category=rocket-league-${serviceId}`);
  };

  return (
    <section id="rocket-league-section" className="py-20 bg-gradient-to-b from-[#0F0A1F] via-[#1A1A2E] to-[#0F0A1F]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#1E40AF]/20 text-[#1E40AF] border-[#1E40AF]/30 px-4 py-2 mb-6">
            <Car className="w-4 h-4 mr-2" />
            {isRTL ? 'قسم روكيت ليق' : 'Rocket League Section'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
            {isRTL ? (
              <span className="bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#10B981] bg-clip-text text-transparent">
                قسم روكيت ليق
              </span>
            ) : (
              <span className="bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#10B981] bg-clip-text text-transparent">
                Rocket League Section
              </span>
            )}
          </h2>
          <p className="text-lg text-[#C4B5FD] max-w-3xl mx-auto">
            {isRTL ? (
              'اكتشف أفضل حسابات وخدمات روكيت ليق. عناصر نادرة، رفع الرانك، وحسابات جاهزة للعب'
            ) : (
              'Discover the best Rocket League accounts and services. Rare items, rank boosting, and ready-to-play accounts'
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {rocketLeagueServices.map((service, index) => (
            <Card
              key={service.id}
              className={`group relative overflow-hidden bg-gradient-to-br ${service.bgGradient} ${service.borderColor} border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              onClick={() => handleServiceClick(service.id)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Badge for special items */}
              {service.badge && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-[#E935C1] text-white text-xs px-2 py-1">
                    {service.badge}
                  </Badge>
                </div>
              )}

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${service.color.split(' ')[0].replace('from-', '')} 0%, ${service.color.split(' ')[2].replace('to-', '')} 100%)`
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
                  <h3 className="text-lg font-bold text-white mb-2 text-center">
                    {isRTL ? service.name : service.nameEn}
                  </h3>
                  <p className="text-[#C4B5FD] text-sm mb-3 text-center leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {service.originalPrice && (
                      <span className="text-sm text-[#9CA3AF] line-through">
                        {service.originalPrice}
                      </span>
                    )}
                    <span className="text-xl font-bold text-white">
                      {service.price}
                    </span>
                    {service.discount && (
                      <Badge variant="secondary" className="text-xs bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30">
                        {service.discount}
                      </Badge>
                    )}
                  </div>
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
            className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#1E40AF] text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-glow"
            onClick={() => navigate('/shop?category=rocket-league')}
          >
            {isRTL ? 'عرض جميع منتجات روكيت ليق' : 'View All Rocket League Products'}
            <Car className={`w-6 h-6 ${isRTL ? 'mr-3' : 'ml-3'}`} />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {isRTL ? 'حسابات موثوقة' : 'Trusted Accounts'}
            </h4>
            <p className="text-[#C4B5FD] text-sm">
              {isRTL ? 'جميع الحسابات أصلية وموثوقة' : 'All accounts are original and trusted'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {isRTL ? 'توصيل سريع' : 'Fast Delivery'}
            </h4>
            <p className="text-[#C4B5FD] text-sm">
              {isRTL ? 'استلم حسابك فوراً' : 'Get your account instantly'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {isRTL ? 'عناصر نادرة' : 'Rare Items'}
            </h4>
            <p className="text-[#C4B5FD] text-sm">
              {isRTL ? 'عناصر حصرية ومميزة' : 'Exclusive and special items'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RocketLeagueSection;