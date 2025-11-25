import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, Phone, MapPin, Calendar, Lock, Eye, UserCheck } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient font-baloo mb-4">
            {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? 'نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية وفقاً لأعلى معايير الأمان والشفافية'
              : 'We are committed to protecting your privacy and personal data according to the highest standards of security and transparency'
            }
          </p>
          <Badge variant="secondary" className="mt-4">
            <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'آخر تحديث: يناير 2025' : 'Last Updated: January 2025'}
          </Badge>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Information We Collect */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Eye className="w-6 h-6 text-primary" />
                {isRTL ? 'المعلومات التي نجمعها' : 'Information We Collect'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    {isRTL ? 'المعلومات الشخصية:' : 'Personal Information:'}
                  </h4>
                  <ul className={`space-y-2 text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    <li>• {isRTL ? 'الاسم الكامل وبيانات الاتصال' : 'Full name and contact details'}</li>
                    <li>• {isRTL ? 'عنوان البريد الإلكتروني' : 'Email address'}</li>
                    <li>• {isRTL ? 'رقم الهاتف' : 'Phone number'}</li>
                    <li>• {isRTL ? 'العنوان للتوصيل' : 'Delivery address'}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    {isRTL ? 'معلومات التصفح:' : 'Browsing Information:'}
                  </h4>
                  <ul className={`space-y-2 text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    <li>• {isRTL ? 'عنوان IP والموقع الجغرافي' : 'IP address and location'}</li>
                    <li>• {isRTL ? 'نوع المتصفح والجهاز' : 'Browser and device type'}</li>
                    <li>• {isRTL ? 'سجل الزيارات والتفضيلات' : 'Visit history and preferences'}</li>
                    <li>• {isRTL ? 'ملفات الارتباط (Cookies)' : 'Cookies and tracking data'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <UserCheck className="w-6 h-6 text-accent" />
                {isRTL ? 'كيف نستخدم معلوماتك' : 'How We Use Your Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-semibold text-primary mb-2">
                      {isRTL ? '🛒 معالجة الطلبات' : '🛒 Order Processing'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? 'لمعالجة طلباتك وتأكيد الشراء وتنظيم عملية التوصيل'
                        : 'To process your orders, confirm purchases, and organize delivery'
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h4 className="font-semibold text-accent mb-2">
                      {isRTL ? '📞 التواصل معك' : '📞 Communication'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? 'للرد على استفساراتك وإرسال تحديثات الطلبات'
                        : 'To respond to inquiries and send order updates'
                      }
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                    <h4 className="font-semibold text-success mb-2">
                      {isRTL ? '🔒 الأمان والحماية' : '🔒 Security & Protection'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? 'لحماية حسابك ومنع الاحتيال والاستخدام غير المصرح به'
                        : 'To protect your account and prevent fraud and unauthorized use'
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-foreground mb-2">
                      {isRTL ? '📈 تحسين الخدمة' : '📈 Service Improvement'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? 'لتطوير وتحسين موقعنا وخدماتنا بناءً على تفضيلاتك'
                        : 'To develop and improve our website and services based on your preferences'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Lock className="w-6 h-6 text-success" />
                {isRTL ? 'حماية البيانات والأمان' : 'Data Protection & Security'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-success/5 rounded-lg border border-success/10">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-success" />
                  </div>
                  <h4 className="font-semibold text-success mb-2">
                    {isRTL ? 'تشفير SSL' : 'SSL Encryption'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {isRTL 
                      ? 'جميع البيانات محمية بتشفير 256-bit'
                      : 'All data protected with 256-bit encryption'
                    }
                  </p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">
                    {isRTL ? 'الوصول المحدود' : 'Limited Access'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {isRTL 
                      ? 'الوصول للبيانات مقيد على المخولين فقط'
                      : 'Data access restricted to authorized personnel only'
                    }
                  </p>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/10">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold text-accent mb-2">
                    {isRTL ? 'مراقبة مستمرة' : 'Continuous Monitoring'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {isRTL 
                      ? 'مراقبة دائمة للتهديدات والثغرات الأمنية'
                      : 'Continuous monitoring for threats and vulnerabilities'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <UserCheck className="w-6 h-6 text-primary" />
                {isRTL ? 'حقوقك كعميل' : 'Your Rights as a Customer'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {isRTL ? 'حق الوصول' : 'Right to Access'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? 'يمكنك طلب نسخة من بياناتك الشخصية المخزنة لدينا'
                          : 'You can request a copy of your personal data stored with us'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {isRTL ? 'حق التصحيح' : 'Right to Correction'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? 'يمكنك طلب تصحيح أو تحديث أي معلومات غير دقيقة'
                          : 'You can request correction or update of any inaccurate information'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {isRTL ? 'حق الحذف' : 'Right to Deletion'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? 'يمكنك طلب حذف بياناتك الشخصية في ظروف معينة'
                          : 'You can request deletion of your personal data under certain circumstances'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {isRTL ? 'حق الاعتراض' : 'Right to Object'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? 'يمكنك الاعتراض على معالجة بياناتك لأغراض التسويق'
                          : 'You can object to processing of your data for marketing purposes'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-6 h-6 text-primary" />
                {isRTL ? 'تواصل معنا بخصوص الخصوصية' : 'Contact Us About Privacy'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {isRTL ? 'البريد الإلكتروني' : 'Email'}
                    </p>
                    <a href="mailto:privacy@growgardenstore.com" className="text-sm text-primary hover:underline">
                      privacy@growgardenstore.com
                    </a>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {isRTL ? 'الهاتف' : 'Phone'}
                    </p>
                    <a href="tel:+96555683677" className="text-sm text-accent hover:underline">
                      +965 55683677
                    </a>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {isRTL ? 'الموقع' : 'Location'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'الكويت - السالمية' : 'Kuwait - Salmiya'}
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="text-center">
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

export default PrivacyPolicy;