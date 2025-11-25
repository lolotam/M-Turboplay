import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Loader2,
  DollarSign,
  Trash2,
  Edit3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CurrencyPrices, SUPPORTED_CURRENCIES } from '@/types/currency';
import { ImageManager } from '@/components/ui/image-manager';
import { generateProductDescription } from '@/utils/productDescriptionAI';
import { Wand2 } from 'lucide-react';

const AdminProductAdd = () => {
  const { addProduct } = useProducts();
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
    image: '/src/assets/pets-guide-cover.jpg', // Default image
    images: ['/src/assets/pets-guide-cover.jpg'], // Multiple images support
    categories: [] as string[], // Multiple categories support
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
        title: isRTL ? '💡 تلميح: المزيد من الصور متاح' : '💡 Tip: More Images Available',
        description: isRTL
          ? 'لقد قمت بتحميل 3 صور. يمكنك إضافة ما يصل إلى 10 صور إجمالي باستخدام تبويب "إضافة رابط URL".'
          : 'You\'ve uploaded 3 images. You can add up to 10 total images using the "Add URL" tab.',
        variant: 'default',
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

      // Helper function to check if any selected category is digital
      const hasDigitalCategory = formData.categories.some(cat =>
        cat === 'guide' || cat === 'consultation' ||
        cat === 'playstation' || cat === 'xbox' ||
        cat === 'nintendo' || cat === 'pc' ||
        cat === 'mobile' || cat === 'giftcards' ||
        cat === 'preorders'
      );

      // Helper function to check if any selected category requires stock management
      const requiresStockManagement = formData.categories.some(cat =>
        cat === 'physical' || cat === 'accessories' || cat === 'retro'
      );

      const productData = {
        title: formData.title,
        titleEn: formData.titleEn,
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        price: priceData,
        originalPrice: originalPriceData,
        image: formData.images[0], // Always use first image as main image
        images: formData.images,
        categories: formData.categories,
        isNew: formData.isNew,
        isLimited: formData.isLimited,
        isDigital: hasDigitalCategory,
        stock: hasDigitalCategory ? 999 : (requiresStockManagement ? parseInt(formData.stock) || 0 : 0),
        sku: formData.sku,
        tags: formData.tags,
        status: formData.status,
      };

      const success = await addProduct(productData);

      if (success) {
        toast({
          title: isRTL ? 'تم إضافة المنتج' : 'Product Added',
          description: isRTL ? 'تم إضافة المنتج بنجاح' : 'Product has been added successfully',
        });
        navigate('/admin/products');
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في إضافة المنتج' : 'Failed to add product',
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
                  {isRTL ? 'إضافة منتج جديد' : 'Add New Product'}
                </h1>
                <p className="text-muted-foreground">
                  {isRTL ? 'إنشاء منتج جديد في المتجر' : 'Create a new product for the store'}
                </p>
              </div>
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
                    <Label htmlFor="categories">
                      {isRTL ? 'الفئات' : 'Categories'} *
                    </Label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border rounded-md">
                        {/* Platform-Specific Categories */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground">
                            {isRTL ? 'المنصات' : 'Platforms'}
                          </h4>
                          {[
                            { value: 'playstation', label: isRTL ? 'بلايستيشن' : 'PlayStation', color: 'bg-blue-100 text-blue-800' },
                            { value: 'xbox', label: isRTL ? 'إكس بوكس' : 'Xbox', color: 'bg-green-100 text-green-800' },
                            { value: 'nintendo', label: isRTL ? 'نينتندو' : 'Nintendo', color: 'bg-red-100 text-red-800' },
                            { value: 'pc', label: isRTL ? 'العاب الكمبيوتر' : 'PC Games', color: 'bg-cyan-100 text-cyan-800' },
                            { value: 'mobile', label: isRTL ? 'ألعاب الجوال' : 'Mobile Games', color: 'bg-green-100 text-green-800' }
                          ].map((category) => (
                            <div key={category.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category.value}`}
                                checked={formData.categories.includes(category.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      categories: [...prev.categories, category.value]
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      categories: prev.categories.filter(c => c !== category.value)
                                    }));
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`category-${category.value}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {category.label}
                              </Label>
                            </div>
                          ))}
                        </div>

                        {/* Gaming Categories */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground">
                            {isRTL ? 'أنواع الألعاب' : 'Game Types'}
                          </h4>
                          {[
                            { value: 'action', label: isRTL ? 'ألعاب الأكشن' : 'Action Games' },
                            { value: 'adventure', label: isRTL ? 'ألعاب المغامرات' : 'Adventure Games' },
                            { value: 'sports', label: isRTL ? 'ألعاب الرياضة' : 'Sports Games' },
                            { value: 'strategy', label: isRTL ? 'ألعاب الاستراتيجية' : 'Strategy Games' },
                            { value: 'rpg', label: isRTL ? 'ألعاب تقمص الأدوار' : 'RPG Games' },
                            { value: 'horror', label: isRTL ? 'ألعاب الرعب' : 'Horror Games' },
                            { value: 'racing', label: isRTL ? 'ألعاب السباق' : 'Racing Games' }
                          ].map((category) => (
                            <div key={category.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category.value}`}
                                checked={formData.categories.includes(category.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      categories: [...prev.categories, category.value]
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      categories: prev.categories.filter(c => c !== category.value)
                                    }));
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`category-${category.value}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {category.label}
                              </Label>
                            </div>
                          ))}
                        </div>

                        {/* Special Categories */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground">
                            {isRTL ? 'فئات خاصة' : 'Special Categories'}
                          </h4>
                          {[
                            { value: 'accessories', label: isRTL ? 'إكسسوارات الألعاب' : 'Gaming Accessories' },
                            { value: 'giftcards', label: isRTL ? 'البطاقات الرقمية' : 'Digital Gift Cards' },
                            { value: 'preorders', label: isRTL ? 'الطلب المسبق' : 'Pre-Orders' },
                            { value: 'retro', label: isRTL ? 'الألعاب الكلاسيكية' : 'Retro Gaming' },
                            { value: 'new-in-gaming', label: isRTL ? 'جديد في الألعاب' : 'New in Gaming' },
                            { value: 'best-sellers', label: isRTL ? 'الأكثر مبيعاً' : 'Best Sellers' },
                            { value: 'special-offers', label: isRTL ? 'العروض الخاصة' : 'Special Offers' }
                          ].map((category) => (
                            <div key={category.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category.value}`}
                                checked={formData.categories.includes(category.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      categories: [...prev.categories, category.value]
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      categories: prev.categories.filter(c => c !== category.value)
                                    }));
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`category-${category.value}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {category.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Selected Categories Display */}
                      {formData.categories.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">
                            {isRTL ? 'الفئات المحددة:' : 'Selected Categories:'}
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {formData.categories.map((category) => (
                              <Badge key={category} variant="secondary" className="cursor-pointer">
                                {category}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      categories: prev.categories.filter(c => c !== category)
                                    }));
                                  }}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dynamic Category Input */}
                      <div className="space-y-2">
                        <Label htmlFor="new-category" className="text-sm text-muted-foreground">
                          {isRTL ? 'إضافة فئة مخصصة' : 'Add Custom Category'}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="new-category"
                            placeholder={isRTL ? 'اسم الفئة المخصصة' : 'Custom category name'}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = (e.target as HTMLInputElement).value.trim();
                                if (value && !formData.categories.includes(value)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    categories: [...prev.categories, value]
                                  }));
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              const value = input.value.trim();
                              if (value && !formData.categories.includes(value)) {
                                setFormData(prev => ({
                                  ...prev,
                                  categories: [...prev.categories, value]
                                }));
                                input.value = '';
                              }
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
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

                  {formData.categories.some(cat => cat === 'physical' || cat === 'accessories' || cat === 'retro') && (
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
                      {isRTL ? 'حفظ المنتج' : 'Save Product'}
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
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminProductAdd;