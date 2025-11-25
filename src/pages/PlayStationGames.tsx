import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, Trophy, Users, Star } from "lucide-react";
import { useTranslation } from 'react-i18next';

const PlayStationGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const psFeatures = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: isRTL ? 'تحكم فريد' : 'Unique Control',
      description: isRTL ? 'تجربة تحكم استثنائية مع DualSense' : 'Exceptional control experience with DualSense'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: isRTL ? 'ألعاب حصرية' : 'Exclusive Games',
      description: isRTL ? 'عناوين حصرية لمنصة بلايستيشن فقط' : 'Titles exclusive to PlayStation platform only'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: isRTL ? 'مجتمع قوي' : 'Strong Community',
      description: isRTL ? 'انضم لمجتمع ملايين اللاعبين' : 'Join a community of millions of players'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: isRTL ? 'جودة مضمونة' : 'Quality Guaranteed',
      description: isRTL ? 'ألعاب مختبرة ومعتمدة من سوني' : 'Games tested and certified by Sony'
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
              {isRTL ? 'بلايستيشن' : 'PlayStation'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب بلايستيشن' : 'PlayStation Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'استمتع بأفضل الألعاب الحصرية والمغامرات الاستثنائية على منصة بلايستيشن'
                : 'Enjoy the best exclusive games and exceptional adventures on the PlayStation platform'
              }
            </p>
          </div>
        </section>

        {/* PS Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات ألعاب بلايستيشن' : 'PlayStation Games Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {psFeatures.map((feature, index) => (
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

        {/* PS Games Grid */}
        <ProductGrid initialFilter="playstation" />

        {/* PS Platforms */}
        <section className="py-16 bg-accent/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'منصات بلايستيشن المتوفرة' : 'Available PlayStation Platforms'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">PS5</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">PlayStation 5</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'أحدث جيل مع تقنيات متقدمة' : 'Latest generation with advanced technologies'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">PS4</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">PlayStation 4</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'الجيل السابق مع مكتبة هائلة' : 'Previous generation with huge library'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">PS+</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">PlayStation Plus</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'خدمة الألعاب السحابية والحصرية' : 'Cloud gaming service and exclusives'}
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

export default PlayStationGames;