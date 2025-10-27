/**
 * Performance Tracking System
 * Tracks provider performance metrics for intelligent routing
 */

import { TaskType } from './task-classifier';
import { Provider } from './providers';

export interface PerformanceMetrics {
  provider: Provider;
  model: string;
  taskType: TaskType;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  success: boolean;
  errorType?: string;
  userRating?: number; // 1-5 stars
  timestamp: Date;
  sessionId: string;
}

export interface AggregatedMetrics {
  provider: Provider;
  taskType: TaskType;
  avgLatency: number;
  avgCost: number;
  successRate: number;
  totalRequests: number;
  avgRating?: number;
  lastUpdated: Date;
}

export class PerformanceTracker {
  private metrics: PerformanceMetrics[] = [];
  private readonly MAX_METRICS = 10000; // Keep last 10k metrics in memory

  /**
   * Track a completed request
   */
  async trackRequest(metrics: PerformanceMetrics): Promise<void> {
    this.metrics.push(metrics);

    // Trim old metrics if needed
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // In production, save to database here
    await this.saveToDatabase(metrics);
  }

  /**
   * Get aggregated metrics for a provider and task type
   */
  getAggregatedMetrics(
    provider: Provider,
    taskType: TaskType,
    timeWindowHours: number = 24
  ): AggregatedMetrics | null {
    const cutoffTime = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);
    
    const relevantMetrics = this.metrics.filter(
      m => m.provider === provider && 
           m.taskType === taskType && 
           m.timestamp >= cutoffTime
    );

    if (relevantMetrics.length === 0) {
      return null;
    }

    const totalRequests = relevantMetrics.length;
    const successfulRequests = relevantMetrics.filter(m => m.success).length;
    const avgLatency = relevantMetrics.reduce((sum, m) => sum + m.latencyMs, 0) / totalRequests;
    const avgCost = relevantMetrics.reduce((sum, m) => sum + m.cost, 0) / totalRequests;
    const successRate = successfulRequests / totalRequests;

    const ratedRequests = relevantMetrics.filter(m => m.userRating !== undefined);
    const avgRating = ratedRequests.length > 0
      ? ratedRequests.reduce((sum, m) => sum + (m.userRating || 0), 0) / ratedRequests.length
      : undefined;

    return {
      provider,
      taskType,
      avgLatency,
      avgCost,
      successRate,
      totalRequests,
      avgRating,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get all metrics for a provider
   */
  getProviderMetrics(provider: Provider, timeWindowHours: number = 24): PerformanceMetrics[] {
    const cutoffTime = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);
    return this.metrics.filter(
      m => m.provider === provider && m.timestamp >= cutoffTime
    );
  }

  /**
   * Compare providers for a specific task type
   */
  compareProviders(taskType: TaskType): AggregatedMetrics[] {
    const providers: Provider[] = ['google', 'hf', 'openai', 'anthropic'];
    
    return providers
      .map(provider => this.getAggregatedMetrics(provider, taskType))
      .filter((metrics): metrics is AggregatedMetrics => metrics !== null)
      .sort((a, b) => {
        // Sort by a composite score: success rate (40%) + latency (30%) + cost (30%)
        const scoreA = (a.successRate * 0.4) + (1 / (a.avgLatency / 1000) * 0.3) + (1 / a.avgCost * 0.3);
        const scoreB = (b.successRate * 0.4) + (1 / (b.avgLatency / 1000) * 0.3) + (1 / b.avgCost * 0.3);
        return scoreB - scoreA;
      });
  }

  /**
   * Get performance summary across all providers
   */
  getGlobalSummary(timeWindowHours: number = 24): {
    totalRequests: number;
    totalCost: number;
    avgLatency: number;
    successRate: number;
    providerBreakdown: Record<Provider, number>;
  } {
    const cutoffTime = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoffTime);

    const totalRequests = recentMetrics.length;
    const totalCost = recentMetrics.reduce((sum, m) => sum + m.cost, 0);
    const avgLatency = recentMetrics.reduce((sum, m) => sum + m.latencyMs, 0) / totalRequests;
    const successfulRequests = recentMetrics.filter(m => m.success).length;
    const successRate = totalRequests > 0 ? successfulRequests / totalRequests : 0;

    const providerBreakdown = recentMetrics.reduce((acc, m) => {
      acc[m.provider] = (acc[m.provider] || 0) + 1;
      return acc;
    }, {} as Record<Provider, number>);

    return {
      totalRequests,
      totalCost,
      avgLatency,
      successRate,
      providerBreakdown,
    };
  }

  /**
   * Save metrics to database (stub for now)
   */
  private async saveToDatabase(metrics: PerformanceMetrics): Promise<void> {
    // In production, save to PostgreSQL/Drizzle
    // For now, just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[PerformanceTracker]', {
        provider: metrics.provider,
        taskType: metrics.taskType,
        latency: `${metrics.latencyMs}ms`,
        cost: `$${metrics.cost.toFixed(4)}`,
        success: metrics.success,
      });
    }
  }

  /**
   * Load historical metrics from database
   */
  async loadFromDatabase(limit: number = 1000): Promise<void> {
    // In production, load from database
    // For now, start with empty metrics
  }
}

// Singleton instance
export const performanceTracker = new PerformanceTracker();

