import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Download,
  Package,
  Clock,
  Phone,
  Mail,
  Home,
  ShoppingBag,
  Star,
  Share2
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useCart, useCartActions } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useCart();
  const { clearCart } = useCartActions();
  const { toast } = useToast();
  const [orderNumber] = useState(() => 
    `GG-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  );

  // Get payment intent from URL params (in real app, verify with backend)
  const paymentIntent = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

  useEffect(() => {
    // Clear the cart after successful payment
    if (paymentIntent) {
      clearCart();
      
      // Show success toast
      toast({
        title: "تم الدفع بنجاح!",
        description: `رقم الطلب: ${orderNumber}`,
      });
    }
  }, [paymentIntent, orderNumber, clearCart, toast]);

  // If no payment intent, redirect to home
  if (!paymentIntent && state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">لا توجد معلومات طلب</h1>
            <p className="text-muted-foreground mb-6">
              لم يتم العثور على معلومات الطلب
            </p>
            <Button size="lg" onClick={() => navigate("/")}>
              العودة للرئيسية
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const digitalItems = state.items.filter(item => item.isDigital);
  const physicalItems = state.items.filter(item => !item.isDigital);

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
                  الرئيسية
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/cart">سلة التسوق</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/checkout">إتمام الطلب</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>تأكيد الدفع</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">تم الدفع بنجاح!</h1>
          <p className="text-lg text-muted-foreground">
            شكراً لك! تم استلام طلبك وسيتم معالجته قريباً
          </p>
          <Badge variant="secondary" className="mt-4 text-lg px-4 py-2">
            رقم الطلب: {orderNumber}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-16 h-16 bg-accent rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.isDigital ? "رقمي" : "منتج فعلي"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          الكمية: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        {(item.price * item.quantity).toFixed(3)} د.ك
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي</span>
                    <span>{state.subtotal.toFixed(3)} د.ك</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>الشحن</span>
                    <span>{state.shippingCost === 0 ? "مجاني" : `${state.shippingCost.toFixed(3)} د.ك`}</span>
                  </div>

                  {state.promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم ({state.promoDiscount}%)</span>
                      <span>-{((state.subtotal * state.promoDiscount) / 100).toFixed(3)} د.ك</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي</span>
                    <span className="text-primary">{state.total.toFixed(3)} د.ك</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Downloads */}
            {digitalItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" />
                    التحميلات الرقمية
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    ستصلك روابط التحميل عبر البريد الإلكتروني خلال دقائق
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {digitalItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">متاح للتحميل</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          تحميل
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Next Steps */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  الخطوات التالية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-green-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">تأكيد الطلب</h4>
                      <p className="text-sm text-muted-foreground">
                        سيتم التواصل معك خلال ساعة لتأكيد تفاصيل الطلب
                      </p>
                    </div>
                  </div>

                  {digitalItems.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-blue-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">المنتجات الرقمية</h4>
                        <p className="text-sm text-muted-foreground">
                          ستصلك روابط التحميل عبر البريد الإلكتروني فوراً
                        </p>
                      </div>
                    </div>
                  )}

                  {physicalItems.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-orange-600">{digitalItems.length > 0 ? '3' : '2'}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">التوصيل</h4>
                        <p className="text-sm text-muted-foreground">
                          سيتم توصيل المنتجات الفعلية خلال 1-3 أيام عمل
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">+965 55683677</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">support@growgardenstore.com</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  لأي استفسارات حول طلبك، لا تتردد في التواصل معنا
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={() => navigate("/")}>
                <Home className="w-4 h-4 mr-2" />
                العودة للرئيسية
              </Button>
              <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/shop")}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                متابعة التسوق
              </Button>
            </div>

            {/* Feedback Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  قيم تجربتك
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  ساعدنا في تحسين خدماتنا من خلال تقييم تجربة التسوق
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate("/contact")}>
                    <Star className="w-4 h-4 mr-2" />
                    اترك تقييم
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'GrowGardenStore',
                        text: 'تسوقت من متجر جروجاردن وكانت تجربة رائعة!',
                        url: window.location.origin
                      });
                    }
                  }}>
                    <Share2 className="w-4 h-4 mr-2" />
                    شارك التجربة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
