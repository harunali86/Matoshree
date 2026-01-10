-- Create returns table
CREATE TABLE IF NOT EXISTS returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  items JSONB NOT NULL,
  reason TEXT NOT NULL,
  images TEXT[],
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_returns_order_id ON returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_user_id ON returns(user_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON returns(status);

-- RLS Policies
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own returns"
  ON returns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own returns"
  ON returns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own returns"
  ON returns FOR UPDATE
  USING (auth.uid() = user_id);
