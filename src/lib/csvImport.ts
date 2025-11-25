import { useToast } from '@/hooks/use-toast';

export interface CSVProductData {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: string;
  originalPrice?: string;
  category: string;
  sku: string;
  stock?: string;
  isNew?: string;
  isLimited?: string;
  status?: string;
  tags?: string;
  images?: string;
}

export const importProductsFromCSV = async (
  csvText: string,
  toast: any,
  isRTL: boolean
): Promise<boolean> => {
  try {
    // Parse CSV text
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      toast({
        title: isRTL ? 'خطأ في ملف CSV' : 'CSV File Error',
        description: isRTL ? 'الملف يجب أن يحتوي على رؤوس وصفوف بيانات' : 'File must contain headers and data rows',
        variant: 'destructive',
      });
      return false;
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
      return false;
    }

    // Parse data rows
    const products: CSVProductData[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));

      if (values.length !== headers.length) {
        console.warn(`Skipping row ${i + 1}: incorrect number of columns`);
        continue;
      }

      const product: CSVProductData = {
        title: values[headers.indexOf('title')],
        titleEn: values[headers.indexOf('titleEn')],
        description: values[headers.indexOf('description')],
        descriptionEn: values[headers.indexOf('descriptionEn')],
        price: values[headers.indexOf('price')],
        originalPrice: values[headers.indexOf('originalPrice')] || '',
        category: values[headers.indexOf('category')],
        sku: values[headers.indexOf('sku')],
        stock: values[headers.indexOf('stock')] || '',
        isNew: values[headers.indexOf('isNew')] || 'false',
        isLimited: values[headers.indexOf('isLimited')] || 'false',
        status: values[headers.indexOf('status')] || 'active',
        tags: values[headers.indexOf('tags')] || '',
        images: values[headers.indexOf('images')] || ''
      };

      // Validate required fields
      if (!product.title || !product.titleEn || !product.price || !product.sku) {
        console.warn(`Skipping row ${i + 1}: missing required fields (title, titleEn, price, or sku)`);
        continue;
      }

      products.push(product);
    }

    if (products.length === 0) {
      toast({
        title: isRTL ? 'لا توجد منتجات صالحة' : 'No Valid Products',
        description: isRTL ? 'لم يتم العثور على منتجات صالحة في ملف CSV' : 'No valid products found in CSV file',
        variant: 'destructive',
      });
      return false;
    }

    // Here you would typically save to database
    // For now, we'll just show success message with count
    console.log(`Successfully parsed ${products.length} products from CSV`);

    toast({
      title: isRTL ? 'تم استيراد المنتجات' : 'Products Imported',
      description: isRTL
        ? `تم تحليل ${products.length} منتج بنجاح من ملف CSV`
        : `Successfully parsed ${products.length} products from CSV file`,
    });

    return true;
  } catch (error) {
    console.error('CSV Import Error:', error);
    toast({
      title: isRTL ? 'خطأ في استيراد CSV' : 'CSV Import Error',
      description: isRTL ? 'فشل في تحليل ملف CSV' : 'Failed to parse CSV file',
      variant: 'destructive',
    });
    return false;
  }
};

export const generateCSVTemplate = (): string => {
  const headers = [
    'title',
    'titleEn',
    'description',
    'descriptionEn',
    'price',
    'originalPrice',
    'category',
    'sku',
    'stock',
    'isNew',
    'isLimited',
    'status',
    'tags',
    'images'
  ];

  const sampleRow = [
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
    'gaming,action,ps5,exclusive',
    'https://example.com/image1.jpg,https://example.com/image2.jpg,https://example.com/image3.jpg'
  ];

  return [headers.join(','), sampleRow.join(',')].join('\n');
};

export const validateProductData = (product: CSVProductData): string[] => {
  const errors: string[] = [];

  if (!product.title?.trim()) {
    errors.push('Title (Arabic) is required');
  }

  if (!product.titleEn?.trim()) {
    errors.push('Title (English) is required');
  }

  if (!product.price || isNaN(parseFloat(product.price))) {
    errors.push('Valid price is required');
  }

  if (!product.sku?.trim()) {
    errors.push('SKU is required');
  }

  const validCategories = [
    'guide', 'physical', 'consultation', 'tshirts',
    'playstation', 'xbox', 'nintendo', 'pc', 'mobile',
    'accessories', 'giftcards', 'preorders', 'retro'
  ];

  if (!product.category || !validCategories.includes(product.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  return errors;
};