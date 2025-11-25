-- Migration: Add missing columns to products table
-- Run this in Supabase SQL Editor: https://kifkhuesoiconjckvwdj.supabase.co/project/_/sql

-- Add 'image' column if it doesn't exist (for single main image)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image'
  ) THEN
    ALTER TABLE products ADD COLUMN image TEXT;

    -- Set image to first element of images array for existing products
    UPDATE products SET image = images[1] WHERE images IS NOT NULL AND array_length(images, 1) > 0;

    COMMENT ON COLUMN products.image IS 'Main product image (derived from images[0])';
  END IF;
END $$;

-- Add 'is_digital' column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_digital'
  ) THEN
    ALTER TABLE products ADD COLUMN is_digital BOOLEAN DEFAULT true;

    -- Set is_digital based on category for existing products
    UPDATE products SET is_digital = true WHERE category IN ('guide', 'consultation');
    UPDATE products SET is_digital = false WHERE category IN ('physical', 'tshirts');

    COMMENT ON COLUMN products.is_digital IS 'Whether product is digital (no shipping required)';
  END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
