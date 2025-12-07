import { ImageAnalysisResult } from '@/components/ai/imageAnalyzer';

/**
 * Fused context from multiple sources
 */
export interface FusedContext {
  primaryContext: 'title' | 'visual' | 'balanced';
  productCategory: string;
  targetAudience: 'casual' | 'professional' | 'collectors';
  keyFeatures: string[];
  platformSpecific: {
    playstation?: boolean;
    xbox?: boolean;
    nintendo?: boolean;
    pc?: boolean;
    mobile?: boolean;
  };
  confidence: number;
  conflictResolution?: {
    type: 'title-image-mismatch' | 'platform-conflict' | 'category-conflict';
    resolution: string;
    explanation: string;
  };
}

/**
 * Title analysis result
 */
interface TitleAnalysis {
  keywords: string[];
  platform: string[];
  category: string;
  audience: string;
  features: string[];
  confidence: number;
}

/**
 * Context fusion configuration
 */
export interface ContextFusionConfig {
  titleWeight: number; // 0-1, weight for title analysis
  visualWeight: number; // 0-1, weight for visual analysis
  conflictThreshold: number; // 0-1, threshold for conflict detection
  minConfidence: number; // 0-1, minimum confidence for acceptance
}

/**
 * Fuse title and image context into unified understanding
 */
export function fuseContext(
  title: string,
  titleEn: string,
  imageAnalysis: ImageAnalysisResult[],
  config: Partial<ContextFusionConfig> = {}
): FusedContext {
  const {
    titleWeight = 0.6,
    visualWeight = 0.4,
    conflictThreshold = 0.3,
    minConfidence = 0.5
  } = config;

  // Analyze titles
  const titleAnalysis = analyzeTitles(title, titleEn);
  
  // Aggregate image analysis
  const aggregatedVisual = aggregateImageAnalysis(imageAnalysis);
  
  // Detect conflicts
  const conflicts = detectConflicts(titleAnalysis, aggregatedVisual);
  
  // Determine primary context
  const primaryContext = determinePrimaryContext(
    titleAnalysis,
    aggregatedVisual,
    titleWeight,
    visualWeight
  );
  
  // Fuse the contexts
  const fusedContext: FusedContext = {
    primaryContext,
    productCategory: determineProductCategory(titleAnalysis, aggregatedVisual),
    targetAudience: determineTargetAudience(titleAnalysis, aggregatedVisual),
    keyFeatures: extractKeyFeatures(titleAnalysis, aggregatedVisual, primaryContext),
    platformSpecific: determinePlatformSpecific(titleAnalysis, aggregatedVisual),
    confidence: calculateConfidence(titleAnalysis, aggregatedVisual, titleWeight, visualWeight),
    conflictResolution: conflicts.length > 0 ? conflicts[0] : undefined
  };

  console.log('Context fusion completed:', fusedContext);
  return fusedContext;
}

/**
 * Analyze English and Arabic titles
 */
function analyzeTitles(title: string, titleEn: string): TitleAnalysis {
  const combinedText = `${title} ${titleEn}`.toLowerCase();
  
  // Extract keywords
  const keywords = extractKeywords(combinedText);
  
  // Detect platform
  const platform = detectPlatform(combinedText);
  
  // Determine category
  const category = determineCategoryFromTitle(combinedText);
  
  // Identify audience
  const audience = determineAudienceFromTitle(combinedText);
  
  // Extract features
  const features = extractFeaturesFromTitle(combinedText);
  
  return {
    keywords,
    platform,
    category,
    audience,
    features,
    confidence: 0.8
  };
}

/**
 * Aggregate multiple image analysis results
 */
function aggregateImageAnalysis(imageAnalysis: ImageAnalysisResult[]): {
  productType: ImageAnalysisResult['productType'];
  platformHints: string[];
  visualFeatures: {
    dominantColors: string[];
    designStyle: ImageAnalysisResult['visualFeatures']['designStyle'];
    branding: string[];
    keyElements: string[];
  };
  quality: {
    resolution: string;
    clarity: number;
    lighting: ImageAnalysisResult['quality']['lighting'];
  };
  confidence: number;
} {
  if (imageAnalysis.length === 0) {
    return {
      productType: 'other',
      platformHints: ['universal'],
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
      confidence: 0
    };
  }

  // Weight by confidence
  const totalWeight = imageAnalysis.reduce((sum, result) => sum + result.confidence, 0);
  
  const aggregated = {
    productType: getHighestConfidenceValue(imageAnalysis, r => r.productType),
    platformHints: mergeWithWeights(imageAnalysis.map(r => r.platformHints)),
    visualFeatures: {
      dominantColors: mergeWithWeights(imageAnalysis.map(r => r.visualFeatures.dominantColors)),
      designStyle: getHighestConfidenceValue(imageAnalysis, r => r.visualFeatures.designStyle),
      branding: mergeWithWeights(imageAnalysis.map(r => r.visualFeatures.branding)),
      keyElements: mergeWithWeights(imageAnalysis.map(r => r.visualFeatures.keyElements))
    },
    quality: {
      resolution: getHighestConfidenceValue(imageAnalysis, r => r.quality.resolution),
      clarity: weightedAverage(imageAnalysis.map(r => r.quality.clarity), imageAnalysis.map(r => r.confidence)),
      lighting: getHighestConfidenceValue(imageAnalysis, r => r.quality.lighting)
    },
    confidence: totalWeight / imageAnalysis.length
  };

  return aggregated;
}

/**
 * Detect conflicts between title and visual analysis
 */
function detectConflicts(
  titleAnalysis: TitleAnalysis,
  visualAnalysis: ReturnType<typeof aggregateImageAnalysis>
): FusedContext['confResolution'][] {
  const conflicts: FusedContext['conflictResolution'][] = [];

  // Check platform conflicts
  const titlePlatforms = titleAnalysis.platform;
  const visualPlatforms = visualAnalysis.platformHints;
  
  if (titlePlatforms.length > 0 && visualPlatforms.length > 0) {
    const hasConflict = !titlePlatforms.some(p => visualPlatforms.includes(p)) &&
                       !visualPlatforms.some(p => titlePlatforms.includes(p));
    
    if (hasConflict) {
      conflicts.push({
        type: 'platform-conflict',
        resolution: 'Using visual analysis for platform detection',
        explanation: `Title suggests ${titlePlatforms.join(', ')} but images suggest ${visualPlatforms.join(', ')}`
      });
    }
  }

  // Check category conflicts
  if (titleAnalysis.category && visualAnalysis.productType !== 'other') {
    const categoryMatch = isCategoryCompatible(titleAnalysis.category, visualAnalysis.productType);
    if (!categoryMatch) {
      conflicts.push({
        type: 'category-conflict',
        resolution: 'Prioritizing visual analysis for product type',
        explanation: `Title suggests ${titleAnalysis.category} but images show ${visualAnalysis.productType}`
      });
    }
  }

  // Check title-image mismatch
  const titleImageSimilarity = calculateTitleImageSimilarity(titleAnalysis, visualAnalysis);
  if (titleImageSimilarity < 0.3) {
    conflicts.push({
      type: 'title-image-mismatch',
      resolution: 'Balancing both contexts with emphasis on visual analysis',
      explanation: 'Low similarity between title content and image content'
    });
  }

  return conflicts;
}

/**
 * Determine primary context source
 */
function determinePrimaryContext(
  titleAnalysis: TitleAnalysis,
  visualAnalysis: ReturnType<typeof aggregateImageAnalysis>,
  titleWeight: number,
  visualWeight: number
): FusedContext['primaryContext'] {
  const titleScore = titleAnalysis.confidence * titleWeight;
  const visualScore = visualAnalysis.confidence * visualWeight;

  if (visualScore > titleScore + 0.1) {
    return 'visual';
  } else if (titleScore > visualScore + 0.1) {
    return 'title';
  } else {
    return 'balanced';
  }
}

/**
 * Determine product category from fused context
 */
function determineProductCategory(
  titleAnalysis: TitleAnalysis,
  visualAnalysis: ReturnType<typeof aggregateImageAnalysis>
): string {
  // Prioritize visual analysis for product type detection
  if (visualAnalysis.productType !== 'other' && visualAnalysis.confidence > 0.6) {
    return visualAnalysis.productType;
  }
  
  return titleAnalysis.category || 'other';
}

/**
 * Determine target audience
 */
function determineTargetAudience(
  titleAnalysis: TitleAnalysis,
  visualAnalysis: ReturnType<typeof aggregateImageAnalysis>
): FusedContext['targetAudience'] {
  const visualAudience = determineAudienceFromVisual(visualAnalysis);
  const titleAudience = titleAnalysis.audience;

  // Combine audience indicators
  if (visualAudience === titleAudience) {
    return visualAudience;
  }

  // Look for professional indicators
  const professionalIndicators = [
    ...titleAnalysis.keywords.filter(k => k.includes('professional') || k.includes('business')),
    ...visualAnalysis.visualFeatures.keyElements.filter(e => e.includes('professional') || e.includes('business'))
  ];

  if (professionalIndicators.length > 2) {
    return 'professional';
  }

  // Look for collector indicators
  const collectorIndicators = [
    ...titleAnalysis.keywords.filter(k => k.includes('collector') || k.includes('limited') || k.includes('edition')),
    ...visualAnalysis.visualFeatures.keyElements.filter(e => e.includes('collector') || e.includes('limited'))
  ];

  if (collectorIndicators.length > 1) {
    return 'collectors';
  }

  return 'casual';
}

/**
 * Extract key features from context
 */
function extractKeyFeatures(
  titleAnalysis: TitleAnalysis,
  visualAnalysis: ReturnType<typeof aggregateImageAnalysis>,
  primaryContext: FusedContext['primaryContext']
): string[] {
  const features = new Set<string>();

  // Add title features
  titleAnalysis.features.forEach(f => features.add(f));

  // Add visual features
  visualAnalysis.visualFeatures.keyElements.forEach(e => features.add(e));

  // Add platform-specific features
  if (visualAnalysis.platformHints.length > 0) {
    features.add(`Compatible with ${visualAnalysis.platformHints.join(', ')}`);
  }

  // Add design style features
  if (visualAnalysis.visualFeatures.designStyle !== 'modern') {
    features.add(`${visualAnalysis.visualFeatures.designStyle} design`);
  }

  return Array.from(features).slice(0, 8); // Limit to top 8 features
}

/**
 * Determine platform-specific information
 */
function determinePlatformSpecific(
  titleAnalysis: TitleAnalysis,
  visualAnalysis: ReturnType<typeof aggregateImageAnalysis>
): FusedContext['platformSpecific'] {
  const platforms = visualAnalysis.platformHints;
  
  return {
    playstation: platforms.includes('playstation'),
    xbox: platforms.includes('xbox'),
    nintendo: platforms.includes('nintendo'),
    pc: platforms.includes('pc'),
    mobile: platforms.includes('mobile')
  };
}

/**
 * Calculate overall confidence
 */
function calculateConfidence(
  titleAnalysis: TitleAnalysis,
  visualAnalysis: ReturnType<typeof aggregateImageAnalysis>,
  titleWeight: number,
  visualWeight: number
): number {
  const weightedTitleConfidence = titleAnalysis.confidence * titleWeight;
  const weightedVisualConfidence = visualAnalysis.confidence * visualWeight;
  
  return Math.min(1, weightedTitleConfidence + weightedVisualConfidence);
}

// Helper functions

function extractKeywords(text: string): string[] {
  const gamingKeywords = [
    'game', 'gaming', 'playstation', 'xbox', 'nintendo', 'pc', 'mobile',
    'controller', 'accessory', 'headset', 'console', 'digital', 'physical',
    'edition', 'limited', 'collector', 'pro', 'elite', 'wireless', 'bluetooth'
  ];
  
  return gamingKeywords.filter(keyword => text.includes(keyword));
}

function detectPlatform(text: string): string[] {
  const platforms = ['playstation', 'xbox', 'nintendo', 'pc', 'mobile'];
  return platforms.filter(platform => text.includes(platform));
}

function determineCategoryFromTitle(text: string): string {
  const categories = ['game', 'accessory', 'digital', 'console', 'guide', 'subscription'];
  return categories.find(category => text.includes(category)) || 'other';
}

function determineAudienceFromTitle(text: string): string {
  if (text.includes('professional') || text.includes('business') || text.includes('pro')) {
    return 'professional';
  }
  if (text.includes('collector') || text.includes('limited') || text.includes('edition')) {
    return 'collectors';
  }
  return 'casual';
}

function extractFeaturesFromTitle(text: string): string[] {
  const features = [];
  
  if (text.includes('wireless') || text.includes('bluetooth')) {
    features.push('Wireless connectivity');
  }
  if (text.includes('pro') || text.includes('elite')) {
    features.push('Premium features');
  }
  if (text.includes('digital') || text.includes('download')) {
    features.push('Digital delivery');
  }
  if (text.includes('physical') || text.includes('disc')) {
    features.push('Physical media');
  }
  
  return features;
}

function determineAudienceFromVisual(visualAnalysis: ReturnType<typeof aggregateImageAnalysis>): string {
  const professionalElements = visualAnalysis.visualFeatures.keyElements.filter(e => 
    e.includes('professional') || e.includes('business') || e.includes('office')
  );
  
  if (professionalElements.length > 0) {
    return 'professional';
  }
  
  return 'casual';
}

function isCategoryCompatible(titleCategory: string, visualProductType: string): boolean {
  const compatibility = {
    'game': ['game', 'digital'],
    'accessory': ['accessory'],
    'digital': ['digital', 'game'],
    'console': ['console'],
    'guide': ['digital'],
    'subscription': ['digital']
  };
  
  return compatibility[titleCategory]?.includes(visualProductType) || false;
}

function calculateTitleImageSimilarity(
  titleAnalysis: TitleAnalysis,
  visualAnalysis: ReturnType<typeof aggregateImageAnalysis>
): number {
  const titleKeywords = new Set(titleAnalysis.keywords);
  const visualKeywords = new Set(visualAnalysis.visualFeatures.keyElements);
  
  const intersection = new Set([...titleKeywords].filter(x => visualKeywords.has(x)));
  const union = new Set([...titleKeywords, ...visualKeywords]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

function getHighestConfidenceValue<T>(items: Array<{ confidence: number }>, extractor: (item: any) => T): T {
  if (items.length === 0) return extractor({}) as T;
  
  const highest = items.reduce((max, current) => 
    current.confidence > max.confidence ? current : max
  );
  
  return extractor(highest);
}

function mergeWithWeights<T>(arrays: Array<T[]>): T[] {
  const weightMap = new Map<T, number>();
  
  // Count occurrences
  arrays.forEach(array => {
    array.forEach(item => {
      weightMap.set(item, (weightMap.get(item) || 0) + 1);
    });
  });
  
  // Sort by weight and return unique
  return Array.from(weightMap.entries())
    .sort(([, weightA], [, weightB]) => weightB - weightA)
    .slice(0, 5)
    .map(([item]) => item);
}

function weightedAverage(values: number[], weights: number[]): number {
  if (values.length === 0) return 0;
  
  const weightedSum = values.reduce((sum, value, index) => sum + value * weights[index], 0);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}