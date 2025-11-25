import { Product } from '@/contexts/ProductsContext';
import { Order } from '@/contexts/OrdersContext';
import { Message } from '@/contexts/MessagesContext';
import { DiscountCode } from '@/contexts/DiscountCodesContext';

export interface DatabaseStats {
  products: ProductsStats;
  orders: OrdersStats;
  messages: MessagesStats;
  discountCodes: DiscountCodesStats;
  overview: OverviewStats;
}

export interface ProductsStats {
  total: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  digital: number;
  physical: number;
  newProducts: number;
  limitedProducts: number;
  outOfStock: number;
  totalValue: number;
  averagePrice: number;
}

export interface OrdersStats {
  total: number;
  byStatus: Record<string, number>;
  byPaymentMethod: Record<string, number>;
  byPaymentStatus: Record<string, number>;
  totalRevenue: number;
  averageOrderValue: number;
  digitalOrders: number;
  physicalOrders: number;
  totalItemsSold: number;
  topSellingProducts: { id: string; title: string; count: number }[];
  promoCodes: { code: string; usage: number; totalDiscount: number }[];
}

export interface MessagesStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  unread: number;
  urgent: number;
  responseRate: number;
  averageResponseTime: string;
}

export interface DiscountCodesStats {
  total: number;
  active: number;
  inactive: number;
  byType: Record<string, number>;
  totalUsage: number;
  totalDiscountValue: number;
  mostUsed: { code: string; usedCount: number; value: number; type: string }[];
  expired: number;
  available: number;
}

export interface OverviewStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalMessages: number;
  totalDiscountCodes: number;
  activeDiscountCodes: number;
  pendingOrders: number;
  unreadMessages: number;
  urgentMessages: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  messagesThisMonth: number;
}

/**
 * تحليل بيانات المنتجات
 */
export const analyzeProducts = (products: Product[]): ProductsStats => {
  const byCategory: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  let digital = 0;
  let physical = 0;
  let newProducts = 0;
  let limitedProducts = 0;
  let outOfStock = 0;
  let totalValue = 0;

  products.forEach(product => {
    // حسب الفئة
    byCategory[product.category] = (byCategory[product.category] || 0) + 1;

    // حسب الحالة
    byStatus[product.status] = (byStatus[product.status] || 0) + 1;

    // رقمي أم مادي
    if (product.isDigital) {
      digital++;
    } else {
      physical++;
    }

    // المنتجات الجديدة
    if (product.isNew) {
      newProducts++;
    }

    // المنتجات المحدودة
    if (product.isLimited) {
      limitedProducts++;
    }

    // نفد من المخزون
    if (product.stock !== undefined && product.stock <= 0) {
      outOfStock++;
    }

    // القيمة الإجمالية
    const price = typeof product.price === 'number' ? product.price : product.price.KWD || 0;
    totalValue += price * (product.stock || 0);
  });

  const averagePrice = products.length > 0
    ? products.reduce((sum, p) => sum + (typeof p.price === 'number' ? p.price : p.price.KWD || 0), 0) / products.length
    : 0;

  return {
    total: products.length,
    byCategory,
    byStatus,
    digital,
    physical,
    newProducts,
    limitedProducts,
    outOfStock,
    totalValue,
    averagePrice,
  };
};

/**
 * تحليل بيانات الطلبات
 */
