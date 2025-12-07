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
import { generateEnhancedProductDescription, EnhancedProductDescriptionRequest } from '@/utils/enhancedProductDescriptionAI';
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
  const [generationMetadata, setGenerationMetadata] = useState<any>(null);

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
    setGenerationMetadata(null);

    try {
      const request: EnhancedProductDescriptionRequest = {
        productName: formData.title,
        productNameEn: formData.titleEn,
        productDescriptionEn: formData.descriptionEn, // Pass English description for AI context
        productImages: formData.images,
        language,
        enableImageAnalysis: true,
        enableValidation: isArabic,
        enableFallback: true,
        culturalLevel: 'moderate',
        targetAudience: 'casual',
        promptComplexity: 'standard'
      };

      const result = await generateEnhancedProductDescription(request);

      if (result.description && result.description.trim().length > 0) {
        if (isArabic) {
          setFormData(prev => ({ ...prev, description: result.description }));
        } else {
          setFormData(prev => ({ ...prev, descriptionEn: result.description }));
        }
      } else {
        throw new Error(isRTL ? 'فشل في توليد وصف صالح' : 'Failed to generate valid description');
      }

      setGenerationMetadata(result.metadata);

      // Show validation feedback if available
      if (result.metadata.validation && result.metadata.validation.score < 70) {
        toast({
          title: isRTL ? 'جودة الوصف منخفضة' : 'Low Description Quality',
          description: isRTL ? 'الوصف المولد يحتاج إلى تحسين. يرجى مراجعة التوصيات.' : 'Generated description needs improvement. Please review recommendations.',
          variant: 'default',
          duration: 5000
        });
      } else {
        toast({
          title: isRTL ? 'تم إنشاء الوصف' : 'Description Generated',
          description: isRTL ? 'تم إنشاء الوصف بنجاح باستخدام الذكاء الاصطناعي المعزز' : 'Description generated successfully using enhanced AI',
        });
      }
    } catch (error) {
      console.error('Enhanced AI Description Generation Error:', error);

      // Provide specific error messages based on error type
      let errorMessage = isRTL ? 'فشل في إنشاء الوصف. يرجى المحاولة مرة أخرى.' : 'Failed to generate description. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = isRTL ? 'مفتاح API للذكاء الاصطناعي غير مهيأر. يرجى تكوين الإعدادات في لوحة التحكم.' : 'AI provider API key not configured. Please configure settings in admin panel.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = isRTL ? 'خطأ في الشبكة. يرجى فحص الاتصال بالإنترنت والمحاولة مرة أخرى.' : 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = isRTL ? 'انتهت مدة الانتظار. يرجى المحاولة مرة أخرى.' : 'Request timeout. Please try again.';
        }
      }

      toast({
        title: isRTL ? 'خطأ في إنشاء الوصف' : 'Error Generating Description',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
      setGenerationMetadata(null);
    }
  };

  /* eslint-disable eqeqeq */
  const product = products.find(p => {
    // Check if looking up by sequence ID (if id param is numeric)
    const isSeqIdLookup = !isNaN(Number(id));
    if (isSeqIdLookup && p.seqId) {
      return p.seqId == Number(id);
    }
    // Fallback to UUID match
    return p.id === id || p.sku === id;
  });

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
        isDigital: formData.category === 'guide' || formData.category === 'consultation' || formData.stock === '999',
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku,
        tags: formData.tags,
        status: formData.status,
      };

      const success = await updateProduct(product.id, productData);

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
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="xl:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'المعلومات الأساسية' : 'Basic Information'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base font-semibold">
                        {isRTL ? 'العنوان (العربية)' : 'Title (Arabic)'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder={isRTL ? 'مثال: لعبة فيفا 24' : 'Ex: FIFA 24 Game'}
                        className={`h-11 ${errors.title ? 'border-destructive' : ''}`}
                        dir="rtl"
                      />
                      {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="titleEn" className="text-base font-semibold">
                        {isRTL ? 'العنوان (الإنجليزية)' : 'Title (English)'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="titleEn"
                        value={formData.titleEn}
                        onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                        placeholder={isRTL ? 'Ex: FIFA 24 Game' : 'Ex: FIFA 24 Game'}
                        className={`h-11 ${errors.titleEn ? 'border-destructive' : ''}`}
                        dir="ltr"
                      />
                      {errors.titleEn && <p className="text-xs text-destructive">{errors.titleEn}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description" className="text-base font-semibold">
                        {isRTL ? 'الوصف (العربية)' : 'Description (Arabic)'} <span className="text-destructive">*</span>
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => generateAIDescription('ar')}
                        disabled={generatingArabic}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 text-blue-700"
                      >
                        {generatingArabic ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Wand2 className="w-3 h-3" />
                        )}
                        {isRTL ? 'توليد بالذكاء الاصطناعي' : 'Generate with AI'}
                      </Button>


                      {/* Quality Score Display */}
                      {generationMetadata && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {isRTL ? 'الجودة:' : 'Quality:'}
                            <div className="w-16 bg-gray-200 rounded-full h-2 relative">
                              <div
                                className="bg-green-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${Math.max(0, Math.min(100, generationMetadata.confidence))}%` }}
                              />
                            </div>
                            <span className="ml-2">{generationMetadata.confidence.toFixed(0)}%</span>
                          </span>
                          <span className="flex items-center gap-1">
                            {isRTL ? 'المصدر:' : 'Source:'}
                            <span className={`px-2 py-1 rounded text-xs ${generationMetadata.source === 'ai' ? 'bg-blue-100 text-blue-800' :
                              generationMetadata.source === 'template' ? 'bg-orange-100 text-orange-800' :
                                generationMetadata.source === 'hybrid' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {generationMetadata.source === 'ai' && (isRTL ? 'ذكاء اصطناعي' : 'AI')}
                              {generationMetadata.source === 'template' && (isRTL ? 'قالب' : 'Template')}
                              {generationMetadata.source === 'hybrid' && (isRTL ? 'مدمج' : 'Hybrid')}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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

                      {/* English Quality Score Display */}
                      {generationMetadata && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {isRTL ? 'Quality:' : 'الجودة:'}
                            <div className="w-16 bg-gray-200 rounded-full h-2 relative">
                              <div
                                className="bg-green-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${Math.max(0, Math.min(100, generationMetadata.confidence))}%` }}
                              />
                            </div>
                            <span className="ml-2">{generationMetadata.confidence.toFixed(0)}%</span>
                          </span>
                          <span className="flex items-center gap-1">
                            {isRTL ? 'Source:' : 'المصدر:'}
                            <span className={`px-2 py-1 rounded text-xs ${generationMetadata.source === 'ai' ? 'bg-blue-100 text-blue-800' :
                              generationMetadata.source === 'template' ? 'bg-orange-100 text-orange-800' :
                                generationMetadata.source === 'hybrid' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {generationMetadata.source === 'ai' && (isRTL ? 'ذكاء اصطناعي' : 'AI')}
                              {generationMetadata.source === 'template' && (isRTL ? 'قالب' : 'Template')}
                              {generationMetadata.source === 'hybrid' && (isRTL ? 'مدمج' : 'Hybrid')}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
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
                  <div className="p-6">
                    {useSinglePrice ? (
                      // Single Currency Pricing (KWD)
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-base font-semibold">
                            {isRTL ? 'السعر (د.ك)' : 'Price (KWD)'} <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative max-w-[200px]">
                            <Input
                              id="price"
                              type="number"
                              step="0.001"
                              min="0"
                              value={formData.price}
                              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                              placeholder="0.000"
                              className={`pl-8 ${errors.price ? 'border-destructive' : ''}`}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">KWD</span>
                          </div>
                          {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="originalPrice" className="text-base font-medium text-muted-foreground">
                            {isRTL ? 'السعر الأصلي (قبل الخصم)' : 'Original Price (Before Discount)'}
                          </Label>
                          <div className="relative max-w-[200px]">
                            <Input
                              id="originalPrice"
                              type="number"
                              step="0.001"
                              min="0"
                              value={formData.originalPrice}
                              onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                              placeholder="0.000"
                              className={`pl-8 ${errors.originalPrice ? 'border-destructive' : ''}`}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">KWD</span>
                          </div>
                          {errors.originalPrice && <p className="text-xs text-destructive">{errors.originalPrice}</p>}
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
                  </div>
                </CardContent>
              </Card>



              {/* Inventory & Stock Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {isRTL ? 'المخزون والتعريف' : 'Inventory & Identification'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sku" className="text-base font-semibold">
                        {isRTL ? 'رمز المنتج (SKU)' : 'Product SKU'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="PROD-001"
                        className={`font-mono ${errors.sku ? 'border-destructive' : ''}`}
                      />
                      {errors.sku && <p className="text-xs text-destructive">{errors.sku}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-base font-semibold">
                        {isRTL ? 'الكمية المتوفرة' : 'Stock Quantity'}
                      </Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="stock"
                          type="number"
                          min="0"
                          value={formData.stock}
                          onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                          placeholder="0"
                          className="max-w-[150px]"
                        />
                        <div className="flex items-center gap-2">
                          <Switch
                            id="unlimited-stock"
                            checked={formData.stock === '999' || formData.stock === ''}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, stock: checked ? '999' : '0' }))}
                          />
                          <Label htmlFor="unlimited-stock" className="text-sm cursor-pointer">
                            {isRTL ? 'مخزون غير محدود (منتج رقمي)' : 'Unlimited (Digital)'}
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'العلامات (Tags)' : 'Tags'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isRTL ? 'أكتب علامة واضغط Enter...' : 'Type tag and press Enter...'}
                      className="max-w-md"
                    />
                    <Button type="button" onClick={addTag} variant="secondary">
                      <Plus className="w-4 h-4 mr-1" />
                      {isRTL ? 'إضافة' : 'Add'}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-muted/30 rounded-lg border border-dashed">
                    {formData.tags.length === 0 && (
                      <span className="text-muted-foreground text-sm italic">
                        {isRTL ? 'لا توجد علامات. أضف بعض العلامات لتحسين البحث.' : 'No tags. Add some tags to improve search.'}
                      </span>
                    )}
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2 hover:bg-secondary/80 transition-colors">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-muted-foreground hover:text-destructive transition-colors focus:outline-none"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
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
                        setFormData(prev => ({ ...prev, category: value }))
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
                        setFormData(prev => ({ ...prev, status: value }))
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
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isLimited" className="text-sm">
                      {isRTL ? 'منتج محدود' : 'Limited Product'}
                    </Label>
                    <Switch
                      id="isLimited"
                      checked={formData.isLimited}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLimited: checked }))}
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
    </div >
  );
};

export default AdminProductEdit;