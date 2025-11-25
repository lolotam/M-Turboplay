import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Target, Zap } from "lucide-react";
import { useTranslation } from 'react-i18next';

const SportsGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const sportsFeatures = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: isRTL ? 'بطولات واقعية' : 'Realistic Championships',
      description: isRTL ? 'شارك في بطولات عالمية حقيقية' : 'Participate in real world championships'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: isRTL ? 'لعب جماعي' : 'Team Play',
      description: isRTL ? 'انضم لفريقك ولعب مع الأصدقاء' : 'Join your team and play with friends'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: isRTL ? 'مهارات دقيقة' : 'Precise Skills',
      description: isRTL ? 'طور مهاراتك الرياضية بدقة' : 'Develop your sports skills with precision'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: isRTL ? 'منافسات مثيرة' : 'Exciting Competitions',
      description: isRTL ? 'تنافس مع لاعبين من جميع أنحاء العالم' : 'Compete with players from around the world'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-yellow-500/10 via-background to-orange-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
              <Trophy className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'ألعاب رياضية' : 'Sports Games'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب رياضية' : 'Sports Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'استمتع بالرياضة المفضلة لديك في عالم الألعاب الرقمية مع منافسات واقعية ومثيرة'
                : 'Enjoy your favorite sport in the digital gaming world with realistic and exciting competitions'
              }
            </p>
          </div>
        </section>

        {/* Sports Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات ألعاب رياضية' : 'Sports Games Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sportsFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Sports Games Grid */}
        <ProductGrid />

        {/* Popular Sports */}
        <section className="py-16 bg-warning/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'الألعاب الرياضية الشائعة' : 'Popular Sports Games'}
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">⚽</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'كرة قدم' : 'Football'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'أشهر لعبة رياضية في العالم' : 'The world\'s most popular sport'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏀</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'كرة سلة' : 'Basketball'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'رياضة سريعة ومثيرة' : 'Fast-paced and exciting sport'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🎾</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'تنس' : 'Tennis'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'لعبة فردية تتطلب دقة عالية' : 'Individual game requiring high precision'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏎️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'سباق سيارات' : 'Racing'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'سباقات سريعة ومثيرة' : 'Fast and exciting races'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🥊</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'ملاكمة' : 'Boxing'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'رياضة قتالية مثيرة' : 'Exciting combat sport'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏐</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'كرة طائرة' : 'Volleyball'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'لعبة جماعية سريعة' : 'Fast team sport'}
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

export default SportsGames;