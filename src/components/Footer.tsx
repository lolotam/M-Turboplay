import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  MessageCircle,
  Shield,
  CreditCard,
  Truck,
  Facebook,
  Youtube,
  MessageSquare,
  Gamepad2,
  Headphones,
  Gift,
  Star,
  Clock,
  CheckCircle
} from "lucide-react";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-[#0F0A1F] via-[#1A1A2E] to-[#0F0A1F] border-t border-[#A855F7]/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-repeat opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A855F7' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Customer Reviews Strip */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-[#1A1A2E]/80 to-[#0F0A1F]/80 border border-[#A855F7]/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
              {isRTL ? 'آراء العملاء' : 'Customer Reviews'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="text-center">
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? 'text-[#FFD700]' : 'text-[#C4B5FD]'}`}
                        fill={i < 4}
                      />
                    ))}
                  </div>
                  <p className="text-white font-semibold mb-2">
                    {isRTL ? `عميل ${review}` : `Customer ${review}`}
                  </p>
                  <p className="text-[#C4B5FD] text-sm italic">
                    {isRTL
                      ? 'خدمة ممتازة ومنتجات عالية الجودة. أوصي بالمتجر بشدة!'
                      : 'Excellent service and high-quality products. Highly recommended!'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* App Download Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-[#A855F7]/20 to-[#E935C1]/20 border border-[#A855F7]/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
              {isRTL ? 'حمل التطبيق' : 'Download Our App'}
            </h3>
            <p className="text-[#C4B5FD] text-center mb-8">
              {isRTL
                ? 'احصل على أفضل تجربة تسوق مع تطبيقنا المميز. متوفر لأندرويد و iOS'
                : 'Get the best shopping experience with our amazing app. Available for Android and iOS'}
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.519 8.018c-.356-.008-.672-.03-.984-.018l-2.496 2.496c-.313.313-.613.613-.925.925-.011-.312-.011-.625 0-.938l-2.496-2.496c-.313-.313-.613-.613-.925-.925-.011.313-.011.625 0 .938l2.496 2.496c.313.313.613.613.925.925.011.312.011.625 0 .938l2.496-2.496c.313-.313.613-.613.925-.925.011-.312.011-.625 0-.938l-2.496-2.496c-.313-.313-.613-.613-.925-.925-.011.313-.011.625 0 .938l2.496 2.496c.313.313.613.613.925.925.011.312.011.625 0 .938z"/>
                </svg>
                <span>{isRTL ? 'متجر جوجل بلاي' : 'Google Play Store'}</span>
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 1.24-.96 0-.57-.35-1.08-.88-1.71-.25.61-.47-1.29-.47-1.71 0-1.06.58-1.71 1.24-1.71 1.24.45.79.75 1.71 1.24.96 0 .57.35 1.08.88 1.71.25.61.47 1.29.47 1.71 0 1.06-.58 1.71-1.24.96-.83-.83-1.24-1.71-1.24-.96 0-.57-.35-1.08-.88-1.71-.25-.61-.47-1.29-.47-1.71 0-1.06.58-1.71 1.24-1.71 1.24-.45-.79-.75-1.71-1.24-.96 0-.57-.35-1.08-.88-1.71-.25-.61-.47-1.29-.47-1.71 0z"/>
                </svg>
                <span>{isRTL ? 'متجر آب ستور' : 'App Store'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Column 1: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white border-b border-[#A855F7]/30 pb-2">
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <nav className="space-y-3">
              {[
                { label: t('nav.home'), href: '/' },
                { label: t('nav.about'), href: '/about' },
                { label: t('nav.contact'), href: '/contact' },
                { label: isRTL ? 'الأسئلة الشائعة' : 'FAQ', href: '/faq' },
                { label: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy', href: '/privacy-policy' },
                { label: isRTL ? 'الشروط والأحكام' : 'Terms & Conditions', href: '/terms-of-service' },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-[#C4B5FD] hover:text-[#A855F7] transition-colors duration-300 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 2: Game Categories */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white border-b border-[#A855F7]/30 pb-2">
              {isRTL ? 'فئات الألعاب' : 'Game Categories'}
            </h4>
            <nav className="space-y-3">
              {[
                { label: isRTL ? 'بلايستيشن' : 'PlayStation', href: '/playstation-games', icon: <Gamepad2 className="w-4 h-4" /> },
                { label: isRTL ? 'إكس بوكس' : 'Xbox', href: '/xbox-games', icon: <Gamepad2 className="w-4 h-4" /> },
                { label: isRTL ? 'نينتندو' : 'Nintendo', href: '/nintendo-games', icon: <Gamepad2 className="w-4 h-4" /> },
                { label: isRTL ? 'العاب الكمبيوتر' : 'PC Games', href: '/pc-games', icon: <Gamepad2 className="w-4 h-4" /> },
                { label: isRTL ? 'ألعاب الجوال' : 'Mobile Games', href: '/mobile-games', icon: <Gamepad2 className="w-4 h-4" /> },
              ].map((category) => (
                <Link
                  key={category.href}
                  to={category.href}
                  className="flex items-center gap-3 text-[#C4B5FD] hover:text-[#A855F7] transition-colors duration-300 text-sm"
                >
                  <span className="text-[#A855F7]">{category.icon}</span>
                  {category.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white border-b border-[#A855F7]/30 pb-2">
              {isRTL ? 'خدمة العملاء' : 'Customer Service'}
            </h4>
            <nav className="space-y-3">
              {[
                { label: isRTL ? 'تتبع الطلب' : 'Track Order', href: '/track-order', icon: <CheckCircle className="w-4 h-4" /> },
                { label: isRTL ? 'سياسة الإرجاع' : 'Return Policy', href: '/return-policy', icon: <CheckCircle className="w-4 h-4" /> },
                { label: isRTL ? 'طرق الدفع' : 'Payment Methods', href: '/payment-methods', icon: <CreditCard className="w-4 h-4" /> },
                { label: isRTL ? 'الشحن والتوصيل' : 'Shipping & Delivery', href: '/shipping-policy', icon: <Truck className="w-4 h-4" /> },
                { label: isRTL ? 'الدعم الفني' : 'Technical Support', href: '/support', icon: <Headphones className="w-4 h-4" /> },
              ].map((service) => (
                <Link
                  key={service.href}
                  to={service.href}
                  className="flex items-center gap-3 text-[#C4B5FD] hover:text-[#A855F7] transition-colors duration-300 text-sm"
                >
                  <span className="text-[#A855F7]">{service.icon}</span>
                  {service.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Connect With Us */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white border-b border-[#A855F7]/30 pb-2">
              {isRTL ? 'تواصل معنا' : 'Connect With Us'}
            </h4>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#C4B5FD]">
                <MapPin className="w-5 h-5 text-[#A855F7] flex-shrink-0" />
                <span className="text-sm">{isRTL ? 'الكويت - السالمية' : 'Kuwait - Salmiya'}</span>
              </div>
              <div className="flex items-center gap-3 text-[#C4B5FD]">
                <Phone className="w-5 h-5 text-[#A855F7] flex-shrink-0" />
                <a href="tel:+96555683677" className="text-sm hover:text-[#A855F7] transition-colors">
                  +965 55683677
                </a>
              </div>
              <div className="flex items-center gap-3 text-[#C4B5FD]">
                <Mail className="w-5 h-5 text-[#A855F7] flex-shrink-0" />
                <a href="mailto:support@mturboplay.com" className="text-sm hover:text-[#A855F7] transition-colors">
                  support@mturboplay.com
                </a>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'hover:bg-pink-600', href: 'https://instagram.com/mturboplay' },
                { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: 'hover:bg-blue-500', href: 'https://twitter.com/mturboplay' },
                { name: 'TikTok', icon: <span className="text-lg">📱</span>, color: 'hover:bg-black', href: 'https://tiktok.com/@mturboplay' },
                { name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: 'hover:bg-red-600', href: 'https://youtube.com/mturboplay' },
                { name: 'Discord', icon: <MessageSquare className="w-5 h-5" />, color: 'hover:bg-indigo-600', href: 'https://discord.gg/mturboplay' },
              ].map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="sm"
                  className={`border-[#A855F7]/30 text-[#C4B5FD] ${social.color} hover:text-white hover:border-transparent transition-all duration-300`}
                  onClick={() => window.open(social.href, '_blank')}
                >
                  {social.icon}
                </Button>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <Button
              className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#10B981] text-white font-semibold"
              onClick={() => window.open('https://wa.me/96555683677', '_blank')}
            >
              <MessageCircle className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'واتساب' : 'WhatsApp'}
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-[#A855F7]/30" />

        {/* Trust Signals & Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Trust Badges */}
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-white mb-4">
              {isRTL ? 'لماذا تثق بنا؟' : 'Why Trust Us?'}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-[#1A1A2E]/80 border border-[#A855F7]/30 rounded-xl">
                <Shield className="w-8 h-8 text-[#10B981]" />
                <div>
                  <h6 className="font-semibold text-white text-sm">{isRTL ? 'ألعاب أصلية' : 'Original Games'}</h6>
                  <p className="text-xs text-[#C4B5FD]">{isRTL ? 'جميع الألعاب مرخصة رسمياً' : 'All games officially licensed'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#1A1A2E]/80 border border-[#A855F7]/30 rounded-xl">
                <Clock className="w-8 h-8 text-[#F59E0B]" />
                <div>
                  <h6 className="font-semibold text-white text-sm">{isRTL ? 'توصيل فوري' : 'Instant Delivery'}</h6>
                  <p className="text-xs text-[#C4B5FD]">{isRTL ? 'احصل على ألعابك خلال دقائق' : 'Get your games within minutes'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#1A1A2E]/80 border border-[#A855F7]/30 rounded-xl">
                <CheckCircle className="w-8 h-8 text-[#A855F7]" />
                <div>
                  <h6 className="font-semibold text-white text-sm">{isRTL ? 'ضمان الجودة' : 'Quality Guarantee'}</h6>
                  <p className="text-xs text-[#C4B5FD]">{isRTL ? 'رضا العملاء أولويتنا' : 'Customer satisfaction priority'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#1A1A2E]/80 border border-[#A855F7]/30 rounded-xl">
                <Headphones className="w-8 h-8 text-[#E935C1]" />
                <div>
                  <h6 className="font-semibold text-white text-sm">{isRTL ? 'دعم 24/7' : '24/7 Support'}</h6>
                  <p className="text-xs text-[#C4B5FD]">{isRTL ? 'فريق دعم متخصص' : 'Expert support team'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-white mb-4">
              {isRTL ? 'طرق الدفع المتاحة' : 'Payment Methods'}
            </h5>
            <div className="bg-[#1A1A2E]/80 border border-[#A855F7]/30 rounded-xl p-6">
              <div className="flex flex-wrap gap-4 items-center justify-center">
                {[
                  { name: 'Visa', icon: '💳' },
                  { name: 'Mastercard', icon: '💳' },
                  { name: 'KNET', icon: '🏦' },
                  { name: 'Mada', icon: '💳' },
                  { name: 'Apple Pay', icon: '📱' },
                  { name: 'Google Pay', icon: '📱' },
                ].map((payment) => (
                  <div key={payment.name} className="flex items-center gap-2 text-[#C4B5FD] text-sm">
                    <span className="text-2xl">{payment.icon}</span>
                    <span>{payment.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-[#C4B5FD] text-sm mt-4">
                {isRTL ? 'جميع المعاملات آمنة ومشفرة' : 'All transactions are secure and encrypted'}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-[#A855F7]/30" />

        {/* Bottom Footer Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Company Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#E935C1] flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">M-TurboPlay</h3>
              <p className="text-[#C4B5FD] text-sm">
                {isRTL ? 'متجرك الموثوق للألعاب الرقمية' : 'Your trusted digital gaming store'}
              </p>
            </div>
          </div>

          {/* Copyright & Legal */}
          <div className="text-center md:text-right">
            <p className="text-[#C4B5FD] text-sm mb-2">
              © {currentYear} M-TurboPlay. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-[#9CA3AF]">
              <Link to="/privacy-policy" className="hover:text-[#A855F7] transition-colors">
                {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <Link to="/terms-of-service" className="hover:text-[#A855F7] transition-colors">
                {isRTL ? 'شروط الخدمة' : 'Terms of Service'}
              </Link>
              <Link to="/shipping-policy" className="hover:text-[#A855F7] transition-colors">
                {isRTL ? 'سياسة الشحن' : 'Shipping Policy'}
              </Link>
            </div>
          </div>
        </div>

        {/* Gaming Pattern Decoration */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2 text-2xl opacity-20">
            <span>🎮</span>
            <span>⚡</span>
            <span>🎯</span>
            <span>🏆</span>
            <span>🎮</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;