import Header from "@/components/Header";
import GameCategories from "@/components/GameCategories";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Grid3X3 } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Categories = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-accent/10 via-background to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-accent/20 text-accent border-accent/30">
              <Grid3X3 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تصنيفات متنوعة' : 'Browse Categories'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-baloo text-gradient">
              {isRTL ? 'تصنيفات الألعاب' : 'Game Categories'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isRTL
                ? 'استكشف مجموعتنا الواسعة من الألعاب حسب النوع والمنصة المفضلة لديك'
                : 'Explore our extensive collection of games by your favorite genre and platform'
              }
            </p>
          </div>
        </section>

        {/* Game Categories Section */}
        <GameCategories />

        {/* Additional Categories Info */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isRTL ? 'لماذا تختار تصنيفاتنا؟' : 'Why Choose Our Categories?'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isRTL ? 'تصنيف دقيق' : 'Accurate Categorization'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL
                    ? 'نصنف الألعاب بدقة حسب النوع والمنصة لتسهيل عملية البحث'
                    : 'We categorize games accurately by genre and platform for easy browsing'
                  }
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔥</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isRTL ? 'محتوى محدث' : 'Updated Content'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL
                    ? 'نتابع أحدث الإصدارات ونضيفها للتصنيفات المناسبة فوراً'
                    : 'We follow the latest releases and add them to appropriate categories instantly'
                  }
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isRTL ? 'جودة مضمونة' : 'Quality Guaranteed'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL
                    ? 'جميع الألعاب في تصنيفاتنا مختبرة ومضمونة الجودة'
                    : 'All games in our categories are tested and quality guaranteed'
                  }
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

export default Categories;