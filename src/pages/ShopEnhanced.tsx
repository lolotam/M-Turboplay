import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCardEnhanced from "@/components/ProductCardEnhanced";
import ShopFilterPanel from "@/components/ShopFilterPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Search, 
  Filter, 
  Loader2, 
  Grid, 
  List, 
  SlidersHorizontal,
  ChevronDown,
  X
} from "lucide-react";
import { useCartActions } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { useProducts, Product } from "@/contexts/ProductsContext";
import { cn } from "@/lib/utils";

const ShopEnhanced = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const { addItem } = useCartActions();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { products, isLoading } = useProducts();
  const isRTL = i18n.language === 'ar';

  // Advanced filters state
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 1000] as [number, number],
    rating: 0,
    inStock: false,
    isNew: false,
    isDigital: false,
    sortBy: 'featured'
  });

  const activeProducts = useMemo(() => {
    return products.filter(product => product.status === 'active');
  }, [products]);

  // Apply all filters
  const filteredProducts = useMemo(() => {
    let filtered = [...activeProducts];

    // Search filter
    if (filters.search.trim()) {
      const searchTerm_lower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm_lower) ||
        product.titleEn.toLowerCase().includes(searchTerm_lower) ||
        product.description.toLowerCase().includes(searchTerm_lower) ||
        product.descriptionEn.toLowerCase().includes(searchTerm_lower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm_lower))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = typeof product.price === 'number' ? product.price : product.price.SAR || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => 
        (product.rating || 0) >= filters.rating
      );
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => 
        product.stock === undefined || product.stock > 0
      );
    }

    // New products filter
    if (filters.isNew) {
      filtered = filtered.filter(product => product.isNew);
    }

    // Digital products filter
    if (filters.isDigital) {
      filtered = filtered.filter(product => product.isDigital);
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : a.price.SAR || 0;
          const priceB = typeof b.price === 'number' ? b.price : b.price.SAR || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : a.price.SAR || 0;
          const priceB = typeof b.price === 'number' ? b.price : b.price.SAR || 0;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'name-asc':
        filtered.sort((a, b) => (isRTL ? a.title : a.titleEn).localeCompare(isRTL ? b.title : b.titleEn));
        break;
      case 'name-desc':
        filtered.sort((a, b) => (isRTL ? b.title : b.titleEn).localeCompare(isRTL ? a.title : a.titleEn));
        break;
      default: // featured
        // Keep original order or implement featured logic
        break;
    }

    return filtered;
  }, [activeProducts, filters, isRTL]);

  // Get products to display (with pagination)
  const productsToShow = filteredProducts.slice(0, displayedProducts);
  const hasMoreProducts = filteredProducts.length > displayedProducts;

  const handleAddToCart = (productId: string) => {
    const product = activeProducts.find(p => p.id === productId);
    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        titleEn: product.titleEn,
        price: typeof product.price === 'number' ? product.price : product.price.SAR || 0,
        originalPrice: typeof product.originalPrice === 'number'
          ? product.originalPrice
          : typeof product.originalPrice === 'object'
            ? product.originalPrice.SAR
            : undefined,
        image: product.image,
        category: product.category || 'physical',
        isDigital: product.isDigital,
        badge: product.isNew ? (isRTL ? 'جديد' : 'New') : product.isLimited ? (isRTL ? 'محدود' : 'Limited') : undefined,
      });

      toast({
        title: t('messages.addedToCart'),
        description: t('messages.addedToCartDesc', { productName: isRTL ? product.title : product.titleEn }),
      });
    }
  };

  const handleQuickView = (productId: string) => {
    // Implement quick view functionality
    console.log('Quick view:', productId);
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setDisplayedProducts(prev => prev + 12);
    setIsLoadingMore(false);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setDisplayedProducts(12); // Reset pagination when filters change
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      isNew: false,
      isDigital: false,
      sortBy: 'featured'
    });
    setDisplayedProducts(12);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'all') count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    if (filters.isNew) count++;
    if (filters.isDigital) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Event Banner */}
        <div className="mb-8 p-4 bg-gradient-primary rounded-xl text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">{t('shop.eventBanner.title')}</h2>
              <p className="text-sm opacity-90">{t('shop.eventBanner.description')}</p>
            </div>
            <Button variant="secondary" size="sm">
              {t('shop.eventBanner.moreDetails')}
            </Button>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">{t('shop.title')}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('shop.description')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5`} />
            <Input
              placeholder={isRTL ? 'ابحث عن منتجات...' : 'Search products...'}
              value={filters.search}
              onChange={(e) => handleFiltersChange({ ...filters, search: e.target.value })}
              className={cn('text-lg h-12', isRTL ? 'pr-12' : 'pl-12')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t('shop.found')} {filteredProducts.length} {t('products.available')}
            </span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Filter className="w-3 h-3 mr-1" />
                {getActiveFiltersCount()} {isRTL ? 'فلتر نشط' : 'active filters'}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="sm:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {isRTL ? 'الفلترة' : 'Filters'}
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? 'right' : 'left'} className="w-full sm:w-80 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{isRTL ? 'الفلترة والفرز' : 'Filters & Sort'}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterPanelOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <ShopFilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onReset={handleResetFilters}
                />
              </SheetContent>
            </Sheet>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Panel */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ShopFilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
              className="sticky top-4"
            />
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">{t('shop.loading')}</p>
              </div>
            )}

            {/* Products Display */}
            {!isLoading && (
              <>
                <div className={cn(
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                )}>
                  {productsToShow.map((product) => (
                    <ProductCardEnhanced
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      titleEn={product.titleEn}
                      description={product.description}
                      descriptionEn={product.descriptionEn}
                      price={typeof product.price === 'number' ? product.price : product.price.SAR || 0}
                      originalPrice={typeof product.originalPrice === 'number'
                        ? product.originalPrice
                        : typeof product.originalPrice === 'object'
                          ? product.originalPrice.SAR
                          : undefined}
                      image={product.image}
                      category={product.category || 'physical'}
                      rating={product.rating}
                      reviewCount={0} // Default since it doesn't exist in Product interface
                      isNew={product.isNew}
                      isLimited={product.isLimited}
                      isDigital={product.isDigital}
                      stock={product.stock}
                      onAddToCart={handleAddToCart}
                      onQuickView={handleQuickView}
                    />
                  ))}
                </div>

                {/* No Results */}
                {!isLoading && filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">{t('shop.noResults')}</h3>
                    <p className="text-muted-foreground mb-4">{t('shop.noResultsDesc')}</p>
                    <Button onClick={handleResetFilters}>
                      {t('shop.resetSearch')}
                    </Button>
                  </div>
                )}

                {/* Load More */}
                {!isLoading && hasMoreProducts && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          {t('shop.loading')}
                        </>
                      ) : (
                        t('shop.loadMore')
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopEnhanced;