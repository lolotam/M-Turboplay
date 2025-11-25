import { Product } from '@/contexts/ProductsContext';
import { Order } from '@/contexts/OrdersContext';
import { Message } from '@/contexts/MessagesContext';
import { DiscountCode } from '@/contexts/DiscountCodesContext';

/**
 * تحويل البيانات إلى صيغة CSV
 * Convert data to CSV format
 */
export const convertToCSV = (data: any[], headers: string[]): string => {
  if (data.length === 0) return '';

  // إنشاء صف الرؤوس
  const headerRow = headers.join(',');

  // إنشاء صفوف البيانات
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      
      // معالجة القيم الخاصة
      if (value === null || value === undefined) {
        return '';
      }
      
      // تحويل الكائنات والمصفوفات إلى JSON
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      
      // إضافة علامات اقتباس للنصوص التي تحتوي على فواصل أو علامات اقتباس
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
};

/**
 * تنزيل ملف CSV
 * Download CSV file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * تصدير المنتجات إلى CSV
 * Export products to CSV
 */
export const exportProducts = (products: Product[], isRTL: boolean): void => {
  const headers = isRTL
    ? ['الرقم', 'الاسم_عربي', 'الاسم_انجليزي', 'الفئة', 'السعر', 'النوع', 'المخزون', 'الحالة', 'SKU']
    : ['ID', 'Title_AR', 'Title_EN', 'Category', 'Price', 'Type', 'Stock', 'Status', 'SKU'];

  const data = products.map((product, index) => ({
    [headers[0]]: index + 1,
    [headers[1]]: product.title,
    [headers[2]]: product.titleEn,
    [headers[3]]: product.category,
    [headers[4]]: typeof product.price === 'number' ? product.price : product.price.KWD || 0,
    [headers[5]]: product.isDigital ? (isRTL ? 'رقمي' : 'Digital') : (isRTL ? 'مادي' : 'Physical'),
    [headers[6]]: product.stock || 0,
    [headers[7]]: product.status,
    [headers[8]]: product.sku || ''
  }));

  const csv = convertToCSV(data, headers);
  const filename = `products_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

/**
 * تصدير الطلبات إلى CSV
 * Export orders to CSV
 */
export const exportOrders = (orders: Order[], isRTL: boolean): void => {
  const headers = isRTL
    ? ['رقم_الطلب', 'العميل', 'البريد', 'الهاتف', 'الإجمالي', 'الحالة', 'طريقة_الدفع', 'حالة_الدفع', 'التاريخ']
    : ['Order_Number', 'Customer', 'Email', 'Phone', 'Total', 'Status', 'Payment_Method', 'Payment_Status', 'Date'];

  const data = orders.map(order => ({
    [headers[0]]: order.orderNumber,
    [headers[1]]: `${order.customer.firstName} ${order.customer.lastName}`,
    [headers[2]]: order.customer.email,
    [headers[3]]: order.customer.phone || '',
    [headers[4]]: order.total.toFixed(3),
    [headers[5]]: order.status,
    [headers[6]]: order.paymentMethod,
    [headers[7]]: order.paymentStatus,
    [headers[8]]: new Date(order.createdAt).toLocaleDateString(isRTL ? 'ar-KW' : 'en-US')
  }));

  const csv = convertToCSV(data, headers);
  const filename = `orders_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

/**
 * تصدير الرسائل إلى CSV
 * Export messages to CSV
 */
export const exportMessages = (messages: Message[], isRTL: boolean): void => {
  const headers = isRTL
    ? ['رقم_الرسالة', 'الاسم', 'البريد', 'الهاتف', 'الموضوع', 'الفئة', 'الأولوية', 'الحالة', 'التاريخ']
    : ['Message_Number', 'Name', 'Email', 'Phone', 'Subject', 'Category', 'Priority', 'Status', 'Date'];

  const data = messages.map(message => ({
    [headers[0]]: message.messageNumber,
    [headers[1]]: message.name,
    [headers[2]]: message.email,
    [headers[3]]: message.phone || '',
    [headers[4]]: message.subject,
    [headers[5]]: message.category,
    [headers[6]]: message.priority,
    [headers[7]]: message.status,
    [headers[8]]: new Date(message.createdAt).toLocaleDateString(isRTL ? 'ar-KW' : 'en-US')
  }));

  const csv = convertToCSV(data, headers);
  const filename = `messages_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

/**
 * تصدير أكواد الخصم إلى CSV
 * Export discount codes to CSV
 */
export const exportDiscountCodes = (discountCodes: DiscountCode[], isRTL: boolean): void => {
  const headers = isRTL
    ? ['الكود', 'النوع', 'القيمة', 'الاستخدام', 'الحد_الأقصى', 'مستخدم_واحد', 'الحالة', 'التاريخ']
    : ['Code', 'Type', 'Value', 'Used', 'Limit', 'One_User_Only', 'Status', 'Date'];

  const data = discountCodes.map(code => ({
    [headers[0]]: code.code,
    [headers[1]]: code.type,
    [headers[2]]: code.value,
    [headers[3]]: code.usedCount,
    [headers[4]]: code.usageLimit,
    [headers[5]]: code.oneUserOnly ? (isRTL ? 'نعم' : 'Yes') : (isRTL ? 'لا' : 'No'),
    [headers[6]]: code.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive'),
    [headers[7]]: new Date(code.createdAt).toLocaleDateString(isRTL ? 'ar-KW' : 'en-US')
  }));

  const csv = convertToCSV(data, headers);
  const filename = `discount_codes_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

/**
 * تصدير تقرير شامل
 * Export comprehensive report
 */
export const exportFullReport = (
  products: Product[],
  orders: Order[],
  messages: Message[],
  discountCodes: DiscountCode[],
  isRTL: boolean
): void => {
  // تصدير جميع البيانات في ملفات منفصلة
  exportProducts(products, isRTL);
  
  setTimeout(() => {
    exportOrders(orders, isRTL);
  }, 500);
  
  setTimeout(() => {
    exportMessages(messages, isRTL);
  }, 1000);
  
  setTimeout(() => {
    exportDiscountCodes(discountCodes, isRTL);
  }, 1500);
};

