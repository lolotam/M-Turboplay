import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, Cloud, Trophy, Users } from "lucide-react";
import { useTranslation } from 'react-i18next';

const XboxGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const xboxFeatures = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: isRTL ? 'تحكم مريح' : 'Comfortable Control',
      description: isRTL ? 'تصميم مريح لساعات لعب طويلة' : 'Ergonomic design for long gaming sessions'
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: isRTL ? 'ألعاب سحابية' : 'Cloud Gaming',
      description: isRTL ? 'العب ألعابك في أي مكان مع Game Pass' : 'Play your games anywhere with Game Pass'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: isRTL ? 'إنجازات متنوعة' : 'Diverse Achievements',
      description: isRTL ? 'نظام إنجازات شامل ومتنوع' : 'Comprehensive and diverse achievement system'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: isRTL ? 'تفاعل اجتماعي' : 'Social Interaction',
      description: isRTL ? 'تواصل مع أصدقائك ولعب جماعي' : 'Connect with friends and group play'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-green-500/10 via-background to-emerald-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-green-500/20 text-green-600 border-green-500/30">
              <Gamepad2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'إكس بوكس' : 'Xbox'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب إكس بوكس' : 'Xbox Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'استمتع بتجربة لعب استثنائية مع أفضل الألعاب والخدمات على منصة إكس بوكس'
                : 'Enjoy an exceptional gaming experience with the best games and services on the Xbox platform'
              }
            </p>
          </div>
        </section>

        {/* Xbox Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات ألعاب إكس بوكس' : 'Xbox Games Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {xboxFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Xbox Games Grid */}
        <ProductGrid />

        {/* Xbox Services */}
        <section className="py-16 bg-success/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'خدمات إكس بوكس' : 'Xbox Services'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">GP</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Xbox Game Pass</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'مكتبة هائلة من الألعاب بسعر اشتراك واحد' : 'Huge library of games for one subscription price'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">GL</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Xbox Game Pass Ultimate</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'أقصى استفادة مع الألعاب السحابية والحصرية' : 'Maximum benefit with cloud games and exclusives'}
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

export default XboxGames;