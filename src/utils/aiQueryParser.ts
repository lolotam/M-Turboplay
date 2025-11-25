/**
 * نظام فهم الأسئلة والاستعلامات
 * يقوم بتحليل أسئلة المستخدم وتحديد نوع الاستعلام والمعلومات المطلوبة
 */

export type QueryType =
  | 'product_add'           // إضافة منتج
  | 'product_count'         // عدد المنتجات
  | 'product_search'        // البحث عن منتج
  | 'product_stats'         // إحصائيات المنتجات
  | 'product_low_stock'     // منتجات منخفضة المخزون
  | 'order_count'           // عدد الطلبات
  | 'order_search'          // البحث عن طلب
  | 'order_stats'           // إحصائيات الطلبات
  | 'order_revenue'         // الإيرادات
  | 'order_date_range'      // طلبات في فترة زمنية
  | 'message_count'         // عدد الرسائل
  | 'message_search'        // البحث عن رسالة
  | 'message_stats'         // إحصائيات الرسائل
  | 'message_urgent'        // رسائل عاجلة فقط
  | 'discount_count'        // عدد أكواد الخصم
  | 'discount_search'       // البحث عن كود خصم
  | 'discount_stats'        // إحصائيات أكواد الخصم
  | 'discount_create'       // إنشاء كود خصم
  | 'discount_update'       // تحديث كود خصم
  | 'discount_delete'       // حذف كود خصم
  | 'discount_unused'       // أكواد خصم غير مستخدمة
  | 'discount_expired'      // أكواد خصم منتهية
  | 'promo_stats'           // إحصائيات أكواد الخصم (legacy)
  | 'analytics_revenue_trend'    // اتجاه الإيرادات
  | 'analytics_best_sellers'     // الأكثر مبيعاً
  | 'analytics_order_patterns'   // أنماط الطلبات
  | 'export_products'       // تصدير المنتجات
  | 'export_orders'         // تصدير الطلبات
  | 'export_messages'       // تصدير الرسائل
  | 'export_discounts'      // تصدير أكواد الخصم
  | 'export_full'           // تصدير شامل
  | 'bulk_mark_read'        // تحديد الكل كمقروء
  | 'bulk_deactivate_expired'    // تعطيل الأكواد المنتهية
  | 'overview'              // نظرة عامة شاملة
  | 'report_products'       // تقرير المنتجات
  | 'report_orders'         // تقرير الطلبات
  | 'report_messages'       // تقرير الرسائل
  | 'report_discounts'      // تقرير أكواد الخصم
  | 'report_full'           // تقرير شامل
  | 'unknown';              // غير معروف

export interface ParsedQuery {
  type: QueryType;
  filters?: {
    category?: string;
    status?: string;
    priority?: string;
    paymentMethod?: string;
    dateFrom?: Date;
    dateTo?: Date;
    isDigital?: boolean;
    isNew?: boolean;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    type?: string;
    oneUserOnly?: boolean;
  };
  searchTerm?: string;
  confidence: number; // مستوى الثقة في التحليل (0-100)
  discountData?: {
    code?: string;
    type?: 'percentage' | 'fixed';
    value?: number;
    usageLimit?: number;
    oneUserOnly?: boolean;
  };
}

/**
 * الكلمات المفتاحية للتعرف على نوع الاستعلام
 */
const KEYWORDS = {
  // عدد / إحصائيات
  count: {
    ar: ['كم', 'عدد', 'كام', 'اعداد', 'احصاء', 'احصائيات', 'إحصائيات', 'إحصاء'],
    en: ['how many', 'count', 'number', 'total', 'statistics', 'stats']
  },

  // منتجات
  products: {
    ar: ['منتج', 'منتجات', 'سلعة', 'سلع', 'بضاعة', 'بضائع'],
    en: ['product', 'products', 'item', 'items', 'merchandise']
  },

  // طلبات
  orders: {
    ar: ['طلب', 'طلبات', 'أوردر', 'اوردر', 'طلبية', 'طلبيات', 'مبيعات', 'مبيعة'],
    en: ['order', 'orders', 'sale', 'sales', 'purchase', 'purchases']
  },

  // رسائل
  messages: {
    ar: ['رسالة', 'رسائل', 'استفسار', 'استفسارات', 'اتصال', 'تواصل', 'مراسلة'],
    en: ['message', 'messages', 'inquiry', 'inquiries', 'contact', 'communication']
  },

  // إيرادات / أموال
  revenue: {
    ar: ['إيراد', 'ايراد', 'إيرادات', 'ايرادات', 'مبلغ', 'مبالغ', 'دخل', 'مال', 'أموال', 'فلوس', 'ربح'],
    en: ['revenue', 'income', 'earnings', 'money', 'profit', 'amount']
  },

  // تقرير
  report: {
    ar: ['تقرير', 'تقارير', 'ملخص', 'تفصيل', 'تفاصيل', 'بيانات', 'معلومات شاملة'],
    en: ['report', 'reports', 'summary', 'details', 'comprehensive']
  },

  // نظرة عامة
  overview: {
    ar: ['نظرة عامة', 'لوحة', 'لوحة التحكم', 'dashboard', 'داشبورد', 'عام', 'شامل', 'كل شيء'],
    en: ['overview', 'dashboard', 'general', 'overall', 'everything', 'all']
  },

  // أكواد خصم
  promo: {
    ar: ['كوبون', 'كوبونات', 'خصم', 'خصومات', 'كود', 'أكواد', 'برومو', 'عرض'],
    en: ['coupon', 'coupons', 'promo', 'discount', 'code', 'codes', 'offer']
  },

  // حالة
  status: {
    pending: ['معلق', 'منتظر', 'انتظار', 'pending'],
    processing: ['معالجة', 'قيد المعالجة', 'processing'],
    shipped: ['مشحون', 'تم الشحن', 'shipped'],
    delivered: ['مسلم', 'تم التسليم', 'delivered'],
    cancelled: ['ملغي', 'ملغى', 'cancelled', 'canceled'],
    unread: ['غير مقروء', 'غير مقروءة', 'unread'],
    read: ['مقروء', 'مقروءة', 'read'],
    urgent: ['عاجل', 'عاجلة', 'urgent']
  },

  // فئات
  category: {
    guide: ['دليل', 'أدلة', 'guide', 'guides'],
    physical: ['مادي', 'مادية', 'فيزيائي', 'physical'],
    consultation: ['استشارة', 'استشارات', 'consultation']
  },

  // وقت
  time: {
    today: ['اليوم', 'today'],
    week: ['أسبوع', 'اسبوع', 'week'],
    month: ['شهر', 'month'],
    year: ['سنة', 'عام', 'year']
  },

  // تصدير
  export: {
    ar: ['تصدير', 'تنزيل', 'حفظ', 'export', 'download', 'save'],
    en: ['export', 'download', 'save', 'extract']
  },

  // تحليلات
  analytics: {
    ar: ['تحليل', 'تحليلات', 'اتجاه', 'نمط', 'أنماط', 'analytics', 'analysis', 'trend', 'pattern'],
    en: ['analytics', 'analysis', 'trend', 'trends', 'pattern', 'patterns']
  },

  // عمليات جماعية
  bulk: {
    ar: ['جميع', 'كل', 'الكل', 'all', 'bulk', 'batch'],
    en: ['all', 'bulk', 'batch', 'mass', 'every']
  },

  // منخفض / قليل
  low: {
    ar: ['منخفض', 'قليل', 'ناقص', 'low', 'few'],
    en: ['low', 'few', 'scarce', 'limited']
  },

  // غير مستخدم
  unused: {
    ar: ['غير مستخدم', 'غير مستخدمة', 'unused', 'not used'],
    en: ['unused', 'not used', 'never used']
  },

  // منتهي
  expired: {
    ar: ['منتهي', 'منتهية', 'expired', 'finished'],
    en: ['expired', 'finished', 'depleted', 'exhausted']
  },

  // الأفضل / الأكثر
  best: {
    ar: ['أفضل', 'الأفضل', 'الأكثر', 'best', 'top', 'most'],
    en: ['best', 'top', 'most', 'highest']
  },

  // مبيعات
  sales: {
    ar: ['مبيعات', 'مبيعة', 'بيع', 'sales', 'selling'],
    en: ['sales', 'selling', 'sold']
  }
};

/**
 * فحص وجود كلمة مفتاحية في النص
 */
const hasKeyword = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

/**
 * استخراج الفلاتر من النص
 */
const extractFilters = (text: string): ParsedQuery['filters'] => {
  const filters: ParsedQuery['filters'] = {};

  // استخراج الحالة
  for (const [status, keywords] of Object.entries(KEYWORDS.status)) {
    if (hasKeyword(text, keywords)) {
      if (status === 'pending' || status === 'processing' || status === 'shipped' || status === 'delivered' || status === 'cancelled') {
        filters.status = status;
      } else if (status === 'urgent') {
        filters.priority = status;
      }
      break;
    }
  }

  // استخراج الفئة
  for (const [category, keywords] of Object.entries(KEYWORDS.category)) {
    if (hasKeyword(text, keywords)) {
      filters.category = category;
      break;
    }
  }

  // استخراج الفترة الزمنية
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (hasKeyword(text, KEYWORDS.time.today)) {
    filters.dateFrom = today;
  } else if (hasKeyword(text, KEYWORDS.time.week)) {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    filters.dateFrom = weekAgo;
  } else if (hasKeyword(text, KEYWORDS.time.month)) {
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    filters.dateFrom = monthAgo;
  } else if (hasKeyword(text, KEYWORDS.time.year)) {
    const yearAgo = new Date(today);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    filters.dateFrom = yearAgo;
  }

  // استخراج السعر (أمثلة: "أقل من 10", "أكثر من 5", "between 5 and 10")
  const minPriceMatch = text.match(/(?:أكثر من|more than|greater than|>)\s*(\d+(?:\.\d+)?)/i);
  if (minPriceMatch) {
    filters.minPrice = parseFloat(minPriceMatch[1]);
  }

  const maxPriceMatch = text.match(/(?:أقل من|less than|lower than|<)\s*(\d+(?:\.\d+)?)/i);
  if (maxPriceMatch) {
    filters.maxPrice = parseFloat(maxPriceMatch[1]);
  }

  return Object.keys(filters).length > 0 ? filters : undefined;
};

/**
 * تحديد نوع الاستعلام
 */
const determineQueryType = (text: string): { type: QueryType; confidence: number } => {
  const lowerText = text.toLowerCase();

  // تصدير (أعلى أولوية)
  if (hasKeyword(text, KEYWORDS.export.ar.concat(KEYWORDS.export.en))) {
    if (hasKeyword(text, KEYWORDS.products.ar.concat(KEYWORDS.products.en))) {
      return { type: 'export_products', confidence: 95 };
    }
    if (hasKeyword(text, KEYWORDS.orders.ar.concat(KEYWORDS.orders.en))) {
      return { type: 'export_orders', confidence: 95 };
    }
    if (hasKeyword(text, KEYWORDS.messages.ar.concat(KEYWORDS.messages.en))) {
      return { type: 'export_messages', confidence: 95 };
    }
    if (hasKeyword(text, KEYWORDS.promo.ar.concat(KEYWORDS.promo.en))) {
      return { type: 'export_discounts', confidence: 95 };
    }
    if (hasKeyword(text, KEYWORDS.bulk.ar.concat(KEYWORDS.bulk.en)) || hasKeyword(text, ['شامل', 'كامل', 'full', 'complete'])) {
      return { type: 'export_full', confidence: 95 };
    }
  }

  // عمليات جماعية
  if (hasKeyword(text, KEYWORDS.bulk.ar.concat(KEYWORDS.bulk.en))) {
    if (hasKeyword(text, KEYWORDS.messages.ar.concat(KEYWORDS.messages.en)) && hasKeyword(text, ['مقروء', 'read', 'mark'])) {
      return { type: 'bulk_mark_read', confidence: 95 };
    }
    if (hasKeyword(text, KEYWORDS.promo.ar.concat(KEYWORDS.promo.en)) && hasKeyword(text, KEYWORDS.expired.ar.concat(KEYWORDS.expired.en))) {
      return { type: 'bulk_deactivate_expired', confidence: 95 };
    }
  }

  // تحليلات متقدمة
  if (hasKeyword(text, KEYWORDS.analytics.ar.concat(KEYWORDS.analytics.en))) {
    if (hasKeyword(text, KEYWORDS.revenue.ar.concat(KEYWORDS.revenue.en))) {
      return { type: 'analytics_revenue_trend', confidence: 90 };
    }
    if (hasKeyword(text, KEYWORDS.best.ar.concat(KEYWORDS.best.en)) && hasKeyword(text, KEYWORDS.sales.ar.concat(KEYWORDS.sales.en))) {
      return { type: 'analytics_best_sellers', confidence: 90 };
    }
    if (hasKeyword(text, KEYWORDS.orders.ar.concat(KEYWORDS.orders.en))) {
      return { type: 'analytics_order_patterns', confidence: 90 };
    }
  }

  // الأكثر مبيعاً
  if (hasKeyword(text, KEYWORDS.best.ar.concat(KEYWORDS.best.en)) && hasKeyword(text, KEYWORDS.sales.ar.concat(KEYWORDS.sales.en))) {
    return { type: 'analytics_best_sellers', confidence: 90 };
  }

  // إضافة منتج (أعلى أولوية)
  if (
    (hasKeyword(text, ['أضف', 'اضف', 'add', 'create', 'new']) && hasKeyword(text, KEYWORDS.products.ar.concat(KEYWORDS.products.en))) ||
    (hasKeyword(text, ['منتج:', 'product:']) || hasKeyword(text, ['اسم:', 'name:']))
  ) {
    return { type: 'product_add', confidence: 95 };
  }

  // إنشاء/تحديث/حذف كود خصم (أولوية عالية)
  if (hasKeyword(text, KEYWORDS.promo.ar.concat(KEYWORDS.promo.en))) {
    if (hasKeyword(text, ['أضف', 'اضف', 'add', 'create', 'new', 'إنشاء', 'انشاء'])) {
      return { type: 'discount_create', confidence: 95 };
    }
    if (hasKeyword(text, ['حذف', 'delete', 'remove', 'إزالة', 'ازالة'])) {
      return { type: 'discount_delete', confidence: 95 };
    }
    if (hasKeyword(text, ['تحديث', 'update', 'edit', 'تعديل', 'modify'])) {
      return { type: 'discount_update', confidence: 95 };
    }
  }

  // تقارير شاملة
  if (hasKeyword(text, KEYWORDS.report.ar.concat(KEYWORDS.report.en))) {
    if (hasKeyword(text, KEYWORDS.products.ar.concat(KEYWORDS.products.en))) {
      return { type: 'report_products', confidence: 90 };
    }
    if (hasKeyword(text, KEYWORDS.orders.ar.concat(KEYWORDS.orders.en))) {
      return { type: 'report_orders', confidence: 90 };
    }
    if (hasKeyword(text, KEYWORDS.messages.ar.concat(KEYWORDS.messages.en))) {
      return { type: 'report_messages', confidence: 90 };
    }
    if (hasKeyword(text, KEYWORDS.promo.ar.concat(KEYWORDS.promo.en))) {
      return { type: 'report_discounts', confidence: 90 };
    }
    return { type: 'report_full', confidence: 85 };
  }

  // نظرة عامة
  if (hasKeyword(text, KEYWORDS.overview.ar.concat(KEYWORDS.overview.en))) {
    return { type: 'overview', confidence: 90 };
  }

  // إحصائيات وعدد
  const isCount = hasKeyword(text, KEYWORDS.count.ar.concat(KEYWORDS.count.en));
  const isStats = hasKeyword(text, ['احصائيات', 'إحصائيات', 'احصاء', 'statistics', 'stats', 'analytics']);

  // أكواد الخصم
  if (hasKeyword(text, KEYWORDS.promo.ar.concat(KEYWORDS.promo.en))) {
    // أكواد غير مستخدمة
    if (hasKeyword(text, KEYWORDS.unused.ar.concat(KEYWORDS.unused.en))) {
      return { type: 'discount_unused', confidence: 90 };
    }
    // أكواد منتهية
    if (hasKeyword(text, KEYWORDS.expired.ar.concat(KEYWORDS.expired.en))) {
      return { type: 'discount_expired', confidence: 90 };
    }
    if (isCount) {
      return { type: 'discount_count', confidence: 90 };
    }
    if (isStats) {
      return { type: 'discount_stats', confidence: 90 };
    }
    return { type: 'discount_search', confidence: 75 };
  }

  // المنتجات
  if (hasKeyword(text, KEYWORDS.products.ar.concat(KEYWORDS.products.en))) {
    // منتجات منخفضة المخزون
    if (hasKeyword(text, KEYWORDS.low.ar.concat(KEYWORDS.low.en)) && hasKeyword(text, ['مخزون', 'stock', 'inventory'])) {
      return { type: 'product_low_stock', confidence: 90 };
    }
    if (isCount) {
      return { type: 'product_count', confidence: 90 };
    }
    if (isStats) {
      return { type: 'product_stats', confidence: 90 };
    }
    return { type: 'product_search', confidence: 75 };
  }

  // الطلبات
  if (hasKeyword(text, KEYWORDS.orders.ar.concat(KEYWORDS.orders.en))) {
    // طلبات في فترة زمنية
    if (hasKeyword(text, KEYWORDS.time.today) || hasKeyword(text, KEYWORDS.time.week) ||
        hasKeyword(text, KEYWORDS.time.month) || hasKeyword(text, KEYWORDS.time.year) ||
        hasKeyword(text, ['من', 'إلى', 'from', 'to', 'between', 'خلال', 'during'])) {
      return { type: 'order_date_range', confidence: 90 };
    }
    if (hasKeyword(text, KEYWORDS.revenue.ar.concat(KEYWORDS.revenue.en))) {
      return { type: 'order_revenue', confidence: 90 };
    }
    if (isCount) {
      return { type: 'order_count', confidence: 90 };
    }
    if (isStats) {
      return { type: 'order_stats', confidence: 90 };
    }
    return { type: 'order_search', confidence: 75 };
  }

  // الرسائل
  if (hasKeyword(text, KEYWORDS.messages.ar.concat(KEYWORDS.messages.en))) {
    // رسائل عاجلة فقط
    if (hasKeyword(text, KEYWORDS.status.urgent)) {
      return { type: 'message_urgent', confidence: 90 };
    }
    if (isCount) {
      return { type: 'message_count', confidence: 90 };
    }
    if (isStats) {
      return { type: 'message_stats', confidence: 90 };
    }
    return { type: 'message_search', confidence: 75 };
  }

  // الإيرادات (عام)
  if (hasKeyword(text, KEYWORDS.revenue.ar.concat(KEYWORDS.revenue.en))) {
    return { type: 'order_revenue', confidence: 80 };
  }

  // غير معروف
  return { type: 'unknown', confidence: 0 };
};

