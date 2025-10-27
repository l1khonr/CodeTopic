import { NextRequest, NextResponse } from 'next/server';
import { costTracker } from '@/lib/mcp-cost-tracker';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const userId = searchParams.get('userId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    if (sessionId) {
      const costs = costTracker.getSessionCosts(sessionId);
      const total = costTracker.getSessionTotal(sessionId);

      return NextResponse.json({
        sessionId,
        costs,
        total,
      });
    }

    if (userId) {
      const costs = costTracker.getUserCosts(userId);
      const total = costTracker.getUserTotal(userId);

      return NextResponse.json({
        userId,
        costs,
        total,
      });
    }

    // Export all costs with optional date filtering
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const costs = costTracker.exportCosts(start, end);

    return NextResponse.json({
      costs,
      total: costs.reduce((sum, cost) => sum + cost.cost, 0),
      count: costs.length,
    });
  } catch (error) {
    console.error('MCP Costs API Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve costs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { provider, model, inputTokens, outputTokens, sessionId, userId } = await request.json();

    if (!provider || !model || inputTokens === undefined || outputTokens === undefined || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, model, inputTokens, outputTokens, sessionId' },
        { status: 400 }
      );
    }

    const costRecord = costTracker.trackCost(
      provider,
      model,
      inputTokens,
      outputTokens,
      sessionId,
      userId
    );

    const needsApproval = costTracker.needsApproval(costRecord.cost);
    const canAutoApprove = costTracker.canAutoApprove(costRecord.cost);

    return NextResponse.json({
      costRecord,
      needsApproval,
      canAutoApprove,
      paymentRequired: needsApproval && !canAutoApprove,
    });
  } catch (error) {
    console.error('MCP Cost Tracking Error:', error);
    return NextResponse.json(
      { error: 'Failed to track cost' },
      { status: 500 }
    );
  }
}