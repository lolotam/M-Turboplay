import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/contexts/ProductsContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  ArrowLeft,
  Loader2,
  Download,
  Upload,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/contexts/ProductsContext';
import AdminNavHeader from '@/components/admin/AdminNavHeader';
import { exportProductsToCSV } from '@/lib/csvExport';

const AdminProducts = () => {
  const { products, isLoading, deleteProduct, searchProducts } = useProducts();
  const { formatPrice, currentCurrency, currencies, setCurrency } = useCurrency();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const filteredProducts = searchProducts(searchQuery, selectedCategory);

  // Ensure button is properly initialized and visible
  useEffect(() => {
    console.log('=== COMPONENT MOUNTED ===');
    console.log('isSelectionMode:', isSelectionMode);
    console.log('Button should be:', !isSelectionMode ? 'VISIBLE' : 'HIDDEN');
  }, [isSelectionMode]);

  const handleDeleteProduct = async (product: Product) => {
    setDeletingId(product.id);
    try {
      const success = await deleteProduct(product.id);
      if (success) {
        toast({
          title: isRTL ? 'تم حذف المنتج' : 'Product Deleted',
          description: isRTL ? 
            `تم حذف "${product.title}" بنجاح` : 
            `"${product.titleEn}" has been deleted successfully`,
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حذف المنتج' : 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleBulkDelete = async () => {
    setIsDeletingBulk(true);
    try {
      const deletePromises = Array.from(selectedProducts).map(id => deleteProduct(id));
      const results = await Promise.allSettled(deletePromises);
      
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
      const failedCount = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value)).length;
      
      if (successCount > 0) {
        toast({
          title: isRTL ? 'تم حذف المنتجات' : 'Products Deleted',
          description: isRTL ?
            `تم حذف ${successCount} منتج بنجاح` :
            `${successCount} products deleted successfully`,
        });
        setSelectedProducts(new Set());
      }
      
      if (failedCount > 0) {
        toast({
          title: isRTL ? 'تحذير' : 'Warning',
          description: isRTL ?
            `فشل حذف ${failedCount} منتج` :
            `Failed to delete ${failedCount} products`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حذف المنتجات' : 'Failed to delete products',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingBulk(false);
      setShowBulkDeleteDialog(false);
      setIsSelectionMode(false);
    }
  };

  const toggleSelectionMode = () => {
    console.log('=== TOGGLE SELECTION MODE ===');
    console.log('Current isSelectionMode:', isSelectionMode);
    console.log('New state will be:', !isSelectionMode);
    console.log('Selected products count:', selectedProducts.size);
    
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      console.log('Clearing selected products...');
      setSelectedProducts(new Set());
    }
    
    // Force re-render
    setTimeout(() => {
      console.log('=== STATE UPDATE COMPLETE ===');
      console.log('New isSelectionMode:', !isSelectionMode);
    }, 0);
  };

  // CSV Template Download Function
  const downloadCSVTemplate = () => {
    const headers = [
      'title', 'titleEn', 'description', 'descriptionEn',
      'price', 'originalPrice', 'category', 'sku', 'stock',
      'isNew', 'isLimited', 'status', 'tags', 'images'
    ];

    const sampleData = [
      'اسم المنتج بالعربية',
      'Product Name in English',
      'وصف المنتج بالعربية مع تفاصيل كاملة عن المميزات والمواصفات',
      'Product description in English with full details about features and specifications',
      '29.99',
      '39.99',
      'playstation',
      'PROD-001',
      '100',
      'true',
      'false',
      'active',
      'gaming,action,ps5',
      'https://example.com/image1.jpg,https://example.com/image2.jpg'
    ];

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'mturboplay_products_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: isRTL ? 'تم تحميل القالب' : 'Template Downloaded',
      description: isRTL ? 'تم تحميل قالب CSV بنجاح' : 'CSV template downloaded successfully',
    });
  };

  // CSV Import Function
  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        toast({
          title: isRTL ? 'خطأ في ملف CSV' : 'CSV File Error',
          description: isRTL ? 'الملف يجب أن يحتوي على رؤوس وصفوف بيانات' : 'File must contain headers and data rows',
          variant: 'destructive',
        });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const expectedHeaders = [
        'title', 'titleEn', 'description', 'descriptionEn',
        'price', 'originalPrice', 'category', 'sku', 'stock',
        'isNew', 'isLimited', 'status', 'tags', 'images'
      ];

      // Validate headers
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        toast({
          title: isRTL ? 'رؤوس ملف CSV غير صحيحة' : 'Invalid CSV Headers',
          description: isRTL
            ? `الرؤوس المفقودة: ${missingHeaders.join(', ')}`
            : `Missing headers: ${missingHeaders.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }

      // Parse and validate data
      const productsToImport = [];
      const errors = [];
      const validCategories = [
        'guide', 'physical', 'consultation', 'tshirts',
        'playstation', 'xbox', 'nintendo', 'pc', 'mobile',
        'accessories', 'giftcards', 'preorders', 'retro'
      ];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));

        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Incorrect number of columns`);
          continue;
        }

        const product: any = {
          title: values[headers.indexOf('title')],
          titleEn: values[headers.indexOf('titleEn')],
          description: values[headers.indexOf('description')],
          descriptionEn: values[headers.indexOf('descriptionEn')],
          price: parseFloat(values[headers.indexOf('price')]) || 0,
          originalPrice: values[headers.indexOf('originalPrice')] ? parseFloat(values[headers.indexOf('originalPrice')]) : undefined,
          category: values[headers.indexOf('category')],
          sku: values[headers.indexOf('sku')],
          stock: values[headers.indexOf('stock')] ? parseInt(values[headers.indexOf('stock')]) : 999,
          isNew: values[headers.indexOf('isNew')].toLowerCase() === 'true',
          isLimited: values[headers.indexOf('isLimited')].toLowerCase() === 'true',
          status: values[headers.indexOf('status')] || 'active',
          tags: values[headers.indexOf('tags')].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
          images: values[headers.indexOf('images')].split(',').map((img: string) => img.trim()).filter((img: string) => img),
          image: values[headers.indexOf('images')].split(',')[0]?.trim() || '/placeholder.svg'
        };

        // Validate required fields
        if (!product.title || !product.titleEn || !product.price || !product.sku) {
          errors.push(`Row ${i + 1}: Missing required fields (title, titleEn, price, or sku)`);
          continue;
        }

        // Validate category
        if (!validCategories.includes(product.category)) {
          errors.push(`Row ${i + 1}: Invalid category "${product.category}"`);
          continue;
        }

        // Set digital flag and stock based on category
        product.isDigital = ['guide', 'consultation', 'playstation', 'xbox', 'nintendo', 'pc', 'mobile', 'giftcards', 'preorders'].includes(product.category);
        if (product.isDigital) {
          product.stock = 999;
        }

        productsToImport.push(product);
      }

      if (errors.length > 0) {
        toast({
          title: isRTL ? 'أخطاء في البيانات' : 'Data Errors',
          description: isRTL
            ? `تم العثور على ${errors.length} خطأ. سيتم استيراد المنتجات الصالحة فقط.`
            : `Found ${errors.length} errors. Only valid products will be imported.`,
          variant: 'destructive',
        });
        console.log('Import errors:', errors);
      }

      if (productsToImport.length === 0) {
        toast({
          title: isRTL ? 'لا توجد منتجات صالحة' : 'No Valid Products',
          description: isRTL ? 'لم يتم العثور على منتجات صالحة للاستيراد' : 'No valid products found to import',
          variant: 'destructive',
        });
        return;
      }

      // Here you would typically save to database
      console.log(`Successfully parsed ${productsToImport.length} products for import`);

      toast({
        title: isRTL ? 'تم تحليل المنتجات' : 'Products Parsed',
        description: isRTL
          ? `تم تحليل ${productsToImport.length} منتج بنجاح من ملف CSV`
          : `Successfully parsed ${productsToImport.length} products from CSV file`,
      });

    } catch (error) {
      console.error('CSV Import Error:', error);
      toast({
        title: isRTL ? 'خطأ في استيراد CSV' : 'CSV Import Error',
        description: isRTL ? 'فشل في تحليل ملف CSV' : 'Failed to parse CSV file',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };



  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'guide':
        return isRTL ? 'أدلة رقمية' : 'Digital Guides';
      case 'physical':
        return isRTL ? 'منتجات فعلية' : 'Physical Products';
      case 'consultation':
        return isRTL ? 'جلسات إرشادية' : 'Consultation Sessions';
      case 'tshirts':
        return isRTL ? 'التشيرتات' : 'T-shirts';
      case 'playstation':
        return isRTL ? 'بلايستيشن' : 'PlayStation';
      case 'xbox':
        return isRTL ? 'إكس بوكس' : 'Xbox';
      case 'nintendo':
        return isRTL ? 'نينتندو' : 'Nintendo';
      case 'pc':
        return isRTL ? 'العاب الكمبيوتر' : 'PC Games';
      case 'mobile':
        return isRTL ? 'ألعاب الجوال' : 'Mobile Games';
      case 'accessories':
        return isRTL ? 'إكسسوارات الألعاب' : 'Gaming Accessories';
      case 'giftcards':
        return isRTL ? 'البطاقات الرقمية' : 'Digital Gift Cards';
      case 'preorders':
        return isRTL ? 'الطلب المسبق' : 'Pre-Orders';
      case 'retro':
        return isRTL ? 'الألعاب الكلاسيكية' : 'Retro Gaming';
      default:
        return category;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      inactive: 'secondary',
      draft: 'destructive'
    };

    const labels: Record<string, string> = {
      active: isRTL ? 'نشط' : 'Active',
      inactive: isRTL ? 'غير نشط' : 'Inactive',
      draft: isRTL ? 'مسودة' : 'Draft'
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation Header */}
      <AdminNavHeader />
      
      {/* Page Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          {/* Title Section */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gradient flex items-center gap-2 mb-2">
              <Package className="w-6 h-6" />
              {isRTL ? 'إدارة المنتجات' : 'Products Management'}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? 'إدارة جميع منتجات المتجر' : 'Manage all store products'}
            </p>
          </div>

          {/* Actions Section - Separate container for better layout control */}
          <div className="w-full">
            {/* Debug Info - Remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
                <strong>Debug Info:</strong> isSelectionMode: {isSelectionMode ? 'true' : 'false'},
                Selected: {selectedProducts.size},
                Button should be: {!isSelectionMode ? 'VISIBLE' : 'HIDDEN'}
              </div>
            )}

            {/* Delete Products Button - Always visible when not in selection mode */}
            <div className="mb-3 border-2 border-dashed border-red-300 p-3 rounded-lg bg-red-50">
              <div className="text-center mb-2">
                <span className="text-sm text-red-600 font-medium">
                  {isRTL ? 'منطقة زر الحذف' : 'Delete Button Area'}
                </span>
              </div>
              {!isSelectionMode && (
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Delete Products button clicked!');
                    toggleSelectionMode();
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 shadow-lg border-2 border-red-800 transition-all duration-200 min-h-12 text-lg"
                  style={{
                    minWidth: '220px',
                    zIndex: 1000,
                    position: 'relative',
                    display: 'inline-flex',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  aria-label={isRTL ? 'حذف المنتجات' : 'Delete Products'}
                  data-testid="delete-products-button"
                  id="delete-products-main-button"
                >
                  <Trash2 className="w-6 h-6 flex-shrink-0" />
                  <span className="font-bold">
                    {isRTL ? '🗑️ حذف المنتجات' : '🗑️ Delete Products'}
                  </span>
                </Button>
              )}
              {isSelectionMode && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={toggleSelectionMode}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {isRTL ? 'إلغاء وضع الاختيار' : 'Exit Selection Mode'}
                  </Button>
                </div>
              )}
            </div>

            {/* Selection Mode Controls */}
            {isSelectionMode && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-800 font-medium">
                    {isRTL ? 'وضع الاختيار مفعل' : 'Selection Mode Active'}
                  </span>
                  <Badge variant="secondary">
                    {selectedProducts.size} {isRTL ? 'محدد' : 'selected'}
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  {selectedProducts.size > 0 && (
                    <Button
                      variant="destructive"
                      onClick={() => setShowBulkDeleteDialog(true)}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isRTL ? `حذف المحدد (${selectedProducts.size})` : `Delete Selected (${selectedProducts.size})`}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={toggleSelectionMode}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {isRTL ? 'رجوع' : 'Back'}
                  </Button>
                </div>
              </div>
            )}

            {/* CSV Import/Export Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={downloadCSVTemplate}
                  className="flex items-center gap-2"
                  title={isRTL ? 'تحميل قالب CSV' : 'Download CSV Template'}
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">{isRTL ? 'قالب' : 'Template'}</span>
                </Button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="csv-import"
                    disabled={isImporting}
                  />
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={isImporting}
                  >
                    {isImporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {isImporting ? (isRTL ? 'جاري الاستيراد...' : 'Importing...') : (isRTL ? 'استيراد' : 'Import')}
                    </span>
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => exportProductsToCSV(filteredProducts, isRTL)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">{isRTL ? 'تصدير' : 'Export'}</span>
                </Button>
              </div>

              <Button onClick={() => navigate('/admin/products/add')} className="btn-hero">
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'إضافة منتج' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
                <Input
                  placeholder={isRTL ? 'البحث في المنتجات...' : 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={isRTL ? 'pr-10' : 'pl-10'}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={isRTL ? 'الفئة' : 'Category'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>

                  {/* Platform Categories */}
                  <SelectItem value="playstation">{isRTL ? 'بلايستيشن' : 'PlayStation'}</SelectItem>
                  <SelectItem value="xbox">{isRTL ? 'إكس بوكس' : 'Xbox'}</SelectItem>
                  <SelectItem value="nintendo">{isRTL ? 'نينتندو' : 'Nintendo'}</SelectItem>
                  <SelectItem value="pc">{isRTL ? 'العاب الكمبيوتر' : 'PC Games'}</SelectItem>
                  <SelectItem value="mobile">{isRTL ? 'ألعاب الجوال' : 'Mobile Games'}</SelectItem>

                  {/* Special Categories */}
                  <SelectItem value="accessories">{isRTL ? 'إكسسوارات الألعاب' : 'Gaming Accessories'}</SelectItem>
                  <SelectItem value="giftcards">{isRTL ? 'البطاقات الرقمية' : 'Digital Gift Cards'}</SelectItem>
                  <SelectItem value="preorders">{isRTL ? 'الطلب المسبق' : 'Pre-Orders'}</SelectItem>
                  <SelectItem value="retro">{isRTL ? 'الألعاب الكلاسيكية' : 'Retro Gaming'}</SelectItem>

                  {/* Legacy Categories */}
                  <SelectItem value="guide">{isRTL ? 'أدلة رقمية' : 'Digital Guides'}</SelectItem>
                  <SelectItem value="physical">{isRTL ? 'منتجات فعلية' : 'Physical Products'}</SelectItem>
                  <SelectItem value="consultation">{isRTL ? 'جلسات إرشادية' : 'Consultation Sessions'}</SelectItem>
                  <SelectItem value="tshirts">{isRTL ? 'التشيرتات' : 'T-shirts'}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={currentCurrency.code} onValueChange={setCurrency}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} {isRTL ? 'منتج' : 'products'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isRTL ? 'قائمة المنتجات' : 'Products List'}</span>
              <Badge variant="secondary">{products.length} {isRTL ? 'منتج' : 'products'}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                {isRTL ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">#</TableHead>
                    {isSelectionMode && (
                      <TableHead className="w-12 text-center">
                        <Checkbox
                          checked={filteredProducts.length > 0 && filteredProducts.every(p => selectedProducts.has(p.id))}
                          onCheckedChange={handleSelectAll}
                          aria-label={isRTL ? 'تحديد الكل' : 'Select all'}
                        />
                      </TableHead>
                    )}
                    <TableHead className="text-left">{isRTL ? 'المنتج' : 'Product'}</TableHead>
                    <TableHead className="text-center">{isRTL ? 'الفئة' : 'Category'}</TableHead>
                    <TableHead className="text-center">{isRTL ? 'السعر' : 'Price'}</TableHead>
                    <TableHead className="text-center">{isRTL ? 'المخزون' : 'Stock'}</TableHead>
                    <TableHead className="text-center">{isRTL ? 'الحالة' : 'Status'}</TableHead>
                    <TableHead className="w-32 text-right">{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      {isSelectionMode && (
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedProducts.has(product.id)}
                            onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                            aria-label={isRTL ? `تحديد ${product.title}` : `Select ${product.titleEn}`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="text-left">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-cover bg-muted"
                              onError={(e) => {
                                // Fallback to placeholder if both images array and single image field fail
                                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                              }}
                            />
                            {/* Image count indicator */}
                            {product.images && product.images.length > 1 && (
                              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                {product.images.length}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {isRTL ? product.title : product.titleEn}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {product.sku}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {getCategoryLabel(product.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-sm ${
                          product.stock === undefined || product.stock > 10
                            ? 'text-green-600'
                            : product.stock > 0
                              ? 'text-orange-600'
                              : 'text-red-600'
                        }`}>
                          {product.stock === undefined ?
                            (isRTL ? 'غير محدود' : 'Unlimited') :
                            product.stock
                          }
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(product.status)}
                      </TableCell>
                      <TableCell className="w-32 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/products/view/${product.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                disabled={deletingId === product.id}
                              >
                                {deletingId === product.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {isRTL ? 'تأكيد الحذف' : 'Confirm Deletion'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {isRTL ?
                                    `هل أنت متأكد من حذف "${product.title}"؟ هذا الإجراء لا يمكن التراجع عنه.` :
                                    `Are you sure you want to delete "${product.titleEn}"? This action cannot be undone.`
                                  }
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {isRTL ? 'إلغاء' : 'Cancel'}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {isRTL ? 'حذف' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {filteredProducts.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {isRTL ? 'لا توجد منتجات' : 'No products found'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'جرب تغيير معايير البحث أو الفلاتر' : 'Try changing your search criteria or filters'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? 'تأكيد الحذف الجماعي' : 'Confirm Bulk Deletion'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL ? 
                `هل أنت متأكد من حذف ${selectedProducts.size} منتج؟ هذا الإجراء لا يمكن التراجع عنه.` :
                `Are you sure you want to delete ${selectedProducts.size} products? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingBulk}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeletingBulk}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingBulk ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isRTL ? 'جاري الحذف...' : 'Deleting...'}
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isRTL ? 'حذف المحدد' : 'Delete Selected'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;