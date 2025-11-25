import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Target, Sword, Flame } from "lucide-react";
import { useTranslation } from 'react-i18next';

const ActionGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const actionFeatures = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: isRTL ? 'إثارة مستمرة' : 'Non-Stop Action',
      description: isRTL ? 'تشويق وإثارة في كل لحظة' : 'Thrill and excitement in every moment'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: isRTL ? 'تحديات متنوعة' : 'Diverse Challenges',
      description: isRTL ? 'مهام متنوعة وأعداء مختلفون' : 'Varied missions and different enemies'
    },
    {
      icon: <Sword className="w-8 h-8" />,
      title: isRTL ? 'قتال مكثف' : 'Intense Combat',
      description: isRTL ? 'معارك مثيرة وقدرات خاصة' : 'Exciting battles and special abilities'
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: isRTL ? 'طاقة عالية' : 'High Energy',
      description: isRTL ? 'إيقاع سريع ومشاهد مذهلة' : 'Fast pace and amazing visuals'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-500/10 via-background to-red-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-orange-500/20 text-orange-600 border-orange-500/30">
              <Zap className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'ألعاب أكشن' : 'Action Games'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب الأكشن' : 'Action Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'استمتع بأقوى المغامرات والمعارك المثيرة في عالم الألعاب المليء بالتشويق والإثارة'
                : 'Enjoy the most powerful adventures and exciting battles in the world of games full of suspense and excitement'
              }
            </p>
          </div>
        </section>

        {/* Action Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات ألعاب الأكشن' : 'Action Games Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {actionFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Action Games Grid */}
        <ProductGrid />

        {/* Popular Action Subgenres */}
        <section className="py-16 bg-accent/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'أنواع ألعاب الأكشن الشائعة' : 'Popular Action Subgenres'}
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">💥</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'إطلاق نار' : 'Shooters'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'معارك إطلاق نار مثيرة' : 'Exciting shooting battles'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🥊</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'قتال' : 'Fighting'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'قتال فردي وجماعي' : 'Individual and group combat'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏃</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'مغامرات' : 'Adventure'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'قصص مثيرة ومغامرات' : 'Exciting stories and adventures'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🚗</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'سباق' : 'Racing'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'سباقات سريعة ومثيرة' : 'Fast and exciting races'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">⚔️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'حروب' : 'Warfare'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'معارك عسكرية كبيرة' : 'Large-scale military battles'}
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

export default ActionGames;