/**
 * تحليل الاستعلام الكامل
 */
export const parseQuery = (query: string): ParsedQuery => {
  if (!query || query.trim().length === 0) {
    return {
      type: 'unknown',
      confidence: 0
    };
  }

  const { type, confidence } = determineQueryType(query);
  const filters = extractFilters(query);

  // استخراج مصطلح البحث (إذا كان الاستعلام يحتوي على كلمات غير مفتاحية)
  const searchTerm = extractSearchTerm(query, type);

  // استخراج بيانات كود الخصم (للإنشاء/التحديث)
  const discountData = extractDiscountData(query, type);

  return {
    type,
    filters,
    searchTerm,
    discountData,
    confidence
  };
};

/**
 * استخراج بيانات كود الخصم من الاستعلام
 */
const extractDiscountData = (query: string, type: QueryType): ParsedQuery['discountData'] => {
  if (type !== 'discount_create' && type !== 'discount_update') {
    return undefined;
  }

  const text = query.toLowerCase();

  // استخراج اسم الكود
  const codeMatch = query.match(/(?:code|كود|coupon|كوبون)\s+([A-Za-z0-9]+)/i);
  const code = codeMatch ? codeMatch[1] : undefined;

  if (!code) {
    return undefined;
  }

  // استخراج النوع والقيمة
  let discountType: 'percentage' | 'fixed' = 'percentage';
  let value: number | undefined;

  // نسبة مئوية
  const percentageMatch = query.match(/(\d+(?:\.\d+)?)\s*%|(\d+(?:\.\d+)?)\s*(?:percent|نسبة)/i);
  if (percentageMatch) {
    value = parseFloat(percentageMatch[1] || percentageMatch[2]);
    discountType = 'percentage';
  }

  // قيمة ثابتة
  const fixedMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:kwd|د\.ك|دينار|dinars?)/i);
  if (fixedMatch) {
    value = parseFloat(fixedMatch[1]);
    discountType = 'fixed';
  }

  // استخراج حد الاستخدام
  const usageLimitMatch = query.match(/(?:usage|limit|استخدام|حد)\s*(?:limit)?\s*(\d+)/i);
  const usageLimit = usageLimitMatch ? parseInt(usageLimitMatch[1]) : 100;

  // استخراج مستخدم واحد فقط
  const oneUserOnly = /(?:one user|مستخدم واحد|single user)/i.test(text);

  if (!value) {
    return undefined;
  }

  return {
    code,
    type: discountType,
    value,
    usageLimit,
    oneUserOnly
  };
};

