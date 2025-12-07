import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Shield, Truck, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart, useCartActions } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useCart();
  const { updateQuantity, removeItem, applyPromo, removePromo } = useCartActions();
  const [promoCode, setPromoCode] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const isRTL = i18n.language === 'ar';

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast({
      title: "تم حذف المنتج",
      description: "تم إزالة المنتج من السلة بنجاح",
    });
  };

  const applyPromoCode = () => {
    const code = promoCode.toLowerCase();

    // Load discount codes from localStorage (same as admin)
    const savedCodes = localStorage.getItem('admin_discount_codes');
    let discountCodes = [];

    if (savedCodes) {
      discountCodes = JSON.parse(savedCodes);
    } else {
      // Fallback to hardcoded codes if no admin codes exist
      discountCodes = [
        { code: 'garden10', type: 'percentage', value: 10, isActive: true, usageLimit: 100, usedCount: 15 },
        { code: 'mohmd', type: 'fixed', value: 5, isActive: true, usageLimit: 1, usedCount: 0 },
        { code: '10qw', type: 'percentage', value: 50, isActive: true, usageLimit: 50, usedCount: 8 },
        { code: '100x', type: 'percentage', value: 75, isActive: true, usageLimit: 25, usedCount: 3 },
        { code: 'محمد12', type: 'percentage', value: 90, isActive: true, usageLimit: 1, usedCount: 0 },
        { code: 'welcome25', type: 'percentage', value: 25, isActive: true, usageLimit: 1, usedCount: 0 }
      ];
    }

    // Find the discount code
    const foundCode = discountCodes.find(dc => dc.code.toLowerCase() === code && dc.isActive);

    if (foundCode) {
      // Check if usage limit is reached
      if (foundCode.usedCount >= foundCode.usageLimit) {
        toast({
          title: "كود منتهي الصلاحية",
          description: "تم استخدام هذا الكود بالحد الأقصى المسموح",
          variant: "destructive"
        });
        return;
      }

      // Apply the discount
      applyPromo(promoCode, foundCode.value, foundCode.type);

      // Show success message
      const discountText = foundCode.type === 'percentage'
        ? `${foundCode.value}%`
        : `${foundCode.value}.000 د.ك`;

      toast({
        title: "تم تطبيق الكود!",
        description: `حصلت على خصم ${discountText}`,
      });

      // Update usage count in localStorage
      const updatedCodes = discountCodes.map(dc =>
        dc.code.toLowerCase() === code
          ? { ...dc, usedCount: dc.usedCount + 1 }
          : dc
      );
      localStorage.setItem('admin_discount_codes', JSON.stringify(updatedCodes));

    } else {
      toast({
        title: "كود غير صحيح",
        description: "الرجاء التأكد من الكود المدخل",
        variant: "destructive"
      });
    }
  };

  const discountAmount = state.promoDiscountType === 'percentage'
    ? (state.subtotal * state.promoDiscount) / 100
    : state.promoDiscount;

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "أضف بعض المنتجات للمتابعة",
        variant: "destructive"
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: "جاري التوجه للدفع",
        description: "سيتم توجيهك لصفحة إتمام الطلب",
      });

      navigate("/checkout");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التوجه للدفع",
        variant: "destructive"
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">سلة التسوق فارغة</h1>
            <p className="text-muted-foreground mb-6">
              لم تقم بإضافة أي منتجات للسلة بعد
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/shop")}>
                تصفح المنتجات
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/")}>
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  {isRTL ? 'الرئيسية' : 'Home'}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isRTL ? 'سلة التسوق' : 'Shopping Cart'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">سلة التسوق</h1>
          <p className="text-muted-foreground">
            لديك {state.items.length} منتج في السلة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-accent rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <Badge variant="outline" className="mt-1">
                            {item.badge}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">الكمية:</span>
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-accent"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 border-x min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-accent"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} للوحدة
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Promo Code */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">كود الخصم</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="أدخل كود الخصم"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyPromoCode}>
                    تطبيق
                  </Button>
                </div>
                {state.promoDiscount > 0 && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ تم تطبيق خصم {state.promoDiscountType === 'percentage' ? `${state.promoDiscount}%` : `${state.promoDiscount.toFixed(3)} د.ك`}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(state.subtotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span>الشحن</span>
                  <span>{state.shippingCost === 0 ? "مجاني" : formatPrice(state.shippingCost)}</span>
                </div>

                {/* Discount */}
                {state.promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم ({state.promoDiscountType === 'percentage' ? `${state.promoDiscount}%` : formatPrice(state.promoDiscount)})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>المجموع الكلي</span>
                  <span className="text-primary">{formatPrice(state.total)}</span>
                </div>

                {/* Checkout Button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || state.items.length === 0}
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      إتمام الطلب
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate("/shop")}>
            متابعة التسوق
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;