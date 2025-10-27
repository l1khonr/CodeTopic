# Chat API Documentation

## Overview

The Chat API (`/api/chat`) is a multi-provider AI chat endpoint that supports intelligent routing, tool integration, and cost optimization. It provides streaming responses and automatically selects the best provider based on task type, performance history, and cost considerations.

## Endpoint

```
POST /api/chat
```

## Runtime

Edge runtime for optimal performance and global distribution.

## Authentication

Authentication is handled through provider-specific API keys set as environment variables:

- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Gemini
- `OPENAI_API_KEY` - OpenAI
- `ANTHROPIC_API_KEY` - Anthropic Claude
- `HF_TOKEN` or `HUGGINGFACE_HUB_TOKEN` - Hugging Face

## Request Format

### Headers

```
Content-Type: application/json
```

### Body Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `messages` | Array | Yes | - | Array of chat messages in OpenAI format |
| `provider` | String | No | Auto-selected | Force specific provider (`openai`, `anthropic`, `google`, `hf`) |
| `model` | String | No | Auto-selected | Force specific model (e.g., `gemini-2.5-flash`) |
| `sessionId` | String | No | Auto-generated | Session identifier for tracking and analytics |
| `enableMCP` | Boolean | No | `false` | Enable MCP tool integration |
| `enableIntelligentRouting` | Boolean | No | `true` | Enable automatic provider/model selection |

#### Message Format

```typescript
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  // Additional metadata can be included
}
```

### Example Request

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What's the weather like in San Francisco?"
    }
  ],
  "enableMCP": true,
  "sessionId": "session_123456789"
}
```

## Response Format

The API returns a streaming response using Server-Sent Events (SSE) format. The response is not a standard JSON response but a stream of data chunks.

### Response Headers

```
Content-Type: text/plain; charset=utf-8
Cache-Control: no-cache
Connection: keep-alive
```

### Response Stream Format

The response stream contains various event types:

1. **Text Content**: Regular AI response text
2. **Tool Calls**: When the AI decides to use tools
3. **Tool Results**: Results from tool execution
4. **Usage Data**: Token usage and cost information
5. **Error Events**: Error messages if something goes wrong

### Example Response Stream

```
data: {"type": "text", "content": "I'll check the weather for you."}

data: {"type": "tool_call", "tool": "weather", "args": {"location": "San Francisco, CA"}}

data: {"type": "tool_result", "tool": "weather", "result": {"temperature": 72, "condition": "sunny"}}

data: {"type": "text", "content": "The weather in San Francisco is currently 72°F and sunny."}

data: {"type": "usage", "inputTokens": 25, "outputTokens": 45, "cost": 0.0012}
```

## Provider Selection

The API uses intelligent routing to automatically select the best provider and model based on:

### Automatic Selection Criteria

1. **Task Type Analysis**: Different tasks are routed to specialized models
   - Code generation → DeepSeek Coder, CodeLlama
   - Reasoning → DeepSeek V3, Claude 3.5 Sonnet
   - Creative writing → Claude 3.5 Sonnet, Gemini Pro
   - Translation → Gemini, Qwen models
   - General conversation → Gemini Flash, Llama models

2. **Performance History**: Tracks success rates, latency, and user ratings
3. **Cost Optimization**: Prefers cost-effective models when quality is sufficient
4. **User Preferences**: Learns from user behavior and preferences

### Provider Priority Order

1. **Google Gemini** (default) - Low latency, cost-effective
2. **Hugging Face** - Free tier available, good for general tasks
3. **OpenAI** - Reliable, good for complex tasks
4. **Anthropic Claude** - Excellent for reasoning and creative tasks

### Manual Override

You can force a specific provider and model:

```json
{
  "messages": [...],
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20241022"
}
```

## Available Tools

The API integrates with several tools that the AI can use automatically:

### Weather Tool
- **Description**: Get current weather for a location
- **Usage**: AI automatically calls this when users ask about weather
- **Parameters**:
  - `location` (string): City and state/country (e.g., "San Francisco, CA")

### Calculate Tool
- **Description**: Perform mathematical calculations
- **Usage**: AI calls this for math problems and calculations
- **Parameters**:
  - `expression` (string): Mathematical expression (e.g., "2 + 2", "sqrt(16)")

### Search Tool
- **Description**: Search the internet for current information
- **Usage**: AI calls this for current events, facts, and research
- **Parameters**:
  - `query` (string): Search query

## Cost Management

### Cost Tracking

The API automatically tracks costs for each request:

- **Per-request costs**: Calculated based on input/output tokens
- **Session totals**: Aggregated costs per session
- **User totals**: Aggregated costs per user (if userId provided)

### Cost Estimation

Approximate costs per 1K tokens (USD):

| Provider | Model Type | Input Cost | Output Cost |
|----------|------------|------------|-------------|
| Google Gemini | Flash models | $0.00025 | $0.0005 |
| Google Gemini | Pro models | $0.00125 | $0.005 |
| Anthropic Claude | All models | $0.0008 | $0.0024 |
| OpenAI | GPT models | $0.0015 | $0.002 |
| Hugging Face | Local models | Free | Free |

### Payment Integration

- **Auto-approval**: Requests under $0.01 are automatically approved
- **Manual approval**: Requests over $0.10 require explicit approval
- **Payment methods**: Cloud (charge-on-usage), Local (free), Hybrid (local-first)

## Performance Monitoring

The API tracks performance metrics for optimization:

### Metrics Tracked

- **Latency**: Response time in milliseconds
- **Success Rate**: Percentage of successful requests
- **User Ratings**: Optional user feedback on response quality
- **Cost Efficiency**: Cost per successful request

### Analytics Available

- **Total requests**: Count of requests in time window
- **Total cost**: Aggregated costs
- **Average latency**: Mean response time
- **Success rate**: Percentage of successful requests
- **Provider breakdown**: Usage by provider
- **Task breakdown**: Usage by task type
- **Cost savings**: Estimated savings from intelligent routing

## Error Handling

### Common Error Types

1. **Authentication Errors**: Missing or invalid API keys
2. **Rate Limiting**: Provider rate limits exceeded
3. **Tool Errors**: Tool execution failures
4. **Routing Errors**: No suitable provider available

### Error Response Format

```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

## Rate Limiting

Rate limits are enforced per provider:

- **Google Gemini**: 60 requests per minute
- **OpenAI**: Varies by model (typically 10,000 requests per minute)
- **Anthropic**: 50 requests per minute
- **Hugging Face**: Varies by model and account tier

## Best Practices

### Client Implementation

1. **Handle Streaming**: Implement proper SSE handling for real-time responses
2. **Error Recovery**: Implement retry logic with exponential backoff
3. **Session Management**: Reuse session IDs for conversation continuity
4. **Tool Integration**: Enable MCP tools for enhanced functionality

### Cost Optimization

1. **Use Intelligent Routing**: Let the system choose the most cost-effective provider
2. **Enable Free Tier**: Use Hugging Face models when possible
3. **Monitor Costs**: Track usage and costs per session
4. **Batch Requests**: Group related requests when possible

### Performance Optimization

1. **Connection Reuse**: Maintain persistent connections for multiple requests
2. **Request Batching**: Combine multiple messages when appropriate
3. **Caching**: Cache responses for frequently asked questions
4. **Fallback Planning**: Implement fallback providers for reliability

## Examples

### Basic Chat

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Hello, how are you?' }
    ]
  })
});

const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = new TextDecoder().decode(value);
  console.log(chunk);
}
```

### With Tool Integration

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'What is 15 * 23?' }
    ],
    enableMCP: true,
    sessionId: 'math_session_123'
  })
});
```

### Forced Provider

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Write a creative story' }
    ],
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022'
  })
});
```

## Support

For issues or questions about the Chat API:

1. Check the provider documentation for specific model capabilities
2. Review the intelligent routing logs for routing decisions
3. Monitor cost tracking for usage patterns
4. Check performance analytics for optimization opportunities
