'use client';

import { useState, useEffect } from 'react';
import { SystemButton } from './system-button';

interface AnalyticsData {
  totalRequests: number;
  totalCost: number;
  avgLatency: number;
  successRate: number;
  topProviders: Record<string, number>;
  taskBreakdown: Record<string, number>;
  costSavings: number;
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState('24');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (hours: string) => {
    try {
      const response = await fetch(`/api/analytics?timeWindow=${hours}`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        console.error('Failed to fetch analytics:', data.error);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeWindow);
    setLoading(false);
  }, [timeWindow]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics(timeWindow);
    setRefreshing(false);
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Intelligent Router Analytics</h2>
          <p className="text-gray-600 mt-2">
            Performance insights from automatic provider selection
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="1">Last Hour</option>
            <option value="24">Last 24h</option>
            <option value="168">Last 7d</option>
            <option value="720">Last 30d</option>
          </select>
          <SystemButton
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className={`${refreshing ? 'animate-spin' : ''}`}
          >
            {refreshing ? '...' : 'Refresh'}
          </SystemButton>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">Total Requests</div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              📊
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{analytics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              In the last {timeWindow} hours
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">Cost Savings</div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              💰
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-green-600">
              ${analytics.costSavings.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">
              Estimated vs premium models
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">Avg Latency</div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              ⚡
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{Math.round(analytics.avgLatency)}ms</div>
            <p className="text-xs text-gray-500">
              Response time
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">Success Rate</div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              ✅
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{(analytics.successRate * 100).toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${analytics.successRate * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Provider Usage & Task Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provider Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Provider Usage</h3>
          <p className="text-gray-600 text-sm mb-4">
            How often each provider was selected
          </p>
          <div className="space-y-4">
            {Object.entries(analytics.topProviders).map(([provider, count]) => {
              const percentage = (count / analytics.totalRequests) * 100;
              return (
                <div key={provider} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium capitalize">{provider}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Task Types</h3>
          <p className="text-gray-600 text-sm mb-4">
            Breakdown by type of requests processed
          </p>
          <div className="space-y-4">
            {Object.entries(analytics.taskBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([taskType, count]) => {
                const percentage = (count / analytics.totalRequests) * 100;
                return (
                  <div key={taskType} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span className="text-sm font-medium capitalize">
                        {taskType.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Cost Analysis</h3>
        <p className="text-gray-600 text-sm mb-6">
          Total costs and estimated savings from intelligent routing
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-red-50 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">
              ${(analytics.totalCost - analytics.costSavings).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Without Optimization</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">
              ${analytics.totalCost.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">With Optimization</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              ${analytics.costSavings.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Cost Savings</div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-blue-50 p-6 rounded-lg border">
        <div className="flex items-center gap-3 text-blue-800">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            ⚡
          </div>
          <span className="text-sm">
            The intelligent router learns from performance data and automatically optimizes provider selection
            for cost, speed, and quality based on historical performance.
          </span>
        </div>
      </div>
    </div>
  );
}
