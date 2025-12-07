import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component for lazy-loaded routes
const LoadingSpinner = ({ message = "جاري التحميل..." }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

// Lazy load page components to improve initial bundle size
export const LazyIndex = lazy(() => import('../pages/Index'));
export const LazyShop = lazy(() => import('../pages/ShopEnhanced'));
export const LazyAbout = lazy(() => import('../pages/About'));
export const LazyContact = lazy(() => import('../pages/Contact'));
export const LazyFAQ = lazy(() => import('../pages/FAQ'));
export const LazyProductDetail = lazy(() => import('../pages/ProductDetail'));
export const LazyCart = lazy(() => import('../pages/Cart'));
export const LazyCheckout = lazy(() => import('../components/InvoiceCheckout'));
export const LazyPaymentSuccess = lazy(() => import('../pages/PaymentSuccess'));
export const LazyPrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
export const LazyTermsOfService = lazy(() => import('../pages/TermsOfService'));
export const LazyShippingPolicy = lazy(() => import('../pages/ShippingPolicy'));
export const LazyReturnPolicy = lazy(() => import('../pages/ReturnPolicy'));

// Admin components - separate chunk
export const LazyAdminLogin = lazy(() => import('../pages/AdminLogin'));
export const LazyAdminDashboard = lazy(() => import('../pages/AdminDashboard'));
export const LazyAdminCategories = lazy(() => import('../pages/AdminCategories'));
export const LazyAdminProducts = lazy(() => import('../pages/AdminProducts'));
export const LazyAdminProductAdd = lazy(() => import('../pages/AdminProductAdd'));
export const LazyAdminProductEdit = lazy(() => import('../pages/AdminProductEdit'));
export const LazyAdminProductView = lazy(() => import('../pages/AdminProductView'));
export const LazyAdminOrders = lazy(() => import('../pages/AdminOrders'));
export const LazyAdminOrderView = lazy(() => import('../pages/AdminOrderView'));
export const LazyAdminMessages = lazy(() => import('../pages/AdminMessages'));
export const LazyAdminMessageView = lazy(() => import('../pages/AdminMessageView'));
export const LazyAdminDiscountCodes = lazy(() => import('../pages/AdminDiscountCodes'));
export const LazyAdminSettings = lazy(() => import('../pages/AdminSettings'));
export const LazyAdminReports = lazy(() => import('../pages/AdminReports'));
export const LazyAdminAIChat = lazy(() => import('../pages/AdminAIChat'));
export const LazyAdminBuilder = lazy(() => import('../pages/AdminBuilder'));

// Error page
export const LazyNotFound = lazy(() => import('../pages/NotFound'));

// HOC to wrap lazy components with Suspense and error handling
export const withLazyLoading = (
  Component: React.LazyExoticComponent<React.ComponentType<any>>,
  loadingMessage?: string
) => {
  return (props: any) => (
    <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
      <Component {...props} />
    </Suspense>
  );
};

// Pre-configured lazy components with appropriate loading messages
export const IndexPage = withLazyLoading(LazyIndex, "تحميل الصفحة الرئيسية...");
export const ShopPage = withLazyLoading(LazyShop, "تحميل المتجر...");
export const AboutPage = withLazyLoading(LazyAbout, "تحميل صفحة من نحن...");
export const ContactPage = withLazyLoading(LazyContact, "تحميل صفحة اتصل بنا...");
export const FAQPage = withLazyLoading(LazyFAQ, "تحميل الأسئلة الشائعة...");
export const ProductDetailPage = withLazyLoading(LazyProductDetail, "تحميل تفاصيل المنتج...");
export const CartPage = withLazyLoading(LazyCart, "تحميل سلة التسوق...");
export const CheckoutPage = withLazyLoading(LazyCheckout, "تحميل صفحة الدفع...");
export const PaymentSuccessPage = withLazyLoading(LazyPaymentSuccess, "تحميل تأكيد الدفع...");
export const PrivacyPolicyPage = withLazyLoading(LazyPrivacyPolicy, "تحميل سياسة الخصوصية...");
export const TermsOfServicePage = withLazyLoading(LazyTermsOfService, "تحميل الشروط والأحكام...");
export const ShippingPolicyPage = withLazyLoading(LazyShippingPolicy, "تحميل سياسة الشحن...");
export const ReturnPolicyPage = withLazyLoading(LazyReturnPolicy, "تحميل سياسة الإرجاع...");

// Admin pages
export const AdminLoginPage = withLazyLoading(LazyAdminLogin, "تحميل صفحة المدير...");
export const AdminDashboardPage = withLazyLoading(LazyAdminDashboard, "تحميل لوحة التحكم...");
export const AdminCategoriesPage = withLazyLoading(LazyAdminCategories, "تحميل إدارة الفئات...");
export const AdminProductsPage = withLazyLoading(LazyAdminProducts, "تحميل إدارة المنتجات...");
export const AdminProductAddPage = withLazyLoading(LazyAdminProductAdd, "تحميل إضافة منتج...");
export const AdminProductEditPage = withLazyLoading(LazyAdminProductEdit, "تحميل تعديل منتج...");
export const AdminProductViewPage = withLazyLoading(LazyAdminProductView, "تحميل عرض منتج...");
export const AdminOrdersPage = withLazyLoading(LazyAdminOrders, "تحميل إدارة الطلبات...");
export const AdminOrderViewPage = withLazyLoading(LazyAdminOrderView, "تحميل عرض طلب...");
export const AdminMessagesPage = withLazyLoading(LazyAdminMessages, "تحميل الرسائل...");
export const AdminMessageViewPage = withLazyLoading(LazyAdminMessageView, "تحميل عرض رسالة...");
export const AdminDiscountCodesPage = withLazyLoading(LazyAdminDiscountCodes, "تحميل أكواد الخصم...");
export const AdminSettingsPage = withLazyLoading(LazyAdminSettings, "تحميل الإعدادات...");
export const AdminReportsPage = withLazyLoading(LazyAdminReports, "تحميل التقارير...");
export const AdminAIChatPage = withLazyLoading(LazyAdminAIChat, "تحميل مساعد الذكاء الاصطناعي...");
export const AdminBuilderPage = withLazyLoading(LazyAdminBuilder, "تحميل منشئ الصفحات...");

// 404 page
export const NotFoundPage = withLazyLoading(LazyNotFound, "الصفحة غير موجودة");

// Preload critical routes for better UX
export const preloadCriticalRoutes = () => {
  // Preload commonly accessed routes
  LazyShop.preload?.();
  LazyCart.preload?.();
  LazyProductDetail.preload?.();
};

// Preload admin routes when user navigates to admin login
export const preloadAdminRoutes = () => {
  LazyAdminDashboard.preload?.();
  LazyAdminProducts.preload?.();
  LazyAdminOrders.preload?.();
  LazyAdminMessages.preload?.();
};