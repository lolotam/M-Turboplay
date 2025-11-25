import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Percent, Gift } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SecondaryPromotionalBanner = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const handleShopDeals = () => {
    navigate('/deals');
  };

  return (
    <section className="relative py-16 bg-gradient-to-r from-[#2D1B4E] via-[#1A1A2E] to-[#2D1B4E] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-10"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A855F7' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }}>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-right">
            <Badge className="bg-[#E935C1]/20 text-[#E935C1] border-[#E935C1]/30 px-4 py-2 mb-6">
              <Percent className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'عروض خاصة محدودة الوقت' : 'Limited Time Special Offers'}
            </Badge>

            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
              {isRTL ? (
                <>
                  <span className="block text-white mb-2">
                    تخفيضات هائلة على
                  </span>
                  <span className="text-gradient">
                    ألعاب PS5 و Xbox
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-white mb-2">
                    Massive Discounts on
                  </span>
                  <span className="text-gradient">
                    PS5 & Xbox Games
                  </span>
                </>
              )}
            </h2>

            <p className="text-lg text-[#C4B5FD] mb-8 leading-relaxed">
              {isRTL ? (
                'احصل على أفضل الألعاب بأسعار مخفضة تصل إلى 70% • عروض خاصة على الإصدارات الجديدة والكلاسيكية'
              ) : (
                'Get the best games at discounted prices up to 70% off • Special offers on new releases and classics'
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end mb-8">
              <div className="flex items-center text-[#10B981] font-semibold">
                <Clock className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'ينتهي خلال: 2 أيام' : 'Ends in: 2 days'}
              </div>
              <div className="flex items-center text-[#A855F7] font-semibold">
                <Gift className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'هدايا مجانية مع كل طلب' : 'Free gifts with every order'}
              </div>
            </div>

            <Button
              className="bg-gradient-to-r from-[#E935C1] to-[#A855F7] hover:from-[#A855F7] hover:to-[#E935C1] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-purple-glow"
              onClick={handleShopDeals}
            >
              {isRTL ? 'تسوق العروض الآن' : 'Shop Deals Now'}
            </Button>
          </div>

          {/* Right Content - Featured Game */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-[#1A1A2E] to-[#2D1B4E] rounded-3xl p-8 border border-[#A855F7]/30 shadow-purple-glow">
              {/* Game Artwork Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-[#6B46C1]/20 to-[#A855F7]/20 rounded-2xl mb-6 flex items-center justify-center border border-[#A855F7]/20">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#A855F7] to-[#E935C1] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🎮</span>
                  </div>
                  <p className="text-[#C4B5FD] font-semibold">
                    {isRTL ? 'ألعاب مميزة في العروض' : 'Featured Games on Sale'}
                  </p>
                </div>
              </div>

              {/* Discount Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#E935C1] to-[#A855F7] text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                {isRTL ? 'خصم 70%' : '70% OFF'}
              </div>

              {/* Game Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {isRTL ? 'مجموعة ألعاب PS5 بريميوم' : 'Premium PS5 Games Collection'}
                  </h3>
                  <p className="text-[#C4B5FD] text-sm leading-relaxed">
                    {isRTL ? (
                      'احصل على أفضل ألعاب PlayStation 5 بأسعار لا تُقاوم. تشمل أحدث الإصدارات والألعاب الحصرية.'
                    ) : (
                      'Get the best PlayStation 5 games at unbeatable prices. Includes latest releases and exclusive titles.'
                    )}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-sm text-[#9CA3AF]">
                      {isRTL ? 'السعر القديم' : 'Original Price'}
                    </p>
                    <p className="text-lg text-[#9CA3AF] line-through">
                      399 {isRTL ? 'ر.س' : 'SAR'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[#10B981]">
                      {isRTL ? 'السعر الجديد' : 'New Price'}
                    </p>
                    <p className="text-2xl font-bold text-[#10B981]">
                      119 {isRTL ? 'ر.س' : 'SAR'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondaryPromotionalBanner;