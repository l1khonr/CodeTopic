/**
 * Analytics API for Intelligent Router Performance
 * Provides performance metrics and insights from the intelligent routing system
 */

import { NextRequest, NextResponse } from 'next/server';
import { intelligentRouter } from '@/lib/intelligent-router';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const timeWindowHours = parseInt(searchParams.get('timeWindow') || '24');
  const userId = searchParams.get('userId') || undefined;

  try {
    const analytics = await intelligentRouter.getAnalytics(timeWindowHours, userId);

    return NextResponse.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics API] Error fetching analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, rating, sessionId } = body;

    switch (action) {
      case 'submit-rating':
        // This would typically be called from the UI after a conversation
        // For now, just acknowledge the rating
        console.log(`[Analytics API] Rating submitted: ${rating} stars for session ${sessionId}`);

        // In a real implementation, you'd store this rating and use it for future routing decisions
        return NextResponse.json({
          success: true,
          message: 'Rating submitted successfully',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Analytics API] POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
      },
      { status: 500 }
    );
  }
}
