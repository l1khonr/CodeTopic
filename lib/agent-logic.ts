/**
 * AI Agent Auto-Learning Logic
 * Handles intelligent model selection, cost optimization, and learning
 */

export type TaskType = 'code-generation' | 'reasoning' | 'creative-writing' | 'translation' | 'general' | 'multilingual';
export type CostTier = 'free' | 'low-cost' | 'premium';
export type LatencyPriority = 'instant' | 'fast' | 'normal';

export interface ModelRecommendation {
  provider: string;
  model: string;
  reason: string;
  estimatedCost: number;
  estimatedLatency: number;
}

export interface AgentContext {
  userHistory: string[];
  preferredModels: Record<TaskType, string>;
  costBudget: number;
  latencyPriority: LatencyPriority;
}

/**
 * Smart model selection based on task type
 */
export const MODEL_SELECTION_RULES: Record<TaskType, string[]> = {
  'code-generation': [
    'deepseek-ai/DeepSeek-Coder-7B-Instruct',
    'meta-llama/CodeLlama-7b',
    'gemini-2.5-flash'
  ],
  'reasoning': [
    'deepseek-ai/DeepSeek-V3-0324',
    'claude-3.5-sonnet-20241022',
    'gemini-2.5-pro'
  ],
  'creative-writing': [
    'claude-3.5-sonnet-20241022',
    'gemini-2.5-pro',
    'meta-llama/Llama-3.1-8B-Instruct'
  ],
  'translation': [
    'gemini-2.5-flash',
    'Qwen/Qwen3-235B-A22B-Instruct',
    'mistralai/Mistral-7B-Instruct-v0.3'
  ],
  'multilingual': [
    'gemini-2.5-flash',
    'Qwen/Qwen2.5-3B-Instruct',
    'meta-llama/Llama-3.2-3B-Instruct'
  ],
  'general': [
    'gemini-2.5-flash',
    'meta-llama/Llama-3.2-3B-Instruct',
    'mistralai/Mistral-7B-Instruct-v0.3'
  ]
};

/**
 * Cost-based model selection
 */
export const COST_RULES: Record<CostTier, string[]> = {
  'free': [
    'ollama/llama3.2:3b',
    'hf/meta-llama/Llama-3.2-3B-Instruct'
  ],
  'low-cost': [
    'gemini-2.5-flash',
    'meta-llama/Llama-3.2-3B-Instruct',
    'mistralai/Mistral-7B-Instruct'
  ],
  'premium': [
    'claude-3.5-sonnet',
    'deepseek-v3',
    'gemini-2.5-pro'
  ]
};

/**
 * Latency-optimized model selection
 */
export const LATENCY_RULES: Record<LatencyPriority, string[]> = {
  'instant': [
    'gemini-2.5-flash',
    'meta-llama/Llama-3.2-3B-Instruct'
  ],
  'fast': [
    'gemini-2.5-pro',
    'meta-llama/Llama-3.1-8B-Instruct'
  ],
  'normal': [
    'claude-3.5-sonnet',
    'deepseek-v3',
    'gemini-2.5-pro'
  ]
};

/**
 * Select the best model for a given context
 */
export function selectOptimalModel(
  taskType: TaskType,
  context: Partial<AgentContext>
): ModelRecommendation {
  const priority = context.latencyPriority || 'fast';
  const costTier = context.costBudget ? 'free' : 'low-cost';
  
  // Primary recommendation based on task
  const taskModels = MODEL_SELECTION_RULES[taskType];
  
  // Filter by cost if budget is tight
  let candidates = taskModels;
  if (context.costBudget && context.costBudget < 0.10) {
    candidates = COST_RULES[costTier];
  }
  
  // Filter by latency requirements
  const latencyModels = LATENCY_RULES[priority];
  const bestModels = candidates.filter(m => latencyModels.includes(m));
  
  const model = bestModels[0] || candidates[0];
  const [provider, modelName] = model.split('/');
  
  return {
    provider: provider === 'hf' ? 'hugging-face' : provider === 'ollama' ? 'local' : provider,
    model: model,
    reason: `Optimized for ${taskType} with ${priority} latency and ${costTier} cost`,
    estimatedCost: calculateEstimatedCost(model),
    estimatedLatency: calculateEstimatedLatency(model)
  };
}

