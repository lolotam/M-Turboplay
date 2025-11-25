import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tv, Heart, Star, Gamepad2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

const NintendoGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const nintendoFeatures = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: isRTL ? 'مناسب للعائلة' : 'Family Friendly',
      description: isRTL ? 'ألعاب ممتعة لجميع الأعمار' : 'Fun games for all ages'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: isRTL ? 'شخصيات أسطورية' : 'Legendary Characters',
      description: isRTL ? 'ماريو، زيلدا، بوكيمون وغيرها' : 'Mario, Zelda, Pokemon and more'
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: isRTL ? 'إبداع في التصميم' : 'Creative Design',
      description: isRTL ? 'ألعاب مبتكرة وفريدة من نوعها' : 'Innovative and unique games'
    },
    {
      icon: <Tv className="w-8 h-8" />,
      title: isRTL ? 'محمول ومنزلي' : 'Portable & Home',
      description: isRTL ? 'العب في المنزل أو أثناء التنقل' : 'Play at home or on the go'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-red-500/10 via-background to-pink-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-red-500/20 text-red-600 border-red-500/30">
              <Tv className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'نينتندو' : 'Nintendo'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب نينتندو' : 'Nintendo Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'اكتشف عالم الألعاب الترفيهية والمبتكرة مع شخصيات نينتندو الأسطورية'
                : 'Discover the world of entertaining and innovative games with Nintendo\'s legendary characters'
              }
            </p>
          </div>
        </section>

        {/* Nintendo Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات ألعاب نينتندو' : 'Nintendo Games Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {nintendoFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Nintendo Games Grid */}
        <ProductGrid />

        {/* Nintendo Consoles */}
        <section className="py-16 bg-warning/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'منصات نينتندو' : 'Nintendo Consoles'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">NS</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Nintendo Switch</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'المنصة الهجينة الأكثر شعبية' : 'The most popular hybrid platform'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">NL</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Nintendo Switch Lite</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'نسخة محمولة مثالية للتنقل' : 'Perfect portable version for travel'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">NO</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Nintendo Switch OLED</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'شاشة OLED لأفضل جودة صورة' : 'OLED screen for best image quality'}
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

export default NintendoGames;