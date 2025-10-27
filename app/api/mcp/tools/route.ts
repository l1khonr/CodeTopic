import { NextRequest, NextResponse } from 'next/server';
import { tools } from '@/lib/tools';

// MCP Tools endpoint
export async function GET() {
  // Return available MCP tools
  const mcpTools = Object.entries(tools).map(([name, tool]) => ({
    name,
    description: tool.description,
    parameters: tool.parameters,
  }));

  return NextResponse.json({
    tools: mcpTools,
    capabilities: ['tool-calling', 'function-execution'],
  });
}

export async function POST(request: NextRequest) {
  try {
    const { tool_name, arguments: args } = await request.json();

    if (!tools[tool_name]) {
      return NextResponse.json(
        { error: `Tool '${tool_name}' not found` },
        { status: 404 }
      );
    }

    const tool = tools[tool_name];
    const result = await tool.execute(args);

    return NextResponse.json({
      tool_name,
      result,
      success: true,
    });
  } catch (error) {
    console.error('MCP Tool Execution Error:', error);
    return NextResponse.json(
      { error: 'Tool execution failed', details: error.message },
      { status: 500 }
    );
  }
}