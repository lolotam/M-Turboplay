import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, ExternalLink, Package, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ProductCardEnhancedProps {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isLimited?: boolean;
  isDigital?: boolean;
  stock?: number;
  onAddToCart: (id: string) => void;
  onQuickView?: (id: string) => void;
  className?: string;
}

const ProductCardEnhanced = ({
  id,
  title,
  titleEn,
  description,
  descriptionEn,
  price,
  originalPrice,
  image,
  category,
  rating = 0,
  reviewCount = 0,
  isNew,
  isLimited,
  isDigital,
  stock,
  onAddToCart,
  onQuickView,
  className
}: ProductCardEnhancedProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const currentTitle = isRTL ? title : titleEn;
  const currentDescription = isRTL ? description : descriptionEn;
  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isInStock = stock === undefined || stock > 0;
  const currency = i18n.language === 'ar' ? 'ر.س' : 'SAR';

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-3 h-3",
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(id);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container - 1:1 Aspect Ratio */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Image */}
        <img
          src={image}
          alt={currentTitle}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-500",
            isHovered ? "scale-110" : "scale-100",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* Image Loading Placeholder */}
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <Badge variant="secondary" className="bg-green-500 text-white text-xs">
              {isRTL ? 'جديد' : 'New'}
            </Badge>
          )}
          {isLimited && (
            <Badge variant="destructive" className="text-xs">
              {isRTL ? 'محدود' : 'Limited'}
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{discountPercentage}%
            </Badge>
          )}
          {isDigital && (
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
              <Package className="w-3 h-3 ml-1" />
              {isRTL ? 'رقمي' : 'Digital'}
            </Badge>
          )}
        </div>

        {/* Stock Status */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-3 py-1">
              {isRTL ? 'نفد المخزون' : 'Out of Stock'}
            </Badge>
          </div>
        )}

        {/* Quick Actions */}
        <div className={cn(
          "absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
            onClick={toggleFavorite}
          >
            <Heart className={cn("w-4 h-4", isFavorited ? "fill-red-500 text-red-500" : "")} />
          </Button>
          {onQuickView && (
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleQuickView}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Hover Overlay */}
        {isHovered && isInStock && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
            <Button
              className="w-full bg-white text-black hover:bg-gray-100"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 ml-2" />
              {isRTL ? 'أضف للسلة' : 'Add to Cart'}
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        {/* Category */}
        <div className="text-xs text-muted-foreground mb-1 capitalize">
          {category}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {currentTitle}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {renderStars(rating)}
            </div>
            <span className="text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Stock Info */}
        {stock !== undefined && stock <= 10 && stock > 0 && (
          <div className="flex items-center gap-1 text-orange-600 text-xs mb-2">
            <Clock className="w-3 h-3" />
            {isRTL ? `متبقي ${stock} فقط` : `Only ${stock} left`}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg">
            {currency} {price}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              {currency} {originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!isInStock}
          variant={isInStock ? "default" : "outline"}
        >
          <ShoppingCart className="w-4 h-4 ml-2" />
          {isInStock 
            ? (isRTL ? 'أضف للسلة' : 'Add to Cart')
            : (isRTL ? 'نفد المخزون' : 'Out of Stock')
          }
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCardEnhanced;