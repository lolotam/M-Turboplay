import { DatabaseStats, ProductsStats, OrdersStats, MessagesStats, DiscountCodesStats, OverviewStats } from './aiDataAnalyzer';
import { ParsedQuery, QueryType } from './aiQueryParser';
import { Product } from '@/contexts/ProductsContext';
import { Order } from '@/contexts/OrdersContext';
import { Message } from '@/contexts/MessagesContext';
import { DiscountCode } from '@/contexts/DiscountCodesContext';
import { exportProducts, exportOrders, exportMessages, exportDiscountCodes, exportFullReport } from './csvExporter';

export interface AIResponse {
  content: string;
  type: 'text' | 'stats' | 'table' | 'chart';
  data?: any; // بيانات إضافية للعرض (جداول، رسوم بيانية، إلخ)
  actions?: ResponseAction[]; // إجراءات مقترحة
}

export interface ResponseAction {
  label: string;
  type: 'navigate' | 'filter' | 'export' | 'create' | 'update' | 'delete' | 'confirm';
  target?: string;
  data?: any;
}

/**
 * توليد الرد حسب نوع الاستعلام
 */
export const generateResponse = (
  query: ParsedQuery,
  stats: DatabaseStats,
  products: Product[],
  orders: Order[],
  messages: Message[],
  discountCodes: DiscountCode[],
  isRTL: boolean
): AIResponse => {
  switch (query.type) {
    case 'product_count':
      return generateProductCountResponse(stats.products, query, isRTL);

    case 'product_stats':
      return generateProductStatsResponse(stats.products, isRTL);

    case 'product_search':
      return generateProductSearchResponse(products, query, isRTL);

    case 'product_low_stock':
      return generateProductLowStockResponse(products, isRTL);

    case 'order_count':
      return generateOrderCountResponse(stats.orders, query, isRTL);

    case 'order_stats':
      return generateOrderStatsResponse(stats.orders, isRTL);

    case 'order_revenue':
      return generateRevenueResponse(stats.orders, query, isRTL);

    case 'order_date_range':
      return generateOrderDateRangeResponse(orders, query, isRTL);

    case 'message_count':
      return generateMessageCountResponse(stats.messages, query, isRTL);

    case 'message_stats':
      return generateMessageStatsResponse(stats.messages, isRTL);

    case 'message_urgent':
      return generateMessageUrgentResponse(messages, isRTL);

    case 'discount_count':
      return generateDiscountCountResponse(stats.discountCodes, query, isRTL);

    case 'discount_stats':
      return generateDiscountStatsResponse(stats.discountCodes, isRTL);

    case 'discount_search':
      return generateDiscountSearchResponse(discountCodes, query, isRTL);

    case 'discount_create':
      return generateDiscountCreateResponse(query, isRTL);

    case 'discount_update':
      return generateDiscountUpdateResponse(query, discountCodes, isRTL);

    case 'discount_delete':
      return generateDiscountDeleteResponse(query, discountCodes, isRTL);

    case 'discount_unused':
      return generateDiscountUnusedResponse(discountCodes, isRTL);

    case 'discount_expired':
      return generateDiscountExpiredResponse(discountCodes, isRTL);

    case 'promo_stats':
      return generatePromoStatsResponse(stats.orders, isRTL);

    case 'analytics_revenue_trend':
      return generateRevenueTrendResponse(orders, isRTL);

    case 'analytics_best_sellers':
      return generateBestSellersResponse(stats.orders, isRTL);

    case 'analytics_order_patterns':
      return generateOrderPatternsResponse(orders, isRTL);

    case 'export_products':
      return generateExportProductsResponse(products, isRTL);

    case 'export_orders':
      return generateExportOrdersResponse(orders, isRTL);

    case 'export_messages':
      return generateExportMessagesResponse(messages, isRTL);

    case 'export_discounts':
      return generateExportDiscountsResponse(discountCodes, isRTL);

    case 'export_full':
      return generateExportFullResponse(products, orders, messages, discountCodes, isRTL);

    case 'bulk_mark_read':
      return generateBulkMarkReadResponse(messages, isRTL);

    case 'bulk_deactivate_expired':
      return generateBulkDeactivateExpiredResponse(discountCodes, isRTL);

    case 'overview':
      return generateOverviewResponse(stats.overview, isRTL);

    case 'report_products':
      return generateProductsReportResponse(stats.products, isRTL);

    case 'report_orders':
      return generateOrdersReportResponse(stats.orders, isRTL);

    case 'report_messages':
      return generateMessagesReportResponse(stats.messages, isRTL);

    case 'report_discounts':
      return generateDiscountsReportResponse(stats.discountCodes, isRTL);

    case 'report_full':
      return generateFullReportResponse(stats, isRTL);

    default:
      return generateUnknownResponse(isRTL);
  }
};

/**
 * رد عدد المنتجات
 */
const generateProductCountResponse = (stats: ProductsStats, query: ParsedQuery, isRTL: boolean): AIResponse => {
  const filters = query.filters;
  let count = stats.total;
  let details = '';

  if (filters?.category) {
    count = stats.byCategory[filters.category] || 0;
    details = isRTL
      ? `في فئة ${getCategoryName(filters.category, isRTL)}`
      : `in ${getCategoryName(filters.category, isRTL)} category`;
  } else if (filters?.isDigital !== undefined) {
    count = filters.isDigital ? stats.digital : stats.physical;
    details = isRTL
      ? (filters.isDigital ? 'رقمية' : 'مادية')
      : (filters.isDigital ? 'digital' : 'physical');
  } else if (filters?.isNew) {
    count = stats.newProducts;
    details = isRTL ? 'جديدة' : 'new';
  }

  const content = isRTL
    ? `📦 لديك **${count}** منتج ${details}\n\n• منتجات رقمية: ${stats.digital}\n• منتجات مادية: ${stats.physical}\n• منتجات جديدة: ${stats.newProducts}\n• منتجات محدودة: ${stats.limitedProducts}`
    : `📦 You have **${count}** ${details} product${count !== 1 ? 's' : ''}\n\n• Digital: ${stats.digital}\n• Physical: ${stats.physical}\n• New: ${stats.newProducts}\n• Limited: ${stats.limitedProducts}`;

  return {
    content,
    type: 'stats',
    data: {
      total: count,
      digital: stats.digital,
      physical: stats.physical,
      new: stats.newProducts,
      limited: stats.limitedProducts
    },
    actions: [
      {
        label: isRTL ? 'عرض جميع المنتجات' : 'View all products',
        type: 'navigate',
        target: '/admin/products'
      }
    ]
  };
};

/**
 * رد إحصائيات المنتجات
 */
const generateProductStatsResponse = (stats: ProductsStats, isRTL: boolean): AIResponse => {
  const content = isRTL
    ? `📊 **إحصائيات المنتجات الشاملة**\n━━━━━━━━━━━━━━━━━━━━━\n\n📦 **العدد الإجمالي**: ${stats.total} منتج\n💰 **القيمة الإجمالية**: ${formatCurrency(stats.totalValue)} د.ك\n💵 **متوسط السعر**: ${formatCurrency(stats.averagePrice)} د.ك\n\n**حسب النوع**:\n• رقمية: ${stats.digital}\n• مادية: ${stats.physical}\n\n**حسب الفئة**:\n${Object.entries(stats.byCategory).map(([cat, count]) => `• ${getCategoryName(cat, isRTL)}: ${count}`).join('\n')}\n\n**حسب الحالة**:\n${Object.entries(stats.byStatus).map(([status, count]) => `• ${getStatusName(status, isRTL)}: ${count}`).join('\n')}\n\n⚠️ **نفذ من المخزون**: ${stats.outOfStock} منتج`
    : `📊 **Complete Product Statistics**\n━━━━━━━━━━━━━━━━━━━━━\n\n📦 **Total Count**: ${stats.total} products\n💰 **Total Value**: ${formatCurrency(stats.totalValue)} KWD\n💵 **Average Price**: ${formatCurrency(stats.averagePrice)} KWD\n\n**By Type**:\n• Digital: ${stats.digital}\n• Physical: ${stats.physical}\n\n**By Category**:\n${Object.entries(stats.byCategory).map(([cat, count]) => `• ${getCategoryName(cat, isRTL)}: ${count}`).join('\n')}\n\n**By Status**:\n${Object.entries(stats.byStatus).map(([status, count]) => `• ${getStatusName(status, isRTL)}: ${count}`).join('\n')}\n\n⚠️ **Out of Stock**: ${stats.outOfStock} products`;

  return {
    content,
    type: 'stats',
    data: stats
  };
};

