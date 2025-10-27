import { logInfo, logError, logPerformance } from './utils/logger';

export const withLogging = (agent: any, agentType: string) => {
  return new Proxy(agent, {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return async function (...args: any[]) {
          const startTime = Date.now();
          const operationName = `${agentType}.${String(prop)}`;
          
          logInfo(`Starting ${operationName}`);
          
          try {
            const result = await target[prop].apply(this, args);
            logPerformance(operationName, startTime);
            return result;
          } catch (error) {
            logError(`Error in ${operationName}`, error instanceof Error ? error : new Error(String(error)));
            throw error;
          }
        };
      }
      return target[prop];
    }
  });
};