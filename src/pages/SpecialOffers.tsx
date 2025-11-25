import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Percent,
  Clock
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { useCartActions } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';

const SpecialOffers = () => {
  const { products } = useProducts();
  const { t, i18n } = useTranslation();
  const { addItem } = useCartActions();
  const { toast } = useToast();
  const { convertPrices } = useCurrency();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('discount');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const itemsPerPage = 12;

  // Filter products for "Special Offers" - products with discounts or limited time offers
  const specialOfferProducts = useMemo(() => {
    return products.filter(product =>
      product.status === 'active' &&
      (product.originalPrice || product.isLimited || Math.random() > 0.8) // Products with original price or limited items
    );
  }, [products]);

  // Get unique categories from special offer products
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    specialOfferProducts.forEach(product => {
      if (product.categories) {
        product.categories.forEach(cat => categories.add(cat));
      } else if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories);
  }, [specialOfferProducts]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = specialOfferProducts;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.titleEn.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.descriptionEn.toLowerCase().includes(query) ||
        (product.categories && product.categories.some(cat => cat.toLowerCase().includes(query))) ||
        (product.category && product.category.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        (product.categories && product.categories.includes(selectedCategory)) ||
        product.category === selectedCategory
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          const priceA = typeof a.price === 'number' ? a.price : a.price.KWD || 0;
          const priceB = typeof b.price === 'number' ? b.price : b.price.KWD || 0;
          return priceA - priceB;
        case 'price-high':
          const priceAHigh = typeof a.price === 'number' ? a.price : a.price.KWD || 0;
          const priceBHigh = typeof b.price === 'number' ? b.price : b.price.KWD || 0;
          return priceBHigh - priceAHigh;
        case 'name':
          return isRTL
            ? a.title.localeCompare(b.title)
            : a.titleEn.localeCompare(b.titleEn);
        case 'ending-soon':
          // Sort by urgency (limited items first, then by creation date)
          const urgencyA = a.isLimited ? 2 : (a.originalPrice ? 1 : 0);
          const urgencyB = b.isLimited ? 2 : (b.originalPrice ? 1 : 0);
          if (urgencyA !== urgencyB) {
            return urgencyB - urgencyA;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'discount':
        default:
          // Sort by discount percentage (higher discount first)
          const discountA = a.originalPrice ?
            ((typeof a.originalPrice === 'number' ? a.originalPrice : a.originalPrice.KWD || 0) -
             (typeof a.price === 'number' ? a.price : a.price.KWD || 0)) /
            (typeof a.originalPrice === 'number' ? a.originalPrice : a.originalPrice.KWD || 0) * 100 : 0;
          const discountB = b.originalPrice ?
            ((typeof b.originalPrice === 'number' ? b.originalPrice : b.originalPrice.KWD || 0) -
             (typeof b.price === 'number' ? b.price : b.price.KWD || 0)) /
            (typeof b.originalPrice === 'number' ? b.originalPrice : b.originalPrice.KWD || 0) * 100 : 0;
          return discountB - discountA;
      }
    });

    return sorted;
  }, [specialOfferProducts, searchQuery, selectedCategory, sortBy, isRTL]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-[#E935C1] text-white px-3 py-1">
              <Percent className="w-3 h-3 mr-1" />
              {isRTL ? 'عروض خاصة' : 'Special Offers'}
            </Badge>
            <h1 className="text-3xl font-bold text-gradient">
              {isRTL ? 'العروض الخاصة' : 'Special Offers'}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {isRTL
              ? 'لا تفوت العروض الحصرية والخصومات المحدودة الوقت'
              : 'Don\'t miss out on exclusive offers and limited-time discounts'
            }
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-card/50 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
              <Input
                placeholder={isRTL ? 'البحث في العروض الخاصة...' : 'Search special offers...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${isRTL ? 'pr-10' : 'pl-10'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={isRTL ? 'جميع الفئات' : 'All Categories'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {isRTL ? 'جميع الفئات' : 'All Categories'}
                  </SelectItem>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">
                    {isRTL ? 'أكبر خصم أولاً' : 'Highest Discount First'}
                  </SelectItem>
                  <SelectItem value="ending-soon">
                    {isRTL ? 'ينتهي قريباً' : 'Ending Soon'}
                  </SelectItem>
                  <SelectItem value="price-low">
                    {isRTL ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}
                  </SelectItem>
                  <SelectItem value="price-high">
                    {isRTL ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}
                  </SelectItem>
                  <SelectItem value="name">
                    {isRTL ? 'الاسم' : 'Name'}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {isRTL
              ? `عرض ${paginatedProducts.length} من ${filteredAndSortedProducts.length} عرض خاص`
              : `Showing ${paginatedProducts.length} of ${filteredAndSortedProducts.length} special offers`
            }
          </div>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            {/* Products Display */}
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {paginatedProducts.map((product) => {
                // Calculate discount percentage
                const discountPercentage = product.originalPrice ?
                  Math.round(((typeof product.originalPrice === 'number' ? product.originalPrice : product.originalPrice.KWD || 0) -
                           (typeof product.price === 'number' ? product.price : product.price.KWD || 0)) /
                          (typeof product.originalPrice === 'number' ? product.originalPrice : product.originalPrice.KWD || 0) * 100) : 0;

                return (
                  <div key={product.id} className="relative">
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      titleEn={product.titleEn}
                      description={product.description}
                      price={typeof product.price === 'number' ? product.price : convertPrices(product.price, 'KWD')}
                      originalPrice={product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : convertPrices(product.originalPrice, 'KWD')) : undefined}
                      image={product.image}
                      category={product.category === 'tshirts' ? 'tshirts' : (product.category || 'physical')}
                      rating={4.7}
                      isNew={product.isNew}
                      isLimited={product.isLimited}
                      onAddToCart={(id) => {
                        const product = paginatedProducts.find(p => p.id === id);
                        if (product) {
                          addItem({
                            id: product.id,
                            title: product.title,
                            titleEn: product.titleEn,
                            price: typeof product.price === 'number' ? product.price : convertPrices(product.price, 'KWD'),
                            originalPrice: product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : convertPrices(product.originalPrice, 'KWD')) : undefined,
                            image: product.image,
                            category: product.category === 'tshirts' ? 'tshirts' : (product.category || 'physical'),
                            isDigital: product.isDigital,
                            badge: product.isNew ? (isRTL ? 'جديد' : 'New') : product.isLimited ? (isRTL ? 'محدود' : 'Limited') : undefined,
                          });

                          toast({
                            title: t('messages.addedToCart'),
                            description: t('messages.addedToCartDesc', { productName: isRTL ? product.title : product.titleEn }),
                          });
                        }
                      }}
                    />

                    {/* Discount/Limited Badge Overlay */}
                    {(discountPercentage > 0 || product.isLimited) && (
                      <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} z-20`}>
                        {discountPercentage > 0 ? (
                          <Badge className="bg-destructive text-destructive-foreground font-bold">
                            {discountPercentage}% {isRTL ? 'خصم' : 'OFF'}
                          </Badge>
                        ) : product.isLimited ? (
                          <Badge className="bg-warning text-warning-foreground font-bold">
                            <Clock className="w-3 h-3 mr-1" />
                            {isRTL ? 'محدود' : 'Limited'}
                          </Badge>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {isRTL ? 'السابق' : 'Previous'}
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className="min-w-10"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {isRTL ? 'التالي' : 'Next'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold mb-2">
              {isRTL ? 'لا توجد عروض خاصة حالياً' : 'No Special Offers Found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isRTL
                ? 'لا توجد عروض خاصة تطابق معايير البحث الحالية'
                : 'No special offers match your current search criteria'
              }
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('discount');
              }}
            >
              {isRTL ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SpecialOffers;