/**
 * رد البحث عن منتج
 */
const generateProductSearchResponse = (products: Product[], query: ParsedQuery, isRTL: boolean): AIResponse => {
  if (products.length === 0) {
    return {
      content: isRTL ? '❌ لم يتم العثور على منتجات' : '❌ No products found',
      type: 'text'
    };
  }

  const content = isRTL
    ? `✅ تم العثور على **${products.length}** منتج:\n\n${products.slice(0, 10).map((p, i) =>
        `${i + 1}. **${p.title}**\n   ${formatCurrency(typeof p.price === 'number' ? p.price : p.price.KWD || 0)} د.ك • ${getCategoryName(p.category, isRTL)} • ${p.isDigital ? 'رقمي' : 'مادي'}`
      ).join('\n\n')}${products.length > 10 ? `\n\n... و ${products.length - 10} منتج آخر` : ''}`
    : `✅ Found **${products.length}** products:\n\n${products.slice(0, 10).map((p, i) =>
        `${i + 1}. **${p.titleEn}**\n   ${formatCurrency(typeof p.price === 'number' ? p.price : p.price.KWD || 0)} KWD • ${getCategoryName(p.category, isRTL)} • ${p.isDigital ? 'Digital' : 'Physical'}`
      ).join('\n\n')}${products.length > 10 ? `\n\n... and ${products.length - 10} more` : ''}`;

  return {
    content,
    type: 'table',
    data: products
  };
};

/**
 * رد عدد الطلبات
 */
const generateOrderCountResponse = (stats: OrdersStats, query: ParsedQuery, isRTL: boolean): AIResponse => {
  const filters = query.filters;
  let count = stats.total;
  let details = '';

  if (filters?.status) {
    count = stats.byStatus[filters.status] || 0;
    details = isRTL
      ? getStatusName(filters.status, isRTL)
      : getStatusName(filters.status, isRTL);
  }

  const content = isRTL
    ? `📦 لديك **${count}** طلب ${details}\n\n**حسب الحالة**:\n• قيد الانتظار: ${stats.byStatus.pending || 0}\n• قيد المعالجة: ${stats.byStatus.processing || 0}\n• تم الشحن: ${stats.byStatus.shipped || 0}\n• تم التوصيل: ${stats.byStatus.delivered || 0}\n• ملغي: ${stats.byStatus.cancelled || 0}\n\n💰 **إجمالي الإيرادات**: ${formatCurrency(stats.totalRevenue)} د.ك`
    : `📦 You have **${count}** ${details} orders\n\n**By Status**:\n• Pending: ${stats.byStatus.pending || 0}\n• Processing: ${stats.byStatus.processing || 0}\n• Shipped: ${stats.byStatus.shipped || 0}\n• Delivered: ${stats.byStatus.delivered || 0}\n• Cancelled: ${stats.byStatus.cancelled || 0}\n\n💰 **Total Revenue**: ${formatCurrency(stats.totalRevenue)} KWD`;

  return {
    content,
    type: 'stats',
    data: stats,
    actions: [
      {
        label: isRTL ? 'عرض جميع الطلبات' : 'View all orders',
        type: 'navigate',
        target: '/admin/orders'
      }
    ]
  };
};

/**
 * رد إحصائيات الطلبات
 */
const generateOrderStatsResponse = (stats: OrdersStats, isRTL: boolean): AIResponse => {
  const content = isRTL
    ? `📊 **إحصائيات الطلبات الشاملة**\n━━━━━━━━━━━━━━━━━━━━━\n\n📦 **إجمالي الطلبات**: ${stats.total}\n💰 **إجمالي الإيرادات**: ${formatCurrency(stats.totalRevenue)} د.ك\n💵 **متوسط قيمة الطلب**: ${formatCurrency(stats.averageOrderValue)} د.ك\n📦 **عدد المنتجات المباعة**: ${stats.totalItemsSold}\n\n**حسب الحالة**:\n${Object.entries(stats.byStatus).map(([status, count]) => `• ${getStatusName(status, isRTL)}: ${count}`).join('\n')}\n\n**طرق الدفع**:\n${Object.entries(stats.byPaymentMethod).map(([method, count]) => `• ${method.toUpperCase()}: ${count} (${((count / stats.total) * 100).toFixed(1)}%)`).join('\n')}\n\n**أكثر المنتجات مبيعاً**:\n${stats.topSellingProducts.slice(0, 5).map((p, i) => `${i + 1}. ${p.title} (${p.count} وحدة)`).join('\n')}`
    : `📊 **Complete Order Statistics**\n━━━━━━━━━━━━━━━━━━━━━\n\n📦 **Total Orders**: ${stats.total}\n💰 **Total Revenue**: ${formatCurrency(stats.totalRevenue)} KWD\n💵 **Average Order Value**: ${formatCurrency(stats.averageOrderValue)} KWD\n📦 **Items Sold**: ${stats.totalItemsSold}\n\n**By Status**:\n${Object.entries(stats.byStatus).map(([status, count]) => `• ${getStatusName(status, isRTL)}: ${count}`).join('\n')}\n\n**Payment Methods**:\n${Object.entries(stats.byPaymentMethod).map(([method, count]) => `• ${method.toUpperCase()}: ${count} (${((count / stats.total) * 100).toFixed(1)}%)`).join('\n')}\n\n**Top Selling Products**:\n${stats.topSellingProducts.slice(0, 5).map((p, i) => `${i + 1}. ${p.title} (${p.count} units)`).join('\n')}`;

  return {
    content,
    type: 'stats',
    data: stats
  };
};

/**
 * رد الإيرادات
 */
const generateRevenueResponse = (stats: OrdersStats, query: ParsedQuery, isRTL: boolean): AIResponse => {
  const content = isRTL
    ? `💰 **تقرير الإيرادات**\n━━━━━━━━━━━━━━━━━━━━━\n\n💵 **إجمالي الإيرادات**: ${formatCurrency(stats.totalRevenue)} د.ك\n📦 **عدد الطلبات المدفوعة**: ${stats.byPaymentStatus.paid || 0}\n💵 **متوسط قيمة الطلب**: ${formatCurrency(stats.averageOrderValue)} د.ك\n\n**حسب طريقة الدفع**:\n${Object.entries(stats.byPaymentMethod).map(([method, count]) => {
      const revenue = stats.totalRevenue * (count / stats.total);
      return `• ${method.toUpperCase()}: ${formatCurrency(revenue)} د.ك (${count} طلب)`;
    }).join('\n')}`
    : `💰 **Revenue Report**\n━━━━━━━━━━━━━━━━━━━━━\n\n💵 **Total Revenue**: ${formatCurrency(stats.totalRevenue)} KWD\n📦 **Paid Orders**: ${stats.byPaymentStatus.paid || 0}\n💵 **Average Order Value**: ${formatCurrency(stats.averageOrderValue)} KWD\n\n**By Payment Method**:\n${Object.entries(stats.byPaymentMethod).map(([method, count]) => {
      const revenue = stats.totalRevenue * (count / stats.total);
      return `• ${method.toUpperCase()}: ${formatCurrency(revenue)} KWD (${count} orders)`;
    }).join('\n')}`;

  return {
    content,
    type: 'stats',
    data: { revenue: stats.totalRevenue, orders: stats.total, average: stats.averageOrderValue }
  };
};

/**
 * رد عدد الرسائل
 */
const generateMessageCountResponse = (stats: MessagesStats, query: ParsedQuery, isRTL: boolean): AIResponse => {
  const filters = query.filters;
  let count = stats.total;
  let details = '';

  if (filters?.status) {
    count = stats.byStatus[filters.status] || 0;
    details = isRTL ? getStatusName(filters.status, isRTL) : getStatusName(filters.status, isRTL);
  } else if (filters?.priority === 'urgent') {
    count = stats.urgent;
    details = isRTL ? 'عاجلة' : 'urgent';
  }

  const content = isRTL
    ? `📧 لديك **${count}** رسالة ${details}\n\n**حسب الحالة**:\n• غير مقروءة: ${stats.byStatus.unread || 0}\n• مقروءة: ${stats.byStatus.read || 0}\n• تم الرد: ${stats.byStatus.replied || 0}\n• محلولة: ${stats.byStatus.resolved || 0}\n\n⚠️ **رسائل عاجلة**: ${stats.urgent}\n📊 **معدل الاستجابة**: ${stats.responseRate.toFixed(1)}%`
    : `📧 You have **${count}** ${details} messages\n\n**By Status**:\n• Unread: ${stats.byStatus.unread || 0}\n• Read: ${stats.byStatus.read || 0}\n• Replied: ${stats.byStatus.replied || 0}\n• Resolved: ${stats.byStatus.resolved || 0}\n\n⚠️ **Urgent**: ${stats.urgent}\n📊 **Response Rate**: ${stats.responseRate.toFixed(1)}%`;

  return {
    content,
    type: 'stats',
    data: stats,
    actions: [
      {
        label: isRTL ? 'عرض جميع الرسائل' : 'View all messages',
        type: 'navigate',
        target: '/admin/messages'
      }
    ]
  };
};

/**
 * رد إحصائيات الرسائل
 */
const generateMessageStatsResponse = (stats: MessagesStats, isRTL: boolean): AIResponse => {
  const content = isRTL
    ? `📊 **إحصائيات الرسائل الشاملة**\n━━━━━━━━━━━━━━━━━━━━━\n\n📧 **إجمالي الرسائل**: ${stats.total}\n📨 **غير مقروءة**: ${stats.unread}\n⚠️ **عاجلة**: ${stats.urgent}\n📊 **معدل الاستجابة**: ${stats.responseRate.toFixed(1)}%\n⏱️ **متوسط وقت الاستجابة**: ${stats.averageResponseTime}\n\n**حسب الحالة**:\n${Object.entries(stats.byStatus).map(([status, count]) => `• ${getStatusName(status, isRTL)}: ${count}`).join('\n')}\n\n**حسب الفئة**:\n${Object.entries(stats.byCategory).map(([cat, count]) => `• ${getCategoryName(cat, isRTL)}: ${count}`).join('\n')}\n\n**حسب الأولوية**:\n${Object.entries(stats.byPriority).map(([priority, count]) => `• ${getPriorityName(priority, isRTL)}: ${count}`).join('\n')}`
    : `📊 **Complete Message Statistics**\n━━━━━━━━━━━━━━━━━━━━━\n\n📧 **Total Messages**: ${stats.total}\n📨 **Unread**: ${stats.unread}\n⚠️ **Urgent**: ${stats.urgent}\n📊 **Response Rate**: ${stats.responseRate.toFixed(1)}%\n⏱️ **Avg Response Time**: ${stats.averageResponseTime}\n\n**By Status**:\n${Object.entries(stats.byStatus).map(([status, count]) => `• ${getStatusName(status, isRTL)}: ${count}`).join('\n')}\n\n**By Category**:\n${Object.entries(stats.byCategory).map(([cat, count]) => `• ${getCategoryName(cat, isRTL)}: ${count}`).join('\n')}\n\n**By Priority**:\n${Object.entries(stats.byPriority).map(([priority, count]) => `• ${getPriorityName(priority, isRTL)}: ${count}`).join('\n')}`;

  return {
    content,
    type: 'stats',
    data: stats
  };
};

/**
 * رد إحصائيات أكواد الخصم
 */
const generatePromoStatsResponse = (stats: OrdersStats, isRTL: boolean): AIResponse => {
  if (stats.promoCodes.length === 0) {
    return {
      content: isRTL ? '📊 لا توجد أكواد خصم مستخدمة حتى الآن' : '📊 No promo codes used yet',
      type: 'text'
    };
  }

  const content = isRTL
    ? `📊 **إحصائيات أكواد الخصم**\n━━━━━━━━━━━━━━━━━━━━━\n\n**الأكواد المستخدمة**:\n${stats.promoCodes.map((promo, i) =>
        `${i + 1}. **${promo.code}**\n   استخدم ${promo.usage} مرة • خصم إجمالي: ${formatCurrency(promo.totalDiscount)} د.ك`
      ).join('\n\n')}\n\n💰 **إجمالي الخصومات**: ${formatCurrency(stats.promoCodes.reduce((sum, p) => sum + p.totalDiscount, 0))} د.ك`
    : `📊 **Promo Code Statistics**\n━━━━━━━━━━━━━━━━━━━━━\n\n**Used Codes**:\n${stats.promoCodes.map((promo, i) =>
        `${i + 1}. **${promo.code}**\n   Used ${promo.usage} times • Total discount: ${formatCurrency(promo.totalDiscount)} KWD`
      ).join('\n\n')}\n\n💰 **Total Discounts**: ${formatCurrency(stats.promoCodes.reduce((sum, p) => sum + p.totalDiscount, 0))} KWD`;

  return {
    content,
    type: 'stats',
    data: stats.promoCodes
  };
};

/**
 * رد النظرة العامة
 */
const generateOverviewResponse = (stats: OverviewStats, isRTL: boolean): AIResponse => {
  const content = isRTL
    ? `📊 **النظرة العامة**\n━━━━━━━━━━━━━━━━━━━━━\n\n**الإحصائيات العامة**:\n📦 **المنتجات**: ${stats.totalProducts}\n🛒 **الطلبات**: ${stats.totalOrders}\n💰 **الإيرادات**: ${formatCurrency(stats.totalRevenue)} د.ك\n📧 **الرسائل**: ${stats.totalMessages}\n\n**يحتاج انتباه**:\n⏳ **طلبات معلقة**: ${stats.pendingOrders}\n📨 **رسائل غير مقروءة**: ${stats.unreadMessages}\n⚠️ **رسائل عاجلة**: ${stats.urgentMessages}\n\n**هذا الشهر**:\n💰 **الإيرادات**: ${formatCurrency(stats.revenueThisMonth)} د.ك\n📦 **الطلبات**: ${stats.ordersThisMonth}\n📧 **الرسائل**: ${stats.messagesThisMonth}`
    : `📊 **Overview**\n━━━━━━━━━━━━━━━━━━━━━\n\n**General Stats**:\n📦 **Products**: ${stats.totalProducts}\n🛒 **Orders**: ${stats.totalOrders}\n💰 **Revenue**: ${formatCurrency(stats.totalRevenue)} KWD\n📧 **Messages**: ${stats.totalMessages}\n\n**Needs Attention**:\n⏳ **Pending Orders**: ${stats.pendingOrders}\n📨 **Unread Messages**: ${stats.unreadMessages}\n⚠️ **Urgent Messages**: ${stats.urgentMessages}\n\n**This Month**:\n💰 **Revenue**: ${formatCurrency(stats.revenueThisMonth)} KWD\n📦 **Orders**: ${stats.ordersThisMonth}\n📧 **Messages**: ${stats.messagesThisMonth}`;

  return {
    content,
    type: 'stats',
    data: stats
  };
};

/**
 * رد تقرير المنتجات
 */
const generateProductsReportResponse = (stats: ProductsStats, isRTL: boolean): AIResponse => {
  return generateProductStatsResponse(stats, isRTL);
};

/**
 * رد تقرير الطلبات
 */
const generateOrdersReportResponse = (stats: OrdersStats, isRTL: boolean): AIResponse => {
  return generateOrderStatsResponse(stats, isRTL);
};

/**
 * رد تقرير الرسائل
 */
const generateMessagesReportResponse = (stats: MessagesStats, isRTL: boolean): AIResponse => {
  return generateMessageStatsResponse(stats, isRTL);
};

/**
 * رد تقرير شامل
 */
const generateFullReportResponse = (stats: DatabaseStats, isRTL: boolean): AIResponse => {
  const content = isRTL
    ? `📊 **التقرير الشامل**\n━━━━━━━━━━━━━━━━━━━━━\n\n**📦 المنتجات**:\n• الإجمالي: ${stats.products.total}\n• رقمية: ${stats.products.digital} | مادية: ${stats.products.physical}\n• القيمة: ${formatCurrency(stats.products.totalValue)} د.ك\n\n**🛒 الطلبات**:\n• الإجمالي: ${stats.orders.total}\n• الإيرادات: ${formatCurrency(stats.orders.totalRevenue)} د.ك\n• متوسط الطلب: ${formatCurrency(stats.orders.averageOrderValue)} د.ك\n• منتجات مباعة: ${stats.orders.totalItemsSold}\n\n**📧 الرسائل**:\n• الإجمالي: ${stats.messages.total}\n• غير مقروءة: ${stats.messages.unread}\n• معدل الاستجابة: ${stats.messages.responseRate.toFixed(1)}%\n\n**⚡ الأولويات**:\n• طلبات معلقة: ${stats.overview.pendingOrders}\n• رسائل عاجلة: ${stats.overview.urgentMessages}\n\n**📈 هذا الشهر**:\n• إيرادات: ${formatCurrency(stats.overview.revenueThisMonth)} د.ك\n• طلبات: ${stats.overview.ordersThisMonth}\n• رسائل: ${stats.overview.messagesThisMonth}`
    : `📊 **Full Report**\n━━━━━━━━━━━━━━━━━━━━━\n\n**📦 Products**:\n• Total: ${stats.products.total}\n• Digital: ${stats.products.digital} | Physical: ${stats.products.physical}\n• Value: ${formatCurrency(stats.products.totalValue)} KWD\n\n**🛒 Orders**:\n• Total: ${stats.orders.total}\n• Revenue: ${formatCurrency(stats.orders.totalRevenue)} KWD\n• Avg Order: ${formatCurrency(stats.orders.averageOrderValue)} KWD\n• Items Sold: ${stats.orders.totalItemsSold}\n\n**📧 Messages**:\n• Total: ${stats.messages.total}\n• Unread: ${stats.messages.unread}\n• Response Rate: ${stats.messages.responseRate.toFixed(1)}%\n\n**⚡ Priorities**:\n• Pending Orders: ${stats.overview.pendingOrders}\n• Urgent Messages: ${stats.overview.urgentMessages}\n\n**📈 This Month**:\n• Revenue: ${formatCurrency(stats.overview.revenueThisMonth)} KWD\n• Orders: ${stats.overview.ordersThisMonth}\n• Messages: ${stats.overview.messagesThisMonth}`;

  return {
    content,
    type: 'stats',
    data: stats
  };
};

/**
 * رد غير معروف
 */
const generateUnknownResponse = (isRTL: boolean): AIResponse => {
  const content = isRTL
    ? `❓ عذراً، لم أفهم سؤالك بشكل كامل.\n\n💡 **يمكنك تجربة**:\n• "كم عدد المنتجات؟"\n• "ما هي الإيرادات الإجمالية؟"\n• "كم طلب معلق؟"\n• "أعطني نظرة عامة"\n• "تقرير المبيعات"\n• "كم رسالة غير مقروءة؟"\n• "ما هي أكواد الخصم المستخدمة؟"`
    : `❓ Sorry, I didn't fully understand your question.\n\n💡 **You can try**:\n• "How many products?"\n• "What is the total revenue?"\n• "How many pending orders?"\n• "Give me an overview"\n• "Sales report"\n• "How many unread messages?"\n• "What promo codes were used?"`;

  return {
    content,
    type: 'text'
  };
};

/**
 * مساعدات التنسيق
 */
const formatCurrency = (amount: number): string => {
  return amount.toFixed(3);
};

const getCategoryName = (category: string, isRTL: boolean): string => {
  const names: Record<string, { ar: string; en: string }> = {
    guide: { ar: 'دليل', en: 'Guide' },
    guides: { ar: 'أدلة', en: 'Guides' },
    physical: { ar: 'منتج مادي', en: 'Physical' },
    consultation: { ar: 'استشارة', en: 'Consultation' },
    tshirts: { ar: 'تيشيرتات', en: 'T-Shirts' },
    general: { ar: 'عام', en: 'General' },
    support: { ar: 'دعم', en: 'Support' },
    complaint: { ar: 'شكوى', en: 'Complaint' },
    suggestion: { ar: 'اقتراح', en: 'Suggestion' },
    order_inquiry: { ar: 'استفسار طلب', en: 'Order Inquiry' },
    business: { ar: 'أعمال', en: 'Business' }
  };

  return names[category]?.[isRTL ? 'ar' : 'en'] || category;
};

const getStatusName = (status: string, isRTL: boolean): string => {
  const names: Record<string, { ar: string; en: string }> = {
    active: { ar: 'نشط', en: 'Active' },
    inactive: { ar: 'غير نشط', en: 'Inactive' },
    draft: { ar: 'مسودة', en: 'Draft' },
    pending: { ar: 'قيد الانتظار', en: 'Pending' },
    processing: { ar: 'قيد المعالجة', en: 'Processing' },
    shipped: { ar: 'تم الشحن', en: 'Shipped' },
    delivered: { ar: 'تم التوصيل', en: 'Delivered' },
    cancelled: { ar: 'ملغي', en: 'Cancelled' },
    refunded: { ar: 'مسترد', en: 'Refunded' },
    unread: { ar: 'غير مقروءة', en: 'Unread' },
    read: { ar: 'مقروءة', en: 'Read' },
    replied: { ar: 'تم الرد', en: 'Replied' },
    resolved: { ar: 'محلولة', en: 'Resolved' },
    archived: { ar: 'مؤرشفة', en: 'Archived' },
    paid: { ar: 'مدفوع', en: 'Paid' },
    failed: { ar: 'فشل', en: 'Failed' }
  };

  return names[status]?.[isRTL ? 'ar' : 'en'] || status;
};

const getPriorityName = (priority: string, isRTL: boolean): string => {
  const names: Record<string, { ar: string; en: string }> = {
    low: { ar: 'منخفضة', en: 'Low' },
    medium: { ar: 'متوسطة', en: 'Medium' },
    high: { ar: 'عالية', en: 'High' },
    urgent: { ar: 'عاجلة', en: 'Urgent' }
  };

  return names[priority]?.[isRTL ? 'ar' : 'en'] || priority;
};

/**
 * رد عدد أكواد الخصم
 */
const generateDiscountCountResponse = (
  stats: DiscountCodesStats,
  query: ParsedQuery,
  isRTL: boolean
): AIResponse => {
  const { total, active, inactive, available, expired } = stats;

  const content = isRTL
    ? `📊 **إحصائيات أكواد الخصم:**\n\n` +
      `• إجمالي الأكواد: **${total}** كود\n` +
      `• الأكواد النشطة: **${active}** كود\n` +
      `• الأكواد غير النشطة: **${inactive}** كود\n` +
      `• الأكواد المتاحة: **${available}** كود\n` +
      `• الأكواد المنتهية: **${expired}** كود`
    : `📊 **Discount Codes Statistics:**\n\n` +
      `• Total Codes: **${total}** codes\n` +
      `• Active Codes: **${active}** codes\n` +
      `• Inactive Codes: **${inactive}** codes\n` +
      `• Available Codes: **${available}** codes\n` +
      `• Expired Codes: **${expired}** codes`;

  return {
    content,
    type: 'stats',
    data: stats,
    actions: [
      {
        label: isRTL ? 'عرض جميع الأكواد' : 'View All Codes',
        type: 'navigate',
        target: '/admin/discount-codes'
      }
    ]
  };
};

/**
 * رد إحصائيات أكواد الخصم
 */
const generateDiscountStatsResponse = (
  stats: DiscountCodesStats,
  isRTL: boolean
): AIResponse => {
  const { total, active, inactive, byType, totalUsage, mostUsed } = stats;

  let content = isRTL
    ? `📊 **تحليل شامل لأكواد الخصم:**\n\n` +
      `**الإحصائيات العامة:**\n` +
      `• إجمالي الأكواد: ${total}\n` +
      `• الأكواد النشطة: ${active}\n` +
      `• الأكواد غير النشطة: ${inactive}\n` +
      `• إجمالي الاستخدام: ${totalUsage} مرة\n\n`
    : `📊 **Comprehensive Discount Codes Analysis:**\n\n` +
      `**General Statistics:**\n` +
      `• Total Codes: ${total}\n` +
      `• Active Codes: ${active}\n` +
      `• Inactive Codes: ${inactive}\n` +
      `• Total Usage: ${totalUsage} times\n\n`;

  // حسب النوع
  if (Object.keys(byType).length > 0) {
    content += isRTL ? `**حسب النوع:**\n` : `**By Type:**\n`;
    Object.entries(byType).forEach(([type, count]) => {
      const typeName = type === 'percentage' ? (isRTL ? 'نسبة مئوية' : 'Percentage') : (isRTL ? 'قيمة ثابتة' : 'Fixed Amount');
      content += `• ${typeName}: ${count}\n`;
    });
    content += '\n';
  }

  // الأكثر استخداماً
  if (mostUsed.length > 0) {
    content += isRTL ? `**الأكواد الأكثر استخداماً:**\n` : `**Most Used Codes:**\n`;
    mostUsed.forEach((code, index) => {
      const typeSymbol = code.type === 'percentage' ? '%' : 'KWD';
      content += `${index + 1}. ${code.code} (${code.value}${typeSymbol}) - ${code.usedCount} ${isRTL ? 'مرة' : 'times'}\n`;
    });
  }

  return {
    content,
    type: 'stats',
    data: stats
  };
};

