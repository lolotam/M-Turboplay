import { FusedContext } from './contextFusion';
import { ImageAnalysisResult } from '@/components/ai/imageAnalyzer';

/**
 * Fallback template types
 */
export type FallbackTemplateType =
  | 'basic-game'
  | 'premium-game'
  | 'accessory'
  | 'digital-product'
  | 'console'
  | 'mobile-game'
  | 'gaming-service';

/**
 * Fallback template structure
 */
export interface FallbackTemplate {
  id: FallbackTemplateType;
  name: string;
  description: string;
  features: string[];
  technicalSpecs: string[];
  marketingPoints: string[];
  targetAudience: 'casual' | 'professional' | 'collectors';
  platformSpecific: string[];
  category: string;
}

/**
 * Generated fallback result
 */
export interface FallbackResult {
  template: FallbackTemplate;
  customizedDescription: string;
  confidence: number;
  source: 'template' | 'hybrid';
  metadata: {
    templateId: string;
    customizationLevel: number; // 0-100
    processingTime: number;
  };
}

/**
 * Smart fallback configuration
 */
export interface SmartFallbackConfig {
  enableHybridMode: boolean;
  templatePersonalization: boolean;
  learningEnabled: boolean;
  fallbackTier: 'template-only' | 'hybrid' | 'enhanced-template';
}

/**
 * Context-aware template selection
 */
export function selectOptimalTemplate(
  fusedContext: FusedContext,
  fallbackHistory: FallbackResult[] = []
): FallbackTemplate {
  console.log('Selecting optimal template for context:', fusedContext);

  // Score each template based on context
  const templateScores = new Map<FallbackTemplateType, number>();

  // Basic game template
  if (fusedContext.productCategory === 'game' || fusedContext.productCategory === 'digital') {
    templateScores.set('basic-game', calculateGameTemplateScore(fusedContext));
    templateScores.set('premium-game', calculatePremiumGameTemplateScore(fusedContext));
  }

  // Accessory template
  if (fusedContext.productCategory === 'accessory') {
    templateScores.set('accessory', calculateAccessoryTemplateScore(fusedContext));
  }

  // Console template
  if (fusedContext.productCategory === 'console') {
    templateScores.set('console', calculateConsoleTemplateScore(fusedContext));
  }

  // Mobile game template
  if (fusedContext.productCategory === 'mobile') {
    templateScores.set('mobile-game', calculateMobileGameTemplateScore(fusedContext));
  }

  // Gaming service template
  if (fusedContext.productType === 'digital' && fusedContext.keyFeatures.some(f => f.includes('service'))) {
    templateScores.set('gaming-service', calculateServiceTemplateScore(fusedContext));
  }

  // Find best scoring template
  let bestTemplate = 'basic-game';
  let bestScore = 0;

  for (const [templateType, score] of templateScores.entries()) {
    if (score > bestScore) {
      bestScore = score;
      bestTemplate = templateType;
    }
  }

  console.log(`Selected template: ${bestTemplate} with score: ${bestScore}`);
  return TEMPLATES[bestTemplate];
}

/**
 * Generate smart fallback description
 */
export function generateSmartFallback(
  fusedContext: FusedContext,
  productName: string,
  productNameEn: string,
  config: Partial<SmartFallbackConfig> = {}
): FallbackResult {
  const startTime = Date.now();

  const {
    enableHybridMode = true,
    templatePersonalization = true,
    learningEnabled = false,
    fallbackTier = 'hybrid'
  } = config;

  console.log('Generating smart fallback with config:', config);

  // Select optimal template
  const template = selectOptimalTemplate(fusedContext);

  // Generate base description from template
  let baseDescription = generateFromTemplate(template, fusedContext, productName, productNameEn);

  // Apply personalization if enabled
  if (templatePersonalization) {
    baseDescription = personalizeDescription(baseDescription, fusedContext);
  }

  // Apply hybrid enhancements if enabled
  if (enableHybridMode && fallbackTier !== 'template-only') {
    baseDescription = enhanceWithHybridFeatures(baseDescription, fusedContext);
  }

  const processingTime = Date.now() - startTime;

  return {
    template,
    customizedDescription: baseDescription,
    confidence: calculateFallbackConfidence(template, fusedContext, enableHybridMode),
    source: enableHybridMode ? 'hybrid' : 'template',
    metadata: {
      templateId: template.id,
      customizationLevel: calculateCustomizationLevel(baseDescription, template),
      processingTime,
    }
  };
}

/**
 * Calculate game template score
 */
function calculateGameTemplateScore(context: FusedContext): number {
  let score = 50; // Base score

  // Boost for high confidence
  if (context.confidence > 0.8) score += 20;

  // Boost for visual context
  if (context.primaryContext === 'visual') score += 15;

  // Platform-specific bonuses
  if (context.platformSpecific.playstation) score += 10;
  if (context.platformSpecific.xbox) score += 10;
  if (context.platformSpecific.nintendo) score += 10;
  if (context.platformSpecific.pc) score += 10;
  if (context.platformSpecific.mobile) score += 10;

  // Audience targeting
  if (context.targetAudience === 'professional') score += 5;
  if (context.targetAudience === 'collectors') score += 8;

  return Math.min(100, score);
}

/**
 * Calculate premium game template score
 */
function calculatePremiumGameTemplateScore(context: FusedContext): number {
  let score = 60; // Higher base score

  // Higher emphasis on quality features
  if (context.keyFeatures.some(f => f.includes('premium') || f.includes('elite'))) score += 25;
  if (context.keyFeatures.some(f => f.includes('limited') || f.includes('collector'))) score += 20;

  // Visual analysis weight
  if (context.primaryContext === 'visual') score += 20;

  return Math.min(100, score);
}

/**
 * Calculate accessory template score
 */
function calculateAccessoryTemplateScore(context: FusedContext): number {
  let score = 50;

  // Platform compatibility is crucial for accessories
  if (context.platformSpecific.playstation || context.platformSpecific.xbox ||
    context.platformSpecific.nintendo || context.platformSpecific.pc) {
    score += 30;
  }

  // Visual features for accessories
  if (context.keyFeatures.some(f => f.includes('wireless') || f.includes('bluetooth'))) score += 15;
  if (context.keyFeatures.some(f => f.includes('professional') || f.includes('business'))) score += 10;

  return Math.min(100, score);
}

/**
 * Calculate console template score
 */
function calculateConsoleTemplateScore(context: FusedContext): number {
  let score = 50;

  // Platform specificity is key
  if (context.platformSpecific.playstation) score += 40;
  if (context.platformSpecific.xbox) score += 40;
  if (context.platformSpecific.nintendo) score += 40;

  // Visual context for consoles
  if (context.primaryContext === 'visual') score += 20;

  return Math.min(100, score);
}

/**
 * Calculate mobile game template score
 */
function calculateMobileGameTemplateScore(context: FusedContext): number {
  let score = 50;

  // Mobile-specific features
  if (context.keyFeatures.some(f => f.includes('touchscreen') || f.includes('mobile'))) score += 30;
  if (context.keyFeatures.some(f => f.includes('multiplayer') || f.includes('online'))) score += 15;

  // Platform hints
  if (context.platformSpecific.mobile) score += 25;

  return Math.min(100, score);
}

/**
 * Calculate service template score
 */
function calculateServiceTemplateScore(context: FusedContext): number {
  let score = 50;

  // Service-specific features
  if (context.keyFeatures.some(f => f.includes('subscription') || f.includes('service'))) score += 30;
  if (context.keyFeatures.some(f => f.includes('digital') || f.includes('online'))) score += 20;

  // Professional audience
  if (context.targetAudience === 'professional') score += 15;

  return Math.min(100, score);
}

/**
 * Generate description from template
 */
function generateFromTemplate(
  template: FallbackTemplate,
  context: FusedContext,
  productName: string,
  productNameEn: string
): string {
  console.log(`Generating description from template: ${template.id}`);

  // Extract relevant context
  const platform = getPlatformFromContext(context);
  const audience = context.targetAudience;
  const features = context.keyFeatures;

  // Build description sections
  const sections = [
    generateHookSection(template, productName, audience),
    generateOverviewSection(template, context),
    generateFeaturesSection(template, features, platform),
    generateTechnicalSection(template, context),
    generateMarketingSection(template, audience, platform),
    generateSEOSection(template, productName, productNameEn)
  ];

  return sections.join('\n\n');
}

/**
 * Generate hook section
 */
function generateHookSection(
  template: FallbackTemplate,
  productName: string,
  audience: 'casual' | 'professional' | 'collectors'
): string {
  const hooks = {
    casual: [
      `🎮 اكتشف ${productName} - تجربة ألعاب لا تُنسى!`,
      `🎯 ${productName} - خيارك الأمثل للمتعة الرقمية`,
      `🚀 ${productName} - مستوى جديد من الترفيه والحماس`
    ],
    professional: [
      `🎮 ${productName} - حل احترافي للاعبين المتقدمين`,
      `🎯 ${productName} - أداء احترافي وموثوقية عالية`,
      `🚀 ${productName} - تقنية متقدمة للاستخدام الاحترافي`
    ],
    collectors: [
      `🎮 ${productName} - إضافة ثمينة لمجموعتك`,
      `🏆 ${productName} - نسخة جامعين محدودة`,
      `⭐ ${productName} - قطعة فريدة للمجمّعين`
    ]
  };

  return hooks[audience] || hooks.casual;
}

/**
 * Generate overview section
 */
function generateOverviewSection(
  template: FallbackTemplate,
  context: FusedContext
): string {
  const overviews = {
    'basic-game': `📦 **نظرة عامة:**\nمنتج ألعاب متطور يجمع بين الجودة العالية والأداء المتميز لتجربة غامرة وممتعة.`,
    'premium-game': `📦 **نظرة عامة:**\nمنتج ألعاب فاخر من الفئة المميزة، مصمم للمستخدمين المحترفين والجامعين الذين يبحثون عن الأداء الفائق والجودة الاستثنائية.`,
    'accessory': `📦 **نظرة عامة:**\nإكسسوار ألعاب عالي الجودة، مصمم لتعزيز تجربة الألعاب وتوفير الراحة والأداء الأمثل خلال جلسات الألعاب الطويلة.`,
    'console': `📦 **نظرة عامة:**\نظام ألعاب متطور يوفر أقوى تجربة ألعاب مع تقنيات متطورة وواجهة مستخدم سهلة.`,
    'mobile-game': `📦 **نظرة عامة:**\nلعبة جوال مبتكرة تجمع بين الرسومات المتقدمة واللعب الممتع والمنافسة عبر الإنترنت.`,
    'gaming-service': `📦 **نظرة عامة:**\nخدمة رقمية متكاملة توفر تجربة ألعاب فريدة مع مزايا حصرية ومحتوى حصري.`
  };

  return overviews[template.id] || overviews['basic-game'];
}

/**
 * Generate features section
 */
function generateFeaturesSection(
  template: FallbackTemplate,
  features: string[],
  platform: string
): string {
  const platformFeatures = getPlatformSpecificFeatures(platform);
  const allFeatures = [...features, ...platformFeatures];

  const featureList = allFeatures.map((feature, index) =>
    `• ⭐ ${feature}`
  ).join('\n');

  return `✨ **المميزات الرئيسية:**\n${featureList}`;
}

/**
 * Generate technical section
 */
function generateTechnicalSection(
  template: FallbackTemplate,
  context: FusedContext
): string {
  const specs = template.technicalSpecs.length > 0
    ? template.technicalSpecs.map(spec => `• 🔧 ${spec}`).join('\n')
    : generateDefaultTechnicalSpecs(context);

  return `🔍 **المواصفات الفنية:**\n${specs}`;
}

/**
 * Generate marketing section
 */
function generateMarketingSection(
  template: FallbackTemplate,
  audience: 'casual' | 'professional' | 'collectors',
  platform: string
): string {
  const points = template.marketingPoints.length > 0
    ? template.marketingPoints.map(point => `• 💡 ${point}`).join('\n')
    : generateDefaultMarketingPoints(audience, platform);

  return `💡 **نصائح الخبراء:**\n${points}`;
}

/**
 * Generate SEO section
 */
function generateSEOSection(
  template: FallbackTemplate,
  productName: string,
  productNameEn: string
): string {
  const keywords = generateKeywords(productName, productNameEn, template);

  return `🎯 **وصف الـ SEO:**\n${productName} - ${template.description}\n\n🔑 **الكلمات المفتاحية:**\n${keywords}`;
}

