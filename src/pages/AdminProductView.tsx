import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductDetailTemplate from '@/components/ProductDetailTemplate';
import { useProducts } from '@/contexts/ProductsContext';
import { useCartActions } from '@/contexts/CartContext';

const AdminProductView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { products } = useProducts();
  const { addItem } = useCartActions();
  const isRTL = i18n.language === 'ar';

  const product = products.find(p => p.id === id);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      title: product.title,
      titleEn: product.titleEn || product.title,
      price: typeof product.price === 'number' ? product.price : product.price.KWD,
      image: product.image,
      category: product.category as 'guide' | 'physical' | 'consultation',
      isDigital: product.isDigital || false
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
    if (!product) return;

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
    if (!product) return;

    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {isRTL ? 'المنتج غير موجود' : 'Product Not Found'}
          </h1>
          <p className="text-purple-200 mb-6">
            {isRTL ? 'المنتج المطلوب غير متوفر' : 'The requested product is not available'}
          </p>
          <Button
            onClick={() => navigate('/admin/products')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isRTL ? 'العودة للمنتجات' : 'Back to Products'}
          </Button>
        </div>
      </div>
    );
  }

  // Convert product data to match ProductDetailTemplate interface
  const templateProduct = {
    id: product.id,
    title: product.title,
    titleEn: product.titleEn || product.title,
    description: product.description,
    descriptionEn: product.descriptionEn || product.description,
    price: typeof product.price === 'number' ? product.price : product.price.KWD,
    originalPrice: product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : product.originalPrice.KWD) : undefined,
    image: product.image,
    category: product.category,
    isNew: product.isNew,
    isLimited: product.isLimited,
    rating: 4.8,
    reviewCount: 127
  };

  return (
    <div className="relative">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/admin/products')}
              variant="outline"
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              {isRTL ? (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  العودة للمنتجات
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Products
                </>
              )}
            </Button>
            <h1 className="text-xl font-bold">
              {isRTL ? 'معاينة المنتج - لوحة الإدارة' : 'Product Preview - Admin Panel'}
            </h1>
          </div>

          <Button
            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isRTL ? 'تعديل المنتج' : 'Edit Product'}
          </Button>
        </div>
      </div>

      {/* Product Detail Template */}
      <ProductDetailTemplate
        product={templateProduct}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onShare={handleShare}
      />
    </div>
  );
};

export default AdminProductView;