/**
 * رد البحث عن أكواد الخصم
 */
const generateDiscountSearchResponse = (
  discountCodes: DiscountCode[],
  query: ParsedQuery,
  isRTL: boolean
): AIResponse => {
  const searchTerm = query.searchTerm || '';
  const filtered = discountCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filtered.length === 0) {
    return {
      content: isRTL
        ? `❌ لم يتم العثور على أكواد خصم تطابق "${searchTerm}"`
        : `❌ No discount codes found matching "${searchTerm}"`,
      type: 'text'
    };
  }

  let content = isRTL
    ? `🔍 **نتائج البحث عن "${searchTerm}":**\n\n` +
      `تم العثور على **${filtered.length}** كود:\n\n`
    : `🔍 **Search Results for "${searchTerm}":**\n\n` +
      `Found **${filtered.length}** codes:\n\n`;

  filtered.slice(0, 10).forEach((code, index) => {
    const typeSymbol = code.type === 'percentage' ? '%' : 'KWD';
    const status = code.isActive ? (isRTL ? '✅ نشط' : '✅ Active') : (isRTL ? '❌ غير نشط' : '❌ Inactive');
    content += `${index + 1}. **${code.code}** - ${code.value}${typeSymbol}\n`;
    content += `   ${status} | ${isRTL ? 'الاستخدام' : 'Usage'}: ${code.usedCount}/${code.usageLimit}\n\n`;
  });

  return {
    content,
    type: 'table',
    data: filtered
  };
};

/**
 * رد إنشاء كود خصم
 */
const generateDiscountCreateResponse = (
  query: ParsedQuery,
  isRTL: boolean
): AIResponse => {
  const discountData = query.discountData;

  if (!discountData || !discountData.code) {
    return {
      content: isRTL
        ? `⚠️ **لإنشاء كود خصم جديد، يرجى تحديد:**\n\n` +
          `• اسم الكود (مثال: SUMMER25)\n` +
          `• نوع الخصم (نسبة مئوية أو قيمة ثابتة)\n` +
          `• قيمة الخصم\n` +
          `• حد الاستخدام\n\n` +
          `**مثال:** أضف كود خصم SUMMER25 بنسبة 25% وحد استخدام 100`
        : `⚠️ **To create a new discount code, please specify:**\n\n` +
          `• Code name (e.g., SUMMER25)\n` +
          `• Discount type (percentage or fixed amount)\n` +
          `• Discount value\n` +
          `• Usage limit\n\n` +
          `**Example:** Create discount code SUMMER25 with 25% off and usage limit 100`,
      type: 'text'
    };
  }

  const content = isRTL
    ? `✅ **جاهز لإنشاء كود خصم جديد:**\n\n` +
      `• الكود: **${discountData.code}**\n` +
      `• النوع: ${discountData.type === 'percentage' ? 'نسبة مئوية' : 'قيمة ثابتة'}\n` +
      `• القيمة: ${discountData.value}${discountData.type === 'percentage' ? '%' : ' KWD'}\n` +
      `• حد الاستخدام: ${discountData.usageLimit || 100}\n` +
      `• مستخدم واحد فقط: ${discountData.oneUserOnly ? 'نعم' : 'لا'}\n\n` +
      `هل تريد المتابعة؟`
    : `✅ **Ready to create new discount code:**\n\n` +
      `• Code: **${discountData.code}**\n` +
      `• Type: ${discountData.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}\n` +
      `• Value: ${discountData.value}${discountData.type === 'percentage' ? '%' : ' KWD'}\n` +
      `• Usage Limit: ${discountData.usageLimit || 100}\n` +
      `• One User Only: ${discountData.oneUserOnly ? 'Yes' : 'No'}\n\n` +
      `Do you want to proceed?`;

  return {
    content,
    type: 'text',
    data: discountData,
    actions: [
      {
        label: isRTL ? '✅ تأكيد الإنشاء' : '✅ Confirm Create',
        type: 'create',
        data: discountData
      },
      {
        label: isRTL ? '❌ إلغاء' : '❌ Cancel',
        type: 'confirm',
        data: { action: 'cancel' }
      }
    ]
  };
};

/**
 * رد تحديث كود خصم
 */
const generateDiscountUpdateResponse = (
  query: ParsedQuery,
  discountCodes: DiscountCode[],
  isRTL: boolean
): AIResponse => {
  const searchTerm = query.searchTerm || '';
  const code = discountCodes.find(c => c.code.toLowerCase() === searchTerm.toLowerCase());

  if (!code) {
    return {
      content: isRTL
        ? `❌ لم يتم العثور على كود الخصم "${searchTerm}"`
        : `❌ Discount code "${searchTerm}" not found`,
      type: 'text'
    };
  }

  const content = isRTL
    ? `✏️ **تحديث كود الخصم "${code.code}":**\n\n` +
      `**البيانات الحالية:**\n` +
      `• النوع: ${code.type === 'percentage' ? 'نسبة مئوية' : 'قيمة ثابتة'}\n` +
      `• القيمة: ${code.value}${code.type === 'percentage' ? '%' : ' KWD'}\n` +
      `• الحالة: ${code.isActive ? 'نشط' : 'غير نشط'}\n` +
      `• الاستخدام: ${code.usedCount}/${code.usageLimit}\n\n` +
      `يرجى تحديد التغييرات المطلوبة.`
    : `✏️ **Update Discount Code "${code.code}":**\n\n` +
      `**Current Data:**\n` +
      `• Type: ${code.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}\n` +
      `• Value: ${code.value}${code.type === 'percentage' ? '%' : ' KWD'}\n` +
      `• Status: ${code.isActive ? 'Active' : 'Inactive'}\n` +
      `• Usage: ${code.usedCount}/${code.usageLimit}\n\n` +
      `Please specify the changes you want to make.`;

  return {
    content,
    type: 'text',
    data: code,
    actions: [
      {
        label: isRTL ? '📝 تعديل' : '📝 Edit',
        type: 'navigate',
        target: `/admin/discount-codes?edit=${code.id}`
      }
    ]
  };
};

/**
 * رد حذف كود خصم
 */
const generateDiscountDeleteResponse = (
  query: ParsedQuery,
  discountCodes: DiscountCode[],
  isRTL: boolean
): AIResponse => {
  const searchTerm = query.searchTerm || '';
  const code = discountCodes.find(c => c.code.toLowerCase() === searchTerm.toLowerCase());

  if (!code) {
    return {
      content: isRTL
        ? `❌ لم يتم العثور على كود الخصم "${searchTerm}"`
        : `❌ Discount code "${searchTerm}" not found`,
      type: 'text'
    };
  }

  const content = isRTL
    ? `⚠️ **تحذير: حذف كود الخصم**\n\n` +
      `هل أنت متأكد من حذف كود الخصم **"${code.code}"**؟\n\n` +
      `**تفاصيل الكود:**\n` +
      `• القيمة: ${code.value}${code.type === 'percentage' ? '%' : ' KWD'}\n` +
      `• عدد مرات الاستخدام: ${code.usedCount}\n` +
      `• الحالة: ${code.isActive ? 'نشط' : 'غير نشط'}\n\n` +
      `⚠️ **هذا الإجراء لا يمكن التراجع عنه!**`
    : `⚠️ **Warning: Delete Discount Code**\n\n` +
      `Are you sure you want to delete discount code **"${code.code}"**?\n\n` +
      `**Code Details:**\n` +
      `• Value: ${code.value}${code.type === 'percentage' ? '%' : ' KWD'}\n` +
      `• Times Used: ${code.usedCount}\n` +
      `• Status: ${code.isActive ? 'Active' : 'Inactive'}\n\n` +
      `⚠️ **This action cannot be undone!**`;

  return {
    content,
    type: 'text',
    data: code,
    actions: [
      {
        label: isRTL ? '🗑️ تأكيد الحذف' : '🗑️ Confirm Delete',
        type: 'delete',
        data: { id: code.id }
      },
      {
        label: isRTL ? '❌ إلغاء' : '❌ Cancel',
        type: 'confirm',
        data: { action: 'cancel' }
      }
    ]
  };
};

