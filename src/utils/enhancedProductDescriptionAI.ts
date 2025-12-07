import { LLMProvider } from '@/contexts/SettingsContext';
import { analyzeProductImage, analyzeProductImages } from '@/components/ai/imageAnalyzer';
import { fuseContext } from './contextFusion';
import { generateEnhancedPrompt, generateDescriptionWithProvider } from './enhancedPromptGenerator';
import { validateArabicText, ValidationResult } from './arabicValidator';
import { generateSmartFallback, FallbackResult } from './smartFallback';

/**
 * Enhanced product description generation request
 */
export interface EnhancedProductDescriptionRequest {
  productName: string;
  productNameEn: string;
  productDescriptionEn?: string; // Added for translation/adaptation source
  productImages?: string[];
  language: 'ar' | 'en';
  provider?: LLMProvider;
  enableImageAnalysis?: boolean;
  enableValidation?: boolean;
  enableFallback?: boolean;
  culturalLevel?: 'conservative' | 'moderate' | 'liberal';
  targetAudience?: 'casual' | 'professional' | 'collectors';
  promptComplexity?: 'simple' | 'standard' | 'detailed';
}

/**
 * Enhanced product description generation result
 */
export interface EnhancedProductDescriptionResult {
  description: string;
  metadata: {
    processingTime: number;
    source: 'ai' | 'template' | 'hybrid';
    confidence: number;
    imageAnalysis?: any;
    validation?: ValidationResult;
    fallbackUsed: boolean;
    templateUsed?: string;
    culturalAdaptations: string[];
    gamingTerminology: string[];
  };
  recommendations: string[];
}

/**
 * Enhanced product description generator with context awareness
 */
export async function generateEnhancedProductDescription({
  productName,
  productNameEn,
  productImages = [],
  language,
  provider = 'openai',
  enableImageAnalysis = true,
  enableValidation = true,
  enableFallback = true,
  culturalLevel = 'moderate',
  targetAudience = 'casual',
  promptComplexity = 'standard',
  ...config
}: EnhancedProductDescriptionRequest): Promise<EnhancedProductDescriptionResult> {
  const startTime = Date.now();
  console.log('Starting enhanced product description generation:', {
    productName,
    productNameEn,
    imageCount: productImages.length,
    language,
    provider
  });

  try {
    // Step 1: Image Analysis (if enabled and images provided)
    let imageAnalysis;
    if (enableImageAnalysis && productImages.length > 0) {
      console.log('Analyzing product images...');
      imageAnalysis = await analyzeProductImages(productImages, {
        provider,
        maxRetries: 2,
        timeout: 8000
      });
    }

    // Step 2: Context Fusion
    console.log('Fusing context from title and images...');
    const fusedContext = fuseContext(productName, productNameEn, imageAnalysis || []);

    // Step 3: Generate Description
    let description: string;
    let source: EnhancedProductDescriptionResult['metadata']['source'] = 'ai';
    let fallbackUsed = false;
    let templateUsed: string | undefined;

    try {
      console.log('Generating AI description...');
      const aiResult = await generateDescriptionWithProvider(
        fusedContext,
        productName,
        productNameEn,
        config.productDescriptionEn, // Pass the English description
        {
          provider,
          culturalLevel,
          targetAudience,
          promptComplexity,
          includeMarketing: true,
          includeTechnicalSpecs: true
        }
      );

      description = aiResult.content;
      source = 'ai';

      if (!description || description.trim().length === 0) {
        throw new Error('AI generated empty description');
      }

      console.log('AI description generated successfully');
    } catch (aiError) {
      console.warn('AI generation failed, using fallback:', aiError.message);

      if (enableFallback) {
        console.log('Generating smart fallback description...');
        const fallbackResult = generateSmartFallback(fusedContext, productName, productNameEn, {
          enableHybridMode: true,
          templatePersonalization: true,
          fallbackTier: 'hybrid'
        });

        description = fallbackResult.customizedDescription;
        source = fallbackResult.source;
        fallbackUsed = true;
        templateUsed = fallbackResult.template.id;

        console.log('Fallback description generated');
      } else {
        throw aiError;
      }
    }

    // Step 4: Validation (if enabled and Arabic)
    let validation: ValidationResult | undefined;
    if (enableValidation && language === 'ar') {
      console.log('Validating Arabic description...');
      validation = validateArabicText(description, {
        strictness: 'moderate' as any,
        targetAudience: (targetAudience === 'casual' ? 'general' : targetAudience === 'collectors' ? 'gulf' : targetAudience) as any,
        enableDiacritics: true,
        minReadabilityScore: 70
      });

      // If validation fails badly, try to improve
      if (validation.overall === 'poor' && enableFallback) {
        console.log('Improving description based on validation feedback...');
        description = improveText(description, validation);

        // Re-validate after improvement
        validation = validateArabicText(description, {
          strictness: 'moderate' as any,
          targetAudience: (targetAudience === 'casual' ? 'general' : targetAudience === 'collectors' ? 'gulf' : targetAudience) as any,
          enableDiacritics: true,
          minReadabilityScore: 70
        });
      }
    }

    // Step 5: Generate recommendations
    const recommendations = generateRecommendations(validation, imageAnalysis, source);

    const processingTime = Date.now() - startTime;

    const result: EnhancedProductDescriptionResult = {
      description,
      metadata: {
        processingTime,
        source,
        confidence: calculateConfidence(imageAnalysis, source, validation),
        imageAnalysis,
        validation,
        fallbackUsed,
        templateUsed,
        culturalAdaptations: extractCulturalAdaptations(description),
        gamingTerminology: extractGamingTerminology(description)
      },
      recommendations
    };

    console.log('Enhanced description generation completed:', {
      processingTime,
      source,
      confidence: result.metadata.confidence,
      validationScore: validation?.score
    });

    return result;
  } catch (error) {
    console.error('Enhanced description generation failed:', error);

    const processingTime = Date.now() - startTime;

    return {
      description: '',
      metadata: {
        processingTime,
        source: 'template',
        confidence: 0,
        fallbackUsed: false,
        templateUsed: undefined,
        culturalAdaptations: [],
        gamingTerminology: []
      },
      recommendations: [
        `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'Please try again or check your AI configuration'
      ]
    };
  }
}

/**
 * Calculate overall confidence score
 */
function calculateConfidence(
  imageAnalysis: any,
  source: string,
  validation?: ValidationResult
): number {
  let confidence = 50; // Base confidence

  // Boost based on image analysis
  if (imageAnalysis && imageAnalysis.confidence > 0.7) {
    confidence += 20;
  }

  // Boost based on source
  if (source === 'ai') {
    confidence += 15;
  } else if (source === 'hybrid') {
    confidence += 10;
  }

  // Boost based on validation
  if (validation && validation.score > 80) {
    confidence += 15;
  }

  return Math.min(100, confidence);
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(
  validation?: ValidationResult,
  imageAnalysis?: any,
  source?: string
): string[] {
  const recommendations: string[] = [];

  // Validation-based recommendations
  if (validation) {
    if (validation.score < 70) {
      recommendations.push('Consider improving description quality for better results');
    }

    if (validation.grammarIssues.length > 0) {
      recommendations.push('Review and fix grammar issues for better readability');
    }

    if (validation.culturalFlags.length > 0) {
      recommendations.push('Review cultural appropriateness for target audience');
    }
  }

  // Image analysis recommendations
  if (imageAnalysis && imageAnalysis.confidence < 0.5) {
    recommendations.push('Consider using higher quality product images for better analysis');
  }

  // Source-based recommendations
  if (source === 'template' || source === 'hybrid') {
    recommendations.push('Consider configuring AI provider for better quality descriptions');
  }

  return recommendations;
}

/**
 * Extract cultural adaptations from description
 */
function extractCulturalAdaptations(description: string): string[] {
  const adaptations = [];

  const culturalKeywords = [
    'خليجي', 'عربي', 'إسلامي', 'ديني', 'صلاة', 'قرآن',
    'مذهل', 'رائع', 'ممتاز', 'ممتع', 'لا يُقاوم',
    'بلايستيشن', 'إكس بوكس', 'نينتندو', 'كمبيوتر'
  ];

  culturalKeywords.forEach(keyword => {
    if (description.includes(keyword)) {
      adaptations.push(`Gulf Arabic cultural reference: ${keyword}`);
    }
  });

  return adaptations;
}

/**
 * Extract gaming terminology from description
 */
function extractGamingTerminology(description: string): string[] {
  const terminology = [];

  const gamingTerms = [
    'بلايستيشن', 'إكس بوكس', 'نينتندو', 'كمبيوتر', 'ألعاب',
    'تحكم', 'متحكم', 'رسومات', 'دقة', 'HD', '4K',
    'DualSense', 'Game Pass', 'Joy-Con', 'Steam',
    'أكشن', 'مغامرة', 'رياضة', 'سباق', 'استراتيجي',
    'مغامرة جماعية', 'لعب فردي', 'لعب جماعي',
    'دوري', 'كأس العالم', 'دوري الأبطال'
  ];

  gamingTerms.forEach(term => {
    if (description.includes(term)) {
      terminology.push(`Gaming terminology: ${term}`);
    }
  });

  return terminology;
}

/**
 * Quick generation with minimal analysis
 */
export async function generateQuickDescription(
  productName: string,
  productNameEn: string,
  language: 'ar' | 'en' = 'ar'
): Promise<EnhancedProductDescriptionResult> {
  console.log('Generating quick description with minimal analysis');

  const startTime = Date.now();

  try {
    // Use basic context fusion without image analysis
    const fusedContext = fuseContext(productName, productNameEn, []);

    // Generate simple fallback
    const fallbackResult = generateSmartFallback(fusedContext, productName, productNameEn, {
      enableHybridMode: false,
      templatePersonalization: false,
      fallbackTier: 'template-only'
    });

    const processingTime = Date.now() - startTime;

    return {
      description: fallbackResult.customizedDescription,
      metadata: {
        processingTime,
        source: 'template',
        confidence: 60,
        fallbackUsed: true,
        templateUsed: fallbackResult.template.id,
        culturalAdaptations: [],
        gamingTerminology: []
      },
      recommendations: [
        'For better results, consider enabling image analysis and AI generation',
        'Configure AI provider for enhanced descriptions'
      ]
    };
  } catch (error) {
    console.error('Quick description generation failed:', error);

    return {
      description: '',
      metadata: {
        processingTime: Date.now() - startTime,
        source: 'template',
        confidence: 0,
        fallbackUsed: false,
        templateUsed: undefined,
        culturalAdaptations: [],
        gamingTerminology: []
      },
      recommendations: [
        'Generation failed. Please try again.',
        'Check your network connection and AI configuration'
      ]
    };
  }
}

/**
 * Batch generate descriptions for multiple products
 */
export async function generateBatchDescriptions(
  products: Array<{
    name: string;
    nameEn: string;
    images?: string[];
  }>,
  config: Partial<EnhancedProductDescriptionRequest> = {}
): Promise<EnhancedProductDescriptionResult[]> {
  console.log(`Starting batch generation for ${products.length} products`);

  const results: EnhancedProductDescriptionResult[] = [];

  // Process in batches to avoid overwhelming APIs
  const batchSize = 3;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}: ${batch.length} products`);

    const batchPromises = batch.map(async (product) => {
      return generateEnhancedProductDescription({
        productName: product.name,
        productNameEn: product.nameEn,
        productImages: product.images,
        language: config.language || 'ar',
        ...config
      });
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < products.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`Batch generation completed for ${results.length} products`);
  return results;
}

/**
 * Get generation statistics
 */
export function getGenerationStatistics(): {
  totalGenerations: number;
  averageProcessingTime: number;
  successRate: number;
  averageConfidence: number;
  sourceDistribution: Record<string, number>;
} {
  // This would typically be stored in a database or analytics system
  // For now, return placeholder data
  return {
    totalGenerations: 0,
    averageProcessingTime: 0,
    successRate: 0,
    averageConfidence: 0,
    sourceDistribution: {
      ai: 0,
      template: 0,
      hybrid: 0,
      error: 0
    }
  };
}


/**
 * Improve text based on validation feedback
 */
function improveText(text: string, validation: ValidationResult): string {
  // Simple improvement for now - just return original text
  // In a real implementation, this would use an LLM or rules to improve the text
  console.log('Improve text requested but not fully implemented yet');
  return text;
}

/**
 * Validate generation configuration
 */
export function validateGenerationConfig(

  config: Partial<EnhancedProductDescriptionRequest>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!config.productName?.trim()) {
    errors.push('Product name is required');
  }

  if (!config.productNameEn?.trim()) {
    errors.push('Product English name is required');
  }

  // Check valid values
  if (config.language && !['ar', 'en'].includes(config.language)) {
    errors.push('Language must be "ar" or "en"');
  }

  if (config.culturalLevel && !['conservative', 'moderate', 'liberal'].includes(config.culturalLevel)) {
    errors.push('Cultural level must be "conservative", "moderate", or "liberal"');
  }

  if (config.targetAudience && !['casual', 'professional', 'collectors'].includes(config.targetAudience)) {
    errors.push('Target audience must be "casual", "professional", or "collectors"');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}