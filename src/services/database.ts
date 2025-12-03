import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';

// Ensure Supabase is available
if (!supabase) {
  throw new Error('Supabase is not configured. Please check your environment variables.');
}

// Test database connection on import
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
};

// Initialize connection test
testConnection();

// Define database product type
interface DatabaseProduct {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  original_price?: number;
  image: string;
  images?: string[];
  category: string;
  categories?: string[];
  is_new: boolean;
  is_limited: boolean;
  is_digital: boolean;
  stock?: number;
  sku: string;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

// Convert database product to app product format
const convertDbToProduct = (dbProduct: DatabaseProduct): Product => ({
  id: dbProduct.id,
  title: dbProduct.title_ar,
  titleEn: dbProduct.title_en,
  description: dbProduct.description_ar,
  descriptionEn: dbProduct.description_en,
  price: Number(dbProduct.price),
  originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : undefined,
  image: dbProduct.image || '',
  images: dbProduct.images || [dbProduct.image || ''],
  category: dbProduct.category as Product['category'], // Legacy single category support
  categories: dbProduct.categories || (dbProduct.category ? [dbProduct.category] : []), // New multiple categories support
  isNew: dbProduct.is_new || false,
  isLimited: dbProduct.is_limited || false,
  isDigital: dbProduct.is_digital !== undefined ? dbProduct.is_digital : true,
  stock: dbProduct.stock || 0,
  sku: dbProduct.sku || '',
  tags: dbProduct.tags || [],
  status: (dbProduct.status as Product['status']) || 'active',
  createdAt: dbProduct.created_at,
  updatedAt: dbProduct.updated_at,
});

// Convert app product to database format
const convertProductToDb = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => ({
  title_ar: product.title,
  title_en: product.titleEn,
  description_ar: product.description,
  description_en: product.descriptionEn,
  price: typeof product.price === 'number' ? product.price : product.price.KWD,
  original_price: typeof product.originalPrice === 'number' ? product.originalPrice : product.originalPrice?.KWD,
  // Keep legacy single image column in sync with first item in images array
  image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '',
  images: product.images || [product.image],
  category: product.category || (product.categories && product.categories.length > 0 ? product.categories[0] : null), // Legacy support - use first category as primary
  categories: product.categories || (product.category ? [product.category] : []), // New multiple categories support
  is_new: product.isNew || false,
  is_limited: product.isLimited || false,
  is_digital: product.isDigital,
  stock: product.stock || 0,
  sku: product.sku || '',
  tags: product.tags,
  status: product.status,
});

export const productService = {
  // Fetch all products
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(convertDbToProduct);
    } catch (error) {
      console.error('Error fetching products from Supabase:', error);
      throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Fetch single product by ID
  async getById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? convertDbToProduct(data) : null;
    } catch (error) {
      console.error('Error fetching product from Supabase:', error);
      throw new Error(`Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Create new product
  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(convertProductToDb(product))
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Failed to create product: ${error.message}`);
      }

      return data ? convertDbToProduct(data) : null;
    } catch (error) {
      console.error('Error creating product in Supabase:', error);
      throw error;
    }
  },

  // Update existing product
  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      // Define proper type for database updates
      interface DatabaseUpdates {
        title_ar?: string;
        title_en?: string;
        description_ar?: string;
        description_en?: string;
        price?: number;
      original_price?: number;
      image?: string;
      images?: string[];
      category?: string;
      categories?: string[];
      is_new?: boolean;
      is_limited?: boolean;
        is_digital?: boolean;
        stock?: number;
        sku?: string;
        tags?: string[];
        status?: string;
      }

      const dbUpdates: DatabaseUpdates = {};

      if (updates.title !== undefined) dbUpdates.title_ar = updates.title;
      if (updates.titleEn !== undefined) dbUpdates.title_en = updates.titleEn;
      if (updates.description !== undefined) dbUpdates.description_ar = updates.description;
      if (updates.descriptionEn !== undefined) dbUpdates.description_en = updates.descriptionEn;
      if (updates.price !== undefined) dbUpdates.price = typeof updates.price === 'number' ? updates.price : updates.price.KWD;
      if (updates.originalPrice !== undefined) dbUpdates.original_price = typeof updates.originalPrice === 'number' ? updates.originalPrice : updates.originalPrice?.KWD;

      // Handle images with size check for base64 data URLs
      if (updates.images !== undefined) {
        // Validate that images array is not empty
        if (updates.images.length === 0) {
          throw new Error('Product must have at least one image. Cannot remove all images.');
        }

        // Validate image URLs if present
        for (const img of updates.images) {
          if (!img.startsWith('data:') && !img.startsWith('http://') && !img.startsWith('https://')) {
            throw new Error(`Invalid image URL or format: ${img.substring(0, 50)}...`);
          }
        }

        // Check if images are data URLs (base64)
        const hasDataUrls = updates.images.some(img => img.startsWith('data:'));

        if (hasDataUrls) {
          console.warn('⚠️ Using base64 images - may cause size issues');

          // Limit to 3 images max when using data URLs to prevent database errors
          if (updates.images.length > 3) {
            throw new Error('Maximum 3 uploaded images allowed. Use image URLs for additional images.');
          }

          // Check individual image sizes (estimate)
          for (const img of updates.images) {
            if (img.startsWith('data:')) {
              const sizeEstimate = img.length * 0.75; // Base64 is ~33% larger than binary
              if (sizeEstimate > 2 * 1024 * 1024) { // ~2MB limit per image
                throw new Error('One or more images are too large. Please compress images before uploading.');
              }
            }
          }
        }

        dbUpdates.images = updates.images;
        // Keep legacy single image column in sync so UI doesn't show stale image after deletion
        dbUpdates.image = updates.images[0] || '';

        // Additional validation: ensure the first image exists and is valid
        if (!dbUpdates.image) {
          throw new Error('Invalid image data: First image in array is empty or invalid');
        }
      }

      // Support direct image updates when images array isn't provided
      if (updates.image !== undefined && dbUpdates.image === undefined) {
        dbUpdates.image = updates.image;
      }

      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.categories !== undefined) dbUpdates.categories = updates.categories;
      if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew;
      if (updates.isLimited !== undefined) dbUpdates.is_limited = updates.isLimited;
      if (updates.isDigital !== undefined) dbUpdates.is_digital = updates.isDigital;
      if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
      if (updates.sku !== undefined) dbUpdates.sku = updates.sku;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Database update error:', error);
        throw new Error(`Failed to update product: ${error.message}`);
      }

      return data ? convertDbToProduct(data) : null;
    } catch (error) {
      console.error('Error updating product in Supabase:', error);
      throw error;
    }
  },

  // Delete product
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Database delete error:', error);
        throw new Error(`Failed to delete product: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting product from Supabase:', error);
      throw error;
    }
  },

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('count')
        .limit(1);

      if (error) throw error;
      console.log('✅ Supabase connection successful');
      return true;
    } catch (error) {
      console.error('❌ Supabase connection failed:', error);
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
