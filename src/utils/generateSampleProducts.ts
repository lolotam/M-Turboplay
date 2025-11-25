export interface SampleProduct {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  sku: string;
  stock: number;
  isNew: boolean;
  isLimited: boolean;
  status: 'active' | 'inactive' | 'draft';
  tags: string;
  images: string;
  isDigital: boolean;
  weight?: number;
  dimensions?: string;
  releaseDate?: string;
  compatibility?: string;
}

const categories = [
  'guide', 'physical', 'consultation', 'tshirts',
  'playstation', 'xbox', 'nintendo', 'pc', 'mobile', 'accessories'
];

const productTemplates = {
  playstation: {
    names: [
      'لعبة Spider-Man 2', 'لعبة God of War Ragnarok', 'لعبة The Last of Us Part II',
      'لعبة Horizon Forbidden West', 'لعبة Gran Turismo 7', 'لعبة Ratchet & Clank',
      'لعبة Ghost of Tsushima', 'لعبة Death Stranding', 'لعبة Bloodborne',
      'لعبة Uncharted: Legacy of Thieves'
    ],
    namesEn: [
      'Spider-Man 2', 'God of War Ragnarok', 'The Last of Us Part II',
      'Horizon Forbidden West', 'Gran Turismo 7', 'Ratchet & Clank',
      'Ghost of Tsushima', 'Death Stranding', 'Bloodborne',
      'Uncharted: Legacy of Thieves Collection'
    ],
    descriptions: [
      'مغامرة بطولية في مدينة نيويورك مع الرجل العنكبوت في أحدث إصدارات بلايستيشن',
      'ملحمة نورسية مذهلة مع كرياتوس وأتريوس في عالم الآلهة الاسكندنافية',
      'قصة نهاية العالم المؤثرة في عالم ما بعد الكارثة مع إيلي وجويل',
      'استكشف عالم ما بعد الكارثة في مغامرة مذهلة مليئة بالآلات والأسرار',
      'تجربة سباقات واقعية مع أكثر من 400 سيارة في بيئات متنوعة',
      'مغامرة فضائية مرحة مع راتشيت وكلانك في عالم مليء بالمفاجآت',
      'رحلة ساموراي في اليابان الإقطاعية مع قتال سيوف مذهل',
      'مغامرة توصيل في عالم محطم مليء بالألغاز والمخاطر',
      'لعبة أكشن RPG في عالم قوطي مليء بالوحوش والأسرار',
      'مجموعة أفضل مغامرات ناثان دريك في جولة حول العالم'
    ],
    descriptionsEn: [
      'Heroic adventure in New York City with Spider-Man in the latest PlayStation release',
      'Epic Norse saga with Kratos and Atreus in the world of Scandinavian gods',
      'Touching post-apocalyptic story in a devastated world with Ellie and Joel',
      'Explore a post-apocalyptic world in a stunning adventure full of machines and secrets',
      'Realistic racing experience with over 400 cars in diverse environments',
      'Fun space adventure with Ratchet and Clank in a world full of surprises',
      'Samurai journey in feudal Japan with amazing sword combat',
      'Delivery adventure in a broken world full of puzzles and dangers',
      'Action RPG game in a gothic world full of monsters and secrets',
      'Collection of Nathan Drake\'s best adventures around the world'
    ],
    subcategories: ['PS5', 'PS4', 'PS Plus', 'Exclusive'],
    compatibility: 'PlayStation 4, PlayStation 5',
    tags: ['action', 'adventure', 'exclusive', 'sony', 'ps5', 'ps4']
  },
  xbox: {
    names: [
      'لعبة Halo Infinite', 'لعبة Forza Horizon 5', 'لعبة Gears 5',
      'لعبة Sea of Thieves', 'لعبة Microsoft Flight Simulator', 'لعبة Ori',
      'لعبة Cuphead', 'لعبة Grounded', 'لعبة Psychonauts 2',
      'لعبة Tell Me Why'
    ],
    namesEn: [
      'Halo Infinite', 'Forza Horizon 5', 'Gears 5',
      'Sea of Thieves', 'Microsoft Flight Simulator', 'Ori and the Will of the Wisps',
      'Cuphead', 'Grounded', 'Psychonauts 2',
      'Tell Me Why'
    ],
    descriptions: [
      'عودة ماستر شيف في أحدث إصدارات هالو مع معارك فضائية مذهلة',
      'سباقات مفتوحة العالم في المكسيك مع أكثر من 500 سيارة',
      'إطلاق نار تعاوني في عالم ما بعد الكارثة مع فريق دلتا',
      'مغامرة بحرية مع الأصدقاء في بحر مليء بالكنوز والمخاطر',
      'محاكي طيران واقعي يغطي كامل كوكب الأرض',
      'منصة فنية مذهلة مع أوري في عالم سحري مليء بالألغاز',
      'لعبة إطلاق نار كلاسيكية برسم يدوي في عالم كرتوني',
      'مغامرة البقاء في حديقة خلفية عملاقة مليئة بالحشرات',
      'مغامرة نفسية في عقول الآخرين مع راي وفريقه',
      'قصة تفاعلية مؤثرة عن الاختيار والحرية الشخصية'
    ],
    descriptionsEn: [
      'Master Chief returns in the latest Halo with amazing space battles',
      'Open-world racing in Mexico with over 500 cars',
      'Cooperative shooting in a post-apocalyptic world with Delta Squad',
      'Pirate adventure with friends in a sea full of treasures and dangers',
      'Realistic flight simulator covering the entire planet Earth',
      'Artistic platformer with Ori in a magical world full of puzzles',
      'Classic hand-drawn shooting game in a cartoon world',
      'Survival adventure in a giant backyard full of insects',
      'Psychological adventure in other people\'s minds with Raz and his team',
      'Touching interactive story about choice and personal freedom'
    ],
    subcategories: ['Xbox Series X', 'Xbox One', 'Game Pass', 'Exclusive'],
    compatibility: 'Xbox One, Xbox Series X/S',
    tags: ['action', 'racing', 'shooter', 'microsoft', 'xbox', 'gamepass']
  },
  nintendo: {
    names: [
      'لعبة The Legend of Zelda', 'لعبة Super Mario Odyssey', 'لعبة Animal Crossing',
      'لعبة Splatoon 3', 'لعبة Mario Kart 8', 'لعبة Fire Emblem',
      'لعبة Kirby', 'لعبة Pokémon', 'لعبة Metroid Dread',
      'لعبة Super Smash Bros'
    ],
    namesEn: [
      'The Legend of Zelda: Tears of the Kingdom', 'Super Mario Odyssey', 'Animal Crossing: New Horizons',
      'Splatoon 3', 'Mario Kart 8 Deluxe', 'Fire Emblem: Three Houses',
      'Kirby and the Forgotten Land', 'Pokémon Scarlet', 'Metroid Dread',
      'Super Smash Bros. Ultimate'
    ],
    descriptions: [
      'مغامرة زيلدا الجديدة في عالم هيروول الشاسع مع قدرات جديدة',
      'مغامرة ماريو حول العالم في رحلة لإنقاذ الأميرة بيتش',
      'بناء حياة مثالية في جزيرة مهجورة مع الحيوانات',
      'معارك طلاء ملونة في مدن مستقبلية مع الأصدقاء',
      'سباقات ماريو المجنونة مع 48 حلبة وشخصيات متنوعة',
      'لعبة أدوار تكتيكية في عالم الفاير إمبليم',
      'مغامرة كيربي في عالم مهجور مليء بالمفاجآت',
      'مغامرة بوكيمون في منطقة بالديا الجديدة',
      'عودة ساموس في ميترويد ثنائية الأبعاد الكلاسيكية',
      'قتال بين كل شخصيات نينتندو في ساحات متنوعة'
    ],
    descriptionsEn: [
      'New Zelda adventure in the vast world of Hyrule with new abilities',
      'Mario adventure around the world on a journey to save Princess Peach',
      'Build a perfect life on a deserted island with animals',
      'Colorful paint battles in futuristic cities with friends',
      'Crazy Mario racing with 48 tracks and diverse characters',
      'Tactical role-playing game in the Fire Emblem world',
      'Kirby adventure in an abandoned world full of surprises',
      'Pokémon adventure in the new Paldea region',
      'Samus returns in classic 2D Metroid style',
      'Fighting between all Nintendo characters in diverse arenas'
    ],
    subcategories: ['Switch', 'Switch OLED', 'Nintendo Online', 'Family'],
    compatibility: 'Nintendo Switch, Nintendo Switch OLED',
    tags: ['adventure', 'platform', 'family', 'nintendo', 'switch', 'fun']
  },
  pc: {
    names: [
      'لعبة Cyberpunk 2077', 'لعبة The Witcher 3', 'لعبة Elden Ring',
      'لعبة Red Dead Redemption 2', 'لعبة GTA V', 'لعبة FIFA 24',
      'لعبة Call of Duty', 'لعبة Valorant', 'لعبة League of Legends',
      'لعبة Among Us'
    ],
    namesEn: [
      'Cyberpunk 2077', 'The Witcher 3: Wild Hunt', 'Elden Ring',
      'Red Dead Redemption 2', 'Grand Theft Auto V', 'EA Sports FC 24',
      'Call of Duty: Modern Warfare III', 'Valorant', 'League of Legends',
      'Among Us'
    ],
    descriptions: [
      'مغامرة في مدينة نايت سيتي المستقبلية مع خيارات لا حصر لها',
      'مغامرة جيرالت أوف ريفيا في عالم مليء بالوحوش والسحر',
      'لعبة أدوار في عالم مفتوح مليء بالأسرار والزعماء',
      'مغامرة في الغرب الأمريكي مع آرثر مورغان',
      'عالم مفتوح في لوس سانتوس ولوس أنجلوس',
      'تجربة كرة قدم واقعية مع أفضل اللاعبين في العالم',
      'إطلاق نار حديث في ساحات قتال متنوعة',
      'لعبة تكتيكية 5 ضد 5 في عالم المستقبل',
      'لعبة MOBA مع مئات الأبطال والخرائط',
      'لعبة اجتماعية مع الأصدقاء في مهمة فضائية'
    ],
    descriptionsEn: [
      'Adventure in the futuristic Night City with unlimited choices',
      'Geralt of Rivia\'s adventure in a world full of monsters and magic',
      'Role-playing game in an open world full of secrets and bosses',
      'Adventure in the American West with Arthur Morgan',
      'Open world in Los Santos and Los Angeles',
      'Realistic football experience with the world\'s best players',
      'Modern shooting in diverse combat arenas',
      'Tactical 5v5 game in a futuristic world',
      'MOBA game with hundreds of heroes and maps',
      'Social game with friends on a space mission'
    ],
    subcategories: ['Steam', 'Epic Games', 'Battle.net', 'Origin'],
    compatibility: 'Windows 10/11, 64-bit',
    tags: ['rpg', 'open-world', 'steam', 'epic', 'pc', 'gaming']
  },
  mobile: {
    names: [
      'لعبة PUBG Mobile', 'لعبة Free Fire', 'لعبة Mobile Legends',
      'لعبة Clash of Clans', 'لعبة Brawl Stars', 'لعبة Roblox',
      'لعبة Among Us', 'لعبة Candy Crush', 'لعبة Subway Surfers',
      'لعبة Temple Run'
    ],
    namesEn: [
      'PUBG Mobile', 'Free Fire', 'Mobile Legends: Bang Bang',
      'Clash of Clans', 'Brawl Stars', 'Roblox',
      'Among Us', 'Candy Crush Saga', 'Subway Surfers',
      'Temple Run 2'
    ],
    descriptions: [
      'لعبة البقاء الأكثر شعبية على الموبايل مع 100 لاعب',
      'معارك البقاء السريعة في جزيرة مهجورة',
      'لعبة MOBA على الموبايل مع الأبطال الخارقين',
      'بناء قريتك والدفاع عنها من الأعداء',
      'قتال جماعي في ساحات متنوعة',
      'عالم افتراضي لا حدود له للإبداع',
      'لعبة الخداع الاجتماعية مع الأصدقاء',
      'مغامرة حلويات ملونة ومسلية',
      'ركض لا نهاية له في مترو الأنفاق',
      'ركض في المعابد القديمة من المخاطر'
    ],
    descriptionsEn: [
      'The most popular survival game on mobile with 100 players',
      'Fast survival battles on a deserted island',
      'MOBA game on mobile with superheroes',
      'Build your village and defend it from enemies',
      'Team fighting in diverse arenas',
      'Unlimited virtual world for creativity',
      'Social deception game with friends',
      'Colorful and fun candy adventure',
      'Endless running in subway tunnels',
      'Running in ancient temples from dangers'
    ],
    subcategories: ['Android', 'iOS', 'Battle Royale', 'Casual'],
    compatibility: 'Android 8+, iOS 12+',
    tags: ['mobile', 'battle-royale', 'moba', 'casual', 'multiplayer']
  },
  accessories: {
    names: [
      'يد تحكم دوال سينس', 'سماعة الألعاب اللاسلكية', 'كيبورد الألعاب الميكانيكي',
      'ماوس الألعاب الضوئي', 'حصيرة الماوس الكبيرة', 'كاميرا البث المباشر',
      'ميكروفون الاستوديو', 'شاشة الألعاب المنحنية', 'كرسي الألعاب المريح',
      'إضاءة RGB للغرفة'
    ],
    namesEn: [
      'DualSense Controller', 'Wireless Gaming Headset', 'Mechanical Gaming Keyboard',
      'Optical Gaming Mouse', 'Large Mouse Pad', 'Live Streaming Camera',
      'Studio Microphone', 'Curved Gaming Monitor', 'Comfortable Gaming Chair',
      'RGB Room Lighting'
    ],
    descriptions: [
      'يد التحكم الرسمية لبلايستيشن 5 مع تقنيات haptic feedback',
      'سماعة لاسلكية مع صوت محيطي 7.1 وميكروفون قابل للإزالة',
      'كيبورد ميكانيكي مع إضاءة RGB ومفاتيح brown switch',
      'ماوس ضوئي مع 16000 DPI وأزرار قابلة للبرمجة',
      'حصيرة ماوس كبيرة 900x400mm مع سطح محكم السيطرة',
      'كاميرا 1080p 60fps للبث المباشر على تويتش ويوتيوب',
      'ميكروفون احترافي مع فلترة الضوضاء وذراع قابل للطي',
      'شاشة منحنية 27 إنش 144Hz مع تقنية FreeSync',
      'كرسي ألعاب مريح مع دعم قطني ومساج',
      'إضاءة RGB ذكية مع التحكم عبر التطبيق'
    ],
    descriptionsEn: [
      'Official PlayStation 5 controller with haptic feedback technology',
      'Wireless headset with 7.1 surround sound and removable microphone',
      'Mechanical keyboard with RGB lighting and brown switches',
      'Optical mouse with 16000 DPI and programmable buttons',
      'Large mouse pad 900x400mm with control surface',
      '1080p 60fps camera for live streaming on Twitch and YouTube',
      'Professional microphone with noise filtering and foldable arm',
      '27-inch curved monitor 144Hz with FreeSync technology',
      'Comfortable gaming chair with lumbar support and massage',
      'Smart RGB lighting with app control'
    ],
    subcategories: ['Controllers', 'Headsets', 'Keyboards', 'Mice', 'Monitors', 'Chairs'],
    compatibility: 'PC, PlayStation, Xbox, Nintendo Switch',
    tags: ['accessories', 'gaming', 'rgb', 'peripheral', 'quality']
  },
  guide: {
    names: [
      'دليل المبتدئين في الألعاب', 'دليل بناء الحاسوب', 'دليل اختيار الإكسسوارات',
      'دليل الألعاب الإستراتيجية', 'دليل الألعاب الرياضية', 'دليل الألعاب المغامرات',
      'دليل البث المباشر', 'دليل تحسين الأداء', 'دليل الألعاب متعددة اللاعبين',
      'دليل الألعاب المستقلة'
    ],
    namesEn: [
      'Beginners Guide to Gaming', 'PC Building Guide', 'Accessories Selection Guide',
      'Strategy Games Guide', 'Sports Games Guide', 'Adventure Games Guide',
      'Live Streaming Guide', 'Performance Optimization Guide', 'Multiplayer Games Guide',
      'Indie Games Guide'
    ],
    descriptions: [
      'دليل شامل للمبتدئين في عالم الألعاب مع نصائح وإرشادات أساسية',
      'كيفية بناء حاسوب ألعاب قوي خطوة بخطوة مع شرح المكونات',
      'دليل اختيار أفضل الإكسسوارات حسب احتياجاتك وميزانيتك',
      'تعلم أساسيات واستراتيجيات الألعاب الإستراتيجية المختلفة',
      'دليل شامل لألعاب كرة القدم والرياضات المتنوعة',
      'اكتشف أفضل مغامرات الألعاب مع قصص مشوقة وألغاز',
      'كيفية البث المباشر على يوتيوب وتويتش باحترافية',
      'تحسين أداء الألعاب وإعدادات الجرافيكس لأفضل تجربة',
      'دليل الألعاب الجماعية والتنافسية مع الأصدقاء',
      'اكتشف أفضل الألعاب المستقلة والمطورين الجدد'
    ],
    descriptionsEn: [
      'Comprehensive guide for beginners in the gaming world with tips and basic instructions',
      'How to build a powerful gaming PC step by step with component explanations',
      'Guide to choosing the best accessories according to your needs and budget',
      'Learn the basics and strategies of different strategy games',
      'Comprehensive guide to football and various sports games',
      'Discover the best game adventures with engaging stories and puzzles',
      'How to stream live on YouTube and Twitch professionally',
      'Optimize game performance and graphics settings for the best experience',
      'Guide to team and competitive games with friends',
      'Discover the best indie games and new developers'
    ],
    subcategories: ['Beginner', 'Advanced', 'Hardware', 'Software'],
    compatibility: 'All platforms',
    tags: ['guide', 'tutorial', 'beginner', 'tips', 'learning']
  },
  physical: {
    names: [
      'مجموعة الألعاب المتنوعة', 'أدوات التنظيف الخاصة', 'حامل الشاشة المعدني',
      'مروحة التبريد', 'كابلات HDMI عالية الجودة', 'محول الطاقة',
      'حقيبة حمل الألعاب', 'ستاند السماعات', 'منظم الكابلات',
      'شاحن اللاسلكي'
    ],
    namesEn: [
      'Diverse Gaming Collection', 'Special Cleaning Tools', 'Metal Monitor Stand',
      'Cooling Fan', 'High Quality HDMI Cables', 'Power Adapter',
      'Gaming Carrying Case', 'Headphone Stand', 'Cable Organizer',
      'Wireless Charger'
    ],
    descriptions: [
      'مجموعة متنوعة من الأدوات والإكسسوارات المفيدة للاعبين',
      'أدوات تنظيف خاصة للإلكترونيات والأجهزة الحساسة',
      'حامل شاشة معدني قابل للتعديل مع إدارة الكابلات',
      'مروحة تبريد قوية لأجهزة الألعاب والحواسيب',
      'كابلات HDMI 2.1 عالية السرعة مع دعم 4K و8K',
      'محول طاقة متعدد المنافذ مع حماية من التيار الزائد',
      'حقيبة حمل مقاومة للصدمات مع مساحة تخزين كبيرة',
      'ستاند سماعات معدني مع إدارة الكابلات',
      'منظم كابلات ذكي مع لاصقات قوية ومرونة عالية',
      'شاحن لاسلكي سريع مع دعم الشحن السريع'
    ],
    descriptionsEn: [
      'Diverse collection of useful tools and accessories for gamers',
      'Special cleaning tools for electronics and sensitive devices',
      'Adjustable metal monitor stand with cable management',
      'Powerful cooling fan for gaming devices and computers',
      'High-speed HDMI 2.1 cables with 4K and 8K support',
      'Multi-port power adapter with overload protection',
      'Shock-resistant carrying case with large storage space',
      'Metal headphone stand with cable management',
      'Smart cable organizer with strong adhesives and high flexibility',
      'Fast wireless charger with fast charging support'
    ],
    subcategories: ['Tools', 'Cleaning', 'Storage', 'Power'],
    compatibility: 'Universal compatibility',
    tags: ['physical', 'accessories', 'tools', 'maintenance', 'organization']
  },
  consultation: {
    names: [
      'جلسة استشارية في الألعاب', 'تدريب على البث المباشر', 'استشارة بناء الحاسوب',
      'تدريب على الألعاب التنافسية', 'جلسة تحسين الأداء', 'استشارة اختيار الألعاب',
      'تدريب على الإعدادات', 'جلسة الألعاب العائلية', 'استشارة الأمان الرقمي',
      'تدريب على التصميم'
    ],
    namesEn: [
      'Gaming Consultation Session', 'Live Streaming Training', 'PC Building Consultation',
      'Competitive Gaming Training', 'Performance Optimization Session', 'Game Selection Consultation',
      'Settings Training Session', 'Family Gaming Session', 'Digital Security Consultation',
      'Design Training Session'
    ],
    descriptions: [
      'جلسة استشارية شخصية مع خبير الألعاب لمناقشة احتياجاتك',
      'تعلم كيفية البث المباشر باحترافية على المنصات المختلفة',
      'استشارة متخصصة في بناء حاسوب ألعاب يناسب ميزانيتك',
      'تدريب مكثف على الألعاب التنافسية وتحسين المهارات',
      'جلسة تحسين أداء الألعاب والحصول على أفضل إعدادات',
      'مساعدتك في اختيار الألعاب المناسبة لاهتماماتك',
      'تعلم كيفية إعداد الألعاب والحصول على أفضل تجربة',
      'جلسة خاصة للعائلات لتعلم الألعاب المناسبة للجميع',
      'حماية حساباتك وحماية خصوصيتك في عالم الألعاب',
      'تعلم أساسيات التصميم والإبداع في الألعاب'
    ],
    descriptionsEn: [
      'Personal consultation session with a gaming expert to discuss your needs',
      'Learn how to stream live professionally on different platforms',
      'Specialized consultation in building a gaming PC that fits your budget',
      'Intensive training in competitive games and skill improvement',
      'Session to optimize game performance and get the best settings',
      'Help you choose games suitable for your interests',
      'Learn how to set up games and get the best experience',
      'Special session for families to learn games suitable for everyone',
      'Protect your accounts and privacy in the gaming world',
      'Learn the basics of design and creativity in games'
    ],
    subcategories: ['Personal', 'Training', 'Technical', 'Family'],
    compatibility: 'All platforms and devices',
    tags: ['consultation', 'training', 'expert', 'personal', 'guidance']
  },
  tshirts: {
    names: [
      'تيشيرت PlayStation', 'تيشيرت Xbox', 'تيشيرت Nintendo',
      'تيشيرت Gaming Life', 'تيشيرت Level Up', 'تيشيرت Game Over',
      'تيشيرت PC Master Race', 'تيشيرت Console Wars', 'تيشيرت Retro Gaming',
      'تيشيرت E-Sports'
    ],
    namesEn: [
      'PlayStation T-Shirt', 'Xbox T-Shirt', 'Nintendo T-Shirt',
      'Gaming Life T-Shirt', 'Level Up T-Shirt', 'Game Over T-Shirt',
      'PC Master Race T-Shirt', 'Console Wars T-Shirt', 'Retro Gaming T-Shirt',
      'E-Sports T-Shirt'
    ],
    descriptions: [
      'تيشيرت رسمي بلايستيشن مع شعار الشركة وجودة عالية',
      'تيشيرت إكس بوكس مع تصميم عصري وجودة ممتازة',
      'تيشيرت نينتندو مع شخصيات ماريو والتصميم الكلاسيكي',
      'تيشيرت gaming life لمحبي الألعاب والحياة الرقمية',
      'تيشيرت level up للاعبين الذين يحبون التحدي',
      'تيشيرت game over للنهايات المثيرة في الألعاب',
      'تيشيرت pc master race لحاسوب الألعاب الأقوى',
      'تيشيرت console wars لمحبي المنافسة بين المنصات',
      'تيشيرت retro gaming لمحبي الألعاب الكلاسيكية',
      'تيشيرت e-sports لمحبي الرياضة الإلكترونية'
    ],
    descriptionsEn: [
      'Official PlayStation t-shirt with company logo and high quality',
      'Xbox t-shirt with modern design and excellent quality',
      'Nintendo t-shirt with Mario characters and classic design',
      'Gaming life t-shirt for gaming and digital life enthusiasts',
      'Level up t-shirt for players who love challenges',
      'Game over t-shirt for exciting endings in games',
      'PC master race t-shirt for the most powerful gaming PC',
      'Console wars t-shirt for platform competition enthusiasts',
      'Retro gaming t-shirt for classic game enthusiasts',
      'E-sports t-shirt for electronic sports enthusiasts'
    ],
    subcategories: ['Official', 'Gaming', 'Retro', 'Sports'],
    compatibility: 'Universal fit',
    tags: ['clothing', 'tshirt', 'gaming', 'style', 'fashion']
  }
};

