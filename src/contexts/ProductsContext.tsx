import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyPrices } from '@/types/currency';
import { productService } from '@/services/database';

export interface Product {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: number | CurrencyPrices; // Support both legacy single price and new multi-currency
  originalPrice?: number | CurrencyPrices;
  image: string;
  images?: string[];
  category?: 'guide' | 'physical' | 'consultation' | 'tshirts' | 'playstation' | 'xbox' | 'nintendo' | 'pc' | 'mobile' | 'accessories' | 'giftcards' | 'preorders' | 'retro'; // Legacy single category support
  categories?: string[]; // New multiple categories support
  isNew?: boolean;
  isLimited?: boolean;
  isDigital: boolean;
  stock?: number;
  sku?: string;
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  rating?: number; // Product rating
  createdAt: string;
  updatedAt: string;
}

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

interface ProductsContextType extends ProductsState {
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Product | undefined;
  searchProducts: (query: string, category?: string) => Product[];
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
}

// Fetch products from Supabase in production
const INITIAL_PRODUCTS: Product[] = [];

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [productsState, setProductsState] = useState<ProductsState>({
    products: [],
    isLoading: true,
    error: null,
  });

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const refreshProducts = async (): Promise<void> => {
    setProductsState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch from Supabase only
      const products = await productService.getAll();

      setProductsState({
        products: products,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching products from Supabase:', error);
      setProductsState({
        products: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load products',
      });
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      // Ensure images array exists and has at least one image
      const images = productData.images && productData.images.length > 0
        ? productData.images
        : [productData.image];

      // Ensure main image is set to first image in array
      const mainImage = images[0] || productData.image;

      const newProduct = await productService.create({
        ...productData,
        image: mainImage,
        images: images
      });

      if (!newProduct) {
        throw new Error('Failed to create product');
      }

      setProductsState(prev =>({
        ...prev,
        products: [...prev.products, newProduct],
      }));

      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      return false;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
    try {
      // If images are being updated, ensure consistency
      let updatedData = { ...productData };

      if (productData.images !== undefined) {
        // Ensure images array has at least one image
        let images = productData.images && productData.images.length > 0
          ? productData.images
          : (productData.image ? [productData.image] : []);

        // Validate that images array is not empty after update
        if (images.length === 0) {
          console.warn('Cannot update product with empty images array. Keeping existing images.');
          // Get current product to preserve existing images
          const currentProduct = products.find(p => p.id === id);
          if (currentProduct) {
            images = currentProduct.images || [currentProduct.image].filter(Boolean);
          }
        }

        // Ensure main image is set to first image in array
        const mainImage = images[0] || productData.image || '';

        updatedData = {
          ...productData,
          image: mainImage,
          images: images
        };

        // Additional validation: ensure main image is in the images array
        if (mainImage && !images.includes(mainImage)) {
          updatedData.images = [mainImage, ...images];
        }
      } else if (productData.image !== undefined) {
        // If only the single image field is updated, sync it with images array
        const currentProduct = products.find(p => p.id === id);
        if (currentProduct) {
          updatedData.images = [productData.image, ...(currentProduct.images || []).filter(img => img !== productData.image)];
        } else {
          updatedData.images = [productData.image];
        }
      }

      const updatedProduct = await productService.update(id, updatedData);

      if (!updatedProduct) {
        throw new Error('Failed to update product');
      }

      setProductsState(prev => ({
        ...prev,
        products: prev.products.map(product =>
          product.id === id ? updatedProduct : product
        ),
      }));

      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      // Delete from database first
      const success = await productService.delete(id);

      if (!success) {
        throw new Error('Failed to delete product from database');
      }

      // Update UI after successful database deletion
      setProductsState(prev => ({
        ...prev,
        products: prev.products.filter(product => product.id !== id),
      }));

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  };

  const getProductById = (id: string): Product | undefined => {
    return productsState.products.find(product => product.id === id);
  };

  const searchProducts = (query: string, category?: string): Product[] => {
    let filtered = productsState.products;

    if (category && category !== 'all') {
      // Support both legacy single category and new multiple categories
      filtered = filtered.filter(product =>
        product.category === category ||
        (product.categories && product.categories.includes(category))
      );
    }

    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(product =>
        (product.title && product.title.toLowerCase().includes(searchTerm)) ||
        (product.titleEn && product.titleEn.toLowerCase().includes(searchTerm)) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.descriptionEn && product.descriptionEn.toLowerCase().includes(searchTerm)) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        product.sku?.toLowerCase().includes(searchTerm) ||
        (product.categories && product.categories.some(cat => cat.toLowerCase().includes(searchTerm)))
      );
    }

    return filtered;
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const value: ProductsContextType = {
    ...productsState,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    searchProducts,
    refreshProducts,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export default ProductsProvider;