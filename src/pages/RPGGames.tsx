import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, BookOpen, Crown } from "lucide-react";
import { useTranslation } from 'react-i18next';

const RPGGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const rpgFeatures = [
    {
      icon: <Users className="w-8 h-8" />,
      title: isRTL ? 'شخصيات متنوعة' : 'Diverse Characters',
      description: isRTL ? 'اختر شخصيتك وطورها كما تشاء' : 'Choose your character and develop it as you wish'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: isRTL ? 'قصة غامرة' : 'Immersive Story',
      description: isRTL ? 'انغمس في قصة مشوقة ومعقدة' : 'Immerse yourself in an engaging and complex story'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: isRTL ? 'نظام قتال متقدم' : 'Advanced Combat System',
      description: isRTL ? 'قتال استراتيجي يعتمد على المهارات' : 'Strategic combat based on skills'
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: isRTL ? 'تطور مستمر' : 'Continuous Evolution',
      description: isRTL ? 'طور شخصيتك وقدراتك باستمرار' : 'Continuously develop your character and abilities'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-violet-500/10 via-background to-purple-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-violet-500/20 text-violet-600 border-violet-500/30">
              <Shield className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'ألعاب آر بي جي' : 'RPG Games'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب آر بي جي' : 'RPG Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'عش تجربة لعب غامرة حيث تتحكم في مصير شخصيتك وقصتك في عوالم خيالية مذهلة'
                : 'Experience an immersive gaming experience where you control the fate of your character and story in amazing fantasy worlds'
              }
            </p>
          </div>
        </section>

        {/* RPG Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات ألعاب آر بي جي' : 'RPG Games Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {rpgFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* RPG Games Grid */}
        <ProductGrid />

        {/* RPG Subgenres */}
        <section className="py-16 bg-success/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'أنواع ألعاب آر بي جي' : 'RPG Subgenres'}
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">⚔️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'فانتازي' : 'Fantasy RPG'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'عوالم سحرية ومخلوقات أسطورية' : 'Magical worlds and mythical creatures'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'خيال علمي' : 'Sci-Fi RPG'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'مغامرات في الفضاء والمستقبل' : 'Adventures in space and the future'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏛️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'تاريخي' : 'Historical RPG'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'قصص من العصور القديمة' : 'Stories from ancient times'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🧟</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'رعب ونجاة' : 'Horror & Survival'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'النجاة في عالم مليء بالرعب' : 'Survival in a horror-filled world'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🌟</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'أكشن آر بي جي' : 'Action RPG'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'آر بي جي مع عناصر أكشن' : 'RPG with action elements'}
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

export default RPGGames;