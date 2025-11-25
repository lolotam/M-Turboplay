import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductsContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Loader2,
  Eye,
  Package,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CurrencyPrices, SUPPORTED_CURRENCIES } from '@/types/currency';
import { ImageManager } from '@/components/ui/image-manager';
import { generateProductDescription } from '@/utils/productDescriptionAI';
import { Wand2 } from 'lucide-react';

const AdminProductEdit = () => {
  const { id } = useParams();
  const { products, updateProduct, isLoading: productsLoading } = useProducts();
  const { currencies } = useCurrency();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const [isLoading, setIsLoading] = useState(false);
  const [useSinglePrice, setUseSinglePrice] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    price: '',
    originalPrice: '',
    // Multi-currency prices
    prices: {
      KWD: '',
      SAR: '',
      AED: '',
      QAR: '',
      EGP: ''
    },
    originalPrices: {
      KWD: '',
      SAR: '',
      AED: '',
      QAR: '',
      EGP: ''
    },
    image: '/src/assets/pets-guide-cover.jpg',
    images: ['/src/assets/pets-guide-cover.jpg'], // Multiple images support
    category: 'playstation' as 'guide' | 'physical' | 'consultation' | 'tshirts' | 'playstation' | 'xbox' | 'nintendo' | 'pc' | 'mobile' | 'accessories' | 'giftcards' | 'preorders' | 'retro',
    isNew: false,
    isLimited: false,
    stock: '',
    sku: '',
    tags: [] as string[],
    status: 'active' as 'active' | 'inactive' | 'draft',
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatingArabic, setGeneratingArabic] = useState(false);
  const [generatingEnglish, setGeneratingEnglish] = useState(false);

  const generateAIDescription = async (language: 'ar' | 'en') => {
    if (!formData.title.trim() && !formData.titleEn.trim()) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى إدخال اسم المنتج أولاً' : 'Please enter product name first',
        variant: 'destructive',
      });
      return;
    }

    const isArabic = language === 'ar';
    const setGenerating = isArabic ? setGeneratingArabic : setGeneratingEnglish;

    setGenerating(true);

    try {
      const productName = isArabic ? formData.title : formData.titleEn;
      const imageUrl = formData.images.length > 0 ? formData.images[0] : undefined;

      const description = await generateProductDescription({
        productName,
        productImage: imageUrl,
        language,
      });

      if (isArabic) {
        setFormData(prev => ({ ...prev, description }));
      } else {
        setFormData(prev => ({ ...prev, descriptionEn: description }));
      }

      toast({
        title: isRTL ? 'تم إنشاء الوصف' : 'Description Generated',
        description: isRTL ? 'تم إنشاء الوصف بنجاح باستخدام الذكاء الاصطناعي' : 'Description generated successfully using AI',
      });
    } catch (error) {
      console.error('AI Description Generation Error:', error);
      toast({
        title: isRTL ? 'خطأ في إنشاء الوصف' : 'Error Generating Description',
        description: error instanceof Error ? error.message : (isRTL ? 'فشل في إنشاء الوصف. يرجى المحاولة مرة أخرى.' : 'Failed to generate description. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      // Determine if product uses multi-currency pricing
      const isMultiCurrency = typeof product.price === 'object';
      setUseSinglePrice(!isMultiCurrency);

      // Prepare price data
      let priceData = '';
      let originalPriceData = '';
      let pricesData = { KWD: '', SAR: '', AED: '', QAR: '', EGP: '' };
      let originalPricesData = { KWD: '', SAR: '', AED: '', QAR: '', EGP: '' };

      if (isMultiCurrency && typeof product.price === 'object') {
        // Multi-currency product
        pricesData = {
          KWD: product.price.KWD?.toString() || '',
          SAR: product.price.SAR?.toString() || '',
          AED: product.price.AED?.toString() || '',
          QAR: product.price.QAR?.toString() || '',
          EGP: product.price.EGP?.toString() || '',
        };

        if (product.originalPrice && typeof product.originalPrice === 'object') {
          originalPricesData = {
            KWD: product.originalPrice.KWD?.toString() || '',
            SAR: product.originalPrice.SAR?.toString() || '',
            AED: product.originalPrice.AED?.toString() || '',
            QAR: product.originalPrice.QAR?.toString() || '',
            EGP: product.originalPrice.EGP?.toString() || '',
          };
        }
      } else {
        // Single currency product
        priceData = product.price.toString();
        originalPriceData = product.originalPrice?.toString() || '';
      }

      setFormData({
        title: product.title,
        titleEn: product.titleEn,
        description: product.description,
        descriptionEn: product.descriptionEn,
        price: priceData,
        originalPrice: originalPriceData,
        prices: pricesData,
        originalPrices: originalPricesData,
        image: product.image,
        images: product.images || [product.image], // Support for multiple images
        category: product.category,
        isNew: product.isNew || false,
        isLimited: product.isLimited || false,
        stock: product.stock?.toString() || '',
        sku: product.sku,
        tags: product.tags || [],
        status: product.status,
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = isRTL ? 'العنوان باللغة العربية مطلوب' : 'Arabic title is required';
    }

    if (!formData.titleEn.trim()) {
      newErrors.titleEn = isRTL ? 'العنوان باللغة الإنجليزية مطلوب' : 'English title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = isRTL ? 'الوصف باللغة العربية مطلوب' : 'Arabic description is required';
    }

    if (!formData.descriptionEn.trim()) {
      newErrors.descriptionEn = isRTL ? 'الوصف باللغة الإنجليزية مطلوب' : 'English description is required';
    }

    // Validate pricing based on mode
    if (useSinglePrice) {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        newErrors.price = isRTL ? 'السعر مطلوب ويجب أن يكون أكبر من صفر' : 'Price is required and must be greater than 0';
      }

      if (formData.originalPrice && parseFloat(formData.originalPrice) <= parseFloat(formData.price)) {
        newErrors.originalPrice = isRTL ? 'السعر الأصلي يجب أن يكون أكبر من السعر الحالي' : 'Original price must be greater than current price';
      }
    } else {
      // Validate multi-currency prices - at least KWD is required
      if (!formData.prices.KWD || parseFloat(formData.prices.KWD) <= 0) {
        newErrors.priceKWD = isRTL ? 'سعر الدينار الكويتي مطلوب' : 'KWD price is required';
      }

      // Validate that original prices are higher than current prices if provided
      SUPPORTED_CURRENCIES.forEach(currency => {
        const currentPrice = formData.prices[currency.code as keyof CurrencyPrices];
        const originalPrice = formData.originalPrices[currency.code as keyof CurrencyPrices];

        if (originalPrice && currentPrice && parseFloat(originalPrice) <= parseFloat(currentPrice)) {
          newErrors[`originalPrice${currency.code}`] = isRTL
            ? `السعر الأصلي لـ ${currency.nameAr} يجب أن يكون أكبر من السعر الحالي`
            : `Original ${currency.code} price must be greater than current price`;
        }
      });
    }

    if (!formData.sku.trim()) {
      newErrors.sku = isRTL ? 'رمز المنتج (SKU) مطلوب' : 'Product SKU is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: isRTL ? 'خطأ في البيانات' : 'Validation Error',
        description: isRTL ? 'يرجى تصحيح الأخطاء في النموذج' : 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    // Validate images array
    if (!formData.images || formData.images.length === 0) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى إضافة صورة واحدة على الأقل' : 'Please add at least one image',
        variant: 'destructive',
      });
      return;
    }

    // Check for base64 image limitations
    const hasDataUrls = formData.images.some(img => img.startsWith('data:'));
    if (hasDataUrls && formData.images.length > 3) {
      toast({
        title: isRTL ? 'تحذير - عدد الصور' : 'Warning - Image Count',
        description: isRTL
          ? 'الحد الأقصى 3 صور عند التحميل المباشر. للمزيد من الصور، استخدم روابط URL من الإنترنت.'
          : 'Maximum 3 directly uploaded images. For more images, use web URLs instead.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare price data based on pricing mode
      let priceData: number | CurrencyPrices;
      let originalPriceData: number | CurrencyPrices | undefined;

      if (useSinglePrice) {
        priceData = parseFloat(formData.price);
        originalPriceData = formData.originalPrice ? parseFloat(formData.originalPrice) : undefined;
      } else {
        // Convert multi-currency prices to numbers
        priceData = {
          KWD: parseFloat(formData.prices.KWD) || 0,
          SAR: parseFloat(formData.prices.SAR) || 0,
          AED: parseFloat(formData.prices.AED) || 0,
          QAR: parseFloat(formData.prices.QAR) || 0,
          EGP: parseFloat(formData.prices.EGP) || 0,
          USD: 0,
          EUR: 0,
        };

        // Only include original prices if at least one is provided
        const hasOriginalPrices = Object.values(formData.originalPrices).some(price => price && parseFloat(price) > 0);
        if (hasOriginalPrices) {
          originalPriceData = {
            KWD: parseFloat(formData.originalPrices.KWD) || 0,
            SAR: parseFloat(formData.originalPrices.SAR) || 0,
            AED: parseFloat(formData.originalPrices.AED) || 0,
            QAR: parseFloat(formData.originalPrices.QAR) || 0,
            EGP: parseFloat(formData.originalPrices.EGP) || 0,
            USD: 0,
            EUR: 0,
          };
        }
      }

      const productData = {
        title: formData.title,
        titleEn: formData.titleEn,
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        price: priceData,
        originalPrice: originalPriceData,
        image: formData.images[0], // Always use first image as main image
        images: formData.images,
        category: formData.category,
        isNew: formData.isNew,
        isLimited: formData.isLimited,
        isDigital: formData.category === 'guide' || formData.category === 'consultation',
        stock: formData.category === 'guide' || formData.category === 'consultation' ? 999 : parseInt(formData.stock) || 0,
        sku: formData.sku,
        tags: formData.tags,
        status: formData.status,
      };

      const success = await updateProduct(id!, productData);

      if (success) {
        toast({
          title: isRTL ? 'تم تحديث المنتج' : 'Product Updated',
          description: isRTL ? 'تم تحديث المنتج بنجاح' : 'Product has been updated successfully',
        });
        navigate('/admin/products');
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث المنتج' : 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gradient">
                    {isRTL ? 'المنتج غير موجود' : 'Product Not Found'}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'المنتج غير موجود' : 'Product Not Found'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isRTL ? 'المنتج المطلوب غير متوفر أو تم حذفه' : 'The requested product is not available or has been deleted'}
            </p>
            <Button onClick={() => navigate('/admin/products')}>
              {isRTL ? 'العودة إلى المنتجات' : 'Back to Products'}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  {isRTL ? 'تعديل المنتج' : 'Edit Product'}
                </h1>
                <p className="text-muted-foreground">
                  {isRTL ? 'تحديث معلومات المنتج' : 'Update product information'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/admin/products/view/${product.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isRTL ? 'معاينة' : 'Preview'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'المعلومات الأساسية' : 'Basic Information'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">
                        {isRTL ? 'العنوان (العربية)' : 'Title (Arabic)'} *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                        placeholder={isRTL ? 'أدخل العنوان باللغة العربية' : 'Enter title in Arabic'}
                        className={errors.title ? 'border-destructive' : ''}
                        dir="rtl"
                      />
                      {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="titleEn">
                        {isRTL ? 'العنوان (الإنجليزية)' : 'Title (English)'} *
                      </Label>
                      <Input
                        id="titleEn"
                        value={formData.titleEn}
                        onChange={(e) => setFormData(prev => ({...prev, titleEn: e.target.value}))}
                        placeholder={isRTL ? 'أدخل العنوان باللغة الإنجليزية' : 'Enter title in English'}
                        className={errors.titleEn ? 'border-destructive' : ''}
                        dir="ltr"
                      />
                      {errors.titleEn && <p className="text-xs text-destructive mt-1">{errors.titleEn}</p>}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="description">
                        {isRTL ? 'الوصف (العربية)' : 'Description (Arabic)'} *
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => generateAIDescription('ar')}
                        disabled={generatingArabic}
                        className="flex items-center gap-1"
                      >
                        {generatingArabic ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Wand2 className="w-3 h-3" />
                        )}
                        {isRTL ? 'إنشاء بالذكاء الاصطناعي' : 'Generate AI'}
                      </Button>
                    </div>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                      placeholder={isRTL ? 'أدخل وصف المنتج باللغة العربية' : 'Enter product description in Arabic'}
                      className={`min-h-20 ${errors.description ? 'border-destructive' : ''}`}
                      dir="rtl"
                    />
                    {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="descriptionEn">
                        {isRTL ? 'الوصف (الإنجليزية)' : 'Description (English)'} *
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => generateAIDescription('en')}
                        disabled={generatingEnglish}
                        className="flex items-center gap-1"
                      >
                        {generatingEnglish ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Wand2 className="w-3 h-3" />
                        )}
                        {isRTL ? 'إنشاء بالذكاء الاصطناعي' : 'Generate AI'}
                      </Button>
                    </div>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData(prev => ({...prev, descriptionEn: e.target.value}))}
                      placeholder={isRTL ? 'أدخل وصف المنتج باللغة الإنجليزية' : 'Enter product description in English'}
                      className={`min-h-20 ${errors.descriptionEn ? 'border-destructive' : ''}`}
                      dir="ltr"
                    />
                    {errors.descriptionEn && <p className="text-xs text-destructive mt-1">{errors.descriptionEn}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    {isRTL ? 'التسعير' : 'Pricing'}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pricing-mode"
                      checked={!useSinglePrice}
                      onCheckedChange={(checked) => setUseSinglePrice(!checked)}
                    />
                    <Label htmlFor="pricing-mode" className="text-sm">
                      {isRTL ? 'تسعير متعدد العملات' : 'Multi-Currency Pricing'}
                    </Label>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {useSinglePrice ? (
                    // Single Currency Pricing (KWD)
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">
                          {isRTL ? 'السعر (د.ك)' : 'Price (KWD)'} *
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.001"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                          placeholder="0.000"
                          className={errors.price ? 'border-destructive' : ''}
                        />
                        {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
                      </div>

                      <div>
                        <Label htmlFor="originalPrice">
                          {isRTL ? 'السعر الأصلي (د.ك)' : 'Original Price (KWD)'}
                        </Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.001"
                          min="0"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData(prev => ({...prev, originalPrice: e.target.value}))}
                          placeholder="0.000"
                          className={errors.originalPrice ? 'border-destructive' : ''}
                        />
                        {errors.originalPrice && <p className="text-xs text-destructive mt-1">{errors.originalPrice}</p>}
                      </div>
                    </div>
                  ) : (
                    // Multi-Currency Pricing
                    <Tabs defaultValue="current" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="current">{isRTL ? 'الأسعار الحالية' : 'Current Prices'}</TabsTrigger>
                        <TabsTrigger value="original">{isRTL ? 'الأسعار الأصلية' : 'Original Prices'}</TabsTrigger>
                      </TabsList>

                      <TabsContent value="current" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {SUPPORTED_CURRENCIES.map((currency) => (
                            <div key={currency.code}>
                              <Label htmlFor={`price-${currency.code}`}>
                                {isRTL ? `السعر (${currency.symbol})` : `Price (${currency.symbol})`}
                                {currency.code === 'KWD' && ' *'}
                              </Label>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{currency.symbol}</span>
                                <Input
                                  id={`price-${currency.code}`}
                                  type="number"
                                  step={currency.decimals === 3 ? "0.001" : "0.01"}
                                  min="0"
                                  value={formData.prices[currency.code as keyof CurrencyPrices]}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    prices: {
                                      ...prev.prices,
                                      [currency.code]: e.target.value
                                    }
                                  }))}
                                  placeholder={currency.decimals === 3 ? "0.000" : "0.00"}
                                  className={errors[`price${currency.code}`] ? 'border-destructive' : ''}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {isRTL ? currency.nameAr : currency.name}
                              </p>
                              {errors[`price${currency.code}`] && (
                                <p className="text-xs text-destructive mt-1">{errors[`price${currency.code}`]}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="original" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {SUPPORTED_CURRENCIES.map((currency) => (
                            <div key={currency.code}>
                              <Label htmlFor={`original-price-${currency.code}`}>
                                {isRTL ? `السعر الأصلي (${currency.symbol})` : `Original Price (${currency.symbol})`}
                              </Label>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{currency.symbol}</span>
                                <Input
                                  id={`original-price-${currency.code}`}
                                  type="number"
                                  step={currency.decimals === 3 ? "0.001" : "0.01"}
                                  min="0"
                                  value={formData.originalPrices[currency.code as keyof CurrencyPrices]}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    originalPrices: {
                                      ...prev.originalPrices,
                                      [currency.code]: e.target.value
                                    }
                                  }))}
                                  placeholder={currency.decimals === 3 ? "0.000" : "0.00"}
                                  className={errors[`originalPrice${currency.code}`] ? 'border-destructive' : ''}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {isRTL ? currency.nameAr : currency.name}
                              </p>
                              {errors[`originalPrice${currency.code}`] && (
                                <p className="text-xs text-destructive mt-1">{errors[`originalPrice${currency.code}`]}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'العلامات' : 'Tags'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isRTL ? 'أضف علامة...' : 'Add tag...'}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addTag} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'إعدادات المنتج' : 'Product Settings'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">
                      {isRTL ? 'الفئة' : 'Category'} *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: 'guide' | 'physical' | 'consultation' | 'tshirts' | 'playstation' | 'xbox' | 'nintendo' | 'pc' | 'mobile' | 'accessories' | 'giftcards' | 'preorders' | 'retro') =>
                        setFormData(prev => ({...prev, category: value}))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Platform-Specific Categories */}
                        <SelectItem value="playstation">
                          {isRTL ? 'بلايستيشن' : 'PlayStation'}
                        </SelectItem>
                        <SelectItem value="xbox">
                          {isRTL ? 'إكس بوكس' : 'Xbox'}
                        </SelectItem>
                        <SelectItem value="nintendo">
                          {isRTL ? 'نينتندو' : 'Nintendo'}
                        </SelectItem>
                        <SelectItem value="pc">
                          {isRTL ? 'العاب الكمبيوتر' : 'PC Games'}
                        </SelectItem>
                        <SelectItem value="mobile">
                          {isRTL ? 'ألعاب الجوال' : 'Mobile Games'}
                        </SelectItem>

                        {/* Special Categories */}
                        <SelectItem value="accessories">
                          {isRTL ? 'إكسسوارات الألعاب' : 'Gaming Accessories'}
                        </SelectItem>
                        <SelectItem value="giftcards">
                          {isRTL ? 'البطاقات الرقمية' : 'Digital Gift Cards'}
                        </SelectItem>
                        <SelectItem value="preorders">
                          {isRTL ? 'الطلب المسبق' : 'Pre-Orders'}
                        </SelectItem>
                        <SelectItem value="retro">
                          {isRTL ? 'الألعاب الكلاسيكية' : 'Retro Gaming'}
                        </SelectItem>

                        {/* Legacy Categories */}
                        <SelectItem value="guide">
                          {isRTL ? 'أدلة رقمية' : 'Digital Guides'}
                        </SelectItem>
                        <SelectItem value="physical">
                          {isRTL ? 'منتجات فعلية' : 'Physical Products'}
                        </SelectItem>
                        <SelectItem value="consultation">
                          {isRTL ? 'جلسات إرشادية' : 'Consultation Sessions'}
                        </SelectItem>
                        <SelectItem value="tshirts">
                          {isRTL ? 'التشيرتات' : 'T-shirts'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">
                      {isRTL ? 'الحالة' : 'Status'}
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'active' | 'inactive' | 'draft') => 
                        setFormData(prev => ({...prev, status: value}))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          {isRTL ? 'نشط' : 'Active'}
                        </SelectItem>
                        <SelectItem value="inactive">
                          {isRTL ? 'غير نشط' : 'Inactive'}
                        </SelectItem>
                        <SelectItem value="draft">
                          {isRTL ? 'مسودة' : 'Draft'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sku">
                      {isRTL ? 'رمز المنتج (SKU)' : 'Product SKU'} *
                    </Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({...prev, sku: e.target.value}))}
                      placeholder="PROD-001"
                      className={errors.sku ? 'border-destructive' : ''}
                    />
                    {errors.sku && <p className="text-xs text-destructive mt-1">{errors.sku}</p>}
                  </div>

                  {formData.category === 'physical' && (
                    <div>
                      <Label htmlFor="stock">
                        {isRTL ? 'الكمية المتوفرة' : 'Stock Quantity'}
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
                        placeholder="0"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'صور المنتج' : 'Product Images'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageManager
                    images={formData.images}
                    onImagesChange={(newImages) => {
                      setFormData(prev => ({
                        ...prev,
                        images: newImages,
                        image: newImages.length > 0 ? newImages[0] : '' // Set first image as main
                      }));
                    }}
                    maxImages={10}
                    disabled={isLoading}
                  />
                </CardContent>
              </Card>

              {/* Product Features */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'مميزات المنتج' : 'Product Features'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isNew" className="text-sm">
                      {isRTL ? 'منتج جديد' : 'New Product'}
                    </Label>
                    <Switch
                      id="isNew"
                      checked={formData.isNew}
                      onCheckedChange={(checked) => setFormData(prev => ({...prev, isNew: checked}))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isLimited" className="text-sm">
                      {isRTL ? 'منتج محدود' : 'Limited Product'}
                    </Label>
                    <Switch
                      id="isLimited"
                      checked={formData.isLimited}
                      onCheckedChange={(checked) => setFormData(prev => ({...prev, isLimited: checked}))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="btn-hero" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {isRTL ? 'جاري الحفظ...' : 'Saving...'}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                    </div>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/admin/products')}
                  disabled={isLoading}
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/admin/products/view/${product.id}`)}
                  disabled={isLoading}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isRTL ? 'معاينة' : 'Preview'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminProductEdit;