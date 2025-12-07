import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Shield, 
  Truck,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

// Form validation schemas
const customerInfoSchema = z.object({
  firstName: z.string().min(2, "الاسم الأول مطلوب"),
  lastName: z.string().min(2, "اسم العائلة مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(8, "رقم الهاتف مطلوب"),
  address: z.string().min(10, "العنوان مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  notes: z.string().optional(),
});

const orderInfoSchema = z.object({
  paymentMethod: z.enum(["invoice"], {
    required_error: "اختر طريقة الدفع",
  }),
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;
type OrderInfo = z.infer<typeof orderInfoSchema>;

const InvoiceCheckout = () => {
  const { t, i18n } = useTranslation();
  const { state } = useCart();
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState<CustomerInfo | null>(null);
  const [orderData, setOrderData] = useState<OrderInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRTL = i18n.language === 'ar';

  const {
    register: registerCustomer,
    handleSubmit: handleCustomerSubmit,
    formState: { errors: customerErrors },
  } = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      notes: '',
    },
  });

  const {
    register: registerOrder,
    handleSubmit: handleOrderSubmit,
    formState: { errors: orderErrors },
  } = useForm<OrderInfo>({
    resolver: zodResolver(orderInfoSchema),
    defaultValues: {
      paymentMethod: 'invoice',
    },
  });

  const onCustomerSubmit = (data: CustomerInfo) => {
    setCustomerData(data);
    toast({
      title: t('messages.saved'),
      description: t('messages.customerInfoSaved'),
    });
  };

  const onOrderSubmit = async (data: OrderInfo) => {
    if (!customerData) {
      toast({
        title: t('messages.error'),
        description: t('messages.pleaseCompleteCustomerInfo'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data for n8n webhook
      const orderPayload = {
        id: `order_${Date.now()}`,
        customer: customerData,
        items: state.items.map(item => ({
          id: item.id,
          title: item.title,
          titleEn: item.titleEn,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
          isDigital: item.isDigital,
        })),
        subtotal: state.subtotal,
        shippingCost: state.shippingCost,
        total: state.total,
        currency: state.currency,
        createdAt: new Date().toISOString(),
        status: 'pending',
        paymentMethod: data.paymentMethod,
      };

      // Send to n8n webhook (you'll need to configure this URL)
      const webhookUrl = 'https://your-n8n-webhook-url.com/order'; // Replace with actual webhook URL
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': 'Bearer your-n8n-api-key', // Replace with actual API key
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const result = await response.json();
      
      toast({
        title: t('messages.success'),
        description: t('messages.orderSubmitted'),
      });

      // Redirect to success page
      setTimeout(() => {
        window.location.href = '/order-confirmation';
      }, 2000);

    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: t('messages.error'),
        description: t('messages.orderSubmissionError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {isRTL ? 'إتمام الطلب' : 'Complete Your Order'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Customer Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {isRTL ? 'معلومات العميل' : 'Customer Information'}
                </h3>
                
                <form onSubmit={handleCustomerSubmit(onCustomerSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {isRTL ? 'الاسم الأول' : 'First Name'}
                      </Label>
                      <Input
                        id="firstName"
                        {...registerCustomer('firstName')}
                        placeholder={isRTL ? 'أدخل الاسم الأول' : 'Enter first name'}
                        className={isRTL ? 'text-right' : 'text-left'}
                      />
                      {customerErrors.firstName && (
                        <p className="text-sm text-destructive mt-1">
                          {customerErrors.firstName.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {isRTL ? 'اسم العائلة' : 'Last Name'}
                      </Label>
                      <Input
                        id="lastName"
                        {...registerCustomer('lastName')}
                        placeholder={isRTL ? 'أدخل اسم العائلة' : 'Enter last name'}
                        className={isRTL ? 'text-right' : 'text-left'}
                      />
                      {customerErrors.lastName && (
                        <p className="text-sm text-destructive mt-1">
                          {customerErrors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {isRTL ? 'البريد الإلكتروني' : 'Email'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerCustomer('email')}
                        placeholder={isRTL ? 'example@email.com' : 'example@email.com'}
                        className={isRTL ? 'text-right' : 'text-left'}
                      />
                      {customerErrors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {customerErrors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {isRTL ? 'رقم الهاتف' : 'Phone'}
                      </Label>
                      <Input
                        id="phone"
                        {...registerCustomer('phone')}
                        placeholder={isRTL ? '+965 xxxxxxx' : '+965 xxxxxxx'}
                        className={isRTL ? 'text-right' : 'text-left'}
                      />
                      {customerErrors.phone && (
                        <p className="text-sm text-destructive mt-1">
                          {customerErrors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      {isRTL ? 'العنوان' : 'Address'}
                    </Label>
                    <Input
                      id="address"
                      {...registerCustomer('address')}
                      placeholder={isRTL ? 'أدخل العنوان الكامل' : 'Enter full address'}
                      className={isRTL ? 'text-right' : 'text-left'}
                    />
                      {customerErrors.address && (
                        <p className="text-sm text-destructive mt-1">
                          {customerErrors.address.message}
                        </p>
                      )}
                    </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        {isRTL ? 'المدينة' : 'City'}
                      </Label>
                      <Input
                        id="city"
                        {...registerCustomer('city')}
                        placeholder={isRTL ? 'أدخل المدينة' : 'Enter city'}
                        className={isRTL ? 'text-right' : 'text-left'}
                      />
                      {customerErrors.city && (
                        <p className="text-sm text-destructive mt-1">
                          {customerErrors.city.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">
                        {isRTL ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}
                      </Label>
                      <Textarea
                        id="notes"
                        {...registerCustomer('notes')}
                        placeholder={isRTL ? 'أي ملاحظات إضافية؟' : 'Any additional notes?'}
                        rows={3}
                        className={isRTL ? 'text-right' : 'text-left'}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {isRTL ? 'حفظ المعلومات' : 'Save Information'}
                  </Button>
                </form>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                </h3>
                
                {customerData && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">{isRTL ? 'الاسم:' : 'Name:'}</span>
                        <span>{customerData.firstName} {customerData.lastName}</span>
                      </div>
                      <div>
                        <span className="font-medium">{isRTL ? 'البريد:' : 'Email:'}</span>
                        <span>{customerData.email}</span>
                      </div>
                      <div>
                        <span className="font-medium">{isRTL ? 'الهاتف:' : 'Phone:'}</span>
                        <span>{customerData.phone}</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{isRTL ? 'العنوان:' : 'Address:'}</span>
                      <span>{customerData.address}</span>
                    </div>
                    {customerData.city && (
                      <div className="text-sm">
                        <span className="font-medium">{isRTL ? 'المدينة:' : 'City:'}</span>
                        <span>{customerData.city}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Cart Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {isRTL ? 'المنتجات' : 'Cart Items'}
                </h3>
                
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{isRTL ? item.title : item.titleEn}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {isRTL ? 'الكمية:' : 'Quantity:'} {item.quantity}
                          </span>
                          <span className="font-medium">
                            {state.currency === 'SAR' ? 'ر.س' : state.currency} {item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                </h3>
                
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="invoice"
                      value="invoice"
                      {...registerOrder('paymentMethod')}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="invoice" className="flex items-center gap-2 cursor-pointer">
                      <FileText className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{isRTL ? 'دفع بالفاتورة' : 'Invoice Payment'}</div>
                        <div className="text-sm text-muted-foreground">
                          {isRTL ? 'احصل على فاتورة ودفع لاحقاً' : 'Get invoice and pay later'}
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Order Submit Button */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Shield className="w-4 h-4" />
                    <span>{isRTL ? 'طلب آمن ومشفر' : 'Secure & Encrypted Order'}</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleOrderSubmit(onOrderSubmit)}
                  disabled={isSubmitting || !customerData}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-lg font-semibold py-6"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin mr-2" />
                      {isRTL ? 'جاري إرسال الطلب...' : 'Submitting order...'}
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      {isRTL ? 'إرسال الطلب' : 'Submit Order'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCheckout;