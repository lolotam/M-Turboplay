import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import NewsletterPopup from "@/components/NewsletterPopup";
import { useNewsletterPopup } from "@/hooks/useNewsletterPopup";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { MessagesProvider } from "@/contexts/MessagesContext";
import { DiscountCodesProvider } from "@/contexts/DiscountCodesContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthCallback from "@/pages/AuthCallback";
import UserProfile from "@/pages/UserProfile";
import AdminUserManagement from "@/pages/AdminUserManagement";
import AdminBuilder from "@/pages/AdminBuilder";
import NewReleases from "@/pages/NewReleases";
import Categories from "@/pages/Categories";
import Deals from "@/pages/Deals";
import PCGames from "@/pages/PCGames";
import PlayStationGames from "@/pages/PlayStationGames";
import XboxGames from "@/pages/XboxGames";
import NintendoGames from "@/pages/NintendoGames";
import MobileGames from "@/pages/MobileGames";
import ActionGames from "@/pages/ActionGames";
import AdventureGames from "@/pages/AdventureGames";
import RPGGames from "@/pages/RPGGames";
import SportsGames from "@/pages/SportsGames";
import StrategyGames from "@/pages/StrategyGames";
import ConsoleGames from "@/pages/ConsoleGames";
import GameAccessories from "@/pages/GameAccessories";
import GiftCards from "@/pages/GiftCards";
import PreOrders from "@/pages/PreOrders";
import RetroGaming from "@/pages/RetroGaming";
import {
  IndexPage,
  ShopPage,
  AboutPage,
  ContactPage,
  FAQPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  PaymentSuccessPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
  ShippingPolicyPage,
  ReturnPolicyPage,
  AdminLoginPage,
  AdminDashboardPage,
  AdminCategoriesPage,
  AdminProductsPage,
  AdminProductAddPage,
  AdminProductEditPage,
  AdminProductViewPage,
  AdminOrdersPage,
  AdminOrderViewPage,
  AdminMessagesPage,
  AdminMessageViewPage,
  AdminDiscountCodesPage,
  AdminSettingsPage,
  AdminReportsPage,
  AdminAIChatPage,
  AdminBuilderPage,
  NotFoundPage,
  preloadCriticalRoutes
} from "@/components/LazyComponents";

const queryClient = new QueryClient();

// Preload critical routes for better performance
setTimeout(preloadCriticalRoutes, 2000);

const AppContent = () => {
  const { isOpen, closePopup } = useNewsletterPopup();

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
          <Route path="/new-releases" element={<NewReleases />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/pc-games" element={<PCGames />} />
          <Route path="/playstation-games" element={<PlayStationGames />} />
          <Route path="/xbox-games" element={<XboxGames />} />
          <Route path="/nintendo-games" element={<NintendoGames />} />
          <Route path="/mobile-games" element={<MobileGames />} />
          <Route path="/action-games" element={<ActionGames />} />
          <Route path="/adventure-games" element={<AdventureGames />} />
          <Route path="/rpg-games" element={<RPGGames />} />
          <Route path="/sports-games" element={<SportsGames />} />
          <Route path="/strategy-games" element={<StrategyGames />} />
          <Route path="/console-games" element={<ConsoleGames />} />
          <Route path="/game-accessories" element={<GameAccessories />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/pre-orders" element={<PreOrders />} />
          <Route path="/retro-gaming" element={<RetroGaming />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminCategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminProductAddPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminProductEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/view/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminProductViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders/view/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminOrderViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminMessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages/view/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminMessageViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/discount-codes"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDiscountCodesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminUserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ai-chat"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminAIChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/builder"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminBuilder />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

      {/* Newsletter Popup */}
      <NewsletterPopup isOpen={isOpen} onClose={closePopup} />
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <ProductsProvider>
            <OrdersProvider>
              <MessagesProvider>
                <DiscountCodesProvider>
                  <CurrencyProvider>
                    <CartProvider>
                      <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <AppContent />
                      </TooltipProvider>
                    </CartProvider>
                  </CurrencyProvider>
                </DiscountCodesProvider>
              </MessagesProvider>
            </OrdersProvider>
          </ProductsProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
