import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Gamepad2,
  Smartphone,
  Tv,
  Zap,
  CreditCard,
  Calendar,
  Gamepad,
  Headphones,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const GameCategories = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const categories = [
    {
      id: 'playstation',
      name: isRTL ? 'بلايستيشن' : 'PlayStation',
      nameEn: 'PlayStation',
      icon: <Gamepad2 className="w-12 h-12" />,
      description: isRTL ? 'ألعاب PS4 و PS5 الحصرية' : 'Exclusive PS4 & PS5 titles',
      color: 'from-[#006FCD] to-[#012169]',
      bgGradient: 'from-[#006FCD]/20 to-[#012169]/20',
      borderColor: 'border-[#006FCD]/30',
      productCount: '2,500+',
      seoKeyword: 'العاب بلايستيشن'
    },
    {
      id: 'xbox',
      name: isRTL ? 'إكس بوكس' : 'Xbox',
      nameEn: 'Xbox',
      icon: <Gamepad2 className="w-12 h-12" />,
      description: isRTL ? 'ألعاب Xbox و Game Pass' : 'Xbox games & Game Pass',
      color: 'from-[#107C10] to-[#0B6623]',
      bgGradient: 'from-[#107C10]/20 to-[#0B6623]/20',
      borderColor: 'border-[#107C10]/30',
      productCount: '1,800+',
      seoKeyword: 'العاب Xbox'
    },
    {
      id: 'nintendo',
      name: isRTL ? 'نينتندو' : 'Nintendo',
      nameEn: 'Nintendo',
      icon: <Tv className="w-12 h-12" />,
      description: isRTL ? 'ألعاب Nintendo Switch' : 'Nintendo Switch games',
      color: 'from-[#E60012] to-[#B3000C]',
      bgGradient: 'from-[#E60012]/20 to-[#B3000C]/20',
      borderColor: 'border-[#E60012]/30',
      productCount: '1,200+',
      seoKeyword: 'العاب Nintendo Switch'
    },
    {
      id: 'pc',
      name: isRTL ? 'العاب الكمبيوتر' : 'PC Gaming',
      nameEn: 'PC Gaming',
      icon: <Monitor className="w-12 h-12" />,
      description: isRTL ? 'ألعاب Steam و Epic Games' : 'Steam & Epic Games',
      color: 'from-[#1B2838] to-[#2A475E]',
      bgGradient: 'from-[#1B2838]/20 to-[#2A475E]/20',
      borderColor: 'border-[#1B2838]/30',
      productCount: '5,000+',
      seoKeyword: 'العاب الكمبيوتر'
    },
    {
      id: 'accessories',
      name: isRTL ? 'إكسسوارات الألعاب' : 'Gaming Accessories',
      nameEn: 'Gaming Accessories',
      icon: <Headphones className="w-12 h-12" />,
      description: isRTL ? 'يد تحكم وسماعات وكيبورد' : 'Controllers, headsets & keyboards',
      color: 'from-[#6B46C1] to-[#A855F7]',
      bgGradient: 'from-[#6B46C1]/20 to-[#A855F7]/20',
      borderColor: 'border-[#6B46C1]/30',
      productCount: '800+',
      seoKeyword: 'إكسسوارات الألعاب'
    },
    {
      id: 'giftcards',
      name: isRTL ? 'بطاقات رقمية' : 'Digital Gift Cards',
      nameEn: 'Digital Gift Cards',
      icon: <CreditCard className="w-12 h-12" />,
      description: isRTL ? 'بطاقات PSN و Xbox Live' : 'PSN & Xbox Live cards',
      color: 'from-[#10B981] to-[#059669]',
      bgGradient: 'from-[#10B981]/20 to-[#059669]/20',
      borderColor: 'border-[#10B981]/30',
      productCount: '150+',
      seoKeyword: 'بطاقات الألعاب الرقمية'
    },
    {
      id: 'preorders',
      name: isRTL ? 'الطلب المسبق' : 'Pre-Orders',
      nameEn: 'Pre-Orders',
      icon: <Calendar className="w-12 h-12" />,
      description: isRTL ? 'الألعاب القادمة قريباً' : 'Upcoming releases',
      color: 'from-[#F59E0B] to-[#D97706]',
      bgGradient: 'from-[#F59E0B]/20 to-[#D97706]/20',
      borderColor: 'border-[#F59E0B]/30',
      productCount: '50+',
      seoKeyword: 'الطلب المسبق للألعاب'
    },
    {
      id: 'retro',
      name: isRTL ? 'ألعاب كلاسيكية' : 'Retro Gaming',
      nameEn: 'Retro Gaming',
      icon: <Gamepad className="w-12 h-12" />,
      description: isRTL ? 'ألعاب وكونسولات قديمة' : 'Classic games & consoles',
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      bgGradient: 'from-[#8B5CF6]/20 to-[#7C3AED]/20',
      borderColor: 'border-[#8B5CF6]/30',
      productCount: '300+',
      seoKeyword: 'ألعاب كلاسيكية'
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    switch (categoryId) {
      case 'playstation':
        navigate('/playstation-games');
        break;
      case 'xbox':
        navigate('/xbox-games');
        break;
      case 'nintendo':
        navigate('/nintendo-games');
        break;
      case 'pc':
        navigate('/pc-games');
        break;
      case 'accessories':
        navigate('/game-accessories');
        break;
      case 'giftcards':
        navigate('/gift-cards');
        break;
      case 'preorders':
        navigate('/pre-orders');
        break;
      case 'retro':
        navigate('/retro-gaming');
        break;
      default:
        navigate(`/shop?category=${categoryId}`);
    }
  };

  return (
    <section id="categories-section" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30 px-4 py-2 mb-6">
            <ShoppingBag className="w-4 h-4 mr-2" />
            {isRTL ? 'تسوق حسب الفئة' : 'Shop by Category'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-baloo" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
            {isRTL ? (
              <>
                <span className="block text-white mb-2">
                  اكتشف جميع فئات
                </span>
                <span className="text-gradient">
                  الألعاب والإكسسوارات
                </span>
              </>
            ) : (
              <>
                <span className="block text-white mb-2">
                  Discover All Gaming
                </span>
                <span className="text-gradient">
                  Categories & Accessories
                </span>
              </>
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {isRTL ? (
              'استكشف مجموعتنا الواسعة من الألعاب الرقمية، الإكسسوارات، البطاقات الرقمية والمزيد'
            ) : (
              'Explore our extensive collection of digital games, accessories, gift cards and more'
            )}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="category-grid">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`category-card bg-gradient-to-br ${category.bgGradient} ${category.borderColor} text-center cursor-pointer group`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-6 h-full flex flex-col justify-between">
                {/* Icon Container */}
                <div className="mb-6">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {isRTL ? category.name : category.nameEn}
                  </h3>
                  <p className="text-[#C4B5FD] text-sm mb-3">
                    {category.description}
                  </p>
                  <Badge variant="secondary" className="text-xs bg-[#A855F7]/20 text-[#A855F7]">
                    {category.productCount} {isRTL ? 'منتج' : 'products'}
                  </Badge>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full bg-gradient-to-r from-[#A855F7] to-[#E935C1] hover:from-[#E935C1] hover:to-[#A855F7] text-white border-0 group-hover:scale-105 transition-all duration-300"
                >
                  {isRTL ? 'استكشف الفئة' : 'Explore Category'}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#6B46C1] to-[#A855F7] hover:from-[#A855F7] hover:to-[#6B46C1] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-purple-glow"
            onClick={() => navigate('/shop')}
          >
            {isRTL ? 'عرض جميع المنتجات' : 'View All Products'}
            <ShoppingBag className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GameCategories;