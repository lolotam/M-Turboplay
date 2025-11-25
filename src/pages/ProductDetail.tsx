import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductDetailTemplate from '@/components/ProductDetailTemplate';
import { useProducts } from '@/contexts/ProductsContext';
import { useCartActions } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { products } = useProducts();
  const { addItem } = useCartActions();
  const isRTL = i18n.language === 'ar';

  // Find the product by ID
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {isRTL ? 'المنتج غير موجود' : 'Product Not Found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isRTL ? 'المنتج المطلوب غير متوفر' : 'The requested product is not available'}
          </p>
          <Button
            onClick={() => navigate('/shop')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isRTL ? 'العودة للمتجر' : 'Back to Shop'}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    const price = typeof product.price === 'number' ? product.price : (product.price as any)?.KWD || 0;
    const originalPrice = typeof product.originalPrice === 'number' ? product.originalPrice : (product.originalPrice as any)?.KWD || 0;

    addItem({
      id: product.id,
      title: product.title,
      titleEn: product.titleEn,
      price: price,
      originalPrice: originalPrice,
      image: product.images?.[0] || product.image,
      category: product.category as any,
      isDigital: product.isDigital,
      quantity: 1
    });

    toast.success(
      isRTL ? 'تم إضافة المنتج للسلة بنجاح!' : 'Product added to cart successfully!',
      {
        description: isRTL
          ? `تم إضافة "${product.title}" إلى سلة التسوق`
          : `"${product.title}" has been added to your cart`
      }
    );
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    toast.info(
      isRTL ? 'تم إضافة المنتج للمفضلة!' : 'Added to wishlist!',
      {
        description: isRTL
          ? `تم إضافة "${product.title}" إلى قائمة المفضلة`
          : `"${product.title}" has been added to your wishlist`
      }
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success(
        isRTL ? 'تم نسخ رابط المنتج!' : 'Product link copied!',
        {
          description: isRTL
            ? 'تم نسخ رابط المنتج إلى الحافظة'
            : 'Product link has been copied to clipboard'
        }
      );
    }
  };

  // Convert product data to match ProductDetailTemplate interface
  const templateProduct = {
    id: product.id,
    title: product.title,
    titleEn: product.titleEn || product.title,
    description: product.description,
    descriptionEn: product.descriptionEn || product.description,
    price: typeof product.price === 'number' ? product.price : (product.price as any)?.KWD || 0,
    originalPrice: typeof product.originalPrice === 'number' ? product.originalPrice : (product.originalPrice as any)?.KWD || 0,
    image: product.images?.[0] || product.image,
    category: product.category as any,
    isNew: product.isNew,
    isLimited: product.isLimited,
    rating: product.rating
  };

  return (
    <div className="relative">
      <Header />

      {/* Back Button */}
      <div className="absolute top-20 left-4 z-10">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="bg-purple-800/80 border-purple-600 text-white hover:bg-purple-700 backdrop-blur-sm"
        >
          {isRTL ? (
            <>
              <ArrowRight className="w-4 h-4 mr-2" />
              العودة
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </>
          )}
        </Button>
      </div>

      {/* Product Detail Template */}
      <ProductDetailTemplate
        product={templateProduct}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onShare={handleShare}
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;