/**
 * Get platform from context
 */
function getPlatformFromContext(context: FusedContext): string {
  if (context.platformSpecific.playstation) return 'playstation';
  if (context.platformSpecific.xbox) return 'xbox';
  if (context.platformSpecific.nintendo) return 'nintendo';
  if (context.platformSpecific.pc) return 'pc';
  if (context.platformSpecific.mobile) return 'mobile';
  return 'universal';
}

/**
 * Get platform-specific features
 */
function getPlatformSpecificFeatures(platform: string): string[] {
  const platformFeatures = {
    playstation: ['DualSense', 'رد فعل هزازي', 'دقة 4K', 'PlayStation Plus'],
    xbox: ['Game Pass', 'Smart Delivery', 'سحابة الألعاب', 'التكامل مع ويندوز'],
    nintendo: ['Joy-Con', 'Nintendo Online', 'ألعاب محمولة', 'العب مع الأصدقاء'],
    pc: ['رسومات قابلة للتعديل', 'Steam', 'Epic Games', 'مودينج'],
    mobile: ['شاشة لمس', 'لعب متعدد اللاعبين', 'منافسة عبر الإنترنت', 'مزامنة عبر السحابة'],
    universal: ['متعدد المنصات', 'توافق واسع', 'سهولة الاستخدام']
  };

  return platformFeatures[platform] || platformFeatures.universal;
}

/**
 * Generate default technical specs
 */
function generateDefaultTechnicalSpecs(context: FusedContext): string[] {
  const specs = [];

  if (context.productCategory === 'game' || context.productCategory === 'digital') {
    specs.push('متوافق مع جميع المنصات الحديثة');
    specs.push('دعم تقنيات العرض المتقدمة');
    specs.push('جودة صوت وصورة عالية');
  }

  if (context.productCategory === 'accessory') {
    specs.push('توصيلات متعددة: بلوتوث، USB، لاسلكي');
    specs.push('بطارية طويلة الأمد');
    specs.push('تصميم مريح للاستخدام الطويل');
  }

  if (context.productCategory === 'console') {
    specs.push('معالج قوي وأداء سلس');
    specs.push('مساحة تخزين واسعة');
    specs.push('دعم أحدث تقنيات الألعاب');
  }

  return specs;
}

/**
 * Generate default marketing points
 */
function generateDefaultMarketingPoints(
  audience: 'casual' | 'professional' | 'collectors',
  platform: string
): string[] {
  const points = [];

  if (audience === 'casual') {
    points.push('مثالية للاستخدام اليومي');
    points.push('تجربة ألعاب غامرة وممتعة');
    points.push('قيمة استثنائية ممتازة');
  }

  if (audience === 'professional') {
    points.push('أداء احترافي وموثوق');
    points.push('موثوقية عالية الجودة');
    points.push('متوافق مع احتياجات اللاعبين المحترفين');
  }

  if (audience === 'collectors') {
    points.push('قيمة استثمارية وجامعية');
    points.push('نسخة محدودة ومطلوبة');
    points.push('إضافة ثمينة لمجموعك');
  }

  // Platform-specific points
  if (platform === 'playstation') {
    points.push('متوافق مع DualSense');
  }
  if (platform === 'xbox') {
    points.push('متوافق مع Game Pass');
  }
  if (platform === 'nintendo') {
    points.push('مثالية للعب العائلي');
  }

  return points;
}

/**
 * Generate keywords
 */
function generateKeywords(
  productName: string,
  productNameEn: string,
  template: FallbackTemplate
): string {
  const baseKeywords = [
    'ألعاب', 'gaming', productName.toLowerCase(), productNameEn.toLowerCase(),
    'بلايستيشن', 'playstation', 'إكس بوكس', 'xbox',
    'نينتندو', 'nintendo', 'كمبيوتر', 'pc',
    'جوال', 'mobile', 'أكسسوارات', 'accessories'
  ];

  const categoryKeywords = template.category === 'game' ? [
    'أكشن', 'action', 'مغامرة', 'رياضة', 'سباق', 'استراتيجي'
  ] : [];

  const keywords = [...baseKeywords, ...categoryKeywords];

  return keywords.join(', ');
}

