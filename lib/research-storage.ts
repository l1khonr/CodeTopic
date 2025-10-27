import { ResearchTask, ResearchTaskType } from './research-agents';
import { PipelineExecution } from './research-pipeline';
import { storage } from './storage';

/**
 * Research Task Storage and Persistence
 * Handles saving and retrieving research tasks and their progress
 */

export interface ResearchSession {
  id: string;
  userId: string;
  title: string;
  description?: string;
  tasks: ResearchTask[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'archived';
  tags: string[];
}

export interface ResearchTaskProgress {
  taskId: string;
  sessionId: string;
  pipelineExecution?: PipelineExecution;
  checkpoints: TaskCheckpoint[];
  currentStep?: string;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
}

export interface TaskCheckpoint {
  id: string;
  stepId: string;
  timestamp: Date;
  data: any;
  description: string;
}

export class ResearchStorage {
  private readonly SESSIONS_KEY = 'research_sessions';
  private readonly TASKS_KEY = 'research_tasks';
  private readonly PROGRESS_KEY = 'research_progress';

  /**
   * Create a new research session
   */
  async createSession(
    userId: string,
    title: string,
    description?: string,
    tags: string[] = []
  ): Promise<ResearchSession> {
    const session: ResearchSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      description,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      tags
    };

    await this.saveSession(session);
    return session;
  }

  /**
   * Add a task to a research session
   */
  async addTaskToSession(sessionId: string, task: ResearchTask): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.tasks.push(task);
    session.updatedAt = new Date();
    await this.saveSession(session);

    // Save task individually
    await this.saveTask(task);

    // Initialize progress tracking
    await this.initializeTaskProgress(task.id, sessionId);
  }

  /**
   * Save a research task
   */
  async saveTask(task: ResearchTask): Promise<void> {
    const tasks = await this.getAllTasks();
    const existingIndex = tasks.findIndex(t => t.id === task.id);

    if (existingIndex >= 0) {
      tasks[existingIndex] = { ...task, updatedAt: new Date() };
    } else {
      (task as any).updatedAt = new Date();
      tasks.push(task);
    }

    await storage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  /**
   * Get a research task by ID
   */
  async getTask(taskId: string): Promise<ResearchTask | null> {
    const tasks = await this.getAllTasks();
    return tasks.find(t => t.id === taskId) || null;
  }

  /**
   * Get all research tasks
   */
  async getAllTasks(): Promise<ResearchTask[]> {
    const data = await storage.getItem(this.TASKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Update task progress
   */
  async updateTaskProgress(
    taskId: string,
    progress: Partial<ResearchTaskProgress>
  ): Promise<void> {
    const allProgress = await this.getAllTaskProgress();
    const existingIndex = allProgress.findIndex(p => p.taskId === taskId);

    if (existingIndex >= 0) {
      allProgress[existingIndex] = {
        ...allProgress[existingIndex],
        ...progress,
        updatedAt: new Date()
      };
    } else {
      allProgress.push({
        taskId,
        sessionId: progress.sessionId || '',
        checkpoints: progress.checkpoints || [],
        ...progress,
        updatedAt: new Date()
      } as ResearchTaskProgress);
    }

    await storage.setItem(this.PROGRESS_KEY, JSON.stringify(allProgress));
  }

  /**
   * Get task progress
   */
  async getTaskProgress(taskId: string): Promise<ResearchTaskProgress | null> {
    const allProgress = await this.getAllTaskProgress();
    return allProgress.find(p => p.taskId === taskId) || null;
  }

  /**
   * Add a checkpoint to task progress
   */
  async addTaskCheckpoint(
    taskId: string,
    stepId: string,
    data: any,
    description: string
  ): Promise<void> {
    const progress = await this.getTaskProgress(taskId);
    if (!progress) {
      throw new Error(`Progress not found for task ${taskId}`);
    }

    const checkpoint: TaskCheckpoint = {
      id: `checkpoint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      stepId,
      timestamp: new Date(),
      data,
      description
    };

    progress.checkpoints.push(checkpoint);
    await this.updateTaskProgress(taskId, progress);
  }

  /**
   * Save a research session
   */
  async saveSession(session: ResearchSession): Promise<void> {
    const sessions = await this.getAllSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }

    await storage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
  }

  /**
   * Get a research session by ID
   */
  async getSession(sessionId: string): Promise<ResearchSession | null> {
    const sessions = await this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  /**
   * Get all research sessions for a user
   */
  async getUserSessions(userId: string): Promise<ResearchSession[]> {
    const sessions = await this.getAllSessions();
    return sessions.filter(s => s.userId === userId);
  }

  /**
   * Get all research sessions
   */
  async getAllSessions(): Promise<ResearchSession[]> {
    const data = await storage.getItem(this.SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get all task progress records
   */
  async getAllTaskProgress(): Promise<ResearchTaskProgress[]> {
    const data = await storage.getItem(this.PROGRESS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Initialize progress tracking for a new task
   */
  private async initializeTaskProgress(taskId: string, sessionId: string): Promise<void> {
    const progress: ResearchTaskProgress = {
      taskId,
      sessionId,
      checkpoints: [],
      updatedAt: new Date()
    };

    await this.updateTaskProgress(taskId, progress);
  }

  /**
   * Archive a completed research session
   */
  async archiveSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      session.status = 'archived';
      session.updatedAt = new Date();
      await this.saveSession(session);
    }
  }

  /**
   * Delete a research task
   */
  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getAllTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    await storage.setItem(this.TASKS_KEY, JSON.stringify(filteredTasks));

    // Also remove progress
    const allProgress = await this.getAllTaskProgress();
    const filteredProgress = allProgress.filter(p => p.taskId !== taskId);
    await storage.setItem(this.PROGRESS_KEY, JSON.stringify(filteredProgress));
  }

  /**
   * Delete a research session and all its tasks
   */
  async deleteSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    // Delete all tasks in the session
    for (const task of session.tasks) {
      await this.deleteTask(task.id);
    }

    // Remove session
    const sessions = await this.getAllSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    await storage.setItem(this.SESSIONS_KEY, JSON.stringify(filteredSessions));
  }

  /**
   * Search research sessions by title, description, or tags
   */
  async searchSessions(query: string, userId: string): Promise<ResearchSession[]> {
    const sessions = await this.getUserSessions(userId);
    const lowercaseQuery = query.toLowerCase();

    return sessions.filter(session =>
      session.title.toLowerCase().includes(lowercaseQuery) ||
      (session.description && session.description.toLowerCase().includes(lowercaseQuery)) ||
      session.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get recent research sessions
   */
  async getRecentSessions(userId: string, limit: number = 10): Promise<ResearchSession[]> {
    const sessions = await this.getUserSessions(userId);
    return sessions
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Export research session data
   */
  async exportSession(sessionId: string): Promise<string> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Get progress for all tasks
    const taskProgress = await Promise.all(
      session.tasks.map(task => this.getTaskProgress(task.id))
    );

    const exportData = {
      session,
      taskProgress: taskProgress.filter(Boolean),
      exportedAt: new Date(),
      version: '1.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import research session data
   */
  async importSession(importData: string, userId: string): Promise<ResearchSession> {
    const data = JSON.parse(importData);

    // Validate import data
    if (!data.session || !data.taskProgress) {
      throw new Error('Invalid import data format');
    }

    // Create new session with imported data
    const session: ResearchSession = {
      ...data.session,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.saveSession(session);

    // Import tasks and progress
    for (const task of session.tasks) {
      await this.saveTask(task);
    }

    for (const progress of data.taskProgress) {
      await this.updateTaskProgress(progress.taskId, {
        ...progress,
        sessionId: session.id
      });
    }

    return session;
  }

  /**
   * Get session statistics
   */
  async getSessionStats(sessionId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    failedTasks: number;
    averageCompletionTime: number;
    totalEstimatedCost: number;
  }> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const stats = {
      totalTasks: session.tasks.length,
      completedTasks: session.tasks.filter(t => t.status === 'completed').length,
      inProgressTasks: session.tasks.filter(t => t.status === 'in-progress').length,
      failedTasks: session.tasks.filter(t => t.status === 'failed').length,
      averageCompletionTime: 0,
      totalEstimatedCost: session.tasks.reduce((sum, t) => sum + t.metadata.estimatedCost, 0)
    };

    // Calculate average completion time for completed tasks
    const completedTasks = session.tasks.filter(t => t.status === 'completed');
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((sum, task) => {
        // Simplified - in production, track actual completion times
        return sum + (task.metadata.estimatedDuration || 30);
      }, 0);
      stats.averageCompletionTime = totalTime / completedTasks.length;
    }

    return stats;
  }
}

// Export singleton instance
export const researchStorage = new ResearchStorage();