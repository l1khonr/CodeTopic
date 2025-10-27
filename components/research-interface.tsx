'use client';

import { useState, useEffect, useCallback } from 'react';
import { ResearchTaskType } from '@/lib/research-agents';

interface ResearchQuery {
  topic: string;
  description?: string;
  type: ResearchTaskType;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: Date;
  tags?: string[];
}

interface ResearchResult {
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

export default function ResearchInterface() {
  const [mode, setMode] = useState<'chat' | 'research'>('research');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [query, setQuery] = useState<ResearchQuery>({
    topic: '',
    description: '',
    type: 'literature-review',
    priority: 'medium'
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [currentResult, setCurrentResult] = useState<ResearchResult | null>(null);
  const [researchHistory, setResearchHistory] = useState<any[]>([]);
  const [activeTasks, setActiveTasks] = useState<any[]>([]);

  const loadResearchHistory = async () => {
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-history' })
      });
      const data = await response.json();
      if (data.success) {
        setResearchHistory(data.history);
      }
    } catch (error) {
      console.error('Failed to load research history:', error);
    }
  };

  const loadSessionStatus = useCallback(async () => {
    if (!sessionId) return;

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get-session-status',
          sessionId
        })
      });
      const data = await response.json();
      if (data.success) {
        setActiveTasks(data.status.activeTasks);
      }
    } catch (error) {
      console.error('Failed to load session status:', error);
    }
  }, [sessionId]);

  // Load research history on mount
  useEffect(() => {
    loadResearchHistory();
  }, []);

  // Poll for session status if we have an active session
  useEffect(() => {
    if (sessionId && activeTasks.length > 0) {
      const interval = setInterval(() => {
        loadSessionStatus();
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [sessionId, activeTasks, loadSessionStatus]);

  const startNewSession = async () => {
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start-session',
          title: query.topic || 'New Research Session',
          description: query.description,
          tags: query.tags || []
        })
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const analyzeQuery = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze-query',
          query
        })
      });
      const data = await response.json();
      if (data.success) {
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Failed to analyze query:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeResearch = async () => {
    if (!sessionId) {
      await startNewSession();
    }

    setIsResearching(true);
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute-research',
          sessionId: sessionId,
          query
        })
      });
      const data = await response.json();
      if (data.success) {
        setCurrentResult(data.result);
        setSessionId(data.result.sessionId);
        await loadResearchHistory();
      }
    } catch (error) {
      console.error('Failed to execute research:', error);
    } finally {
      setIsResearching(false);
    }
  };

  const cancelTask = async (taskId: string) => {
    try {
      await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel-task',
          sessionId,
          taskId
        })
      });
      await loadSessionStatus();
    } catch (error) {
      console.error('Failed to cancel task:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <h1 className="text-lg font-semibold">Multi-Agent Research System</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => setMode('chat')}
              className={`px-3 py-1 rounded-md text-sm ${
                mode === 'chat'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              Chat Mode
            </button>
            <button
              onClick={() => setMode('research')}
              className={`px-3 py-1 rounded-md text-sm ${
                mode === 'research'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              Research Mode
            </button>
          </nav>
        </div>
      </header>

      <div className="flex-1 container py-6">
        {mode === 'research' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Research Interface */}
            <div className="lg:col-span-2 space-y-6">
              {/* Research Query Input */}
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Start New Research</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Research Topic</label>
                    <input
                      type="text"
                      value={query.topic}
                      onChange={(e) => setQuery({ ...query, topic: e.target.value })}
                      placeholder="Enter your research topic..."
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                    <textarea
                      value={query.description}
                      onChange={(e) => setQuery({ ...query, description: e.target.value })}
                      placeholder="Provide additional context..."
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Research Type</label>
                      <select
                        value={query.type}
                        onChange={(e) => setQuery({ ...query, type: e.target.value as ResearchTaskType })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="literature-review">Literature Review</option>
                        <option value="market-research">Market Research</option>
                        <option value="technical-analysis">Technical Analysis</option>
                        <option value="academic-research">Academic Research</option>
                        <option value="news-analysis">News Analysis</option>
                        <option value="comparative-study">Comparative Study</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <select
                        value={query.priority}
                        onChange={(e) => setQuery({ ...query, priority: e.target.value as any })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={analyzeQuery}
                      disabled={!query.topic || isAnalyzing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Query'}
                    </button>
                    <button
                      onClick={executeResearch}
                      disabled={!query.topic || isResearching}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {isResearching ? 'Researching...' : 'Start Research'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Analysis Results */}
              {analysis && (
                <div className="border rounded-lg p-6">
                  <h3 className="text-md font-semibold mb-3">Query Analysis</h3>
                  <div className="space-y-2">
                    <p><strong>Recommended Type:</strong> {analysis.recommendedType}</p>
                    <p><strong>Reasoning:</strong> {analysis.reasoning}</p>
                    <p><strong>Estimated Duration:</strong> {analysis.estimatedDuration} minutes</p>
                    <p><strong>Estimated Cost:</strong> ${analysis.estimatedCost}</p>
                    <p><strong>Required Agents:</strong> {analysis.requiredAgents.join(', ')}</p>
                  </div>
                </div>
              )}

              {/* Active Tasks */}
              {activeTasks.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h3 className="text-md font-semibold mb-3">Active Research Tasks</h3>
                  <div className="space-y-3">
                    {activeTasks.map((task) => (
                      <div key={task.id} className="border rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{task.topic}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${
                            task.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <button
                          onClick={() => cancelTask(task.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Results */}
              {currentResult && (
                <div className="border rounded-lg p-6">
                  <h3 className="text-md font-semibold mb-3">{currentResult.report.title}</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-gray-700">{currentResult.report.summary}</p>
                    </div>

                    {currentResult.report.findings.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Key Findings</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {currentResult.report.findings.map((finding, index) => (
                            <li key={index} className="text-gray-700">{finding.content}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentResult.report.sources.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Sources</h4>
                        <div className="space-y-2">
                          {currentResult.report.sources.map((source, index) => (
                            <div key={index} className="border rounded p-3">
                              <h5 className="font-medium">{source.title}</h5>
                              {source.url && (
                                <a href={source.url} target="_blank" rel="noopener noreferrer"
                                   className="text-blue-600 hover:underline text-sm">
                                  {source.url}
                                </a>
                              )}
                              <p className="text-sm text-gray-600 mt-1">{source.summary}</p>
                              <span className="text-xs text-gray-500">
                                Credibility: {Math.round(source.credibility * 100)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentResult.report.recommendations && currentResult.report.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recommendations</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {currentResult.report.recommendations.map((rec, index) => (
                            <li key={index} className="text-gray-700">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Research History */}
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-md font-semibold mb-3">Research History</h3>
                <div className="space-y-3">
                  {researchHistory.map((session) => (
                    <div key={session.id} className="border rounded p-3">
                      <h4 className="font-medium text-sm">{session.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {session.taskCount} tasks • {session.completedTasks} completed
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {researchHistory.length === 0 && (
                    <p className="text-gray-500 text-sm">No research sessions yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Mode - Original interface */
          <div className="max-w-4xl mx-auto">
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Chat Mode</h2>
              <p className="text-gray-600">
                Switch to Research Mode to use the multi-agent research system.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