/**
 * Personalize description
 */
function personalizeDescription(
  description: string,
  context: FusedContext
): string {
  let personalized = description;

  // Add platform-specific personalization
  if (context.platformSpecific.playstation) {
    personalized = personalized.replace(/🎮/g, '🎮️');
  }
  if (context.platformSpecific.xbox) {
    personalized = personalized.replace(/🎮/g, '🎮🟢');
  }
  if (context.platformSpecific.nintendo) {
    personalized = personalized.replace(/🎮/g, '🎮🔴');
  }

  // Add audience-specific personalization
  if (context.targetAudience === 'collectors') {
    personalized = personalized.replace(/مميز/g, 'مميز نادر');
    personalized = personalized.replace(/قيمة/g, 'قيمة استثمارية');
  }

  return personalized;
}

/**
 * Enhance with hybrid features
 */
function enhanceWithHybridFeatures(
  description: string,
  context: FusedContext
): string {
  let enhanced = description;

  // Add visual context indicators
  if (context.primaryContext === 'visual') {
    enhanced = description.replace(/📦 \*\*نظرة عامة:\*\*/g,
      '📦 **نظرة عامة (بناءً على الصور):**');
  }

  // Add confidence indicators
  if (context.confidence > 0.8) {
    enhanced = enhanced.replace(/✨/g, '✨🔥');
  }

  // Add platform-specific enhancements
  if (context.platformSpecific.playstation) {
    enhanced += '\n\n🎯 **ميزة PlayStation:** متوافق مع DualSense وPlayStation Plus';
  }
  if (context.platformSpecific.xbox) {
    enhanced += '\n\n🎯 **ميزة Xbox:** متوافق مع Game Pass وخدمات Xbox Live';
  }
  if (context.platformSpecific.nintendo) {
    enhanced += '\n\n🎯 **ميزة Nintendo:** مثالية للعب العائلي مع Joy-Con';
  }

  return enhanced;
}

/**
 * Calculate fallback confidence
 */
function calculateFallbackConfidence(
  template: FallbackTemplate,
  context: FusedContext,
  enableHybridMode: boolean
): number {
  let confidence = 50; // Base confidence

  // Template matching bonus
  if (template.id === 'premium-game' && context.productCategory === 'game') confidence += 20;
  if (template.id === 'accessory' && context.productCategory === 'accessory') confidence += 25;

  // Context alignment bonus
  if (context.confidence > 0.7) confidence += 15;
  if (context.primaryContext === 'balanced') confidence += 10;

  // Hybrid mode bonus
  if (enableHybridMode) confidence += 10;

  return Math.min(100, confidence);
}

/**
 * Calculate customization level
 */
function calculateCustomizationLevel(
  description: string,
  template: FallbackTemplate
): number {
  let level = 30; // Base level

  // Length customization
  const length = description.length;
  if (length > template.description.length * 1.2) level += 20;
  if (length < template.description.length * 0.8) level -= 10;

  // Feature customization
  const featureCount = (description.match(/•/g) || []).length;
  if (featureCount > 5) level += 15;

  // Personalization indicators
  if (description.includes('🎮️') || description.includes('🎮🟢')) level += 10;
  if (description.includes('مميز نادر')) level += 15;

  return Math.min(100, level);
}

/**
 * Fallback templates library
 */
