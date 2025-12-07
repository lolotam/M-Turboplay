import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  CheckCircle, 
  User, 
  MapPin, 

  Package,
  Clock,
  Phone,
  Mail
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  robloxUsername?: string;
}

interface ShippingInfo {
  address: string;
  city: string;
  area: string;
  building?: string;
  floor?: string;
  apartment?: string;
  notes?: string;
}

interface PaymentInfo {
  paymentMethod: "stripe";
  agreeToTerms: boolean;
}

interface OrderReviewStepProps {
  customerData: CustomerInfo | null;
  shippingData: ShippingInfo | null;
  paymentData: PaymentInfo | null;
  onPrev: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const OrderReviewStep = ({
  customerData,
  shippingData,
  onPrev,
  onConfirm,
  isLoading = false
}: OrderReviewStepProps) => {
  const { state } = useCart();


  const hasPhysicalItems = state.items.some(item => !item.isDigital);

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            مراجعة الطلب
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            راجع جميع التفاصيل قبل تأكيد الطلب
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Items */}
          <div>
            <h3 className="font-medium mb-4">المنتجات المطلوبة</h3>
            <div className="space-y-3">
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
                    <div className="text-sm text-muted-foreground">
                      {item.price.toFixed(3)} د.ك للوحدة
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Totals */}
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
                <span>الخصم ({state.promoDiscountType === 'percentage' ? `${state.promoDiscount}%` : `${state.promoDiscount.toFixed(3)} د.ك`})</span>
                <span>-{(state.promoDiscountType === 'percentage' ? (state.subtotal * state.promoDiscount) / 100 : state.promoDiscount).toFixed(3)} د.ك</span>
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

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            معلومات العميل
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customerData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {customerData.firstName} {customerData.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{customerData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{customerData.phone}</span>
              </div>
              {customerData.robloxUsername && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Roblox:</span>
                  <span className="text-sm">{customerData.robloxUsername}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Information */}
      {hasPhysicalItems && shippingData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              عنوان التوصيل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">العنوان:</span> {shippingData.address}
              </p>
              <p className="text-sm">
                <span className="font-medium">المحافظة:</span> {shippingData.city}
              </p>
              <p className="text-sm">
                <span className="font-medium">المنطقة:</span> {shippingData.area}
              </p>
              {(shippingData.building || shippingData.floor || shippingData.apartment) && (
                <p className="text-sm">
                  <span className="font-medium">تفاصيل إضافية:</span>{" "}
                  {[shippingData.building, shippingData.floor, shippingData.apartment]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {shippingData.notes && (
                <p className="text-sm">
                  <span className="font-medium">ملاحظات:</span> {shippingData.notes}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}



      {/* Delivery Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            توقيت التسليم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">المنتجات الرقمية: تسليم فوري بعد الدفع</span>
            </div>
            {hasPhysicalItems && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">المنتجات الفعلية: 1-3 أيام عمل</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">سيتم التواصل معك لتأكيد الطلب</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onPrev}
          disabled={isLoading}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          السابق
        </Button>
        <Button
          size="lg"
          onClick={onConfirm}
          className="bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              جاري المعالجة...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              تأكيد الطلب
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderReviewStep;
