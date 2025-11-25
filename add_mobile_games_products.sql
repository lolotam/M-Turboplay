-- إضافة 10 منتجات لقسم Mobile Games
INSERT INTO products (title_ar, title_en, description_ar, description_en, price, original_price, image, is_new, is_limited, is_digital, stock, sku, tags, status) VALUES
('Genshin Impact', 'Genshin Impact', 'لعبة تقمص أدوات وعالم مفتوح مجانية', 'Free-to-play open-world action RPG', 0, NULL, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', false, false, true, 999, 'MOB-GI', ARRAY['mobile', 'rpg', 'open-world', 'free-to-play'], 'active'),

('PUBG Mobile', 'PUBG Mobile', 'لعبة Battle Royale مع 100 لاعب', 'Battle Royale game with 100 players', 0, NULL, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', false, false, true, 999, 'MOB-PUBG', ARRAY['mobile', 'battle-royale', 'fps', 'free-to-play'], 'active'),

('Call of Duty: Mobile', 'Call of Duty: Mobile', 'تجربة COD الكلاسيكية على الجوال', 'Classic COD experience on mobile', 0, NULL, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', false, false, true, 999, 'MOB-CODM', ARRAY['mobile', 'fps', 'multiplayer', 'free-to-play'], 'active'),

('Among Us', 'Among Us', 'لعبة اجتماعية مع مهام وخيانة في الفضاء', 'Social game with tasks and betrayal in space', 4.99, NULL, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', false, false, true, 999, 'MOB-AU', ARRAY['mobile', 'social', 'multiplayer', 'indie'], 'active'),

('Clash Royale', 'Clash Royale', 'لعبة استراتيجية وقت حقيقي مع أبطال كلش أوف كلانز', 'Real-time strategy game with Clash of Clans heroes', 0, NULL, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', false, false, true, 999, 'MOB-CR', ARRAY['mobile', 'strategy', 'multiplayer', 'free-to-play'], 'active'),

('Minecraft Mobile', 'Minecraft Mobile', 'نسخة محمولة من لعبة البناء الشهيرة', 'Mobile version of famous building game', 6.99, NULL, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', false, false, true, 999, 'MOB-MC', ARRAY['mobile', 'sandbox', 'creative', 'survival'], 'active'),

('Pokémon GO', 'Pokémon GO', 'اصطد بوكيمون في العالم الحقيقي', 'Catch Pokémon in real world', 0, NULL, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', false, false, true, 999, 'MOB-PGO', ARRAY['mobile', 'ar', 'pokemon', 'free-to-play'], 'active'),

('Mobile Legends: Bang Bang', 'Mobile Legends: Bang Bang', 'لعبة MOBA شعبية على الجوال', 'Popular MOBA game on mobile', 0, NULL, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', false, false, true, 999, 'MOB-MLBB', ARRAY['mobile', 'moba', 'multiplayer', 'free-to-play'], 'active'),

('Garena Free Fire', 'Garena Free Fire', 'لعبة Battle Royale سريعة على الجوال', 'Fast mobile Battle Royale game', 0, NULL, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', false, false, true, 999, 'MOB-FF', ARRAY['mobile', 'battle-royale', 'fps', 'free-to-play'], 'active'),

('Brawl Stars', 'Brawl Stars', 'لعبة متعددة اللاعبين من Supercell', 'Multiplayer game from Supercell', 0, NULL, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', false, false, true, 999, 'MOB-BS', ARRAY['mobile', 'multiplayer', 'action', 'free-to-play'], 'active');

-- ربط المنتجات بفئة Mobile Games
INSERT INTO product_categories (product_id, category_id) 
SELECT p.id, c.id 
FROM products p, categories c 
WHERE p.sku IN ('MOB-GI', 'MOB-PUBG', 'MOB-CODM', 'MOB-AU', 'MOB-CR', 'MOB-MC', 'MOB-PGO', 'MOB-MLBB', 'MOB-FF', 'MOB-BS')
AND c.slug = 'mobile';