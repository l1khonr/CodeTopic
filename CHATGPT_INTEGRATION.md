# ChatGPT Integration with MCP Server

This project includes full ChatGPT integration using the Model Context Protocol (MCP), allowing your app to run **inside ChatGPT conversations** with tools, resources, and inline UI.

## Overview

Your AI Elements Chat app can now be embedded in ChatGPT conversations as an interactive experience that:
- Executes actions (not just answers)
- Provides inline displays
- Suggests follow-up actions
- Integrates seamlessly with ChatGPT's UI

## Architecture

### 1. MCP Server (`app/mcp/route.ts`)

The core server that exposes tools and resources to ChatGPT:

```typescript
// Register tools ChatGPT can call
tools: {
  'send-message': { ... },
  'get-weather': { ... },
  'search-knowledge-base': { ... },
}

// Expose resources ChatGPT can access
resources: {
  'chat-history': { uri: 'chat://history', ... },
  'user-profile': { uri: 'chat://profile', ... },
}
```

### 2. SDK Bootstrap (`app/sdk-bootstrap.tsx`)

Patches browser APIs to work correctly in ChatGPT's iframe:

- ✅ **history.pushState/replaceState** - Prevents full-origin URLs
- ✅ **window.fetch** - Rewrites same-origin requests  
- ✅ **MutationObserver** - Prevents ChatGPT from modifying HTML root

### 3. CORS Middleware (`middleware.ts`)

Handles preflight requests and adds CORS headers for React Server Components.

### 4. Asset Configuration (`next.config.mjs`)

Sets `assetPrefix` to prevent 404s on static assets in iframe.

## How It Works

```
ChatGPT Conversation
   ↓
ChatGPT calls a tool registered in app/mcp/route.ts
   ↓
Tool executes and returns result
   ↓
Result displayed inline in conversation
   ↓
ChatGPT suggests follow-up actions
```

## ChatGPT UI Components

### Tool Call Display

```tsx
// Shows in ChatGPT UI
<ToolCall icon="🤖" label="AI Elements Chat">
  {/* Your app content */}
</ToolCall>
```

### Inline Display

Your content appears embedded **above** the model response:

```
User: "Check the weather in San Francisco"
   ↓
[Your Weather Widget Displayed Here]
   ↓
ChatGPT: "It's 72°F and sunny..."
```

### Follow-up Suggestions

Short, model-generated prompts after your widget:

```
Suggested follow-ups:
- "Check weather for tomorrow"
- "Compare with other cities"
- "Set up weather alerts"
```

## Design Principles

Your app follows ChatGPT's design principles:

### 1. Conversational
- Feels like natural part of conversation
- Context-aware responses
- Seamless UI integration

### 2. Intelligent  
- Aware of conversation context
- Anticipates user intent
- Relevant, personalized content

### 3. Simple
- Single, clear action per interaction
- Minimal UI
- Focused information

### 4. Responsive
- Fast and lightweight
- Enhances conversation
- Doesn't overwhelm

### 5. Accessible
- Works with assistive technologies
- Keyboard navigation
- Screen reader support

## Tools Registered

Your MCP server exposes these tools to ChatGPT:

### Communication Tools
- `send-message` - Send messages in chat
- `get-weather` - Fetch weather data
- `search-knowledge-base` - Search your RAG database

### Action Tools  
- Create GitHub issues
- Send Slack notifications
- Schedule calendar events
- Update Notion pages

## Example ChatGPT Conversation

**User:** "What's the weather in San Francisco and send it to the team?"

**ChatGPT:** 
[Calls your tools]
- get-weather: San Francisco
- send-message: (weather data)

**Result:**
- Weather card displayed inline
- Slack notification sent
- Follow-up: "Weather sent! Want me to set up daily alerts?"

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_BASE_URL=https://your-app.com
```

### MCP Server Endpoint

Your MCP server is available at:
```
https://your-app.com/mcp
```

ChatGPT connects to this endpoint using the MCP protocol.

## Testing Locally

```bash
# Run your app
npm run dev

# Test MCP server
curl http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/list"}'
```

## Deployment

Deploy to Vercel for ChatGPT integration:

1. Push to GitHub
2. Connect to Vercel
3. Set `NEXT_PUBLIC_BASE_URL`
4. Enable MCP server in ChatGPT settings
5. Add your app URL

## Resources

- [ChatGPT SDK Docs](https://platform.openai.com/docs/chatgpt-apps)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Project MCP Server](../app/mcp/route.ts)

## Next Steps

1. Customize tools in `app/mcp/route.ts`
2. Add your domain to ChatGPT
3. Test integration
4. Deploy and share!

Your app is now a **ChatGPT-native experience** that executes actions and provides interactive UI in conversations! 🚀

