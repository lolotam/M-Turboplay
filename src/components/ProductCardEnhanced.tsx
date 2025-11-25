import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star, Download, Users, Shirt, Gamepad2, Monitor, Smartphone, Headphones, Gift, Calendar, Archive, Heart, Eye, Zap, TrendingUp } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { calculateSavingsPercentage } from '@/lib/currency';

interface ProductCardEnhancedProps {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: 'guide' | 'physical' | 'consultation' | 'tshirts' | 'playstation' | 'xbox' | 'nintendo' | 'pc' | 'mobile' | 'accessories' | 'giftcards' | 'preorders' | 'retro' | string;
  rating?: number;
  isNew?: boolean;
  isLimited?: boolean;
  isBestseller?: boolean;
  onAddToCart: (id: string) => void;
  index?: number; // For staggered animations
}

const ProductCardEnhanced = ({
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
  isBestseller = false,
  onAddToCart,
  index = 0
}: ProductCardEnhancedProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { formatPrice, currentCurrency } = useCurrency();
  const isRTL = i18n.language === 'ar';
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Get all available images
  const allImages = [image, ...(images || [])].filter(Boolean);

  // Auto-scroll effect for multiple images
  useEffect(() => {
    if (allImages.length <= 1 || !isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [allImages.length, isHovered]);

  // Staggered animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

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

  const getCategoryColor = () => {
    switch (category) {
      case 'guide':
        return 'from-cyan-500 to-blue-500';
      case 'physical':
        return 'from-purple-500 to-pink-500';
      case 'consultation':
        return 'from-green-500 to-emerald-500';
      case 'tshirts':
        return 'from-orange-500 to-red-500';
      case 'playstation':
        return 'from-blue-500 to-indigo-500';
      case 'xbox':
        return 'from-green-500 to-lime-500';
      case 'nintendo':
        return 'from-red-500 to-pink-500';
      case 'pc':
        return 'from-cyan-500 to-teal-500';
      case 'mobile':
        return 'from-purple-500 to-indigo-500';
      case 'accessories':
        return 'from-gray-500 to-slate-500';
      case 'giftcards':
        return 'from-yellow-500 to-orange-500';
      case 'preorders':
        return 'from-orange-500 to-amber-500';
      case 'retro':
        return 'from-indigo-500 to-purple-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Card 
      className={`product-card-enhanced group relative cursor-pointer overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
        background: 'linear-gradient(145deg, #1A1A2E 0%, #2D1B4E 100%)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
      }}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor()} opacity-5 transition-opacity duration-300 group-hover:opacity-10`} />
      
      {/* Badges */}
      <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-20 flex flex-col gap-2`}>
        {isNew && (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 shadow-lg animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            {t('products.newBadge')}
          </Badge>
        )}
        {isLimited && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 shadow-lg">
            {t('products.limitedBadge')}
          </Badge>
        )}
        {isBestseller && (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 shadow-lg">
            <TrendingUp className="w-3 h-3 mr-1" />
            {isRTL ? 'الأكثر مبيعاً' : 'Bestseller'}
          </Badge>
        )}
      </div>

      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} z-20 p-2 rounded-full bg-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
          isLiked ? 'text-red-500' : 'text-white/70'
        }`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40 z-10" />
        
        {/* Image Gallery */}
        <div className="relative h-full">
          {allImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
              style={{
                filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
              }}
            />
          ))}
        </div>

        {/* Image Indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
            {allImages.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm z-15 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex gap-3">
            <Button
              size="sm"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <Badge className={`bg-gradient-to-r ${getCategoryColor()} text-white text-xs px-2 py-1 flex items-center gap-1`}>
            {getCategoryIcon()}
            {t(`products.category.${category}`)}
          </Badge>
          {rating && (
            <div className="flex items-center gap-1 text-xs text-yellow-400">
              <Star className="w-3 h-3 fill-current" />
              <span>{rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-bold text-lg text-white line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
            {isRTL ? title : titleEn}
          </h3>
          <p className="text-sm text-gray-400 italic line-clamp-1">{isRTL ? titleEn : title}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {originalPrice && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1">
              -{calculateSavingsPercentage(originalPrice, price, currentCurrency)}%
            </Badge>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-glow"
        >
          <ShoppingCart className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('products.addToCart')}
        </Button>
      </div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r ${getCategoryColor()} opacity-0 transition-opacity duration-300 group-hover:opacity-30 -z-1`} />
    </Card>
  );
};

export default ProductCardEnhanced;