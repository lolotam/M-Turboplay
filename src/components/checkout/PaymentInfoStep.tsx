import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, CreditCard, Shield, Lock } from "lucide-react";

const paymentInfoSchema = z.object({
  paymentMethod: z.enum(["stripe"], {
    required_error: "اختر طريقة الدفع",
  }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "يجب الموافقة على الشروط والأحكام",
  }),
});

type PaymentInfo = z.infer<typeof paymentInfoSchema>;

interface PaymentInfoStepProps {
  onNext: (data: PaymentInfo) => void;
  onPrev: () => void;
  initialData?: PaymentInfo | null;
}

const PaymentInfoStep = ({ onNext, onPrev, initialData }: PaymentInfoStepProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PaymentInfo>({
    resolver: zodResolver(paymentInfoSchema),
    defaultValues: initialData || {
      paymentMethod: "",
      agreeToTerms: false,
    },
    mode: "onChange",
  });

  const selectedPaymentMethod = watch("paymentMethod");
  const agreeToTerms = watch("agreeToTerms");

  const onSubmit = (data: PaymentInfo) => {
    onNext(data);
  };

  const paymentMethods = [
    {
      id: "stripe",
      name: "جميع البطاقات الدولية",
      description: "الدفع عبر جميع البطاقات (Visa, MasterCard, AMEX, KNET)",
      icon: "💳",
      color: "bg-indigo-600",
      gateway: "stripe",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          طريقة الدفع
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          اختر طريقة الدفع المناسبة لك
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Hidden fields for react-hook-form registration */}
          <input type="hidden" {...register("paymentMethod")} />
          <input type="hidden" {...register("agreeToTerms")} />

          {/* Security Notice */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 mb-1">دفع آمن ومشفر</h4>
                <p className="text-sm text-green-700">
                  جميع المعاملات محمية بتشفير SSL 256-bit ولا نحتفظ ببيانات البطاقات
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="text-sm font-medium mb-4 block">
              اختر طريقة الدفع <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={(value) => {
                setValue("paymentMethod", value as any, { shouldValidate: true });
              }}
              className="space-y-3"
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label
                    htmlFor={method.id}
                    className="flex items-center gap-3 cursor-pointer flex-1 p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className={`w-12 h-8 ${method.color} rounded flex items-center justify-center text-white font-bold text-xs`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                      <div className="text-xs text-primary mt-1">
                        {method.gateway === "stripe" ? "Powered by Stripe" : "Powered by Stripe"}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.paymentMethod && (
              <p className="text-sm text-destructive mt-2">{errors.paymentMethod.message}</p>
            )}
          </div>

          {/* Payment Details */}
          {selectedPaymentMethod && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">تفاصيل الدفع</span>
              </div>
              <p className="text-sm text-muted-foreground">
                سيتم توجيهك لصفحة الدفع الآمنة لإدخال بيانات البطاقة بعد تأكيد الطلب
              </p>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => {
                  setValue("agreeToTerms", checked as boolean, { shouldValidate: true });
                }}
              />
              <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed cursor-pointer">
                أوافق على{" "}
                <a href="#" className="text-primary hover:underline">
                  الشروط والأحكام
                </a>{" "}
                و{" "}
                <a href="#" className="text-primary hover:underline">
                  سياسة الخصوصية
                </a>
                <span className="text-destructive"> *</span>
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
            )}
          </div>

          {/* Terms Summary */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">ملخص الشروط المهمة:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• المنتجات الرقمية غير قابلة للإرجاع بعد التحميل</li>
              <li>• المنتجات الفعلية قابلة للإرجاع خلال 7 أيام</li>
              <li>• نلتزم بسياسات Roblox ولا نبيع عناصر داخل اللعبة</li>
              <li>• سيتم التواصل معك لتأكيد الطلب قبل المعالجة</li>
            </ul>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" size="lg" onClick={onPrev}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              السابق
            </Button>
            <Button type="submit" size="lg" disabled={!isValid}>
              مراجعة الطلب
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentInfoStep;
