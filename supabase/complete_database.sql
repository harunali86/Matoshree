-- =====================================================
-- MATOSHREE FOOTWEAR - COMPLETE DATABASE
-- Copy this ENTIRE file and paste in Supabase SQL Editor
-- Then click RUN
-- =====================================================

-- First, drop existing tables if any (clean start)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS hero_banners CASCADE;

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CATEGORIES
-- =====================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. BRANDS
-- =====================================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. PRODUCTS
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  is_on_sale BOOLEAN DEFAULT false,
  sale_start_date TIMESTAMP,
  sale_end_date TIMESTAMP,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  images TEXT[],
  thumbnail TEXT,
  colors JSONB,
  sizes JSONB,
  rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  stock INT DEFAULT 0,
  low_stock_alert INT DEFAULT 5,
  sku TEXT UNIQUE,
  weight DECIMAL(10,2),
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. HERO BANNERS
-- =====================================================
CREATE TABLE hero_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Shop Now',
  cta_link TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. ADDRESSES
-- =====================================================
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  landmark TEXT,
  address_type TEXT DEFAULT 'home',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. ORDERS
-- =====================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 7. WISHLIST
-- =====================================================
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- =====================================================
-- 8. REVIEWS (Users submit, Admin approves)
-- =====================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT[],
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  admin_reply TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 9. BLOGS
-- =====================================================
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 10. COUPONS
-- =====================================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
CREATE INDEX idx_addresses_user ON addresses(user_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read banners" ON hero_banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read published blogs" ON blogs FOR SELECT USING (is_published = true);

-- User policies
CREATE POLICY "Users manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- INITIAL DATA - Categories
-- =====================================================
INSERT INTO categories (name, slug, icon, display_order) VALUES
('All', 'all', 'layers', 1),
('Men', 'men', 'user', 2),
('Women', 'women', 'heart', 3),
('Kids', 'kids', 'smile', 4),
('Sneakers', 'sneakers', 'activity', 5),
('Formal', 'formal', 'briefcase', 6),
('Sandals', 'sandals', 'sun', 7),
('Sports', 'sports', 'target', 8);

-- =====================================================
-- INITIAL DATA - Brands
-- =====================================================
INSERT INTO brands (name, slug, logo_url, display_order) VALUES
('Nike', 'nike', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png', 1),
('Adidas', 'adidas', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png', 2),
('Puma', 'puma', 'https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg', 3),
('Reebok', 'reebok', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Reebok_2019_logo.svg/1200px-Reebok_2019_logo.svg.png', 4),
('New Balance', 'new-balance', 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg', 5);

-- =====================================================
-- INITIAL DATA - Hero Banners
-- =====================================================
INSERT INTO hero_banners (title, subtitle, image_url, display_order) VALUES
('New Collection', 'Summer 2026', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85', 1),
('Just Dropped', 'Fresh Styles', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=85', 2),
('Limited Edition', 'Exclusive Release', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=85', 3);

-- =====================================================
-- INITIAL DATA - Sample Products
-- =====================================================
INSERT INTO products (name, description, price, sale_price, is_on_sale, brand_id, category_id, thumbnail, images, stock, is_featured, is_new_arrival, sku) VALUES
(
  'Nike Air Zoom Pegasus 39',
  'Premium running shoes with responsive cushioning.',
  11495,
  9995,
  true,
  (SELECT id FROM brands WHERE slug = 'nike'),
  (SELECT id FROM categories WHERE slug = 'sneakers'),
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
  50,
  true,
  true,
  'NIKE-AZP39-001'
),
(
  'Adidas Ultraboost Light',
  'Lightest Ultraboost ever with incredible energy return.',
  18999,
  NULL,
  false,
  (SELECT id FROM brands WHERE slug = 'adidas'),
  (SELECT id FROM categories WHERE slug = 'sneakers'),
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80'],
  30,
  true,
  true,
  'ADIDAS-UBL-001'
),
(
  'Puma RS-X',
  'Retro-inspired street style sneakers.',
  8999,
  7499,
  true,
  (SELECT id FROM brands WHERE slug = 'puma'),
  (SELECT id FROM categories WHERE slug = 'sneakers'),
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80'],
  40,
  false,
  true,
  'PUMA-RSX-001'
);

-- =====================================================
-- INITIAL DATA - Sample Coupon
-- =====================================================
INSERT INTO coupons (code, discount_type, discount_value, min_purchase, max_discount, usage_limit, valid_until) VALUES
('WELCOME10', 'percentage', 10, 1000, 500, 100, NOW() + INTERVAL '30 days'),
('FLAT500', 'fixed', 500, 2000, NULL, 50, NOW() + INTERVAL '15 days');

-- =====================================================
-- DONE! Database ready for MATOSHREE Footwear
-- =====================================================
