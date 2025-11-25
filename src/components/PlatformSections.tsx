import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Gamepad2, Tv, Smartphone, ArrowRight, Star, ShoppingCart } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useProducts } from "@/contexts/ProductsContext";

const PlatformSections = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { products } = useProducts();
  const isRTL = i18n.language === 'ar';

  const platforms = [
    {
      id: 'playstation',
      name: isRTL ? 'بلايستيشن' : 'PlayStation',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'from-[#006FCD] to-[#012169]',
      bgColor: 'bg-[#006FCD]/10',
      borderColor: 'border-[#006FCD]/30',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/PlayStation-Logo.png',
      productCount: 8,
      featured: true
    },
    {
      id: 'xbox',
      name: isRTL ? 'إكس بوكس' : 'Xbox',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'from-[#107C10] to-[#0B6623]',
      bgColor: 'bg-[#107C10]/10',
      borderColor: 'border-[#107C10]/30',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Xbox-Logo.png',
      productCount: 6,
      featured: false
    },
    {
      id: 'pc',
      name: isRTL ? 'العاب الكمبيوتر' : 'PC Gaming',
      icon: <Monitor className="w-8 h-8" />,
      color: 'from-[#1B2838] to-[#2A475E]',
      bgColor: 'bg-[#1B2838]/10',
      borderColor: 'border-[#1B2838]/30',
      logo: 'https://logos-world.net/wp-content/uploads/2020/08/Steam-Logo.png',
      productCount: 10,
      featured: false
    },
    {
      id: 'nintendo',
      name: isRTL ? 'نينتندو' : 'Nintendo',
      icon: <Tv className="w-8 h-8" />,
      color: 'from-[#E60012] to-[#B3000C]',
      bgColor: 'bg-[#E60012]/10',
      borderColor: 'border-[#E60012]/30',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Nintendo-Logo.png',
      productCount: 4,
      featured: false
    }
  ];

  // Get sample products for each platform
  const getPlatformProducts = (platformId: string) => {
    return products
      .filter(product => product.status === 'active')
      .slice(0, 6)
      .map(p => ({
        id: p.id,
        title: p.title,
        titleEn: p.titleEn,
        price: typeof p.price === 'number' ? p.price : 299,
        image: p.image,
        category: p.category as "guide" | "physical" | "consultation",
        rating: 4.8,
        isNew: p.isNew
      }));
  };

  const handlePlatformClick = (platformId: string) => {
    switch (platformId) {
      case 'playstation':
        navigate('/playstation-games');
        break;
      case 'xbox':
        navigate('/xbox-games');
        break;
      case 'pc':
        navigate('/pc-games');
        break;
      case 'nintendo':
        navigate('/nintendo-games');
        break;
      default:
        navigate(`/shop?platform=${platformId}`);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30 px-4 py-2 mb-6">
            🎮 {isRTL ? 'الألعاب حسب المنصة' : 'Games by Platform'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-baloo" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
            {isRTL ? (
              <>
                <span className="block text-white mb-2">
                  اكتشف الألعاب المتوفرة على
                </span>
                <span className="text-gradient">
                  جميع المنصات
                </span>
              </>
            ) : (
              <>
                <span className="block text-white mb-2">
                  Discover Games Available on
                </span>
                <span className="text-gradient">
                  All Platforms
                </span>
              </>
            )}
          </h2>
        </div>

        {/* Platform Sections */}
        <div className="space-y-20">
          {platforms.map((platform, index) => {
            const platformProducts = getPlatformProducts(platform.id);

            return (
              <div
                key={platform.id}
                className={`platform-section ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Platform Info */}
                  <div className={`text-center ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="flex items-center justify-center mb-6">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center mr-4`}>
                        <div className="text-white">
                          {platform.icon}
                        </div>
                      </div>
                      <div className="text-right">
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {platform.name}
                        </h3>
                        <Badge className={`${platform.bgColor} ${platform.borderColor} text-white`}>
                          {platformProducts.length} {isRTL ? 'لعبة متوفرة' : 'games available'}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-[#C4B5FD] text-lg mb-8 leading-relaxed">
                      {isRTL ? (
                        platform.id === 'playstation' ? 'أحدث ألعاب PS5 و PS4 مع محتوى حصري وتجربة لعب استثنائية' :
                        platform.id === 'xbox' ? 'ألعاب Xbox Series X/S و Xbox One مع Game Pass والمحتوى الحصري' :
                        platform.id === 'pc' ? 'أفضل ألعاب الكمبيوتر على Steam و Epic Games بأسعار منافسة' :
                        'ألعاب Nintendo Switch الممتعة والعائلية لجميع الأعمار'
                      ) : (
                        platform.id === 'playstation' ? 'Latest PS5 & PS4 games with exclusive content and exceptional gaming experience' :
                        platform.id === 'xbox' ? 'Xbox Series X/S & Xbox One games with Game Pass and exclusive content' :
                        platform.id === 'pc' ? 'Best PC games on Steam & Epic Games at competitive prices' :
                        'Fun family Nintendo Switch games for all ages'
                      )}
                    </p>

                    <Button
                      className="bg-gradient-to-r from-[#A855F7] to-[#E935C1] hover:from-[#E935C1] hover:to-[#A855F7] text-white px-8 py-4 rounded-xl font-bold"
                      onClick={() => handlePlatformClick(platform.id)}
                    >
                      {isRTL ? 'تصفح ألعاب' : 'Browse Games'}
                      {platform.name}
                      <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </Button>
                  </div>

                  {/* Platform Products */}
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {platformProducts.slice(0, 6).map((product) => (
                        <Card
                          key={product.id}
                          className="bg-[#1A1A2E] border-[#A855F7]/20 hover:border-[#A855F7]/50 transition-all duration-300 group cursor-pointer"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <CardContent className="p-3">
                            {/* Product Image */}
                            <div className="aspect-square bg-gradient-to-br from-[#6B46C1]/10 to-[#A855F7]/10 rounded-lg mb-3 overflow-hidden relative">
                              <img
                                src={product.image}
                                alt={isRTL ? product.title : product.titleEn}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />

                              {/* Rating Badge */}
                              <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current text-yellow-400" />
                                {product.rating}
                              </div>

                              {/* New Badge */}
                              {product.isNew && (
                                <div className="absolute top-2 left-2 bg-[#10B981] text-white px-2 py-1 rounded text-xs">
                                  {isRTL ? 'جديد' : 'New'}
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                              {isRTL ? product.title : product.titleEn}
                            </h4>

                            <div className="flex items-center justify-between">
                              <span className="text-[#10B981] font-bold">
                                {product.price} {isRTL ? 'ر.س' : 'SAR'}
                              </span>
                              <Button
                                size="sm"
                                className="bg-[#A855F7] hover:bg-[#6B46C1] text-white p-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle add to cart
                                }}
                              >
                                <ShoppingCart className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformSections;