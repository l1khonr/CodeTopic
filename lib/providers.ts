/**
 * AI Provider Configuration
 * 
 * This file exports provider configurations for different AI services.
 * You can switch between providers by setting the appropriate environment variables.
 */

export type Provider = 'openai' | 'anthropic' | 'hf' | 'google';

export interface ProviderConfig {
  name: string;
  apiKeyName: string;
  defaultModel: string;
  available: boolean;
}

export const providers: Record<Provider, ProviderConfig> = {
  google: {
    name: 'Google Gemini',
    apiKeyName: 'GOOGLE_GENERATIVE_AI_API_KEY',
    defaultModel: 'gemini-2.5-flash',
    available: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  },
  openai: {
    name: 'OpenAI',
    apiKeyName: 'OPENAI_API_KEY',
    defaultModel: 'gpt-4o-mini',
    available: !!process.env.OPENAI_API_KEY,
  },
  anthropic: {
    name: 'Anthropic Claude',
    apiKeyName: 'ANTHROPIC_API_KEY',
    defaultModel: 'claude-3-5-sonnet-20241022',
    available: !!process.env.ANTHROPIC_API_KEY,
  },
  hf: {
    name: 'Hugging Face',
    apiKeyName: 'HF_TOKEN',
    defaultModel: 'meta-llama/Llama-3.2-3B-Instruct',
    available: !!(process.env.HF_TOKEN || process.env.HUGGINGFACE_HUB_TOKEN),
  },
};

/**
 * Get the default provider based on available API keys
 */
export function getDefaultProvider(): Provider {
  // Check in order of preference
  if (providers.google.available) return 'google';
  if (providers.hf.available) return 'hf';
  if (providers.openai.available) return 'openai';
  if (providers.anthropic.available) return 'anthropic';
  
  return 'google'; // Fallback
}

/**
 * List of available models for each provider
 */
export const models = {
  google: [
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  ],
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
  ],
  anthropic: [
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  ],
  hf: [
    { value: 'deepseek-ai/DeepSeek-V3-0324', label: 'DeepSeek V3' },
    { value: 'meta-llama/Llama-3.2-3B-Instruct', label: 'Llama 3.2 3B' },
    { value: 'meta-llama/Llama-3.1-8B-Instruct', label: 'Llama 3.1 8B' },
    { value: 'Qwen/Qwen3-235B-A22B-Instruct-2507', label: 'Qwen3 235B' },
  ],
};

