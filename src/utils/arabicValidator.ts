/**
 * Arabic grammar and cultural validation for product descriptions
 */

/**
 * Grammar issue types
 */
export interface GrammarIssue {
  type: 'spelling' | 'grammar' | 'syntax' | 'punctuation' | 'diacritics';
  severity: 'low' | 'medium' | 'high';
  position: {
    line: number;
    column: number;
    word: string;
  };
  suggestion: string;
  rule: string;
}

/**
 * Cultural appropriateness flag
 */
export interface CulturalFlag {
  type: 'terminology' | 'tone' | 'religious' | 'political' | 'social';
  severity: 'warning' | 'error';
  description: string;
  suggestion: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  score: number; // 0-100
  grammarIssues: GrammarIssue[];
  culturalFlags: CulturalFlag[];
  terminologyAccuracy: number; // 0-100
  readabilityScore: number; // 0-100
  recommendations: string[];
  overall: 'excellent' | 'good' | 'acceptable' | 'poor';
}

/**
 * Validation configuration
 */
export interface ValidationConfig {
  strictness: 'lenient' | 'moderate' | 'strict';
  targetAudience: 'general' | 'gulf' | 'professional';
  enableDiacritics: boolean;
  minReadabilityScore: number;
}

/**
 * Gulf Arabic specific rules and patterns
 */
const GULF_ARABIC_PATTERNS = {
  // Common gaming terms in Gulf region
  gaming: {
    correct: ['بلايستيشن', 'إكس بوكس', 'نينتندو', 'كمبيوتر', 'ألعاب', 'جوال', 'تحكم', 'متحكم'],
    incorrect: ['بلاستيشن', 'اكس بوكس', 'نينتندو', 'كمبيوتر']
  },
  
  // Cultural expressions
  expressions: {
    appropriate: ['مذهل', 'رائع', 'ممتاز', 'ممتع', 'مثير للاهتمام', 'لا يُقاوم'],
    inappropriate: ['يا ولد', 'يا أخي', 'حبيبي', 'حبيبتي'],
    formal: ['يسرني', 'يسعدكم', 'تفضلوا'],
    informal: ['عجب', 'أكيد', 'زين', 'حلو']
  },
  
  // Marketing language
  marketing: {
    appropriate: ['احصل عليه', 'استمتع بـ', 'خيارك الأمثل', 'جودة عالية'],
    aggressive: ['شراء الآن', 'فرصة أخيرة', 'سعر منخفض', 'عروض حصرية']
  },
  
  // Religious considerations (avoid in gaming context)
  religious: {
    avoid: ['حلال', 'حرام', 'إسلامي', 'ديني', 'صلاة', 'قرآن'],
    neutral: ['العاب', 'ترفيه', 'مغامرة']
  }
};

/**
 * Grammar rules for Arabic
 */
const ARABIC_GRAMMAR_RULES = {
  // Hamza rules
  hamza: {
    patterns: [
      { regex: /[أإآ]/g, replacement: 'أ', message: 'Inconsistent hamza usage' },
      { regex: /\b[ؤئ]/g, replacement: 'ؤ', message: 'Incorrect hamza placement' }
    ]
  },
  
  // Ta marbuta rules
  taMarbuta: {
    patterns: [
      { regex: /\b[ة]/g, replacement: 'ة', message: 'Incorrect ta marbuta usage' },
      { regex: /\b[اه]/g, replacement: 'اه', message: 'Incorrect ta marbuta with alif' }
    ]
  },
  
  // Dual letters (shadda)
  shadda: {
    patterns: [
      { regex: /([ًًٌٍَ])/g, replacement: '$1', message: 'Redundant tanwin' },
      { regex: /([ْ])/g, replacement: '$1', message: 'Incorrect sukun usage' }
    ]
  },
  
  // Punctuation
  punctuation: {
    patterns: [
      { regex: /\s*[،،]\s*/g, replacement: '، ', message: 'Multiple commas' },
      { regex: /\s*[؛؛]\s*/g, replacement: '؛ ', message: 'Multiple semicolons' },
      { regex: /[؟?]/g, replacement: '؟', message: 'Incorrect question mark' }
    ]
  }
};

/**
 * Validate Arabic text for grammar and cultural appropriateness
 */
export function validateArabicText(
  text: string,
  config: Partial<ValidationConfig> = {}
): ValidationResult {
  const {
    strictness = 'moderate',
    targetAudience = 'gulf',
    enableDiacritics = true,
    minReadabilityScore = 70
  } = config;

  console.log('Validating Arabic text with config:', config);

  // Initialize result
  const result: ValidationResult = {
    score: 0,
    grammarIssues: [],
    culturalFlags: [],
    terminologyAccuracy: 0,
    readabilityScore: 0,
    recommendations: [],
    overall: 'acceptable'
  };

  // Check grammar issues
  result.grammarIssues = checkGrammarIssues(text, strictness);
  
  // Check cultural appropriateness
  result.culturalFlags = checkCulturalAppropriateness(text, targetAudience);
  
  // Check terminology accuracy
  result.terminologyAccuracy = checkTerminologyAccuracy(text);
  
  // Calculate readability score
  result.readabilityScore = calculateReadabilityScore(text);
  
  // Calculate overall score
  result.score = calculateOverallScore(result);
  
  // Determine overall rating
  result.overall = determineOverallRating(result.score, minReadabilityScore);
  
  // Generate recommendations
  result.recommendations = generateRecommendations(result);

  console.log('Validation result:', result);
  return result;
}

