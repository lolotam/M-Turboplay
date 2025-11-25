-- إضافة 10 منتجات لقسم PC Games
INSERT INTO products (title_ar, title_en, description_ar, description_en, price, original_price, image, is_new, is_limited, is_digital, stock, sku, tags, status) VALUES
('Cyberpunk 2077', 'Cyberpunk 2077', 'مغامرة تقمص أدوار في مدينة نايت سيتي المستقبلية', 'RPG adventure in futuristic Night City', 59.99, 79.99, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', false, false, true, 999, 'PC-CP2077', ARRAY['pc', 'rpg', 'open-world', 'sci-fi'], 'active'),

('The Witcher 3: Wild Hunt', 'The Witcher 3: Wild Hunt', 'مغامرة جيرالت من ريفيا في عالم فانتازيا واسع', 'Geralt of Rivia adventure in vast fantasy world', 39.99, 59.99, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', false, false, true, 999, 'PC-TW3', ARRAY['pc', 'rpg', 'fantasy', 'open-world'], 'active'),

('Valorant', 'Valorant', 'لعبة تكتيكية من منظور الشخص الأول مع 5 ضد 5', 'Tactical 5v5 first-person shooter game', 0, NULL, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', false, false, true, 999, 'PC-VAL', ARRAY['pc', 'fps', 'tactical', 'free-to-play'], 'active'),

('League of Legends', 'League of Legends', 'أكثر ألعاب MOBA شعبية في العالم', 'Most popular MOBA game in the world', 0, NULL, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', false, false, true, 999, 'PC-LOL', ARRAY['pc', 'moba', 'multiplayer', 'free-to-play'], 'active'),

('Minecraft', 'Minecraft', 'لعبة بناء وإبداع في عالم من المكعبات', 'Building and creativity game in block world', 29.99, NULL, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', false, false, true, 999, 'PC-MC', ARRAY['pc', 'sandbox', 'creative', 'survival'], 'active'),

('Grand Theft Auto V', 'Grand Theft Auto V', 'مغامرة جريمة في لوس سانتوس المفتوحة', 'Crime adventure in open Los Santos', 29.99, 59.99, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', false, false, true, 999, 'PC-GTAV', ARRAY['pc', 'open-world', 'action', 'story'], 'active'),

('Red Dead Redemption 2', 'Red Dead Redemption 2', 'مغامرة آرثر مورغان في الغرب الأمريكي', 'Arthur Morgan adventure in American West', 59.99, 79.99, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', false, false, true, 999, 'PC-RDR2', ARRAY['pc', 'open-world', 'western', 'story'], 'active'),

('Dota 2', 'Dota 2', 'لعبة MOBA استراتيجية مع 5 ضد 5', 'Strategic 5v5 MOBA game', 0, NULL, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', false, false, true, 999, 'PC-DOTA2', ARRAY['pc', 'moba', 'strategy', 'free-to-play'], 'active'),

('Counter-Strike 2', 'Counter-Strike 2', 'أحدث إصدار من سلسلة FPS التكتيكية', 'Latest installment of tactical FPS series', 0, NULL, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', true, false, true, 999, 'PC-CS2', ARRAY['pc', 'fps', 'tactical', 'multiplayer'], 'active'),

('Apex Legends', 'Apex Legends', 'لعبة Battle Royale مع أبطال وقدرات خاصة', 'Battle Royale game with heroes and special abilities', 0, NULL, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', false, false, true, 999, 'PC-APEX', ARRAY['pc', 'battle-royale', 'fps', 'free-to-play'], 'active');

-- ربط المنتجات بفئة PC Games
INSERT INTO product_categories (product_id, category_id) 
SELECT p.id, c.id 
FROM products p, categories c 
WHERE p.sku IN ('PC-CP2077', 'PC-TW3', 'PC-VAL', 'PC-LOL', 'PC-MC', 'PC-GTAV', 'PC-RDR2', 'PC-DOTA2', 'PC-CS2', 'PC-APEX')
AND c.slug = 'pc';