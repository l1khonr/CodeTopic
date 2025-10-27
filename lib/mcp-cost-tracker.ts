// MCP Cost Tracking and Payment Integration

interface CostRecord {
  id: string;
  timestamp: Date;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  userId?: string;
  sessionId: string;
}

interface PaymentConfig {
  autoApproveThreshold: number;
  requireApprovalAbove: number;
  methods: {
    cloud: 'charge-on-usage' | 'prepaid';
    local: 'free';
    hybrid: 'use-local-first';
  };
}

export class MCPCostTracker {
  private costs: CostRecord[] = [];
  private paymentConfig: PaymentConfig;

  constructor(paymentConfig?: Partial<PaymentConfig>) {
    this.paymentConfig = {
      autoApproveThreshold: 0.01,
      requireApprovalAbove: 0.10,
      methods: {
        cloud: 'charge-on-usage',
        local: 'free',
        hybrid: 'use-local-first',
      },
      ...paymentConfig,
    };
  }

  // Track cost for a model usage
  trackCost(
    provider: string,
    model: string,
    inputTokens: number,
    outputTokens: number,
    sessionId: string,
    userId?: string
  ): CostRecord {
    const cost = this.calculateCost(provider, model, inputTokens, outputTokens);

    const record: CostRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      provider,
      model,
      inputTokens,
      outputTokens,
      cost,
      userId,
      sessionId,
    };

    this.costs.push(record);
    return record;
  }

  // Calculate cost based on provider and model
  private calculateCost(
    provider: string,
    model: string,
    inputTokens: number,
    outputTokens: number
  ): number {
    // Simplified pricing (in USD per 1K tokens)
    const pricing: Record<string, { input: number; output: number }> = {
      'google-gemini': { input: 0.00025, output: 0.0005 },
      'anthropic-claude': { input: 0.0008, output: 0.0024 },
      'openai-gpt': { input: 0.0015, output: 0.002 },
      'hf-local': { input: 0, output: 0 }, // Free for local models
    };

    const key = `${provider}-${model.split('-')[0]}`;
    const rates = pricing[key] || pricing['google-gemini'];

    return (inputTokens * rates.input + outputTokens * rates.output) / 1000;
  }

  // Check if payment approval is needed
  needsApproval(cost: number): boolean {
    return cost > this.paymentConfig.requireApprovalAbove;
  }

  // Auto-approve if within threshold
  canAutoApprove(cost: number): boolean {
    return cost <= this.paymentConfig.autoApproveThreshold;
  }

  // Get costs for a session
  getSessionCosts(sessionId: string): CostRecord[] {
    return this.costs.filter(cost => cost.sessionId === sessionId);
  }

  // Get total cost for a session
  getSessionTotal(sessionId: string): number {
    return this.getSessionCosts(sessionId).reduce((total, cost) => total + cost.cost, 0);
  }

  // Get costs for a user
  getUserCosts(userId: string): CostRecord[] {
    return this.costs.filter(cost => cost.userId === userId);
  }

  // Get total cost for a user
  getUserTotal(userId: string): number {
    return this.getUserCosts(userId).reduce((total, cost) => total + cost.cost, 0);
  }

  // Export costs for billing
  exportCosts(startDate?: Date, endDate?: Date): CostRecord[] {
    let filteredCosts = this.costs;

    if (startDate) {
      filteredCosts = filteredCosts.filter(cost => cost.timestamp >= startDate);
    }

    if (endDate) {
      filteredCosts = filteredCosts.filter(cost => cost.timestamp <= endDate);
    }

    return filteredCosts;
  }

  // Clear old costs (for memory management)
  cleanup(daysOld: number = 30): void {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);

    this.costs = this.costs.filter(cost => cost.timestamp > cutoff);
  }
}

// Global cost tracker instance
export const costTracker = new MCPCostTracker();