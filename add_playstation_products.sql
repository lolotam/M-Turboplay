-- إضافة 10 منتجات لقسم PlayStation
INSERT INTO products (title_ar, title_en, description_ar, description_en, price, original_price, image, is_new, is_limited, is_digital, stock, sku, tags, status) VALUES
('God of War Ragnarök', 'God of War Ragnarök', 'مغامرة كريتوس وأتريوس في عالم الشمال الأسطوري لمواجهة نهاية العالم', 'Kratos and Atreus adventure in Norse mythology world to face the end of the world', 69.99, 79.99, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', true, false, true, 999, 'PSW-GOWR', ARRAY['playstation', 'action', 'adventure', 'norse-mythology'], 'active'),

('Marvel''s Spider-Man 2', 'Marvel''s Spider-Man 2', 'انضم إلى بيتر باركر ومايلز موراليس في معركة ضد الأشرار الخارقين', 'Join Peter Parker and Miles Morales in battle against super villains', 69.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', true, false, true, 999, 'PSW-SM2', ARRAY['playstation', 'superhero', 'action', 'open-world'], 'active'),

('Horizon Forbidden West', 'Horizon Forbidden West', 'استكشف العالم ما بعد الحضارة في مغامرة ألو في الغرب المحرم', 'Explore post-apocalyptic world in Aloy''s adventure in the Forbidden West', 59.99, 69.99, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'PSW-HFW', ARRAY['playstation', 'rpg', 'open-world', 'robots'], 'active'),

('Gran Turismo 7', 'Gran Turismo 7', 'أفضل محاكي سباقات سيارات مع أكثر من 400 سيارة و 90 مسار', 'Best racing simulator with over 400 cars and 90 tracks', 59.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'PSW-GT7', ARRAY['playstation', 'racing', 'simulation', 'cars'], 'active'),

('Ratchet & Clank: Rift Apart', 'Ratchet & Clank: Rift Apart', 'مغامرة بين الأبعاد مع راتشيت وكلانك في عوالم جديدة', 'Dimension-hopping adventure with Ratchet and Clank in new worlds', 49.99, 59.99, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, true, true, 999, 'PSW-RCRA', ARRAY['playstation', 'platformer', 'action', 'adventure'], 'active'),

('Demon''s Souls', 'Demon''s Souls', 'إعادة بناء كلاسيكية FromSoftware في رسوميات مذهلة', 'Rebuilt FromSoftware classic with stunning graphics', 69.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'PSW-DS', ARRAY['playstation', 'rpg', 'dark-fantasy', 'challenging'], 'active'),

('Returnal', 'Returnal', 'تجربة روجلايك نفسية في كوكب غريب مع سيلين', 'Roguelike psychological experience on alien planet with Selene', 49.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'PSW-RET', ARRAY['playstation', 'roguelike', 'sci-fi', 'psychological'], 'active'),

('Astro''s Playroom', 'Astro''s Playroom', 'تجربة مجانية ت showcase قدرات DualSense controller', 'Free experience showcasing DualSense controller capabilities', 0, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'PSW-AP', ARRAY['playstation', 'platformer', 'free', 'family-friendly'], 'active'),

('Sackboy: A Big Adventure', 'Sackboy: A Big Adventure', 'مغامرة جماعية مع ساكبوي في عالم الإبداع', 'Co-op adventure with Sackboy in world of creativity', 39.99, 49.99, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'PSW-SBA', ARRAY['playstation', 'platformer', 'co-op', 'family'], 'active'),

('Death Stranding Director''s Cut', 'Death Stranding Director''s Cut', 'تجربة سام بورترز الفريدة مع محتوى إضافي حصري', 'Sam Porter Bridges unique experience with exclusive additional content', 49.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'PSW-DSDC', ARRAY['playstation', 'action', 'adventure', 'unique'], 'active');

-- ربط المنتجات بفئة PlayStation
INSERT INTO product_categories (product_id, category_id) 
SELECT p.id, c.id 
FROM products p, categories c 
WHERE p.sku IN ('PSW-GOWR', 'PSW-SM2', 'PSW-HFW', 'PSW-GT7', 'PSW-RCRA', 'PSW-DS', 'PSW-RET', 'PSW-AP', 'PSW-SBA', 'PSW-DSDC')
AND c.slug = 'playstation';