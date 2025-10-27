import { NextRequest, NextResponse } from 'next/server';
import { tools } from '@/lib/tools';

export async function POST(request: NextRequest) {
  try {
    const { tool_calls } = await request.json();

    if (!Array.isArray(tool_calls)) {
      return NextResponse.json(
        { error: 'tool_calls must be an array' },
        { status: 400 }
      );
    }

    const results = [];

    for (const toolCall of tool_calls) {
      const { id, tool_name, arguments: args } = toolCall;

      try {
        if (!tools[tool_name]) {
          results.push({
            id,
            tool_name,
            error: `Tool '${tool_name}' not found`,
            success: false,
          });
          continue;
        }

        const tool = tools[tool_name];
        const result = await tool.execute(args);

        results.push({
          id,
          tool_name,
          result,
          success: true,
        });
      } catch (error) {
        results.push({
          id,
          tool_name,
          error: error.message,
          success: false,
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('MCP Execute Error:', error);
    return NextResponse.json(
      { error: 'Batch execution failed' },
      { status: 500 }
    );
  }
}