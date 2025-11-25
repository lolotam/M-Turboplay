-- إضافة 10 منتجات لقسم Nintendo
INSERT INTO products (title_ar, title_en, description_ar, description_en, price, original_price, image, is_new, is_limited, is_digital, stock, sku, tags, status) VALUES
('The Legend of Zelda: Tears of the Kingdom', 'The Legend of Zelda: Tears of the Kingdom', 'مغامرة لينك الجديدة في عالم هايرول المفتوح', 'Link''s new adventure in open world of Hyrule', 69.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', true, false, true, 999, 'NSW-ZTOTK', ARRAY['nintendo', 'action', 'adventure', 'open-world'], 'active'),

('Super Mario Odyssey', 'Super Mario Odyssey', 'مغامرة ماريو عبر العوالم مع قبعة كابي', 'Mario adventure across worlds with Cappy hat', 59.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'NSW-SMO', ARRAY['nintendo', 'platformer', 'adventure', 'mario'], 'active'),

('Animal Crossing: New Horizons', 'Animal Crossing: New Horizons', 'ابني جزيرتك الخاصة واجعلها مكاناً رائعاً', 'Build your own island and make it wonderful place', 59.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'NSW-ACNH', ARRAY['nintendo', 'simulation', 'life-sim', 'relaxing'], 'active'),

('Mario Kart 8 Deluxe', 'Mario Kart 8 Deluxe', 'أفضل لعبة سباقات مع ماريو والأصدقاء', 'Best racing game with Mario and friends', 49.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'NSW-MK8D', ARRAY['nintendo', 'racing', 'multiplayer', 'family'], 'active'),

('Super Smash Bros. Ultimate', 'Super Smash Bros. Ultimate', 'معركة الأبطال النهائية مع كل الشخصيات', 'Ultimate battle of heroes with all characters', 59.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'NSW-SSBU', ARRAY['nintendo', 'fighting', 'multiplayer', 'crossover'], 'active'),

('Pokémon Scarlet', 'Pokémon Scarlet', 'ابدأ مغامرة بوكيمون جديدة في منطقة بالديا', 'Start new Pokémon adventure in Paldea region', 59.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'NSW-PKS', ARRAY['nintendo', 'rpg', 'pokemon', 'adventure'], 'active'),

('Metroid Dread', 'Metroid Dread', 'عودة ساموس أران في مغامرة ميترويدفينيا', 'Samus Aran returns in metroidvania adventure', 49.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'NSW-MD', ARRAY['nintendo', 'action', 'adventure', 'sci-fi'], 'active'),

('Splatoon 3', 'Splatoon 3', 'معارك الحبر الملونة مع سبلاتونز', 'Colorful ink battles with Splatoon', 59.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'NSW-S3', ARRAY['nintendo', 'shooter', 'multiplayer', 'colorful'], 'active'),

('Fire Emblem: Three Houses', 'Fire Emblem: Three Houses', 'استراتيجية تكتيكية مع قصة ملحمية', 'Tactical strategy with epic story', 59.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'NSW-FETH', ARRAY['nintendo', 'strategy', 'rpg', 'tactical'], 'active'),

('Luigi''s Mansion 3', 'Luigi''s Mansion 3', 'لويجي يواجه الأشباح في فندق مهجور', 'Luigi faces ghosts in haunted hotel', 49.99, NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', false, false, true, 999, 'NSW-LM3', ARRAY['nintendo', 'action', 'adventure', 'puzzle'], 'active');

-- ربط المنتجات بفئة Nintendo
INSERT INTO product_categories (product_id, category_id) 
SELECT p.id, c.id 
FROM products p, categories c 
WHERE p.sku IN ('NSW-ZTOTK', 'NSW-SMO', 'NSW-ACNH', 'NSW-MK8D', 'NSW-SSBU', 'NSW-PKS', 'NSW-MD', 'NSW-S3', 'NSW-FETH', 'NSW-LM3')
AND c.slug = 'nintendo';