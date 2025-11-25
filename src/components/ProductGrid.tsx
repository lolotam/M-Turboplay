import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Grid3X3, List, Loader2 } from "lucide-react";
import { useCartActions } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { useProducts } from "@/contexts/ProductsContext";
import { useCurrency } from "@/contexts/CurrencyContext";


interface ProductGridProps {
  initialFilter?: 'all' | 'new' | 'bestsellers' | 'toprated' | 'pc' | 'playstation' | 'xbox' | 'nintendo' | 'mobile' | 'action' | 'adventure' | 'rpg' | 'strategy' | 'sports';
}

const ProductGrid: React.FC<ProductGridProps> = ({ initialFilter = 'all' }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'new' | 'bestsellers' | 'toprated' | 'pc' | 'playstation' | 'xbox' | 'nintendo' | 'mobile' | 'action' | 'adventure' | 'rpg' | 'strategy' | 'sports'>(initialFilter);
  const [displayedProducts, setDisplayedProducts] = useState(15); // Start with 15 products
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { addItem } = useCartActions();
  const { toast } = useToast();
  const { products, isLoading } = useProducts();
  const { convertPrices } = useCurrency();


  // Filter products to show only active ones
  const activeProducts = products.filter(product => product.status === 'active');

  // Apply category filter
  const filteredProducts = filter === 'all'
    ? activeProducts
    : activeProducts.filter(product => {
        // For now, show all products until we implement proper categorization
        // This will be updated when we implement the product categorization system
        return true;
      });

  // Get products to display (with pagination)
  const productsToShow = filteredProducts.slice(0, displayedProducts);
  const hasMoreProducts = filteredProducts.length > displayedProducts;

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
        category: product.category === 'tshirts' ? 'physical' : (product.category === 'pc' || product.category === 'playstation' || product.category === 'xbox' || product.category === 'nintendo' || product.category === 'mobile' ? 'physical' : product.category),
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
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setDisplayedProducts(prev => prev + 15);
    setIsLoadingMore(false);
  };

  // Reset displayed products when filter changes
  useEffect(() => {
    setDisplayedProducts(15);
  }, [filter]);

  // Update filter when initialFilter prop changes
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const getFilterLabel = (filterType: string) => {
    switch (filterType) {
      case 'all': return isRTL ? 'جميع الألعاب' : 'All Games';
      case 'new': return isRTL ? 'إصدارات جديدة' : 'New Releases';
      case 'bestsellers': return isRTL ? 'الأكثر مبيعاً' : 'Best Sellers';
      case 'toprated': return isRTL ? 'الأعلى تقييماً' : 'Top Rated';
      case 'pc': return isRTL ? 'الحاسوب' : 'PC';
      case 'playstation': return isRTL ? 'بلايستيشن' : 'PlayStation';
      case 'xbox': return isRTL ? 'إكس بوكس' : 'Xbox';
      case 'nintendo': return isRTL ? 'نينتندو' : 'Nintendo';
      case 'mobile': return isRTL ? 'الجوال' : 'Mobile';
      case 'action': return isRTL ? 'أكشن' : 'Action';
      case 'adventure': return isRTL ? 'مغامرة' : 'Adventure';
      case 'rpg': return isRTL ? 'آر بي جي' : 'RPG';
      case 'strategy': return isRTL ? 'استراتيجية' : 'Strategy';
      case 'sports': return isRTL ? 'رياضة' : 'Sports';
      default: return isRTL ? 'جميع الألعاب' : 'All Games';
    }
  };

  return (
    <section id="shop" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-baloo text-gradient">
            {isRTL ? 'الألعاب المميزة' : 'Featured Games'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isRTL ? 'اكتشف مجموعتنا المختارة من الألعاب الرائجة في جميع الفئات' : 'Discover our handpicked collection of trending games across all genres'}
          </p>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'new', 'bestsellers', 'toprated'].map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "outline"}
                className={filter === filterType ? "btn-hero" : "btn-outline"}
                onClick={() => setFilter(filterType as any)}
              >
                <Filter className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {getFilterLabel(filterType)}
              </Button>
            ))}
          </div>

          {/* Admin Buttons and View Toggle */}
          <div className="flex items-center gap-2">


            {/* View Toggle */}
            <Button
              variant={view === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setView('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={view === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setView('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <Badge variant="secondary" className="text-sm">
            {filteredProducts.length} {t('products.available')}
          </Badge>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">{t('shop.loading')}</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className={`grid gap-6 ${
            view === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {productsToShow.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                titleEn={product.titleEn}
                description={product.description}
                price={typeof product.price === 'number' ? product.price : convertPrices(product.price, 'KWD')}
                originalPrice={product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : convertPrices(product.originalPrice, 'KWD')) : undefined}
                image={product.image}
                category={product.category === 'tshirts' ? 'physical' : (product.category === 'pc' || product.category === 'playstation' || product.category === 'xbox' || product.category === 'nintendo' || product.category === 'mobile' ? 'physical' : product.category)}
                rating={4.8} // Default rating
                isNew={product.isNew}
                isLimited={product.isLimited}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* No Products */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">{t('shop.noProducts')}</h3>
            <p className="text-muted-foreground">{t('shop.noProductsDesc')}</p>
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && hasMoreProducts && (
          <div className="text-center mt-12">
            <Button
              className="btn-outline px-8 py-3"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t('shop.loading')}
                </>
              ) : (
                t('products.showMore')
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;