/**
 * تقرير أكواد الخصم
 */
const generateDiscountsReportResponse = (
  stats: DiscountCodesStats,
  isRTL: boolean
): AIResponse => {
  const { total, active, inactive, byType, totalUsage, totalDiscountValue, mostUsed, available, expired } = stats;

  let content = isRTL
    ? `📋 **تقرير شامل لأكواد الخصم**\n\n` +
      `**الملخص التنفيذي:**\n` +
      `• إجمالي الأكواد: ${total}\n` +
      `• الأكواد النشطة: ${active} (${((active / total) * 100).toFixed(1)}%)\n` +
      `• الأكواد غير النشطة: ${inactive}\n` +
      `• الأكواد المتاحة: ${available}\n` +
      `• الأكواد المنتهية: ${expired}\n` +
      `• إجمالي الاستخدام: ${totalUsage} مرة\n` +
      `• إجمالي قيمة الخصم: ${totalDiscountValue.toFixed(3)} د.ك\n\n`
    : `📋 **Comprehensive Discount Codes Report**\n\n` +
      `**Executive Summary:**\n` +
      `• Total Codes: ${total}\n` +
      `• Active Codes: ${active} (${((active / total) * 100).toFixed(1)}%)\n` +
      `• Inactive Codes: ${inactive}\n` +
      `• Available Codes: ${available}\n` +
      `• Expired Codes: ${expired}\n` +
      `• Total Usage: ${totalUsage} times\n` +
      `• Total Discount Value: ${totalDiscountValue.toFixed(3)} KWD\n\n`;

  // حسب النوع
  if (Object.keys(byType).length > 0) {
    content += isRTL ? `**التوزيع حسب النوع:**\n` : `**Distribution by Type:**\n`;
    Object.entries(byType).forEach(([type, count]) => {
      const typeName = type === 'percentage' ? (isRTL ? 'نسبة مئوية' : 'Percentage') : (isRTL ? 'قيمة ثابتة' : 'Fixed Amount');
      const percentage = ((count / total) * 100).toFixed(1);
      content += `• ${typeName}: ${count} (${percentage}%)\n`;
    });
    content += '\n';
  }

  // الأكثر استخداماً
  if (mostUsed.length > 0) {
    content += isRTL ? `**أفضل 5 أكواد استخداماً:**\n` : `**Top 5 Most Used Codes:**\n`;
    mostUsed.forEach((code, index) => {
      const typeSymbol = code.type === 'percentage' ? '%' : 'KWD';
      content += `${index + 1}. ${code.code} (${code.value}${typeSymbol}) - ${code.usedCount} ${isRTL ? 'مرة' : 'times'}\n`;
    });
  }

  return {
    content,
    type: 'stats',
    data: stats,
    actions: [
      {
        label: isRTL ? 'عرض جميع الأكواد' : 'View All Codes',
        type: 'navigate',
        target: '/admin/discount-codes'
      },
      {
        label: isRTL ? 'تصدير التقرير' : 'Export Report',
        type: 'export',
        data: stats
      }
    ]
  };
};

/**
 * رد منتجات منخفضة المخزون
 */
const generateProductLowStockResponse = (products: Product[], isRTL: boolean): AIResponse => {
  const lowStockProducts = products.filter(p => {
    const stock = p.stock || 0;
    return stock > 0 && stock <= 10; // منخفض المخزون: 1-10 وحدات
  });

  if (lowStockProducts.length === 0) {
    return {
      content: isRTL
        ? '✅ رائع! لا توجد منتجات منخفضة المخزون حالياً.'
        : '✅ Great! No low stock products currently.',
      type: 'text'
    };
  }

  const content = isRTL
    ? `⚠️ **تحذير: منتجات منخفضة المخزون**\n\n` +
      `لديك **${lowStockProducts.length}** منتج منخفض المخزون:\n\n` +
      lowStockProducts.map((p, i) =>
        `${i + 1}. **${p.title}**\n   المخزون: ${p.stock} وحدة • ${getCategoryName(p.category, isRTL)}`
      ).join('\n\n')
    : `⚠️ **Warning: Low Stock Products**\n\n` +
      `You have **${lowStockProducts.length}** low stock products:\n\n` +
      lowStockProducts.map((p, i) =>
        `${i + 1}. **${p.titleEn}**\n   Stock: ${p.stock} units • ${getCategoryName(p.category, isRTL)}`
      ).join('\n\n');

  return {
    content,
    type: 'table',
    data: lowStockProducts,
    actions: [
      {
        label: isRTL ? 'عرض المنتجات' : 'View Products',
        type: 'navigate',
        target: '/admin/products'
      }
    ]
  };
};

/**
 * رد أكواد خصم غير مستخدمة
 */
const generateDiscountUnusedResponse = (discountCodes: DiscountCode[], isRTL: boolean): AIResponse => {
  const unusedCodes = discountCodes.filter(c => c.usedCount === 0 && c.isActive);

  if (unusedCodes.length === 0) {
    return {
      content: isRTL
        ? '✅ جميع أكواد الخصم النشطة تم استخدامها مرة واحدة على الأقل.'
        : '✅ All active discount codes have been used at least once.',
      type: 'text'
    };
  }

  const content = isRTL
    ? `📊 **أكواد خصم غير مستخدمة:**\n\n` +
      `لديك **${unusedCodes.length}** كود خصم نشط لم يتم استخدامه:\n\n` +
      unusedCodes.map((c, i) => {
        const typeSymbol = c.type === 'percentage' ? '%' : 'KWD';
        return `${i + 1}. **${c.code}** - ${c.value}${typeSymbol}\n   الحد الأقصى: ${c.usageLimit} مرة`;
      }).join('\n\n')
    : `📊 **Unused Discount Codes:**\n\n` +
      `You have **${unusedCodes.length}** active unused codes:\n\n` +
      unusedCodes.map((c, i) => {
        const typeSymbol = c.type === 'percentage' ? '%' : 'KWD';
        return `${i + 1}. **${c.code}** - ${c.value}${typeSymbol}\n   Limit: ${c.usageLimit} times`;
      }).join('\n\n');

  return {
    content,
    type: 'table',
    data: unusedCodes,
    actions: [
      {
        label: isRTL ? 'عرض الأكواد' : 'View Codes',
        type: 'navigate',
        target: '/admin/discount-codes'
      }
    ]
  };
};

/**
 * رد أكواد خصم منتهية
 */
const generateDiscountExpiredResponse = (discountCodes: DiscountCode[], isRTL: boolean): AIResponse => {
  const expiredCodes = discountCodes.filter(c => c.usedCount >= c.usageLimit && c.isActive);

  if (expiredCodes.length === 0) {
    return {
      content: isRTL
        ? '✅ لا توجد أكواد خصم منتهية حالياً.'
        : '✅ No expired discount codes currently.',
      type: 'text'
    };
  }

  const content = isRTL
    ? `⚠️ **أكواد خصم منتهية:**\n\n` +
      `لديك **${expiredCodes.length}** كود خصم منتهي (تم استخدامه بالكامل):\n\n` +
      expiredCodes.map((c, i) => {
        const typeSymbol = c.type === 'percentage' ? '%' : 'KWD';
        return `${i + 1}. **${c.code}** - ${c.value}${typeSymbol}\n   الاستخدام: ${c.usedCount}/${c.usageLimit}`;
      }).join('\n\n') +
      `\n\n💡 **اقتراح:** يمكنك تعطيل هذه الأكواد لتنظيف القائمة.`
    : `⚠️ **Expired Discount Codes:**\n\n` +
      `You have **${expiredCodes.length}** expired codes (fully used):\n\n` +
      expiredCodes.map((c, i) => {
        const typeSymbol = c.type === 'percentage' ? '%' : 'KWD';
        return `${i + 1}. **${c.code}** - ${c.value}${typeSymbol}\n   Usage: ${c.usedCount}/${c.usageLimit}`;
      }).join('\n\n') +
      `\n\n💡 **Suggestion:** You can deactivate these codes to clean up the list.`;

  return {
    content,
    type: 'table',
    data: expiredCodes,
    actions: [
      {
        label: isRTL ? 'تعطيل الأكواد المنتهية' : 'Deactivate Expired Codes',
        type: 'export',
        data: { action: 'bulk_deactivate', codes: expiredCodes }
      },
      {
        label: isRTL ? 'عرض الأكواد' : 'View Codes',
        type: 'navigate',
        target: '/admin/discount-codes'
      }
    ]
  };
};

