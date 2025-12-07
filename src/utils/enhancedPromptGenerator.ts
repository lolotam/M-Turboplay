import { LLMProvider, ProviderConfig } from '@/contexts/SettingsContext';
import { FusedContext } from './contextFusion';
import { callLLM } from './llmIntegration';

/**
 * Enhanced prompt generation configuration
 */
export interface EnhancedPromptConfig {
  provider: LLMProvider;
  culturalLevel: 'conservative' | 'moderate' | 'liberal';
  targetAudience: 'casual' | 'professional' | 'collectors';
  promptComplexity: 'simple' | 'standard' | 'detailed';
  includeMarketing: boolean;
  includeTechnicalSpecs: boolean;
}

/**
 * Generated prompt result
 */
export interface GeneratedPrompt {
  prompt: string;
  metadata: {
    wordCount: number;
    culturalAdaptations: string[];
    gamingTerminology: string[];
    structureType: string;
  };
}

/**
 * Gulf Arabic cultural context
 */
const GULF_CULTURAL_CONTEXT = {
  // Common gaming terms in Gulf Arabic
  gamingTerms: {
    playstation: 'بلايستيشن',
    xbox: 'إكس بوكس',
    nintendo: 'نينتندو',
    pc: 'كمبيوتر',
    mobile: 'جوال',
    controller: 'متحكم',
    headset: 'سماعة رأس',
    digital: 'رقمي',
    physical: 'مادي',
    premium: 'مميز',
    exclusive: 'حصري',
    limited: 'محدود',
    collector: 'مجمّع',
    edition: 'نسخة'
  },

  // Cultural expressions and idioms
  expressions: {
    excitement: ['مذهل', 'رائع', 'ممتع', 'لا يُقاوم'],
    quality: ['جودة عالية', 'ممتاز', 'احترافي', 'فائق'],
    recommendation: ['ننصح بشدة', 'مثالي لـ', 'خيارك الأمثل'],
    gaming: ['تجربة ألعاب لا تُنسى', 'مستوى جديد من الترفيه', 'سيطر عالم الألعاب']
  },

  // Marketing language
  marketing: {
    callToAction: ['احصل عليه الآن', 'استمتع بـ', 'انطلق في مغامرات جديدة'],
    urgency: ['فرصة محدودة', 'وقت محدود', 'لن يدوم طويلاً'],
    value: ['قيمة استثنائية', 'استثمار في المتعة', 'جودة تستحق السعر']
  }
};

/**
 * Gaming platform terminology
 */
const PLATFORM_TERMINOLOGY = {
  playstation: {
    features: ['DualSense', 'PS5', 'PS Plus', 'حصري', 'مميز'],
    genres: ['أكشن', 'مغامرات', 'رياضة', 'سباق', 'استراتيجي'],
    technical: ['دقة 4K', 'رسومات متقدمة', 'تتبع الحركة', 'رد فعل هزازي']
  },
  xbox: {
    features: ['Game Pass', 'Xbox Series X', 'Smart Delivery', 'خدمة ذكية', 'توصيل'],
    genres: ['أكشن', 'سباق', 'رياضة', 'محاكاة', 'عالم مفتوح'],
    technical: ['دقة عالية', 'أداء قوي', 'سحابة الألعاب', 'التكامل مع ويندوز']
  },
  nintendo: {
    features: ['Switch', 'Joy-Con', 'Nintendo Online', 'محمول', 'أونلاين'],
    genres: ['منصات', 'مغامرات', 'رياضة', 'عائلي', 'تعليمي'],
    technical: ['محمول بالكامل', 'ألعاب مستقلة', 'واقع معزز', 'تعدد لاعبين']
  },
  pc: {
    features: ['Steam', 'Epic Games', 'RTX', 'مودينج', 'رسومات'],
    genres: ['استراتيجي', 'محاكاة', 'MMORPG', 'مستقل', 'فري ساند'],
    technical: ['دقة عالية', '60 إطار في الثانية', 'دعم لوحة المفاتيح', 'قابل للتعديل']
  },
  mobile: {
    features: [' touchscreen', 'مستشعر', 'لمس', 'ألعاب الجوال'],
    genres: ['ألغاز', 'كازينو', 'استراتيجي', 'منصات', 'وقت محدود'],
    technical: ['تحكم باللمس', 'رسومات ثلاثية الأبعاد', 'قابل للعب', 'مجاني']
  }
};

