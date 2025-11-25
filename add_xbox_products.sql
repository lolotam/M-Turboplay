-- إضافة 10 منتجات لقسم Xbox
INSERT INTO products (title_ar, title_en, description_ar, description_en, price, original_price, image, is_new, is_limited, is_digital, stock, sku, tags, status) VALUES
('Halo Infinite', 'Halo Infinite', 'عودة ماستر شيف في أحدث إصدار من سلسلة Halo الأسطورية', 'Master Chief returns in latest installment of legendary Halo series', 69.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'XBW-HI', ARRAY['xbox', 'fps', 'sci-fi', 'multiplayer'], 'active'),

('Forza Horizon 5', 'Forza Horizon 5', 'استكشف المكسيك في أفضل لعبة سباقات مفتوحة العالم', 'Explore Mexico in best open-world racing game', 59.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'XBW-FH5', ARRAY['xbox', 'racing', 'open-world', 'cars'], 'active'),

('Fable', 'Fable', 'عودة عالم فابل السحري في إعادة تصور حديثة', 'Return of magical Fable world in modern reimagining', 69.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', true, false, true, 999, 'XBW-FAB', ARRAY['xbox', 'rpg', 'fantasy', 'adventure'], 'active'),

('Starfield', 'Starfield', 'مغامرة فضائية من مطوري Skyrim في أكثر من 1000 كوكب', 'Space adventure from Skyrim developers across 1000+ planets', 69.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'XBW-SF', ARRAY['xbox', 'rpg', 'sci-fi', 'space'], 'active'),

('Gears of War 5', 'Gears of War 5', 'استمرار المعركة ضد Swarm في أحدث إصدار من السلسلة', 'Continue battle against Swarm in latest series installment', 59.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'XBW-GOW5', ARRAY['xbox', 'tps', 'action', 'coop'], 'active'),

('Ori and the Will of the Wisps', 'Ori and the Will of the Wisps', 'مغامرة منصة ساحرة مع أوري في عالم نينتو', 'Magical platformer adventure with Ori in Ninnu world', 29.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'XBW-OTW', ARRAY['xbox', 'platformer', 'indie', 'beautiful'], 'active'),

('Microsoft Flight Simulator', 'Microsoft Flight Simulator', 'محاكي طيران واقعي بالكامل مع العالم بأكمله', 'Complete realistic flight simulator with entire world', 69.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'XBW-MFS', ARRAY['xbox', 'simulation', 'flight', 'realistic'], 'active'),

('Age of Empires IV', 'Age of Empires IV', 'عودة سلسلة استراتيجية الوقت الحقيقي الأسطورية', 'Return of legendary real-time strategy series', 59.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'XBW-AOE4', ARRAY['xbox', 'rts', 'strategy', 'historical'], 'active'),

('Psychonauts 2', 'Psychonauts 2', 'مغامرة نفسية فريدة مع رازوتوتو في عقل الأطفال', 'Unique psychological adventure with Razputin in children''s minds', 39.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'XBW-P2', ARRAY['xbox', 'platformer', 'psychological', 'indie'], 'active'),

('Battlefield 2042', 'Battlefield 2042', 'معارك ضخمة مع 128 لاعب في مستقبل قريب', 'Massive battles with 128 players in near future', 69.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'XBW-BF2042', ARRAY['xbox', 'fps', 'multiplayer', 'military'], 'active');

-- ربط المنتجات بفئة Xbox
INSERT INTO product_categories (product_id, category_id) 
SELECT p.id, c.id 
FROM products p, categories c 
WHERE p.sku IN ('XBW-HI', 'XBW-FH5', 'XBW-FAB', 'XBW-SF', 'XBW-GOW5', 'XBW-OTW', 'XBW-MFS', 'XBW-AOE4', 'XBW-P2', 'XBW-BF2042')
AND c.slug = 'xbox';