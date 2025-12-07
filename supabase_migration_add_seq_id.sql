-- Add sequential ID column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS seq_id SERIAL;

-- Create unique index (implicitly created by UNIQUE constraint, but good to be explicit or use constraint)
-- Using a unique constraint to ensure uniqueness
ALTER TABLE products ADD CONSTRAINT products_seq_id_key UNIQUE (seq_id);

-- If there are existing rows, SERIAL will autogenerate for new rows, 
-- but might need to populate for existing if added as nullable first then filled.
-- However, SERIAL implies NOT NULL and auto-population for existing rows in Postgres usually works if done right, 
-- but `ADD COLUMN seq_id SERIAL` effectively does:
-- 1. Create sequence
-- 2. Add column with default nextval(seq)
-- 3. Populate existing rows
-- So existing rows will get IDs.

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_products_seq_id ON products(seq_id);