export const generateSampleProducts = (): SampleProduct[] => {
  const products: SampleProduct[] = [];
  let productId = 1;

  categories.forEach((category, categoryIndex) => {
    const template = productTemplates[category as keyof typeof productTemplates];
    if (!template) return;

    // Generate 10 products per category
    for (let i = 0; i < 10; i++) {
      const productTemplate = template;
      const nameIndex = i % productTemplate.names.length;
      const isOnSale = Math.random() > 0.7; // 30% chance of being on sale
      const isNewProduct = Math.random() > 0.6; // 40% chance of being new
      const isLimitedEdition = Math.random() > 0.8; // 20% chance of being limited

      // Base prices in KWD
      const basePrice = category === 'guide' || category === 'consultation' ? 15 + Math.random() * 35 :
                       category === 'tshirts' ? 8 + Math.random() * 12 :
                       category === 'accessories' ? 25 + Math.random() * 75 :
                       20 + Math.random() * 40;

      const price = Math.round(basePrice * 100) / 100;
      const originalPrice = isOnSale ? Math.round(price * (1.2 + Math.random() * 0.4) * 100) / 100 : undefined;

      // Stock logic
      const stock = ['guide', 'consultation', 'playstation', 'xbox', 'nintendo', 'pc', 'mobile'].includes(category) ? 999 :
                   Math.floor(Math.random() * 500) + 1;

      // Images (placeholder URLs)
      const imageCount = Math.floor(Math.random() * 3) + 1;
      const images = Array.from({ length: imageCount }, (_, imgIndex) =>
        `https://picsum.photos/400/600?random=${productId * 10 + imgIndex}`
      );

      const product: SampleProduct = {
        title: productTemplate.names[nameIndex],
        titleEn: productTemplate.namesEn[nameIndex],
        description: productTemplate.descriptions[nameIndex],
        descriptionEn: productTemplate.descriptionsEn[nameIndex],
        price,
        originalPrice,
        category,
        subcategory: productTemplate.subcategories[Math.floor(Math.random() * productTemplate.subcategories.length)],
        sku: `MT${String(productId).padStart(4, '0')}`,
        stock,
        isNew: isNewProduct,
        isLimited: isLimitedEdition,
        status: 'active',
        tags: productTemplate.tags.slice(0, 3 + Math.floor(Math.random() * 3)).join(','),
        images: images.join(','),
        isDigital: !['physical', 'tshirts', 'accessories'].includes(category),
        weight: ['physical', 'tshirts', 'accessories'].includes(category) ? Math.round((0.1 + Math.random() * 2) * 100) / 100 : undefined,
        dimensions: ['physical', 'tshirts', 'accessories'].includes(category) ?
          `${Math.floor(Math.random() * 30) + 10}x${Math.floor(Math.random() * 20) + 5}x${Math.floor(Math.random() * 15) + 3}cm` : undefined,
        releaseDate: category === 'preorders' ? new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        compatibility: productTemplate.compatibility
      };

      products.push(product);
      productId++;
    }
  });

  return products;
};

export const generateCSVFromProducts = (products: SampleProduct[]): string => {
  const headers = [
    'title', 'titleEn', 'description', 'descriptionEn',
    'price', 'originalPrice', 'category', 'subcategory',
    'sku', 'stock', 'isNew', 'isLimited', 'status',
    'tags', 'images', 'isDigital', 'weight', 'dimensions',
    'releaseDate', 'compatibility'
  ];

  const csvRows = [headers.join(',')];

  products.forEach(product => {
    const row = [
      `"${product.title}"`,
      `"${product.titleEn}"`,
      `"${product.description}"`,
      `"${product.descriptionEn}"`,
      product.price,
      product.originalPrice || '',
      product.category,
      product.subcategory || '',
      product.sku,
      product.stock,
      product.isNew,
      product.isLimited,
      product.status,
      `"${product.tags}"`,
      `"${product.images}"`,
      product.isDigital,
      product.weight || '',
      product.dimensions || '',
      product.releaseDate || '',
      product.compatibility || ''
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};