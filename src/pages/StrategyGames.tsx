import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Castle, Crown, Target } from "lucide-react";
import { useTranslation } from 'react-i18next';

const StrategyGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const strategyFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: isRTL ? 'تفكير استراتيجي' : 'Strategic Thinking',
      description: isRTL ? 'خطط لتحركاتك وتوقع تحركات الخصم' : 'Plan your moves and anticipate opponent moves'
    },
    {
      icon: <Castle className="w-8 h-8" />,
      title: isRTL ? 'بناء إمبراطورية' : 'Build Empires',
      description: isRTL ? 'ابن حضارتك وطور إمبراطوريتك' : 'Build your civilization and develop your empire'
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: isRTL ? 'قيادة الجيوش' : 'Lead Armies',
      description: isRTL ? 'قد جيوشك نحو النصر في المعارك' : 'Lead your armies to victory in battles'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: isRTL ? 'تحقيق الأهداف' : 'Achieve Objectives',
      description: isRTL ? 'حقق أهدافك الاستراتيجية بعناية' : 'Achieve your strategic objectives carefully'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-cyan-500/10 via-background to-blue-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-cyan-500/20 text-cyan-600 border-cyan-500/30">
              <Brain className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'ألعاب استراتيجية' : 'Strategy Games'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب استراتيجية' : 'Strategy Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'اختبر ذكاءك وقدراتك القيادية في ألعاب تتطلب تفكيراً استراتيجياً وتخطيطاً دقيقاً'
                : 'Test your intelligence and leadership abilities in games that require strategic thinking and careful planning'
              }
            </p>
          </div>
        </section>

        {/* Strategy Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'مميزات ألعاب استراتيجية' : 'Strategy Games Features'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {strategyFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Strategy Games Grid */}
        <ProductGrid />

        {/* Strategy Subgenres */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'أنواع الألعاب الاستراتيجية' : 'Strategy Game Types'}
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏰</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'استراتيجية الزمن الحقيقي' : 'Real-Time Strategy'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'إدارة موارد في الوقت الفعلي' : 'Real-time resource management'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'استراتيجية تبادل الأدوار' : 'Turn-Based Strategy'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تخطيط كل خطوة بعناية' : 'Plan each move carefully'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🏙️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'بناء المدن' : 'City Building'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'بناء وتطوير المدن' : 'Build and develop cities'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">⚔️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'حروب استراتيجية' : 'Strategic Warfare'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'قيادة الحروب والمعارك' : 'Lead wars and battles'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🧩</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'ألغاز استراتيجية' : 'Strategy Puzzles'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'ألغاز تتطلب تفكيراً استراتيجياً' : 'Puzzles requiring strategic thinking'}
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

export default StrategyGames;