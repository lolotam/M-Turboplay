import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle,
  Shield,
  Truck,
  Clock
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";
import CustomerInfoStep from "@/components/checkout/CustomerInfoStep";
import ShippingInfoStep from "@/components/checkout/ShippingInfoStep";
import PaymentInfoStep from "@/components/checkout/PaymentInfoStep";
import OrderReviewStep from "@/components/checkout/OrderReviewStep";
import CheckoutBreadcrumb from "@/components/checkout/CheckoutBreadcrumb";
import StripePayment from "@/components/payment/StripePayment";

// Validation schemas
const customerInfoSchema = z.object({
  firstName: z.string().min(2, "الاسم الأول مطلوب"),
  lastName: z.string().min(2, "اسم العائلة مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(8, "رقم الهاتف مطلوب"),
  robloxUsername: z.string().optional(),
});

const shippingInfoSchema = z.object({
  address: z.string().min(10, "العنوان مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  area: z.string().min(2, "المنطقة مطلوبة"),
  building: z.string().optional(),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  notes: z.string().optional(),
});

const paymentInfoSchema = z.object({
  paymentMethod: z.enum(["stripe"], {
    required_error: "اختر طريقة الدفع",
  }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "يجب الموافقة على الشروط والأحكام",
  }),
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;
type ShippingInfo = z.infer<typeof shippingInfoSchema>;
type PaymentInfo = z.infer<typeof paymentInfoSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [customerData, setCustomerData] = useState<CustomerInfo | null>(null);
  const [shippingData, setShippingData] = useState<ShippingInfo | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stepTransition, setStepTransition] = useState(false);

  // Check if cart is empty
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">لا يمكن إتمام الطلب</h1>
            <p className="text-muted-foreground mb-6">
              سلة التسوق فارغة. أضف بعض المنتجات أولاً
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

  const steps = [
    { number: 1, title: "معلومات العميل", icon: User },
    { number: 2, title: "عنوان التوصيل", icon: MapPin },
    { number: 3, title: "طريقة الدفع", icon: CreditCard },
    { number: 4, title: "مراجعة الطلب", icon: CheckCircle },
    { number: 5, title: "الدفع", icon: CreditCard },
  ];

  const hasPhysicalItems = state.items.some(item => !item.isDigital);

  // Skip shipping step if no physical items
  const activeSteps = hasPhysicalItems ? steps : steps.filter(step => step.number !== 2);
  const progress = (currentStep / activeSteps.length) * 100;

  const nextStep = async () => {
    setStepTransition(true);

    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));

    if (hasPhysicalItems) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      // Skip step 2 for digital-only orders
      if (currentStep === 1) {
        setCurrentStep(3);
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 5));
      }
    }

    setStepTransition(false);
  };

  const prevStep = async () => {
    setStepTransition(true);

    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));

    if (hasPhysicalItems) {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    } else {
      // Skip step 2 for digital-only orders
      if (currentStep === 3) {
        setCurrentStep(1);
      } else {
        setCurrentStep(prev => Math.max(prev - 1, 1));
      }
    }

    setStepTransition(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <CheckoutBreadcrumb
          currentStep={currentStep}
          hasPhysicalItems={hasPhysicalItems}
          className="mb-8"
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">إتمام الطلب</h1>
          <p className="text-muted-foreground">
            أكمل المعلومات المطلوبة لإتمام طلبك بأمان
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {activeSteps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.number 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Loading overlay during step transitions */}
            {stepTransition && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">جاري التحميل...</p>
                </div>
              </div>
            )}

            <div className={`transition-opacity duration-300 ${stepTransition ? 'opacity-50' : 'opacity-100'}`}>
              {currentStep === 1 && (
                <CustomerInfoStep
                  onNext={async (data) => {
                    setCustomerData(data);
                    await nextStep();
                  }}
                  initialData={customerData}
                />
              )}

              {currentStep === 2 && hasPhysicalItems && (
                <ShippingInfoStep
                  onNext={async (data) => {
                    setShippingData(data);
                    await nextStep();
                  }}
                  onPrev={prevStep}
                  initialData={shippingData}
                />
              )}

              {currentStep === 3 && (
                <PaymentInfoStep
                  onNext={async (data) => {
                    setPaymentData(data);
                    await nextStep();
                  }}
                  onPrev={prevStep}
                  initialData={paymentData}
                />
              )}

              {currentStep === 4 && (
                <OrderReviewStep
                  customerData={customerData}
                  shippingData={shippingData}
                  paymentData={paymentData}
                  onPrev={prevStep}
                  onConfirm={async () => {
                    setIsLoading(true);
                    try {
                      await nextStep(); // Move to payment step
                    } catch (error) {
                      toast({
                        title: "خطأ",
                        description: "حدث خطأ أثناء معالجة الطلب",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  isLoading={isLoading}
                />
              )}

              {currentStep === 5 && (
                <StripePayment
                  customerData={customerData}
                  shippingData={shippingData}
                  onSuccess={() => {
                    toast({
                      title: "تم الدفع بنجاح!",
                      description: "سيتم توجيهك لصفحة التأكيد",
                    });
                    navigate("/payment-success");
                  }}
                  onError={(error: string) => {
                    toast({
                      title: "فشل في الدفع",
                      description: error,
                      variant: "destructive",
                    });
                  }}
                />
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Order Summary Component
const OrderSummary = () => {
  const { state } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>ملخص الطلب</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {state.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-lg overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">الكمية: {item.quantity}</span>
                  <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>المجموع الفرعي</span>
            <span>{formatPrice(state.subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>الشحن</span>
            <span>{state.shippingCost === 0 ? "مجاني" : formatPrice(state.shippingCost)}</span>
          </div>

          {state.promoDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>الخصم ({state.promoDiscount}%)</span>
              <span>-{formatPrice((state.subtotal * state.promoDiscount) / 100)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-bold">
            <span>المجموع الكلي</span>
            <span className="text-primary">{formatPrice(state.total)}</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-green-500" />
            دفع آمن ومشفر
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="w-4 h-4 text-blue-500" />
            توصيل سريع
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4 text-orange-500" />
            دعم 24/7
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Checkout;
