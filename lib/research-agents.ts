/**
 * Multi-agent Research System
 * Specialized agents for comprehensive research tasks
 */

export type ResearchAgentType =
  | 'orchestrator'
  | 'search-specialist'
  | 'analysis-expert'
  | 'fact-checker'
  | 'synthesis-writer'
  | 'citation-manager';

export type ResearchTaskType =
  | 'literature-review'
  | 'market-research'
  | 'technical-analysis'
  | 'academic-research'
  | 'news-analysis'
  | 'comparative-study';

export interface ResearchAgent {
  id: string;
  type: ResearchAgentType;
  name: string;
  description: string;
  capabilities: string[];
  model: string; // Preferred model for this agent
  costLimit: number; // Max cost per task
  maxParallelTasks: number;
}

export interface ResearchTask {
  id: string;
  type: ResearchTaskType;
  topic: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  assignedAgents: string[];
  subtasks: SubTask[];
  results: ResearchResult[];
  metadata: {
    priority: 'low' | 'medium' | 'high' | 'urgent';
    deadline?: Date;
    requestedBy: string;
    createdAt: Date;
    estimatedCost: number;
  };
}

export interface SubTask {
  id: string;
  agentId: string;
  description: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'failed';
  dependencies: string[]; // Subtask IDs this depends on
  result?: any;
  error?: string;
}

export interface ResearchResult {
  agentId: string;
  type: 'search' | 'analysis' | 'synthesis' | 'citation';
  content: any;
  confidence: number; // 0-1
  sources: Source[];
  timestamp: Date;
}

export interface Source {
  url?: string;
  title: string;
  author?: string;
  publicationDate?: Date;
  credibilityScore: number; // 0-1
  type: 'academic' | 'news' | 'web' | 'book' | 'report';
}

export interface AgentMessage {
  from: string; // Agent ID
  to: string; // Agent ID or 'orchestrator'
  type: 'task-assignment' | 'result' | 'request' | 'coordination' | 'error';
  content: any;
  timestamp: Date;
  correlationId?: string; // For tracking related messages
}

/**
 * Predefined Research Agents
 */
export const RESEARCH_AGENTS: Record<ResearchAgentType, Omit<ResearchAgent, 'id'>> = {
  orchestrator: {
    type: 'orchestrator',
    name: 'Research Orchestrator',
    description: 'Coordinates research tasks and delegates to specialized agents',
    capabilities: [
      'task-planning',
      'agent-coordination',
      'progress-tracking',
      'result-synthesis',
      'quality-assurance'
    ],
    model: 'gemini-2.5-pro',
    costLimit: 0.05,
    maxParallelTasks: 5
  },

  'search-specialist': {
    type: 'search-specialist',
    name: 'Web Search Specialist',
    description: 'Expert in web searching and information gathering',
    capabilities: [
      'web-search',
      'source-discovery',
      'query-optimization',
      'result-filtering',
      'relevance-ranking'
    ],
    model: 'gemini-2.5-flash',
    costLimit: 0.01,
    maxParallelTasks: 3
  },

  'analysis-expert': {
    type: 'analysis-expert',
    name: 'Data Analysis Expert',
    description: 'Specializes in analyzing and synthesizing information',
    capabilities: [
      'data-analysis',
      'pattern-recognition',
      'trend-identification',
      'comparative-analysis',
      'insight-extraction'
    ],
    model: 'claude-3.5-sonnet',
    costLimit: 0.03,
    maxParallelTasks: 2
  },

  'fact-checker': {
    type: 'fact-checker',
    name: 'Fact Checker',
    description: 'Validates information accuracy and credibility',
    capabilities: [
      'fact-verification',
      'source-validation',
      'bias-detection',
      'contradiction-analysis',
      'credibility-assessment'
    ],
    model: 'gemini-2.5-pro',
    costLimit: 0.02,
    maxParallelTasks: 2
  },

  'synthesis-writer': {
    type: 'synthesis-writer',
    name: 'Synthesis Writer',
    description: 'Creates coherent summaries and reports',
    capabilities: [
      'content-synthesis',
      'report-writing',
      'executive-summary',
      'recommendation-generation',
      'narrative-construction'
    ],
    model: 'claude-3.5-sonnet',
    costLimit: 0.04,
    maxParallelTasks: 1
  },

  'citation-manager': {
    type: 'citation-manager',
    name: 'Citation Manager',
    description: 'Manages citations and ensures academic integrity',
    capabilities: [
      'citation-formatting',
      'reference-management',
      'plagiarism-checking',
      'source-attribution',
      'bibliography-generation'
    ],
    model: 'gemini-2.5-flash',
    costLimit: 0.005,
    maxParallelTasks: 1
  }
};

