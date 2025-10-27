import { NextRequest, NextResponse } from 'next/server';
import { logHttp, logError } from '@/lib/utils/logger';

export async function loggerMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>
) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  // Log request details
  logHttp(
    `[${requestId}] ${request.method} ${request.url} - Started`
  );

  try {
    // Process the request
    const response = await next();
    
    // Log response details
    const duration = Date.now() - startTime;
    logHttp(
      `[${requestId}] ${request.method} ${request.url} - ${response.status} - ${duration}ms`
    );

    return response;
  } catch (error) {
    // Log errors
    const duration = Date.now() - startTime;
    logError(
      `[${requestId}] ${request.method} ${request.url} - Failed after ${duration}ms`,
      error instanceof Error ? error : new Error(String(error))
    );

    throw error;
  }
}

