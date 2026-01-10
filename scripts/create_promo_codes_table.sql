-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
  discount_value DECIMAL NOT NULL,
  min_order_value DECIMAL,
  max_discount DECIMAL,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert some sample promo codes
INSERT INTO promo_codes (code, discount_type, discount_value, min_order_value, max_discount, valid_until, usage_limit, active) VALUES
('WELCOME10', 'percentage', 10, 999, 500, NOW() + INTERVAL '30 days', 1000, true),
('SAVE20', 'percentage', 20, 1999, 1000, NOW() + INTERVAL '30 days', 500, true),
('FLAT200', 'fixed', 200, 1499, NULL, NOW() + INTERVAL '30 days', 500, true),
('FIRSTBUY', 'percentage', 15, 799, 300, NOW() + INTERVAL '30 days', 1000, true);

-- Create promo_code_usage table
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID REFERENCES promo_codes,
  user_id UUID REFERENCES auth.users,
  order_id UUID,
  discount_amount DECIMAL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active promo codes"
  ON promo_codes FOR SELECT
  USING (active = true);
