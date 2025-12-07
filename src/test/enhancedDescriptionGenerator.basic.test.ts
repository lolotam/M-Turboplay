import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { validateArabicText } from '@/utils/arabicValidator';
import { fuseContext } from '@/utils/contextFusion';
import { generateEnhancedPrompt } from '@/utils/enhancedPromptGenerator';
import { generateSmartFallback } from '@/utils/smartFallback';

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

describe('Enhanced AI Description Generator - Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
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

  describe('Context Fusion Engine', () => {
    it('should fuse title and image context correctly', () => {
      const title = 'PlayStation 5 Console';
      const titleEn = 'PlayStation 5 Console';
      const imageAnalysis = [
        {
          productType: 'console' as const,
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
          productType: 'game' as const,
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
          productType: 'accessory' as const,
          platformHints: ['pc'],
          visualFeatures: {
            dominantColors: ['black'],
            designStyle: 'modern' as const,
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

  describe('Quality Metrics', () => {
    it('should provide consistent quality scoring', () => {
      const testTexts = [
        'وحدة تحكم بلاي ستيشن 5 عالية الجودة مع دعم كامل للألعاب الحديثة',
        'وحدة تحكم',
        'منتج رهيبة جداً جداً',
        'لعبة بلاي ستيشن ممتازة مع رسومات عالية'
      ];

      const results = testTexts.map(text => validateArabicText(text));

      // High quality text should score highest
      expect(results[0].score).toBeGreaterThan(results[1].score);
      expect(results[0].score).toBeGreaterThan(results[2].score);
      
      // Inappropriate text should have cultural flags
      expect(results[2].culturalFlags.length).toBeGreaterThan(0);
      
      // All texts should have some score
      results.forEach(result => {
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      });
    });

    it('should provide actionable recommendations', () => {
      const poorText = 'منتج';
      const result = validateArabicText(poorText);

      expect(result.recommendations.length).toBeGreaterThan(0);
      result.recommendations.forEach(rec => {
        expect(typeof rec).toBe('string');
        expect(rec.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty input gracefully', () => {
      const result = validateArabicText('');

      expect(result.score).toBeLessThan(50);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should handle null/undefined input', () => {
      const result1 = validateArabicText(null as any);
      const result2 = validateArabicText(undefined as any);

      expect(result1.score).toBeLessThan(50);
      expect(result2.score).toBeLessThan(50);
    });

    it('should handle malformed context in fusion', () => {
      const result = fuseContext('', '', []);

      expect(result.primaryContext).toBe('title');
      expect(result.confidence).toBeLessThan(0.5);
    });

    it('should handle invalid prompt generation requests', () => {
      const emptyContext = {
        primaryContext: 'title' as const,
        productCategory: '',
        targetAudience: 'casual' as const,
        keyFeatures: [],
        platformSpecific: {},
        confidence: 0
      };

      const result = generateEnhancedPrompt(
        emptyContext,
        '',
        '',
        {}
      );

      expect(result.prompt).toBeDefined();
      expect(typeof result.prompt).toBe('string');
    });
  });
});