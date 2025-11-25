import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, CreditCard, Smartphone, Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';

const GiftCards = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const giftCardFeatures = [
    {
      icon: <Gift className="w-8 h-8" />,
      title: isRTL ? 'الهدية المثالية' : 'Perfect Gift',
      description: isRTL ? 'أفضل هدية لعشاق الألعاب' : 'The best gift for gaming enthusiasts'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: isRTL ? 'دفع آمن' : 'Secure Payment',
      description: isRTL ? 'طرق دفع آمنة ومضمونة' : 'Safe and guaranteed payment methods'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: isRTL ? 'توصيل فوري' : 'Instant Delivery',
      description: isRTL ? 'استلام فوري عبر البريد الإلكتروني' : 'Instant delivery via email'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: isRTL ? 'متوافق عالمياً' : 'Globally Compatible',
      description: isRTL ? 'يعمل على جميع المنصات والمتاجر' : 'Works on all platforms and stores'}
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-pink-500/10 via-background to-purple-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-pink-500/20 text-pink-600 border-pink-500/30">
              <Gift className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'بطاقات الهدايا' : 'Gift Cards'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'بطاقات الهدايا' : 'Gift Cards'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'أفضل الهدايا لعشاق الألعاب - بطاقات هدايا رقمية لجميع المنصات والمتاجر العالمية'
                : 'The best gifts for gaming enthusiasts - digital gift cards for all platforms and global stores'
              }
            </p>
          </div>
        </section>

        {/* Gift Card Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات بطاقات الهدايا' : 'Gift Cards Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {giftCardFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gift Cards Grid */}
        <ProductGrid />

        {/* Gift Card Types */}
        <section className="py-16 bg-warning/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'أنواع بطاقات الهدايا' : 'Gift Card Types'}
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🎮</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'ستيم' : 'Steam'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'ألعاب الحاسوب الرقمية' : 'Digital PC games'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🕹️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'بلايستيشن' : 'PlayStation'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'متجر بلايستيشن الرسمي' : 'Official PlayStation Store'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🎮</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'إكس بوكس' : 'Xbox'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'متجر إكس بوكس و Game Pass' : 'Xbox Store and Game Pass'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'نينتندو' : 'Nintendo'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'متجر نينتندو eShop' : 'Nintendo eShop Store'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'جوجل بلاي' : 'Google Play'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تطبيقات وألعاب أندرويد' : 'Android apps and games'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🍎</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'آب ستور' : 'App Store'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تطبيقات وألعاب iOS' : 'iOS apps and games'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GiftCards;