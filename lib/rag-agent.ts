/**
 * R2AG Agent - Advanced agent using Retrieval-Augmented Generation with Reasoning
 */

import { Experimental_Agent as Agent, tool, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { R2AGFramework } from './rag-engine';

/**
 * Create an R2AG-powered agent
 */
export function createR2AGAgent(rag: R2AGFramework) {
  return new Agent({
    model: google('gemini-2.5-pro'),
    system: `You are an intelligent assistant with access to a comprehensive knowledge base.
You use retrieval-augmented generation (RAG) to access relevant information and reason about it.
When answering questions:
1. First, retrieve relevant documents from the knowledge base
2. Reason about the retrieved information
3. Synthesize a comprehensive answer based on the context
4. Cite your sources when possible
5. Acknowledge uncertainty when information is limited`,
    tools: {
      searchKnowledgeBase: tool({
        description: 'Search the knowledge base for relevant information about a topic',
        inputSchema: z.object({
          query: z.string().describe('The search query or topic to look up'),
        }),
        execute: async ({ query }) => {
          const result = await rag.processQuery(query);
          return {
            documents: result.retrievedDocs.map((doc) => ({
              content: doc.content,
              source: doc.metadata.source,
            })),
            reasoning: result.reasoning,
            keyPoints: result.keyPoints,
          };
        },
      }),
      addKnowledge: tool({
        description: 'Add new information to the knowledge base',
        inputSchema: z.object({
          content: z.string().describe('The text content to add'),
          source: z.string().describe('The source of the information'),
          category: z.string().optional().describe('The category or topic'),
        }),
        execute: async ({ content, source, category }) => {
          await rag.addDocuments(
            [content],
            { source, category: category || 'general' }
          );
          return {
            success: true,
            message: `Added knowledge from ${source}`,
            stats: rag.getStats(),
          };
        },
      }),
    },
    stopWhen: stepCountIs(10),
  });
}

/**
 * Example usage of R2AG agent
 */
export async function exampleR2AGQuery() {
  const rag = new R2AGFramework();
  
  // Initialize with some documents
  await rag.addDocuments(
    [
      'The AI SDK supports multiple providers including OpenAI and Google.',
      'Next.js 14 uses the App Router for routing and Server Components.',
    ],
    { source: 'docs', category: 'technical' }
  );

  // Create agent
  const agent = createR2AGAgent(rag);

  // Generate response
  const result = await agent.generate({
    prompt: 'What does the AI SDK support and what is Next.js?',
  });

  console.log('Agent response:', result.text);
  console.log('Steps taken:', result.steps.length);

  return result;
}

