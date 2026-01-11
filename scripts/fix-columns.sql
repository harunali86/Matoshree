-- Run this in Supabase SQL Editor to add missing columns

-- Add missing columns to coupons table
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS min_order INTEGER DEFAULT 0;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_discount INTEGER;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Add missing columns to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
