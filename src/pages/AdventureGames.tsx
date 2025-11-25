import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Map, Compass, Mountain, Gem } from "lucide-react";
import { useTranslation } from 'react-i18next';

const AdventureGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const adventureFeatures = [
    {
      icon: <Map className="w-8 h-8" />,
      title: isRTL ? 'عوالم واسعة' : 'Vast Worlds',
      description: isRTL ? 'استكشف عوالم شاسعة ومتنوعة' : 'Explore vast and diverse worlds'
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: isRTL ? 'استكشاف حر' : 'Free Exploration',
      description: isRTL ? 'اكتشف الأسرار والكنوز المخفية' : 'Discover hidden secrets and treasures'
    },
    {
      icon: <Mountain className="w-8 h-8" />,
      title: isRTL ? 'تحديات طبيعية' : 'Natural Challenges',
      description: isRTL ? 'تغلب على عقبات الطبيعة' : 'Overcome nature\'s obstacles'
    },
    {
      icon: <Gem className="w-8 h-8" />,
      title: isRTL ? 'جوائز قيمة' : 'Valuable Rewards',
      description: isRTL ? 'احصل على جوائز نادرة وقيمة' : 'Get rare and valuable rewards'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
              <Compass className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'ألعاب المغامرة' : 'Adventure Games'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب المغامرة' : 'Adventure Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'انطلق في رحلات استكشافية مثيرة واكتشف عوالم جديدة مليئة بالأسرار والمغامرات'
                : 'Embark on exciting exploratory journeys and discover new worlds full of secrets and adventures'
              }
            </p>
          </div>
        </section>

        {/* Adventure Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات ألعاب المغامرة' : 'Adventure Games Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {adventureFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Adventure Games Grid */}
        <ProductGrid />

        {/* Adventure Types */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'أنواع المغامرات' : 'Types of Adventures'}
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏔️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'مغامرات جبلية' : 'Mountain Adventures'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تسلق الجبال واكتشاف القمم' : 'Climb mountains and discover peaks'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🌊</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'مغامرات بحرية' : 'Sea Adventures'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'استكشاف أعماق البحار' : 'Explore the depths of the seas'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏰</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'مغامرات تاريخية' : 'Historical Adventures'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'رحلات في العصور القديمة' : 'Journeys through ancient times'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'مغامرات فضائية' : 'Space Adventures'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'استكشاف الفضاء الخارجي' : 'Explore outer space'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏙️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'مغامرات حضرية' : 'Urban Adventures'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'مغامرات في المدن الكبرى' : 'Adventures in major cities'}
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

export default AdventureGames;