/**
 * استخراج مصطلح البحث من الاستعلام
 */
const extractSearchTerm = (query: string, type: QueryType): string | undefined => {
  // إذا كان البحث، نزيل الكلمات المفتاحية ونحتفظ بالبقية
  if (type === 'product_search' || type === 'order_search' || type === 'message_search' || type === 'discount_search') {
    let cleaned = query;

    // إزالة جميع الكلمات المفتاحية
    const allKeywords = [
      ...KEYWORDS.products.ar, ...KEYWORDS.products.en,
      ...KEYWORDS.orders.ar, ...KEYWORDS.orders.en,
      ...KEYWORDS.messages.ar, ...KEYWORDS.messages.en,
      ...KEYWORDS.promo.ar, ...KEYWORDS.promo.en,
      ...KEYWORDS.count.ar, ...KEYWORDS.count.en,
      'عن', 'عن طريق', 'about', 'for', 'with', 'ابحث', 'بحث', 'search', 'find', 'coupon', 'code'
    ];

    allKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      cleaned = cleaned.replace(regex, '');
    });

    cleaned = cleaned.trim();
    return cleaned.length > 0 ? cleaned : undefined;
  }

  // For delete and update operations, extract the code name
  if (type === 'discount_delete' || type === 'discount_update') {
    const codeMatch = query.match(/(?:code|كود|coupon|كوبون)\s+([A-Za-z0-9]+)/i);
    return codeMatch ? codeMatch[1] : undefined;
  }

  return undefined;
};

/**
 * الحصول على وصف نوع الاستعلام
 */
export const getQueryTypeDescription = (type: QueryType, isRTL: boolean): string => {
  const descriptions: Record<QueryType, { ar: string; en: string }> = {
    product_add: { ar: 'إضافة منتج جديد', en: 'Add new product' },
    product_count: { ar: 'عدد المنتجات', en: 'Product count' },
    product_search: { ar: 'البحث عن منتج', en: 'Search products' },
    product_stats: { ar: 'إحصائيات المنتجات', en: 'Product statistics' },
    product_low_stock: { ar: 'منتجات منخفضة المخزون', en: 'Low stock products' },
    order_count: { ar: 'عدد الطلبات', en: 'Order count' },
    order_search: { ar: 'البحث عن طلب', en: 'Search orders' },
    order_stats: { ar: 'إحصائيات الطلبات', en: 'Order statistics' },
    order_revenue: { ar: 'الإيرادات', en: 'Revenue' },
    order_date_range: { ar: 'طلبات في فترة زمنية', en: 'Orders in date range' },
    message_count: { ar: 'عدد الرسائل', en: 'Message count' },
    message_search: { ar: 'البحث عن رسالة', en: 'Search messages' },
    message_stats: { ar: 'إحصائيات الرسائل', en: 'Message statistics' },
    message_urgent: { ar: 'رسائل عاجلة', en: 'Urgent messages' },
    discount_count: { ar: 'عدد أكواد الخصم', en: 'Discount code count' },
    discount_search: { ar: 'البحث عن كود خصم', en: 'Search discount codes' },
    discount_stats: { ar: 'إحصائيات أكواد الخصم', en: 'Discount code statistics' },
    discount_create: { ar: 'إنشاء كود خصم', en: 'Create discount code' },
    discount_update: { ar: 'تحديث كود خصم', en: 'Update discount code' },
    discount_delete: { ar: 'حذف كود خصم', en: 'Delete discount code' },
    discount_unused: { ar: 'أكواد خصم غير مستخدمة', en: 'Unused discount codes' },
    discount_expired: { ar: 'أكواد خصم منتهية', en: 'Expired discount codes' },
    promo_stats: { ar: 'إحصائيات أكواد الخصم', en: 'Promo code statistics' },
    analytics_revenue_trend: { ar: 'اتجاه الإيرادات', en: 'Revenue trend' },
    analytics_best_sellers: { ar: 'الأكثر مبيعاً', en: 'Best sellers' },
    analytics_order_patterns: { ar: 'أنماط الطلبات', en: 'Order patterns' },
    export_products: { ar: 'تصدير المنتجات', en: 'Export products' },
    export_orders: { ar: 'تصدير الطلبات', en: 'Export orders' },
    export_messages: { ar: 'تصدير الرسائل', en: 'Export messages' },
    export_discounts: { ar: 'تصدير أكواد الخصم', en: 'Export discount codes' },
    export_full: { ar: 'تصدير شامل', en: 'Full export' },
    bulk_mark_read: { ar: 'تحديد الكل كمقروء', en: 'Mark all as read' },
    bulk_deactivate_expired: { ar: 'تعطيل الأكواد المنتهية', en: 'Deactivate expired codes' },
    overview: { ar: 'نظرة عامة', en: 'Overview' },
    report_products: { ar: 'تقرير المنتجات', en: 'Products report' },
    report_orders: { ar: 'تقرير الطلبات', en: 'Orders report' },
    report_messages: { ar: 'تقرير الرسائل', en: 'Messages report' },
    report_discounts: { ar: 'تقرير أكواد الخصم', en: 'Discount codes report' },
    report_full: { ar: 'تقرير شامل', en: 'Full report' },
    unknown: { ar: 'غير معروف', en: 'Unknown' }
  };

  return isRTL ? descriptions[type].ar : descriptions[type].en;
};

