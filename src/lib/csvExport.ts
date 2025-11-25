/**
 * CSV Export Utility Functions
 * Provides functionality to export data to CSV format for admin dashboard tables
 */

export interface CSVExportOptions {
  filename: string;
  headers: string[];
  data: any[];
  dateFields?: string[];
  currencyFields?: string[];
}

/**
 * Convert data to CSV format
 */
export const convertToCSV = (data: any[], headers: string[]): string => {
  if (!data || data.length === 0) {
    return headers.join(',') + '\n';
  }

  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      
      // Handle null/undefined values
      if (value === null || value === undefined) {
        return '';
      }
      
      // Convert value to string and escape quotes
      let stringValue = String(value);
      
      // If value contains comma, newline, or quote, wrap in quotes and escape quotes
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        stringValue = '"' + stringValue.replace(/"/g, '""') + '"';
      }
      
      return stringValue;
    });
    
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Format date for CSV export
 */
export const formatDateForCSV = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return dateString;
  }
};

/**
 * Format currency for CSV export
 */
export const formatCurrencyForCSV = (amount: number): string => {
  return amount.toFixed(2);
};

/**
 * Export products data to CSV
 */
export const exportProductsToCSV = (products: any[], isRTL: boolean = false): void => {
  const headers = isRTL 
    ? ['id', 'title', 'category', 'price', 'originalPrice', 'stock', 'sku', 'status', 'isNew', 'isLimited']
    : ['id', 'title', 'category', 'price', 'originalPrice', 'stock', 'sku', 'status', 'isNew', 'isLimited'];
    
  const processedData = products.map(product => ({
    id: product.id,
    title: isRTL ? product.title : product.titleEn || product.title,
    category: product.category,
    price: formatCurrencyForCSV(product.price),
    originalPrice: product.originalPrice ? formatCurrencyForCSV(product.originalPrice) : '',
    stock: product.stock || 0,
    sku: product.sku || '',
    status: product.status,
    isNew: product.isNew ? 'Yes' : 'No',
    isLimited: product.isLimited ? 'Yes' : 'No'
  }));
  
  const csvContent = convertToCSV(processedData, headers);
  const filename = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

/**
 * Export orders data to CSV
 */
export const exportOrdersToCSV = (orders: any[], isRTL: boolean = false): void => {
  const headers = isRTL
    ? ['orderNumber', 'customerName', 'customerEmail', 'total', 'status', 'paymentStatus', 'createdAt']
    : ['orderNumber', 'customerName', 'customerEmail', 'total', 'status', 'paymentStatus', 'createdAt'];
    
  const processedData = orders.map(order => ({
    orderNumber: order.orderNumber || order.id,
    customerName: order.customer?.name || order.customerName || '',
    customerEmail: order.customer?.email || order.customerEmail || '',
    total: formatCurrencyForCSV(order.total),
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: formatDateForCSV(order.createdAt)
  }));
  
  const csvContent = convertToCSV(processedData, headers);
  const filename = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

/**
 * Export messages data to CSV
 */
export const exportMessagesToCSV = (messages: any[], isRTL: boolean = false): void => {
  const headers = isRTL
    ? ['messageNumber', 'name', 'email', 'subject', 'category', 'priority', 'status', 'createdAt']
    : ['messageNumber', 'name', 'email', 'subject', 'category', 'priority', 'status', 'createdAt'];
    
  const processedData = messages.map(message => ({
    messageNumber: message.messageNumber || message.id,
    name: message.name,
    email: message.email,
    subject: message.subject,
    category: message.category,
    priority: message.priority,
    status: message.status,
    createdAt: formatDateForCSV(message.createdAt)
  }));
  
  const csvContent = convertToCSV(processedData, headers);
  const filename = `messages_export_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

/**
 * Export discount codes data to CSV
 */
export const exportDiscountCodesToCSV = (codes: any[], isRTL: boolean = false): void => {
  const headers = isRTL
    ? ['code', 'type', 'value', 'usageLimit', 'usedCount', 'oneUserOnly', 'isActive', 'createdAt']
    : ['code', 'type', 'value', 'usageLimit', 'usedCount', 'oneUserOnly', 'isActive', 'createdAt'];
    
  const processedData = codes.map(code => ({
    code: code.code,
    type: code.type,
    value: code.type === 'percentage' ? `${code.value}%` : formatCurrencyForCSV(code.value),
    usageLimit: code.usageLimit,
    usedCount: code.usedCount,
    oneUserOnly: code.oneUserOnly ? 'Yes' : 'No',
    isActive: code.isActive ? 'Active' : 'Inactive',
    createdAt: formatDateForCSV(code.createdAt)
  }));
  
  const csvContent = convertToCSV(processedData, headers);
  const filename = `discount_codes_export_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

/**
 * Export users data to CSV
 */
export const exportUsersToCSV = (users: any[], isRTL: boolean = false): void => {
  const headers = isRTL
    ? ['name', 'email', 'role', 'provider', 'status', 'createdAt', 'lastLogin']
    : ['name', 'email', 'role', 'provider', 'status', 'createdAt', 'lastLogin'];
    
  const processedData = users.map(user => ({
    name: user.name,
    email: user.email,
    role: user.role,
    provider: user.provider || 'email',
    status: user.status,
    createdAt: formatDateForCSV(user.createdAt),
    lastLogin: user.lastLogin ? formatDateForCSV(user.lastLogin) : ''
  }));
  
  const csvContent = convertToCSV(processedData, headers);
  const filename = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};
