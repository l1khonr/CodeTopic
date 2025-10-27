/**
 * Action Engine - Execute complex workflows across your entire stack
 */

import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { actionTools } from './tools';
import type { ActionTask, WorkflowExecution } from './types';

export class ActionEngine {
  /**
   * Execute a multi-step workflow
   */
  async executeWorkflow(tasks: ActionTask[], goal: string): Promise<WorkflowExecution> {
    const results: any[] = [];
    const startTime = Date.now();

    for (const task of tasks) {
      try {
        console.log(`⚡ Executing: ${task.action}`);

        const result = await this.executeTask(task, goal);
        results.push(result);

        // Run in parallel if no dependencies
        const parallelTasks = tasks.filter((t) =>
          t.dependencies?.every((d) => results.some((r) => r.id === d))
        );

        if (parallelTasks.length > 1) {
          await Promise.all(parallelTasks.map((t) => this.executeTask(t, goal)));
        }
      } catch (error) {
        console.error(`Failed to execute ${task.action}:`, error);
        results.push({ error: String(error), task });
      }
    }

    return {
      success: results.every((r) => !r.error),
      duration: Date.now() - startTime,
      results,
      taskCount: tasks.length,
    };
  }

  /**
   * Execute individual task
   */
  private async executeTask(task: ActionTask, context: string): Promise<any> {
    // Select the appropriate tool
    const tool = actionTools[task.action as keyof typeof actionTools];

    if (!tool) {
      throw new Error(`Unknown action: ${task.action}`);
    }

    // Execute with AI reasoning
    const result = await streamText({
      model: google('gemini-2.5-pro'),
      messages: [
        {
          role: 'system',
          content: `You are executing: ${task.action} with context: ${context}. 
Make smart decisions about the parameters based on the goal.`,
        },
        {
          role: 'user',
          content: `Execute task: ${JSON.stringify(task, null, 2)}`,
        },
      ],
      tools: { [task.action]: tool },
    });

    return {
      id: task.id,
      action: task.action,
      result: await result.text,
      timestamp: new Date(),
    };
  }

  /**
   * Create a workflow from natural language description
   */
  async createWorkflowFromDescription(description: string) {
    const result = await streamText({
      model: google('gemini-2.5-pro'),
      prompt: `Convert this workflow description into structured tasks:
      
      Description: ${description}
      
      Available actions: createIssue, createPR, sendMessage, createEvent, createCustomer
      
      Output JSON array of tasks with: id, action, parameters, dependencies`,
    });

    return JSON.parse(result.text);
  }
}

/**
 * Execute workflow in minutes
 */
export async function executeComplexWorkflow(
  description: string
): Promise<WorkflowExecution> {
  const engine = new ActionEngine();

  // Create workflow from description
  const tasks = await engine.createWorkflowFromDescription(description);

  // Execute workflow
  const result = await engine.executeWorkflow(tasks, description);

  return result;
}

/**
 * Example: Complete deployment workflow
 */
export async function deploymentWorkflow() {
  const tasks: ActionTask[] = [
    {
      id: '1',
      action: 'createIssue',
      parameters: {
        owner: 'myorg',
        repo: 'myapp',
        title: 'Deploy to production',
        body: 'Automated deployment workflow',
        labels: ['deployment', 'automated'],
      },
    },
    {
      id: '2',
      action: 'createPR',
      dependencies: ['1'],
      parameters: {
        owner: 'myorg',
        repo: 'myapp',
        title: 'Release v1.0.0',
        head: 'main',
        base: 'production',
      },
    },
    {
      id: '3',
      action: 'sendMessage',
      dependencies: ['1', '2'],
      parameters: {
        channel: '#deployments',
        text: '🚀 Deployment workflow complete!',
      },
    },
    {
      id: '4',
      action: 'createEvent',
      dependencies: ['3'],
      parameters: {
        summary: 'Production Deployment',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      },
    },
  ];

  const engine = new ActionEngine();
  return engine.executeWorkflow(tasks, 'Deploy application to production');
}

