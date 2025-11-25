import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Percent, Clock, Zap } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Deals = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const dealTypes = [
    {
      icon: <Percent className="w-8 h-8" />,
      title: isRTL ? 'خصومات يومية' : 'Daily Discounts',
      description: isRTL ? 'عروض خاصة كل يوم على ألعاب مختارة' : 'Special offers every day on selected games',
      color: 'bg-green-500/20 text-green-600 border-green-500/30'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: isRTL ? 'عروض محدودة الوقت' : 'Limited Time Offers',
      description: isRTL ? 'تخفيضات لفترة محدودة، لا تفوتها!' : 'Time-limited discounts, don\'t miss out!',
      color: 'bg-orange-500/20 text-orange-600 border-orange-500/30'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: isRTL ? 'عروض فلاش' : 'Flash Sales',
      description: isRTL ? 'تخفيضات سريعة ومفاجئة على ألعاب مميزة' : 'Quick and surprising discounts on featured games',
      color: 'bg-purple-500/20 text-purple-600 border-purple-500/30'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-destructive/10 via-background to-warning/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-destructive/20 text-destructive border-destructive/30">
              <Percent className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'عروض حصرية' : 'Exclusive Deals'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'العروض والتخفيضات' : 'Deals & Discounts'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'احصل على أفضل الألعاب بأسعار مخفضة وعروض حصرية لفترة محدودة'
                : 'Get the best games at discounted prices and exclusive offers for a limited time'
              }
            </p>
          </div>
        </section>

        {/* Deal Types */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isRTL ? 'أنواع العروض' : 'Types of Deals'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {dealTypes.map((deal, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl ${deal.color} flex items-center justify-center`}>
                      {deal.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
                    <p className="text-muted-foreground">{deal.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Deals Product Grid */}
        <ProductGrid />

        {/* Newsletter Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isRTL ? 'احصل على إشعارات العروض' : 'Get Deal Notifications'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {isRTL
                ? 'كن أول من يعلم بالعروض الجديدة والتخفيضات الحصرية'
                : 'Be the first to know about new deals and exclusive discounts'
              }
            </p>
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm text-accent">
                  {isRTL ? 'سيتم إضافة نموذج الاشتراك قريباً' : 'Newsletter signup form coming soon'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Deals;