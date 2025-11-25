import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Eye } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartActions } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Product {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isLimited?: boolean;
  rating?: number;
  discount?: number;
}

interface ProductCarouselProps {
  title: string;
  titleEn: string;
  products: Product[];
  badge?: string;
  badgeColor?: string;
  viewAllLink?: string;
  className?: string;
}

const ProductCarousel = ({
  title,
  titleEn,
  products,
  badge,
  badgeColor = "bg-[#A855F7]",
  viewAllLink,
  className = ""
}: ProductCarouselProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCartActions();
  const { toast } = useToast();
  const { convertPrices } = useCurrency();
  const isRTL = i18n.language === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (products.length <= 4 || isAutoScrollPaused) {
      return;
    }

    const interval = setInterval(() => {
      if (scrollRef.current && canScrollRight) {
        scroll('right');
      } else if (scrollRef.current) {
        // Reset to beginning when reaching the end
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [products.length, canScrollRight, isAutoScrollPaused]);

  // Mouse event handlers for pause/resume
  const handleMouseEnter = () => {
    setIsAutoScrollPaused(true);
  };

  const handleMouseLeave = () => {
    setIsAutoScrollPaused(false);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one card + gap
      const newScrollLeft = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      titleEn: product.titleEn,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category as "guide" | "physical" | "consultation",
      isDigital: true,
      badge: product.isNew ? (isRTL ? 'جديد' : 'New') : product.isLimited ? (isRTL ? 'محدود' : 'Limited') : undefined,
    });

    toast({
      title: t('messages.addedToCart'),
      description: t('messages.addedToCartDesc', { productName: isRTL ? product.title : product.titleEn }),
    });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="text-center sm:text-right mb-4 sm:mb-0">
            <div className="flex items-center justify-center sm:justify-end gap-3 mb-2">
              {badge && (
                <Badge className={`${badgeColor} text-white px-3 py-1`}>
                  {badge}
                </Badge>
              )}
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
                {isRTL ? title : titleEn}
              </h2>
              {/* Auto-scroll indicator */}
              {products.length > 4 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full ${isAutoScrollPaused ? 'bg-orange-400' : 'bg-green-400'} transition-colors duration-300`}></div>
                    <div className={`w-2 h-2 rounded-full ${isAutoScrollPaused ? 'bg-muted-foreground/30' : 'bg-green-400'} transition-colors duration-300`}></div>
                    <div className={`w-2 h-2 rounded-full ${isAutoScrollPaused ? 'bg-muted-foreground/30' : 'bg-green-400'} transition-colors duration-300`}></div>
                  </div>
                  <span className="text-xs">
                    {isRTL ? 'تمرير تلقائي' : 'Auto-scroll'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {viewAllLink && (
            <Button
              variant="outline"
              className="border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white"
              onClick={() => navigate(viewAllLink)}
            >
              {isRTL ? 'عرض الكل' : 'View All'}
              <Eye className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Button>
          )}
        </div>

        {/* Carousel Container */}
        <div className="product-carousel">
          {/* Navigation Buttons */}
          {products.length > 4 && (
            <>
              <button
                className={`carousel-nav-btn ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className={`carousel-nav-btn ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Products Container */}
          <div
            ref={scrollRef}
            className="carousel-container"
            onScroll={checkScrollButtons}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {products.map((product) => (
              <Card
                key={product.id}
                className="carousel-item bg-[#1A1A2E] border-[#A855F7]/20 hover:border-[#A855F7]/50 transition-all duration-300 group cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className="p-4">
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-[#6B46C1]/10 to-[#A855F7]/10 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={isRTL ? product.title : product.titleEn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <Badge className="bg-[#10B981] text-white text-xs px-2 py-1">
                          {isRTL ? 'جديد' : 'New'}
                        </Badge>
                      )}
                      {product.discount && (
                        <Badge className="bg-[#E935C1] text-white text-xs px-2 py-1">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-[#A855F7] hover:bg-[#6B46C1] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product.id);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#10B981] hover:bg-[#059669] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-[#A855F7] transition-colors">
                      {isRTL ? product.title : product.titleEn}
                    </h3>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#C4B5FD]">
                          {product.rating}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#10B981]">
                        {product.price} {isRTL ? 'ر.س' : 'SAR'}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-[#9CA3AF] line-through">
                          {product.originalPrice} {isRTL ? 'ر.س' : 'SAR'}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;