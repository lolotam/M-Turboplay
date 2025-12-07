import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Truck,
  Shield,
  User,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Download,
  Package,
  Users,
  Shirt
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface ProductDetailTemplateProps {
  product: {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[]; // Support for multiple images
    category: 'guide' | 'physical' | 'consultation' | 'tshirts';
    isNew?: boolean;
    isLimited?: boolean;
    rating?: number;
    reviewCount?: number;
  };
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onShare?: () => void;
}

const ProductDetailTemplate: React.FC<ProductDetailTemplateProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onShare
}) => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const isRTL = i18n.language === 'ar';

  // State for image gallery
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  // Get all available images (main image + additional images)
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  // Sync Carousel with state
  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setSelectedImageIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const handleMouseEnter = () => {
    // Handled by Autoplay plugin options
  };

  const handleMouseLeave = () => {
    // Handled by Autoplay plugin options
  };

  const getCategoryIcon = () => {
    switch (product.category) {
      case 'guide':
        return <Download className="w-5 h-5" />;
      case 'physical':
        return <Package className="w-5 h-5" />;
      case 'consultation':
        return <Users className="w-5 h-5" />;
      case 'tshirts':
        return <Shirt className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = () => {
    switch (product.category) {
      case 'guide':
        return isRTL ? 'أدلة رقمية' : 'Digital Guides';
      case 'physical':
        return isRTL ? 'منتجات فعلية' : 'Physical Products';
      case 'consultation':
        return isRTL ? 'جلسات إرشادية' : 'Consultation Sessions';
      case 'tshirts':
        return isRTL ? 'التشيرتات' : 'T-shirts';
    }
  };

  const getDeliveryContent = () => {
    switch (product.category) {
      case 'guide':
        return {
          title: isRTL ? 'كيف يوصلني المنتج؟' : 'How will I receive the product?',
          steps: isRTL ? [
            'هذا المنتج تحصل عليه فقط في داخل اللعبة، كل اللي عليك تعطينا يوزرك في روبلوكس من تحت، وأحنا بنكلمك في الواتس اب وندخل سوا وتسلمك الطلب ( لازم تدخل سوا في نفس السيرفر )',
          ] : [
            'This product is delivered inside the game. Just provide your Roblox username below, and we will contact you on WhatsApp to join the same server and deliver your order.',
          ]
        };
      case 'physical':
        return {
          title: isRTL ? 'كيف يوصلني المنتج؟' : 'How will I receive the product?',
          steps: isRTL ? [
            'المنتجات الفعلية يتم توصيلها عبر شركات الشحن المعتمدة',
            'سيتم التواصل معك لتأكيد عنوان التوصيل',
            'التوصيل مجاني داخل الكويت'
          ] : [
            'Physical products are delivered through certified shipping companies',
            'We will contact you to confirm the delivery address',
            'Free delivery within Kuwait'
          ]
        };
      case 'consultation':
        return {
          title: isRTL ? 'كيف تتم الجلسة؟' : 'How does the session work?',
          steps: isRTL ? [
            'سيتم التواصل معك لتحديد موعد الجلسة',
            'الجلسة تتم عبر الإنترنت أو الهاتف',
            'مدة الجلسة حسب الباقة المختارة'
          ] : [
            'We will contact you to schedule the session',
            'Session conducted online or by phone',
            'Session duration according to selected package'
          ]
        };
      case 'tshirts':
        return {
          title: isRTL ? 'كيف يوصلني المنتج؟' : 'How will I receive the product?',
          steps: isRTL ? [
            'التشيرتات يتم توصيلها عبر شركات الشحن المعتمدة',
            'سيتم التواصل معك لتأكيد المقاس والعنوان',
            'التوصيل مجاني داخل الكويت والخليج'
          ] : [
            'T-shirts are delivered through certified shipping companies',
            'We will contact you to confirm size and address',
            'Free delivery within Kuwait and Gulf countries'
          ]
        };
      default:
        // Default fallback for any other categories
        return {
          title: isRTL ? 'كيف يوصلني المنتج؟' : 'How will I receive the product?',
          steps: isRTL ? [
            'سيتم التواصل معك لتأكيد طريقة التوصيل',
            'التوصيل حسب نوع المنتج'
          ] : [
            'We will contact you to confirm delivery method',
            'Delivery according to product type'
          ]
        };
    }
  };

  const getTimingContent = () => {
    switch (product.category) {
      case 'guide':
        return {
          title: isRTL ? 'متى يوصلني المنتج؟' : 'When will I receive the product?',
          timing: isRTL ? 'التسليم من 5 دقائق إلى 24 ساعة' : 'Delivery from 5 minutes to 24 hours',
          note: isRTL ? '( قد يتأخر التسليم أكثر من ذلك في أوقات الضغط والدروة )' : '( Delivery may be delayed during peak times )'
        };
      case 'physical':
        return {
          title: isRTL ? 'متى يوصلني المنتج؟' : 'When will I receive the product?',
          timing: isRTL ? 'التوصيل من 1-3 أيام عمل' : 'Delivery within 1-3 business days',
          note: isRTL ? '( قد يتأخر التوصيل في المناطق النائية )' : '( Delivery may be delayed to remote areas )'
        };
      case 'consultation':
        return {
          title: isRTL ? 'متى تتم الجلسة؟' : 'When will the session take place?',
          timing: isRTL ? 'حسب الموعد المتفق عليه' : 'According to agreed schedule',
          note: isRTL ? '( يمكن تحديد الموعد خلال 24 ساعة )' : '( Schedule can be set within 24 hours )'
        };
      case 'tshirts':
        return {
          title: isRTL ? 'متى يوصلني المنتج؟' : 'When will I receive the product?',
          timing: isRTL ? 'التوصيل من 2-5 أيام عمل' : 'Delivery within 2-5 business days',
          note: isRTL ? '( قد يتأخر التوصيل للطلبات المخصصة )' : '( Custom orders may take longer )'
        };
      default:
        // Default fallback for any other categories
        return {
          title: isRTL ? 'متى يوصلني المنتج؟' : 'When will I receive the product?',
          timing: isRTL ? 'سيتم التواصل معك لتحديد موعد التسليم' : 'We will contact you to confirm delivery timing',
          note: isRTL ? '( حسب نوع المنتج )' : '( According to product type )'
        };
    }
  };

  const deliveryContent = getDeliveryContent();
  const timingContent = getTimingContent();

  const calculateSavings = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Product Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {getCategoryIcon()}
            <Badge variant="secondary" className="bg-purple-700 text-white">
              {getCategoryLabel()}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {isRTL ? product.title : product.titleEn}
          </h1>
          <p className="text-lg text-purple-200 mb-6">
            {isRTL ? product.titleEn : product.title}
          </p>

          {/* Product Image Gallery */}
          <div className="flex justify-center mb-8">
            <div className="max-w-lg w-full relative">
              {/* Main Image Carousel */}
              {/* Carousel Component Commented Out for Debugging
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 3000,
                    stopOnInteraction: true,
                    stopOnMouseEnter: true,
                  }),
                ]}
                setApi={setApi}
                className="w-full relative group mb-4"
              >
                <CarouselContent>
                  {allImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="relative aspect-square overflow-hidden rounded-xl border border-purple-400/30 bg-white/10 backdrop-blur-sm">
                          <img
                            src={image}
                            alt={`${isRTL ? product.title : product.titleEn} ${index + 1}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-product.jpg';
                            }}
                          />
                          {! Ignore overlay for now !}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {allImages.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 border-none text-white h-10 w-10" />
                    <CarouselNext className="right-4 bg-black/50 hover:bg-black/70 border-none text-white h-10 w-10" />
                  </>
                )}
              </Carousel>
              */}
              <div className="text-white text-center p-10 bg-red-900">Carousel Debug Placeholder</div>

              {/* Rating Display (Overlay relative to container) */}
              {product.rating && (
                <div className="absolute bottom-28 left-6 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 z-10 pointer-events-none">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                          }`}
                      >
                        ⭐
                      </div>
                    ))}
                  </div>
                  <span className="text-white text-sm font-medium">
                    {product.rating}
                  </span>
                  {product.reviewCount && (
                    <span className="text-gray-300 text-xs">
                      ({product.reviewCount})
                    </span>
                  )}
                </div>
              )}

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        api?.scrollTo(index);
                        setSelectedImageIndex(index);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index
                        ? 'border-purple-400 ring-2 ring-purple-400/50'
                        : 'border-purple-400/30 hover:border-purple-400/60'
                        } `}
                    >
                      <img
                        src={image}
                        alt={`${isRTL ? product.title : product.titleEn} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing and Action Buttons - Centered Vertically */}
          <div className="flex flex-col items-center justify-center gap-6 mb-8">
            {/* Pricing */}
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl font-bold text-yellow-400">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && (
                <>
                  <div className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                  <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                    {isRTL ? `وفر ${calculateSavings()}%` : `Save ${calculateSavings()}%`}
                  </Badge>
                </>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={onAddToCart}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
            >
              {isRTL ? 'أضف للسلة' : 'Add to Cart'}
            </Button>

            {/* Secondary Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={onAddToWishlist}
                className="border-purple-400 text-purple-200 hover:bg-purple-700"
              >
                <Heart className="w-5 h-5 mr-2" />
                {isRTL ? 'المفضلة' : 'Wishlist'}
              </Button>
              <Button
                variant="outline"
                onClick={onShare}
                className="border-purple-400 text-purple-200 hover:bg-purple-700"
              >
                <Share2 className="w-5 h-5 mr-2" />
                {isRTL ? 'مشاركة' : 'Share'}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-purple-800/50 border-purple-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Package className="w-5 h-5 text-purple-300" />
                {isRTL ? 'وصف المنتج' : 'Product Description'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-purple-200">
                    {isRTL ? 'الوصف (العربية)' : 'Description (Arabic)'}
                  </h4>
                  <p className="text-sm leading-relaxed" dir="rtl">
                    {product.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-purple-200">
                    {isRTL ? 'الوصف (الإنجليزية)' : 'Description (English)'}
                  </h4>
                  <p className="text-sm leading-relaxed" dir="ltr">
                    {product.descriptionEn}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Cards */}
        <div className="grid gap-6 max-w-4xl mx-auto">
          {/* Delivery Information */}
          <Card className="bg-purple-800/50 border-purple-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Truck className="w-5 h-5 text-purple-300" />
                {deliveryContent.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <ul className="space-y-3">
                {deliveryContent.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Timing Information */}
          <Card className="bg-purple-800/50 border-purple-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-purple-300" />
                {timingContent.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">{timingContent.timing}</span>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <span className="text-sm text-purple-200">{timingContent.note}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card className="bg-purple-800/50 border-purple-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-purple-300" />
                {isRTL ? 'الشروط والأحكام' : 'Terms and Conditions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>
                    {isRTL
                      ? 'جميع المنتجات أصلية ومضمونة الجودة'
                      : 'All products are original and quality guaranteed'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>
                    {isRTL
                      ? 'إمكانية الإرجاع خلال 7 أيام من الاستلام'
                      : 'Return possible within 7 days of receipt'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>
                    {isRTL
                      ? 'دعم فني متاح 24/7 عبر الواتساب'
                      : '24/7 technical support via WhatsApp'
                    }
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-purple-800/50 border-purple-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageCircle className="w-5 h-5 text-purple-300" />
                {isRTL ? 'معلومات التواصل' : 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-300" />
                  <div>
                    <div className="font-semibold">
                      {isRTL ? 'فريق الدعم' : 'Support Team'}
                    </div>
                    <div className="text-sm text-purple-200">
                      {isRTL ? 'متاح للمساعدة في أي وقت' : 'Available to help anytime'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-purple-300" />
                  <div>
                    <div className="font-semibold">+965 55683677</div>
                    <div className="text-sm text-purple-200">
                      {isRTL ? 'واتساب - متاح 24/7' : 'WhatsApp - Available 24/7'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roblox Compliance Notice */}
          <Card className="bg-blue-900/50 border-blue-600 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <span className="font-semibold text-blue-300">
                    {isRTL ? 'ملتزمون 100% بسياسات Roblox' : '100% Roblox Policy Compliant'}
                  </span>
                </div>
                <p className="text-sm text-blue-200">
                  {isRTL
                    ? 'نحن نلتزم التزاماً كاملاً بجميع سياسات وقوانين منصة Roblox. لا نبيع عناصر أو حيوانات داخلية خارج نطاق اللعبة.'
                    : 'We are fully compliant with all Roblox policies and terms. We do not sell in-game items outside of the official platform.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailTemplate;
