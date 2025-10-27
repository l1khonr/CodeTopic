import { NextRequest, NextResponse } from 'next/server';
import { DeepResearchWorkflow } from '@/lib/deep-research/workflow';

export const runtime = 'nodejs'; // Deep research needs more time and Node.js runtime

const workflows = new Map<string, DeepResearchWorkflow>();

/**
 * Start a deep research task
 */
export async function POST(req: NextRequest) {
  try {
    const { query, depth = 'moderate', sessionId } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const workflow = new DeepResearchWorkflow();
    const id = sessionId || `research-${Date.now()}`;
    workflows.set(id, workflow);

    // Start research asynchronously
    workflow.executeResearch(query, depth).catch((error) => {
      console.error('Research failed:', error);
    });

    return NextResponse.json({
      sessionId: id,
      status: 'started',
      message: 'Deep research started',
      progress: workflow.getProgress(),
    });
  } catch (error) {
    console.error('Error starting research:', error);
    return NextResponse.json(
      { error: 'Failed to start research' },
      { status: 500 }
    );
  }
}

/**
 * Get research progress
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId || !workflows.has(sessionId)) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }

  const workflow = workflows.get(sessionId)!;
  const progress = workflow.getProgress();

  return NextResponse.json({
    sessionId,
    progress,
  });
}

/**
 * Get final research report
 */
export async function PUT(req: NextRequest) {
  try {
    const { sessionId, forceComplete } = await req.json();

    if (!sessionId || !workflows.has(sessionId)) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const workflow = workflows.get(sessionId)!;
    const progress = workflow.getProgress();

    return NextResponse.json({
      sessionId,
      progress,
      message: forceComplete
        ? 'Research marked as complete'
        : 'Research in progress',
    });
  } catch (error) {
    console.error('Error getting report:', error);
    return NextResponse.json(
      { error: 'Failed to get report' },
      { status: 500 }
    );
  }
}

