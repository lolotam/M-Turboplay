import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, XCircle, CheckCircle, AlertTriangle, Package, Mail, Phone, Calendar } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ReturnPolicy = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6">
            <RotateCcw className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient font-baloo mb-4">
            {isRTL ? 'سياسة الإرجاع والاستبدال' : 'Return & Exchange Policy'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? 'كل ما تحتاج معرفته عن إرجاع واستبدال المنتجات في متجر جروجارْدن'
              : 'Everything you need to know about returning and exchanging products at Grow a Garden Store'
            }
          </p>
          <Badge variant="secondary" className="mt-4">
            <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'آخر تحديث: يناير 2025' : 'Last Updated: January 2025'}
          </Badge>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Digital Products - No Returns */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <XCircle className="w-6 h-6 text-destructive" />
                {isRTL ? 'المنتجات الرقمية - عدم الإرجاع' : 'Digital Products - No Returns'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <h4 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      {isRTL ? '🚫 لا يمكن إرجاعها' : '🚫 Cannot Be Returned'}
                    </h4>
                    <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'أدلة PDF وفيديوهات تعليمية' : 'PDF guides and tutorial videos'}</li>
                      <li>• {isRTL ? 'جلسات الإرشاد الافتراضية' : 'Virtual consultation sessions'}</li>
                      <li>• {isRTL ? 'المحتوى القابل للتحميل' : 'Downloadable content'}</li>
                      <li>• {isRTL ? 'الأكواد والخدمات الفورية' : 'Codes and instant services'}</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-3">
                      {isRTL ? '⚠️ الاستثناء الوحيد' : '⚠️ Only Exception'}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isRTL 
                        ? 'إذا كان هناك عيب أو مشكلة في المنتج من جانب المتجر، يمكن طلب استرداد أو استبدال خلال 24 ساعة من الشراء.'
                        : 'If there is a defect or issue with the product from the store side, you can request a refund or exchange within 24 hours of purchase.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Products - Returnable */}
          <Card className="border-success/20 bg-success/5">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="w-6 h-6 text-success" />
                {isRTL ? 'المنتجات الفعلية - قابلة للإرجاع' : 'Physical Products - Returnable'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {isRTL ? '✅ قابلة للإرجاع' : '✅ Can Be Returned'}
                    </h4>
                    <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'قمصان وملابس Grow a Garden' : 'Grow a Garden t-shirts and clothing'}</li>
                      <li>• {isRTL ? 'إكسسوارات وهدايا' : 'Accessories and gifts'}</li>
                      <li>• {isRTL ? 'منتجات مطبوعة وكتب' : 'Printed products and books'}</li>
                      <li>• {isRTL ? 'ألعاب ومجسمات' : 'Toys and figurines'}</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-semibold text-primary mb-3">
                      {isRTL ? '⏰ مهلة الإرجاع' : '⏰ Return Window'}
                    </h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">3</div>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'أيام من تاريخ الاستلام' : 'days from receipt date'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Conditions */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                {isRTL ? 'شروط الإرجاع' : 'Return Conditions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-success mb-3">
                    {isRTL ? '✅ مقبول للإرجاع' : '✅ Acceptable for Return'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL 
                            ? 'المنتج في حالته الأصلية وغير مستخدم'
                            : 'Product in original condition and unused'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL 
                            ? 'التغليف الأصلي من الشركة المصنعة محفوظ'
                            : 'Original manufacturer packaging preserved'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL 
                            ? 'جميع العلامات والملصقات سليمة'
                            : 'All tags and labels intact'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL 
                            ? 'فاتورة الشراء أو إثبات الطلب'
                            : 'Purchase invoice or order proof'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-destructive mb-3">
                    {isRTL ? '❌ غير مقبول للإرجاع' : '❌ Not Acceptable for Return'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL 
                            ? 'منتجات مستخدمة أو تالفة من العميل'
                            : 'Used or damaged products by customer'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL 
                            ? 'منتجات مخصصة أو مطبوعة حسب الطلب'
                            : 'Customized or print-on-demand products'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL 
                            ? 'منتجات تم غسلها أو تعديلها'
                            : 'Washed or altered products'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL 
                            ? 'طلبات إرجاع بعد 3 أيام'
                            : 'Return requests after 3 days'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Package className="w-6 h-6 text-accent" />
                {isRTL ? 'خطوات الإرجاع' : 'Return Process'}
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
                      {isRTL ? 'تواصل معنا' : 'Contact Us'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'عبر الواتساب أو البريد' : 'Via WhatsApp or Email'}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 text-accent-foreground font-bold">
                      2
                    </div>
                    <h4 className="font-semibold text-accent mb-2">
                      {isRTL ? 'تأكيد الطلب' : 'Confirm Request'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'تحقق من شروط الإرجاع' : 'Verify return conditions'}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-success/5 rounded-lg border border-success/10">
                    <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center mx-auto mb-3 text-success-foreground font-bold">
                      3
                    </div>
                    <h4 className="font-semibold text-success mb-2">
                      {isRTL ? 'إرسال المنتج' : 'Send Product'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'تغليف آمن وشحن' : 'Safe packaging & shipping'}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                      4
                    </div>
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                      {isRTL ? 'الاستلام والاسترداد' : 'Receive & Refund'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? '3-5 أيام عمل' : '3-5 business days'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Costs for Returns */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Package className="w-6 h-6 text-primary" />
                {isRTL ? 'تكاليف شحن الإرجاع' : 'Return Shipping Costs'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/10">
                  <h4 className="font-semibold text-destructive mb-3">
                    {isRTL ? '💸 العميل يتحمل التكلفة' : '💸 Customer Bears Cost'}
                  </h4>
                  <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    <li>• {isRTL ? 'تغيير الرأي أو عدم الرضا' : 'Change of mind or dissatisfaction'}</li>
                    <li>• {isRTL ? 'طلب مقاس أو لون مختلف' : 'Request for different size or color'}</li>
                    <li>• {isRTL ? 'عدم ملائمة المنتج للتوقعات' : 'Product not meeting expectations'}</li>
                    <li>• {isRTL ? 'الإرجاع العادي بدون عيوب' : 'Normal returns without defects'}</li>
                  </ul>
                </div>
                <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                  <h4 className="font-semibold text-success mb-3">
                    {isRTL ? '🏪 المتجر يتحمل التكلفة' : '🏪 Store Bears Cost'}
                  </h4>
                  <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    <li>• {isRTL ? 'عيوب في التصنيع' : 'Manufacturing defects'}</li>
                    <li>• {isRTL ? 'تلف أثناء الشحن' : 'Damage during shipping'}</li>
                    <li>• {isRTL ? 'منتج مختلف عن المطلوب' : 'Wrong product sent'}</li>
                    <li>• {isRTL ? 'خطأ من المتجر' : 'Store error'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Methods */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <RotateCcw className="w-6 h-6 text-accent" />
                {isRTL ? 'طرق الاسترداد' : 'Refund Methods'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-3">
                    {isRTL ? '💳 KNET' : '💳 KNET'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'الاسترداد للبطاقة الأصلية خلال 3-5 أيام عمل' : 'Refund to original card within 3-5 business days'}
                  </p>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/10">
                  <h4 className="font-semibold text-accent mb-3">
                    {isRTL ? '🏦 حوالة بنكية' : '🏦 Bank Transfer'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تحويل مباشر للحساب البنكي خلال 2-3 أيام' : 'Direct transfer to bank account within 2-3 days'}
                  </p>
                </div>
                <div className="text-center p-4 bg-success/5 rounded-lg border border-success/10">
                  <h4 className="font-semibold text-success mb-3">
                    {isRTL ? '💰 رصيد المتجر' : '💰 Store Credit'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'رصيد فوري للاستخدام في المشتريات القادمة' : 'Instant credit for future purchases'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact for Returns */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-6 h-6 text-primary" />
                {isRTL ? 'طلب الإرجاع' : 'Request Return'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  {isRTL 
                    ? 'لطلب إرجاع منتج أو الاستفسار عن حالة الإرجاع'
                    : 'To request a product return or inquire about return status'
                  }
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" onClick={() => window.location.href = 'mailto:returns@growgardenstore.com'}>
                    <Mail className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    returns@growgardenstore.com
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = 'tel:+96555683677'}>
                    <Phone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    +965 55683677
                  </Button>
                </div>
                <Button onClick={() => window.open('https://wa.me/96555683677', '_blank')} className="btn-accent">
                  <Phone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'طلب إرجاع عبر WhatsApp' : 'Request Return via WhatsApp'}
                </Button>
                <div className="pt-4">
                  <p className="text-xs text-muted-foreground">
                    {isRTL 
                      ? 'يرجى تجهيز رقم الطلب وسبب الإرجاع عند التواصل معنا'
                      : 'Please have your order number and reason for return ready when contacting us'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnPolicy;