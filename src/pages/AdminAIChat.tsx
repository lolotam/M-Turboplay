import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Image as ImageIcon,
  Package,
  CheckCircle,
  Loader2,
  Trash2,
  Copy,
  RefreshCw,
  BarChart3,
  MessageSquare,
  ShoppingCart,
  Database,
  TrendingUp,
  Settings,
  Zap,
  Brain
} from 'lucide-react';
import AdminNavHeader from '@/components/admin/AdminNavHeader';
import { useProducts } from '@/contexts/ProductsContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useMessages } from '@/contexts/MessagesContext';
import { useDiscountCodes } from '@/contexts/DiscountCodesContext';
import { useSettings, LLMProvider } from '@/contexts/SettingsContext';

// استيراد الأنظمة الجديدة
import { analyzeDatabaseComplete, searchProducts, searchOrders, searchMessages, searchDiscountCodes } from '@/utils/aiDataAnalyzer';
import { parseQuery, getQueryTypeDescription, getSuggestedQueries } from '@/utils/aiQueryParser';
import { generateResponse, AIResponse } from '@/utils/aiResponseGenerator';
import { exportProducts, exportOrders, exportMessages, exportDiscountCodes, exportFullReport } from '@/utils/csvExporter';
import { callLLM } from '@/utils/llmIntegration';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  productData?: ProductData;
  aiResponse?: AIResponse;
}

interface ProductData {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  category: string;
  image?: string;
}

