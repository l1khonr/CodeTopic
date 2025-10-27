import { NextRequest, NextResponse } from 'next/server';
import { ActionEngine, executeComplexWorkflow } from '@/lib/action-engine/workflow';

export const runtime = 'nodejs'; // Action engine needs Node.js

/**
 * Execute a complex workflow
 */
export async function POST(req: NextRequest) {
  try {
    const { description, parallel = true } = await req.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Execute workflow
    const result = await executeComplexWorkflow(description);

    return NextResponse.json({
      success: result.success,
      duration: result.duration,
      taskCount: result.taskCount,
      results: result.results,
      message: 'Workflow executed successfully',
    });
  } catch (error) {
    console.error('Workflow execution failed:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    );
  }
}

/**
 * Get available tools
 */
export async function GET() {
  return NextResponse.json({
    tools: {
      github: ['createIssue', 'createPR', 'searchCode'],
      notion: ['createPage', 'updateDatabase', 'queryDatabase'],
      slack: ['sendMessage', 'uploadFile'],
      calendar: ['createEvent', 'listEvents'],
      stripe: ['createCustomer', 'createInvoice'],
    },
    message: 'Action Engine is ready',
  });
}

