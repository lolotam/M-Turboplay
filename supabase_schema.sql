-- Create categories table for better category management
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_en TEXT,
  color TEXT DEFAULT '#6B7280',
  icon TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_categories junction table for multiple categories per product
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT false,
  is_limited BOOLEAN DEFAULT false,
  is_digital BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  tags TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'inactive', 'draft')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('knet', 'credit_card', 'cash')),
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('unread', 'read', 'replied')) DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_new ON products(is_new);
CREATE INDEX idx_products_is_limited ON products(is_limited);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX idx_product_categories_category_id ON product_categories(category_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to products (read-only)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (status = 'active');

-- Create policies for authenticated admin users
CREATE POLICY "Admin users can do everything" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin users can manage orders" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin users can manage messages" ON contact_messages
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin users can manage categories" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for product_categories (public read, admin write)
CREATE POLICY "Product categories are viewable by everyone" ON product_categories
  FOR SELECT USING (true);

CREATE POLICY "Admin users can manage product categories" ON product_categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Allow anyone to create contact messages
CREATE POLICY "Anyone can create contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Insert default gaming categories
INSERT INTO categories (name, name_en, slug, description, description_en, color, icon, sort_order) VALUES
  -- Platform Categories
  ('بلايستيشن', 'PlayStation', 'playstation', 'ألعاب بلايستيشن الحديثة والكلاسيكية', 'Modern and classic PlayStation games', '#006FCD', 'playstation', 1),
  ('إكس بوكس', 'Xbox', 'xbox', 'ألعاب إكس بوكس بجميع إصداراتها', 'Xbox games across all generations', '#107C10', 'xbox', 2),
  ('نينتندو', 'Nintendo', 'nintendo', 'ألعاب نينتندو سويتش والكلاسيكية', 'Nintendo Switch and classic games', '#E60012', 'nintendo', 3),
  ('ألعاب الكمبيوتر', 'PC Games', 'pc', 'ألعاب الكمبيوتر والحاسوب الشخصي', 'PC and computer games', '#00ADBC', 'pc', 4),
  ('ألعاب الجوال', 'Mobile Games', 'mobile', 'ألعاب الهواتف الذكية والأجهزة اللوحية', 'Mobile and tablet games', '#5CB85C', 'mobile', 5),

  -- Gaming Categories
  ('ألعاب الأكشن', 'Action Games', 'action', 'ألعاب الأكشن والمغامرات السريعة', 'Fast-paced action and adventure games', '#FF6B35', 'action', 6),
  ('ألعاب المغامرات', 'Adventure Games', 'adventure', 'قصص تفاعلية ومغامرات استكشافية', 'Interactive stories and exploration adventures', '#8E44AD', 'adventure', 7),
  ('ألعاب الرياضة', 'Sports Games', 'sports', 'ألعاب رياضية متنوعة', 'Various sports gaming experiences', '#27AE60', 'sports', 8),
  ('ألعاب الاستراتيجية', 'Strategy Games', 'strategy', 'ألعاب التفكير والاستراتيجية', 'Thinking and strategy games', '#F39C12', 'strategy', 9),
  ('ألعاب تقمص الأدوار', 'RPG Games', 'rpg', 'ألعاب تقمص الأدوار والعوالم الخيالية', 'Role-playing games and fantasy worlds', '#9B59B6', 'rpg', 10),
  ('ألعاب الرعب', 'Horror Games', 'horror', 'ألعاب الرعب والتشويق', 'Horror and suspense games', '#2C3E50', 'horror', 11),
  ('ألعاب السباق', 'Racing Games', 'racing', 'ألعاب السباق والسرعة', 'Racing and speed games', '#E74C3C', 'racing', 12),

  -- Special Categories
  ('إكسسوارات الألعاب', 'Gaming Accessories', 'accessories', 'إكسسوارات ومعدات الألعاب', 'Gaming accessories and equipment', '#95A5A6', 'accessories', 13),
  ('البطاقات الرقمية', 'Digital Gift Cards', 'giftcards', 'بطاقات هدايا رقمية للمتاجر', 'Digital gift cards for stores', '#34495E', 'giftcards', 14),
  ('الطلب المسبق', 'Pre-Orders', 'preorders', 'الألعاب المتاحة للطلب المسبق', 'Games available for pre-order', '#E67E22', 'preorders', 15),
  ('الألعاب الكلاسيكية', 'Retro Gaming', 'retro', 'الألعاب الكلاسيكية والقديمة', 'Classic and retro games', '#7D3C98', 'retro', 16),

  -- Special Content Categories
  ('جديد في الألعاب', 'New in Gaming', 'new-in-gaming', 'أحدث الألعاب والإصدارات', 'Latest games and releases', '#10B981', 'new', 17),
  ('الأكثر مبيعاً', 'Best Sellers', 'best-sellers', 'الألعاب الأكثر مبيعاً وشعبية', 'Best-selling and most popular games', '#F59E0B', 'bestsellers', 18),
  ('العروض الخاصة', 'Special Offers', 'special-offers', 'العروض والخصومات الحصرية', 'Exclusive offers and discounts', '#E935C1', 'offers', 19);

-- Insert sample products (updated for gaming platform)
INSERT INTO products (title, title_en, description, description_en, price, original_price, image, is_new, is_limited, is_digital, stock, sku, tags, status) VALUES
  ('دليل الألعاب الشامل', 'Complete Gaming Guide', 'دليل شامل لأفضل الألعاب والاستراتيجيات في عالم الألعاب', 'Complete guide for best games and strategies in the gaming world', 3.50, 5.00, '/src/assets/pets-guide-cover.jpg', true, false, true, 999, 'GG-001', ARRAY['gaming', 'guide', 'strategy'], 'active'),
  ('تيشيرت Gamer Pro', 'Gamer Pro T-Shirt', 'تيشيرت مريح بتصميم احترافي للاعبين', 'Comfortable t-shirt with professional gamer design', 12.75, NULL, '/src/assets/queen-bee-tshirt.jpg', false, true, false, 25, 'TS-GP-001', ARRAY['clothing', 'gaming', 'merchandise'], 'active'),
  ('جلسة تدريب احترافية', 'Professional Training Session', 'جلسة تدريبية مدتها 30 دقيقة لتحسين مهاراتك في الألعاب', '30-minute training session to improve your gaming skills', 18.00, NULL, '/src/assets/consultation-session.jpg', false, false, true, 10, 'TS-001', ARRAY['training', 'coaching', 'professional'], 'active'),
  ('خريطة ألعاب جديدة', 'New Games Map', 'خريطة شاملة لأحدث الألعاب والإصدارات الحصرية', 'Comprehensive map for latest games and exclusive releases', 2.25, 3.50, '/src/assets/pets-guide-cover.jpg', true, false, true, 999, 'NGM-001', ARRAY['new-games', 'map', 'exclusive'], 'active'),
  ('مجموعة إكسسوارات الألعاب', 'Gaming Accessories Pack', 'مجموعة إكسسوارات عالية الجودة للألعاب', 'High-quality gaming accessories collection', 4.50, NULL, '/src/assets/sticker-pack.jpg', true, true, false, 50, 'GAP-001', ARRAY['accessories', 'gaming', 'collection'], 'active'),
  ('دليل اللاعب المحترف', 'Pro Gamer Guide', 'تعلم كيفية الوصول للمستوى الاحترافي في الألعاب', 'Learn how to reach professional level in gaming', 4.00, NULL, '/src/assets/pets-guide-cover.jpg', false, false, true, 999, 'PGG-001', ARRAY['pro-gaming', 'professional', 'skills'], 'active');