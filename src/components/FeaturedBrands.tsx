import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

const FeaturedBrands = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const brands = [
    {
      name: 'PlayStation',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/PlayStation-Logo.png',
      category: isRTL ? 'ألعاب وكونسولات' : 'Games & Consoles'
    },
    {
      name: 'Xbox',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Xbox-Logo.png',
      category: isRTL ? 'ألعاب وإكسسوارات' : 'Games & Accessories'
    },
    {
      name: 'Nintendo',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Nintendo-Logo.png',
      category: isRTL ? 'ألعاب Switch' : 'Switch Games'
    },
    {
      name: 'Steam',
      logo: 'https://logos-world.net/wp-content/uploads/2020/08/Steam-Logo.png',
      category: isRTL ? 'ألعاب الكمبيوتر' : 'PC Games'
    },
    {
      name: 'Razer',
      logo: 'https://logos-world.net/wp-content/uploads/2020/12/Razer-Logo.png',
      category: isRTL ? 'إكسسوارات الألعاب' : 'Gaming Accessories'
    },
    {
      name: 'Logitech',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Logitech-Logo.png',
      category: isRTL ? 'أجهزة طرفية' : 'Peripherals'
    },
    {
      name: 'Sony',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Sony-Logo.png',
      category: isRTL ? 'إلكترونيات' : 'Electronics'
    },
    {
      name: 'HyperX',
      logo: 'https://logos-world.net/wp-content/uploads/2021/03/HyperX-Logo.png',
      category: isRTL ? 'سماعات الألعاب' : 'Gaming Headsets'
    },
    {
      name: 'ASUS ROG',
      logo: 'https://logos-world.net/wp-content/uploads/2021/03/ASUS-ROG-Logo.png',
      category: isRTL ? 'أجهزة الألعاب' : 'Gaming Hardware'
    },
    {
      name: 'MSI Gaming',
      logo: 'https://logos-world.net/wp-content/uploads/2021/03/MSI-Gaming-Logo.png',
      category: isRTL ? 'حواسيب الألعاب' : 'Gaming PCs'
    },
    {
      name: 'SteelSeries',
      logo: 'https://logos-world.net/wp-content/uploads/2021/03/SteelSeries-Logo.png',
      category: isRTL ? 'إكسسوارات بريميوم' : 'Premium Accessories'
    },
    {
      name: 'Corsair',
      logo: 'https://logos-world.net/wp-content/uploads/2021/03/Corsair-Logo.png',
      category: isRTL ? 'مكونات الألعاب' : 'Gaming Components'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30 px-4 py-2 mb-6">
            🏷️ {isRTL ? 'العلامات التجارية الشريكة' : 'Partner Brands'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-baloo" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
            {isRTL ? (
              <>
                <span className="block text-white mb-2">
                  تسوق من أفضل
                </span>
                <span className="text-gradient">
                  العلامات التجارية
                </span>
              </>
            ) : (
              <>
                <span className="block text-white mb-2">
                  Shop from the Best
                </span>
                <span className="text-gradient">
                  Gaming Brands
                </span>
              </>
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {isRTL ? (
              'نقدم منتجات رسمية من أفضل العلامات التجارية في عالم الألعاب والترفيه الرقمي'
            ) : (
              'We offer official products from the best brands in gaming and digital entertainment'
            )}
          </p>
        </div>

        {/* Brands Grid */}
        <div className="brand-grid">
          {brands.map((brand, index) => (
            <Card
              key={brand.name}
              className="brand-card group cursor-pointer"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex flex-col items-center justify-center h-full p-6">
                {/* Brand Logo */}
                <div className="w-16 h-16 mb-4 bg-white/10 rounded-xl flex items-center justify-center p-2 group-hover:bg-white/20 transition-all duration-300">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                    onError={(e) => {
                      // Fallback for broken logos
                      (e.currentTarget as HTMLElement).style.display = 'none';
                      const fallback = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  {/* Fallback text logo */}
                  <span className="hidden text-white font-bold text-lg" style={{ display: 'none' }}>
                    {brand.name.charAt(0)}
                  </span>
                </div>

                {/* Brand Info */}
                <div className="text-center">
                  <h3 className="font-bold text-white text-lg mb-1">
                    {brand.name}
                  </h3>
                  <p className="text-[#C4B5FD] text-sm">
                    {brand.category}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-[#C4B5FD] mb-6">
            {isRTL ? 'جميع العلامات التجارية مسجلة لأصحابها الأصليين' : 'All trademarks belong to their respective owners'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;