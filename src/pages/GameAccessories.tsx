import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Headphones, Gamepad2, Monitor, Keyboard } from "lucide-react";
import { useTranslation } from 'react-i18next';

const GameAccessories = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const accessoryFeatures = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: isRTL ? 'تحكم محسن' : 'Enhanced Control',
      description: isRTL ? 'تحكم أكثر دقة واستجابة' : 'More precise and responsive control'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: isRTL ? 'صوت محيطي' : 'Surround Sound',
      description: isRTL ? 'تجربة صوتية غامرة ومذهلة' : 'Immersive and amazing audio experience'
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: isRTL ? 'جودة عرض عالية' : 'High Display Quality',
      description: isRTL ? 'شاشات وأجهزة عرض متطورة' : 'Advanced screens and display devices'
    },
    {
      icon: <Keyboard className="w-8 h-8" />,
      title: isRTL ? 'إكسسوارات متنوعة' : 'Diverse Accessories',
      description: isRTL ? 'مجموعة واسعة من الإكسسوارات' : 'Wide range of accessories'}
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-purple-500/10 via-background to-indigo-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-purple-500/20 text-purple-600 border-purple-500/30">
              <Headphones className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'إكسسوارات الألعاب' : 'Game Accessories'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'إكسسوارات الألعاب' : 'Game Accessories'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'اكتشف أفضل الإكسسوارات والمعدات التي تعزز تجربتك في اللعب وتجعلها أكثر متعة وإثارة'
                : 'Discover the best accessories and equipment that enhance your gaming experience and make it more fun and exciting'
              }
            </p>
          </div>
        </section>

        {/* Accessory Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات إكسسوارات الألعاب' : 'Game Accessories Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {accessoryFeatures.map((feature, index) => (
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

        {/* Accessories Grid */}
        <ProductGrid />

        {/* Accessory Categories */}
        <section className="py-16 bg-success/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'فئات الإكسسوارات' : 'Accessory Categories'}
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🎮</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'أجهزة التحكم' : 'Controllers'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تحكم مريح ودقيق' : 'Comfortable and precise control'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🎧</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'سماعات الألعاب' : 'Gaming Headsets'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'صوت محيطي عالي الجودة' : 'High-quality surround sound'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">⌨️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'لوحات المفاتيح' : 'Keyboards'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'استجابة سريعة ودقة عالية' : 'Fast response and high accuracy'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🖱️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'فأرة الألعاب' : 'Gaming Mice'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'دقة عالية وسرعة استجابة' : 'High precision and response speed'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🪑</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'كراسي الألعاب' : 'Gaming Chairs'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'راحة لساعات لعب طويلة' : 'Comfort for long gaming sessions'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'حوامل وإكسسوارات' : 'Mounts & Accessories'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'إكسسوارات متنوعة ومفيدة' : 'Various and useful accessories'}
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

export default GameAccessories;