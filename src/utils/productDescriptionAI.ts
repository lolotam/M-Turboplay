import { callLLM } from './llmIntegration';
import { LLMProvider } from '@/contexts/SettingsContext';

export interface ProductDescriptionRequest {
  productName: string;
  productImage?: string;
  language: 'ar' | 'en';
  provider?: LLMProvider;
}

/**
 * Generate product description using AI
 */
export async function generateProductDescription({
  productName,
  productImage,
  language,
  provider = 'openai'
}: ProductDescriptionRequest): Promise<string> {
  try {
    // Get AI settings from localStorage or use defaults
    const settings = localStorage.getItem('aiSettings');
    let providerConfig = {
      apiKey: '',
      model: provider === 'openai' ? 'gpt-3.5-turbo' : 'claude-3-haiku-20240307',
      temperature: 0.7,
      maxTokens: 1000,
      isEnabled: true,
    };

    if (settings) {
      try {
        const parsedSettings = JSON.parse(settings);
        if (parsedSettings[provider]) {
          providerConfig = {
            ...providerConfig,
            ...parsedSettings[provider],
          };
        }
      } catch (e) {
        console.warn('Failed to parse AI settings:', e);
      }
    }

    // Check if API key is available
    if (!providerConfig.apiKey) {
      // Fallback to template-based generation when no API key is configured
      return generateTemplateDescription(productName, productImage, language);
    }

    // Create prompt based on language
    const prompt = language === 'ar'
      ? createArabicDescriptionPrompt(productName, productImage)
      : createEnglishDescriptionPrompt(productName, productImage);

    const response = await callLLM(prompt, provider, providerConfig);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.content || response.content.trim().length === 0) {
      throw new Error('No response received from AI provider');
    }

    return response.content.trim();
  } catch (error) {
    console.error('Error generating product description:', error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('AI provider API key not configured. Please configure your AI settings in the admin panel first.');
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw error;
    }

    throw new Error('Failed to generate description. Please try again.');
  }
}

/**
 * Create Arabic description prompt
 */
function createArabicDescriptionPrompt(productName: string, productImage?: string): string {
  return `You are a professional product copywriter specializing in gaming and entertainment products. Analyze the provided product name and image to create an engaging, keyword-rich product description in Arabic.

IMPORTANT: Format your response as a properly structured description with clear sections and line breaks for textarea display:

🎯 الخط التعريفي الأول:
اكتشف ${productName} - المنتج الاستثنائي الذي يجمع بين الجودة العالية والتكنولوجيا المتقدمة لتجربة ألعاب لا تُنسى.

📦 تفاصيل المنتج:
• منتج ألعاب متطور بمواصفات احترافية عالية الجودة
• تصميم عصري يلبي احتياجات اللاعبين المحترفين والمبتدئين
• أداء متميز مع تكنولوجيا حديثة لأفضل تجربة ترفيهية
• جودة ممتازة تضمن متانة طويلة الأمد

✨ المميزات الرئيسية:
• ⭐ جودة عالية معتمدة للألعاب المتطورة
• 🔧 أداء تقني متفوق في جميع الظروف
• 💪 قوة ومتانة استثنائية للاستخدام اليومي
• 🎮 تجربة ترفيهية غامرة وممتعة
• 🛡️ ضمان شامل ضد عيوب التصنيع
• 🚀 سرعة استجابة فائقة للألعاب السريعة
• 💎 مواد فاخرة مقاومة للتآكل والخدش

🔍 المواصفات الفنية:
• خامات عالية الجودة من أفضل المواد المتوفرة
• تصميم مريح وسهل الاستخدام لساعات طويلة
• متوافق مع جميع أنظمة الألعاب الحديثة
• يتضمن جميع الملحقات الأساسية للاستخدام الفوري

💡 نصيحة الخبراء:
استخدم ${productName} في بيئة جيدة التهوية للحصول على أفضل أداء وللحفاظ على جودته لأطول فترة ممكنة.

🎯 وصف الـ SEO:
${productName} - خيارك الأمثل لتجربة ألعاب استثنائية وجودة لا تُضاهى. اكتشف عالم الترفيه الرقمي بحلول متطورة وجودة عالية.

الكلمات المفتاحية الرئيسية للتركيز: ألعاب، بلايستيشن، إكس بوكس، نينتندو، ألعاب كمبيوتر، إكسسوارات ألعاب، جودة عالية، أداء متميز، متانة، ترفيه، ألعاب حديثة، تكنولوجيا متقدمة، تصميم عصري، سهولة استخدام، ضمان، أمان، سرعة، دقة، متعة، إبداع، احترافية، كفاءة، قيمة مقابل السعر

Product Name: ${productName}
${productImage ? `Product Image: ${productImage}` : ''}`;
}

/**
 * Generate template-based description as fallback when AI is not configured
 */
