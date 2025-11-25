import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, Monitor, Zap, Users } from "lucide-react";
import { useTranslation } from 'react-i18next';

const ConsoleGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const consoleFeatures = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: isRTL ? 'تحكم متقدم' : 'Advanced Control',
      description: isRTL ? 'تجربة تحكم استثنائية ومريحة' : 'Exceptional and comfortable control experience'
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: isRTL ? 'رسومات مذهلة' : 'Stunning Graphics',
      description: isRTL ? 'جودة رسومات عالية الدقة' : 'High-definition graphics quality'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: isRTL ? 'أداء قوي' : 'Powerful Performance',
      description: isRTL ? 'معالجة سريعة وفعالة للألعاب' : 'Fast and efficient game processing'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: isRTL ? 'لعب جماعي' : 'Multiplayer Gaming',
      description: isRTL ? 'انضم لأصدقائك في ألعاب جماعية' : 'Join friends in group games'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-indigo-500/10 via-background to-purple-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-indigo-500/20 text-indigo-600 border-indigo-500/30">
              <Gamepad2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'ألعاب الكونسول' : 'Console Games'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب الكونسول' : 'Console Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'استمتع بأفضل الألعاب على منصات بلايستيشن، إكس بوكس، ونينتندو مع تجربة لعب استثنائية'
                : 'Enjoy the best games on PlayStation, Xbox, and Nintendo platforms with an exceptional gaming experience'
              }
            </p>
          </div>
        </section>

        {/* Console Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات ألعاب الكونسول' : 'Console Games Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {consoleFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Console Games Grid */}
        <ProductGrid />

        {/* Console Platforms */}
        <section className="py-16 bg-accent/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'منصات الكونسول المتوفرة' : 'Available Console Platforms'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">PS</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">PlayStation</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'ألعاب حصرية وجودة استثنائية' : 'Exclusive games and exceptional quality'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">XB</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Xbox</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'خدمة Game Pass وألعاب سحابية' : 'Game Pass service and cloud games'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">NS</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Nintendo Switch</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'ألعاب عائلية وترفيهية' : 'Family and entertainment games'}
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

export default ConsoleGames;