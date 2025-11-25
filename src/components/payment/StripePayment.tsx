import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Shield, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

// This would be your actual Stripe publishable key
// For demo purposes, using a test key - replace with your actual key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51234567890abcdef" // Demo key - replace with actual
);

interface PaymentFormProps {
  customerData: any;
  shippingData: any;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm = ({ customerData, shippingData, onSuccess, onError }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { state } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || "حدث خطأ في التحقق من البيانات");
        setIsLoading(false);
        return;
      }

      // In a real application, you would create the PaymentIntent on your server
      // For demo purposes, we'll simulate this
      const paymentIntentResponse = await createPaymentIntent({
        amount: Math.round(state.total * 1000), // Convert to fils (Kuwaiti currency subunit)
        currency: 'kwd',
        customerData,
        shippingData,
        items: state.items,
      });

      if (!paymentIntentResponse.success) {
        throw new Error(paymentIntentResponse.error || "فشل في إنشاء عملية الدفع");
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: paymentIntentResponse.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              name: `${customerData.firstName} ${customerData.lastName}`,
              email: customerData.email,
              phone: customerData.phone,
              address: shippingData ? {
                line1: shippingData.address,
                city: shippingData.area,
                state: shippingData.city,
                country: 'KW',
              } : undefined,
            },
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || "فشل في معالجة الدفع");
        onError(error.message || "فشل في معالجة الدفع");
      } else {
        // Payment succeeded
        toast({
          title: "تم الدفع بنجاح!",
          description: "سيتم توجيهك لصفحة التأكيد",
        });
        onSuccess();
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          تفاصيل الدفع
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          أدخل بيانات البطاقة لإتمام عملية الدفع
        </p>
      </CardHeader>
      <CardContent>
        {/* Security Notice */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">دفع آمن ومشفر</h4>
              <p className="text-sm text-green-700">
                جميع المعاملات محمية بتشفير SSL ولا نحتفظ ببيانات البطاقات
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement 
            options={{
              layout: "tabs",
              defaultValues: {
                billingDetails: {
                  name: customerData ? `${customerData.firstName} ${customerData.lastName}` : '',
                  email: customerData?.email || '',
                  phone: customerData?.phone || '',
                }
              }
            }}
          />

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">المبلغ الإجمالي:</span>
              <span className="text-2xl font-bold text-primary">
                {state.total.toFixed(3)} د.ك
              </span>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={!stripe || !elements || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  ادفع {state.total.toFixed(3)} د.ك
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Create PaymentIntent via backend API
const createPaymentIntent = async (data: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create payment intent');
    }

    return result;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

interface StripePaymentProps {
  customerData: any;
  shippingData: any;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripePayment = ({ customerData, shippingData, onSuccess, onError }: StripePaymentProps) => {
  const { state } = useCart();

  const options = {
    mode: 'payment' as const,
    amount: Math.round(state.total * 1000), // Convert to fils
    currency: 'kwd',
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm 
        customerData={customerData}
        shippingData={shippingData}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePayment;