/**
 * Generate enhanced Arabic description prompt
 */
export function generateEnhancedPrompt(
  fusedContext: FusedContext,
  productName: string,
  productNameEn: string,
  productDescriptionEn?: string,
  config: Partial<EnhancedPromptConfig> = {}
): GeneratedPrompt {
  const {
    provider = 'openai',
    culturalLevel = 'moderate',
    targetAudience = 'casual',
    promptComplexity = 'standard',
    includeMarketing = true,
    includeTechnicalSpecs = true
  } = config;

  // Build base prompt structure
  const basePrompt = buildBasePrompt(fusedContext, productName, productNameEn, productDescriptionEn);

  // Add cultural adaptations
  const culturalPrompt = addCulturalContext(basePrompt, culturalLevel, targetAudience);

  // Add gaming terminology
  const gamingPrompt = addGamingTerminology(culturalPrompt, fusedContext.platformSpecific);

  // Add marketing elements if requested
  const marketingPrompt = includeMarketing ? addMarketingElements(gamingPrompt, fusedContext) : gamingPrompt;

  // Add technical specifications if requested
  const technicalPrompt = includeTechnicalSpecs ? addTechnicalSpecifications(marketingPrompt, fusedContext) : marketingPrompt;

  // Add complexity adjustments
  const finalPrompt = adjustForComplexity(technicalPrompt, promptComplexity);

  // Generate metadata
  const metadata = generatePromptMetadata(finalPrompt, fusedContext, config);

  return {
    prompt: finalPrompt,
    metadata
  };
}

/**
 * Build base prompt structure
 */
function buildBasePrompt(
  fusedContext: FusedContext,
  productName: string,
  productNameEn: string,
  productDescriptionEn?: string
): string {
  const contextInfo = `
معلومات السياق:
- اسم المنتج (عربي): ${productName}
- اسم المنتج (إنجليزي): ${productNameEn}
${productDescriptionEn ? `- الوصف الأصلي (إنجليزي): ${productDescriptionEn}` : ''}
- فئة المنتج: ${fusedContext.productCategory}
- الجمهور المستهدف: ${fusedContext.targetAudience}
- السياق الأساسي: ${fusedContext.primaryContext}
- الثقة في التحليل: ${(fusedContext.confidence * 100).toFixed(0)}%
${fusedContext.conflictResolution ? `
- ملاحظات: ${fusedContext.conflictResolution.explanation}
` : ''}

الميزات الرئيسية (من التحليل):
${fusedContext.keyFeatures.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}

المعلومات الخاصة بالمنصة:
${Object.entries(fusedContext.platformSpecific)
      .filter(([_, isPlatform]) => isPlatform)
      .map(([platform, _]) => `- ${getArabicPlatformName(platform)}: متوافق`)
      .join('\n')}
`;

  return `أنت خبير تسويق وألعاب محترف متخصص في السوق الخليجي.
مهمتك: كتابة وصف منتج جذاب واحترافي باللغة العربية بناءً على البيانات المقدمة، خاصة الوصف الإنجليزي الأصلي وتحليل الصور.

${contextInfo}

المتطلبات الأساسية (Critical Requirements):
1. **المصدر الرئيسي**: اعتمد بشكل أساسي على "اسم المنتج (إنجليزي)" و "الوصف الأصلي (إنجليزي)" لاستخراج المعلومات والمواصفات الدقيقة. لا تخترع ميزات غير موجودة.
2. **التنسيق الإلزامي**: يجب أن يكون الإخراج عبارة عن *نقاط* (Bullet Points) مع *رموز تعبيرية* (Emojis) في بداية كل سطر.
3. **اللهجة**: استخدم لغة عربية فصحى سلسة ومفهومة مع نكهة خليجية محببة للاعبين.
4. **الدقة**: تأكد من أن الوصف العربي يطابق المنتج الفعلي الموصوف بالإنجليزية والصور.

تنسيق الإجابة المطلوب (Response Format):
يجب أن يكون الرد بهذا الشكل تماماً (بدون مقدمات إضافية):

🔥 [جملة افتتاحية قوية جداً تجذب الانتباه]

📦 **تفاصيل المنتج:**
• 🎮 **النوع:** [نوع اللعبة/المنتج]
• 📱 **المنصات:** [المنصات المتوافقة]
• 🌍 **المنطقة/النسخة:** [عالمي/أوروبي/الخ] (استنتج من العنوان أو الوصف)

✨ **لماذا ستحب هذا المنتج؟**
• 🤩 [ميزة 1 مستخلصة من الوصف الإنجليزي]
• 🚀 [ميزة 2 مستخلصة من الوصف الإنجليزي]
• 💎 [ميزة 3 - جودة/أداء]
• 🛡️ [ميزة 4 - ضمان/أمان]

💡 **معلومات إضافية:**
• ✅ [معلومة مهمة 1]
• ✅ [معلومة مهمة 2]

🔑 **كلمات مفتاحية:** [5 كلمات مفتاحية تفصل بينها فواصل]`;
}

