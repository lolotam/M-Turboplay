// Centralized product data to eliminate duplication and ensure consistency
import petsGuideImage from "@/assets/pets-guide-cover.jpg";
import queenBeeShirtImage from "@/assets/queen-bee-tshirt.jpg";
import consultationImage from "@/assets/consultation-session.jpg";
import stickerPackImage from "@/assets/sticker-pack.jpg";

export interface ProductData {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'guide' | 'physical' | 'consultation' | 'tshirts' | 'pc-games' | 'playstation-games' | 'xbox-games' | 'nintendo-games' | 'mobile-games' | 'game-accessories' | 'gift-cards';
  rating?: number;
  isNew?: boolean;
  isLimited?: boolean;
  isDigital: boolean;
  stock?: number;
  sku?: string;
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  badge?: string;
}

// Centralized product data source
export const PRODUCTS_DATA: ProductData[] = [
  {
    id: '1',
    title: 'دليل الحيوانات الشامل',
    titleEn: 'Complete Pets Guide',
    description: 'دليل شامل لجميع الحيوانات في Grow a Garden مع أفضل الاستراتيجيات والنصائح',
    descriptionEn: 'Complete guide for all pets in Grow a Garden with best strategies and tips',
    price: 3.50,
    originalPrice: 5.00,
    image: petsGuideImage,
    category: 'guide',
    rating: 4.9,
    isNew: true,
    isDigital: true,
    stock: 999,
    sku: 'PG-001',
    tags: ['pets', 'guide', 'strategy'],
    status: 'active',
    badge: 'جديد'
  },
  {
    id: '2',
    title: 'تيشيرت Queen Bee',
    titleEn: 'Queen Bee T-Shirt',
    description: 'تيشيرت مريح بتصميم ملكة النحل من لعبة Grow a Garden',
    descriptionEn: 'Comfortable t-shirt with Queen Bee design from Grow a Garden',
    price: 12.75,
    image: queenBeeShirtImage,
    category: 'physical',
    rating: 4.7,
    isDigital: false,
    stock: 25,
    sku: 'TS-QB-001',
    tags: ['clothing', 'queen bee', 'merchandise'],
    status: 'active'
  },
  {
    id: '3',
    title: 'جلسة إرشادية شخصية',
    titleEn: 'Personal Consultation Session',
    description: 'جلسة إرشادية مدتها 30 دقيقة لتحسين استراتيجيتك في اللعبة',
    descriptionEn: '30-minute consultation session to improve your game strategy',
    price: 18.00,
    image: consultationImage,
    category: 'consultation',
    rating: 5.0,
    isLimited: true,
    isDigital: true,
    stock: 10,
    sku: 'CS-001',
    tags: ['consultation', 'strategy', 'personal'],
    status: 'active',
    badge: 'محدود'
  },
  {
    id: '4',
    title: 'خارطة الفعاليات الحالية',
    titleEn: 'Current Events Map',
    description: 'خارطة شاملة للفعاليات الحالية: Fairy Event و Crystal Beams',
    descriptionEn: 'Comprehensive map for current events: Fairy Event and Crystal Beams',
    price: 2.25,
    originalPrice: 3.50,
    image: petsGuideImage,
    category: 'guide',
    rating: 4.8,
    isDigital: true,
    stock: 999,
    sku: 'EM-001',
    tags: ['events', 'map', 'fairy', 'crystal'],
    status: 'active'
  },
  {
    id: '5',
    title: 'ملصقات حيوانات المزرعة',
    titleEn: 'Farm Animals Sticker Pack',
    description: 'مجموعة ملصقات عالية الجودة لحيوانات Grow a Garden المفضلة لديك',
    descriptionEn: 'High-quality sticker pack of your favorite Grow a Garden farm animals',
    price: 4.50,
    image: stickerPackImage,
    category: 'physical',
    rating: 4.6,
    isNew: true,
    isDigital: false,
    stock: 50,
    sku: 'SP-FA-001',
    tags: ['stickers', 'farm animals', 'collectible'],
    status: 'active',
    badge: 'جديد'
  },
  {
    id: '6',
    title: 'دليل بناء المزرعة المثالية',
    titleEn: 'Perfect Farm Building Guide',
    description: 'تعلم كيفية تصميم وبناء المزرعة المثالية مع أفضل التخطيطات',
    descriptionEn: 'Learn how to design and build the perfect farm with optimal layouts',
    price: 4.00,
    image: petsGuideImage,
    category: 'guide',
    rating: 4.9,
    isDigital: true,
    stock: 999,
    sku: 'FG-001',
    tags: ['farming', 'building', 'layout', 'optimization'],
    status: 'active'
  },
  {
    id: '7',
    title: 'Cyberpunk 2077',
    titleEn: 'Cyberpunk 2077',
    description: 'لعبة عالم مفتوح ومغامرات تقمص أدوار تدور أحداثها في مدينة نايت سيتي.',
    descriptionEn: 'An open-world, action-adventure RPG set in the megalopolis of Night City.',
    price: 59.99,
    image: '/src/assets/consultation-session.jpg',
    category: 'pc-games',
    rating: 4.5,
    isDigital: true,
    stock: 999,
    sku: 'PCG-CP2077',
    tags: ['pc', 'rpg', 'open-world', 'sci-fi'],
    status: 'active'
  },
  {
    id: '8',
    title: 'The Last of Us Part II',
    titleEn: 'The Last of Us Part II',
    description: 'لعبة مغامرات وأكشن تدور أحداثها بعد خمس سنوات من أحداث الجزء الأول.',
    descriptionEn: 'An action-adventure game set five years after the events of The Last of Us.',
    price: 49.99,
    image: '/src/assets/consultation-session.jpg',
    category: 'playstation-games',
    rating: 4.8,
    isDigital: true,
    stock: 999,
    sku: 'PSG-TLOU2',
    tags: ['playstation', 'action', 'adventure', 'story-rich'],
    status: 'active'
  },
  {
    id: '9',
    title: 'Halo Infinite',
    titleEn: 'Halo Infinite',
    description: 'لعبة إطلاق نار من منظور الشخص الأول تدور أحداثها في عالم Halo.',
    descriptionEn: 'A first-person shooter set in the Halo universe.',
    price: 59.99,
    image: '/src/assets/consultation-session.jpg',
    category: 'xbox-games',
    rating: 4.6,
    isDigital: true,
    stock: 999,
    sku: 'XBG-HI',
    tags: ['xbox', 'fps', 'sci-fi', 'multiplayer'],
    status: 'active'
  },
  {
    id: '10',
    title: 'The Legend of Zelda: Breath of the Wild',
    titleEn: 'The Legend of Zelda: Breath of the Wild',
    description: 'لعبة مغامرات وعالم مفتوح تدور أحداثها في مملكة هايرول.',
    descriptionEn: 'An open-world action-adventure game set in the kingdom of Hyrule.',
    price: 59.99,
    image: '/src/assets/consultation-session.jpg',
    category: 'nintendo-games',
    rating: 4.9,
    isDigital: true,
    stock: 999,
    sku: 'NG-ZBOTW',
    tags: ['nintendo', 'action', 'adventure', 'open-world'],
    status: 'active'
  },
  {
    id: '11',
    title: 'Genshin Impact',
    titleEn: 'Genshin Impact',
    description: 'لعبة تقمص أدوار وعالم مفتوح مجانية.',
    descriptionEn: 'A free-to-play open-world action RPG.',
    price: 0,
    image: '/src/assets/consultation-session.jpg',
    category: 'mobile-games',
    rating: 4.7,
    isDigital: true,
    stock: 999,
    sku: 'MG-GI',
    tags: ['mobile', 'rpg', 'open-world', 'free-to-play'],
    status: 'active'
  },
  {
    id: '12',
    title: 'وحدة تحكم لاسلكية DualSense',
    titleEn: 'DualSense Wireless Controller',
    description: 'وحدة تحكم لاسلكية لجهاز PlayStation 5.',
    descriptionEn: 'A wireless controller for the PlayStation 5.',
    price: 69.99,
    image: '/src/assets/consultation-session.jpg',
    category: 'game-accessories',
    rating: 4.8,
    isDigital: false,
    stock: 100,
    sku: 'GA-DSWC',
    tags: ['playstation', 'controller', 'accessory'],
    status: 'active'
  },
  {
    id: '13',
    title: 'بطاقة هدايا Steam بقيمة 50 دولارًا',
    titleEn: '$50 Steam Gift Card',
    description: 'بطاقة هدايا بقيمة 50 دولارًا لمنصة Steam.',
    descriptionEn: 'A $50 gift card for the Steam platform.',
    price: 50.00,
    image: '/src/assets/consultation-session.jpg',
    category: 'gift-cards',
    rating: 5.0,
    isDigital: true,
    stock: 999,
    sku: 'GC-STEAM50',
    tags: ['gift-card', 'steam', 'pc'],
    status: 'active'
  }
];

// Helper functions
export const getProductById = (id: string): ProductData | undefined => {
  return PRODUCTS_DATA.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): ProductData[] => {
  if (category === 'all') return PRODUCTS_DATA;
  return PRODUCTS_DATA.filter(product => product.category === category);
};

export const searchProducts = (query: string): ProductData[] => {
  if (!query.trim()) return PRODUCTS_DATA;
  
  const searchTerm = query.toLowerCase();
  return PRODUCTS_DATA.filter(product => 
    product.title.toLowerCase().includes(searchTerm) ||
    product.titleEn.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.descriptionEn.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const filterProductsByPrice = (products: ProductData[], priceRange: string): ProductData[] => {
  switch (priceRange) {
    case 'low':
      return products.filter(p => p.price < 10);
    case 'medium':
      return products.filter(p => p.price >= 10 && p.price < 20);
    case 'high':
      return products.filter(p => p.price >= 20);
    default:
      return products;
  }
};