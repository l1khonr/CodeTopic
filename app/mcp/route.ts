/**
 * MCP Server Route for ChatGPT Integration
 * Exposes tools and resources to ChatGPT
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // MCP server needs Node.js runtime

// Registered tools for ChatGPT
const tools = {
  'send-message': {
    name: 'send-message',
    description: 'Send a message in the chat interface',
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Message content to send',
        },
      },
      required: ['content'],
    },
  },
  'get-weather': {
    name: 'get-weather',
    description: 'Get weather information for a location',
    inputSchema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City and state/country',
        },
      },
      required: ['location'],
    },
  },
  'search-knowledge-base': {
    name: 'search-knowledge-base',
    description: 'Search the knowledge base for information',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    },
  },
};

// Resources available to ChatGPT
const resources = {
  'chat-history': {
    uri: 'chat://history',
    name: 'Chat History',
    mimeType: 'application/json',
    description: 'Access to recent chat history',
  },
  'user-profile': {
    uri: 'chat://profile',
    name: 'User Profile',
    mimeType: 'application/json',
    description: 'User profile information',
  },
};

/**
 * MCP Server Protocol Implementation
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { method, params } = body;

  switch (method) {
    case 'tools/list':
      return NextResponse.json({
        tools: Object.values(tools),
      });

    case 'tools/call':
      const { name, arguments: args } = params;
      const tool = tools[name];
      
      if (!tool) {
        return NextResponse.json({
          error: `Tool ${name} not found`,
        }, { status: 404 });
      }

      // Execute tool
      const result = await executeTool(name, args);
      
      return NextResponse.json({
        content: [
          {
            type: 'text',
            text: JSON.stringify(result),
          },
        ],
        isError: false,
      });

    case 'resources/list':
      return NextResponse.json({
        resources: Object.values(resources),
      });

    case 'resources/read':
      const { uri } = params;
      const resource = Object.values(resources).find((r) => r.uri === uri);
      
      if (!resource) {
        return NextResponse.json({
          error: `Resource ${uri} not found`,
        }, { status: 404 });
      }

      return NextResponse.json({
        contents: [
          {
            uri: resource.uri,
            mimeType: resource.mimeType,
            text: JSON.stringify({ data: 'Resource data' }),
          },
        ],
      });

    case 'initialize':
      return NextResponse.json({
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {},
        },
        serverInfo: {
          name: 'AI Elements Chat MCP Server',
          version: '1.0.0',
        },
      });

    default:
      return NextResponse.json({
        error: `Unknown method: ${method}`,
      }, { status: 400 });
  }
}

/**
 * Execute a tool
 */
async function executeTool(name: string, args: any) {
  // In production, this would call your actual tool implementations
  // For now, return mock data
  return {
    tool: name,
    arguments: args,
    result: 'Mock result',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Handle OPTIONS for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

