import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Star,
  Package,
  Clock,
  DollarSign
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ShopFilterPanelProps {
  filters: {
    search: string;
    category: string;
    priceRange: [number, number];
    rating: number;
    inStock: boolean;
    isNew: boolean;
    isDigital: boolean;
    sortBy: string;
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
  className?: string;
}

const ShopFilterPanel = ({
  filters,
  onFiltersChange,
  onReset,
  className
}: ShopFilterPanelProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    features: true,
    sortBy: true
  });

  const categories = [
    { id: 'all', name: isRTL ? 'جميع المنتجات' : 'All Products', icon: Package },
    { id: 'guide', name: isRTL ? 'أدلة' : 'Guides', icon: Package },
    { id: 'physical', name: isRTL ? 'منتجات مادية' : 'Physical Products', icon: Package },
    { id: 'consultation', name: isRTL ? 'استشارات' : 'Consultations', icon: Package },
    { id: 'tshirts', name: isRTL ? 'تي شيرت' : 'T-Shirts', icon: Package },
  ];

  const sortOptions = [
    { value: 'featured', label: isRTL ? 'المميزة' : 'Featured' },
    { value: 'price-low', label: isRTL ? 'الأقل سعراً' : 'Price: Low to High' },
    { value: 'price-high', label: isRTL ? 'الأعلى سعراً' : 'Price: High to Low' },
    { value: 'rating', label: isRTL ? 'الأعلى تقييماً' : 'Highest Rated' },
    { value: 'newest', label: isRTL ? 'الأحدث' : 'Newest' },
    { value: 'name-asc', label: isRTL ? 'الاسم: أ-ي' : 'Name: A-Z' },
    { value: 'name-desc', label: isRTL ? 'الاسم: ي-أ' : 'Name: Z-A' },
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    if (filters.isNew) count++;
    if (filters.isDigital) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {isRTL ? 'الفلترة والفرز' : 'Filters & Sort'}
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs"
          >
            <X className="w-4 h-4" />
            {isRTL ? 'إعادة تعيين' : 'Reset'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            {isRTL ? 'البحث' : 'Search'}
          </Label>
          <Input
            id="search"
            placeholder={isRTL ? 'ابحث عن منتجات...' : 'Search products...'}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection('categories')}
          >
            <span>{isRTL ? 'الفئات' : 'Categories'}</span>
            {expandedSections.categories ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          {expandedSections.categories && (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.category === category.id}
                    onCheckedChange={() => handleFilterChange('category', category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer flex items-center gap-2"
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection('price')}
          >
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {isRTL ? 'نطاق السعر' : 'Price Range'}
            </span>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>{isRTL ? 'ر.س' : 'SAR'} {filters.priceRange[0]}</span>
                <span>{isRTL ? 'ر.س' : 'SAR'} {filters.priceRange[1]}</span>
              </div>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange('priceRange', value)}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder={isRTL ? 'الحد الأدنى' : 'Min'}
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                  className="text-sm"
                />
                <Input
                  type="number"
                  placeholder={isRTL ? 'الحد الأعلى' : 'Max'}
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1000])}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Rating */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection('rating')}
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              {isRTL ? 'التقييم' : 'Rating'}
            </span>
            {expandedSections.rating ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          {expandedSections.rating && (
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.rating === rating}
                    onCheckedChange={() => handleFilterChange('rating', filters.rating === rating ? 0 : rating)}
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm cursor-pointer flex items-center gap-1"
                  >
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span>& {isRTL ? 'فأكثر' : '& up'}</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Features */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection('features')}
          >
            <span>{isRTL ? 'المميزات' : 'Features'}</span>
            {expandedSections.features ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          {expandedSections.features && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
                />
                <Label htmlFor="inStock" className="text-sm cursor-pointer">
                  {isRTL ? 'متوفر في المخزون' : 'In Stock'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNew"
                  checked={filters.isNew}
                  onCheckedChange={(checked) => handleFilterChange('isNew', checked)}
                />
                <Label htmlFor="isNew" className="text-sm cursor-pointer">
                  {isRTL ? 'منتجات جديدة' : 'New Products'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDigital"
                  checked={filters.isDigital}
                  onCheckedChange={(checked) => handleFilterChange('isDigital', checked)}
                />
                <Label htmlFor="isDigital" className="text-sm cursor-pointer">
                  {isRTL ? 'منتجات رقمية' : 'Digital Products'}
                </Label>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Sort By */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection('sortBy')}
          >
            <span>{isRTL ? 'ترتيب حسب' : 'Sort By'}</span>
            {expandedSections.sortBy ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          {expandedSections.sortBy && (
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sort-${option.value}`}
                    checked={filters.sortBy === option.value}
                    onCheckedChange={() => handleFilterChange('sortBy', option.value)}
                  />
                  <Label
                    htmlFor={`sort-${option.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopFilterPanel;