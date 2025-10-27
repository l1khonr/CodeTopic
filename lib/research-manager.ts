import { ResearchTask, ResearchTaskType } from './research-agents';
import { researchOrchestrator } from './research-orchestrator';
import { researchPipeline } from './research-pipeline';
import { researchStorage } from './research-storage';
import { generateObject } from 'ai';

/**
 * Research Manager - Main interface for the multi-agent research system
 * Handles research sessions, task creation, and system coordination
 */

export interface ResearchQuery {
  topic: string;
  description?: string;
  type: ResearchTaskType;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: Date;
  tags?: string[];
}

export interface ResearchResult {
  sessionId: string;
  taskId: string;
  status: 'success' | 'partial' | 'failed';
  report: {
    title: string;
    summary: string;
    findings: any[];
    sources: any[];
    recommendations?: string[];
  };
  metadata: {
    startedAt: Date;
    completedAt: Date;
    totalCost: number;
    agentsUsed: string[];
  };
}

export class ResearchManager {
  private activeSessions: Map<string, string[]> = new Map(); // sessionId -> taskIds

  /**
   * Start a new research session
   */
  async startResearchSession(
    userId: string,
    title: string,
    description?: string,
    tags: string[] = []
  ): Promise<string> {
    const session = await researchStorage.createSession(userId, title, description, tags);
    this.activeSessions.set(session.id, []);
    return session.id;
  }