/**
 * Add cultural context to prompt
 */
function addCulturalContext(
  prompt: string,
  culturalLevel: 'conservative' | 'moderate' | 'liberal',
  targetAudience: 'casual' | 'professional' | 'collectors'
): string {
  const culturalGuidelines = {
    conservative: {
      tone: 'رسمي ومحافظ',
      expressions: ['ممتاز', 'عالي الجودة', 'موثوق'],
      avoid: ['عامي', 'ساخر', 'مبالغ']
    },
    moderate: {
      tone: 'ودودي وعصري',
      expressions: ['رائع', 'مثير للاهتمام', 'ممتع', 'مبتكر'],
      avoid: ['كلاسيكي جداً', 'جامد جداً']
    },
    liberal: {
      tone: 'عصري وجذاب',
      expressions: ['مذهل', 'لا يُقاوم', 'خارق', 'ثوري'],
      avoid: ['رسمي جداً', 'محافظ']
    }
  };

  const audienceGuidelines = {
    casual: {
      language: 'لغة بسيطة ومفهومة',
      focus: ['المتعة', 'السهولة', 'التشويق'],
      examples: ['استمتع بـ', 'لعبة ممتعة', 'تجربة فريدة']
    },
    professional: {
      language: 'لغة احترافية ومتخصصة',
      focus: ['الأداء', 'الجودة', 'الموثوقية', 'الكفاءة'],
      examples: ['محرك أداء قوي', 'مكونات عالية الجودة', 'موثوقية عالية']
    },
    collectors: {
      language: 'لغة تقدر القيمة والندرة',
      focus: ['الندرة', 'القيمة', 'الجمع', 'الإصدار المحدود'],
      examples: ['قطعة نادرة', 'نسخة جامعين', 'استثمار قيم']
    }
  };

  const cultural = culturalGuidelines[culturalLevel];
  const audience = audienceGuidelines[targetAudience];

  return `${prompt}

الإرشادات الثقافية:
- النبرة: ${cultural.tone}
- التعبيرات المفضلة: ${cultural.expressions.join(', ')}
- تجنب التعبيرات: ${cultural.avoid.join(', ')}
- لغة الجمهور: ${audience.language}
- التركيز على: ${audience.focus.join(', ')}
- أمثلة: ${audience.examples.join(', ')}

الاعتبارات الثقافية لمنطقة الخليج:
- استخدام اللهجة الخليجية في المصطلحات
- مراعاة العادات والتقاليد المحلية
- تجنب المحتوى الحساس ثقافياً
- التركيز على القيم المشتركة (العائلة، الاحترام، الجودة)`;
}

/**
 * Add gaming terminology to prompt
 */
function addGamingTerminology(
  prompt: string,
  platformSpecific: FusedContext['platformSpecific']
): string {
  const platformTerms = Object.entries(platformSpecific)
    .filter(([_, isPlatform]) => isPlatform)
    .map(([platform, _]) => {
      const terms = PLATFORM_TERMINOLOGY[platform as keyof typeof PLATFORM_TERMINOLOGY];
      return terms ? `
مصطلحات ${getArabicPlatformName(platform)}:
- الميزات: ${terms.features.join(', ')}
- الأنواع: ${terms.genres.join(', ')}
- التقني: ${terms.technical.join(', ')}
` : '';
    })
    .join('\n');

  return `${prompt}

${platformTerms}

مصطلحات الألعاب العامة:
- ${Object.entries(GULF_CULTURAL_CONTEXT.gamingTerms)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n- ')}`;
}

/**
 * Add marketing elements to prompt
 */
function addMarketingElements(
  prompt: string,
  fusedContext: FusedContext
): string {
  const marketingElements = [];

  // Add urgency if limited product
  if (fusedContext.keyFeatures.some(f => f.includes('محدود') || f.includes('حصري'))) {
    marketingElements.push(GULF_CULTURAL_CONTEXT.marketing.urgency[0]);
  }

  // Add value proposition
  marketingElements.push(GULF_CULTURAL_CONTEXT.marketing.value[0]);

  // Add call to action
  marketingElements.push(GULF_CULTURAL_CONTEXT.marketing.callToAction[0]);

  // Add excitement expressions
  marketingElements.push(...GULF_CULTURAL_CONTEXT.expressions.excitement.slice(0, 2));

  return `${prompt}

عناصر التسويق:
- ${marketingElements.join('\n- ')}

دعوات التسويق المقترحة:
- ${GULF_CULTURAL_CONTEXT.marketing.callToAction.join(', ')}`;
}

/**
 * Add technical specifications to prompt
 */
function addTechnicalSpecifications(
  prompt: string,
  fusedContext: FusedContext
): string {
  const specs = [];

  // Add platform-specific specs
  if (fusedContext.platformSpecific.playstation) {
    specs.push('دعم DualSense', 'رسومات PS5', 'تتبع الحركة');
  }
  if (fusedContext.platformSpecific.xbox) {
    specs.push('توافق Xbox Series X', 'Game Pass', 'سحابة الألعاب');
  }
  if (fusedContext.platformSpecific.nintendo) {
    specs.push('متوافق مع Nintendo Switch', 'دعم Joy-Con');
  }
  if (fusedContext.platformSpecific.pc) {
    specs.push('متطلبات النظام الموصى', 'دعم Steam', 'رسومات قابلة للتعديل');
  }
  if (fusedContext.platformSpecific.mobile) {
    specs.push('تحكم باللمس', 'رسومات ثلاثية الأبعاد', 'قابل للعب أونلاين');
  }

  if (specs.length > 0) {
    return `${prompt}

المواصفات الفنية المطلوبة:
- ${specs.join('\n- ')}`;
  }

  return prompt;
}

/**
 * Adjust prompt for complexity level
 */
function adjustForComplexity(
  prompt: string,
  complexity: 'simple' | 'standard' | 'detailed'
): string {
  const adjustments = {
    simple: {
      wordCount: '150-200 كلمة',
      sections: ['الخط التعريفي', 'الميزات الرئيسية', 'الوصف'],
      detail: 'استخدم جمل قصيرة ومباشرة'
    },
    standard: {
      wordCount: '250-350 كلمة',
      sections: ['الخط التعريفي', 'تفاصيل المنتج', 'المميزات الرئيسية', 'المواصفات الفنية', 'نصيحة الخبراء', 'وصف الـ SEO'],
      detail: 'استخدم وصفاً متوازناً مع تفاصيل كافية'
    },
    detailed: {
      wordCount: '400-500 كلمة',
      sections: ['الخط التعريفي', 'تفاصيل المنتج', 'المميزات الرئيسية', 'المواصفات الفنية', 'نصيحة الخبراء', 'وصف الـ SEO', 'ملاحظات إضافية'],
      detail: 'استخدم وصفاً شاملاً مع أمثلة وتفاصيل دقيقة'
    }
  };

  const adjustment = adjustments[complexity];

  return `${prompt}

مستوى التعقيد:
- عدد الكلمات المستهدف: ${adjustment.wordCount}
- الأقسام المطلوبة: ${adjustment.sections.join(', ')}
- مستوى التفصيل: ${adjustment.detail}`;
}

/**
 * Generate prompt metadata
 */
