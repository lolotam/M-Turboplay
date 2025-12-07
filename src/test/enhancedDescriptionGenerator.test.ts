import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { analyzeProductImage } from '@/components/ai/imageAnalyzer';
import { fuseContext } from '@/utils/contextFusion';
import { generateEnhancedPrompt } from '@/utils/enhancedPromptGenerator';
import { validateArabicText } from '@/utils/arabicValidator';
import { generateSmartFallback } from '@/utils/smartFallback';
import { generateEnhancedProductDescription } from '@/utils/enhancedProductDescriptionAI';

// Mock AI providers
vi.mock('@/utils/llmIntegration', () => ({
  callLLM: vi.fn(),
  callOpenAI: vi.fn(),
  callClaude: vi.fn(),
  callPerplexity: vi.fn()
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Enhanced AI Description Generator Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      openai: { apiKey: 'test-key', model: 'gpt-4-vision-preview' },
      claude: { apiKey: 'test-key', model: 'claude-3-opus-20240229' }
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Image Analysis Module', () => {
    it('should analyze product image successfully', async () => {
      const mockImageUrl = 'https://example.com/product.jpg';
      const mockResult = {
        productType: 'game',
        platformHints: ['playstation'],
        visualFeatures: {
          dominantColors: ['blue', 'white'],
          designStyle: 'gaming' as const,
          branding: ['PlayStation'],
          keyElements: ['controller', 'console']
        },
        quality: {
          resolution: '1920x1080',
          clarity: 0.9,
          lighting: 'good' as const
        },
        confidence: 0.85
      };

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockResolvedValueOnce({
        content: JSON.stringify(mockResult),
        provider: 'openai',
        model: 'gpt-4-vision-preview'
      });

      const result = await analyzeProductImage(mockImageUrl);

      expect(result.productType).toBe('game');
      expect(result.platformHints).toContain('playstation');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(callLLM).toHaveBeenCalledTimes(1);
    });

    it('should handle image analysis errors gracefully', async () => {
      const mockImageUrl = 'https://example.com/product.jpg';

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockRejectedValueOnce(new Error('API Error'));

      const result = await analyzeProductImage(mockImageUrl);

      expect(result.productType).toBe('other');
      expect(result.confidence).toBeLessThan(0.5);
      expect(result.platformHints).toHaveLength(0);
    });

    it('should batch analyze multiple images', async () => {
      const mockImageUrls = [
        'https://example.com/product1.jpg',
        'https://example.com/product2.jpg'
      ];

      const mockResults = [
        {
          productType: 'game',
          platformHints: ['playstation'],
          visualFeatures: {
            dominantColors: ['blue'],
            designStyle: 'gaming' as const,
            branding: ['PlayStation'],
            keyElements: ['controller']
          },
          quality: {
            resolution: '1920x1080',
            clarity: 0.9,
            lighting: 'good' as const
          },
          confidence: 0.85
        },
        {
          productType: 'game',
          platformHints: ['xbox'],
          visualFeatures: {
            dominantColors: ['green'],
            designStyle: 'gaming' as const,
            branding: ['Xbox'],
            keyElements: ['console']
          },
          quality: {
            resolution: '1920x1080',
            clarity: 0.8,
            lighting: 'good' as const
          },
          confidence: 0.75
        }
      ];

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM
        .mockResolvedValueOnce({
          content: JSON.stringify(mockResults[0]),
          provider: 'openai',
          model: 'gpt-4-vision-preview'
        })
        .mockResolvedValueOnce({
          content: JSON.stringify(mockResults[1]),
          provider: 'openai',
          model: 'gpt-4-vision-preview'
        });

      const results = await analyzeProductImage(mockImageUrls[0]);
      const results2 = await analyzeProductImage(mockImageUrls[1]);

      expect(results.platformHints).toContain('playstation');
      expect(results2.platformHints).toContain('xbox');
    });

    it('should cache image analysis results', async () => {
      const mockImageUrl = 'https://example.com/product.jpg';
      const mockResult = {
        productType: 'game',
        platformHints: ['playstation'],
        visualFeatures: {
          dominantColors: ['blue'],
          designStyle: 'gaming' as const,
          branding: ['PlayStation'],
          keyElements: ['controller']
        },
        quality: {
          resolution: '1920x1080',
          clarity: 0.9,
          lighting: 'good' as const
        },
        confidence: 0.85
      };

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockResolvedValueOnce({
        content: JSON.stringify(mockResult),
        provider: 'openai',
        model: 'gpt-4-vision-preview'
      });

      // First call
      const result1 = await analyzeProductImage(mockImageUrl);
      // Second call should use cache
      const result2 = await analyzeProductImage(mockImageUrl);

      expect(result1).toEqual(result2);
      expect(callLLM).toHaveBeenCalledTimes(1); // Only called once due to caching
    });
  });

  describe('Context Fusion Engine', () => {
    it('should fuse title and image context correctly', () => {
      const title = 'PlayStation 5 Console';
      const titleEn = 'PlayStation 5 Console';
      const imageAnalysis = [
        {
          productType: 'console',
          platformHints: ['playstation'],
          visualFeatures: {
            dominantColors: ['white', 'black'],
            designStyle: 'modern' as const,
            branding: ['PlayStation'],
            keyElements: ['console', 'controller']
          },
          quality: {
            resolution: '1920x1080',
            clarity: 0.9,
            lighting: 'good' as const
          },
          confidence: 0.85
        }
      ];

      const result = fuseContext(title, titleEn, imageAnalysis);

      expect(result.primaryContext).toBe('balanced');
      expect(result.productCategory).toBe('console');
      expect(result.platformSpecific.playstation).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect and resolve conflicts between title and image', () => {
      const title = 'Xbox Series X Game';
      const titleEn = 'Xbox Series X Game';
      const imageAnalysis = [
        {
          productType: 'game',
          platformHints: ['playstation'], // Conflict with title
          visualFeatures: {
            dominantColors: ['blue'],
            designStyle: 'gaming' as const,
            branding: ['PlayStation'],
            keyElements: ['game case']
          },
          quality: {
            resolution: '1920x1080',
            clarity: 0.9,
            lighting: 'good' as const
          },
          confidence: 0.85
        }
      ];

      const result = fuseContext(title, titleEn, imageAnalysis);

      expect(result.conflictResolution).toBeDefined();
      expect(result.conflictResolution?.type).toBe('platform-conflict');
      expect(result.conflictResolution?.resolution).toContain('prioritize title');
    });

    it('should handle missing image analysis gracefully', () => {
      const title = 'PlayStation 5 Console';
      const titleEn = 'PlayStation 5 Console';
      const imageAnalysis = [];

      const result = fuseContext(title, titleEn, imageAnalysis);

      expect(result.primaryContext).toBe('title');
      expect(result.productCategory).toBe('console');
      expect(result.confidence).toBeLessThan(0.7);
    });

    it('should extract target audience from context', () => {
      const title = 'Professional Gaming Controller';
      const titleEn = 'Professional Gaming Controller';
      const imageAnalysis = [
        {
          productType: 'accessory',
          platformHints: ['pc'],
          visualFeatures: {
            dominantColors: ['black'],
            designStyle: 'professional' as const,
            branding: ['Razer'],
            keyElements: ['controller', 'rgb']
          },
          quality: {
            resolution: '1920x1080',
            clarity: 0.9,
            lighting: 'good' as const
          },
          confidence: 0.85
        }
      ];

      const result = fuseContext(title, titleEn, imageAnalysis);

      expect(result.targetAudience).toBe('professional');
      expect(result.keyFeatures).toContain('professional');
    });
  });

  describe('Enhanced Prompt Generator', () => {
    it('should generate enhanced prompt for Arabic descriptions', () => {
      const fusedContext = {
        primaryContext: 'visual' as const,
        productCategory: 'game',
        targetAudience: 'casual' as const,
        keyFeatures: ['action', 'adventure'],
        platformSpecific: {
          playstation: true
        },
        confidence: 0.85
      };

      const result = generateEnhancedPrompt(
        fusedContext,
        'Action Game',
        'Action Game',
        {
          culturalLevel: 'moderate',
          targetAudience: 'casual',
          promptComplexity: 'standard',
          includeMarketing: true,
          includeTechnicalSpecs: true
        }
      );

      expect(result.prompt).toContain('Action Game');
      expect(result.prompt).toContain('PlayStation');
      expect(result.prompt).toContain('Gulf Arabic');
      expect(result.prompt).toContain('gaming terminology');
    });

    it('should adjust prompt complexity based on configuration', () => {
      const fusedContext = {
        primaryContext: 'title' as const,
        productCategory: 'accessory',
        targetAudience: 'collectors' as const,
        keyFeatures: ['rare', 'limited'],
        platformSpecific: {},
        confidence: 0.9
      };

      const simplePrompt = generateEnhancedPrompt(
        fusedContext,
        'Rare Accessory',
        'Rare Accessory',
        { promptComplexity: 'simple' }
      );

      const detailedPrompt = generateEnhancedPrompt(
        fusedContext,
        'Rare Accessory',
        'Rare Accessory',
        { promptComplexity: 'detailed' }
      );

      expect(detailedPrompt.prompt.length).toBeGreaterThan(simplePrompt.prompt.length);
    });

    it('should include cultural adaptations based on level', () => {
      const fusedContext = {
        primaryContext: 'balanced' as const,
        productCategory: 'game',
        targetAudience: 'casual' as const,
        keyFeatures: ['family', 'fun'],
        platformSpecific: {},
        confidence: 0.8
      };

      const conservativePrompt = generateEnhancedPrompt(
        fusedContext,
        'Family Game',
        'Family Game',
        { culturalLevel: 'conservative' }
      );

      const liberalPrompt = generateEnhancedPrompt(
        fusedContext,
        'Family Game',
        'Family Game',
        { culturalLevel: 'liberal' }
      );

      expect(conservativePrompt.prompt).toContain('formal language');
      expect(liberalPrompt.prompt).toContain('modern expressions');
    });
  });

  describe('Arabic Validator', () => {
    it('should validate correct Arabic text', () => {
      const validArabicText = 'وحدة تحكم بلاي ستيشن 5 عالية الجودة مع دعم كامل للألعاب الحديثة';

      const result = validateArabicText(validArabicText);

      expect(result.score).toBeGreaterThan(80);
      expect(result.grammarIssues).toHaveLength(0);
      expect(result.culturalFlags).toHaveLength(0);
      expect(result.overall).toBe('excellent');
    });

    it('should detect grammar issues', () => {
      const textWithGrammarIssues = 'وحدة تحكم بلاي ستيشن 5 مع';

      const result = validateArabicText(textWithGrammarIssues);

      expect(result.score).toBeLessThan(80);
      expect(result.grammarIssues.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should flag cultural inappropriateness', () => {
      const culturallyInappropriateText = 'وحدة تحكم رهيبة جداً جداً';

      const result = validateArabicText(culturallyInappropriateText);

      expect(result.culturalFlags.length).toBeGreaterThan(0);
      expect(result.culturalFlags[0].type).toBe('language');
      expect(result.recommendations).toContain('Consider using more moderate language');
    });

    it('should validate gaming terminology', () => {
      const textWithCorrectTerminology = 'وحدة تحكم بلاي ستيشن 5 مع دعم للهaptic ريدباك';

      const result = validateArabicText(textWithCorrectTerminology);

      expect(result.terminologyAccuracy).toBeGreaterThan(85);
    });

    it('should provide improvement suggestions', () => {
      const textNeedingImprovement = 'وحدة تحكم';

      const result = validateArabicText(textNeedingImprovement);

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations[0]).toContain('Consider adding more details');
    });
  });

  describe('Smart Fallback System', () => {
    it('should generate appropriate template-based description', () => {
      const fusedContext = {
        primaryContext: 'title' as const,
        productCategory: 'game',
        targetAudience: 'casual' as const,
        keyFeatures: ['action', 'adventure'],
        platformSpecific: {
          playstation: true
        },
        confidence: 0.6
      };

      const result = generateSmartFallback(
        fusedContext,
        'Action Game',
        'Action Game',
        {}
      );

      expect(result.template.id).toBe('basic-game');
      expect(result.customizedDescription).toContain('Action Game');
      expect(result.customizedDescription).toContain('PlayStation');
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.source).toBe('template');
    });

    it('should customize template based on context', () => {
      const fusedContext = {
        primaryContext: 'visual' as const,
        productCategory: 'accessory',
        targetAudience: 'professional' as const,
        keyFeatures: ['rgb', 'wireless'],
        platformSpecific: {
          pc: true
        },
        confidence: 0.7
      };

      const result = generateSmartFallback(
        fusedContext,
        'RGB Controller',
        'RGB Controller',
        {}
      );

      expect(result.customizedDescription).toContain('RGB');
      expect(result.customizedDescription).toContain('wireless');
      expect(result.customizedDescription).toContain('PC');
      expect(result.confidence).toBeGreaterThan(50);
    });

    it('should select appropriate template based on product type', () => {
      const consoleContext = {
        primaryContext: 'title' as const,
        productCategory: 'console',
        targetAudience: 'casual' as const,
        keyFeatures: ['next-gen'],
        platformSpecific: {
          playstation: true
        },
        confidence: 0.8
      };

      const result = generateSmartFallback(
        consoleContext,
        'PlayStation 5',
        'PlayStation 5'
      );

      expect(result.template.id).toBe('console');
      expect(result.customizedDescription).toContain('PlayStation 5');
    });

    it('should handle hybrid AI-template generation', () => {
      const fusedContext = {
        primaryContext: 'balanced' as const,
        productCategory: 'game',
        targetAudience: 'collectors' as const,
        keyFeatures: ['limited', 'edition'],
        platformSpecific: {},
        confidence: 0.4
      };

      const result = generateSmartFallback(
        fusedContext,
        'Limited Edition Game',
        'Limited Edition Game',
        { fallbackTier: 'hybrid' }
      );

      expect(result.source).toBe('hybrid');
      expect(result.confidence).toBeGreaterThan(70);
    });
  });

  describe('Enhanced Product Description AI Integration', () => {
    it('should generate complete enhanced description', async () => {
      const request = {
        productName: 'PlayStation 5 Console',
        productNameEn: 'PlayStation 5 Console',
        productImages: ['https://example.com/ps5.jpg'],
        language: 'ar' as const,
        enableImageAnalysis: true,
        enableValidation: true,
        enableFallback: true,
        culturalLevel: 'moderate' as const,
        targetAudience: 'casual' as const
      };

      // Mock successful AI generation
      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockResolvedValueOnce({
        content: JSON.stringify({
        productType: 'console',
        platformHints: ['playstation'],
        visualFeatures: {
          dominantColors: ['white', 'black'],
          designStyle: 'modern',
          branding: ['PlayStation'],
          keyElements: ['console', 'controller']
        },
        quality: {
          resolution: '1920x1080',
          clarity: 0.9,
          lighting: 'good'
        },
        confidence: 0.85
      }));

      callLLM.mockResolvedValueOnce({
        content: 'وحدة تحكم بلاي ستيشن 5 عالية الجودة مع دعم كامل للألعاب الحديثة',
        provider: 'openai',
        model: 'gpt-4-vision-preview'
      });

      const result = await generateEnhancedProductDescription(request);

      expect(result.description).toContain('PlayStation 5');
      expect(result.metadata.source).toBe('ai');
      expect(result.metadata.confidence).toBeGreaterThan(0.7);
      expect(result.metadata.validation).toBeDefined();
      expect(result.metadata.imageAnalysis).toBeDefined();
    });

    it('should use fallback when AI generation fails', async () => {
      const request = {
        productName: 'Xbox Controller',
        productNameEn: 'Xbox Controller',
        language: 'ar' as const,
        enableImageAnalysis: false,
        enableValidation: true,
        enableFallback: true,
        culturalLevel: 'moderate' as const,
        targetAudience: 'casual' as const
      };

      // Mock AI failure
      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockRejectedValueOnce(new Error('API Error'));

      const result = await generateEnhancedProductDescription(request);

      expect(result.description).toContain('Xbox Controller');
      expect(result.metadata.source).toBe('template');
      expect(result.metadata.fallbackUsed).toBe(true);
      expect(result.metadata.templateUsed).toBe('accessory');
    });

    it('should handle batch processing', async () => {
      const requests = [
        {
          productName: 'PlayStation Game',
          productNameEn: 'PlayStation Game',
          language: 'ar' as const,
          enableImageAnalysis: false,
          enableValidation: false,
          enableFallback: true
        },
        {
          productName: 'Xbox Game',
          productNameEn: 'Xbox Game',
          language: 'ar' as const,
          enableImageAnalysis: false,
          enableValidation: false,
          enableFallback: true
        }
      ];

      // Mock AI responses
      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM
        .mockResolvedValueOnce({
          content: 'لعبة بلاي ستيشن ممتازة',
          provider: 'openai',
          model: 'gpt-4-vision-preview'
        })
        .mockResolvedValueOnce({
          content: 'لعبة إكس بوكس رائعة',
          provider: 'openai',
          model: 'gpt-4-vision-preview'
        });

      const results = await Promise.all(
        requests.map(request => generateEnhancedProductDescription(request))
      );

      expect(results).toHaveLength(2);
      expect(results[0].description).toContain('بلاي ستيشن');
      expect(results[1].description).toContain('إكس بوكس');
    });

    it('should provide quality recommendations', async () => {
      const request = {
        productName: 'Test Product',
        productNameEn: 'Test Product',
        language: 'ar' as const,
        enableImageAnalysis: false,
        enableValidation: true,
        enableFallback: true,
        culturalLevel: 'moderate' as const,
        targetAudience: 'casual' as const
      };

      // Mock low-quality AI response
      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockResolvedValueOnce({
        content: 'منتج',
        provider: 'openai',
        model: 'gpt-4-vision-preview'
      });

      const result = await generateEnhancedProductDescription(request);

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations[0]).toContain('Consider adding more details');
      expect(result.metadata.validation?.score).toBeLessThan(70);
    });

    it('should track generation statistics', async () => {
      const request = {
        productName: 'Test Product',
        productNameEn: 'Test Product',
        language: 'ar' as const,
        enableImageAnalysis: false,
        enableValidation: false,
        enableFallback: true
      };

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockResolvedValueOnce({
        content: 'وصف منتج ممتاز',
        provider: 'openai',
        model: 'gpt-4-vision-preview'
      });

      const result = await generateEnhancedProductDescription(request);

      expect(result.metadata.processingTime).toBeGreaterThan(0);
      expect(result.metadata.confidence).toBeGreaterThan(0);
      expect(result.metadata.source).toBe('ai');
    });
  });

  describe('Performance Tests', () => {
    it('should complete generation within acceptable time', async () => {
      const request = {
        productName: 'Test Product',
        productNameEn: 'Test Product',
        language: 'ar' as const,
        enableImageAnalysis: false,
        enableValidation: false,
        enableFallback: true
      };

      const startTime = Date.now();

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockResolvedValueOnce({
        content: 'وصف منتج سريع',
        provider: 'openai',
        model: 'gpt-4-vision-preview'
      });

      await generateEnhancedProductDescription(request);

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      expect(processingTime).toBeLessThan(5000); // Less than 5 seconds
    });

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) => ({
        productName: `Product ${i}`,
        productNameEn: `Product ${i}`,
        language: 'ar' as const,
        enableImageAnalysis: false,
        enableValidation: false,
        enableFallback: true
      }));

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockResolvedValue({
        content: 'وصف منتج متزامن',
        provider: 'openai',
        model: 'gpt-4-vision-preview'
      });

      const startTime = Date.now();
      const results = await Promise.all(
        requests.map(request => generateEnhancedProductDescription(request))
      );
      const endTime = Date.now();

      expect(results).toHaveLength(5);
      expect(endTime - startTime).toBeLessThan(10000); // Less than 10 seconds for 5 concurrent requests
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle API rate limiting gracefully', async () => {
      const request = {
        productName: 'Test Product',
        productNameEn: 'Test Product',
        language: 'ar' as const,
        enableImageAnalysis: false,
        enableValidation: false,
        enableFallback: true
      };

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockRejectedValueOnce(new Error('Rate limit exceeded'));

      const result = await generateEnhancedProductDescription(request);

      expect(result.metadata.source).toBe('template');
      expect(result.metadata.fallbackUsed).toBe(true);
      expect(result.description).toContain('Test Product');
    });

    it('should handle network timeouts', async () => {
      const request = {
        productName: 'Test Product',
        productNameEn: 'Test Product',
        language: 'ar' as const,
        enableImageAnalysis: true,
        enableValidation: false,
        enableFallback: true
      };

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockRejectedValueOnce(new Error('Network timeout'));

      const result = await generateEnhancedProductDescription(request);

      expect(result.metadata.source).toBe('template');
      expect(result.metadata.fallbackUsed).toBe(true);
    });

    it('should handle malformed API responses', async () => {
      const request = {
        productName: 'Test Product',
        productNameEn: 'Test Product',
        language: 'ar' as const,
        enableImageAnalysis: false,
        enableValidation: false,
        enableFallback: true
      };

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM.mockResolvedValueOnce({
        content: 'Invalid JSON response',
        provider: 'openai',
        model: 'gpt-4-vision-preview'
      });

      const result = await generateEnhancedProductDescription(request);

      expect(result.metadata.source).toBe('template');
      expect(result.metadata.fallbackUsed).toBe(true);
    });
  });

  describe('Integration with Admin Product Edit', () => {
    it('should integrate seamlessly with existing product edit workflow', async () => {
      // This test simulates the integration with AdminProductEdit component
      const mockFormData = {
        title: 'PlayStation 5 Console',
        titleEn: 'PlayStation 5 Console',
        images: ['https://example.com/ps5.jpg'],
        description: '',
        descriptionEn: ''
      };

      const request = {
        productName: mockFormData.title,
        productNameEn: mockFormData.titleEn,
        productImages: mockFormData.images,
        language: 'ar' as const,
        enableImageAnalysis: true,
        enableValidation: true,
        enableFallback: true,
        culturalLevel: 'moderate' as const,
        targetAudience: 'casual' as const
      };

      const { callLLM } = await import('@/utils/llmIntegration');
      callLLM
        .mockResolvedValueOnce({
          content: JSON.stringify({
          productType: 'console',
          platformHints: ['playstation'],
          visualFeatures: {
            dominantColors: ['white', 'black'],
            designStyle: 'modern',
            branding: ['PlayStation'],
            keyElements: ['console', 'controller']
          },
          quality: {
            resolution: '1920x1080',
            clarity: 0.9,
            lighting: 'good'
          },
          confidence: 0.85
          }),
          provider: 'openai',
          model: 'gpt-4-vision-preview'
        })
        .mockResolvedValueOnce({
          content: 'وحدة تحكم بلاي ستيشن 5 عالية الجودة مع دعم كامل للألعاب الحديثة',
          provider: 'openai',
          model: 'gpt-4-vision-preview'
        });

      const result = await generateEnhancedProductDescription(request);

      // Simulate updating form data
      mockFormData.description = result.description;

      expect(mockFormData.description).toContain('بلاي ستيشن 5');
      expect(result.metadata.validation).toBeDefined();
      expect(result.metadata.confidence).toBeGreaterThan(0.7);
    });
  });
});