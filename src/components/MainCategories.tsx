import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Cpu,
  Key,
  Gamepad2,
  ArrowRight
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const MainCategories = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const categories = [
    {
      id: 'collections',
      name: isRTL ? 'تجميعات' : 'Collections',
      nameEn: 'Collections',
      icon: <Package className="w-8 h-8" />,
      description: isRTL ? 'مجموعات الألعاب المميزة' : 'Featured Game Collections',
      color: 'from-[#A855F7] to-[#E935C1]',
      bgGradient: 'from-[#A855F7]/10 to-[#E935C1]/10',
      borderColor: 'border-[#A855F7]/30',
      productCount: '500+'
    },
    {
      id: 'accessories',
      name: isRTL ? 'ملحقات البي سي' : 'PC Accessories',
      nameEn: 'PC Accessories',
      icon: <Cpu className="w-8 h-8" />,
      description: isRTL ? 'إكسسوارات الكمبيوتر والأجهزة' : 'Computer Parts & Accessories',
      color: 'from-[#E935C1] to-[#10B981]',
      bgGradient: 'from-[#E935C1]/10 to-[#10B981]/10',
      borderColor: 'border-[#E935C1]/30',
      productCount: '300+'
    },
    {
      id: 'codes',
      name: isRTL ? 'أكواد' : 'Codes',
      nameEn: 'Codes',
      icon: <Key className="w-8 h-8" />,
      description: isRTL ? 'أكواد تفعيل الألعاب' : 'Game Activation Codes',
      color: 'from-[#10B981] to-[#6B46C1]',
      bgGradient: 'from-[#10B981]/10 to-[#6B46C1]/10',
      borderColor: 'border-[#10B981]/30',
      productCount: '1000+'
    },
    {
      id: 'games',
      name: isRTL ? 'ألعاب' : 'Games',
      nameEn: 'Games',
      icon: <Gamepad2 className="w-8 h-8" />,
      description: isRTL ? 'أحدث الألعاب لجميع المنصات' : 'Latest Games for All Platforms',
      color: 'from-[#6B46C1] to-[#A855F7]',
      bgGradient: 'from-[#6B46C1]/10 to-[#A855F7]/10',
      borderColor: 'border-[#6B46C1]/30',
      productCount: '2000+'
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    switch (categoryId) {
      case 'collections':
        navigate('/shop?category=collections');
        break;
      case 'accessories':
        navigate('/game-accessories');
        break;
      case 'codes':
        navigate('/shop?category=codes');
        break;
      case 'games':
        navigate('/shop');
        break;
      default:
        navigate(`/shop?category=${categoryId}`);
    }
  };

  return (
    <section id="main-categories" className="py-20 bg-gradient-to-b from-[#0F0A1F] to-[#1A1A2E]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30 px-4 py-2 mb-6">
            <Package className="w-4 h-4 mr-2" />
            {isRTL ? 'الفئات الرئيسية' : 'Main Categories'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
            {isRTL ? (
              <>
                <span className="block text-white mb-2">
                  اكتشف جميع فئات
                </span>
                <span className="bg-gradient-to-r from-[#A855F7] via-[#E935C1] to-[#10B981] bg-clip-text text-transparent">
                  الألعاب والمنتجات
                </span>
              </>
            ) : (
              <>
                <span className="block text-white mb-2">
                  Discover All Gaming
                </span>
                <span className="bg-gradient-to-r from-[#A855F7] via-[#E935C1] to-[#10B981] bg-clip-text text-transparent">
                  Categories & Products
                </span>
              </>
            )}
          </h2>
          <p className="text-lg text-[#C4B5FD] max-w-3xl mx-auto">
            {isRTL ? (
              'استكشف مجموعتنا الواسعة من الألعاب الرقمية، الإكسسوارات، الأكواد والمزيد'
            ) : (
              'Explore our extensive collection of digital games, accessories, codes and more'
            )}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className={`group relative overflow-hidden bg-gradient-to-br ${category.bgGradient} ${category.borderColor} border rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              onClick={() => handleCategoryClick(category.id)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${category.color.split(' ')[0]?.replace('from-', '')} 0%, ${category.color.split(' ')[2]?.replace('to-', '')} 100%)`
                }}
              />
              
              <CardContent className="p-0 relative z-10">
                {/* Icon Container */}
                <div className="mb-6">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 text-center">
                    {isRTL ? category.name : category.nameEn}
                  </h3>
                  <p className="text-[#C4B5FD] text-sm mb-4 text-center leading-relaxed">
                    {category.description}
                  </p>
                  <Badge variant="secondary" className="text-xs bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30 mx-auto">
                    {category.productCount} {isRTL ? 'منتج' : 'products'}
                  </Badge>
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90 text-white border-0 group-hover:scale-105 transition-all duration-300 font-semibold`}
                >
                  {isRTL ? 'استكشف الفئة' : 'Explore Category'}
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
            className="bg-gradient-to-r from-[#A855F7] to-[#E935C1] hover:from-[#E935C1] hover:to-[#A855F7] text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-purple-glow"
            onClick={() => navigate('/shop')}
          >
            {isRTL ? 'عرض جميع المنتجات' : 'View All Products'}
            <Package className={`w-6 h-6 ${isRTL ? 'mr-3' : 'ml-3'}`} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MainCategories;