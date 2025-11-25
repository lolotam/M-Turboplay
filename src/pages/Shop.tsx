import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Loader2 } from "lucide-react";
import { useCartActions } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { useProducts, Product } from "@/contexts/ProductsContext";
import { filterProductsByPrice } from "@/data/products";


const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [displayedProducts, setDisplayedProducts] = useState(6); // Start with 6 products
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { addItem } = useCartActions();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { products, isLoading } = useProducts();
  const isRTL = i18n.language === 'ar';

  const activeProducts = useMemo(() => {
    return products.filter(product => product.status === 'active');
  }, [products]);

  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const searchTerm_lower = searchTerm.toLowerCase();
      const results = activeProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm_lower) ||
        product.titleEn.toLowerCase().includes(searchTerm_lower) ||
        product.description.toLowerCase().includes(searchTerm_lower) ||
        product.descriptionEn.toLowerCase().includes(searchTerm_lower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm_lower))
      );
      setSearchResults(results);
    } else {
      setSearchResults(activeProducts);
    }
  }, [searchTerm, activeProducts]);

  // Apply filters
  let filteredProducts = [...searchResults];

  // Apply category filter
  if (selectedCategory && selectedCategory !== "all") {
    const categoryMap: { [key: string]: string } = {
      "guide": "guide",
      "guides": "guide",
      "physical": "physical",
      "consultation": "consultation",
      "tshirts": "tshirts"
    };
    const normalizedCategory = categoryMap[selectedCategory] || selectedCategory;
    filteredProducts = filteredProducts.filter(product => product.category === normalizedCategory);
  }

  // Apply price filter
  if (priceRange && priceRange !== "all") {
    filteredProducts = filterProductsByPrice(filteredProducts, priceRange);
  }

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
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
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
    setDisplayedProducts(prev => prev + 6);
    setIsLoadingMore(false);
  };

  // Reset displayed products when filters change
  useEffect(() => {
    setDisplayedProducts(6);
  }, [searchTerm, selectedCategory, priceRange]);

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

        {/* Filters Section */}
        <div className="mb-8 p-6 bg-card rounded-xl border">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
              <Input
                placeholder={t('shop.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isRTL ? 'pr-10' : 'pl-10'}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>


            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('shop.categories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('shop.allProducts')}</SelectItem>
                <SelectItem value="guide">{t('products.guides')}</SelectItem>
                <SelectItem value="physical">{t('products.physical')}</SelectItem>
                <SelectItem value="consultation">{t('products.consultation')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('shop.priceRange')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('shop.allPrices')}</SelectItem>
                <SelectItem value="low">{t('shop.priceRanges.low')}</SelectItem>
                <SelectItem value="medium">{t('shop.priceRanges.medium')}</SelectItem>
                <SelectItem value="high">{t('shop.priceRanges.high')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {t('shop.found')} {filteredProducts.length} {t('products.available')}
          </p>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              <Filter className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('shop.filterActive')}
            </Badge>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {productsToShow.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                titleEn={product.titleEn}
                description={product.description}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                category={product.category}
                rating={4.8} // Default rating since it's optional in Product interface
                isNew={product.isNew}
                isLimited={product.isLimited}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">{t('shop.noResults')}</h3>
            <p className="text-muted-foreground mb-4">{t('shop.noResultsDesc')}</p>
            <Button onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setPriceRange("all");
            }}>
              {t('shop.resetSearch')}
            </Button>
          </div>
        )}

        {/* Load More */}
        {!isLoading && hasMoreProducts && (
          <div className="text-center">
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
      </main>

      <Footer />
    </div>
  );
};

export default Shop;