function generateTemplateDescription(productName: string, productImage?: string, language?: string): string {
  const isArabic = language === 'ar';

  if (isArabic) {
    return `🎯 الخط التعريفي الأول:
اكتشف ${productName} - المنتج الاستثنائي الذي يجمع بين الجودة العالية والتكنولوجيا المتقدمة لتجربة ألعاب لا تُنسى.

📦 تفاصيل المنتج:
• منتج ألعاب متطور بمواصفات احترافية عالية الجودة
• تصميم عصري يلبي احتياجات اللاعبين المحترفين والمبتدئين
• أداء متميز مع تكنولوجيا حديثة لأفضل تجربة ترفيهية
• جودة ممتازة تضمن متانة طويلة الأمد

✨ المميزات الرئيسية:
• ⭐ جودة عالية معتمدة للألعاب المتطورة
• 🔧 أداء تقني متفوق في جميع الظروف
• 💪 قوة ومتانة استثنائية للاستخدام اليومي
• 🎮 تجربة ترفيهية غامرة وممتعة
• 🛡️ ضمان شامل ضد عيوب التصنيع
• 🚀 سرعة استجابة فائقة للألعاب السريعة
• 💎 مواد فاخرة مقاومة للتآكل والخدش

🔍 المواصفات الفنية:
• خامات عالية الجودة من أفضل المواد المتوفرة
• تصميم مريح وسهل الاستخدام لساعات طويلة
• متوافق مع جميع أنظمة الألعاب الحديثة
• يتضمن جميع الملحقات الأساسية للاستخدام الفوري

💡 نصيحة الخبراء:
استخدم ${productName} في بيئة جيدة التهوية للحصول على أفضل أداء وللحفاظ على جودته لأطول فترة ممكنة.

🎯 وصف الـ SEO:
${productName} - خيارك الأمثل لتجربة ألعاب استثنائية وجودة لا تُضاهى. اكتشف عالم الترفيه الرقمي بحلول متطورة وجودة عالية.`;
  } else {
    return `🎯 Product Hook:
Discover ${productName} - the exceptional gaming product that combines premium quality with cutting-edge technology for an unforgettable gaming experience.

📦 Product Overview:
• Advanced gaming product with professional-grade specifications
• Modern design meeting needs of both professional and casual gamers
• Superior performance with contemporary technology for optimal entertainment
• Excellent quality ensuring long-term durability

✨ Key Features:
• ⭐ Premium quality certified for advanced gaming
• 🔧 Superior technical performance in all conditions
• 💪 Exceptional strength and durability for daily use
• 🎮 Immersive and enjoyable entertainment experience
• 🛡️ Comprehensive warranty against manufacturing defects
• 🚀 Ultra-fast response time for action-packed games
• 💎 Premium materials resistant to wear and scratches

🔍 Technical Specifications:
• High-quality materials from the finest available components
• Comfortable design for extended gaming sessions
• Compatible with all modern gaming systems
• Includes all essential accessories for immediate use

💡 Expert Tip:
Use ${productName} in a well-ventilated area for optimal performance and to maintain its quality for the longest possible time.

🎯 SEO Description:
${productName} - your optimal choice for exceptional gaming experience and unmatched quality. Discover the world of digital entertainment with advanced solutions and superior quality.`;
  }
}

/**
 * Create English description prompt
 */
function createEnglishDescriptionPrompt(productName: string, productImage?: string): string {
  return `You are a professional gaming and entertainment product copywriter. Create an engaging, keyword-rich product description in English with proper formatting for textarea display.

IMPORTANT: Format your response as a properly structured description with clear sections and line breaks:

🎯 Product Hook:
Discover ${productName} - the exceptional gaming product that combines premium quality with cutting-edge technology for an unforgettable gaming experience.

📦 Product Overview:
• Advanced gaming product with professional-grade specifications
• Modern design meeting needs of both professional and casual gamers
• Superior performance with contemporary technology for optimal entertainment
• Excellent quality ensuring long-term durability

✨ Key Features:
• ⭐ Premium quality certified for advanced gaming
• 🔧 Superior technical performance in all conditions
• 💪 Exceptional strength and durability for daily use
• 🎮 Immersive and enjoyable entertainment experience
• 🛡️ Comprehensive warranty against manufacturing defects
• 🚀 Ultra-fast response time for action-packed games
• 💎 Premium materials resistant to wear and scratches

🔍 Technical Specifications:
• High-quality materials from the finest available components
• Comfortable design for extended gaming sessions
• Compatible with all modern gaming systems
• Includes all essential accessories for immediate use

💡 Expert Tip:
Use ${productName} in a well-ventilated area for optimal performance and to maintain its quality for the longest possible time.

🎯 SEO Description:
${productName} - your optimal choice for exceptional gaming experience and unmatched quality. Discover the world of digital entertainment with advanced solutions and superior quality.

Focus Keywords: gaming, PlayStation, Xbox, Nintendo, PC games, gaming accessories, high quality, premium performance, durability, entertainment, modern gaming, advanced technology, contemporary design, ease of use, warranty, safety, speed, precision, fun, creativity, professional, efficiency, value for money, gaming experience, immersive entertainment, cutting-edge technology

Product Name: ${productName}
${productImage ? `Product Image: ${productImage}` : ''}`;
}