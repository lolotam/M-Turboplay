// Database types for type safety
export interface Product {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  original_price?: number;
  image: string;
  images?: string[];
  category: 'guide' | 'physical' | 'consultation' | 'tshirts' | 'playstation' | 'xbox' | 'nintendo' | 'pc' | 'mobile' | 'accessories' | 'giftcards' | 'preorders' | 'retro';
  is_new: boolean;
  is_limited: boolean;
  is_digital: boolean;
  stock?: number;
  sku: string;
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'knet' | 'credit_card' | 'cash';
  payment_status: 'pending' | 'paid' | 'failed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  created_at: string;
  updated_at: string;
}