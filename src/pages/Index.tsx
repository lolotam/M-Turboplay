import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SecondaryPromotionalBanner from "@/components/SecondaryPromotionalBanner";
import GameCategories from "@/components/GameCategories";
import ProductCarousel from "@/components/ProductCarousel";
import ProductGridEnhanced from "@/components/ProductGridEnhanced";
import DynamicSectionsManager from "@/components/DynamicSectionsManager";
import FeaturedBrands from "@/components/FeaturedBrands";
import PlatformSections from "@/components/PlatformSections";
import CommunityContent from "@/components/CommunityContent";
import DeliveryInfo from "@/components/DeliveryInfo";
import CustomerTestimonials from "@/components/CustomerTestimonials";
import NewsletterSignup from "@/components/NewsletterSignup";
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
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* 1. Hero Banner Section */}
        <HeroSection />

        {/* 2. Secondary Promotional Banner */}
        <SecondaryPromotionalBanner />

        {/* 3. Shop by Categories */}
        <GameCategories />

        {/* 4. Product Carousels */}
        <ProductCarousel
          title="جديد في الألعاب"
          titleEn="New in Gaming"
          products={newGames}
          badge={isRTL ? "جديد" : "New"}
          badgeColor="bg-[#10B981]"
          viewAllLink="/new-releases"
        />

        <ProductCarousel
          title="الأكثر مبيعاً"
          titleEn="Best Sellers"
          products={bestSellers}
          badge={isRTL ? "الأكثر شعبية" : "Most Popular"}
          badgeColor="bg-[#F59E0B]"
          viewAllLink="/best-sellers"
        />

        <ProductCarousel
          title="عروض خاصة"
          titleEn="Special Offers"
          products={specialOffers}
          badge={isRTL ? "خصومات" : "Sale"}
          badgeColor="bg-[#E935C1]"
          viewAllLink="/deals"
        />

        {/* 5. Enhanced Products Grid */}
        <ProductGridEnhanced />

        {/* 6. Dynamic Sections Management */}
        <DynamicSectionsManager />

        {/* 7. Featured Brands Section */}
        <FeaturedBrands />

        {/* 7. Platform-Specific Sections */}
        <PlatformSections />

        {/* 8. Community & Content Section */}
        <CommunityContent />

        {/* 9. Enhanced Payment & Delivery Info */}
        <DeliveryInfo />

        {/* 10. Customer Reviews/Testimonials */}
        <CustomerTestimonials />

        {/* 11. Newsletter Signup */}
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
