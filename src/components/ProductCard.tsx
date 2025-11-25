import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star, Download, Users, Shirt, Gamepad2, Monitor, Smartphone, Headphones, Gift, Calendar, Archive } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { calculateSavingsPercentage } from '@/lib/currency';

interface ProductCardProps {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[]; // Support for multiple images
  category: 'guide' | 'physical' | 'consultation' | 'tshirts' | 'playstation' | 'xbox' | 'nintendo' | 'pc' | 'mobile' | 'accessories' | 'giftcards' | 'preorders' | 'retro' | string;
  rating?: number;
  isNew?: boolean;
  isLimited?: boolean;
  onAddToCart: (id: string) => void;
}

const ProductCard = ({
  id,
  title,
  titleEn,
  description,
  price,
  originalPrice,
  image,
  images,
  category,
  rating = 4.8,
  isNew = false,
  isLimited = false,
  onAddToCart
}: ProductCardProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { formatPrice, currentCurrency } = useCurrency();
  const isRTL = i18n.language === 'ar';

  // Auto-scroll functionality for multiple images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Get all available images
  const allImages = [image, ...(images || [])].filter(Boolean);

  // Auto-scroll effect
  useEffect(() => {
    if (allImages.length <= 1 || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [allImages.length, isPaused]);

  // Mouse event handlers for pause/resume
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'guide':
        return <Download className="w-4 h-4" />;
      case 'physical':
        return <ShoppingCart className="w-4 h-4" />;
      case 'consultation':
        return <Users className="w-4 h-4" />;
      case 'tshirts':
        return <Shirt className="w-4 h-4" />;
      case 'playstation':
      case 'xbox':
      case 'nintendo':
      case 'pc':
      case 'mobile':
        return <Gamepad2 className="w-4 h-4" />;
      case 'accessories':
        return <Headphones className="w-4 h-4" />;
      case 'giftcards':
        return <Gift className="w-4 h-4" />;
      case 'preorders':
        return <Calendar className="w-4 h-4" />;
      case 'retro':
        return <Archive className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = () => {
    return t(`products.category.${category}`);
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'guide':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'physical':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'consultation':
        return 'bg-success/20 text-success border-success/30';
      case 'tshirts':
        return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'playstation':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'xbox':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'nintendo':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'pc':
        return 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30';
      case 'mobile':
        return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30';
      case 'accessories':
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      case 'giftcards':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'preorders':
        return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'retro':
        return 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card 
      className="product-card group relative cursor-pointer hover:shadow-lg transition-shadow duration-200" 
      onClick={handleCardClick}
    >
      {/* Badges */}
      <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-10 flex flex-col gap-2`}>
        {isNew && (
          <Badge className="bg-success text-success-foreground">
            {t('products.newBadge')}
          </Badge>
        )}
        {isLimited && (
          <Badge className="bg-warning text-warning-foreground">
            {t('products.limitedBadge')}
          </Badge>
        )}
      </div>

      {/* Category Badge */}
      <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} z-10`}>
        <Badge className={`${getCategoryColor()} flex items-center gap-1 text-xs`}>
          {getCategoryIcon()}
          {getCategoryLabel()}
        </Badge>
      </div>

      {/* Product Image */}
      <div
        className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/80"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={allImages[currentImageIndex]}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Auto-scroll indicator for multiple images */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <div className="flex gap-1">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {isRTL ? title : titleEn}
          </h3>
          <p className="text-sm text-muted-foreground italic">{isRTL ? titleEn : title}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">(127 {t('products.rating')})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {originalPrice && (
            <Badge className="bg-destructive/20 text-destructive border-destructive/30">
              {t('products.save')} {calculateSavingsPercentage(originalPrice, price, currentCurrency)}%
            </Badge>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(id);
          }}
          className="w-full btn-hero group-hover:shadow-purple-glow relative z-10"
        >
          <ShoppingCart className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('products.addToCart')}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;