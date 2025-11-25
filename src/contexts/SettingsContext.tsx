import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * LLM Provider Types
 */
export type LLMProvider = 'openai' | 'claude' | 'perplexity' | 'local';

/**
 * Provider Configuration Interface
 */
export interface ProviderConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  isEnabled: boolean;
}

/**
 * Settings State Interface
 */
export interface Settings {
  // General Settings
  language: string;
  theme: string;
  
  // AI Configuration
  defaultProvider: LLMProvider;
  providers: {
    openai: ProviderConfig;
    claude: ProviderConfig;
    perplexity: ProviderConfig;
  };
  
  // Advanced Settings
  enableLocalFallback: boolean;
  logApiCalls: boolean;
}

/**
 * Default Settings
 */
const DEFAULT_SETTINGS: Settings = {
  language: 'ar',
  theme: 'dark',
  defaultProvider: 'local',
  providers: {
    openai: {
      apiKey: '',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 1024,
      isEnabled: false,
    },
    claude: {
      apiKey: '',
      model: 'claude-sonnet-4-5-20250929',
      temperature: 0.7,
      maxTokens: 1024,
      isEnabled: false,
    },
    perplexity: {
      apiKey: '',
      model: 'sonar',
      temperature: 0.7,
      maxTokens: 1024,
      isEnabled: false,
    },
  },
  enableLocalFallback: true,
  logApiCalls: false,
};

/**
 * Available Models for Each Provider
 */
export const AVAILABLE_MODELS = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  claude: [
    { value: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5' },
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  ],
  perplexity: [
    { value: 'llama-3.1-sonar-small-128k-online', label: 'Sonar Small (Online)' },
    { value: 'llama-3.1-sonar-large-128k-online', label: 'Sonar Large (Online)' },
    { value: 'llama-3.1-sonar-huge-128k-online', label: 'Sonar Huge (Online)' },
    { value: 'sonar-pro', label: 'Sonar Pro' },
    { value: 'sonar', label: 'Sonar' },
  ],
};

/**
 * Settings Context Type
 */
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateProviderConfig: (provider: LLMProvider, config: Partial<ProviderConfig>) => void;
  resetSettings: () => void;
  testConnection: (provider: LLMProvider) => Promise<{ success: boolean; message: string }>;
  saveSettings: () => void;
  loadSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'growgarden-admin-settings';

/**
 * Simple encryption/decryption for API keys
 * Note: This is basic obfuscation, not true encryption
 * For production, consider using Web Crypto API or a proper encryption library
 */
const encodeApiKey = (key: string): string => {
  if (!key) return '';
  return btoa(key.split('').reverse().join(''));
};

const decodeApiKey = (encoded: string): string => {
  if (!encoded) return '';
  try {
    return atob(encoded).split('').reverse().join('');
  } catch {
    return '';
  }
};

/**
 * Settings Provider Component
 */
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Decode API keys
        const decodedSettings = {
          ...parsed,
          providers: {
            openai: {
              ...parsed.providers.openai,
              apiKey: decodeApiKey(parsed.providers.openai.apiKey),
            },
            claude: {
              ...parsed.providers.claude,
              apiKey: decodeApiKey(parsed.providers.claude.apiKey),
            },
            perplexity: {
              ...parsed.providers.perplexity,
              apiKey: decodeApiKey(parsed.providers.perplexity.apiKey),
            },
          },
        };
        
        setSettings(decodedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = () => {
    try {
      // Encode API keys before saving
      const encodedSettings = {
        ...settings,
        providers: {
          openai: {
            ...settings.providers.openai,
            apiKey: encodeApiKey(settings.providers.openai.apiKey),
          },
          claude: {
            ...settings.providers.claude,
            apiKey: encodeApiKey(settings.providers.claude.apiKey),
          },
          perplexity: {
            ...settings.providers.perplexity,
            apiKey: encodeApiKey(settings.providers.perplexity.apiKey),
          },
        },
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(encodedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateProviderConfig = (provider: LLMProvider, config: Partial<ProviderConfig>) => {
    if (provider === 'local') return;
    
    setSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider as keyof typeof prev.providers],
          ...config,
        },
      },
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const testConnection = async (provider: LLMProvider): Promise<{ success: boolean; message: string }> => {
    if (provider === 'local') {
      return { success: true, message: 'Local AI is always available' };
    }

    const config = settings.providers[provider as keyof typeof settings.providers];
    
    if (!config.apiKey) {
      return { success: false, message: 'API key is required' };
    }

    try {
      // Test connection based on provider
      if (provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
          },
        });
        
        if (response.ok) {
          return { success: true, message: 'Connected successfully to OpenAI' };
        } else {
          return { success: false, message: `Error: ${response.statusText}` };
        }
      } else if (provider === 'claude') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: config.model,
            max_tokens: 10,
            messages: [{ role: 'user', content: 'test' }],
          }),
        });
        
        if (response.ok || response.status === 400) {
          return { success: true, message: 'Connected successfully to Claude' };
        } else {
          return { success: false, message: `Error: ${response.statusText}` };
        }
      } else if (provider === 'perplexity') {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: config.model,
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 10,
          }),
        });
        
        if (response.ok) {
          return { success: true, message: 'Connected successfully to Perplexity' };
        } else {
          return { success: false, message: `Error: ${response.statusText}` };
        }
      }
      
      return { success: false, message: 'Unknown provider' };
    } catch (error) {
      return { success: false, message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    updateProviderConfig,
    resetSettings,
    testConnection,
    saveSettings,
    loadSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Hook to use Settings Context
 */
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

