import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

interface Testimonial {
  id: number;
  nameAr: string;
  nameEn: string;
  textAr: string;
  textEn: string;
  rating: number;
  location: string;
}

const CustomerTestimonials = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      nameAr: "أحمد الكويتي",
      nameEn: "Ahmed Al-Kuwaiti",
      textAr: "متجر ألعاب رائع! مجموعة متنوعة من الألعاب الرقمية والمحتوى الحصري. التوصيل فوري والأسعار تنافسية.",
      textEn: "Amazing gaming store! Diverse collection of digital games and exclusive content. Instant delivery and competitive prices.",
      rating: 5,
      location: "الكويت"
    },
    {
      id: 2,
      nameAr: "فاطمة العتيبي",
      nameEn: "Fatima Al-Otaibi",
      textAr: "أفضل متجر للألعاب الرقمية! تشكيلة واسعة من الألعاب على جميع المنصات والدعم الفني ممتاز.",
      textEn: "Best store for digital games! Wide selection of games across all platforms and excellent technical support.",
      rating: 5,
      location: "السعودية"
    },
    {
      id: 3,
      nameAr: "محمد البحريني",
      nameEn: "Mohammed Al-Bahraini",
      textAr: "خدمة عملاء ممتازة وتوصيل فوري. حصلت على ألعابي المفضلة بسرعة وجودة عالية. سأطلب مرة أخرى!",
      textEn: "Excellent customer service and instant delivery. Got my favorite games quickly and in high quality. Will order again!",
      rating: 5,
      location: "البحرين"
    },
    {
      id: 4,
      nameAr: "سارة القطرية",
      nameEn: "Sarah Al-Qatari",
      textAr: "منصة موثوقة لشراء الألعاب! سهولة في التصفح والشراء، وتشكيلة كبيرة من الألعاب الحديثة والكلاسيكية.",
      textEn: "Reliable platform for buying games! Easy browsing and purchasing, with a large selection of modern and classic games.",
      rating: 5,
      location: "قطر"
    },
    {
      id: 5,
      nameAr: "عبدالله الإماراتي",
      nameEn: "Abdullah Al-Emirati",
      textAr: "تجربة تسوق ممتازة! الموقع سهل الاستخدام والدفع آمن. حصلت على جميع الألعاب التي أردتها بأسعار مناسبة.",
      textEn: "Excellent shopping experience! Easy-to-use website and secure payment. Got all the games I wanted at reasonable prices.",
      rating: 4,
      location: "الإمارات"
    },
    {
      id: 6,
      nameAr: "نورا العماني",
      nameEn: "Nora Al-Omani",
      textAr: "تشكيلة رائعة من الألعاب! سهولة في العثور على الألعاب المطلوبة والتوصيل الفوري للمحتوى الرقمي.",
      textEn: "Great selection of games! Easy to find desired games and instant delivery of digital content.",
      rating: 5,
      location: "عمان"
    },
    {
      id: 7,
      nameAr: "خالد الكويتي",
      nameEn: "Khalid Al-Kuwaiti",
      textAr: "فريق دعم محترف ومتعاون. ساعدوني في اختيار الألعاب المناسبة وقدموا توصيات ممتازة حسب اهتماماتي.",
      textEn: "Professional and cooperative support team. They helped me choose suitable games and provided excellent recommendations based on my interests.",
      rating: 5,
      location: "الكويت"
    },
    {
      id: 8,
      nameAr: "ريم السعودية",
      nameEn: "Reem Al-Saudi",
      textAr: "التوصيل فوري والتعبئة ممتازة. الألعاب الرقمية تعمل بشكل مثالي. خدمة تستحق الثناء والتقدير!",
      textEn: "Instant delivery and excellent packaging. Digital games work perfectly. Service worthy of praise and appreciation!",
      rating: 4,
      location: "السعودية"
    },
    {
      id: 9,
      nameAr: "يوسف البحريني",
      nameEn: "Youssef Al-Bahraini",
      textAr: "أسعار تنافسية وجودة عالية. حصلت على مجموعة متنوعة من الألعاب لجميع أفراد العائلة بأسعار مناسبة.",
      textEn: "Competitive prices and high quality. Got a diverse collection of games for the whole family at reasonable prices.",
      rating: 5,
      location: "البحرين"
    },
    {
      id: 10,
      nameAr: "مريم القطرية",
      nameEn: "Mariam Al-Qatari",
      textAr: "الموقع سهل الاستخدام والدفع آمن. حصلت على طلبي فوراً وكانت جميع الألعاب تعمل بشكل مثالي.",
      textEn: "Easy-to-use website and secure payment. Got my order instantly and all games worked perfectly.",
      rating: 4,
      location: "قطر"
    },
    {
      id: 11,
      nameAr: "علي الإماراتي",
      nameEn: "Ali Al-Emirati",
      textAr: "منصة ممتازة للألعاب الرقمية! تشكيلة واسعة من الألعاب الحديثة والمحتوى الحصري بأسعار مناسبة.",
      textEn: "Excellent platform for digital games! Wide selection of modern games and exclusive content at reasonable prices.",
      rating: 5,
      location: "الإمارات"
    },
    {
      id: 12,
      nameAr: "هند العمانية",
      nameEn: "Hind Al-Omani",
      textAr: "خدمة عملاء متميزة! ردوا بسرعة على استفساراتي وقدموا مساعدة فورية. تجربة تسوق مرضية جداً.",
      textEn: "Outstanding customer service! They responded quickly to my inquiries and provided immediate assistance. Very satisfying shopping experience.",
      rating: 5,
      location: "عمان"
    },
    {
      id: 13,
      nameAr: "سلطان الكويتي",
      nameEn: "Sultan Al-Kuwaiti",
      textAr: "ألعاب أصلية ومضمونة. جودة عالية والتوصيل فوري. سأستمر في الشراء من هذا المتجر الموثوق!",
      textEn: "Original and guaranteed games. High quality and instant delivery. I will continue to buy from this trusted store!",
      rating: 4,
      location: "الكويت"
    },
    {
      id: 14,
      nameAr: "لطيفة السعودية",
      nameEn: "Latifa Al-Saudi",
      textAr: "تجربة شراء ممتعة وراضية! سهولة في البحث عن الألعاب والتصنيف حسب النوع والمنصة. أنصح به بشدة.",
      textEn: "Pleasant and satisfying purchase experience! Easy to search for games and categorize by type and platform. Highly recommend!",
      rating: 5,
      location: "السعودية"
    },
    {
      id: 15,
      nameAr: "حمد البحريني",
      nameEn: "Hamad Al-Bahraini",
      textAr: "تجربة تسوق مثالية من البداية للنهاية. الموقع منظم والدفع سهل والتوصيل في الوقت المحدد تماماً.",
      textEn: "Perfect shopping experience from start to finish. Organized website, easy payment, and exactly on-time delivery.",
      rating: 5,
      location: "البحرين"
    },
    {
      id: 16,
      nameAr: "عائشة القطرية",
      nameEn: "Aisha Al-Qatari",
      textAr: "تشكيلة متنوعة ومفيدة من الألعاب. ساعدتني في اكتشاف ألعاب جديدة وممتعة حسب اهتماماتي في الألعاب.",
      textEn: "Diverse and useful game collection. Helped me discover new and fun games based on my gaming interests.",
      rating: 4,
      location: "قطر"
    },
    {
      id: 17,
      nameAr: "راشد الإماراتي",
      nameEn: "Rashid Al-Emirati",
      textAr: "فريق متخصص ومحترف. قدموا لي نصائح مفيدة وساعدوني في اختيار أفضل الألعاب حسب جهازي وميزانيتي.",
      textEn: "Specialized and professional team. They gave me useful advice and helped me choose the best games for my device and budget.",
      rating: 5,
      location: "الإمارات"
    },
    {
      id: 18,
      nameAr: "زينب العمانية",
      nameEn: "Zainab Al-Omani",
      textAr: "ألعاب عالية الجودة وأسعار مناسبة. سهولة في الشراء والتوصيل الفوري. تجربة إيجابية ومرضية!",
      textEn: "High-quality games and reasonable prices. Easy purchase and instant delivery. Positive and satisfying experience!",
      rating: 4,
      location: "عمان"
    },
    {
      id: 19,
      nameAr: "فيصل الكويتي",
      nameEn: "Faisal Al-Kuwaiti",
      textAr: "خدمة موثوقة وسريعة. حصلت على الألعاب فوراً بعد الدفع وكانت جميعها تعمل بشكل مثالي وممتاز.",
      textEn: "Reliable and fast service. Got the games instantly after payment and all of them worked perfectly and excellently.",
      rating: 5,
      location: "الكويت"
    },
    {
      id: 20,
      nameAr: "أمل السعودية",
      nameEn: "Amal Al-Saudi",
      textAr: "تجربة رائعة وممتعة! الموقع سهل التصفح والألعاب متنوعة. خدمة العملاء متميزة ومتاحة دائماً.",
      textEn: "Amazing and enjoyable experience! Easy-to-browse website and diverse games. Outstanding customer service always available.",
      rating: 5,
      location: "السعودية"
    }
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalPages]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
    setIsAutoPlaying(false);
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentIndex * itemsPerPage;
    return testimonials.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gradient-to-r from-background to-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {isRTL ? 'آراء العملاء' : 'Customer Reviews'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-baloo text-gradient">
            {isRTL ? 'ماذا يقول عملاؤنا' : 'What Our Customers Say'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {isRTL 
              ? 'اكتشف تجارب عملائنا الراضين من جميع أنحاء الخليج العربي'
              : 'Discover the experiences of our satisfied customers from across the Arabian Gulf'
            }
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {getCurrentTestimonials().map((testimonial) => (
              <Card key={testimonial.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{isRTL ? testimonial.textAr : testimonial.textEn}"
                  </p>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold">
                      {isRTL ? testimonial.nameAr : testimonial.nameEn}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
