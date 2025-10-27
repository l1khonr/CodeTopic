/**
 * Intelligent Provider Router with Performance Analytics
 *
 * This module handles intelligent provider selection based on:
 * - Task type analysis
 * - Historical performance metrics
 * - Cost optimization
 * - User preferences
 * - Provider availability
 */

import { Provider, providers, models } from './providers';
import { TaskClassifier, TaskType } from './task-classifier';
import { PerformanceTracker, performanceTracker } from './performance-tracker';
import { costTracker } from './mcp-cost-tracker';
import { selectOptimalModel, LatencyPriority } from './agent-logic';

export interface RoutingDecision {
  provider: Provider;
  model: string;
  confidence: number;
  reasoning: string;
  estimatedCost: number;
  estimatedLatency: number;
  fallbackProviders: Provider[];
}

export interface ConversationContext {
  userId?: string;
  sessionId: string;
  messageHistory: string[];
  previousTasks?: TaskType[];
  userPreferences?: {
    preferredProvider?: Provider;
    costSensitive?: boolean;
    qualityPriority?: boolean;
    speedPriority?: boolean;
  };
}

export interface RouterConfig {
  enableIntelligentRouting: boolean;
  fallbackEnabled: boolean;
  performanceTrackingEnabled: boolean;
  costOptimizationEnabled: boolean;
  defaultLatencyPriority: LatencyPriority;
}

export class IntelligentRouter {
  private classifier: TaskClassifier;
  private config: RouterConfig;

  constructor(config: Partial<RouterConfig> = {}) {
    this.classifier = new TaskClassifier();
    this.config = {
      enableIntelligentRouting: true,
      fallbackEnabled: true,
      performanceTrackingEnabled: true,
      costOptimizationEnabled: true,
      defaultLatencyPriority: 'fast',
      ...config,
    };
  }

  /**
   * Select the optimal provider and model for a user message
   */
  async selectProvider(
    message: string,
    context: ConversationContext
  ): Promise<RoutingDecision> {
    if (!this.config.enableIntelligentRouting) {
      return this.getFallbackDecision();
    }

    try {
      // Step 1: Analyze the task type
      const taskClassification = this.classifier.classify(message);
      const taskType = taskClassification.type;

      // Step 2: Get performance data for all providers on this task type
      const performanceOptions = this.getProviderOptionsForTask(taskType);

      // Step 3: Rank providers based on performance, cost, and preferences
      const rankedProviders = await this.rankProviders(
        performanceOptions,
        taskType,
        context,
        taskClassification
      );

      // Step 4: Select the best provider/model combination
      const bestOption = rankedProviders[0];

      if (!bestOption) {
        return this.getFallbackDecision('No suitable providers found');
      }

      // Step 5: Prepare fallback options
      const fallbackProviders = rankedProviders.slice(1, 4).map(p => p.provider);

      return {
        provider: bestOption.provider,
        model: bestOption.model,
        confidence: bestOption.score,
        reasoning: bestOption.reasoning,
        estimatedCost: bestOption.estimatedCost,
        estimatedLatency: bestOption.estimatedLatency,
        fallbackProviders,
      };

    } catch (error) {
      console.warn('[IntelligentRouter] Error in provider selection:', error);
      return this.getFallbackDecision('Selection error');
    }
  }

  /**
   * Record performance metrics after a request completes
   */
  async recordPerformance(
    decision: RoutingDecision,
    actualLatencyMs: number,
    actualCost: number,
    success: boolean,
    context: ConversationContext,
    userRating?: number
  ): Promise<void> {
    if (!this.config.performanceTrackingEnabled) return;

    const taskClassification = this.classifier.classify(
      context.messageHistory[context.messageHistory.length - 1] || ''
    );

    // Track performance metrics
    await performanceTracker.trackRequest({
      provider: decision.provider,
      model: decision.model,
      taskType: taskClassification.type,
      latencyMs: actualLatencyMs,
      inputTokens: taskClassification.estimatedTokens,
      outputTokens: Math.ceil(actualLatencyMs / 10), // Rough estimate
      cost: actualCost,
      success,
      userRating,
      timestamp: new Date(),
      sessionId: context.sessionId,
    });

    // Track costs separately
    costTracker.trackCost(
      decision.provider,
      decision.model,
      taskClassification.estimatedTokens,
      Math.ceil(actualLatencyMs / 10),
      context.sessionId,
      context.userId
    );
  }

  /**
   * Get performance summary for analytics
   */
  async getAnalytics(
    timeWindowHours: number = 24,
    userId?: string
  ): Promise<{
    totalRequests: number;
    totalCost: number;
    avgLatency: number;
    successRate: number;
    topProviders: Record<Provider, number>;
    taskBreakdown: Record<TaskType, number>;
    costSavings: number;
  }> {
    const summary = performanceTracker.getGlobalSummary(timeWindowHours);

    // Filter by user if specified
    let metrics = performanceTracker['metrics'];
    if (userId) {
      metrics = metrics.filter(m => m.sessionId.startsWith(userId));
    }

    // Calculate task breakdown
    const taskBreakdown = metrics.reduce((acc, m) => {
      acc[m.taskType] = (acc[m.taskType] || 0) + 1;
      return acc;
    }, {} as Record<TaskType, number>);

    // Calculate estimated cost savings (rough approximation)
    // Assuming intelligent routing saves ~30% vs always using premium models
    const baselineCost = summary.totalCost / 0.7; // Baseline if using premium models
    const costSavings = baselineCost - summary.totalCost;

    return {
      ...summary,
      costSavings,
      taskBreakdown,
      topProviders: summary.providerBreakdown,
    };
  }

  /**
   * Force a provider switch (admin/debug feature)
   */
  forceProvider(provider: Provider, reason: string): RoutingDecision {
    const model = this.getDefaultModelForProvider(provider);

    return {
      provider,
      model,
      confidence: 1.0,
      reasoning: `Forced selection: ${reason}`,
      estimatedCost: this.estimateCost(provider, model, 100),
      estimatedLatency: this.estimateLatency(provider, model),
      fallbackProviders: [],
    };
  }

  /**
   * Private methods
   */

  private getProviderOptionsForTask(taskType: TaskType): Array<{
    provider: Provider;
    model: string;
    available: boolean;
  }> {
    const options: Array<{
      provider: Provider;
      model: string;
      available: boolean;
    }> = [];

    for (const [providerKey, providerConfig] of Object.entries(providers)) {
      const provider = providerKey as Provider;
      if (!providerConfig.available) continue;

      // Find the best model for this provider based on task type
      const recommendedModel = this.recommendModelForTask(provider, taskType);
      if (!recommendedModel) continue;

      options.push({
        provider,
        model: recommendedModel,
        available: providerConfig.available,
      });
    }

    return options;
  }

  private async rankProviders(
    options: Array<{ provider: Provider; model: string; available: boolean }>,
    taskType: TaskType,
    context: ConversationContext,
    taskClassification: any
  ): Promise<Array<{
    provider: Provider;
    model: string;
    score: number;
    reasoning: string;
    estimatedCost: number;
    estimatedLatency: number;
  }>> {
    const scoredOptions = await Promise.all(
      options.map(async (option) => {
        const performance = performanceTracker.getAggregatedMetrics(
          option.provider,
          taskType,
          24 // Last 24 hours
        );

        // Base score from performance
        let score = 0;
        let reasoning = '';

        if (performance) {
          // Performance-based scoring: 40% success rate, 30% latency, 30% cost efficiency
          const successScore = performance.successRate * 0.4;
          const latencyScore = Math.max(0, (1 - performance.avgLatency / 5000)) * 0.3; // Normalize to 5s max
          const costScore = Math.max(0, (1 - performance.avgCost)) * 0.3; // Lower cost = higher score

          score = successScore + latencyScore + costScore;
          reasoning = `Performance: ${performance.successRate.toFixed(1)}% success, ${performance.avgLatency.toFixed(0)}ms latency, $${performance.avgCost.toFixed(4)} avg cost`;

          // Bonus for user ratings
          if (performance.avgRating) {
            score += performance.avgRating * 0.1;
            reasoning += `, ${performance.avgRating.toFixed(1)}★ rating`;
          }
        } else {
          // No historical data - use default scoring
          score = 0.5; // Neutral score
          reasoning = 'No historical performance data';
        }

        // Adjust score based on user preferences
        if (context.userPreferences?.preferredProvider === option.provider) {
          score += 0.2;
          reasoning += ', preferred provider';
        }

        if (context.userPreferences?.speedPriority) {
          const latency = this.estimateLatency(option.provider, option.model);
          score += Math.max(0, (1 - latency / 3000)) * 0.15; // Favor faster models
        }

        if (context.userPreferences?.costSensitive) {
          const cost = this.estimateCost(option.provider, option.model, taskClassification.estimatedTokens);
          score += Math.max(0, (1 - cost / 0.01)) * 0.15; // Favor cheaper models (assuming $0.01 is expensive)
        }

        const estimatedCost = this.estimateCost(option.provider, option.model, taskClassification.estimatedTokens);
        const estimatedLatency = this.estimateLatency(option.provider, option.model);

        return {
          provider: option.provider,
          model: option.model,
          score: Math.min(1.0, score), // Cap at 1.0
          reasoning,
          estimatedCost,
          estimatedLatency,
        };
      })
    );

    // Sort by score descending
    return scoredOptions.sort((a, b) => b.score - a.score);
  }

