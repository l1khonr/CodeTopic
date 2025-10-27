/**
 * Deep Research System - Multi-Agent Types
 */

export enum AgentRole {
  PLANNER = 'planner',
  RESEARCHER = 'researcher',
  ANALYST = 'analyst',
  SYNTHESIZER = 'synthesizer',
  ORCHESTRATOR = 'orchestrator',
}

export interface ResearchTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  assignedAgent?: AgentRole;
  priority: number;
  dependencies: string[];
  result?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export interface ResearchPlan {
  id: string;
  originalQuery: string;
  objectives: string[];
  researchTasks: ResearchTask[];
  timeline: {
    estimatedDuration: number;
    startTime: Date;
    endTime?: Date;
  };
  metadata: {
    userQuery: string;
    context?: any;
    preferences?: any;
  };
}

export interface AgentMessage {
  id: string;
  from: AgentRole;
  to: AgentRole;
  timestamp: Date;
  type: 'task-assignment' | 'task-result' | 'request-help' | 'share-finding';
  content: any;
  metadata?: Record<string, any>;
}

export interface ResearchFinding {
  id: string;
  source: string;
  url: string;
  title: string;
  content: string;
  relevance: number;
  timestamp: Date;
  agent: AgentRole;
  citations: string[];
}

export interface ResearchReport {
  id: string;
  plan: ResearchPlan;
  findings: ResearchFinding[];
  synthesis: string;
  audioOverview?: Blob;
  generatedAt: Date;
  metadata?: Record<string, any>;
}

export interface AgentCapabilities {
  role: AgentRole;
  tools: string[];
  expertise: string[];
  maxConcurrentTasks: number;
}

