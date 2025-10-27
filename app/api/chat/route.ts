import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { tools } from '@/lib/tools';
import { costTracker } from '@/lib/mcp-cost-tracker';
import { intelligentRouter } from '@/lib/intelligent-router';

export const runtime = 'edge';

export async function POST(req: Request) {
  const {
    messages,
    provider: forcedProvider,
    model: forcedModel,
    sessionId,
    enableMCP = false,
    enableIntelligentRouting = true
  } = await req.json();

  // Generate session ID if not provided
  const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Determine which provider to use - either forced or intelligent routing
  let routingDecision;
  let selectedProvider;
  let selectedModel;

  if (forcedProvider && forcedModel) {
    // Manual override
    routingDecision = intelligentRouter.forceProvider(forcedProvider, 'Manual override');
    selectedProvider = forcedProvider;
    selectedModel = forcedModel;
  } else {
    // Intelligent routing
    const lastMessage = messages[messages.length - 1]?.content || '';
    const context = {
      sessionId: currentSessionId,
      messageHistory: [lastMessage],
      userPreferences: {
        speedPriority: enableMCP, // Prioritize speed for tool usage
        costSensitive: true, // Always try to be cost-sensitive
      },
    };

    routingDecision = await intelligentRouter.selectProvider(lastMessage, context);
    selectedProvider = routingDecision.provider;
    selectedModel = routingDecision.model;
  }

  // Configure stream based on selected provider
  let streamTextOptions: any;

  switch (selectedProvider) {
    case 'anthropic':
      streamTextOptions = {
        model: anthropic(selectedModel),
        messages,
        tools,
        maxSteps: 5,
      };
      break;

    case 'hf':
      // Hugging Face via OpenAI-compatible endpoint
      const hfOpenAI = createOpenAI({
        baseURL: 'https://router.huggingface.co/v1',
        apiKey: process.env.HF_TOKEN || process.env.HUGGINGFACE_HUB_TOKEN,
      });
      streamTextOptions = {
        model: hfOpenAI(selectedModel),
        messages,
        tools,
        maxSteps: 5,
      };
      break;

    case 'google':
      streamTextOptions = {
        model: google(selectedModel),
        messages,
        tools,
        maxSteps: 5,
      };
      break;

    case 'openai':
    default:
      streamTextOptions = {
        model: openai(selectedModel),
        messages,
        tools,
        maxSteps: 5,
      };
      break;
  }

  // Track start time for performance monitoring
  const startTime = Date.now();

  const result = await streamText(streamTextOptions);

  const endTime = Date.now();
  const actualLatencyMs = endTime - startTime;

  // Track performance and costs
  try {
    // Rough token estimation (in production, extract from result)
    const estimatedInputTokens = Math.round(JSON.stringify(messages).length / 4);
    const estimatedOutputTokens = Math.round(actualLatencyMs / 10); // Rough proxy for output tokens

    // Calculate actual cost
    const actualCost = costTracker.trackCost(
      selectedProvider,
      selectedModel,
      estimatedInputTokens,
      estimatedOutputTokens,
      currentSessionId
    );

    // Record performance metrics (if intelligent routing was used)
    if (!forcedProvider && enableIntelligentRouting && routingDecision) {
      await intelligentRouter.recordPerformance(
        routingDecision,
        actualLatencyMs,
        actualCost.cost,
        true, // Assume success if we get here
        {
          sessionId: currentSessionId,
          messageHistory: messages.map((m: any) => typeof m.content === 'string' ? m.content : ''),
        }
      );
    }
  } catch (error) {
    console.warn('Failed to track performance metrics:', error);
  }

  return result.toDataStreamResponse();
}