/**
 * اقتراح أسئلة ذات صلة
 */
export const getSuggestedQueries = (type: QueryType, isRTL: boolean): string[] => {
  const suggestions: Record<QueryType, { ar: string[]; en: string[] }> = {
    product_count: {
      ar: ['كم عدد المنتجات الجديدة؟', 'كم منتج مادي لدينا؟', 'ما هي المنتجات نفدت من المخزون؟'],
      en: ['How many new products?', 'How many physical products?', 'Which products are out of stock?']
    },
    order_count: {
      ar: ['كم طلب معلق؟', 'كم طلب تم توصيله هذا الشهر؟', 'ما هي الإيرادات الإجمالية؟'],
      en: ['How many pending orders?', 'How many orders delivered this month?', 'What is the total revenue?']
    },
    message_count: {
      ar: ['كم رسالة غير مقروءة؟', 'كم رسالة عاجلة؟', 'ما هي الرسائل الواردة اليوم؟'],
      en: ['How many unread messages?', 'How many urgent messages?', 'What messages came today?']
    },
    overview: {
      ar: ['تقرير المبيعات', 'إحصائيات المنتجات', 'حالة الطلبات'],
      en: ['Sales report', 'Product statistics', 'Order status']
    },
    unknown: {
      ar: ['كم عدد المنتجات؟', 'ما هي الإيرادات؟', 'أعطني نظرة عامة', 'كم طلب معلق؟'],
      en: ['How many products?', 'What is the revenue?', 'Give me an overview', 'How many pending orders?']
    },
    // Default suggestions for other types
    product_add: { ar: [], en: [] },
    product_search: { ar: [], en: [] },
    product_stats: { ar: [], en: [] },
    product_low_stock: { ar: [], en: [] },
    order_search: { ar: [], en: [] },
    order_stats: { ar: [], en: [] },
    order_revenue: { ar: [], en: [] },
    order_date_range: { ar: [], en: [] },
    message_search: { ar: [], en: [] },
    message_stats: { ar: [], en: [] },
    message_urgent: { ar: [], en: [] },
    discount_count: { ar: [], en: [] },
    discount_search: { ar: [], en: [] },
    discount_stats: { ar: [], en: [] },
    discount_create: { ar: [], en: [] },
    discount_update: { ar: [], en: [] },
    discount_delete: { ar: [], en: [] },
    discount_unused: { ar: [], en: [] },
    discount_expired: { ar: [], en: [] },
    promo_stats: { ar: [], en: [] },
    analytics_revenue_trend: { ar: [], en: [] },
    analytics_best_sellers: { ar: [], en: [] },
    analytics_order_patterns: { ar: [], en: [] },
    export_products: { ar: [], en: [] },
    export_orders: { ar: [], en: [] },
    export_messages: { ar: [], en: [] },
    export_discounts: { ar: [], en: [] },
    export_full: { ar: [], en: [] },
    bulk_mark_read: { ar: [], en: [] },
    bulk_deactivate_expired: { ar: [], en: [] },
    report_products: { ar: [], en: [] },
    report_orders: { ar: [], en: [] },
    report_messages: { ar: [], en: [] },
    report_discounts: { ar: [], en: [] },
    report_full: { ar: [], en: [] }
  };

  const typeSuggestions = suggestions[type] || suggestions.unknown;
  return isRTL ? typeSuggestions.ar : typeSuggestions.en;
};
