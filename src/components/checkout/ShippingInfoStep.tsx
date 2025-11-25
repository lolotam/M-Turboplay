import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, MapPin, Truck } from "lucide-react";

const shippingInfoSchema = z.object({
  address: z.string().min(10, "العنوان مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  area: z.string().min(2, "المنطقة مطلوبة"),
  building: z.string().optional(),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  notes: z.string().optional(),
});

type ShippingInfo = z.infer<typeof shippingInfoSchema>;

interface ShippingInfoStepProps {
  onNext: (data: ShippingInfo) => void;
  onPrev: () => void;
  initialData?: ShippingInfo | null;
}

const ShippingInfoStep = ({ onNext, onPrev, initialData }: ShippingInfoStepProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ShippingInfo>({
    resolver: zodResolver(shippingInfoSchema),
    defaultValues: initialData || {
      address: "",
      city: "",
      area: "",
      building: "",
      floor: "",
      apartment: "",
      notes: "",
    },
    mode: "onChange",
  });

  const selectedCity = watch("city");

  const kuwaitAreas = {
    "الكويت": ["الشرق", "جبلة", "دسمان", "الصوابر", "الدعية", "كيفان", "الشامية", "الفيحاء"],
    "حولي": ["حولي", "السالمية", "الجابرية", "بيان", "مشرف", "الزهراء", "الشعب"],
    "الفروانية": ["الفروانية", "جليب الشيوخ", "الرقة", "الضجيج", "العمرية", "الفردوس", "اشبيلية"],
    "مبارك الكبير": ["صباح السالم", "المسايل", "القرين", "أبو فطيرة", "الفنطاس", "العدان"],
    "الأحمدي": ["الأحمدي", "الفحيحيل", "المهبولة", "الرقة", "الصباحية", "الخيران", "الوفرة"],
    "الجهراء": ["الجهراء", "الصليبية", "النعايم", "الواحة", "تيماء", "العيون", "كاظمة"]
  };

  const onSubmit = (data: ShippingInfo) => {
    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          عنوان التوصيل
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          أدخل عنوان التوصيل للمنتجات الفعلية
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Shipping Notice */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">معلومات التوصيل</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• التوصيل مجاني داخل الكويت</li>
                  <li>• مدة التوصيل: 1-3 أيام عمل</li>
                  <li>• يتم التواصل معك قبل التوصيل</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-sm font-medium">
              العنوان التفصيلي <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="أدخل العنوان التفصيلي (الشارع، رقم البيت، معالم مميزة)"
              rows={3}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-sm font-medium">
                المحافظة <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedCity}
                onValueChange={(value) => {
                  setValue("city", value);
                  setValue("area", ""); // Reset area when city changes
                }}
              >
                <SelectTrigger className={errors.city ? "border-destructive" : ""}>
                  <SelectValue placeholder="اختر المحافظة" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(kuwaitAreas).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="area" className="text-sm font-medium">
                المنطقة <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("area")}
                onValueChange={(value) => setValue("area", value)}
                disabled={!selectedCity}
              >
                <SelectTrigger className={errors.area ? "border-destructive" : ""}>
                  <SelectValue placeholder="اختر المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCity && kuwaitAreas[selectedCity as keyof typeof kuwaitAreas]?.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.area && (
                <p className="text-sm text-destructive mt-1">{errors.area.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="building" className="text-sm font-medium">
                رقم البناية (اختياري)
              </Label>
              <Input
                id="building"
                {...register("building")}
                placeholder="رقم البناية"
              />
            </div>

            <div>
              <Label htmlFor="floor" className="text-sm font-medium">
                الطابق (اختياري)
              </Label>
              <Input
                id="floor"
                {...register("floor")}
                placeholder="رقم الطابق"
              />
            </div>

            <div>
              <Label htmlFor="apartment" className="text-sm font-medium">
                رقم الشقة (اختياري)
              </Label>
              <Input
                id="apartment"
                {...register("apartment")}
                placeholder="رقم الشقة"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              ملاحظات إضافية (اختياري)
            </Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="أي ملاحظات إضافية لعملية التوصيل"
              rows={2}
            />
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" size="lg" onClick={onPrev}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              السابق
            </Button>
            <Button type="submit" size="lg" disabled={!isValid}>
              التالي
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShippingInfoStep;