/**
 * Research Task Templates
 */
export const RESEARCH_TASK_TEMPLATES: Record<ResearchTaskType, {
  requiredAgents: ResearchAgentType[];
  estimatedDuration: number; // minutes
  estimatedCost: number;
  workflow: string[];
}> = {
  'literature-review': {
    requiredAgents: ['orchestrator', 'search-specialist', 'analysis-expert', 'fact-checker', 'synthesis-writer', 'citation-manager'],
    estimatedDuration: 60,
    estimatedCost: 0.15,
    workflow: [
      'search-literature',
      'analyze-sources',
      'fact-check-findings',
      'synthesize-results',
      'generate-citations'
    ]
  },

  'market-research': {
    requiredAgents: ['orchestrator', 'search-specialist', 'analysis-expert', 'synthesis-writer'],
    estimatedDuration: 45,
    estimatedCost: 0.10,
    workflow: [
      'market-scan',
      'competitor-analysis',
      'trend-analysis',
      'report-compilation'
    ]
  },

  'technical-analysis': {
    requiredAgents: ['orchestrator', 'search-specialist', 'analysis-expert', 'fact-checker'],
    estimatedDuration: 40,
    estimatedCost: 0.08,
    workflow: [
      'technical-search',
      'feature-analysis',
      'performance-evaluation',
      'recommendations'
    ]
  },

  'academic-research': {
    requiredAgents: ['orchestrator', 'search-specialist', 'analysis-expert', 'fact-checker', 'citation-manager', 'synthesis-writer'],
    estimatedDuration: 90,
    estimatedCost: 0.20,
    workflow: [
      'literature-search',
      'methodology-review',
      'data-analysis',
      'peer-review-simulation',
      'academic-paper-draft'
    ]
  },

  'news-analysis': {
    requiredAgents: ['orchestrator', 'search-specialist', 'fact-checker', 'analysis-expert', 'synthesis-writer'],
    estimatedDuration: 30,
    estimatedCost: 0.07,
    workflow: [
      'news-gathering',
      'fact-verification',
      'impact-analysis',
      'summary-report'
    ]
  },

  'comparative-study': {
    requiredAgents: ['orchestrator', 'search-specialist', 'analysis-expert', 'fact-checker', 'synthesis-writer'],
    estimatedDuration: 50,
    estimatedCost: 0.12,
    workflow: [
      'subject-research',
      'comparison-framework',
      'side-by-side-analysis',
      'conclusion-synthesis'
    ]
  }
};

/**
 * Agent Communication System
 */
export class AgentCommunicationBus {
  private agents: Map<string, ResearchAgent> = new Map();
  private messageQueue: AgentMessage[] = [];
  private activeTasks: Map<string, ResearchTask> = new Map();

  registerAgent(agent: ResearchAgent): void {
    this.agents.set(agent.id, agent);
  }

  sendMessage(message: AgentMessage): void {
    this.messageQueue.push(message);
    this.processMessages();
  }

  private processMessages(): void {
    // Process messages in order (simple FIFO for now)
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      this.routeMessage(message);
    }
  }

  private routeMessage(message: AgentMessage): void {
    const targetAgent = this.agents.get(message.to);
    if (!targetAgent) {
      console.warn(`Unknown agent: ${message.to}`);
      return;
    }

    // In a real implementation, this would trigger the agent's processing logic
    console.log(`Routing message from ${message.from} to ${message.to}:`, message);
  }

  assignTask(task: ResearchTask): void {
    this.activeTasks.set(task.id, task);

    // Send task assignment messages to required agents
    task.assignedAgents.forEach(agentId => {
      this.sendMessage({
        from: 'orchestrator',
        to: agentId,
        type: 'task-assignment',
        content: { taskId: task.id, task },
        timestamp: new Date()
      });
    });
  }

  getTaskStatus(taskId: string): ResearchTask | undefined {
    return this.activeTasks.get(taskId);
  }

  updateTaskProgress(taskId: string, updates: Partial<ResearchTask>): void {
    const task = this.activeTasks.get(taskId);
    if (task) {
      Object.assign(task, updates);
      // Notify orchestrator of progress
      this.sendMessage({
        from: 'system',
        to: 'orchestrator',
        type: 'result',
        content: { taskId, updates },
        timestamp: new Date()
      });
    }
  }
}