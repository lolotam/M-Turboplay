import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, MessageCircle, Clock, Globe, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { emailService } from "@/services/emailService";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    robloxUsername: "",
    subject: "",
    message: "",
    preferredLanguage: "ar"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send email notification to admin
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'mwaleedtam2016@gmail.com';
      const emailSent = await emailService.sendContactFormNotification({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: `${formData.message}\n\nAdditional Details:\n- Phone: ${formData.phone}\n- Roblox Username: ${formData.robloxUsername}\n- Preferred Language: ${formData.preferredLanguage}`,
        adminEmail: adminEmail
      });

      toast({
        title: t('contactPage.messageSent'),
        description: emailSent
          ? t('contactPage.messageSentDesc')
          : (isRTL ? 'تم إرسال رسالتك وسيتم الرد عليك قريباً' : 'Your message has been sent and we will reply soon'),
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        robloxUsername: "",
        subject: "",
        message: "",
        preferredLanguage: "ar"
      });
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ في الإرسال' : 'Send Error',
        description: isRTL ? 'حدث خطأ أثناء إرسال الرسالة' : 'An error occurred while sending the message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "الهاتف والواتساب",
      titleEn: "Phone & WhatsApp",
      value: "+965 55683677",
      description: "متاح 24/7 للدعم الفوري",
      action: "اتصل الآن",
      href: "tel:+96555683677"
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      titleEn: "Email",
      value: "support@growgardenstore.com",
      description: "للاستفسارات التفصيلية",
      action: "أرسل إيميل",
      href: "mailto:support@growgardenstore.com"
    },
    {
      icon: MessageCircle,
      title: "واتساب للأعمال",
      titleEn: "WhatsApp Business",
      value: "+965 55683677",
      description: "دردشة سريعة ومباشرة",
      action: "ابدأ محادثة",
      href: "https://wa.me/96555683677"
    }
  ];

  const faqItems = [
    {
      question: "كيف أتأكد من أن منتجاتكم متوافقة مع سياسات Roblox؟",
      answer: "نحن نبيع فقط منتجات فعلية وأدلة تعليمية. لا نبيع أي عناصر داخل اللعبة خارج النظام الرسمي."
    },
    {
      question: "كم يستغرق توصيل المنتجات الفعلية؟",
      answer: "التوصيل داخل الكويت يستغرق 1-3 أيام عمل. المنتجات الرقمية تُرسل فوراً بعد الدفع."
    },
    {
      question: "هل يمكنني إرجاع المنتج إذا لم يعجبني؟",
      answer: "نعم، لدينا سياسة إرجاع لمدة 7 أيام للمنتجات الفعلية غير المستخدمة."
    },
    {
      question: "كيف تتم جلسات الاستشارة؟",
      answer: "عبر Zoom أو Discord حسب تفضيلك، مع إمكانية التسجيل للمراجعة اللاحقة."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">{t('contactPage.title')}</Badge>
          <h1 className="text-4xl font-bold text-gradient mb-6">{t('contactPage.getInTouch')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contactPage.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {t('contactPage.location')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{isRTL ? 'الكويت - السالمية' : 'Kuwait - Salmiya'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'نخدم جميع مناطق الكويت مع توصيل مجاني' : 'We serve all areas of Kuwait with free delivery'}
                  </p>
                  <Badge variant="outline" className="w-fit">
                    <Clock className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {isRTL ? '24/7 متاح' : '24/7 Available'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <method.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{isRTL ? method.title : method.titleEn}</h3>
                        <p className="text-sm font-mono text-primary mb-1">{method.value}</p>
                        <p className="text-xs text-muted-foreground mb-2">{method.description}</p>
                        <Button size="sm" variant="outline" asChild>
                          <a href={method.href} target="_blank" rel="noopener noreferrer">
                            {method.action}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.slice(0, 2).map((item, index) => (
                  <div key={index} className="border-b border-border/50 last:border-0 pb-3 last:pb-0">
                    <h4 className="font-medium text-sm mb-2">{item.question}</h4>
                    <p className="text-xs text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  {isRTL ? 'المزيد من الأسئلة' : 'More Questions'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'أرسل لنا رسالة' : 'Send us a Message'}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'املأ النموذج وسنتواصل معك خلال 24 ساعة' : 'Fill out the form and we\'ll get back to you within 24 hours'}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('contactPage.name')} <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('contactPage.emailAddress')} <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('contactPage.phone')}
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+965 55683677"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {isRTL ? 'اسم المستخدم في Roblox (اختياري)' : 'Roblox Username (Optional)'}
                      </label>
                      <Input
                        name="robloxUsername"
                        value={formData.robloxUsername}
                        onChange={handleChange}
                        placeholder={isRTL ? 'اسم المستخدم' : 'Username'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('contactPage.subject')} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={isRTL ? 'ما هو موضوع استفسارك؟' : 'What is the subject of your inquiry?'}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('contactPage.message')} <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={isRTL ? 'اكتب رسالتك بالتفصيل...' : 'Write your message in detail...'}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="lang-ar"
                        name="preferredLanguage"
                        value="ar"
                        checked={formData.preferredLanguage === "ar"}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <label htmlFor="lang-ar" className="text-sm">{isRTL ? 'الرد بالعربية' : 'Reply in Arabic'}</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="lang-en"
                        name="preferredLanguage"
                        value="en"
                        checked={formData.preferredLanguage === "en"}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <label htmlFor="lang-en" className="text-sm">Reply in English</label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      ) : (
                        <Mail className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      )}
                      {isLoading
                        ? (isRTL ? 'جاري الإرسال...' : 'Sending...')
                        : t('contactPage.send')
                      }
                    </Button>
                    <Button type="button" variant="outline" size="lg" asChild>
                      <a href="https://wa.me/96555683677" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {isRTL ? 'واتساب فوري' : 'WhatsApp Now'}
                      </a>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Response Time Notice */}
            <Card className="mt-6 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary mb-1">{isRTL ? 'أوقات الاستجابة' : 'Response Times'}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {isRTL ? 'واتساب: استجابة فورية (24/7)' : 'WhatsApp: Immediate response (24/7)'}</li>
                      <li>• {isRTL ? 'البريد الإلكتروني: خلال 6-24 ساعة' : 'Email: Within 6-24 hours'}</li>
                      <li>• {isRTL ? 'الاستفسارات المعقدة: خلال 48 ساعة' : 'Complex inquiries: Within 48 hours'}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;