  /**
   * Analyze a research query and determine the best approach
   */
  async analyzeQuery(query: ResearchQuery): Promise<{
    recommendedType: ResearchTaskType;
    reasoning: string;
    estimatedDuration: number;
    estimatedCost: number;
    requiredAgents: string[];
  }> {
    // Use AI to analyze the query and recommend the best research type
    const analysis = await generateObject({
      model: 'gemini-2.5-flash',
      schema: {
        type: 'object',
        properties: {
          recommendedType: {
            type: 'string',
            enum: ['literature-review', 'market-research', 'technical-analysis', 'academic-research', 'news-analysis', 'comparative-study']
          },
          reasoning: { type: 'string' },
          estimatedDuration: { type: 'number' },
          estimatedCost: { type: 'number' },
          requiredAgents: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['recommendedType', 'reasoning', 'estimatedDuration', 'estimatedCost', 'requiredAgents']
      },
      prompt: `Analyze this research query and recommend the most appropriate research type:

Query: "${query.topic}"
Description: "${query.description || 'No description provided'}"

Available research types:
- literature-review: Comprehensive review of existing research and publications
- market-research: Analysis of market conditions, competitors, and opportunities
- technical-analysis: Evaluation of technical solutions and implementations
- academic-research: Rigorous academic study with methodology and analysis
- news-analysis: Analysis of current events and news developments
- comparative-study: Comparison of multiple options or approaches

Provide:
1. Most appropriate research type
2. Reasoning for your choice
3. Estimated duration in minutes
4. Estimated cost in USD
5. List of required specialized agents`
    });

    return analysis;
  }

  /**
   * Execute a comprehensive research task
   */
  async executeResearch(
    sessionId: string,
    query: ResearchQuery
  ): Promise<ResearchResult> {
    const startTime = new Date();

    try {
      // Analyze the query to determine optimal approach
      const analysis = await this.analyzeQuery(query);

      // Create the research task
      const task = await researchOrchestrator.createResearchTask(
        analysis.recommendedType,
        query.topic,
        query.description || query.topic,
        {
          priority: query.priority,
          deadline: query.deadline,
          requestedBy: 'user'
        }
      );

      // Add task to session
      await researchStorage.addTaskToSession(sessionId, task);

      // Track active tasks
      const activeTasks = this.activeSessions.get(sessionId) || [];
      activeTasks.push(task.id);
      this.activeSessions.set(sessionId, activeTasks);

      // Start the research task
      await researchOrchestrator.startResearchTask(task.id);

      // Execute through pipeline
      const pipelineExecution = await researchPipeline.executePipeline(task);

      // Generate final report
      const report = await this.generateFinalReport(task, pipelineExecution);

      // Update session
      const session = await researchStorage.getSession(sessionId);
      if (session) {
        session.updatedAt = new Date();
        await researchStorage.saveSession(session);
      }

      // Clean up active tasks
      const remainingTasks = activeTasks.filter(id => id !== task.id);
      this.activeSessions.set(sessionId, remainingTasks);

      return {
        sessionId,
        taskId: task.id,
        status: 'success',
        report,
        metadata: {
          startedAt: startTime,
          completedAt: new Date(),
          totalCost: analysis.estimatedCost,
          agentsUsed: analysis.requiredAgents
        }
      };

    } catch (error) {
      console.error('Research execution failed:', error);
      return {
        sessionId,
        taskId: '',
        status: 'failed',
        report: {
          title: 'Research Failed',
          summary: `Research on "${query.topic}" failed: ${error.message}`,
          findings: [],
          sources: []
        },
        metadata: {
          startedAt: startTime,
          completedAt: new Date(),
          totalCost: 0,
          agentsUsed: []
        }
      };
    }
  }

  /**
   * Generate final comprehensive report
   */
  private async generateFinalReport(
    task: ResearchTask,
    pipelineExecution: any
  ): Promise<ResearchResult['report']> {
    // Synthesize all results into a comprehensive report
    const synthesis = await generateObject({
      model: 'gemini-2.5-pro',
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          keyFindings: {
            type: 'array',
            items: { type: 'string' }
          },
          detailedAnalysis: { type: 'string' },
          sources: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                url: { type: 'string' },
                credibility: { type: 'number' },
                summary: { type: 'string' }
              }
            }
          },
          recommendations: {
            type: 'array',
            items: { type: 'string' }
          },
          limitations: { type: 'string' }
        },
        required: ['title', 'summary', 'keyFindings', 'detailedAnalysis', 'sources']
      },
      prompt: `Create a comprehensive research report based on the following research task and results:

Task Type: ${task.type}
Topic: ${task.topic}
Description: ${task.description}

Research Results:
${JSON.stringify(task.results, null, 2)}

Pipeline Execution:
${JSON.stringify(pipelineExecution, null, 2)}

Create a well-structured report that includes:
1. Compelling title
2. Executive summary
3. Key findings (bullet points)
4. Detailed analysis
5. Sources with credibility scores
6. Recommendations (if applicable)
7. Limitations of the research

Make the report professional, comprehensive, and actionable.`
    });

    return {
      title: synthesis.title,
      summary: synthesis.summary,
      findings: synthesis.keyFindings.map(finding => ({
        type: 'finding',
        content: finding,
        category: 'general'
      })),
      sources: synthesis.sources,
      recommendations: synthesis.recommendations
    };
  }

  /**
   * Get research session status
   */
  async getSessionStatus(sessionId: string): Promise<{
    session: any;
    activeTasks: ResearchTask[];
    completedTasks: ResearchTask[];
    stats: any;
  }> {
    const session = await researchStorage.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const activeTaskIds = this.activeSessions.get(sessionId) || [];
    const activeTasks = await Promise.all(
      activeTaskIds.map(id => researchStorage.getTask(id))
    );
    const validActiveTasks = activeTasks.filter(Boolean) as ResearchTask[];

    const completedTasks = session.tasks.filter(task =>
      task.status === 'completed' && !activeTaskIds.includes(task.id)
    );

    const stats = await researchStorage.getSessionStats(sessionId);

    return {
      session,
      activeTasks: validActiveTasks,
      completedTasks,
      stats
    };
  }

  /**
   * Cancel an active research task
   */
  async cancelResearchTask(sessionId: string, taskId: string): Promise<void> {
    await researchOrchestrator.cancelTask(taskId);

    // Remove from active tasks
    const activeTasks = this.activeSessions.get(sessionId) || [];
    const filteredTasks = activeTasks.filter(id => id !== taskId);
    this.activeSessions.set(sessionId, filteredTasks);

    // Update task status
    const task = await researchStorage.getTask(taskId);
    if (task) {
      task.status = 'failed';
      await researchStorage.saveTask(task);
    }
  }

  /**
   * Get research history for a user
   */
  async getResearchHistory(userId: string): Promise<any[]> {
    const sessions = await researchStorage.getUserSessions(userId);
    return sessions.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      taskCount: session.tasks.length,
      completedTasks: session.tasks.filter(t => t.status === 'completed').length,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      status: session.status,
      tags: session.tags
    }));
  }

  /**
   * Export research session
   */
  async exportResearch(sessionId: string): Promise<string> {
    return await researchStorage.exportSession(sessionId);
  }

  /**
   * Import research session
   */
  async importResearch(importData: string, userId: string): Promise<string> {
    const session = await researchStorage.importSession(importData, userId);
    return session.id;
  }

  /**
   * Search research sessions
   */
  async searchResearch(query: string, userId: string): Promise<any[]> {
    const sessions = await researchStorage.searchSessions(query, userId);
    return sessions.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      tags: session.tags,
      updatedAt: session.updatedAt
    }));
  }
}

// Export singleton instance
export const researchManager = new ResearchManager();