import { logPerformance } from './logger';

export interface PerformanceMetrics {
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
}

const metrics: PerformanceMetrics[] = [];

export const measurePerformance = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = Date.now();
  let success = false;
  
  try {
    const result = await fn();
    success = true;
    return result;
  } finally {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    metrics.push({
      operation,
      startTime,
      endTime,
      duration,
      success
    });
    
    logPerformance(operation, startTime);
  }
};

export const getPerformanceMetrics = () => {
  return [...metrics];
};

export const clearPerformanceMetrics = () => {
  metrics.length = 0;
};

export const getAverageOperationDuration = (operation: string): number => {
  const relevantMetrics = metrics.filter(m => m.operation === operation);
  if (relevantMetrics.length === 0) return 0;
  
  const totalDuration = relevantMetrics.reduce((sum, m) => sum + m.duration, 0);
  return totalDuration / relevantMetrics.length;
};