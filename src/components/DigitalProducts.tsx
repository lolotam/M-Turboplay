import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Key,
  Monitor,
  Gift,
  MessageSquare,
  Trophy,
  Zap,
  ArrowRight
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const DigitalProducts = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const digitalProducts = [
    {
      id: 'ports',
      name: isRTL ? 'بيورتات' : 'Ports',
      nameEn: 'Ports',
      icon: <FileText className="w-6 h-6" />,
      description: isRTL ? 'منافذ الألعاب المخصصة' : 'Custom Game Ports',
      color: 'from-[#A855F7] to-[#E935C1]'
    },
    {
      id: 'windows-codes',
      name: isRTL ? 'أكواد ويندوز' : 'Windows Codes',
      nameEn: 'Windows Codes',
      icon: <Key className="w-6 h-6" />,
      description: isRTL ? 'تراخيص ويندوز الأصلية' : 'Original Windows Licenses',
      color: 'from-[#E935C1] to-[#10B981]'
    },
    {
      id: 'steam-games',
      name: isRTL ? 'ألعاب ستيم' : 'Steam Games',
      nameEn: 'Steam Games',
      icon: <Monitor className="w-6 h-6" />,
      description: isRTL ? 'ألعاب ستيم الرقمية' : 'Digital Steam Games',
      color: 'from-[#10B981] to-[#6B46C1]'
    },
    {
      id: 'steam-offers',
      name: isRTL ? 'ستيم أوفرات' : 'Steam Offers',
      nameEn: 'Steam Offers',
      icon: <Gift className="w-6 h-6" />,
      description: isRTL ? 'عروض ستيم الخاصة' : 'Special Steam Deals',
      color: 'from-[#6B46C1] to-[#A855F7]'
    },
    {
      id: 'discord-nitro',
      name: isRTL ? 'ديسكورد نيترو' : 'Discord Nitro',
      nameEn: 'Discord Nitro',
      icon: <MessageSquare className="w-6 h-6" />,
      description: isRTL ? 'اشتراك ديسكورد متميز' : 'Premium Discord Subscription',
      color: 'from-[#A855F7] to-[#E935C1]'
    },
    {
      id: 'fortnite-accounts',
      name: isRTL ? 'حسابات فورتنايت' : 'Fortnite Accounts',
      nameEn: 'Fortnite Accounts',
      icon: <Trophy className="w-6 h-6" />,
      description: isRTL ? 'حسابات فورتنايت جاهزة' : 'Ready Fortnite Accounts',
      color: 'from-[#E935C1] to-[#10B981]'
    },
    {
      id: 'boost-support',
      name: isRTL ? 'زيادة الدعم' : 'Boost Support',
      nameEn: 'Boost Support',
      icon: <Zap className="w-6 h-6" />,
      description: isRTL ? 'خدمات دعم الألعاب' : 'Game Support Services',
      color: 'from-[#10B981] to-[#6B46C1]'
    }
  ];

  const handleProductClick = (productId: string) => {
    navigate(`/shop?category=${productId}`);
  };

  return (
    <section id="digital-products" className="py-20 bg-gradient-to-b from-[#1A1A2E] to-[#0F0A1F]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30 px-4 py-2 mb-6">
            <Monitor className="w-4 h-4 mr-2" />
            {isRTL ? 'منتجات رقمية' : 'Digital Products'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
            {isRTL ? (
              <span className="bg-gradient-to-r from-[#10B981] via-[#6B46C1] to-[#A855F7] bg-clip-text text-transparent">
                منتجات رقمية
              </span>
            ) : (
              <span className="bg-gradient-to-r from-[#10B981] via-[#6B46C1] to-[#A855F7] bg-clip-text text-transparent">
                Digital Products
              </span>
            )}
          </h2>
          <p className="text-lg text-[#C4B5FD] max-w-3xl mx-auto">
            {isRTL ? (
              'اكتشف مجموعتنا الواسعة من المنتجات الرقمية للألعاب والبرامج'
            ) : (
              'Discover our extensive collection of digital products for games and software'
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-12">
          {digitalProducts.map((product, index) => (
            <Card
              key={product.id}
              className={`group relative overflow-hidden bg-gradient-to-br from-[#1A1A2E]/80 to-[#0F0A1F]/80 border border-[#A855F7]/20 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#A855F7]/50`}
              onClick={() => handleProductClick(product.id)}
              style={{
                animationDelay: `${index * 0.05}s`
              }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${product.color.split(' ')[0]?.replace('from-', '')} 0%, ${product.color.split(' ')[2]?.replace('to-', '')} 100%)`
                }}
              />
              
              <CardContent className="p-0 relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                  <div className="text-white">
                    {product.icon}
                  </div>
                </div>
                
                {/* Product Name */}
                <h3 className="text-sm font-bold text-white mb-2 text-center leading-tight">
                  {isRTL ? product.name : product.nameEn}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-[#C4B5FD] mb-3 text-center leading-relaxed">
                  {product.description}
                </p>

                {/* Arrow Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full bg-gradient-to-r ${product.color} hover:opacity-90 text-white border-0 group-hover:scale-105 transition-all duration-300 text-xs font-semibold py-2`}
                >
                  <ArrowRight className={`w-3 h-3 ${isRTL ? 'mr-1' : 'ml-1'}`} />
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
            onClick={() => navigate('/shop?category=digital')}
          >
            {isRTL ? 'عرض جميع المنتجات الرقمية' : 'View All Digital Products'}
            <Monitor className={`w-6 h-6 ${isRTL ? 'mr-3' : 'ml-3'}`} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DigitalProducts;