  private recommendModelForTask(provider: Provider, taskType: TaskType): string | null {
    const providerModels = models[provider];
    if (!providerModels) return null;

    // Simple mapping - could be made more sophisticated
    switch (taskType) {
      case 'code-generation':
      case 'code-debugging':
      case 'code-review':
        return this.findModel(providerModels, ['code', 'coder', 'deepseek']) || providerModels[0].value;

      case 'reasoning':
        return this.findModel(providerModels, ['claude', 'deepseek', 'gpt-4', 'pro']) || providerModels[0].value;

      case 'creative-writing':
        return this.findModel(providerModels, ['claude', 'gpt-4', 'pro']) || providerModels[0].value;

      case 'translation':
        return this.findModel(providerModels, ['flash', '3b', '7b']) || providerModels[0].value;

      case 'general-conversation':
      case 'summarization':
      default:
        return this.findModel(providerModels, ['flash', '3b']) || providerModels[0].value;
    }
  }

  private findModel(models: Array<{ value: string; label: string }>, keywords: string[]): string | null {
    for (const keyword of keywords) {
      for (const model of models) {
        if (model.value.toLowerCase().includes(keyword.toLowerCase()) ||
            model.label.toLowerCase().includes(keyword.toLowerCase())) {
          return model.value;
        }
      }
    }
    return null;
  }

  private getDefaultModelForProvider(provider: Provider): string {
    return providers[provider]?.defaultModel || 'default';
  }

  private estimateCost(provider: Provider, model: string, estimatedTokens: number): number {
    // Rough cost estimation using the cost tracker logic
    return costTracker['calculateCost'](provider, model, estimatedTokens, estimatedTokens * 2);
  }

  private estimateLatency(provider: Provider, model: string): number {
    // Rough latency estimation based on provider/model
    const latencyMap: Record<string, number> = {
      'google-gemini-2.5-flash': 500,
      'google-gemini-2.5-pro': 1500,
      'anthropic-claude-3.5-sonnet': 2000,
      'hf-deepseek-ai': 3000,
      'hf-meta-llama-3.2-3b': 1000,
      'openai-gpt-4o-mini': 800,
    };

    const key = `${provider}-${model.split('/')[0]}`.toLowerCase();
    return latencyMap[key] || 2000;
  }

  private getFallbackDecision(reason?: string): RoutingDecision {
    const defaultProvider = providers.google.available ? 'google' : Object.keys(providers)[0] as Provider;

    return {
      provider: defaultProvider,
      model: providers[defaultProvider].defaultModel,
      confidence: 0.5,
      reasoning: reason || 'Intelligent routing disabled or failed - using default provider',
      estimatedCost: 0.001,
      estimatedLatency: 2000,
      fallbackProviders: [],
    };
  }
}

// Global router instance
export const intelligentRouter = new IntelligentRouter();
