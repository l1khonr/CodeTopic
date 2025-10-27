/**
 * Action Engine Types
 */

export interface ActionTask {
  id: string;
  action: string;
  parameters: Record<string, any>;
  dependencies?: string[];
  condition?: string; // Optional condition to execute
}

export interface WorkflowExecution {
  success: boolean;
  duration: number;
  results: any[];
  taskCount: number;
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  tasks: ActionTask[];
  schedule?: {
    frequency: 'once' | 'daily' | 'weekly';
    cron?: string;
  };
}