export const analyzeOrders = (orders: Order[]): OrdersStats => {
  const byStatus: Record<string, number> = {};
  const byPaymentMethod: Record<string, number> = {};
  const byPaymentStatus: Record<string, number> = {};
  let totalRevenue = 0;
  let digitalOrders = 0;
  let physicalOrders = 0;
  let totalItemsSold = 0;

  const productSales: Record<string, { title: string; count: number }> = {};
  const promoCodesMap: Record<string, { usage: number; totalDiscount: number }> = {};

  orders.forEach(order => {
    // حسب الحالة
    byStatus[order.status] = (byStatus[order.status] || 0) + 1;

    // حسب طريقة الدفع
    byPaymentMethod[order.paymentMethod] = (byPaymentMethod[order.paymentMethod] || 0) + 1;

    // حسب حالة الدفع
    byPaymentStatus[order.paymentStatus] = (byPaymentStatus[order.paymentStatus] || 0) + 1;

    // الإيرادات (فقط الطلبات المدفوعة)
    if (order.paymentStatus === 'paid') {
      totalRevenue += order.total;
    }

    // رقمي أم مادي
    if (order.isDigitalOnly) {
      digitalOrders++;
    } else {
      physicalOrders++;
    }

    // عدد المنتجات المباعة
    order.items.forEach(item => {
      totalItemsSold += item.quantity;

      // أكثر المنتجات مبيعاً
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          title: item.title,
          count: 0,
        };
      }
      productSales[item.productId].count += item.quantity;
    });

    // أكواد الخصم
    if (order.promoCode) {
      if (!promoCodesMap[order.promoCode]) {
        promoCodesMap[order.promoCode] = {
          usage: 0,
          totalDiscount: 0,
        };
      }
      promoCodesMap[order.promoCode].usage++;
      promoCodesMap[order.promoCode].totalDiscount += order.discount || 0;
    }
  });

  // ترتيب المنتجات الأكثر مبيعاً
  const topSellingProducts = Object.entries(productSales)
    .map(([id, data]) => ({ id, title: data.title, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // تحويل أكواد الخصم إلى مصفوفة
  const promoCodes = Object.entries(promoCodesMap)
    .map(([code, data]) => ({ code, usage: data.usage, totalDiscount: data.totalDiscount }))
    .sort((a, b) => b.usage - a.usage);

  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return {
    total: orders.length,
    byStatus,
    byPaymentMethod,
    byPaymentStatus,
    totalRevenue,
    averageOrderValue,
    digitalOrders,
    physicalOrders,
    totalItemsSold,
    topSellingProducts,
    promoCodes,
  };
};

/**
 * تحليل بيانات الرسائل
 */
export const analyzeMessages = (messages: Message[]): MessagesStats => {
  const byStatus: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  let unread = 0;
  let urgent = 0;
  let totalResponseTime = 0;
  let responsesCount = 0;

  messages.forEach(message => {
    // حسب الحالة
    byStatus[message.status] = (byStatus[message.status] || 0) + 1;

    // حسب الفئة
    byCategory[message.category] = (byCategory[message.category] || 0) + 1;

    // حسب الأولوية
    byPriority[message.priority] = (byPriority[message.priority] || 0) + 1;

    // غير مقروءة
    if (!message.isRead) {
      unread++;
    }

    // عاجلة
    if (message.priority === 'urgent') {
      urgent++;
    }

    // وقت الاستجابة
    if (message.repliedAt && message.createdAt) {
      const responseTime = new Date(message.repliedAt).getTime() - new Date(message.createdAt).getTime();
      totalResponseTime += responseTime;
      responsesCount++;
    }
  });

  const responseRate = messages.length > 0
    ? (messages.filter(m => m.status === 'replied' || m.status === 'resolved').length / messages.length) * 100
    : 0;

  const averageResponseTimeMs = responsesCount > 0 ? totalResponseTime / responsesCount : 0;
  const averageResponseTime = formatDuration(averageResponseTimeMs);

  return {
    total: messages.length,
    byStatus,
    byCategory,
    byPriority,
    unread,
    urgent,
    responseRate,
    averageResponseTime,
  };
};

/**
 * تحليل بيانات أكواد الخصم
 */
export const analyzeDiscountCodes = (discountCodes: DiscountCode[]): DiscountCodesStats => {
  const byType: Record<string, number> = {};
  let active = 0;
  let inactive = 0;
  let totalUsage = 0;
  let totalDiscountValue = 0;
  let expired = 0;
  let available = 0;

  discountCodes.forEach(code => {
    // حسب النوع
    byType[code.type] = (byType[code.type] || 0) + 1;

    // النشطة وغير النشطة
    if (code.isActive) {
      active++;

      // التحقق من انتهاء الصلاحية
      if (code.usedCount >= code.usageLimit) {
        expired++;
      } else {
        available++;
      }
    } else {
      inactive++;
    }

    // إجمالي الاستخدام
    totalUsage += code.usedCount;

    // إجمالي قيمة الخصم (تقديري)
    if (code.type === 'fixed') {
      totalDiscountValue += code.value * code.usedCount;
    }
  });

  // الأكثر استخداماً
  const mostUsed = discountCodes
    .filter(code => code.usedCount > 0)
    .sort((a, b) => b.usedCount - a.usedCount)
    .slice(0, 5)
    .map(code => ({
      code: code.code,
      usedCount: code.usedCount,
      value: code.value,
      type: code.type
    }));

  return {
    total: discountCodes.length,
    active,
    inactive,
    byType,
    totalUsage,
    totalDiscountValue,
    mostUsed,
    expired,
    available,
  };
};

/**
 * إحصائيات عامة شاملة
 */
export const analyzeOverview = (
  products: Product[],
  orders: Order[],
  messages: Message[],
  discountCodes: DiscountCode[]
): OverviewStats => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  // الطلبات هذا الشهر
  const ordersThisMonth = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear;
  });

  // الإيرادات هذا الشهر
  const revenueThisMonth = ordersThisMonth
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.total, 0);

  // الرسائل هذا الشهر
  const messagesThisMonth = messages.filter(message => {
    const messageDate = new Date(message.createdAt);
    return messageDate.getMonth() === thisMonth && messageDate.getFullYear() === thisYear;
  });

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
    totalMessages: messages.length,
    totalDiscountCodes: discountCodes.length,
    activeDiscountCodes: discountCodes.filter(c => c.isActive).length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    unreadMessages: messages.filter(m => !m.isRead).length,
    urgentMessages: messages.filter(m => m.priority === 'urgent').length,
    revenueThisMonth,
    ordersThisMonth: ordersThisMonth.length,
    messagesThisMonth: messagesThisMonth.length,
  };
};