const TEMPLATES: Record<FallbackTemplateType, FallbackTemplate> = {
  'basic-game': {
    id: 'basic-game',
    name: 'Basic Game Template',
    description: 'منتج ألعاب عالي الجودة يوفر تجربة ممتعة',
    features: ['رسومات عالية الدقة', 'لعب سلس', 'قصة مثيرة', 'موسيقى تصويرية'],
    technicalSpecs: ['دعم HD', '60 إطار في الثانية', 'صوت ستيريو'],
    marketingPoints: ['قيمة ممتازة', 'مثالية للاستخدام اليومي', 'تتوافق مع جميع المنصات'],
    targetAudience: 'casual',
    platformSpecific: ['universal'],
    category: 'game'
  },
  'premium-game': {
    id: 'premium-game',
    name: 'Premium Game Template',
    description: 'منتج ألعاب فاخر من الفئة المميزة للمستخدمين المحترفين',
    features: ['رسومات واقعية', 'مؤثرات صوتية', 'تتبع حركة متقدمة', 'دعم 4K'],
    technicalSpecs: ['رسومات 4K HDR', '120 إطار', 'دعم Dolby Atmos', 'مساحة تخزين كبيرة'],
    marketingPoints: ['أداء احترافي', 'موثوقية عالية', 'ميزات حصرية', 'تحديثات مجانية'],
    targetAudience: 'professional',
    platformSpecific: ['universal'],
    category: 'game'
  },
  'accessory': {
    id: 'accessory',
    name: 'Gaming Accessory Template',
    description: 'إكسسوار ألعاب عالي الجودة لتعزيز تجربة الألعاب',
    features: ['تصميم مريح', 'توصيلات متعددة', 'بطارية طويلة', 'ميكروفون مدمج'],
    technicalSpecs: ['توصيل بلوتوث', 'توصيل USB-C', 'اتصال لاسلكي', 'مدة تشغيل 40 ساعة'],
    marketingPoints: ['متوافق مع جميع المنصات', 'جودة صوت عالية', 'ضمان سنة'],
    targetAudience: 'casual',
    platformSpecific: ['universal'],
    category: 'accessory'
  },
  'console': {
    id: 'console',
    name: 'Gaming Console Template',
    description: 'نظام ألعاب متطور مع تقنيات حديثة',
    features: ['معالج قوي', 'رسومات متقدمة', 'مساحة تخزين واسعة', 'دعم ألعاب عبر الإنترنت'],
    technicalSpecs: ['معالج مخصص', 'ذااكرة وصول عشوائي', 'دعم 4K/8K', 'واي فاي'],
    marketingPoints: ['أقوى تجربة ألعاب', 'مكتبة ألعاب ضخمة', 'توافق مع جميع الألعاب', 'خدمات عبر الإنترنت'],
    targetAudience: 'casual',
    platformSpecific: ['universal'],
    category: 'console'
  },
  'mobile-game': {
    id: 'mobile-game',
    name: 'Mobile Game Template',
    description: 'لعبة جوال مبتكرة مع رسومات متقدمة',
    features: ['شاشة لمس', 'لعب متعدد اللاعبين', 'منافسة عبر الإنترنت', 'مزامنة عبر السحابة'],
    technicalSpecs: ['رسومات HD', 'معالج قوي', 'بطارية تدوم طويلاً', 'دعم الشبكات اللاسلكية'],
    marketingPoints: ['لعب في أي مكان', 'مزامنة تلقائية', 'تحديثات منتظمة', 'مجتمع لاعبين نشط'],
    targetAudience: 'casual',
    platformSpecific: ['universal'],
    category: 'game'
  },
  'gaming-service': {
    id: 'gaming-service',
    name: 'Gaming Service Template',
    description: 'خدمة رقمية متكاملة لتجربة ألعاب فريدة',
    features: ['وصول حصري', 'ألعاب حصرية', 'مجتمع نشط', 'عروض خاصة', 'دعم فني'],
    technicalSpecs: ['خوادم سريعة', 'تدفق عالي الجودة', 'تشفير من طرف إلى طرف', 'متعدد المنصات'],
    marketingPoints: ['وصول غير محدود', 'محتوى حصري', 'عروض حصرية', 'مجتمع حصري'],
    targetAudience: 'professional',
    platformSpecific: ['universal'],
    category: 'digital'
  }
};

/**
 * Get available templates
 */
export function getAvailableTemplates(): FallbackTemplate[] {
  return Object.values(TEMPLATES);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: FallbackTemplateType): FallbackTemplate | undefined {
  return TEMPLATES[id];
}

/**
 * Learn from successful generations
 */
export function learnFromGeneration(
  templateId: FallbackTemplateType,
  context: FusedContext,
  userFeedback?: { rating: number; edits?: string[] }
): void {
  // This would typically save to a database or analytics
  // For now, just log the learning event
  console.log('Learning from generation:', {
    templateId,
    context,
    userFeedback
  });
}