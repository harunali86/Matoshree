-- =====================================================
-- SEED DATA - Initial Setup
-- =====================================================

-- Insert Categories
INSERT INTO categories (name, slug, icon, display_order, is_active) VALUES
('All', 'all', 'layers', 1, true),
('Men', 'men', 'user', 2, true),
('Women', 'women', 'heart', 3, true),
('Kids', 'kids', 'smile', 4, true),
('Sneakers', 'sneakers', 'activity', 5, true),
('Formal', 'formal', 'briefcase', 6, true),
('Sandals', 'sandals', 'sun', 7, true),
('Flip Flops', 'flip-flops', 'anchor', 8, true);

-- Insert Hero Banners
INSERT INTO hero_banners (title, subtitle, image_url, display_order, is_active) VALUES
('Elite Performance', 'Champion''s Choice', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=85', 1, true),
('Train Like A Pro', 'Premium Footwear', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=85', 2, true),
('Limited Edition', 'Exclusive Collection', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=85', 3, true);

-- Insert Sample Products
INSERT INTO products (name, description, price, category_id, brand, images, colors, sizes, rating, stock, is_featured, is_new_arrival) VALUES
(
  'Nike Air Zoom Pegasus 39',
  'Premium running shoes with responsive cushioning for your daily runs.',
  11495.00,
  (SELECT id FROM categories WHERE slug = 'sneakers'),
  'Nike',
  ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
  '[{"name": "Red", "hex": "#FF0000", "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"]}, {"name": "Black", "hex": "#000000", "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"]}]'::jsonb,
  ARRAY['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
  4.5,
  50,
  true,
  true
),
(
  'Adidas Ultraboost Light',
  'Lightest Ultraboost ever with incredible energy return.',
  18999.00,
  (SELECT id FROM categories WHERE slug = 'sneakers'),
  'Adidas',
  ARRAY['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80'],
  '[{"name": "White", "hex": "#FFFFFF", "images": ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80"]}]'::jsonb,
  ARRAY['UK 6', 'UK 7', 'UK 8', 'UK 9'],
  4.7,
  30,
  true,
  true
),
(
  'Puma Palermo Lth',
  'Classic casual sneakers with leather upper.',
  8999.00,
  (SELECT id FROM categories WHERE slug = 'sneakers'),
  'Puma',
  ARRAY['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80'],
  '[{"name": "Black/White", "hex": "#000000", "images": ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80"]}]'::jsonb,
  ARRAY['UK 7', 'UK 8', 'UK 9', 'UK 10'],
  4.3,
  40,
  false,
  true
);

-- Insert Sample Coupon
INSERT INTO coupons (code, discount_type, discount_value, min_purchase, max_discount, usage_limit, is_active, valid_until) VALUES
('WELCOME10', 'percentage', 10.00, 1000.00, 500.00, 100, true, NOW() + INTERVAL '30 days'),
('FLAT500', 'fixed', 500.00, 2000.00, NULL, 50, true, NOW() + INTERVAL '15 days');
