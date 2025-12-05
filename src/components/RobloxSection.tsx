import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Map,
  Home,
  Users,
  Star,
  ArrowRight,
  Gift,
  Zap,
  Shield
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const RobloxSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const robloxServices = [
    {
      id: 'roblox-accounts',
      name: isRTL ? 'حسابات روبلوكس' : 'Roblox Accounts',
      nameEn: 'Roblox Accounts',
      icon: <Users className="w-8 h-8" />,
      description: isRTL ? 'حسابات روبلوكس جاهزة مع عناصر نادرة' : 'Ready Roblox accounts with rare items',
      price: isRTL ? 'من 25 ر.س' : 'From 25 SAR',
      color: 'from-[#E935C1] to-[#10B981]',
      bgGradient: 'from-[#E935C1]/20 to-[#10B981]/20',
      borderColor: 'border-[#E935C1]/30',
      features: [
        isRTL ? 'عناصر نادرة' : 'Rare Items',
        isRTL ? 'توصيل فوري' : 'Instant Delivery',
        isRTL ? 'ضمان الأمان' : 'Security Guaranteed'
      ]
    },
    {
      id: 'roblox-maps',
      name: isRTL ? 'ماب روبلوكس' : 'Roblox Maps',
      nameEn: 'Roblox Maps',
      icon: <Map className="w-8 h-8" />,
      description: isRTL ? 'خرائط وألعاب مخصصة لروبلوكس' : 'Custom maps and games for Roblox',
      price: isRTL ? 'من 15 ر.س' : 'From 15 SAR',
      color: 'from-[#10B981] to-[#6B46C1]',
      bgGradient: 'from-[#10B981]/20 to-[#6B46C1]/20',
      borderColor: 'border-[#10B981]/30',
      features: [
        isRTL ? 'تصاميم احترافية' : 'Professional Designs',
        isRTL ? 'سهولة التركيب' : 'Easy Installation',
        isRTL ? 'دعم فني' : 'Technical Support'
      ]
    },
    {
      id: 'my-farm',
      name: isRTL ? 'ماي فارم' : 'My Farm',
      nameEn: 'My Farm',
      icon: <Home className="w-8 h-8" />,
      description: isRTL ? 'حسابات ماي فارم مخصصة' : 'Custom My Farm accounts',
      price: isRTL ? 'من 20 ر.س' : 'From 20 SAR',
      color: 'from-[#6B46C1] to-[#A855F7]',
      bgGradient: 'from-[#6B46C1]/20 to-[#A855F7]/20',
      borderColor: 'border-[#6B46C1]/30',
      features: [
        isRTL ? 'مزارع متطورة' : 'Advanced Farms',
        isRTL ? 'أرباح عالية' : 'High Profits',
        isRTL ? 'تحديثات دورية' : 'Regular Updates'
      ]
    },
    {
      id: 'robux-cards',
      name: isRTL ? 'بطاقات روبوكس' : 'Robux Cards',
      nameEn: 'Robux Cards',
      icon: <Gift className="w-8 h-8" />,
      description: isRTL ? 'بطاقات روبوكس الرقمية' : 'Digital Robux gift cards',
      price: isRTL ? 'من 10 ر.س' : 'From 10 SAR',
      color: 'from-[#A855F7] to-[#E935C1]',
      bgGradient: 'from-[#A855F7]/20 to-[#E935C1]/20',
      borderColor: 'border-[#A855F7]/30',
      features: [
        isRTL ? 'قيم مختلفة' : 'Various Values',
        isRTL ? 'توصيل فوري' : 'Instant Delivery',
        isRTL ? '100% أصلية' : '100% Original'
      ]
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    navigate(`/shop?category=roblox-${serviceId}`);
  };

  return (
    <section id="roblox-section" className="py-20 bg-gradient-to-b from-[#1A1A2E] via-[#0F0A1F] to-[#1A1A2E]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30 px-4 py-2 mb-6">
            <Gamepad2 className="w-4 h-4 mr-2" />
            {isRTL ? 'قسم روبلوكس' : 'Roblox Section'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
            {isRTL ? (
              <span className="bg-gradient-to-r from-[#10B981] via-[#6B46C1] to-[#A855F7] bg-clip-text text-transparent">
                قسم روبلوكس
              </span>
            ) : (
              <span className="bg-gradient-to-r from-[#10B981] via-[#6B46C1] to-[#A855F7] bg-clip-text text-transparent">
                Roblox Section
              </span>
            )}
          </h2>
          <p className="text-lg text-[#C4B5FD] max-w-3xl mx-auto">
            {isRTL ? (
              'اكتشف عالم روبلوكس مع حسابات مخصصة، خرائط، وبطاقات روبوكس. كل ما تحتاجه للعب أفضل تجربة'
            ) : (
              'Discover the world of Roblox with custom accounts, maps, and Robux cards. Everything you need for the best gaming experience'
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {robloxServices.map((service, index) => (
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
                  <Badge variant="secondary" className="text-xs bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30 mx-auto">
                    {service.price}
                  </Badge>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-xs text-[#C4B5FD]">
                      <Star className="w-3 h-3 text-[#10B981] flex-shrink-0" />
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
            className="bg-gradient-to-r from-[#10B981] to-[#6B46C1] hover:from-[#6B46C1] hover:to-[#10B981] text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-green-glow"
            onClick={() => navigate('/shop?category=roblox')}
          >
            {isRTL ? 'عرض جميع منتجات روبلوكس' : 'View All Roblox Products'}
            <Gamepad2 className={`w-6 h-6 ${isRTL ? 'mr-3' : 'ml-3'}`} />
          </Button>
        </div>

        {/* Special Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {isRTL ? 'توصيل فوري' : 'Instant Delivery'}
            </h4>
            <p className="text-[#C4B5FD] text-sm">
              {isRTL ? 'استلم منتجاتك فوراً' : 'Receive your products instantly'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#E935C1] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {isRTL ? 'ضمان الجودة' : 'Quality Guarantee'}
            </h4>
            <p className="text-[#C4B5FD] text-sm">
              {isRTL ? 'جميع المنتجات أصلية وموثوقة' : 'All products are original and trusted'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E935C1] to-[#10B981] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {isRTL ? 'دعم متخصص' : 'Expert Support'}
            </h4>
            <p className="text-[#C4B5FD] text-sm">
              {isRTL ? 'فريق دعم متخصص لروبلوكس' : 'Specialized Roblox support team'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RobloxSection;