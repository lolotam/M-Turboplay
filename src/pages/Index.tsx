import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MainCategories from "@/components/MainCategories";
import DigitalProducts from "@/components/DigitalProducts";
import RankBoosting from "@/components/RankBoosting";
import RobloxSection from "@/components/RobloxSection";
import RocketLeagueSection from "@/components/RocketLeagueSection";
import Footer from "@/components/Footer";
import { useProducts } from "@/contexts/ProductsContext";
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { products } = useProducts();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Filter active products for carousels
  const activeProducts = products.filter(product => product.status === 'active');

  // Sample products for carousels (in real app, this would come from API/context)
  const newGames = activeProducts.slice(0, 10).map(p => ({
    id: p.id,
    title: p.title,
    titleEn: p.titleEn,
    price: typeof p.price === 'number' ? p.price : 299,
    originalPrice: p.originalPrice ? (typeof p.originalPrice === 'number' ? p.originalPrice : 399) : undefined,
    image: p.image,
    category: p.category as "guide" | "physical" | "consultation",
    isNew: p.isNew,
    rating: 4.8,
    discount: p.originalPrice ? Math.round(((typeof p.originalPrice === 'number' ? p.originalPrice : 399) - (typeof p.price === 'number' ? p.price : 299)) / (typeof p.originalPrice === 'number' ? p.originalPrice : 399) * 100) : undefined
  }));

  const bestSellers = activeProducts.slice(5, 15).map(p => ({
    id: p.id,
    title: p.title,
    titleEn: p.titleEn,
    price: typeof p.price === 'number' ? p.price : 199,
    originalPrice: p.originalPrice ? (typeof p.originalPrice === 'number' ? p.originalPrice : 299) : undefined,
    image: p.image,
    category: p.category as "guide" | "physical" | "consultation",
    isNew: p.isNew,
    rating: 4.9,
    discount: p.originalPrice ? Math.round(((typeof p.originalPrice === 'number' ? p.originalPrice : 299) - (typeof p.price === 'number' ? p.price : 199)) / (typeof p.originalPrice === 'number' ? p.originalPrice : 299) * 100) : undefined
  }));

  const specialOffers = activeProducts.slice(2, 12).map(p => ({
    id: p.id,
    title: p.title,
    titleEn: p.titleEn,
    price: typeof p.price === 'number' ? p.price * 0.7 : 209,
    originalPrice: typeof p.price === 'number' ? p.price : 299,
    image: p.image,
    category: p.category as "guide" | "physical" | "consultation",
    isNew: p.isNew,
    rating: 4.7,
    discount: 30
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0A1F] via-[#1A1A2E] to-[#0F0A1F]">
      <Header />
      <main>
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Main Categories */}
        <MainCategories />

        {/* 3. Digital Products */}
        <DigitalProducts />

        {/* 4. Rank Boosting Section */}
        <RankBoosting />

        {/* 5. Roblox Section */}
        <RobloxSection />

        {/* 6. Rocket League Section */}
        <RocketLeagueSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
