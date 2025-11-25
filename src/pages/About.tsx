import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Users, Award, CheckCircle, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const teamMembers = [
    {
      name: "أحمد الخبير",
      nameEn: "Ahmed Al-Khabeer",
      role: "مؤسس ومطور اللعبة",
      roleEn: "Founder & Game Expert",
      experience: "5+ سنوات في Grow a Garden",
      experienceEn: "5+ years in Grow a Garden",
      description: "خبير معتمد في استراتيجيات اللعبة وتطوير الحيوانات",
      descriptionEn: "Certified expert in game strategies and animal development"
    },
    {
      name: "فاطمة المرشدة",
      nameEn: "Fatima Al-Murshida",
      role: "مستشارة التسوق الآمن",
      roleEn: "Safe Shopping Consultant",
      experience: "خبرة في سياسات Roblox",
      experienceEn: "Experience in Roblox policies",
      description: "متخصصة في إرشاد العائلات للتسوق الآمن داخل Roblox",
      descriptionEn: "Specialized in guiding families for safe shopping within Roblox"
    },
    {
      name: "خالد المصمم",
      nameEn: "Khalid Al-Musmmim",
      role: "مصمم المنتجات",
      roleEn: "Product Designer",
      experience: "مصمم محترف",
      experienceEn: "Professional designer",
      description: "يصمم جميع المنتجات الفعلية بجودة عالية",
      descriptionEn: "Designs all physical products with high quality"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "الالتزام الكامل",
      titleEn: "Full Compliance",
      description: "نلتزم 100% بسياسات Roblox ولا نبيع أي عناصر داخل اللعبة خارج النظام الرسمي",
      descriptionEn: "We comply 100% with Roblox policies and do not sell any in-game items outside the official system"
    },
    {
      icon: Heart,
      title: "شغف اللعبة",
      titleEn: "Gaming Passion",
      description: "نحن لاعبون حقيقيون نفهم احتياجات مجتمع Grow a Garden",
      descriptionEn: "We are real players who understand the needs of the Grow a Garden community"
    },
    {
      icon: Users,
      title: "خدمة المجتمع",
      titleEn: "Community Service",
      description: "هدفنا خدمة مجتمع اللاعبين في الكويت ودول الخليج",
      descriptionEn: "Our goal is to serve the gaming community in Kuwait and the Gulf countries"
    },
    {
      icon: Award,
      title: "الجودة العالية",
      titleEn: "High Quality",
      description: "جميع منتجاتنا مصنوعة بأعلى معايير الجودة",
      descriptionEn: "All our products are made with the highest quality standards"
    }
  ];

  const achievements = [
    { number: "500+", label: "عميل راضي", labelEn: "Happy Customers" },
    { number: "50+", label: "دليل منشور", labelEn: "Guides Published" },
    { number: "99%", label: "نسبة الرضا", labelEn: "Satisfaction Rate" },
    { number: "24/7", label: "دعم العملاء", labelEn: "Customer Support" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">{isRTL ? 'من نحن' : 'About Us'}</Badge>
          <h1 className="text-4xl font-bold text-gradient mb-6">
            {t('about.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('about.description')}
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{t('about.ourMission')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg leading-relaxed">
              "{t('about.missionDesc')}"
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">{t('about.ourValues')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{isRTL ? value.title : value.titleEn}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{isRTL ? value.description : value.descriptionEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">{isRTL ? 'فريق العمل' : 'Our Team'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-primary-foreground">👤</span>
                  </div>
                  <CardTitle className="text-xl">{isRTL ? member.name : member.nameEn}</CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">
                    {isRTL ? member.role : member.roleEn}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary font-medium mb-2">{isRTL ? member.experience : member.experienceEn}</p>
                  <p className="text-sm text-muted-foreground">{isRTL ? member.description : member.descriptionEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">{isRTL ? 'إنجازاتنا' : 'Our Achievements'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-primary mb-2">{achievement.number}</div>
                  <p className="text-sm text-muted-foreground">{isRTL ? achievement.label : achievement.labelEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Compliance Section */}
        <Card className="mb-12 border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="w-5 h-5" />
              {isRTL ? 'التزامنا بسياسات Roblox' : 'Our Commitment to Roblox Policies'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-sm">{isRTL ? 'لا نبيع أي عناصر أو حيوانات أو عملات داخل اللعبة خارج منصة Roblox' : 'We do not sell any in-game items, pets, or currency outside the Roblox platform'}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-sm">{isRTL ? 'جميع المزايا داخل اللعبة يتم الحصول عليها من خلال النظام الرسمي فقط' : 'All in-game benefits are obtained through the official system only'}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-sm">{isRTL ? 'نقدم فقط منتجات فعلية وأدلة تعليمية وخدمات استشارية' : 'We only offer physical products, educational guides, and consultation services'}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-sm">{isRTL ? 'نراقب ونحدث سياساتنا باستمرار لضمان الامتثال الكامل' : 'We monitor and update our policies continuously to ensure full compliance'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-primary rounded-xl p-8 text-primary-foreground">
          <h2 className="text-2xl font-bold mb-4">{isRTL ? 'هل لديك أسئلة أو اقتراحات؟' : 'Have Questions or Suggestions?'}</h2>
          <p className="mb-6 opacity-90">
            {isRTL ? 'نحن نحب التواصل مع مجتمعنا والاستماع لآرائكم' : 'We love connecting with our community and hearing your feedback'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Globe className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              {isRTL ? 'انضم لمجتمعنا' : 'Join Our Community'}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;