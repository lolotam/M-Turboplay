import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Wifi, Battery, Hand } from "lucide-react";
import { useTranslation } from 'react-i18next';

const MobileGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const mobileFeatures = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: isRTL ? 'متوافق مع جميع الأجهزة' : 'Compatible with All Devices',
      description: isRTL ? 'يعمل على الهواتف والأجهزة اللوحية' : 'Works on phones and tablets'
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: isRTL ? 'ألعاب بدون إنترنت' : 'Offline Games',
      description: isRTL ? 'استمتع بالألعاب بدون الحاجة للإنترنت' : 'Enjoy games without needing internet'
    },
    {
      icon: <Battery className="w-8 h-8" />,
      title: isRTL ? 'استهلاك بطارية منخفض' : 'Low Battery Consumption',
      description: isRTL ? 'ألعاب محسنة لتوفير البطارية' : 'Games optimized to save battery'
    },
    {
      icon: <Hand className="w-8 h-8" />,
      title: isRTL ? 'تحكم باللمس' : 'Touch Control',
      description: isRTL ? 'تحكم سهل وبديهي باللمس' : 'Easy and intuitive touch control'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-purple-500/10 via-background to-pink-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-purple-500/20 text-purple-600 border-purple-500/30">
              <Smartphone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'ألعاب الجوال' : 'Mobile Games'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب الجوال' : 'Mobile Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'استمتع بآلاف الألعاب المتنوعة على هاتفك المحمول في أي وقت وأي مكان'
                : 'Enjoy thousands of diverse games on your mobile phone anytime and anywhere'
              }
            </p>
          </div>
        </section>

        {/* Mobile Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات ألعاب الجوال' : 'Mobile Games Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mobileFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Mobile Games Grid */}
        <ProductGrid />

        {/* Game Categories */}
        <section className="py-16 bg-accent/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'فئات ألعاب الجوال' : 'Mobile Game Categories'}
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🎮</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'ألعاب الأكشن' : 'Action Games'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'مغامرات مثيرة وتشويقية' : 'Exciting and thrilling adventures'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🧩</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'ألعاب الألغاز' : 'Puzzle Games'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'اختبر ذكاءك وحل التحديات' : 'Test your intelligence and solve challenges'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏃</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'ألعاب السباق' : 'Racing Games'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تنافس في سباقات سريعة' : 'Compete in fast-paced races'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">⚽</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'ألعاب رياضية' : 'Sports Games'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'استمتع بالرياضة المفضلة لديك' : 'Enjoy your favorite sport'}
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

export default MobileGames;