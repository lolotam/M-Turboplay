import { LLMProvider, ProviderConfig } from '@/contexts/SettingsContext';
import { callLLM } from '@/utils/llmIntegration';

/**
 * Interface for image analysis results
 */
export interface ImageAnalysisResult {
  productType: 'game' | 'accessory' | 'digital' | 'console' | 'other';
  platformHints: string[];
  visualFeatures: {
    dominantColors: string[];
    designStyle: 'modern' | 'classic' | 'gaming' | 'minimalist';
    branding: string[];
    keyElements: string[];
  };
  quality: {
    resolution: string;
    clarity: number;
    lighting: 'good' | 'fair' | 'poor';
  };
  confidence: number;
}

/**
 * Configuration for image analysis
 */
export interface ImageAnalysisConfig {
  provider: LLMProvider;
  maxRetries: number;
  timeout: number;
  enableCache: boolean;
}

/**
 * Cache entry with timestamp
 */
interface CacheEntry {
  result: ImageAnalysisResult;
  timestamp: number;
}

/**
 * Cache for image analysis results
 */
class ImageAnalysisCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 100;
  private ttl = 30 * 60 * 1000; // 30 minutes in milliseconds

  set(key: string, result: ImageAnalysisResult): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  get(key: string): ImageAnalysisResult | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.result;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global cache instance
const imageCache = new ImageAnalysisCache();

/**
 * Analyze product image using AI vision capabilities
 */
export async function analyzeProductImage(
  imageUrl: string,
  config: Partial<ImageAnalysisConfig> = {}
): Promise<ImageAnalysisResult> {
  const {
    provider = 'openai',
    maxRetries = 3,
    timeout = 10000,
    enableCache = true
  } = config;

  // Check cache first
  if (enableCache) {
    const cached = imageCache.get(imageUrl);
    if (cached) {
      console.log('Using cached image analysis for:', imageUrl);
      return cached;
    }
  }

  console.log(`Analyzing product image with ${provider}:`, imageUrl);

  // Get provider configuration
  const providerConfig = getProviderConfig(provider);
  if (!providerConfig.apiKey) {
    console.warn(`No API key configured for ${provider}, using fallback analysis`);
    return getFallbackAnalysis(imageUrl);
  }

  // Create analysis prompt
  const prompt = createImageAnalysisPrompt(imageUrl);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await callLLMWithTimeout(prompt, provider, providerConfig, timeout);

      if (response.error) {
        throw new Error(response.error);
      }

      const result = parseImageAnalysisResponse(response.content);

      // Cache successful result
      if (enableCache && result.confidence > 0.7) {
        imageCache.set(imageUrl, result);
      }

      console.log(`Image analysis completed (attempt ${attempt}):`, result);
      return result;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`Image analysis attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  console.error(`All ${maxRetries} image analysis attempts failed:`, lastError?.message);
  return getFallbackAnalysis(imageUrl);
}

/**
 * Call LLM with timeout
 */
async function callLLMWithTimeout(
  prompt: string,
  provider: LLMProvider,
  config: ProviderConfig,
  timeout: number
): Promise<any> {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Analysis timeout')), timeout);
  });

  const analysisPromise = callLLM(prompt, provider, config);

  return Promise.race([analysisPromise, timeoutPromise]);
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
        provider === 'openrouter' ? 'google/gemini-flash-1.5' :
          'sonar',
    temperature: 0.3,
    maxTokens: 1000,
    isEnabled: true,
  };

  if (settings) {
    try {
      const parsedSettings = JSON.parse(settings);

      const decodeApiKey = (encoded: string) => {
        try { return atob(encoded).split('').reverse().join(''); } catch { return ''; }
      };

      if (parsedSettings.providers && parsedSettings.providers[provider]) {
        const storedConfig = parsedSettings.providers[provider];
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
 * Create image analysis prompt
 */
function createImageAnalysisPrompt(imageUrl: string): string {
  return `You are an expert product analyst specializing in gaming and entertainment products. Analyze the provided product image and extract detailed information.

IMPORTANT: Analyze this image URL: ${imageUrl}

Please provide a structured JSON response with the following format:
{
  "productType": "game|accessory|digital|console|other",
  "platformHints": ["playstation", "xbox", "nintendo", "pc", "mobile", "universal"],
  "visualFeatures": {
    "dominantColors": ["color1", "color2", "color3"],
    "designStyle": "modern|classic|gaming|minimalist",
    "branding": ["brand1", "brand2"],
    "keyElements": ["element1", "element2", "element3"]
  },
  "quality": {
    "resolution": "high|medium|low",
    "clarity": 0-100,
    "lighting": "good|fair|poor"
  },
  "confidence": 0-100
}

Analysis Guidelines:
1. Product Type: Identify if this is a video game, gaming accessory, digital product, gaming console, or other
2. Platform Hints: Suggest compatible gaming platforms based on visual cues
3. Visual Features: Extract dominant colors, design style, visible branding, and key elements
4. Quality: Assess image resolution, clarity, and lighting conditions
5. Confidence: Rate your confidence in the analysis (0-100)

Focus on gaming-specific details:
- Box art design patterns
- Platform-specific branding elements
- Game genre indicators
- Age rating visuals
- Special edition indicators
- Digital vs physical product cues

Respond ONLY with valid JSON format, no additional text.`;
}

/**
 * Parse AI response into structured result
 */
function parseImageAnalysisResponse(response: string): ImageAnalysisResult {
  try {
    // Clean response to extract JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and sanitize response
    return {
      productType: validateProductType(parsed.productType),
      platformHints: Array.isArray(parsed.platformHints) ? parsed.platformHints : [],
      visualFeatures: {
        dominantColors: Array.isArray(parsed.visualFeatures?.dominantColors)
          ? parsed.visualFeatures.dominantColors.slice(0, 5)
          : [],
        designStyle: validateDesignStyle(parsed.visualFeatures?.designStyle),
        branding: Array.isArray(parsed.visualFeatures?.branding)
          ? parsed.visualFeatures.branding.slice(0, 3)
          : [],
        keyElements: Array.isArray(parsed.visualFeatures?.keyElements)
          ? parsed.visualFeatures.keyElements.slice(0, 5)
          : []
      },
      quality: {
        resolution: validateResolution(parsed.quality?.resolution),
        clarity: Math.max(0, Math.min(100, Number(parsed.quality?.clarity) || 50)),
        lighting: validateLighting(parsed.quality?.lighting)
      },
      confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 50))
    };
  } catch (error) {
    console.error('Failed to parse image analysis response:', error);
    return getFallbackAnalysis('');
  }
}

/**
 * Validate product type
 */
function validateProductType(type: any): ImageAnalysisResult['productType'] {
  const validTypes = ['game', 'accessory', 'digital', 'console', 'other'];
  return validTypes.includes(type) ? type : 'other';
}

/**
 * Validate design style
 */
function validateDesignStyle(style: any): ImageAnalysisResult['visualFeatures']['designStyle'] {
  const validStyles = ['modern', 'classic', 'gaming', 'minimalist'];
  return validStyles.includes(style) ? style : 'modern';
}

/**
 * Validate resolution
 */
function validateResolution(resolution: any): string {
  const validResolutions = ['high', 'medium', 'low'];
  return validResolutions.includes(resolution) ? resolution : 'medium';
}

/**
 * Validate lighting
 */
function validateLighting(lighting: any): ImageAnalysisResult['quality']['lighting'] {
  const validLighting = ['good', 'fair', 'poor'];
  return validLighting.includes(lighting) ? lighting : 'fair';
}

/**
 * Get fallback analysis when AI fails
 */
function getFallbackAnalysis(imageUrl: string): ImageAnalysisResult {
  // Extract basic info from URL if possible
  const urlLower = imageUrl.toLowerCase();

  let productType: ImageAnalysisResult['productType'] = 'other';
  let platformHints: string[] = ['universal'];

  // Basic URL-based detection
  if (urlLower.includes('playstation') || urlLower.includes('ps4') || urlLower.includes('ps5')) {
    platformHints = ['playstation'];
    productType = 'game';
  } else if (urlLower.includes('xbox') || urlLower.includes('xbox-one') || urlLower.includes('xbox-series')) {
    platformHints = ['xbox'];
    productType = 'game';
  } else if (urlLower.includes('nintendo') || urlLower.includes('switch')) {
    platformHints = ['nintendo'];
    productType = 'game';
  } else if (urlLower.includes('pc') || urlLower.includes('steam')) {
    platformHints = ['pc'];
    productType = 'game';
  } else if (urlLower.includes('accessory') || urlLower.includes('controller') || urlLower.includes('headset')) {
    productType = 'accessory';
  } else if (urlLower.includes('digital') || urlLower.includes('download') || urlLower.includes('code')) {
    productType = 'digital';
  }

  return {
    productType,
    platformHints,
    visualFeatures: {
      dominantColors: [],
      designStyle: 'modern',
      branding: [],
      keyElements: []
    },
    quality: {
      resolution: 'medium',
      clarity: 50,
      lighting: 'fair'
    },
    confidence: 30 // Low confidence for fallback
  };
}

/**
 * Clear image analysis cache
 */
export function clearImageAnalysisCache(): void {
  imageCache.clear();
}

/**
 * Get cache statistics
 */
export function getImageAnalysisCacheStats(): { size: number; maxSize: number } {
  return {
    size: imageCache['cache']?.size || 0,
    maxSize: 100
  };
}

/**
 * Batch analyze multiple images
 */
export async function analyzeProductImages(
  imageUrls: string[],
  config: Partial<ImageAnalysisConfig> = {}
): Promise<ImageAnalysisResult[]> {
  const results: ImageAnalysisResult[] = [];

  // Process images in parallel with concurrency limit
  const concurrencyLimit = 3;
  const chunks = [];

  for (let i = 0; i < imageUrls.length; i += concurrencyLimit) {
    chunks.push(imageUrls.slice(i, i + concurrencyLimit));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(url => analyzeProductImage(url, config))
    );
    results.push(...chunkResults);
  }

  return results;
}

/**
 * Get supported providers for image analysis
 */
export function getSupportedImageAnalysisProviders(): LLMProvider[] {
  return ['openai', 'claude', 'perplexity', 'openrouter'];
}

/**
 * Check if provider supports vision analysis
 */
export function supportsVisionAnalysis(provider: LLMProvider): boolean {
  const visionProviders = ['openai', 'claude'];
  return visionProviders.includes(provider);
}