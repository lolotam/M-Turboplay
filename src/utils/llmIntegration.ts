import { ProviderConfig, LLMProvider } from '@/contexts/SettingsContext';

/**
 * LLM Response Interface
 */
export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  tokensUsed?: number;
  error?: string;
}

/**
 * Call OpenAI API
 */
export async function callOpenAI(
  prompt: string,
  config: ProviderConfig
): Promise<LLMResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0]?.message?.content || '',
      provider: 'openai',
      model: config.model,
      tokensUsed: data.usage?.total_tokens,
    };
  } catch (error) {
    return {
      content: '',
      provider: 'openai',
      model: config.model,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Call Claude API
 */
export async function callClaude(
  prompt: string,
  config: ProviderConfig
): Promise<LLMResponse> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      content: data.content[0]?.text || '',
      provider: 'claude',
      model: config.model,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
    };
  } catch (error) {
    return {
      content: '',
      provider: 'claude',
      model: config.model,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Call Perplexity API
 */
export async function callPerplexity(
  prompt: string,
  config: ProviderConfig
): Promise<LLMResponse> {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0]?.message?.content || '',
      provider: 'perplexity',
      model: config.model,
      tokensUsed: data.usage?.total_tokens,
    };
  } catch (error) {
    return {
      content: '',
      provider: 'perplexity',
      model: config.model,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Main function to call LLM based on provider
 */
export async function callLLM(
  prompt: string,
  provider: LLMProvider,
  config: ProviderConfig
): Promise<LLMResponse> {
  // Don't log API keys
  if (config.apiKey) {
    console.log(`Calling ${provider} with model ${config.model}`);
  }

  switch (provider) {
    case 'openai':
      return callOpenAI(prompt, config);
    case 'claude':
      return callClaude(prompt, config);
    case 'perplexity':
      return callPerplexity(prompt, config);
    case 'local':
      // Return empty response for local (will use existing AI query parser)
      return {
        content: '',
        provider: 'local',
        model: 'local',
      };
    default:
      return {
        content: '',
        provider,
        model: config.model,
        error: 'Unknown provider',
      };
  }
}

/**
 * Format LLM response for display
 */
export function formatLLMResponse(response: LLMResponse, isRTL: boolean): string {
  if (response.error) {
    return isRTL
      ? `❌ **خطأ من ${response.provider}:**\n\n${response.error}`
      : `❌ **Error from ${response.provider}:**\n\n${response.error}`;
  }

  let formatted = response.content;

  if (response.tokensUsed) {
    formatted += isRTL
      ? `\n\n---\n📊 **الرموز المستخدمة:** ${response.tokensUsed}`
      : `\n\n---\n📊 **Tokens used:** ${response.tokensUsed}`;
  }

  return formatted;
}