function generatePromptMetadata(
  prompt: string,
  fusedContext: FusedContext,
  config: Partial<EnhancedPromptConfig>
): GeneratedPrompt['metadata'] {
  const wordCount = prompt.length / 6; // Approximate Arabic words
  const culturalAdaptations = [];
  const gamingTerminology = [];

  // Extract cultural adaptations
  if (prompt.includes('خليج')) culturalAdaptations.push('لهجة خليجية');
  if (prompt.includes('عربي')) culturalAdaptations.push('لغة عربية فصحى');
  if (prompt.includes('ثقافي')) culturalAdaptations.push('توافق ثقافي');

  // Extract gaming terminology
  Object.entries(GULF_CULTURAL_CONTEXT.gamingTerms).forEach(([key, value]) => {
    if (prompt.includes(value)) {
      gamingTerminology.push(`${key}: ${value}`);
    }
  });

  return {
    wordCount,
    culturalAdaptations,
    gamingTerminology,
    structureType: config.promptComplexity || 'standard'
  };
}

/**
 * Get Arabic platform name
 */
function getArabicPlatformName(platform: string): string {
  const platformNames: Record<string, string> = {
    playstation: 'بلايستيشن',
    xbox: 'إكس بوكس',
    nintendo: 'نينتندو',
    pc: 'كمبيوتر',
    mobile: 'جوال'
  };

  return platformNames[platform] || platform;
}

/**
 * Generate description with specific provider
 */
export async function generateDescriptionWithProvider(
  fusedContext: FusedContext,
  productName: string,
  productNameEn: string,
  productDescriptionEn?: string,
  config: Partial<EnhancedPromptConfig> = {}
): Promise<{ content: string; metadata: GeneratedPrompt['metadata'] }> {
  const { provider = 'openai' } = config;

  const generatedPrompt = generateEnhancedPrompt(fusedContext, productName, productNameEn, productDescriptionEn, config);

  // Get provider configuration
  const providerConfig = getProviderConfig(provider);
  if (!providerConfig.apiKey) {
    throw new Error(`No API key configured for ${provider}`);
  }

  console.log(`Generating description with ${provider} using enhanced prompt`);

  const response = await callLLM(generatedPrompt.prompt, provider, providerConfig);

  if (response.error) {
    throw new Error(response.error);
  }

  return {
    content: response.content.trim(),
    metadata: generatedPrompt.metadata
  };
}

/**
 * Get provider configuration from localStorage
 */
function getProviderConfig(provider: LLMProvider): ProviderConfig {
  const settings = localStorage.getItem('growgarden-admin-settings');
  let defaultConfig = {
    apiKey: '',
    model: provider === 'openai' ? 'gpt-4o' :
      provider === 'claude' ? 'claude-3-opus-20240229' :
        provider === 'openrouter' ? 'google/gemini-pro' :
          'sonar',
    temperature: 0.7,
    maxTokens: 2000,
    isEnabled: true,
  };

  if (settings) {
    try {
      const parsedSettings = JSON.parse(settings);

      // Handle encoded API keys if present (simple check)
      const decodeApiKey = (encoded: string) => {
        try { return atob(encoded).split('').reverse().join(''); } catch { return ''; }
      };

      if (parsedSettings.providers && parsedSettings.providers[provider]) {
        const storedConfig = parsedSettings.providers[provider];
        // Check if key needs decoding (if it looks base64-ish and settings were saved via context)
        // Note: The SettingsContext saves encoded keys. We must decode them here if we are reading raw localStorage.
        // Ideally this function should access the Context, but since it's a util, it might be used outside React tree?
        // Let's assume we need to decode.

        return {
          ...defaultConfig,
          ...storedConfig,
          apiKey: storedConfig.apiKey ? decodeApiKey(storedConfig.apiKey) : ''
        };
      }
    } catch (e) {
      console.warn('Failed to parse AI settings:', e);
    }
  }

  return defaultConfig;
}

/**
 * Get supported cultural levels
 */
export function getSupportedCulturalLevels(): Array<{ value: string; label: string }> {
  return [
    { value: 'conservative', label: 'محافظ (مناسب للأسواق التقليدية)' },
    { value: 'moderate', label: 'معتدل (توازن بين الحداثة والتقاليد)' },
    { value: 'liberal', label: 'عصري (مناسب للشباب والأسواق الحديثة)' }
  ];
}

/**
 * Get supported complexity levels
 */
export function getSupportedComplexityLevels(): Array<{ value: string; label: string }> {
  return [
    { value: 'simple', label: 'بسيط (150-200 كلمة)' },
    { value: 'standard', label: 'قياسي (250-350 كلمة)' },
    { value: 'detailed', label: 'مفصل (400-500 كلمة)' }
  ];
}