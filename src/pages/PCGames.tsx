import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Cpu, Gamepad, Zap } from "lucide-react";
import { useTranslation } from 'react-i18next';

const PCGames = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const pcFeatures = [
    {
      icon: <Monitor className="w-8 h-8" />,
      title: isRTL ? 'دقة عالية' : 'High Resolution',
      description: isRTL ? 'ألعاب بدقة 4K وما فوق' : 'Games in 4K resolution and above'
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: isRTL ? 'أداء قوي' : 'Powerful Performance',
      description: isRTL ? 'استفد من أقوى المعالجات' : 'Utilize the most powerful processors'
    },
    {
      icon: <Gamepad className="w-8 h-8" />,
      title: isRTL ? 'تحكم متقدم' : 'Advanced Control',
      description: isRTL ? 'دعم جميع أنواع التحكم' : 'Support for all control types'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: isRTL ? 'سرعة فائقة' : 'Lightning Fast',
      description: isRTL ? 'تحميل سريع وأداء مثالي' : 'Fast loading and perfect performance'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-500/10 via-background to-indigo-500/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-blue-500/20 text-blue-600 border-blue-500/30">
              <Monitor className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'ألعاب الحاسوب' : 'PC Gaming'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'ألعاب الحاسوب' : 'PC Games'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'اكتشف أفضل الألعاب المصممة خصيصاً للحواسيب الشخصية مع أداء استثنائي وجودة رسومات مذهلة'
                : 'Discover the best games designed specifically for personal computers with exceptional performance and stunning graphics quality'
              }
            </p>
          </div>
        </section>

        {/* PC Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'لماذا تختار ألعاب الحاسوب؟' : 'Why Choose PC Games?'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pcFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* PC Games Grid */}
        <ProductGrid />

        {/* System Requirements */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'متطلبات النظام الموصى بها' : 'Recommended System Requirements'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {isRTL ? 'الحد الأدنى' : 'Minimum Requirements'}
                  </h3>
                  <ul className="text-left space-y-2 text-sm">
                    <li>• {isRTL ? 'معالج: Intel Core i3' : 'Processor: Intel Core i3'}</li>
                    <li>• {isRTL ? 'ذاكرة: 8 جيجابايت رام' : 'Memory: 8 GB RAM'}</li>
                    <li>• {isRTL ? 'كرت شاشة: GTX 1050' : 'Graphics: GTX 1050'}</li>
                    <li>• {isRTL ? 'مساحة تخزين: 50 جيجابايت' : 'Storage: 50 GB'}</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {isRTL ? 'الموصى به' : 'Recommended'}
                  </h3>
                  <ul className="text-left space-y-2 text-sm">
                    <li>• {isRTL ? 'معالج: Intel Core i7' : 'Processor: Intel Core i7'}</li>
                    <li>• {isRTL ? 'ذاكرة: 16 جيجابايت رام' : 'Memory: 16 GB RAM'}</li>
                    <li>• {isRTL ? 'كرت شاشة: RTX 3060' : 'Graphics: RTX 3060'}</li>
                    <li>• {isRTL ? 'مساحة تخزين: 100 جيجابايت SSD' : 'Storage: 100 GB SSD'}</li>
                  </ul>
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

export default PCGames;