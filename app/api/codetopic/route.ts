import { NextRequest, NextResponse } from 'next/server';
import { Message } from 'ai';
import { CodetopicAgent } from '@/lib/codetopic-agent';

const agent = new CodetopicAgent({
  role: 'expert-coding-assistant',
  capabilities: [
    'code-analysis',
    'suggestions',
    'documentation',
    'automation'
  ],
  guidelines: [
    'clear-communication',
    'best-practices',
    'xml-structured-responses'
  ],
  constraints: [
    'no-harmful-code',
    'respect-licensing',
    'security-first'
  ]
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    const lastMessage = messages[messages.length - 1];
    const response = await agent.processMessage(lastMessage);

    return NextResponse.json({ 
      message: response,
      ok: true 
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}