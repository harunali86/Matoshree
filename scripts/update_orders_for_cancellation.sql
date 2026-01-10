-- Add cancellation fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS refund_status TEXT CHECK (refund_status IN ('pending', 'processing', 'completed'));

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Update RLS policies to allow users to update their own orders (for cancellation)
CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);