/**
 * تحليل شامل لجميع البيانات
 */
export const analyzeDatabaseComplete = (
  products: Product[],
  orders: Order[],
  messages: Message[],
  discountCodes: DiscountCode[]
): DatabaseStats => {
  return {
    products: analyzeProducts(products),
    orders: analyzeOrders(orders),
    messages: analyzeMessages(messages),
    discountCodes: analyzeDiscountCodes(discountCodes),
    overview: analyzeOverview(products, orders, messages, discountCodes),
  };
};

/**
 * تنسيق المدة الزمنية
 */
function formatDuration(ms: number): string {
  if (ms === 0) return '0 دقيقة';

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours} ساعة ${minutes > 0 ? `و ${minutes} دقيقة` : ''}`;
  }

  return `${minutes} دقيقة`;
}

/**
 * البحث في المنتجات
 */
export const searchProducts = (
  products: Product[],
  query: string,
  filters?: {
    category?: string;
    status?: string;
    isDigital?: boolean;
    isNew?: boolean;
    isLimited?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }
): Product[] => {
  let filtered = products;

  // الفلترة
  if (filters) {
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    if (filters.isDigital !== undefined) {
      filtered = filtered.filter(p => p.isDigital === filters.isDigital);
    }
    if (filters.isNew !== undefined) {
      filtered = filtered.filter(p => p.isNew === filters.isNew);
    }
    if (filters.isLimited !== undefined) {
      filtered = filtered.filter(p => p.isLimited === filters.isLimited);
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => {
        const price = typeof p.price === 'number' ? p.price : p.price.KWD || 0;
        return price >= filters.minPrice!;
      });
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => {
        const price = typeof p.price === 'number' ? p.price : p.price.KWD || 0;
        return price <= filters.maxPrice!;
      });
    }
  }

  // البحث
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.titleEn.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.descriptionEn.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      p.sku?.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
};

/**
 * البحث في الطلبات
 */
export const searchOrders = (
  orders: Order[],
  query: string,
  filters?: {
    status?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    dateFrom?: Date;
    dateTo?: Date;
    minTotal?: number;
    maxTotal?: number;
  }
): Order[] => {
  let filtered = orders;

  // الفلترة
  if (filters) {
    if (filters.status) {
      filtered = filtered.filter(o => o.status === filters.status);
    }
    if (filters.paymentMethod) {
      filtered = filtered.filter(o => o.paymentMethod === filters.paymentMethod);
    }
    if (filters.paymentStatus) {
      filtered = filtered.filter(o => o.paymentStatus === filters.paymentStatus);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(o => new Date(o.createdAt) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(o => new Date(o.createdAt) <= filters.dateTo!);
    }
    if (filters.minTotal !== undefined) {
      filtered = filtered.filter(o => o.total >= filters.minTotal!);
    }
    if (filters.maxTotal !== undefined) {
      filtered = filtered.filter(o => o.total <= filters.maxTotal!);
    }
  }

  // البحث
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(o =>
      o.orderNumber.toLowerCase().includes(searchTerm) ||
      o.customer.firstName.toLowerCase().includes(searchTerm) ||
      o.customer.lastName.toLowerCase().includes(searchTerm) ||
      o.customer.email.toLowerCase().includes(searchTerm) ||
      o.customer.phone?.includes(searchTerm) ||
      o.items.some(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.titleEn.toLowerCase().includes(searchTerm)
      )
    );
  }

  return filtered;
};

/**
 * البحث في الرسائل
 */
export const searchMessages = (
  messages: Message[],
  query: string,
  filters?: {
    status?: string;
    category?: string;
    priority?: string;
    dateFrom?: Date;
    dateTo?: Date;
    isRead?: boolean;
  }
): Message[] => {
  let filtered = messages;

  // الفلترة
  if (filters) {
    if (filters.status) {
      filtered = filtered.filter(m => m.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter(m => m.category === filters.category);
    }
    if (filters.priority) {
      filtered = filtered.filter(m => m.priority === filters.priority);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(m => new Date(m.createdAt) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(m => new Date(m.createdAt) <= filters.dateTo!);
    }
    if (filters.isRead !== undefined) {
      filtered = filtered.filter(m => m.isRead === filters.isRead);
    }
  }

  // البحث
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(m =>
      m.messageNumber.toLowerCase().includes(searchTerm) ||
      m.name.toLowerCase().includes(searchTerm) ||
      m.email.toLowerCase().includes(searchTerm) ||
      m.subject.toLowerCase().includes(searchTerm) ||
      m.message.toLowerCase().includes(searchTerm) ||
      m.phone?.includes(searchTerm)
    );
  }

  return filtered;
};

/**
 * البحث في أكواد الخصم
 */
export const searchDiscountCodes = (
  discountCodes: DiscountCode[],
  query: string,
  filters?: {
    type?: string;
    isActive?: boolean;
    oneUserOnly?: boolean;
  }
): DiscountCode[] => {
  let filtered = discountCodes;

  // الفلترة
  if (filters) {
    if (filters.type) {
      filtered = filtered.filter(c => c.type === filters.type);
    }
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(c => c.isActive === filters.isActive);
    }
    if (filters.oneUserOnly !== undefined) {
      filtered = filtered.filter(c => c.oneUserOnly === filters.oneUserOnly);
    }
  }

  // البحث
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(c =>
      c.code.toLowerCase().includes(searchTerm) ||
      c.id.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
};
