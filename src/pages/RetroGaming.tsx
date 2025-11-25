import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gamepad, Monitor, Tv, Smartphone, Star, Trophy, Clock, Users } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useProducts } from "@/contexts/ProductsContext";
import { useCartActions } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";

const RetroGaming = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addItem } = useCartActions();
  const { toast } = useToast();
  const { convertPrices } = useCurrency();
  const isRTL = i18n.language === 'ar';

  // Filter active products for retro gaming (in real app, this would be a specific category)
  const activeProducts = products.filter(product => product.status === 'active');
  const retroProducts = activeProducts.slice(0, 16).map(p => ({
    ...p,
    isRetro: true,
    originalPrice: typeof p.price === 'number' ? p.price : 199,
    price: typeof p.price === 'number' ? p.price * 0.8 : 159,
    condition: Math.random() > 0.5 ? 'new' : 'used'
  }));

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.title,
      titleEn: product.titleEn,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category as "guide" | "physical" | "consultation",
      isDigital: false,
      badge: isRTL ? 'كلاسيكي' : 'Classic',
    });

    toast({
      title: t('messages.addedToCart'),
      description: t('messages.addedToCartDesc', { productName: isRTL ? product.title : product.titleEn }),
    });
  };

  const retroConsoles = [
    {
      name: 'PlayStation 2',
      releaseYear: '2000',
      games: '2,000+',
      price: '299',
      image: '/placeholder.svg',
      description: isRTL ? 'أسطورة الألعاب الكلاسيكية' : 'Legendary classic gaming console'
    },
    {
      name: 'PlayStation 1',
      releaseYear: '1994',
      games: '1,200+',
      price: '199',
      image: '/placeholder.svg',
      description: isRTL ? 'بداية عصر الألعاب ثلاثية الأبعاد' : 'The beginning of 3D gaming era'
    },
    {
      name: 'Nintendo GameCube',
      releaseYear: '2001',
      games: '650+',
      price: '249',
      image: '/placeholder.svg',
      description: isRTL ? 'كونسول نينتندو المكعبي الأسطوري' : 'Nintendo\'s legendary cube console'
    },
    {
      name: 'Sega Dreamcast',
      releaseYear: '1998',
      games: '300+',
      price: '179',
      image: '/placeholder.svg',
      description: isRTL ? 'آخر كونسول سيجا في التاريخ' : 'Sega\'s final console in history'
    }
  ];

  const classicGames = [
    {
      title: isRTL ? 'فينال فانتسي VII' : 'Final Fantasy VII',
      platform: 'PS1',
      year: '1997',
      price: '89',
      rarity: 'rare'
    },
    {
      title: isRTL ? 'ميتال جير سوليد' : 'Metal Gear Solid',
      platform: 'PS1',
      year: '1998',
      price: '75',
      rarity: 'medium'
    },
    {
      title: isRTL ? 'سوبر ماريو 64' : 'Super Mario 64',
      platform: 'N64',
      year: '1996',
      price: '95',
      rarity: 'rare'
    },
    {
      title: isRTL ? 'ذا ليجند أوف زيلدا' : 'The Legend of Zelda',
      platform: 'NES',
      year: '1986',
      price: '120',
      rarity: 'legendary'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section for Retro Gaming */}
        <section className="relative py-20 bg-gradient-to-br from-[#8B5CF6]/20 via-[#A855F7]/10 to-[#6B46C1]/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30 px-4 py-2 mb-6">
                <Gamepad className="w-4 h-4 mr-2" />
                {isRTL ? 'ألعاب كلاسيكية' : 'Retro Gaming'}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
                {isRTL ? (
                  <>
                    <span className="block text-white mb-2">
                      عُد بالزمن إلى
                    </span>
                    <span className="text-gradient">
                      عصر الألعاب الكلاسيكية
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block text-white mb-2">
                      Go Back in Time to
                    </span>
                    <span className="text-gradient">
                      Classic Gaming Era
                    </span>
                  </>
                )}
              </h1>
              <p className="text-xl text-[#C4B5FD] max-w-3xl mx-auto leading-relaxed">
                {isRTL ? (
                  'اكتشف الألعاب والكونسولات الكلاسيكية التي شكلت تاريخ صناعة الألعاب'
                ) : (
                  'Discover classic games and consoles that shaped the history of gaming'
                )}
              </p>
            </div>

            {/* Retro Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#A855F7] mb-2">30+</div>
                <div className="text-white text-sm">
                  {isRTL ? 'سنة من الألعاب' : 'Years of Gaming'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E935C1] mb-2">500+</div>
                <div className="text-white text-sm">
                  {isRTL ? 'لعبة كلاسيكية' : 'Classic Games'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#10B981] mb-2">50+</div>
                <div className="text-white text-sm">
                  {isRTL ? 'كونسول قديم' : 'Retro Consoles'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#F59E0B] mb-2">10K+</div>
                <div className="text-white text-sm">
                  {isRTL ? 'لاعب متحمس' : 'Enthusiast Gamers'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Retro Gaming Categories */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="consoles" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-12 bg-[#1A1A2E] border border-[#A855F7]/30">
                <TabsTrigger value="consoles" className="data-[state=active]:bg-[#A855F7] data-[state=active]:text-white">
                  {isRTL ? 'الكونسولات الكلاسيكية' : 'Classic Consoles'}
                </TabsTrigger>
                <TabsTrigger value="games" className="data-[state=active]:bg-[#A855F7] data-[state=active]:text-white">
                  {isRTL ? 'الألعاب الكلاسيكية' : 'Classic Games'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="consoles">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {retroConsoles.map((console, index) => (
                    <Card key={index} className="bg-[#1A1A2E] border-[#A855F7]/30 hover:border-[#A855F7]/50 transition-all duration-300 group">
                      <CardHeader className="pb-4">
                        <div className="aspect-video bg-gradient-to-br from-[#6B46C1]/20 to-[#A855F7]/20 rounded-lg mb-4 flex items-center justify-center">
                          <Gamepad className="w-16 h-16 text-[#A855F7]" />
                        </div>
                        <CardTitle className="text-white text-center">
                          {console.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <p className="text-[#C4B5FD] text-sm">
                          {console.description}
                        </p>
                        <div className="space-y-2 text-sm text-[#9CA3AF]">
                          <p>{isRTL ? 'سنة الإصدار' : 'Release Year'}: {console.releaseYear}</p>
                          <p>{console.games} {isRTL ? 'لعبة متوفرة' : 'games available'}</p>
                        </div>
                        <div className="pt-2 border-t border-[#A855F7]/30">
                          <p className="text-2xl font-bold text-[#10B981] mb-3">
                            {console.price} {isRTL ? 'ر.س' : 'SAR'}
                          </p>
                          <Button
                            className="w-full bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#A855F7] text-white"
                            onClick={() => navigate('/product/retro-console-' + index)}
                          >
                            {isRTL ? 'عرض التفاصيل' : 'View Details'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="games">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {classicGames.map((game, index) => (
                    <Card key={index} className="bg-[#1A1A2E] border-[#A855F7]/30 hover:border-[#A855F7]/50 transition-all duration-300 group">
                      <CardContent className="p-6 text-center">
                        <div className="aspect-square bg-gradient-to-br from-[#8B5CF6]/20 to-[#A855F7]/20 rounded-lg mb-4 flex items-center justify-center">
                          <Trophy className="w-12 h-12 text-[#A855F7]" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{game.title}</h3>
                        <div className="space-y-1 text-sm text-[#C4B5FD] mb-4">
                          <p>{game.platform} • {game.year}</p>
                          <Badge className={`${
                            game.rarity === 'legendary' ? 'bg-[#E935C1]' :
                            game.rarity === 'rare' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                          } text-white text-xs`}>
                            {game.rarity === 'legendary' ? (isRTL ? 'أسطوري' : 'Legendary') :
                             game.rarity === 'rare' ? (isRTL ? 'نادر' : 'Rare') : (isRTL ? 'متوسط' : 'Common')}
                          </Badge>
                        </div>
                        <div className="pt-2 border-t border-[#A855F7]/30">
                          <p className="text-xl font-bold text-[#10B981] mb-3">
                            {game.price} {isRTL ? 'ر.س' : 'SAR'}
                          </p>
                          <Button
                            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#A855F7] hover:to-[#8B5CF6] text-white text-sm"
                            onClick={() => navigate('/product/classic-game-' + index)}
                          >
                            {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Retro Gaming Collection */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                {isRTL ? 'مجموعة الألعاب الكلاسيكية' : 'Classic Games Collection'}
              </h2>
              <p className="text-lg text-[#C4B5FD] max-w-2xl mx-auto">
                {isRTL ? (
                  'استكشف مجموعتنا المختارة بعناية من الألعاب الكلاسيكية النادرة والكونسولات التاريخية'
                ) : (
                  'Explore our carefully curated collection of rare classic games and historic consoles'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {retroProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-[#1A1A2E] border-[#A855F7]/20 hover:border-[#A855F7]/50 transition-all duration-300 group"
                >
                  <CardContent className="p-4">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-[#8B5CF6]/10 to-[#A855F7]/10 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.image}
                        alt={isRTL ? product.title : product.titleEn}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {/* Classic Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-[#8B5CF6] text-white text-xs px-2 py-1">
                          {isRTL ? 'كلاسيكي' : 'Classic'}
                        </Badge>
                      </div>

                      {/* Condition Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge className={`${product.condition === 'new' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'} text-white text-xs px-2 py-1`}>
                          {product.condition === 'new' ? (isRTL ? 'جديد' : 'New') : (isRTL ? 'مستعمل' : 'Used')}
                        </Badge>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-[#A855F7] transition-colors">
                        {isRTL ? product.title : product.titleEn}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-[#C4B5FD]">4.9</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#10B981]">
                          {product.price} {isRTL ? 'ر.س' : 'SAR'}
                        </span>
                        <span className="text-sm text-[#9CA3AF] line-through">
                          {product.originalPrice} {isRTL ? 'ر.س' : 'SAR'}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#A855F7] hover:to-[#8B5CF6] text-white text-sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Retro Gaming Community */}
        <section className="py-16 bg-gradient-to-r from-[#8B5CF6]/10 to-[#A855F7]/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {isRTL ? 'انضم إلى مجتمع اللاعبين الكلاسيكيين' : 'Join the Classic Gaming Community'}
            </h2>
            <p className="text-lg text-[#C4B5FD] mb-8 max-w-2xl mx-auto">
              {isRTL ? (
                'شارك قصصك وذكرياتك مع الألعاب الكلاسيكية وتواصل مع اللاعبين الآخرين'
              ) : (
                'Share your stories and memories of classic games and connect with other gamers'
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#A855F7] hover:to-[#8B5CF6] text-white"
                onClick={() => navigate('/community')}
              >
                <Users className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'انضم للمجتمع' : 'Join Community'}
              </Button>
              <Button
                variant="outline"
                className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
                onClick={() => navigate('/blog?category=retro')}
              >
                {isRTL ? 'اقرأ المزيد' : 'Read More'}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RetroGaming;