import { NextRequest, NextResponse } from 'next/server';
import { researchManager } from '@/lib/research-manager';
import { ResearchTaskType } from '@/lib/research-agents';
import { generateObject } from 'ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, query, taskId } = body;

    switch (action) {
      case 'start-session': {
        const { title, description, tags } = body;
        const userId = 'user-1'; // In production, get from auth

        const newSessionId = await researchManager.startResearchSession(
          userId,
          title,
          description,
          tags
        );

        return NextResponse.json({
          success: true,
          sessionId: newSessionId
        });
      }

      case 'analyze-query': {
        const analysis = await researchManager.analyzeQuery(query);
        return NextResponse.json({
          success: true,
          analysis
        });
      }

      case 'execute-research': {
        const result = await researchManager.executeResearch(sessionId, query);
        return NextResponse.json({
          success: true,
          result
        });
      }

      case 'get-session-status': {
        const status = await researchManager.getSessionStatus(sessionId);
        return NextResponse.json({
          success: true,
          status
        });
      }

      case 'cancel-task': {
        await researchManager.cancelResearchTask(sessionId, taskId);
        return NextResponse.json({
          success: true
        });
      }

      case 'get-history': {
        const userId = 'user-1'; // In production, get from auth
        const history = await researchManager.getResearchHistory(userId);
        return NextResponse.json({
          success: true,
          history
        });
      }

      case 'search-research': {
        const { searchQuery } = body;
        const userId = 'user-1'; // In production, get from auth
        const results = await researchManager.searchResearch(searchQuery, userId);
        return NextResponse.json({
          success: true,
          results
        });
      }

      case 'export-session': {
        const exportData = await researchManager.exportResearch(sessionId);
        return NextResponse.json({
          success: true,
          exportData
        });
      }

      case 'import-session': {
        const { importData } = body;
        const userId = 'user-1'; // In production, get from auth
        const newSessionId = await researchManager.importResearch(importData, userId);
        return NextResponse.json({
          success: true,
          sessionId: newSessionId
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const sessionId = searchParams.get('sessionId');

  try {
    switch (action) {
      case 'session-status': {
        if (!sessionId) {
          return NextResponse.json({
            success: false,
            error: 'sessionId required'
          }, { status: 400 });
        }

        const status = await researchManager.getSessionStatus(sessionId);
        return NextResponse.json({
          success: true,
          status
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Research API GET error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}