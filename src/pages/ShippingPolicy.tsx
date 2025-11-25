import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Truck, Clock, MapPin, Package, CreditCard, Phone, Mail, Calendar } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ShippingPolicy = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6">
            <Truck className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient font-baloo mb-4">
            {isRTL ? 'سياسة الشحن' : 'Shipping Policy'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? 'كل ما تحتاج معرفته عن الشحن والتوصيل لمنتجات متجر جروجارْدن في الكويت'
              : 'Everything you need to know about shipping and delivery for Grow a Garden Store products in Kuwait'
            }
          </p>
          <Badge variant="secondary" className="mt-4">
            <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'آخر تحديث: يناير 2025' : 'Last Updated: January 2025'}
          </Badge>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Shipping Areas */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-6 h-6 text-success" />
                {isRTL ? 'مناطق التوصيل' : 'Delivery Areas'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                    <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {isRTL ? '🇰🇼 داخل الكويت' : '🇰🇼 Within Kuwait'}
                    </h4>
                    <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'جميع المحافظات الكويتية' : 'All Kuwaiti governorates'}</li>
                      <li>• {isRTL ? 'العاصمة، الأحمدي، الفروانية' : 'Capital, Ahmadi, Farwaniya'}</li>
                      <li>• {isRTL ? 'حولي، مبارك الكبير، الجهراء' : 'Hawalli, Mubarak Al-Kabeer, Jahra'}</li>
                      <li>• {isRTL ? 'توصيل سريع خلال 1-3 أيام عمل' : 'Fast delivery within 1-3 business days'}</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-semibold text-primary mb-3">
                      {isRTL ? '🌍 الدول المجاورة' : '🌍 Neighboring Countries'}
                    </h4>
                    <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'السعودية، الإمارات، قطر' : 'Saudi Arabia, UAE, Qatar'}</li>
                      <li>• {isRTL ? 'البحرين، عُمان' : 'Bahrain, Oman'}</li>
                      <li>• {isRTL ? 'توصيل خلال 5-10 أيام عمل' : 'Delivery within 5-10 business days'}</li>
                      <li>• {isRTL ? 'رسوم شحن إضافية تطبق' : 'Additional shipping fees apply'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Types */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Package className="w-6 h-6 text-accent" />
                {isRTL ? 'أنواع الشحن' : 'Shipping Types'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/10">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold text-accent mb-2">
                    {isRTL ? 'الشحن العادي' : 'Standard Shipping'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isRTL ? '2-3 أيام عمل' : '2-3 business days'}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {isRTL ? '2 د.ك' : '2 KD'}
                  </Badge>
                </div>
                
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">
                    {isRTL ? 'الشحن السريع' : 'Express Shipping'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isRTL ? '24-48 ساعة' : '24-48 hours'}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {isRTL ? '5 د.ك' : '5 KD'}
                  </Badge>
                </div>
                
                <div className="text-center p-4 bg-success/5 rounded-lg border border-success/10">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-success" />
                  </div>
                  <h4 className="font-semibold text-success mb-2">
                    {isRTL ? 'الشحن المجاني' : 'Free Shipping'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isRTL ? 'للطلبات فوق 25 د.ك' : 'Orders over 25 KD'}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {isRTL ? 'مجاني' : 'Free'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital vs Physical Products */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CreditCard className="w-6 h-6 text-primary" />
                {isRTL ? 'المنتجات الرقمية والفعلية' : 'Digital vs Physical Products'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      {isRTL ? '📱 المنتجات الرقمية' : '📱 Digital Products'}
                    </h4>
                    <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'تسليم فوري عبر البريد الإلكتروني' : 'Instant delivery via email'}</li>
                      <li>• {isRTL ? 'أدلة PDF وفيديوهات تعليمية' : 'PDF guides and tutorial videos'}</li>
                      <li>• {isRTL ? 'لا توجد رسوم شحن' : 'No shipping fees'}</li>
                      <li>• {isRTL ? 'متاحة 24/7 للتحميل' : 'Available 24/7 for download'}</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h4 className="font-semibold text-accent mb-3 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      {isRTL ? '👕 المنتجات الفعلية' : '👕 Physical Products'}
                    </h4>
                    <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'قمصان وإكسسوارات Grow a Garden' : 'Grow a Garden t-shirts and accessories'}</li>
                      <li>• {isRTL ? 'تغليف آمن ومحمي' : 'Safe and protected packaging'}</li>
                      <li>• {isRTL ? 'تتبع الطلب عبر الرسائل' : 'Order tracking via messages'}</li>
                      <li>• {isRTL ? 'ضمان الجودة والأصالة' : 'Quality and authenticity guarantee'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Process */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-6 h-6 text-success" />
                {isRTL ? 'عملية الشحن' : 'Shipping Process'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-primary-foreground font-bold">
                      1
                    </div>
                    <h4 className="font-semibold text-primary mb-2">
                      {isRTL ? 'تأكيد الطلب' : 'Order Confirmation'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'خلال 30 دقيقة' : 'Within 30 minutes'}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 text-accent-foreground font-bold">
                      2
                    </div>
                    <h4 className="font-semibold text-accent mb-2">
                      {isRTL ? 'التحضير والتغليف' : 'Preparation & Packaging'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? '2-6 ساعات' : '2-6 hours'}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-success/5 rounded-lg border border-success/10">
                    <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center mx-auto mb-3 text-success-foreground font-bold">
                      3
                    </div>
                    <h4 className="font-semibold text-success mb-2">
                      {isRTL ? 'التسليم للشحن' : 'Shipping Handover'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'نفس اليوم' : 'Same day'}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                      4
                    </div>
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                      {isRTL ? 'التوصيل' : 'Delivery'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? '1-3 أيام' : '1-3 days'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                  <h4 className="font-bold text-lg text-foreground mb-4">
                    {isRTL ? '📱 تتبع طلبك' : '📱 Track Your Order'}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        <li>✅ {isRTL ? 'رسائل تأكيد عبر الواتساب' : 'Confirmation messages via WhatsApp'}</li>
                        <li>✅ {isRTL ? 'إشعارات الشحن والتوصيل' : 'Shipping and delivery notifications'}</li>
                        <li>✅ {isRTL ? 'رقم تتبع من شركة الشحن' : 'Tracking number from shipping company'}</li>
                      </ul>
                    </div>
                    <div>
                      <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        <li>📞 {isRTL ? 'دعم عبر الهاتف +965 55683677' : 'Phone support +965 55683677'}</li>
                        <li>💬 {isRTL ? 'دعم فوري عبر الواتساب' : 'Instant WhatsApp support'}</li>
                        <li>📧 {isRTL ? 'تحديثات عبر البريد الإلكتروني' : 'Email updates'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Costs */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CreditCard className="w-6 h-6 text-accent" />
                {isRTL ? 'تكاليف الشحن' : 'Shipping Costs'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className={`p-3 text-left font-semibold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? 'المنطقة' : 'Area'}
                      </th>
                      <th className={`p-3 text-center font-semibold text-foreground`}>
                        {isRTL ? 'الوقت' : 'Time'}
                      </th>
                      <th className={`p-3 text-center font-semibold text-foreground`}>
                        {isRTL ? 'التكلفة' : 'Cost'}
                      </th>
                      <th className={`p-3 text-center font-semibold text-foreground`}>
                        {isRTL ? 'الشحن المجاني' : 'Free Shipping'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? 'الكويت - نفس المحافظة' : 'Kuwait - Same Governorate'}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary">{isRTL ? '1-2 أيام' : '1-2 days'}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-success text-success-foreground">{isRTL ? '1.5 د.ك' : '1.5 KD'}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-primary text-primary-foreground">{isRTL ? 'فوق 20 د.ك' : 'Over 20 KD'}</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? 'الكويت - محافظات أخرى' : 'Kuwait - Other Governorates'}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary">{isRTL ? '2-3 أيام' : '2-3 days'}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-accent text-accent-foreground">{isRTL ? '2.5 د.ك' : '2.5 KD'}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-primary text-primary-foreground">{isRTL ? 'فوق 25 د.ك' : 'Over 25 KD'}</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? 'دول الخليج' : 'GCC Countries'}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary">{isRTL ? '5-10 أيام' : '5-10 days'}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-orange-500 text-white">{isRTL ? '8-15 د.ك' : '8-15 KD'}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-primary text-primary-foreground">{isRTL ? 'فوق 50 د.ك' : 'Over 50 KD'}</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Contact for Shipping */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-6 h-6 text-primary" />
                {isRTL ? 'استفسارات الشحن' : 'Shipping Inquiries'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  {isRTL 
                    ? 'لأي استفسارات حول الشحن أو تتبع الطلبات، تواصل معنا'
                    : 'For any shipping inquiries or order tracking, contact us'
                  }
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" onClick={() => window.location.href = 'mailto:shipping@growgardenstore.com'}>
                    <Mail className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    shipping@growgardenstore.com
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = 'tel:+96555683677'}>
                    <Phone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    +965 55683677
                  </Button>
                </div>
                <Button onClick={() => window.open('https://wa.me/96555683677', '_blank')} className="btn-accent">
                  <Phone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'تتبع طلبك عبر WhatsApp' : 'Track Your Order via WhatsApp'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;