import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Search, MessageCircle, Shield, HelpCircle, Gamepad2, ShoppingCart, Zap, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: isRTL ? "عام حول اللعبة" : "General Game Questions",
      titleEn: "General Game Questions",
      icon: Gamepad2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      questions: [
        {
          question: isRTL ? "ما هي لعبة Grow a Garden؟" : "What is Grow a Garden?",
          questionEn: "What is Grow a Garden?",
          answer: isRTL ? 
            "Grow a Garden هي لعبة شعبية على منصة Roblox حيث يمكن للاعبين زراعة النباتات، تربية الحيوانات، وبناء مزارعهم الخاصة. اللعبة تركز على الزراعة والتربية مع إمكانية التداول مع اللاعبين الآخرين." :
            "Grow a Garden is a popular game on the Roblox platform where players can grow plants, raise animals, and build their own farms. The game focuses on farming and breeding with the ability to trade with other players.",
          answerEn: "Grow a Garden is a popular game on the Roblox platform where players can grow plants, raise animals, and build their own farms. The game focuses on farming and breeding with the ability to trade with other players."
        },
        {
          question: isRTL ? "كيف أبدأ في لعب Grow a Garden؟" : "How do I start playing Grow a Garden?",
          questionEn: "How do I start playing Grow a Garden?",
          answer: isRTL ?
            "للبدء في اللعبة: 1) ادخل إلى Roblox وابحث عن 'Grow a Garden' 2) اضغط على اللعب 3) ابدأ بزراعة البذور الأساسية 4) اجمع العملات من بيع المحاصيل 5) اشتري حيوانات أو بذور جديدة لتوسيع مزرعتك." :
            "To start playing: 1) Go to Roblox and search for 'Grow a Garden' 2) Click Play 3) Start by planting basic seeds 4) Collect coins from selling crops 5) Buy new animals or seeds to expand your farm.",
          answerEn: "To start playing: 1) Go to Roblox and search for 'Grow a Garden' 2) Click Play 3) Start by planting basic seeds 4) Collect coins from selling crops 5) Buy new animals or seeds to expand your farm."
        },
        {
          question: isRTL ? "ما هي أهم النصائح للمبتدئين؟" : "What are the best tips for beginners?",
          questionEn: "What are the best tips for beginners?",
          answer: isRTL ?
            "نصائح مهمة: 1) ازرع المحاصيل السريعة النمو في البداية 2) ركز على جمع العملات قبل شراء الحيوانات الباهظة 3) انضم إلى قروب أو ديسكورد للحصول على نصائح 4) تفاعل مع الفعاليات الخاصة للحصول على مكافآت إضافية 5) تعلم أسعار السوق قبل التداول." :
            "Important tips: 1) Plant fast-growing crops initially 2) Focus on collecting coins before buying expensive animals 3) Join groups or Discord for tips 4) Participate in special events for extra rewards 5) Learn market prices before trading.",
          answerEn: "Important tips: 1) Plant fast-growing crops initially 2) Focus on collecting coins before buying expensive animals 3) Join groups or Discord for tips 4) Participate in special events for extra rewards 5) Learn market prices before trading."
        }
      ]
    },
    {
      title: isRTL ? "الحيوانات والتربية" : "Animals & Breeding",
      titleEn: "Animals & Breeding", 
      icon: HelpCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      questions: [
        {
          question: isRTL ? "كيف أحصل على حيوانات في اللعبة؟" : "How do I get animals in the game?",
          questionEn: "How do I get animals in the game?",
          answer: isRTL ?
            "يمكنك الحصول على الحيوانات بعدة طرق: 1) شرائها من متجر اللعبة بالعملات 2) التداول مع لاعبين آخرين 3) الفوز بها من الفعاليات الخاصة 4) الحصول عليها من صناديق الجوائز 5) تربيتها من خلال breeding النادرة." :
            "You can get animals through: 1) Buying from the in-game shop with coins 2) Trading with other players 3) Winning them from special events 4) Getting them from prize boxes 5) Breeding rare animals through breeding systems.",
          answerEn: "You can get animals through: 1) Buying from the in-game shop with coins 2) Trading with other players 3) Winning them from special events 4) Getting them from prize boxes 5) Breeding rare animals through breeding systems."
        },
        {
          question: isRTL ? "ما هي أندر الحيوانات في اللعبة؟" : "What are the rarest animals in the game?",
          questionEn: "What are the rarest animals in the game?",
          answer: isRTL ?
            "أندر الحيوانات تشمل: Crystal Unicorns، Rainbow Dragons، Golden Phoenix، Diamond Cats، وحيوانات الفعاليات المحدودة مثل Halloween Pets. هذه الحيوانات لها قيمة عالية جداً في التداول ويصعب الحصول عليها." :
            "The rarest animals include: Crystal Unicorns, Rainbow Dragons, Golden Phoenix, Diamond Cats, and limited event animals like Halloween Pets. These animals have very high trading value and are difficult to obtain.",
          answerEn: "The rarest animals include: Crystal Unicorns, Rainbow Dragons, Golden Phoenix, Diamond Cats, and limited event animals like Halloween Pets. These animals have very high trading value and are difficult to obtain."
        },
        {
          question: isRTL ? "كيف يعمل نظام التربية (Breeding)؟" : "How does the breeding system work?",
          questionEn: "How does the breeding system work?",
          answer: isRTL ?
            "نظام التربية يتيح لك دمج حيوانين للحصول على حيوان جديد. كلما كانت الحيوانات أندر، زادت فرصة الحصول على حيوان نادر. عملية التربية تتطلب وقت انتظار وأحياناً عملات إضافية. بعض الحيوانات لها معادلات تربية خاصة." :
            "The breeding system lets you combine two animals to get a new one. The rarer the animals, the higher chance of getting a rare animal. Breeding requires waiting time and sometimes additional coins. Some animals have special breeding formulas.",
          answerEn: "The breeding system lets you combine two animals to get a new one. The rarer the animals, the higher chance of getting a rare animal. Breeding requires waiting time and sometimes additional coins. Some animals have special breeding formulas."
        }
      ]
    },
    {
      title: isRTL ? "التداول والشراء" : "Trading & Purchasing",
      titleEn: "Trading & Purchasing",
      icon: ShoppingCart,
      color: "text-purple-600", 
      bgColor: "bg-purple-50",
      questions: [
        {
          question: isRTL ? "كيف أشتري الحيوانات بأمان؟" : "How do I buy animals safely?",
          questionEn: "How do I buy animals safely?",
          answer: isRTL ?
            "للشراء الآمن: 1) استخدم نظام التداول الرسمي داخل اللعبة فقط 2) تأكد من قيمة الحيوان قبل التداول 3) لا تشارك معلومات حسابك أبداً 4) احذر من المحتالين الذين يطلبون تداول خارج اللعبة 5) استخدم Middle Man موثوق للصفقات الكبيرة." :
            "For safe buying: 1) Use only the official in-game trading system 2) Verify the animal's value before trading 3) Never share your account information 4) Beware of scammers asking for off-platform trades 5) Use trusted Middle Man for large deals.",
          answerEn: "For safe buying: 1) Use only the official in-game trading system 2) Verify the animal's value before trading 3) Never share your account information 4) Beware of scammers asking for off-platform trades 5) Use trusted Middle Man for large deals."
        },
        {
          question: isRTL ? "ما هي أسعار الحيوانات الشائعة؟" : "What are the prices of common animals?",
          questionEn: "What are the prices of common animals?",
          answer: isRTL ?
            "الأسعار تتغير باستمرار، لكن تقريباً: Cats (100-500 coins)، Dogs (200-800 coins)، Rabbits (150-400 coins)، Legendary pets (10,000+ coins)، Mythical pets (50,000+ coins). للحيوانات النادرة جداً قد تصل الأسعار لملايين العملات أو تداولها بحيوانات نادرة أخرى." :
            "Prices constantly change, but approximately: Cats (100-500 coins), Dogs (200-800 coins), Rabbits (150-400 coins), Legendary pets (10,000+ coins), Mythical pets (50,000+ coins). Ultra-rare animals can cost millions of coins or be traded for other rare animals.",
          answerEn: "Prices constantly change, but approximately: Cats (100-500 coins), Dogs (200-800 coins), Rabbits (150-400 coins), Legendary pets (10,000+ coins), Mythical pets (50,000+ coins). Ultra-rare animals can cost millions of coins or be traded for other rare animals."
        },
        {
          question: isRTL ? "كيف أتجنب النصب في التداول؟" : "How do I avoid trading scams?",
          questionEn: "How do I avoid trading scams?",
          answer: isRTL ?
            "لتجنب النصب: 1) لا تقبل 'trust trades' أبداً 2) تحقق من إحصائيات اللاعب وتاريخ حسابه 3) لا تضغط على روابط خارجية 4) استخدم Discord servers المعروفة للتحقق من الأسعار 5) إذا بدت الصفقة جيدة جداً، فهي غالباً نصب 6) سجل فيديو للتداولات المهمة." :
            "To avoid scams: 1) Never accept 'trust trades' 2) Check player stats and account history 3) Don't click external links 4) Use known Discord servers to verify prices 5) If a deal seems too good, it's probably a scam 6) Record important trades.",
          answerEn: "To avoid scams: 1) Never accept 'trust trades' 2) Check player stats and account history 3) Don't click external links 4) Use known Discord servers to verify prices 5) If a deal seems too good, it's probably a scam 6) Record important trades."
        }
      ]
    },
    {
      title: isRTL ? "الفعاليات والتحديثات" : "Events & Updates", 
      titleEn: "Events & Updates",
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      questions: [
        {
          question: isRTL ? "متى تحدث الفعاليات الخاصة؟" : "When do special events happen?",
          questionEn: "When do special events happen?",
          answer: isRTL ?
            "الفعاليات الخاصة تحدث عادة: 1) في المواسم مثل Halloween وChristmas 2) عند إطلاق تحديثات كبيرة 3) في ذكرى اللعبة السنوية 4) فعاليات مفاجئة من المطورين 5) تعاون مع ألعاب Roblox أخرى. تابع حسابات اللعبة الرسمية للإعلانات." :
            "Special events usually happen: 1) During seasons like Halloween and Christmas 2) When major updates are released 3) On the game's anniversary 4) Surprise events from developers 5) Collaborations with other Roblox games. Follow official game accounts for announcements.",
          answerEn: "Special events usually happen: 1) During seasons like Halloween and Christmas 2) When major updates are released 3) On the game's anniversary 4) Surprise events from developers 5) Collaborations with other Roblox games. Follow official game accounts for announcements."
        },
        {
          question: isRTL ? "كيف أحصل على حيوانات الفعاليات؟" : "How do I get event animals?",
          questionEn: "How do I get event animals?",
          answer: isRTL ?
            "للحصول على حيوانات الفعاليات: 1) شارك في الأنشطة الخاصة بالفعالية 2) اجمع العملات أو العناصر الخاصة 3) أكمل المهام اليومية أثناء الفعالية 4) اشتري من متجر الفعالية قبل انتهائها 5) بعض الحيوانات قد تكون متاحة فقط لفترة محدودة جداً." :
            "To get event animals: 1) Participate in special event activities 2) Collect special coins or items 3) Complete daily tasks during the event 4) Buy from the event shop before it ends 5) Some animals may only be available for a very limited time.",
          answerEn: "To get event animals: 1) Participate in special event activities 2) Collect special coins or items 3) Complete daily tasks during the event 4) Buy from the event shop before it ends 5) Some animals may only be available for a very limited time."
        },
        {
          question: isRTL ? "هل ستعود حيوانات الفعاليات القديمة؟" : "Will old event animals come back?",
          questionEn: "Will old event animals come back?",
          answer: isRTL ?
            "عادة لا تعود حيوانات الفعاليات القديمة، مما يجعلها نادرة وقيمة جداً. أحياناً قد يعيد المطورون بعض الحيوانات في فعاليات 'Legacy' خاصة، لكن هذا نادر. لذلك من المهم المشاركة في الفعاليات عند حدوثها." :
            "Usually old event animals don't return, making them very rare and valuable. Sometimes developers might bring back some animals in special 'Legacy' events, but this is rare. That's why it's important to participate in events when they happen.",
          answerEn: "Usually old event animals don't return, making them very rare and valuable. Sometimes developers might bring back some animals in special 'Legacy' events, but this is rare. That's why it's important to participate in events when they happen."
        }
      ]
    },
    {
      title: isRTL ? "الأمان والسياسات" : "Safety & Policies",
      titleEn: "Safety & Policies",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50", 
      questions: [
        {
          question: isRTL ? "هل الشراء من خارج اللعبة آمن؟" : "Is buying outside the game safe?",
          questionEn: "Is buying outside the game safe?",
          answer: isRTL ?
            "⚠️ تحذير: الشراء من خارج اللعبة غير آمن ومخالف لسياسات Roblox. قد يؤدي إلى: 1) سرقة حسابك 2) حظر دائم من Roblox 3) خسارة أموالك 4) عدم ضمان الحصول على الحيوانات. نحن ننصح بشدة بالتداول داخل اللعبة فقط." :
            "⚠️ Warning: Buying outside the game is unsafe and violates Roblox policies. It can lead to: 1) Account theft 2) Permanent ban from Roblox 3) Loss of money 4) No guarantee of receiving animals. We strongly recommend only trading within the game.",
          answerEn: "⚠️ Warning: Buying outside the game is unsafe and violates Roblox policies. It can lead to: 1) Account theft 2) Permanent ban from Roblox 3) Loss of money 4) No guarantee of receiving animals. We strongly recommend only trading within the game."
        },
        {
          question: isRTL ? "ماذا أفعل إذا تعرضت للنصب؟" : "What do I do if I get scammed?",
          questionEn: "What do I do if I get scammed?",
          answer: isRTL ?
            "إذا تعرضت للنصب: 1) التقط صور للدردشة والتداول 2) أبلغ اللاعب في Roblox 3) تواصل مع دعم Roblox مع الأدلة 4) شارك تحذيرك في community Discord servers 5) تعلم من التجربة ولا تكررها. للأسف، استرداد الحيوانات المسروقة صعب جداً." :
            "If you get scammed: 1) Take screenshots of chat and trades 2) Report the player on Roblox 3) Contact Roblox support with evidence 4) Share your warning in community Discord servers 5) Learn from the experience. Unfortunately, recovering stolen animals is very difficult.",
          answerEn: "If you get scammed: 1) Take screenshots of chat and trades 2) Report the player on Roblox 3) Contact Roblox support with evidence 4) Share your warning in community Discord servers 5) Learn from the experience. Unfortunately, recovering stolen animals is very difficult."
        },
        {
          question: isRTL ? "كيف أحافظ على حسابي آمناً؟" : "How do I keep my account safe?",
          questionEn: "How do I keep my account safe?",
          answer: isRTL ?
            "لحماية حسابك: 1) فعّل Two-Factor Authentication 2) لا تشارك كلمة المرور مع أحد 3) لا تنقر على روابط مشبوهة 4) لا تنزل ملفات من مصادر غير موثوقة 5) غيّر كلمة المرور بانتظام 6) لا تستخدم نفس كلمة المرور في مواقع أخرى." :
            "To protect your account: 1) Enable Two-Factor Authentication 2) Never share your password 3) Don't click suspicious links 4) Don't download files from untrusted sources 5) Change your password regularly 6) Don't use the same password on other sites.",
          answerEn: "To protect your account: 1) Enable Two-Factor Authentication 2) Never share your password 3) Don't click suspicious links 4) Don't download files from untrusted sources 5) Change your password regularly 6) Don't use the same password on other sites."
        }
      ]
    },
    {
      title: isRTL ? "المتجر والشحن" : "Store & Shipping",
      titleEn: "Store & Shipping",
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      questions: [
        {
          question: isRTL ? "ما هي طرق الدفع المتاحة؟" : "What payment methods are available?",
          questionEn: "What payment methods are available?",
          answer: isRTL ?
            "نقبل عدة طرق دفع: 1) KNET (الشبكة الكويتية للمدفوعات) 2) بطاقات الائتمان الدولية (Visa, Mastercard) 3) PayPal للعملاء الدوليين 4) الدفع عند الاستلام للمنتجات الفعلية داخل الكويت 5) التحويل البنكي للطلبات الكبيرة. جميع المعاملات آمنة ومشفرة." :
            "We accept several payment methods: 1) KNET (Kuwait National Payment Network) 2) International credit cards (Visa, Mastercard) 3) PayPal for international customers 4) Cash on delivery for physical products within Kuwait 5) Bank transfer for large orders. All transactions are secure and encrypted.",
          answerEn: "We accept several payment methods: 1) KNET (Kuwait National Payment Network) 2) International credit cards (Visa, Mastercard) 3) PayPal for international customers 4) Cash on delivery for physical products within Kuwait 5) Bank transfer for large orders. All transactions are secure and encrypted."
        },
        {
          question: isRTL ? "كم يستغرق توصيل المنتجات؟" : "How long does shipping take?",
          questionEn: "How long does shipping take?",
          answer: isRTL ?
            "أوقات التوصيل تختلف حسب نوع المنتج: 1) المنتجات الرقمية (الأدلة): فورية بعد الدفع 2) المنتجات الفعلية داخل الكويت: 1-3 أيام عمل 3) المنتجات الفعلية لدول الخليج: 5-7 أيام عمل 4) جلسات الاستشارة: يتم تحديد موعد خلال 24 ساعة 5) التوصيل السريع متاح مقابل رسوم إضافية." :
            "Delivery times vary by product type: 1) Digital products (guides): Instant after payment 2) Physical products within Kuwait: 1-3 business days 3) Physical products to Gulf countries: 5-7 business days 4) Consultation sessions: Scheduled within 24 hours 5) Express delivery available for additional fees.",
          answerEn: "Delivery times vary by product type: 1) Digital products (guides): Instant after payment 2) Physical products within Kuwait: 1-3 business days 3) Physical products to Gulf countries: 5-7 business days 4) Consultation sessions: Scheduled within 24 hours 5) Express delivery available for additional fees."
        },
        {
          question: isRTL ? "ما هي سياسة الإرجاع والاستبدال؟" : "What is the return and exchange policy?",
          questionEn: "What is the return and exchange policy?",
          answer: isRTL ?
            "سياسة الإرجاع: 1) المنتجات الفعلية: إرجاع خلال 7 أيام من الاستلام في حالة عدم الاستخدام 2) المنتجات الرقمية: غير قابلة للإرجاع بعد التحميل 3) جلسات الاستشارة: يمكن إلغاؤها قبل 24 ساعة من الموعد 4) المنتجات المعيبة: استبدال فوري أو استرداد كامل 5) تكاليف الشحن للإرجاع على العميل إلا في حالة العيب." :
            "Return policy: 1) Physical products: Return within 7 days of receipt if unused 2) Digital products: Non-returnable after download 3) Consultation sessions: Can be cancelled 24 hours before appointment 4) Defective products: Immediate replacement or full refund 5) Return shipping costs are customer's responsibility except for defective items.",
          answerEn: "Return policy: 1) Physical products: Return within 7 days of receipt if unused 2) Digital products: Non-returnable after download 3) Consultation sessions: Can be cancelled 24 hours before appointment 4) Defective products: Immediate replacement or full refund 5) Return shipping costs are customer's responsibility except for defective items."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      searchTerm === "" || 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.questionEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answerEn.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
          </Badge>
          <h1 className="text-4xl font-bold text-gradient mb-6">
            {isRTL ? 'الأسئلة الشائعة حول Grow a Garden' : 'Frequently Asked Questions about Grow a Garden'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            {isRTL ? 
              'إجابات شاملة على أكثر الأسئلة شيوعاً حول لعبة Grow a Garden، التداول، الحيوانات، والأمان' :
              'Comprehensive answers to the most common questions about Grow a Garden game, trading, animals, and safety'
            }
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
              <Input
                placeholder={isRTL ? 'ابحث في الأسئلة...' : 'Search questions...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isRTL ? 'pr-10' : 'pl-10'}`}
              />
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="overflow-hidden">
              <CardHeader className={`${category.bgColor} border-b`}>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center`}>
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <span className="text-xl">{category.title}</span>
                  <Badge variant="outline" className="ml-auto">
                    {category.questions.length} {isRTL ? 'سؤال' : 'questions'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openItems.includes(globalIndex);
                    
                    return (
                      <Collapsible key={faqIndex} open={isOpen} onOpenChange={() => toggleItem(globalIndex)}>
                        <CollapsibleTrigger className="w-full p-6 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {faq.question}
                            </h3>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-6 pb-6 pt-2">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support Section */}
        <Card className="mt-12 bg-gradient-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-4">
              {isRTL ? 'لم تجد إجابة لسؤالك؟' : "Didn't find an answer to your question?"}
            </h2>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              {isRTL ? 
                'فريقنا جاهز لمساعدتك! تواصل معنا وسنجيب على جميع استفساراتك حول اللعبة والمنتجات' :
                'Our team is ready to help! Contact us and we will answer all your questions about the game and products'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <a href="/contact">
                  <MessageCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'اتصل بنا' : 'Contact Us'}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <a href="https://wa.me/96555683677" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'واتساب فوري' : 'WhatsApp Now'}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;