const AdminAIChat: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { toast } = useToast();
  const navigate = useNavigate();

  // Contexts
  const { products, addProduct } = useProducts();
  const { orders } = useOrders();
  const { messages: contactMessages, updateMessageStatus } = useMessages();
  const { discountCodes, addDiscountCode, updateDiscountCode, deleteDiscountCode } = useDiscountCodes();
  const { settings } = useSettings();

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: isRTL
        ? 'مرحباً! 👋 أنا مساعدك الذكي الشامل.\n\n📊 **يمكنني مساعدتك في**:\n\n• 📦 **إضافة منتجات**: "أضف منتج: ..."\n• 📈 **الإحصائيات**: "كم عدد المنتجات؟"\n• 💰 **الإيرادات**: "ما هي الإيرادات الإجمالية؟"\n• 🛒 **الطلبات**: "كم طلب معلق؟"\n• 📧 **الرسائل**: "كم رسالة غير مقروءة؟"\n• 🎟️ **أكواد الخصم**: "كم كود خصم نشط؟" أو "أضف كود خصم SUMMER25"\n• 📊 **التقارير**: "أعطني تقرير شامل"\n• 🎯 **البحث**: "ابحث عن ..."\n\n💡 جرب: "أعطني نظرة عامة" أو "تقرير المبيعات"'
        : 'Hello! 👋 I\'m your comprehensive AI assistant.\n\n📊 **I can help you with**:\n\n• 📦 **Add Products**: "Add product: ..."\n• 📈 **Statistics**: "How many products?"\n• 💰 **Revenue**: "What is the total revenue?"\n• 🛒 **Orders**: "How many pending orders?"\n• 📧 **Messages**: "How many unread messages?"\n• 🎟️ **Discount Codes**: "How many active discount codes?" or "Create discount code SUMMER25"\n• 📊 **Reports**: "Give me a full report"\n• 🎯 **Search**: "Search for ..."\n\n💡 Try: "Give me an overview" or "Sales report"',
      timestamp: new Date()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider>(settings.defaultProvider);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [trainingData, setTrainingData] = useState<Array<{question: string, answer: string, category: string}>>([]);
  const [currentTrainingStep, setCurrentTrainingStep] = useState<'waiting' | 'answering' | 'learning'>('waiting');

  // تحليل البيانات الكاملة
  const databaseStats = useMemo(() => {
    return analyzeDatabaseComplete(products, orders, contactMessages, discountCodes);
  }, [products, orders, contactMessages, discountCodes]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatMessages]);

  const extractProductInfo = (text: string): ProductData | null => {
    try {
      const nameArMatch = text.match(/اسم[:\s]*([^،\n]+)|منتج[:\s]*([^،\n]+)|أضف[:\s]*([^،\n]+)/i);
      const nameAr = nameArMatch ? (nameArMatch[1] || nameArMatch[2] || nameArMatch[3]).trim() : '';

      const nameEnMatch = text.match(/([A-Za-z\s]+(?:Seeds|Tools|Kit|Pack|Product|Service|Guide))/i);
      const nameEn = nameEnMatch ? nameEnMatch[1].trim() : '';

      const priceMatch = text.match(/سعر[:\s]*(\d+\.?\d*)|price[:\s]*(\d+\.?\d*)|(\d+\.?\d*)\s*(?:دينار|kwd|د\.ك)/i);
      const price = priceMatch ? parseFloat(priceMatch[1] || priceMatch[2] || priceMatch[3]) : 0;

      const categoryMatch = text.match(/فئة[:\s]*(\w+)|category[:\s]*(\w+)|نوع[:\s]*(\w+)/i);
      let category = categoryMatch ? (categoryMatch[1] || categoryMatch[2] || categoryMatch[3]).toLowerCase() : 'guide';

      const categoryMap: Record<string, string> = {
        'دليل': 'guide',
        'أدلة': 'guide',
        'guide': 'guide',
        'guides': 'guide',
        'فيزيائي': 'physical',
        'منتج': 'physical',
        'physical': 'physical',
        'استشارة': 'consultation',
        'consultation': 'consultation',
        'تيشيرت': 'tshirts',
        'قميص': 'tshirts',
        'tshirt': 'tshirts',
        'tshirts': 'tshirts'
      };
      category = categoryMap[category] || 'guide';

      const descArMatch = text.match(/وصف[:\s]*([^،\n]+)|تفاصيل[:\s]*([^،\n]+)/i);
      const descriptionAr = descArMatch ? (descArMatch[1] || descArMatch[2]).trim() : nameAr;

      const descEnMatch = text.match(/description[:\s]*([^،\n]+)|details[:\s]*([^،\n]+)/i);
      const descriptionEn = descEnMatch ? (descEnMatch[1] || descEnMatch[2]).trim() : nameEn;

      if (!nameAr && !nameEn) {
        return null;
      }

      return {
        nameAr: nameAr || nameEn,
        nameEn: nameEn || nameAr,
        descriptionAr: descriptionAr || nameAr,
        descriptionEn: descriptionEn || nameEn,
        price: price || 0,
        category,
        image: uploadedImage || undefined
      };
    } catch (error) {
      console.error('خطأ في استخراج معلومات المنتج:', error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsProcessing(true);

    // If in training mode, handle training response
    if (isTrainingMode) {
      setTimeout(() => {
        handleTrainingResponse(currentInput);
        setIsProcessing(false);
      }, 1000);
      return;
    }

    // Check if LLM provider is configured and enabled
    const providerConfig = selectedProvider !== 'local' ? settings.providers[selectedProvider as keyof typeof settings.providers] : null;
    const useLLM = selectedProvider !== 'local' && providerConfig?.isEnabled && providerConfig?.apiKey;

    if (useLLM && providerConfig) {
      // Use external LLM provider
      try {
        const llmResponse = await callLLM(currentInput, selectedProvider, providerConfig);

        if (llmResponse.error) {
          // LLM failed, show error and fall back to local
          const errorMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: isRTL
              ? `❌ خطأ في الاتصال بـ ${selectedProvider.toUpperCase()}:\n${llmResponse.error}\n\n🔄 التبديل إلى المساعد المحلي...`
              : `❌ Error connecting to ${selectedProvider.toUpperCase()}:\n${llmResponse.error}\n\n🔄 Switching to local assistant...`,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, errorMessage]);
          setIsProcessing(false);

          // Fall back to local processing
          setTimeout(() => handleLocalProcessing(currentInput), 1000);
          return;
        }

        // Success - show LLM response
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `${llmResponse.content}\n\n---\n🤖 ${isRTL ? 'المزود' : 'Provider'}: ${selectedProvider.toUpperCase()} (${llmResponse.model})${llmResponse.tokensUsed ? `\n📊 ${isRTL ? 'الرموز المستخدمة' : 'Tokens used'}: ${llmResponse.tokensUsed}` : ''}`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
      } catch (error) {
        // Unexpected error
        const errorMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: isRTL
            ? `❌ خطأ غير متوقع. التبديل إلى المساعد المحلي...`
            : `❌ Unexpected error. Switching to local assistant...`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
        setIsProcessing(false);

        // Fall back to local processing
        setTimeout(() => handleLocalProcessing(currentInput), 1000);
      }
    } else {
      // Use local AI processing
      handleLocalProcessing(currentInput);
    }
  };

  const handleLocalProcessing = (inputMessage: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      // تحليل الاستعلام
      const parsedQuery = parseQuery(inputMessage);

      // إذا كان إضافة منتج، استخدم النظام القديم
      if (parsedQuery.type === 'product_add') {
        const productData = extractProductInfo(inputMessage);

        if (productData) {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: isRTL
              ? `✨ رائع! فهمت المعلومات:\n\n📦 المنتج:\n   • عربي: ${productData.nameAr}\n   • English: ${productData.nameEn}\n\n💰 السعر: ${productData.price} د.ك\n📁 الفئة: ${productData.category}\n📄 الوصف:\n   • ${productData.descriptionAr}\n   • ${productData.descriptionEn}\n\n${uploadedImage ? '🖼️ الصورة: تم الرفع ✓' : ''}\n\nهل تريد إضافة هذا المنتج؟ اضغط على الزر أدناه`
              : `✨ Great! I understood:\n\n📦 Product:\n   • Arabic: ${productData.nameAr}\n   • English: ${productData.nameEn}\n\n💰 Price: ${productData.price} KWD\n📁 Category: ${productData.category}\n📄 Description:\n   • ${productData.descriptionAr}\n   • ${productData.descriptionEn}\n\n${uploadedImage ? '🖼️ Image: Uploaded ✓' : ''}\n\nWant to add this product? Click the button below`,
            timestamp: new Date(),
            productData
          };

          setChatMessages(prev => [...prev, assistantMessage]);
        } else {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: isRTL
              ? '❌ عذراً، لم أستطع فهم المعلومات بشكل كامل.\n\n📝 يرجى تقديم المعلومات بالشكل التالي:\n\n"اسم المنتج: [الاسم بالعربي], [الاسم بالإنجليزي]\nالسعر: [الرقم] دينار\nالفئة: guide أو physical أو consultation أو tshirts\nالوصف: [وصف المنتج]"\n\nأو استخدم أحد الأمثلة السريعة أدناه ⬇️'
              : '❌ Sorry, I couldn\'t understand the information.\n\n📝 Please provide:\n\n"Product name: [Arabic name], [English name]\nPrice: [number] KWD\nCategory: guide or physical or consultation or tshirts\nDescription: [product description]"\n\nOr use a quick example below ⬇️',
            timestamp: new Date()
          };

          setChatMessages(prev => [...prev, assistantMessage]);
        }
      } else {
        // استخدام نظام الرد الذكي الجديد
        let searchedProducts = products;
        let searchedOrders = orders;
        let searchedMessages = contactMessages;
        let searchedDiscountCodes = discountCodes;

        // البحث إذا كان هناك مصطلح بحث
        if (parsedQuery.searchTerm) {
          searchedProducts = searchProducts(products, parsedQuery.searchTerm, parsedQuery.filters);
          searchedOrders = searchOrders(orders, parsedQuery.searchTerm, parsedQuery.filters);
          searchedMessages = searchMessages(contactMessages, parsedQuery.searchTerm, parsedQuery.filters);
          searchedDiscountCodes = searchDiscountCodes(discountCodes, parsedQuery.searchTerm, parsedQuery.filters);
        }

        const aiResponse = generateResponse(
          parsedQuery,
          databaseStats,
          searchedProducts,
          searchedOrders,
          searchedMessages,
          searchedDiscountCodes,
          isRTL
        );

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date(),
          aiResponse
        };

        setChatMessages(prev => [...prev, assistantMessage]);

        // اقتراحات للأسئلة التالية
        const suggestions = getSuggestedQueries(parsedQuery.type, isRTL);
        if (suggestions.length > 0 && parsedQuery.confidence < 80) {
          const suggestionMessage: Message = {
            id: `suggestion-${Date.now()}`,
            role: 'assistant',
            content: isRTL
              ? `💡 **أسئلة مقترحة**:\n${suggestions.map(s => `• ${s}`).join('\n')}`
              : `💡 **Suggested questions**:\n${suggestions.map(s => `• ${s}`).join('\n')}`,
            timestamp: new Date()
          };

          setTimeout(() => {
            setChatMessages(prev => [...prev, suggestionMessage]);
          }, 500);
        }
      }

      setIsProcessing(false);
      setUploadedImage(null);
    }, 1000);
  };

  const handleAddProduct = async (productData: ProductData) => {
    try {
      const newProduct = {
        title: productData.nameAr,
        titleEn: productData.nameEn,
        description: productData.descriptionAr,
        descriptionEn: productData.descriptionEn,
        price: productData.price,
        category: productData.category as 'guide' | 'physical' | 'consultation' | 'tshirts',
        image: productData.image || '/placeholder.svg',
        isDigital: productData.category === 'guide' || productData.category === 'consultation',
        stock: productData.category === 'guide' || productData.category === 'consultation' ? 999 : 50,
        sku: `AI-${Date.now()}`,
        tags: [productData.category],
        status: 'active' as const
      };

      const success = await addProduct(newProduct);

      if (!success) {
        throw new Error('Failed to add product');
      }

      const successMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: isRTL
          ? `✅ تم بنجاح! 🎉\n\nتم إضافة المنتج "${productData.nameAr}" إلى المتجر.\n\nيمكنك الآن:\n• 📦 عرض المنتج في قائمة المنتجات\n• ➕ إضافة منتج جديد آخر\n• ✏️ تعديل المنتج من صفحة المنتجات`
          : `✅ Success! 🎉\n\nProduct "${productData.nameEn}" has been added.\n\nYou can now:\n• 📦 View in products list\n• ➕ Add another product\n• ✏️ Edit from products page`,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, successMessage]);

      toast({
        title: isRTL ? '✅ تم بنجاح' : '✅ Success',
        description: isRTL
          ? `تم إضافة "${productData.nameAr}" بنجاح`
          : `"${productData.nameEn}" added successfully`,
      });
    } catch (error) {
      console.error('خطأ في إضافة المنتج:', error);

      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: isRTL
          ? '❌ عذراً، حدث خطأ أثناء إضافة المنتج. يرجى المحاولة مرة أخرى.'
          : '❌ Sorry, an error occurred while adding the product. Please try again.',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, errorMessage]);

      toast({
        title: isRTL ? '❌ خطأ' : '❌ Error',
        description: isRTL ? 'حدث خطأ أثناء إضافة المنتج' : 'Error adding product',
        variant: 'destructive',
      });
    }
  };

  const handleCreateDiscountCode = async (discountData: any) => {
    try {
      const newCode = {
        code: discountData.code,
        type: discountData.type || 'percentage',
        value: discountData.value,
        usageLimit: discountData.usageLimit || 100,
        oneUserOnly: discountData.oneUserOnly || false,
        isActive: true
      };

      const success = await addDiscountCode(newCode);

      if (!success) {
        throw new Error('Failed to create discount code');
      }

      const successMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: isRTL
          ? `✅ تم بنجاح! 🎉\n\nتم إنشاء كود الخصم "${discountData.code}" بنجاح.\n\nيمكنك الآن:\n• 🎟️ عرض الكود في قائمة أكواد الخصم\n• ➕ إضافة كود خصم آخر\n• ✏️ تعديل الكود من صفحة أكواد الخصم`
          : `✅ Success! 🎉\n\nDiscount code "${discountData.code}" has been created.\n\nYou can now:\n• 🎟️ View in discount codes list\n• ➕ Add another code\n• ✏️ Edit from discount codes page`,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, successMessage]);

      toast({
        title: isRTL ? '✅ تم بنجاح' : '✅ Success',
        description: isRTL
          ? `تم إنشاء كود الخصم "${discountData.code}" بنجاح`
          : `Discount code "${discountData.code}" created successfully`,
      });
    } catch (error) {
      console.error('خطأ في إنشاء كود الخصم:', error);

      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: isRTL
          ? '❌ عذراً، حدث خطأ أثناء إنشاء كود الخصم. يرجى المحاولة مرة أخرى.'
          : '❌ Sorry, an error occurred while creating the discount code. Please try again.',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, errorMessage]);

      toast({
        title: isRTL ? '❌ خطأ' : '❌ Error',
        description: isRTL ? 'حدث خطأ أثناء إنشاء كود الخصم' : 'Error creating discount code',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDiscountCode = async (codeId: string) => {
    try {
      const success = await deleteDiscountCode(codeId);

      if (!success) {
        throw new Error('Failed to delete discount code');
      }

      const successMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: isRTL
          ? `✅ تم الحذف بنجاح! 🗑️\n\nتم حذف كود الخصم من النظام.`
          : `✅ Deleted successfully! 🗑️\n\nThe discount code has been removed from the system.`,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, successMessage]);

      toast({
        title: isRTL ? '✅ تم الحذف' : '✅ Deleted',
        description: isRTL ? 'تم حذف كود الخصم بنجاح' : 'Discount code deleted successfully',
      });
    } catch (error) {
      console.error('خطأ في حذف كود الخصم:', error);

      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: isRTL
          ? '❌ عذراً، حدث خطأ أثناء حذف كود الخصم. يرجى المحاولة مرة أخرى.'
          : '❌ Sorry, an error occurred while deleting the discount code. Please try again.',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, errorMessage]);

      toast({
        title: isRTL ? '❌ خطأ' : '❌ Error',
        description: isRTL ? 'حدث خطأ أثناء حذف كود الخصم' : 'Error deleting discount code',
        variant: 'destructive',
      });
    }
  };

  /**
   * معالج تصدير البيانات
   */
  const handleExport = (exportData: any) => {
    try {
      const { type, items, products: prods, orders: ords, messages: msgs, discountCodes: codes } = exportData;

      switch (type) {
        case 'products':
          exportProducts(items, isRTL);
          break;
        case 'orders':
          exportOrders(items, isRTL);
          break;
        case 'messages':
          exportMessages(items, isRTL);
          break;
        case 'discounts':
          exportDiscountCodes(items, isRTL);
          break;
        case 'full':
          exportFullReport(prods, ords, msgs, codes, isRTL);
          break;
        default:
          throw new Error('Unknown export type');
      }

      toast({
        title: isRTL ? '✅ تم التصدير' : '✅ Exported',
        description: isRTL ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully',
      });
    } catch (error) {
      console.error('خطأ في تصدير البيانات:', error);
      toast({
        title: isRTL ? '❌ خطأ' : '❌ Error',
        description: isRTL ? 'حدث خطأ أثناء تصدير البيانات' : 'Error exporting data',
        variant: 'destructive',
      });
    }
  };

  /**
   * معالج العمليات الجماعية
   */
  const handleBulkOperation = async (operationData: any) => {
    try {
      const { action, count, codes } = operationData;

      if (action === 'bulk_mark_read') {
        // تحديد جميع الرسائل كمقروءة
        const unreadMessages = contactMessages.filter(m => m.status === 'unread');
        for (const msg of unreadMessages) {
          await updateMessageStatus(msg.id, 'read');
        }

        toast({
          title: isRTL ? '✅ تم بنجاح' : '✅ Success',
          description: isRTL
            ? `تم تحديد ${count} رسالة كمقروءة`
            : `Marked ${count} messages as read`,
        });
      } else if (action === 'bulk_deactivate_expired') {
        // تعطيل جميع الأكواد المنتهية
        for (const code of codes) {
          await updateDiscountCode(code.id, { isActive: false });
        }

        toast({
          title: isRTL ? '✅ تم بنجاح' : '✅ Success',
          description: isRTL
            ? `تم تعطيل ${codes.length} كود خصم منتهي`
            : `Deactivated ${codes.length} expired codes`,
        });
      }
    } catch (error) {
      console.error('خطأ في العملية الجماعية:', error);
      toast({
        title: isRTL ? '❌ خطأ' : '❌ Error',
        description: isRTL ? 'حدث خطأ أثناء تنفيذ العملية' : 'Error executing operation',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        toast({
          title: isRTL ? '✅ تم رفع الصورة' : '✅ Image uploaded',
          description: isRTL ? 'يمكنك الآن إرسال معلومات المنتج' : 'You can now send product info',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: '1',
        role: 'assistant',
        content: isRTL
          ? 'تم مسح المحادثة. كيف يمكنني مساعدتك اليوم؟'
          : 'Chat cleared. How can I help you today?',
        timestamp: new Date()
      }
    ]);
  };

  const handleTraining = () => {
    setIsTrainingMode(!isTrainingMode);
    
    if (!isTrainingMode) {
      const trainingMessage: Message = {
        id: `training-${Date.now()}`,
        role: 'assistant',
        content: isRTL
          ? `🧠 **وضع التدريب الذكي** 🧠\n\nمرحباً! أنا في وضع التدريب الآن. يمكنك تدريبي على الأسئلة والإجابات التالية:\n\n📚 **أسئلة التدريب المتاحة**:\n\n1. **إدارة المنتجات**\n   • س: "كيف أضيف منتج جديد؟"\n   • ج: "اكتب: أضف منتج: [اسم المنتج]، [السعر]، [الفئة]"\n\n2. **الإحصائيات والتقارير**\n   • س: "كيف أعرف عدد المنتجات؟"\n   • ج: "اكتب: كم عدد المنتجات؟ أو أعطني نظرة عامة"\n\n3. **إدارة الطلبات**\n   • س: "كيف أعرض الطلبات المعلقة؟"\n   • ج: "اكتب: كم طلب معلق؟ أو اعرض الطلبات المعلقة"\n\n4. **أكواد الخصم**\n   • س: "كيف أنشئ كود خصم؟"\n   • ج: "اكتب: أضف كود خصم [اسم الكود] بنسبة [النسبة]"\n\n5. **الرسائل والاتصال**\n   • س: "كيف أرى الرسائل غير المقروءة؟"\n   • ج: "اكتب: كم رسالة غير مقروءة؟"\n\n🎯 **ابدأ التدريب**:\n\nاكتب أي سؤال من الأسئلة أعلاه وسأقوم بالإجابة عليه وتدريبي على فهمه بشكل أفضل. كلما تدربت أكثر، أصبحت ذكياً أكثر في مساعدتك!\n\n💡 **مثال للبدء**:\nاكتب: "كيف أضيف منتج جديد؟"\n\n🔄 للخروج من وضع التدريب، اضغط على زر "التدريب" مرة أخرى`
          : `🧠 **Smart Training Mode** 🧠\n\nHello! I'm in training mode now. You can train me on the following questions and answers:\n\n📚 **Available Training Questions**:\n\n1. **Product Management**\n   • Q: "How do I add a new product?"\n   • A: "Write: Add product: [product name], [price], [category]"\n\n2. **Statistics and Reports**\n   • Q: "How do I know the number of products?"\n   • A: "Write: How many products? or Give me overview"\n\n3. **Order Management**\n   • Q: "How do I view pending orders?"\n   • A: "Write: How many pending orders? or Show pending orders"\n\n4. **Discount Codes**\n   • Q: "How do I create a discount code?"\n   • A: "Write: Add discount code [code name] with [percentage]"\n\n5. **Messages and Contact**\n   • Q: "How do I see unread messages?"\n   • A: "Write: How many unread messages?"\n\n🎯 **Start Training**:\n\nWrite any question from above and I'll answer it and train myself to understand it better. The more you train me, the smarter I become in helping you!\n\n💡 **Example to start**:\nWrite: "How do I add a new product?"\n\n🔄 To exit training mode, press the "Training" button again`,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, trainingMessage]);
      setCurrentTrainingStep('waiting');

      toast({
        title: isRTL ? '🧠 وضع التدريب' : '🧠 Training Mode',
        description: isRTL
          ? 'تم تفعيل وضع التدريب. ابدأ بكتابة الأسئلة لتدريب الذكاء الاصطناعي.'
          : 'Training mode activated. Start writing questions to train the AI.',
      });
    } else {
      setIsTrainingMode(false);
      setCurrentTrainingStep('waiting');
      
      const exitMessage: Message = {
        id: `exit-training-${Date.now()}`,
        role: 'assistant',
        content: isRTL
          ? '👋 **خروج من وضع التدريب**\n\nشكراً للتدريب! لقد تعلمت من الأسئلة والإجابات التي قدمتها. سأستخدم هذه المعرفة لمساعدتك بشكل أفضل في المستقبل.\n\nيمكنك العودة لوضع التدريب في أي وقت بالضغط على زر "التدريب".'
          : '👋 **Exiting Training Mode**\n\nThank you for training! I have learned from the questions and answers you provided. I will use this knowledge to help you better in the future.\n\nYou can return to training mode at any time by pressing the "Training" button.',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, exitMessage]);
    }
  };

  const handleTrainingResponse = (userInput: string) => {
    const trainingQuestions = [
      {
        question: isRTL ? "كيف أضيف منتج جديد؟" : "How do I add a new product?",
        answer: isRTL
          ? "اكتب: أضف منتج: [اسم المنتج]، [السعر]، [الفئة]"
          : "Write: Add product: [product name], [price], [category]",
        category: isRTL ? "إدارة المنتجات" : "Product Management"
      },
      {
        question: isRTL ? "كيف أعرف عدد المنتجات؟" : "How do I know number of products?",
        answer: isRTL
          ? "اكتب: كم عدد المنتجات؟ أو أعطني نظرة عامة"
          : "Write: How many products? or Give me overview",
        category: isRTL ? "الإحصائيات والتقارير" : "Statistics and Reports"
      },
      {
        question: isRTL ? "كيف أعرض الطلبات المعلقة؟" : "How do I view pending orders?",
        answer: isRTL
          ? "اكتب: كم طلب معلق؟ أو اعرض الطلبات المعلقة"
          : "Write: How many pending orders? or Show pending orders",
        category: isRTL ? "إدارة الطلبات" : "Order Management"
      },
      {
        question: isRTL ? "كيف أنشئ كود خصم؟" : "How do I create a discount code?",
        answer: isRTL
          ? "اكتب: أضف كود خصم [اسم الكود] بنسبة [النسبة]"
          : "Write: Add discount code [code name] with [percentage]",
        category: isRTL ? "أكواد الخصم" : "Discount Codes"
      },
      {
        question: isRTL ? "كيف أرى الرسائل غير المقروءة؟" : "How do I see unread messages?",
        answer: isRTL
          ? "اكتب: كم رسالة غير مقروءة؟"
          : "Write: How many unread messages?",
        category: isRTL ? "الرسائل والاتصال" : "Messages and Contact"
      }
    ];

    const matchedQuestion = trainingQuestions.find(q =>
      userInput.toLowerCase().includes(q.question.toLowerCase()) ||
      q.question.toLowerCase().includes(userInput.toLowerCase())
    );

    if (matchedQuestion) {
      setCurrentTrainingStep('learning');
      
      // Add to training data
      const newTrainingItem = {
        question: userInput,
        answer: matchedQuestion.answer,
        category: matchedQuestion.category
      };
      setTrainingData(prev => [...prev, newTrainingItem]);

      const learningMessage: Message = {
        id: `learning-${Date.now()}`,
        role: 'assistant',
        content: isRTL
          ? `✅ **تم التعلم بنجاح!** 🎉\n\nلقد تعلمت السؤال الجديد:\n\n❓ **السؤال**: "${userInput}"\n💡 **الإجابة**: ${matchedQuestion.answer}\n📁 **الفئة**: ${matchedQuestion.category}\n\n🧠 **حفظ في الذاكرة**: تم حفظ هذا النمط للإجابات المستقبلية.\n\n📊 **إجمالي التدريبات**: ${trainingData.length + 1}\n\n💡 **جرب سؤالاً آخر** أو اضغط على زر "التدريب" للخروج.`
          : `✅ **Successfully Learned!** 🎉\n\nI have learned new question:\n\n❓ **Question**: "${userInput}"\n💡 **Answer**: ${matchedQuestion.answer}\n📁 **Category**: ${matchedQuestion.category}\n\n🧠 **Saved to Memory**: This pattern has been saved for future responses.\n\n📊 **Total Training Sessions**: ${trainingData.length + 1}\n\n💡 **Try another question** or press "Training" button to exit.`,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, learningMessage]);
      
      toast({
        title: isRTL ? '✅ تم التعلم' : '✅ Learned',
        description: isRTL
          ? `تم تعلم نمط جديد: ${matchedQuestion.category}`
          : `New pattern learned: ${matchedQuestion.category}`,
      });

      setTimeout(() => setCurrentTrainingStep('waiting'), 2000);
    } else {
      const notFoundMessage: Message = {
        id: `not-found-${Date.now()}`,
        role: 'assistant',
        content: isRTL
          ? `🤔 **لم أتعرف على هذا السؤال**\n\nالسؤال الذي كتبته ليس في قائمة الأسئلة المتاحة للتدريب.\n\n📚 **الأسئلة المتاحة**:\n${trainingQuestions.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}\n\n💡 **رجاءً**: اختر أحد الأسئلة أعلاه للتدريب.\n\nأو اكتب سؤالاً مشابهاً لأحد الأسئلة المذكورة.`
          : `🤔 **Question not recognized**\n\nThe question you wrote is not in list of available training questions.\n\n📚 **Available Questions**:\n${trainingQuestions.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}\n\n💡 **Please**: Choose one of the questions above for training.\n\nOr write a question similar to one of the mentioned questions.`,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, notFoundMessage]);
    }
  };

  const quickExamples = [
    {
      icon: <Package className="w-4 h-4" />,
      text: isRTL ? 'إضافة منتج' : 'Add Product',
      prompt: 'أضف منتج: دليل بذور طماطم، Tomato Seeds Guide، السعر 5.5 دينار، الفئة guide، الوصف: دليل شامل لزراعة الطماطم'
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      text: isRTL ? 'نظرة عامة' : 'Overview',
      prompt: isRTL ? 'أعطني نظرة عامة عن الموقع' : 'Give me an overview'
    },
    {
      icon: <ShoppingCart className="w-4 h-4" />,
      text: isRTL ? 'عدد الطلبات' : 'Order Count',
      prompt: isRTL ? 'كم عدد الطلبات؟' : 'How many orders?'
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      text: isRTL ? 'الإيرادات' : 'Revenue',
      prompt: isRTL ? 'ما هي الإيرادات الإجمالية؟' : 'What is the total revenue?'
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      text: isRTL ? 'الرسائل' : 'Messages',
      prompt: isRTL ? 'كم رسالة غير مقروءة؟' : 'How many unread messages?'
    },
    {
      icon: <Badge className="w-4 h-4" />,
      text: isRTL ? 'أكواد الخصم' : 'Discount Codes',
      prompt: isRTL ? 'كم كود خصم نشط؟' : 'How many active discount codes?'
    },
    {
      icon: <Database className="w-4 h-4" />,
      text: isRTL ? 'تقرير شامل' : 'Full Report',
      prompt: isRTL ? 'أعطني تقرير شامل' : 'Give me a full report'
    }
  ];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <AdminNavHeader />

      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-8 h-8 text-purple-600" />
                <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {isRTL ? 'مساعد الذكاء الاصطناعي الشامل' : 'Comprehensive AI Assistant'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'تحليل البيانات، الإحصائيات، والتقارير الذكية' : 'Data analysis, statistics, and smart reports'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* AI Provider Selector */}
              <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2 border border-border">
                <Zap className="w-4 h-4 text-yellow-500" />
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as LLMProvider)}
                  className="bg-transparent text-sm font-medium border-none outline-none cursor-pointer"
                >
                  <option value="local">{isRTL ? '🏠 محلي' : '🏠 Local'}</option>
                  <option value="openai" disabled={!settings.providers.openai.isEnabled || !settings.providers.openai.apiKey}>
                    {isRTL ? '🤖 OpenAI' : '🤖 OpenAI'} {settings.providers.openai.isEnabled && settings.providers.openai.apiKey ? '✓' : '⚠️'}
                  </option>
                  <option value="claude" disabled={!settings.providers.claude.isEnabled || !settings.providers.claude.apiKey}>
                    {isRTL ? '🧠 Claude' : '🧠 Claude'} {settings.providers.claude.isEnabled && settings.providers.claude.apiKey ? '✓' : '⚠️'}
                  </option>
                  <option value="perplexity" disabled={!settings.providers.perplexity.isEnabled || !settings.providers.perplexity.apiKey}>
                    {isRTL ? '🔍 Perplexity' : '🔍 Perplexity'} {settings.providers.perplexity.isEnabled && settings.providers.perplexity.apiKey ? '✓' : '⚠️'}
                  </option>
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => navigate('/admin/settings')}
                  title={isRTL ? 'إعدادات الذكاء الاصطناعي' : 'AI Settings'}
                >
                  <Settings className="w-3 h-3" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={handleTraining}
                size="sm"
                className={`${isTrainingMode
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white border-gray-700'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border-gray-400 text-gray-800'
                } transition-all duration-300`}
              >
                <Brain className={`w-4 h-4 mr-2 ${isTrainingMode ? 'text-white' : 'text-gray-700'}`} />
                {isRTL ? 'التدريب' : 'Training'}
              </Button>
              <Button variant="outline" onClick={clearChat} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                {isRTL ? 'مسح' : 'Clear'}
              </Button>
              <Button onClick={() => navigate('/admin/dashboard')} size="sm" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                {isRTL ? 'لوحة التحكم' : 'Dashboard'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="h-[calc(100vh-280px)] flex flex-col">
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full p-6">
                    <div className="space-y-6">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.role === 'assistant' && (
                            <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
                              <AvatarFallback>
                                <Bot className="h-6 w-6 text-white" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                              {message.content}
                            </p>

                            {message.productData && (
                              <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                                <Button
                                  onClick={() => handleAddProduct(message.productData!)}
                                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                  size="sm"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  {isRTL ? 'إضافة المنتج الآن' : 'Add Product Now'}
                                </Button>
                              </div>
                            )}

                            {message.aiResponse?.actions && message.aiResponse.actions.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                                {message.aiResponse.actions.map((action, idx) => (
                                  <Button
                                    key={idx}
                                    onClick={() => {
                                      if (action.type === 'navigate' && action.target) {
                                        navigate(action.target);
                                      } else if (action.type === 'create' && action.data) {
                                        handleCreateDiscountCode(action.data);
                                      } else if (action.type === 'delete' && action.data?.id) {
                                        handleDeleteDiscountCode(action.data.id);
                                      } else if (action.type === 'export' && action.data) {
                                        handleExport(action.data);
                                      } else if (action.type === 'confirm' && action.data) {
                                        handleBulkOperation(action.data);
                                      }
                                    }}
                                    className={`w-full ${
                                      action.type === 'delete'
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : action.type === 'create'
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : ''
                                    }`}
                                    size="sm"
                                    variant={action.type === 'delete' || action.type === 'create' ? 'default' : 'outline'}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                              <span>
                                {message.timestamp.toLocaleTimeString(isRTL ? 'ar-KW' : 'en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>

                          {message.role === 'user' && (
                            <Avatar className="h-10 w-10 bg-primary flex-shrink-0">
                              <AvatarFallback>
                                <User className="h-6 w-6 text-primary-foreground" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}

                      {isProcessing && (
                        <div className="flex gap-3 justify-start">
                          <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500">
                            <AvatarFallback>
                              <Bot className="h-6 w-6 text-white" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">
                                {isRTL ? 'جاري التحليل...' : 'Analyzing...'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Input Area */}
                <div className="border-t p-4 bg-muted/30">
                  {uploadedImage && (
                    <div className="mb-3 relative inline-block">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="h-20 w-20 object-cover rounded-lg border-2 border-primary"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => setUploadedImage(null)}
                      >
                        ×
                      </Button>
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="flex-shrink-0"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </Button>

                    <Textarea
                      placeholder={isRTL ? 'اسأل عن أي شيء في الموقع...' : 'Ask about anything...'}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[60px] max-h-[120px] resize-none"
                      disabled={isProcessing}
                    />

                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      disabled={isProcessing || !inputMessage.trim()}
                      className="h-[60px] flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground text-center">
                    {isRTL
                      ? '💡 استخدم Enter للإرسال، Shift+Enter لسطر جديد'
                      : '💡 Press Enter to send, Shift+Enter for new line'
                    }
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Examples Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold">
                      {isRTL ? 'أوامر سريعة' : 'Quick Commands'}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {quickExamples.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs h-auto py-3"
                        onClick={() => setInputMessage(example.prompt)}
                      >
                        {example.icon}
                        <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-left flex-1`}>{example.text}</span>
                      </Button>
                    ))}
                  </div>

                  <div className="mt-6 p-3 bg-muted/50 rounded-lg text-xs space-y-2">
                    <p className="font-semibold flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      {isRTL ? 'أمثلة على الأسئلة' : 'Example Questions'}
                    </p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• {isRTL ? 'كم عدد المنتجات؟' : 'How many products?'}</li>
                      <li>• {isRTL ? 'ما هي الإيرادات؟' : 'What is the revenue?'}</li>
                      <li>• {isRTL ? 'كم طلب معلق؟' : 'Pending orders?'}</li>
                      <li>• {isRTL ? 'تقرير المبيعات' : 'Sales report'}</li>
                      <li>• {isRTL ? 'أكواد الخصم المستخدمة' : 'Used promo codes'}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAIChat;
