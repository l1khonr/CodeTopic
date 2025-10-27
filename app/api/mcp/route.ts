import { NextRequest, NextResponse } from 'next/server';
import { generateText, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from '@/lib/tools';

// MCP Server Configuration
const MCP_CONFIG = {
  name: 'AI Elements Chat MCP Server',
  version: '1.0.0',
  capabilities: {
    'tool-calling': true,
    'function-execution': true,
    'file-access': true,
    'web-search': true,
    'model-selection': true,
    'cost-tracking': true,
    'payment-integration': true,
  },
};

export async function GET() {
  // Return MCP server capabilities
  return NextResponse.json({
    ...MCP_CONFIG,
    endpoints: {
      tools: '/api/mcp/tools',
      execute: '/api/mcp/execute',
      models: '/api/mcp/models',
      costs: '/api/mcp/costs',
      payments: '/api/mcp/payments',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { messages, tools: requestedTools, model = 'gemini-2.5-flash' } = await request.json();

    // Stream text with MCP tools
    const result = await streamText({
      model: google(model),
      messages,
      tools: requestedTools ? tools : undefined,
      maxSteps: 5,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('MCP Server Error:', error);
    return NextResponse.json(
      { error: 'MCP server processing failed' },
      { status: 500 }
    );
  }
}