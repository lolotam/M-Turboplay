import { useState, useEffect } from "react";
import ProductCardEnhanced from "./ProductCardEnhanced";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Grid3X3, List, Loader2, Sparkles, TrendingUp, Zap, Star } from "lucide-react";
import { useCartActions } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { useProducts } from "@/contexts/ProductsContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const ProductGridEnhanced = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'new' | 'bestsellers' | 'toprated' | 'trending'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [displayedProducts, setDisplayedProducts] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addItem } = useCartActions();
  const { toast } = useToast();
  const { products, isLoading } = useProducts();
  const { convertPrices } = useCurrency();

  // Filter products to show only active ones
  const activeProducts = products.filter(product => product.status === 'active');

  // Apply filters and sorting
  const processedProducts = activeProducts
    .filter(product => {
      if (filter === 'all') return true;
      if (filter === 'new') return product.isNew;
      if (filter === 'bestsellers') return Math.random() > 0.7; // Random for demo
      if (filter === 'toprated') return (product.rating || 0) >= 4.5;
      if (filter === 'trending') return product.isNew || Math.random() > 0.6;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (typeof a.price === 'number' ? a.price : convertPrices(a.price, 'KWD')) - 
                 (typeof b.price === 'number' ? b.price : convertPrices(b.price, 'KWD'));
        case 'price-high':
          return (typeof b.price === 'number' ? b.price : convertPrices(b.price, 'KWD')) - 
                 (typeof a.price === 'number' ? a.price : convertPrices(a.price, 'KWD'));
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });

  // Get products to display with pagination
  const productsToShow = processedProducts.slice(0, displayedProducts);
  const hasMoreProducts = processedProducts.length > displayedProducts;

  const handleAddToCart = (id: string) => {
    const product = activeProducts.find(p => p.id === id);
    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        titleEn: product.titleEn,
        price: typeof product.price === 'number' ? product.price : convertPrices(product.price, 'KWD'),
        originalPrice: product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : convertPrices(product.originalPrice, 'KWD')) : undefined,
        image: product.image,
        category: product.category === 'tshirts' ? 'physical' : product.category as any,
        isDigital: product.isDigital,
        badge: product.isNew ? (isRTL ? 'جديد' : 'New') : product.isLimited ? (isRTL ? 'محدود' : 'Limited') : undefined,
      });

      toast({
        title: t('messages.addedToCart'),
        description: t('messages.addedToCartDesc', { productName: isRTL ? product.title : product.titleEn }),
      });
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedProducts(prev => prev + 8);
    setIsLoadingMore(false);
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setIsAnimating(true);
    setTimeout(() => {
      setFilter(newFilter);
      setDisplayedProducts(12);
      setIsAnimating(false);
    }, 300);
  };

  const handleSortChange = (newSort: typeof sortBy) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSortBy(newSort);
      setIsAnimating(false);
    }, 300);
  };

  const getFilterIcon = (filterType: string) => {
    switch (filterType) {
      case 'new': return <Zap className="w-4 h-4" />;
      case 'bestsellers': return <TrendingUp className="w-4 h-4" />;
      case 'toprated': return <Star className="w-4 h-4" />;
      case 'trending': return <Sparkles className="w-4 h-4" />;
      default: return <Filter className="w-4 h-4" />;
    }
  };

  const getFilterLabel = (filterType: string) => {
    switch (filterType) {
      case 'all': return isRTL ? 'جميع المنتجات' : 'All Products';
      case 'new': return isRTL ? 'واصل حديثاً' : 'New Arrivals';
      case 'bestsellers': return isRTL ? 'الأكثر مبيعاً' : 'Bestsellers';
      case 'toprated': return isRTL ? 'الأعلى تقييماً' : 'Top Rated';
      case 'trending': return isRTL ? 'الرائج الآن' : 'Trending Now';
      default: return isRTL ? 'جميع المنتجات' : 'All Products';
    }
  };

  const getSortLabel = (sortType: string) => {
    switch (sortType) {
      case 'featured': return isRTL ? 'المميزة' : 'Featured';
      case 'price-low': return isRTL ? 'السعر: منخفض إلى مرتفع' : 'Price: Low to High';
      case 'price-high': return isRTL ? 'السعر: مرتفع إلى منخفض' : 'Price: High to Low';
      case 'rating': return isRTL ? 'التقييم' : 'Rating';
      case 'newest': return isRTL ? 'الأحدث' : 'Newest';
      default: return isRTL ? 'المميزة' : 'Featured';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold font-baloo text-gradient">
              {isRTL ? 'منتجات مذهلة' : 'Amazing Products'}
            </h2>
            <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isRTL ? 'اكتشف مجموعتنا المختارة بعناية من المنتجات الرائعة في جميع الفئات' : 'Discover our carefully curated collection of amazing products across all categories'}
          </p>
        </div>

        {/* Enhanced Filters Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {(['all', 'new', 'bestsellers', 'trending'] as const).map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? "default" : "outline"}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    filter === filterType 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                      : 'border-purple-500/30 text-purple-300 hover:border-purple-500/60 hover:bg-purple-500/10'
                  }`}
                  onClick={() => handleFilterChange(filterType)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {getFilterIcon(filterType)}
                    {getFilterLabel(filterType)}
                  </span>
                  {filter === filterType && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse" />
                  )}
                </Button>
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                  className="bg-purple-900/30 border border-purple-500/30 text-purple-200 px-4 py-2 rounded-lg focus:outline-none focus:border-purple-400 appearance-none cursor-pointer"
                >
                  {(['featured', 'price-low', 'price-high', 'rating', 'newest'] as const).map((sortType) => (
                    <option key={sortType} value={sortType} className="bg-purple-900">
                      {getSortLabel(sortType)}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex bg-purple-900/30 rounded-lg p-1 border border-purple-500/30">
                <Button
                  variant={view === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView('grid')}
                  className={`px-3 py-2 ${view === 'grid' ? 'bg-purple-500 text-white' : 'text-purple-300 hover:text-purple-200'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={view === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView('list')}
                  className={`px-3 py-2 ${view === 'list' ? 'bg-purple-500 text-white' : 'text-purple-300 hover:text-purple-200'}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between">
          <Badge variant="secondary" className="bg-purple-900/30 text-purple-200 border-purple-500/30 px-4 py-2">
            {processedProducts.length} {isRTL ? 'منتج متاح' : 'products available'}
          </Badge>
          {filter !== 'all' && (
            <Button
              variant="outline"
              onClick={() => handleFilterChange('all')}
              className="border-purple-500/30 text-purple-300 hover:border-purple-500/60 hover:bg-purple-500/10"
            >
              {isRTL ? 'مسح الفلتر' : 'Clear Filter'}
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="relative inline-flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
              <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
            </div>
            <p className="text-muted-foreground mt-4">{isRTL ? 'جاري التحميل...' : 'Loading amazing products...'}</p>
          </div>
        )}

        {/* Products Grid with Animation */}
        {!isLoading && (
          <div className={`transition-all duration-500 ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}>
            <div className={`grid gap-8 ${
              view === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {productsToShow.map((product, index) => (
                <div
                  key={product.id}
                  className="transform transition-all duration-500 hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <ProductCardEnhanced
                    id={product.id}
                    title={product.title}
                    titleEn={product.titleEn}
                    description={product.description}
                    price={typeof product.price === 'number' ? product.price : convertPrices(product.price, 'KWD')}
                    originalPrice={product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : convertPrices(product.originalPrice, 'KWD')) : undefined}
                    image={product.image}
                    images={product.images}
                    category={product.category === 'tshirts' ? 'physical' : product.category}
                    rating={product.rating || 4.8}
                    isNew={product.isNew}
                    isLimited={product.isLimited}
                    isBestseller={Math.random() > 0.8}
                    onAddToCart={handleAddToCart}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Products */}
        {!isLoading && processedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 animate-bounce">📦</div>
            <h3 className="text-2xl font-bold mb-4 text-gradient">
              {isRTL ? 'لا توجد منتجات' : 'No Products Found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isRTL ? 'لم نعثر على منتجات تطابق معايير البحث الخاصة بك' : 'We couldn\'t find any products matching your criteria'}
            </p>
            <Button
              onClick={() => handleFilterChange('all')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isRTL ? 'عرض جميع المنتجات' : 'Show All Products'}
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && hasMoreProducts && (
          <div className="text-center mt-16">
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/25 transform transition-all duration-300 hover:scale-105"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {isRTL ? 'جاري التحميل...' : 'Loading...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isRTL ? 'عرض المزيد من المنتجات الرائعة' : 'Load More Amazing Products'}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGridEnhanced;