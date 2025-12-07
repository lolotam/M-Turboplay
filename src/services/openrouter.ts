
export interface OpenRouterModel {
    id: string;
    name: string;
    description?: string;
    context_length?: number;
    pricing?: {
        prompt: string;
        completion: string;
    };
}

export interface OpenRouterModelsResponse {
    data: OpenRouterModel[];
}

/**
 * Fetch available models from OpenRouter
 */
export async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: OpenRouterModelsResponse = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Failed to fetch OpenRouter models:', error);
        return [];
    }
}