/**
 * Check for grammar issues
 */
function checkGrammarIssues(
  text: string,
  strictness: 'lenient' | 'moderate' | 'strict'
): GrammarIssue[] {
  const issues: GrammarIssue[] = [];

  // Check each grammar rule
  Object.entries(ARABIC_GRAMMAR_RULES).forEach(([ruleType, rule]) => {
    if (ruleType === 'hamza') {
      rule.patterns.forEach(pattern => {
        const matches = text.match(pattern.regex);
        if (matches) {
          matches.forEach(match => {
            const position = findTextPosition(text, match[0]);
            issues.push({
              type: 'spelling',
              severity: strictness === 'strict' ? 'high' : 'medium',
              position,
              suggestion: `Replace with "${pattern.replacement}"`,
              rule: pattern.message
            });
          });
        }
      });
    }
    // Similar checks for other rule types...
  });

  return issues;
}

/**
 * Check for cultural appropriateness
 */
function checkCulturalAppropriateness(
  text: string,
  targetAudience: 'general' | 'gulf' | 'professional'
): CulturalFlag[] {
  const flags: CulturalFlag[] = [];

  // Check for inappropriate expressions
  Object.entries(GULF_ARABIC_PATTERNS.expressions).forEach(([category, expressions]) => {
    if (category === 'inappropriate' && Array.isArray(expressions)) {
      expressions.forEach(expression => {
        if (text.includes(expression)) {
          flags.push({
            type: 'social',
            severity: 'error',
            description: `Inappropriate expression: ${expression}`,
            suggestion: 'Use more professional language'
          });
        }
      });
    }
  });

  // Check for overly aggressive marketing language
  if (targetAudience === 'general' || targetAudience === 'gulf') {
    if (Array.isArray(GULF_ARABIC_PATTERNS.marketing?.aggressive)) {
      GULF_ARABIC_PATTERNS.marketing.aggressive.forEach(term => {
        if (text.includes(term)) {
          flags.push({
            type: 'tone',
            severity: 'warning',
            description: `Aggressive marketing language: ${term}`,
            suggestion: 'Use more balanced marketing approach'
          });
        }
      });
    }

    // Check for religious content in gaming context
    if (Array.isArray(GULF_ARABIC_PATTERNS.religious?.avoid)) {
      GULF_ARABIC_PATTERNS.religious.avoid.forEach(term => {
        if (text.includes(term)) {
          flags.push({
            type: 'religious',
            severity: 'error',
            description: `Religious content inappropriate for gaming: ${term}`,
            suggestion: 'Focus on gaming aspects only'
          });
        }
      });
    }
  }

  return flags;
}

/**
 * Check terminology accuracy
 */
function checkTerminologyAccuracy(text: string): number {
  let score = 50; // Base score

  // Check for correct gaming terminology
  const correctTerms = GULF_ARABIC_PATTERNS.gaming.correct;
  const incorrectTerms = GULF_ARABIC_PATTERNS.gaming.incorrect;

  correctTerms.forEach(term => {
    if (text.includes(term)) {
      score += 10; // Boost score for correct terms
    }
  });

  incorrectTerms.forEach(term => {
    if (text.includes(term)) {
      score -= 15; // Penalize for incorrect terms
    }
  });

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate readability score
 */
function calculateReadabilityScore(text: string): number {
  let score = 50; // Base score

  // Check sentence length
  const sentences = text.split(/[.!?؟]/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;

  if (avgSentenceLength < 10) {
    score += 10; // Good - short sentences
  } else if (avgSentenceLength > 25) {
    score -= 10; // Poor - too long sentences
  }

  // Check paragraph structure
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  if (paragraphs.length > 0 && paragraphs.length < 4) {
    score += 5; // Good - well-structured
  }

  // Check for appropriate use of diacritics
  const hasDiacritics = /[\u064B-\u065F\u0670-\u06EF]/.test(text);
  if (hasDiacritics) {
    score += 5; // Good - proper diacritics usage
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate overall validation score
 */
function calculateOverallScore(result: ValidationResult): number {
  const grammarWeight = 0.3;
  const culturalWeight = 0.3;
  const terminologyWeight = 0.2;
  const readabilityWeight = 0.2;

  // Calculate penalty for issues
  const grammarPenalty = result.grammarIssues.reduce((sum, issue) => {
    const penalty = issue.severity === 'high' ? 10 : issue.severity === 'medium' ? 5 : 2;
    return sum + penalty;
  }, 0);

  const culturalPenalty = result.culturalFlags.reduce((sum, flag) => {
    const penalty = flag.severity === 'error' ? 15 : 5;
    return sum + penalty;
  }, 0);

  const baseScore = 
    (result.terminologyAccuracy * terminologyWeight) +
    (result.readabilityScore * readabilityWeight);

  const finalScore = Math.max(0, baseScore - grammarPenalty - culturalPenalty);

  return Math.min(100, finalScore);
}

/**
 * Determine overall rating
 */
function determineOverallRating(
  score: number,
  minReadabilityScore: number
): ValidationResult['overall'] {
  if (score >= 90 && score >= minReadabilityScore) {
    return 'excellent';
  } else if (score >= 75 && score >= minReadabilityScore - 10) {
    return 'good';
  } else if (score >= 60 && score >= minReadabilityScore - 20) {
    return 'acceptable';
  } else {
    return 'poor';
  }
}

/**
 * Generate recommendations
 */
function generateRecommendations(result: ValidationResult): string[] {
  const recommendations: string[] = [];

  // Grammar recommendations
  if (result.grammarIssues.length > 0) {
    recommendations.push('Review grammar and spelling for accuracy');
    
    const highSeverityIssues = result.grammarIssues.filter(i => i.severity === 'high');
    if (highSeverityIssues.length > 0) {
      recommendations.push('Fix high-severity grammar issues immediately');
    }
  }

  // Cultural recommendations
  if (result.culturalFlags.length > 0) {
    recommendations.push('Review language for cultural appropriateness');
    
    const errorFlags = result.culturalFlags.filter(f => f.severity === 'error');
    if (errorFlags.length > 0) {
      recommendations.push('Remove culturally inappropriate content');
    }
  }

  // Terminology recommendations
  if (result.terminologyAccuracy < 70) {
    recommendations.push('Use correct gaming terminology for Gulf region');
  }

  // Readability recommendations
  if (result.readabilityScore < 60) {
    recommendations.push('Improve text structure and readability');
  }

  // Specific recommendations based on issues
  result.grammarIssues.forEach(issue => {
    if (!recommendations.includes(issue.suggestion)) {
      recommendations.push(issue.suggestion);
    }
  });

  return recommendations;
}

/**
 * Find position of text in string
 */
function findTextPosition(text: string, searchTerm: string): { line: number; column: number; word: string } {
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const column = line.indexOf(searchTerm);
    if (column !== -1) {
      return {
        line: i + 1,
        column: column + 1,
        word: searchTerm
      };
    }
  }
  
  return { line: 0, column: 0, word: searchTerm };
}

/**
 * Quick validation for basic checks
 */
export function quickValidation(text: string): {
  hasBasicIssues: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  let hasBasicIssues = false;

  // Check for basic Arabic script
  if (!/[\u0600-\u06FF]/.test(text)) {
    issues.push('Text contains non-Arabic characters');
    hasBasicIssues = true;
  }

  // Check for basic punctuation
  if (text.includes('?') || text.includes('!')) {
    issues.push('Contains non-Arabic punctuation marks');
    hasBasicIssues = true;
  }

  // Check for very short text
  if (text.trim().length < 20) {
    issues.push('Text too short for meaningful description');
    hasBasicIssues = true;
  }

  return { hasBasicIssues, issues };
}

/**
 * Get validation statistics
 */
export function getValidationStats(): {
  totalValidations: number;
  averageScore: number;
  commonIssues: { type: string; count: number }[];
} {
  // This would typically be stored in a database or analytics system
  // For now, return placeholder data
  return {
    totalValidations: 0,
    averageScore: 0,
    commonIssues: []
  };
}

/**
 * Improve text based on validation feedback
 */
export function improveText(
  originalText: string,
  validation: ValidationResult
): string {
  let improvedText = originalText;

  // Apply grammar fixes
  validation.grammarIssues.forEach(issue => {
    if (issue.type === 'spelling' || issue.type === 'grammar') {
      if (issue.word && issue.suggestion) {
        improvedText = improvedText.replace(new RegExp(issue.word, 'g'), issue.suggestion);
      }
    }
  });

  // Remove cultural flags
  validation.culturalFlags.forEach(flag => {
    if (flag.suggestion) {
      improvedText = improvedText.replace(
        new RegExp(flag.description, 'gi'),
        flag.suggestion
      );
    }
  });

  return improvedText;
}

/**
 * Check if text is appropriate for target audience
 */
export function isAppropriateForAudience(
  text: string,
  audience: 'general' | 'gulf' | 'professional'
): boolean {
  const validation = validateArabicText(text, { targetAudience: audience });
  return validation.overall !== 'poor' && validation.culturalFlags.filter(f => f.severity === 'error').length === 0;
}