/**
 * Calculate estimated cost per request
 */
function calculateEstimatedCost(model: string): number {
  const costMap: Record<string, number> = {
    'gemini-2.5-flash': 0.000075,
    'gemini-2.5-pro': 0.00125,
    'claude-3.5-sonnet': 0.003,
    'deepseek-v3': 0.001,
    'llama3.2:3b': 0, // Free local
    'meta-llama/Llama-3.2-3B-Instruct': 0.0001
  };
  
  return costMap[model] || 0.001;
}

/**
 * Calculate estimated latency in milliseconds
 */
function calculateEstimatedLatency(model: string): number {
  const latencyMap: Record<string, number> = {
    'gemini-2.5-flash': 500,
    'gemini-2.5-pro': 1500,
    'claude-3.5-sonnet': 2000,
    'deepseek-v3': 3000,
    'llama3.2:3b': 1000, // Local is fast
    'meta-llama/Llama-3.2-3B-Instruct': 2000
  };
  
  return latencyMap[model] || 2000;
}

/**
 * Learn from user feedback
 */
export function updateModelPreferences(
  taskType: TaskType,
  model: string,
  success: boolean,
  context: Partial<AgentContext>
): void {
  if (!context.preferredModels) {
    context.preferredModels = {} as Record<TaskType, string>;
  }
  
  if (success && !context.preferredModels[taskType]) {
    context.preferredModels[taskType] = model;
  }
}

/**
 * Auto-learn from conversation history
 */
export function analyzeConversationPatterns(
  history: string[],
  context: Partial<AgentContext>
): void {
  // Detect task types from conversation
  const taskType = detectTaskType(history);
  
  // Update preferred models
  if (!context.preferredModels) {
    context.preferredModels = {} as Record<TaskType, string>;
  }
  
  // Store for future reference
  if (taskType && !context.preferredModels[taskType]) {
    const recommendation = selectOptimalModel(taskType, context);
    context.preferredModels[taskType] = recommendation.model;
  }
}

/**
 * Detect task type from conversation
 */
function detectTaskType(history: string[]): TaskType | null {
  const lastMessage = history[history.length - 1]?.toLowerCase() || '';
  
  if (lastMessage.includes('code') || lastMessage.includes('function')) {
    return 'code-generation';
  }
  if (lastMessage.includes('translate')) {
    return 'translation';
  }
  if (lastMessage.includes('explain') || lastMessage.includes('why')) {
    return 'reasoning';
  }
  if (lastMessage.includes('write') || lastMessage.includes('story') || lastMessage.includes('creative')) {
    return 'creative-writing';
  }
  
  return 'general';
}

/**
 * Payment and tool execution logic
 */
export interface ToolPaymentConfig {
  autoApproveThreshold: number;
  requireApproval: string[];
  paymentMethods: {
    cloud: 'charge-on-usage';
    local: 'free';
    hybrid: 'use-local-first';
  };
}

export function shouldAutoApproveTool(
  toolName: string,
  estimatedCost: number,
  config: ToolPaymentConfig
): boolean {
  if (config.requireApproval.includes(toolName)) {
    return false;
  }
  
  return estimatedCost <= config.autoApproveThreshold;
}

/**
 * Smart tool selection based on cost and availability
 */
export function selectToolProvider(
  toolName: string,
  availableProviders: string[],
  config: ToolPaymentConfig
): string {
  // Try local first for free tools
  if (availableProviders.includes('local')) {
    return 'local';
  }
  
  // Use cheapest cloud option
  if (availableProviders.includes('hugging-face')) {
    return 'hugging-face';
  }
  
  return availableProviders[0] || 'google';
}