/**
 * رد رسائل عاجلة
 */
const generateMessageUrgentResponse = (messages: Message[], isRTL: boolean): AIResponse => {
  const urgentMessages = messages.filter(m => m.priority === 'urgent' && m.status === 'unread');

  if (urgentMessages.length === 0) {
    return {
      content: isRTL
        ? '✅ لا توجد رسائل عاجلة غير مقروءة حالياً.'
        : '✅ No urgent unread messages currently.',
      type: 'text'
    };
  }

  const content = isRTL
    ? `🚨 **رسائل عاجلة غير مقروءة:**\n\n` +
      `لديك **${urgentMessages.length}** رسالة عاجلة تحتاج إلى اهتمام فوري:\n\n` +
      urgentMessages.map((m, i) =>
        `${i + 1}. **${m.name}** (${m.email})\n   الموضوع: ${m.subject}\n   التاريخ: ${new Date(m.createdAt).toLocaleDateString('ar-KW')}`
      ).join('\n\n')
    : `🚨 **Urgent Unread Messages:**\n\n` +
      `You have **${urgentMessages.length}** urgent messages requiring immediate attention:\n\n` +
      urgentMessages.map((m, i) =>
        `${i + 1}. **${m.name}** (${m.email})\n   Subject: ${m.subject}\n   Date: ${new Date(m.createdAt).toLocaleDateString('en-US')}`
      ).join('\n\n');

  return {
    content,
    type: 'table',
    data: urgentMessages,
    actions: [
      {
        label: isRTL ? 'عرض الرسائل' : 'View Messages',
        type: 'navigate',
        target: '/admin/messages'
      }
    ]
  };
};

/**
 * رد طلبات في فترة زمنية
 */
const generateOrderDateRangeResponse = (orders: Order[], query: ParsedQuery, isRTL: boolean): AIResponse => {
  const now = new Date();
  let filteredOrders: Order[] = [];
  let periodName = '';

  // تحديد الفترة الزمنية
  if (query.text.match(/اليوم|today/i)) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    filteredOrders = orders.filter(o => new Date(o.createdAt) >= today);
    periodName = isRTL ? 'اليوم' : 'today';
  } else if (query.text.match(/أسبوع|اسبوع|week/i)) {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredOrders = orders.filter(o => new Date(o.createdAt) >= weekAgo);
    periodName = isRTL ? 'الأسبوع الماضي' : 'last week';
  } else if (query.text.match(/شهر|month/i)) {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filteredOrders = orders.filter(o => new Date(o.createdAt) >= monthAgo);
    periodName = isRTL ? 'الشهر الماضي' : 'last month';
  } else {
    filteredOrders = orders;
    periodName = isRTL ? 'جميع الفترات' : 'all time';
  }

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  const content = isRTL
    ? `📅 **طلبات ${periodName}:**\n\n` +
      `• عدد الطلبات: ${filteredOrders.length}\n` +
      `• إجمالي الإيرادات: ${totalRevenue.toFixed(3)} د.ك\n` +
      `• متوسط قيمة الطلب: ${filteredOrders.length > 0 ? (totalRevenue / filteredOrders.length).toFixed(3) : '0.000'} د.ك`
    : `📅 **Orders from ${periodName}:**\n\n` +
      `• Total Orders: ${filteredOrders.length}\n` +
      `• Total Revenue: ${totalRevenue.toFixed(3)} KWD\n` +
      `• Average Order Value: ${filteredOrders.length > 0 ? (totalRevenue / filteredOrders.length).toFixed(3) : '0.000'} KWD`;

  return {
    content,
    type: 'stats',
    data: filteredOrders,
    actions: [
      {
        label: isRTL ? 'عرض الطلبات' : 'View Orders',
        type: 'navigate',
        target: '/admin/orders'
      },
      {
        label: isRTL ? 'تصدير الطلبات' : 'Export Orders',
        type: 'export',
        data: filteredOrders
      }
    ]
  };
};

/**
 * رد اتجاه الإيرادات
 */
const generateRevenueTrendResponse = (orders: Order[], isRTL: boolean): AIResponse => {
  const now = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
  }).reverse();

  const revenueByDay = last7Days.map(day => {
    const dayOrders = orders.filter(o => o.createdAt.startsWith(day));
    return {
      date: day,
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      count: dayOrders.length
    };
  });

  const totalRevenue = revenueByDay.reduce((sum, d) => sum + d.revenue, 0);
  const avgRevenue = totalRevenue / 7;

  const content = isRTL
    ? `📈 **اتجاه الإيرادات (آخر 7 أيام):**\n\n` +
      `• إجمالي الإيرادات: ${totalRevenue.toFixed(3)} د.ك\n` +
      `• متوسط الإيرادات اليومية: ${avgRevenue.toFixed(3)} د.ك\n\n` +
      `**التفاصيل اليومية:**\n` +
      revenueByDay.map(d =>
        `• ${new Date(d.date).toLocaleDateString('ar-KW')}: ${d.revenue.toFixed(3)} د.ك (${d.count} ${d.count === 1 ? 'طلب' : 'طلبات'})`
      ).join('\n')
    : `📈 **Revenue Trend (Last 7 Days):**\n\n` +
      `• Total Revenue: ${totalRevenue.toFixed(3)} KWD\n` +
      `• Average Daily Revenue: ${avgRevenue.toFixed(3)} KWD\n\n` +
      `**Daily Breakdown:**\n` +
      revenueByDay.map(d =>
        `• ${new Date(d.date).toLocaleDateString('en-US')}: ${d.revenue.toFixed(3)} KWD (${d.count} ${d.count === 1 ? 'order' : 'orders'})`
      ).join('\n');

  return {
    content,
    type: 'chart',
    data: revenueByDay,
    actions: [
      {
        label: isRTL ? 'عرض لوحة التحكم' : 'View Dashboard',
        type: 'navigate',
        target: '/admin/dashboard'
      }
    ]
  };
};

/**
 * رد الأكثر مبيعاً
 */
const generateBestSellersResponse = (stats: OrdersStats, isRTL: boolean): AIResponse => {
  const topProducts = stats.topProducts.slice(0, 10);

  if (topProducts.length === 0) {
    return {
      content: isRTL
        ? '📊 لا توجد بيانات مبيعات حالياً.'
        : '📊 No sales data available currently.',
      type: 'text'
    };
  }

  const content = isRTL
    ? `🏆 **أفضل 10 منتجات مبيعاً:**\n\n` +
      topProducts.map((p, i) =>
        `${i + 1}. **${p.title}**\n   المبيعات: ${p.quantity} وحدة • الإيرادات: ${p.revenue.toFixed(3)} د.ك`
      ).join('\n\n')
    : `🏆 **Top 10 Best Selling Products:**\n\n` +
      topProducts.map((p, i) =>
        `${i + 1}. **${p.title}**\n   Sales: ${p.quantity} units • Revenue: ${p.revenue.toFixed(3)} KWD`
      ).join('\n\n');

  return {
    content,
    type: 'table',
    data: topProducts,
    actions: [
      {
        label: isRTL ? 'عرض المنتجات' : 'View Products',
        type: 'navigate',
        target: '/admin/products'
      },
      {
        label: isRTL ? 'عرض لوحة التحكم' : 'View Dashboard',
        type: 'navigate',
        target: '/admin/dashboard'
      }
    ]
  };
};

/**
 * رد أنماط الطلبات
 */
