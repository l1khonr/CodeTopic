// MCP Client for remote MCP server integration

interface MCPConfig {
  enabled: boolean;
  serverUrl: string;
  endpoints: {
    toolExecution: string;
    modelSelection: string;
    costTracking: string;
    payment: string;
  };
  authentication: {
    type: 'bearer' | 'api-key';
    tokenEnv: string;
  };
}

interface MCPTool {
  name: string;
  description: string;
  parameters: any;
}

interface MCPExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
}

export class MCPClient {
  private config: MCPConfig;
  private authToken?: string;

  constructor(config: MCPConfig) {
    this.config = config;
    this.authToken = process.env[config.authentication.tokenEnv];
  }

  // List available remote MCP tools
  async listTools(): Promise<MCPTool[]> {
    if (!this.config.enabled) return [];

    try {
      const response = await fetch(`${this.config.serverUrl}/tools`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      return data.tools || [];
    } catch (error) {
      console.error('Failed to list MCP tools:', error);
      return [];
    }
  }

  // Execute tool on remote MCP server
  async executeTool(toolName: string, args: any): Promise<MCPExecutionResult> {
    if (!this.config.enabled) {
      return { success: false, error: 'MCP client disabled' };
    }

    try {
      const response = await fetch(`${this.config.serverUrl}${this.config.endpoints.toolExecution}`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool_name: toolName,
          arguments: args,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      return {
        success: data.success,
        result: data.result,
        error: data.error,
      };
    } catch (error) {
      console.error('Failed to execute MCP tool:', error);
      return { success: false, error: error.message };
    }
  }

  // Track cost on remote MCP server
  async trackCost(costData: {
    provider: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    sessionId: string;
    userId?: string;
  }): Promise<boolean> {
    if (!this.config.enabled) return false;

    try {
      const response = await fetch(`${this.config.serverUrl}${this.config.endpoints.costTracking}`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(costData),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to track MCP cost:', error);
      return false;
    }
  }

  // Process payment on remote MCP server
  async processPayment(paymentData: {
    amount: number;
    sessionId: string;
    userId?: string;
    method: string;
  }): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    if (!this.config.enabled) {
      return { success: false, error: 'MCP client disabled' };
    }

    try {
      const response = await fetch(`${this.config.serverUrl}${this.config.endpoints.payment}`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      return {
        success: data.success,
        transactionId: data.transactionId,
        error: data.error,
      };
    } catch (error) {
      console.error('Failed to process MCP payment:', error);
      return { success: false, error: error.message };
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.config.authentication.type === 'bearer' && this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    } else if (this.config.authentication.type === 'api-key' && this.authToken) {
      headers['X-API-Key'] = this.authToken;
    }

    return headers;
  }
}

// Global MCP client instance
export const mcpClient = new MCPClient({
  enabled: process.env.MCP_REMOTE_ENABLED === 'true',
  serverUrl: process.env.MCP_SERVER_URL || 'https://mcp-server.example.com',
  endpoints: {
    toolExecution: '/api/tools/execute',
    modelSelection: '/api/models/select',
    costTracking: '/api/costs/track',
    payment: '/api/payments/process',
  },
  authentication: {
    type: 'bearer',
    tokenEnv: 'MCP_SERVER_TOKEN',
  },
});