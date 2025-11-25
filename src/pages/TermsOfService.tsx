import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Scale, AlertTriangle, CheckCircle, XCircle, Mail, Phone, Calendar } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6">
            <Scale className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient font-baloo mb-4">
            {isRTL ? 'شروط الخدمة' : 'Terms of Service'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? 'الشروط والأحكام التي تحكم استخدامك لمتجر جروجارْدن وخدماتنا'
              : 'Terms and conditions governing your use of Grow a Garden Store and our services'
            }
          </p>
          <Badge variant="secondary" className="mt-4">
            <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'آخر تحديث: يناير 2025' : 'Last Updated: January 2025'}
          </Badge>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Agreement */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="w-6 h-6 text-success" />
                {isRTL ? 'الموافقة على الشروط' : 'Agreement to Terms'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                <p className="text-muted-foreground leading-relaxed">
                  {isRTL 
                    ? 'بإتمامك لأي عملية شراء من متجر جروجارْدن، فإنك توافق على جميع الشروط والأحكام الواردة في هذه الصفحة. نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق.'
                    : 'By completing any purchase from Grow a Garden Store, you agree to all terms and conditions outlined on this page. We reserve the right to modify these terms at any time without prior notice.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Digital Products Policy */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <XCircle className="w-6 h-6 text-destructive" />
                {isRTL ? 'سياسة المنتجات الرقمية' : 'Digital Products Policy'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/10">
                    <h4 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      {isRTL ? 'سياسة عدم الاسترداد' : 'No Refund Policy'}
                    </h4>
                    <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'المنتجات الرقمية لا يمكن إرجاعها أو استردادها' : 'Digital products cannot be returned or refunded'}</li>
                      <li>• {isRTL ? 'الاستثناء الوحيد في حال وجود عيب من المتجر' : 'Exception only if there is a defect from the store'}</li>
                      <li>• {isRTL ? 'يرجى التأكد من المنتج قبل الشراء' : 'Please verify the product before purchase'}</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-semibold text-primary mb-3">
                      {isRTL ? '📱 أدلة Roblox' : '📱 Roblox Guides'}
                    </h4>
                    <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'أدلة مخصصة للعبة Grow a Garden' : 'Guides specific to Grow a Garden game'}</li>
                      <li>• {isRTL ? 'محتوى تعليمي وإرشادات متقدمة' : 'Educational content and advanced tutorials'}</li>
                      <li>• {isRTL ? 'ملتزم بسياسات Roblox' : 'Compliant with Roblox policies'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Products Policy */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="w-6 h-6 text-accent" />
                {isRTL ? 'سياسة المنتجات الفعلية' : 'Physical Products Policy'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h4 className="font-semibold text-accent mb-3">
                      {isRTL ? '↩️ سياسة الإرجاع' : '↩️ Return Policy'}
                    </h4>
                    <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'إمكانية الإرجاع خلال 3 أيام من الاستلام' : 'Returns accepted within 3 days of receipt'}</li>
                      <li>• {isRTL ? 'المنتج يجب أن يكون في حالته الأصلية' : 'Product must be in original condition'}</li>
                      <li>• {isRTL ? 'التغليف الأصلي من الشركة المصنعة مطلوب' : 'Original manufacturer packaging required'}</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                    <h4 className="font-semibold text-success mb-3">
                      {isRTL ? '🚚 تكاليف الشحن' : '🚚 Shipping Costs'}
                    </h4>
                    <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'العميل يتحمل تكلفة الإرجاع عادة' : 'Customer typically bears return shipping cost'}</li>
                      <li>• {isRTL ? 'المتجر يتحمل التكلفة في حالة العيوب' : 'Store covers cost for defective items'}</li>
                      <li>• {isRTL ? 'الشحن مجاني للطلبات فوق 25 د.ك' : 'Free shipping for orders over 25 KD'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account and Services */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                {isRTL ? 'الحساب والخدمات' : 'Account and Services'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                      {isRTL ? '⚠️ قيود الخدمة' : '⚠️ Service Limitations'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? 'قد تواجه بعض الخدمات قيود أو مخاطر محتملة'
                        : 'Some services may have limitations or potential risks'
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-semibold text-primary mb-2">
                      {isRTL ? '👤 إدارة الحساب' : '👤 Account Management'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? 'قواعد إنشاء ونقل وإدارة الحسابات'
                        : 'Rules for account creation, transfer, and management'
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h4 className="font-semibold text-accent mb-2">
                      {isRTL ? '📞 التواصل' : '📞 Communication'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? 'طرق التواصل وتوقعات الرد على الاستفسارات'
                        : 'Communication methods and response expectations'
                      }
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                  <h4 className="font-bold text-lg text-foreground mb-4">
                    {isRTL ? '🎮 التزام سياسات Roblox' : '🎮 Roblox Policy Compliance'}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        <li>✅ {isRTL ? 'جميع منتجاتنا متوافقة مع شروط Roblox' : 'All our products comply with Roblox terms'}</li>
                        <li>✅ {isRTL ? 'لا نبيع Robux أو عناصر غير مصرح بها' : 'We do not sell Robux or unauthorized items'}</li>
                        <li>✅ {isRTL ? 'التركيز على التعليم والإرشاد المشروع' : 'Focus on legitimate education and guidance'}</li>
                      </ul>
                    </div>
                    <div>
                      <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        <li>⚠️ {isRTL ? 'نحذر من التداول خارج اللعبة' : 'We warn against trading outside the game'}</li>
                        <li>⚠️ {isRTL ? 'لا نتحمل مسؤولية الخسائر في اللعبة' : 'We are not responsible for in-game losses'}</li>
                        <li>⚠️ {isRTL ? 'استخدم الأدلة بمسؤولية وحكمة' : 'Use guides responsibly and wisely'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liability and Disputes */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Scale className="w-6 h-6 text-primary" />
                {isRTL ? 'المسؤولية والنزاعات' : 'Liability and Disputes'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-3">
                    {isRTL ? '⚖️ حل النزاعات' : '⚖️ Dispute Resolution'}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isRTL 
                      ? 'في حالة وجود أي نزاع، نلتزم بحله ودياً أولاً عبر التواصل المباشر. إذا لم يتم الوصول لحل، فإن القانون الكويتي هو المرجع النهائي.'
                      : 'In case of any dispute, we are committed to resolving it amicably first through direct communication. If no resolution is reached, Kuwaiti law shall be the final reference.'
                    }
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                    <h4 className="font-semibold text-success mb-2">
                      {isRTL ? '✅ مسؤوليتنا' : '✅ Our Responsibility'}
                    </h4>
                    <ul className={`space-y-1 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'جودة المنتجات والخدمات' : 'Quality of products and services'}</li>
                      <li>• {isRTL ? 'الالتزام بمواعيد التسليم' : 'Meeting delivery schedules'}</li>
                      <li>• {isRTL ? 'حماية بيانات العملاء' : 'Protecting customer data'}</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                      {isRTL ? '⚠️ حدود المسؤولية' : '⚠️ Liability Limits'}
                    </h4>
                    <ul className={`space-y-1 text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      <li>• {isRTL ? 'لا نتحمل مسؤولية خسائر اللعبة' : 'Not responsible for game losses'}</li>
                      <li>• {isRTL ? 'مسؤولية محدودة للأضرار غير المباشرة' : 'Limited liability for indirect damages'}</li>
                      <li>• {isRTL ? 'استخدام الأدلة على مسؤوليتك' : 'Use of guides at your own risk'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact for Legal Matters */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-6 h-6 text-primary" />
                {isRTL ? 'التواصل للمسائل القانونية' : 'Contact for Legal Matters'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  {isRTL 
                    ? 'للاستفسارات القانونية أو النزاعات، يرجى التواصل معنا'
                    : 'For legal inquiries or disputes, please contact us'
                  }
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" onClick={() => window.location.href = 'mailto:legal@growgardenstore.com'}>
                    <Mail className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    legal@growgardenstore.com
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = 'tel:+96555683677'}>
                    <Phone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    +965 55683677
                  </Button>
                </div>
                <Button onClick={() => window.open('https://wa.me/96555683677', '_blank')} className="btn-accent">
                  <Phone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'تواصل عبر WhatsApp' : 'Contact via WhatsApp'}
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

export default TermsOfService;