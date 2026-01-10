-- Hero Banners Table
-- This table will store all hero banner images and content
-- Admin panel will use this to add/edit/delete hero banners

CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Shop Now',
  cta_link TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_hero_banners_active ON hero_banners(is_active, display_order);

-- Insert initial data (your current hero banners)
INSERT INTO hero_banners (title, subtitle, image_url, display_order, is_active) VALUES
('Elite Performance', 'Champion''s Choice', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=85', 1, true),
('Train Like A Pro', 'Premium Footwear', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=85', 2, true),
('Limited Edition', 'Exclusive Collection', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=85', 3, true);

-- Enable Row Level Security
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active hero banners
CREATE POLICY "Public can view active hero banners"
ON hero_banners
FOR SELECT
USING (is_active = true);

-- Policy: Only authenticated admins can insert/update/delete
CREATE POLICY "Admins can manage hero banners"
ON hero_banners
FOR ALL
USING (
  auth.role() = 'authenticated' 
  AND 
  auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  )
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_banners_updated_at BEFORE UPDATE ON hero_banners
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
