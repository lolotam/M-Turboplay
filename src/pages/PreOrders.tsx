import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Star, TrendingUp, Gift } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useProducts } from "@/contexts/ProductsContext";
import { useCartActions } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";

const PreOrders = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addItem } = useCartActions();
  const { toast } = useToast();
  const { convertPrices } = useCurrency();
  const isRTL = i18n.language === 'ar';

  // Filter active products for pre-orders (in real app, this would be a specific category)
  const activeProducts = products.filter(product => product.status === 'active');
  const preorderProducts = activeProducts.slice(0, 12).map(p => ({
    ...p,
    isPreOrder: true,
    releaseDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    originalPrice: typeof p.price === 'number' ? p.price : 299,
    price: typeof p.price === 'number' ? p.price * 0.9 : 269
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
      isDigital: true,
      badge: isRTL ? 'طلب مسبق' : 'Pre-Order',
    });

    toast({
      title: t('messages.addedToCart'),
      description: t('messages.addedToCartDesc', { productName: isRTL ? product.title : product.titleEn }),
    });
  };

  const upcomingReleases = [
    {
      title: isRTL ? 'لعبة AAA القادمة' : 'Upcoming AAA Game',
      releaseDate: '2025-02-15',
      platform: 'PS5',
      image: '/placeholder.svg',
      hypeLevel: 'high'
    },
    {
      title: isRTL ? 'إصدار حصري' : 'Exclusive Release',
      releaseDate: '2025-03-01',
      platform: 'Xbox Series X',
      image: '/placeholder.svg',
      hypeLevel: 'medium'
    },
    {
      title: isRTL ? 'لعبة مغامرات' : 'Adventure Game',
      releaseDate: '2025-01-30',
      platform: 'Nintendo Switch',
      image: '/placeholder.svg',
      hypeLevel: 'high'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section for Pre-Orders */}
        <section className="relative py-20 bg-gradient-to-br from-[#6B46C1]/20 via-[#A855F7]/10 to-[#E935C1]/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30 px-4 py-2 mb-6">
                <Calendar className="w-4 h-4 mr-2" />
                {isRTL ? 'الطلب المسبق متاح' : 'Pre-Orders Available'}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
                {isRTL ? (
                  <>
                    <span className="block text-white mb-2">
                      احجز ألعابك
                    </span>
                    <span className="text-gradient">
                      قبل الإصدار
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block text-white mb-2">
                      Pre-Order Your
                    </span>
                    <span className="text-gradient">
                      Games Now
                    </span>
                  </>
                )}
              </h1>
              <p className="text-xl text-[#C4B5FD] max-w-3xl mx-auto leading-relaxed">
                {isRTL ? (
                  'احجز أحدث الألعاب قبل إصدارها واحصل على مكافآت حصرية وتخفيضات خاصة'
                ) : (
                  'Pre-order the latest games before release and get exclusive bonuses and special discounts'
                )}
              </p>
            </div>

            {/* Upcoming Releases Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {upcomingReleases.map((game, index) => (
                <Card key={index} className="bg-[#1A1A2E] border-[#A855F7]/30 hover:border-[#A855F7]/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="aspect-video bg-gradient-to-br from-[#6B46C1]/20 to-[#A855F7]/20 rounded-lg mb-4 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-[#A855F7]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{game.title}</h3>
                    <div className="flex items-center justify-center gap-2 text-[#C4B5FD] text-sm mb-3">
                      <span>{game.platform}</span>
                      <span>•</span>
                      <span>{new Date(game.releaseDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
                    </div>
                    <Badge className={`${game.hypeLevel === 'high' ? 'bg-[#E935C1]' : 'bg-[#F59E0B]'} text-white`}>
                      {game.hypeLevel === 'high' ? (isRTL ? 'مرتقب جداً' : 'Highly Anticipated') : (isRTL ? 'مرتقب' : 'Anticipated')}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pre-Order Benefits */}
        <section className="py-16 bg-gradient-to-r from-[#2D1B4E]/50 to-[#1A1A2E]/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                {isRTL ? 'لماذا تحجز مسبقاً؟' : 'Why Pre-Order?'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A855F7] to-[#E935C1] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {isRTL ? 'مكافآت حصرية' : 'Exclusive Bonuses'}
                </h3>
                <p className="text-[#C4B5FD]">
                  {isRTL ? 'احصل على محتوى إضافي ومكافآت خاصة مع الطلب المسبق' : 'Get additional content and special bonuses with pre-orders'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {isRTL ? 'أسعار مخفضة' : 'Discounted Prices'}
                </h3>
                <p className="text-[#C4B5FD]">
                  {isRTL ? 'وفر المزيد مع أسعار خاصة للطلب المسبق' : 'Save more with special pre-order pricing'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {isRTL ? 'توصيل فوري' : 'Instant Delivery'}
                </h3>
                <p className="text-[#C4B5FD]">
                  {isRTL ? 'احصل على اللعبة فور إصدارها بدون انتظار' : 'Get the game instantly on release day'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Pre-Orders */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                {isRTL ? 'الطلب المسبق متاح الآن' : 'Available for Pre-Order'}
              </h2>
              <p className="text-lg text-[#C4B5FD] max-w-2xl mx-auto">
                {isRTL ? (
                  'تصفح الألعاب المتوفرة للطلب المسبق واحجز نسختك قبل نفاذ الكمية'
                ) : (
                  'Browse games available for pre-order and reserve your copy before they sell out'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {preorderProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-[#1A1A2E] border-[#A855F7]/20 hover:border-[#A855F7]/50 transition-all duration-300 group"
                >
                  <CardContent className="p-4">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-[#6B46C1]/10 to-[#A855F7]/10 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.image}
                        alt={isRTL ? product.title : product.titleEn}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {/* Pre-Order Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-[#F59E0B] text-white text-xs px-2 py-1">
                          {isRTL ? 'طلب مسبق' : 'Pre-Order'}
                        </Badge>
                      </div>

                      {/* Release Date */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs text-center">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {isRTL ? 'إصدار:' : 'Release:'} {new Date(product.releaseDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                        </div>
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
                        <span className="text-xs text-[#C4B5FD]">4.8</span>
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
                        className="w-full bg-gradient-to-r from-[#A855F7] to-[#E935C1] hover:from-[#E935C1] hover:to-[#A855F7] text-white text-sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        {isRTL ? 'احجز الآن' : 'Pre-Order Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PreOrders;