const generateOrderPatternsResponse = (orders: Order[], isRTL: boolean): AIResponse => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // حساب متوسط عدد المنتجات في الطلب
  const totalItems = orders.reduce((sum, o) => sum + o.items.length, 0);
  const avgItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0;

  // توزيع الطلبات حسب طريقة الدفع
  const paymentMethods: Record<string, number> = {};
  orders.forEach(o => {
    paymentMethods[o.paymentMethod] = (paymentMethods[o.paymentMethod] || 0) + 1;
  });

  const content = isRTL
    ? `📊 **أنماط الطلبات:**\n\n` +
      `**الإحصائيات العامة:**\n` +
      `• إجمالي الطلبات: ${totalOrders}\n` +
      `• متوسط قيمة الطلب: ${avgOrderValue.toFixed(3)} د.ك\n` +
      `• متوسط المنتجات في الطلب: ${avgItemsPerOrder.toFixed(1)} منتج\n\n` +
      `**طرق الدفع:**\n` +
      Object.entries(paymentMethods).map(([method, count]) =>
        `• ${method}: ${count} (${((count / totalOrders) * 100).toFixed(1)}%)`
      ).join('\n')
    : `📊 **Order Patterns:**\n\n` +
      `**General Statistics:**\n` +
      `• Total Orders: ${totalOrders}\n` +
      `• Average Order Value: ${avgOrderValue.toFixed(3)} KWD\n` +
      `• Average Items per Order: ${avgItemsPerOrder.toFixed(1)} items\n\n` +
      `**Payment Methods:**\n` +
      Object.entries(paymentMethods).map(([method, count]) =>
        `• ${method}: ${count} (${((count / totalOrders) * 100).toFixed(1)}%)`
      ).join('\n');

  return {
    content,
    type: 'stats',
    data: { totalOrders, avgOrderValue, avgItemsPerOrder, paymentMethods },
    actions: [
      {
        label: isRTL ? 'عرض الطلبات' : 'View Orders',
        type: 'navigate',
        target: '/admin/orders'
      },
      {
        label: isRTL ? 'عرض لوحة التحكم' : 'View Dashboard',
        type: 'navigate',
        target: '/admin/dashboard'
      }
    ]
  };
};

/**
 * رد تصدير المنتجات
 */
const generateExportProductsResponse = (products: Product[], isRTL: boolean): AIResponse => {
  return {
    content: isRTL
      ? `📥 **تصدير المنتجات:**\n\nسيتم تصدير **${products.length}** منتج إلى ملف CSV.\n\nانقر على الزر أدناه لبدء التنزيل.`
      : `📥 **Export Products:**\n\nWill export **${products.length}** products to CSV file.\n\nClick the button below to start download.`,
    type: 'text',
    actions: [
      {
        label: isRTL ? 'تنزيل CSV' : 'Download CSV',
        type: 'export',
        data: { type: 'products', items: products }
      }
    ]
  };
};

/**
 * رد تصدير الطلبات
 */
const generateExportOrdersResponse = (orders: Order[], isRTL: boolean): AIResponse => {
  return {
    content: isRTL
      ? `📥 **تصدير الطلبات:**\n\nسيتم تصدير **${orders.length}** طلب إلى ملف CSV.\n\nانقر على الزر أدناه لبدء التنزيل.`
      : `📥 **Export Orders:**\n\nWill export **${orders.length}** orders to CSV file.\n\nClick the button below to start download.`,
    type: 'text',
    actions: [
      {
        label: isRTL ? 'تنزيل CSV' : 'Download CSV',
        type: 'export',
        data: { type: 'orders', items: orders }
      }
    ]
  };
};

/**
 * رد تصدير الرسائل
 */
const generateExportMessagesResponse = (messages: Message[], isRTL: boolean): AIResponse => {
  return {
    content: isRTL
      ? `📥 **تصدير الرسائل:**\n\nسيتم تصدير **${messages.length}** رسالة إلى ملف CSV.\n\nانقر على الزر أدناه لبدء التنزيل.`
      : `📥 **Export Messages:**\n\nWill export **${messages.length}** messages to CSV file.\n\nClick the button below to start download.`,
    type: 'text',
    actions: [
      {
        label: isRTL ? 'تنزيل CSV' : 'Download CSV',
        type: 'export',
        data: { type: 'messages', items: messages }
      }
    ]
  };
};

/**
 * رد تصدير أكواد الخصم
 */
const generateExportDiscountsResponse = (discountCodes: DiscountCode[], isRTL: boolean): AIResponse => {
  return {
    content: isRTL
      ? `📥 **تصدير أكواد الخصم:**\n\nسيتم تصدير **${discountCodes.length}** كود خصم إلى ملف CSV.\n\nانقر على الزر أدناه لبدء التنزيل.`
      : `📥 **Export Discount Codes:**\n\nWill export **${discountCodes.length}** discount codes to CSV file.\n\nClick the button below to start download.`,
    type: 'text',
    actions: [
      {
        label: isRTL ? 'تنزيل CSV' : 'Download CSV',
        type: 'export',
        data: { type: 'discounts', items: discountCodes }
      }
    ]
  };
};

/**
 * رد تصدير شامل
 */
const generateExportFullResponse = (
  products: Product[],
  orders: Order[],
  messages: Message[],
  discountCodes: DiscountCode[],
  isRTL: boolean
): AIResponse => {
  return {
    content: isRTL
      ? `📥 **تصدير شامل:**\n\nسيتم تصدير جميع البيانات:\n• ${products.length} منتج\n• ${orders.length} طلب\n• ${messages.length} رسالة\n• ${discountCodes.length} كود خصم\n\nانقر على الزر أدناه لبدء التنزيل (4 ملفات CSV).`
      : `📥 **Full Export:**\n\nWill export all data:\n• ${products.length} products\n• ${orders.length} orders\n• ${messages.length} messages\n• ${discountCodes.length} discount codes\n\nClick the button below to start download (4 CSV files).`,
    type: 'text',
    actions: [
      {
        label: isRTL ? 'تنزيل جميع الملفات' : 'Download All Files',
        type: 'export',
        data: { type: 'full', products, orders, messages, discountCodes }
      }
    ]
  };
};

/**
 * رد تحديد الكل كمقروء
 */
const generateBulkMarkReadResponse = (messages: Message[], isRTL: boolean): AIResponse => {
  const unreadCount = messages.filter(m => m.status === 'unread').length;

  if (unreadCount === 0) {
    return {
      content: isRTL
        ? '✅ جميع الرسائل مقروءة بالفعل.'
        : '✅ All messages are already read.',
      type: 'text'
    };
  }

  return {
    content: isRTL
      ? `📧 **تحديد الكل كمقروء:**\n\nسيتم تحديد **${unreadCount}** رسالة غير مقروءة كمقروءة.\n\nهل أنت متأكد؟`
      : `📧 **Mark All as Read:**\n\nWill mark **${unreadCount}** unread messages as read.\n\nAre you sure?`,
    type: 'text',
    actions: [
      {
        label: isRTL ? 'تأكيد' : 'Confirm',
        type: 'confirm',
        data: { action: 'bulk_mark_read', count: unreadCount }
      },
      {
        label: isRTL ? 'إلغاء' : 'Cancel',
        type: 'navigate',
        target: '/admin/messages'
      }
    ]
  };
};

/**
 * رد تعطيل الأكواد المنتهية
 */
const generateBulkDeactivateExpiredResponse = (discountCodes: DiscountCode[], isRTL: boolean): AIResponse => {
  const expiredCodes = discountCodes.filter(c => c.usedCount >= c.usageLimit && c.isActive);

  if (expiredCodes.length === 0) {
    return {
      content: isRTL
        ? '✅ لا توجد أكواد خصم منتهية نشطة.'
        : '✅ No active expired discount codes.',
      type: 'text'
    };
  }

  return {
    content: isRTL
      ? `🔒 **تعطيل الأكواد المنتهية:**\n\nسيتم تعطيل **${expiredCodes.length}** كود خصم منتهي.\n\nهل أنت متأكد؟`
      : `🔒 **Deactivate Expired Codes:**\n\nWill deactivate **${expiredCodes.length}** expired discount codes.\n\nAre you sure?`,
    type: 'text',
    actions: [
      {
        label: isRTL ? 'تأكيد' : 'Confirm',
        type: 'confirm',
        data: { action: 'bulk_deactivate_expired', codes: expiredCodes }
      },
      {
        label: isRTL ? 'إلغاء' : 'Cancel',
        type: 'navigate',
        target: '/admin/discount-codes'
      }
    ]
  };
};
