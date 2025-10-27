import { NextRequest, NextResponse } from 'next/server';
import { R2AGFramework } from '@/lib/rag-engine';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const runtime = 'nodejs'; // RAG needs Node.js runtime for file operations

// Initialize RAG framework
const rag = new R2AGFramework({
  chunkSize: 1000,
  chunkOverlap: 200,
  topK: 5,
  similarityThreshold: 0.7,
});

/**
 * Initialize knowledge base with sample documents
 */
async function initializeKnowledgeBase() {
  // Sample documents for demonstration
  const sampleDocs = [
    {
      text: `The AI SDK is a TypeScript library that provides a unified API for building AI applications.
        It supports multiple providers including OpenAI, Anthropic, Google, and Hugging Face.
        Key features include streaming, tool calling, structured outputs, and multi-modal capabilities.`,
      metadata: { source: 'ai-sdk-docs', category: 'getting-started' },
    },
    {
      text: `Next.js is a React framework for building full-stack web applications.
        It provides features like Server Components, Server Actions, file-based routing,
        and automatic code splitting. The App Router is the latest routing system.`,
      metadata: { source: 'nextjs-docs', category: 'framework' },
    },
    {
      text: `Retrieval-Augmented Generation (RAG) combines retrieval of information from a knowledge base
        with generation of responses. It helps LLMs access up-to-date information and reduces hallucinations.
        RAG typically involves chunking documents, creating embeddings, and retrieving relevant context.`,
      metadata: { source: 'rag-guide', category: 'ai-patterns' },
    },
  ];

  await rag.addDocuments(
    sampleDocs.map((doc) => doc.text),
    { source: 'sample-docs' }
  );
}

// Initialize on first request
let initialized = false;

export async function POST(req: NextRequest) {
  try {
    if (!initialized) {
      await initializeKnowledgeBase();
      initialized = true;
    }

    const { query, useReasoning = true } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Process with R2AG
    const { context, reasoning, retrievedDocs } = await rag.processQuery(query);

    // Build messages for LLM
    const messages = [
      {
        role: 'system' as const,
        content: `You are a helpful AI assistant with access to a knowledge base.
${context}

When answering questions, use the provided context. If the context doesn't contain enough information,
say so and provide the best answer you can based on your training.
${useReasoning ? '\n\nReasoning about query: ' + reasoning : ''}`,
      },
      {
        role: 'user' as const,
        content: query,
      },
    ];

    // Generate response with reasoning
    const result = await streamText({
      model: google('gemini-2.5-pro'),
      messages,
      temperature: 0.7,
    });

    // Stream response with metadata
    const response = result.toDataStreamResponse();

    // Add custom headers with metadata
    response.headers.set('X-RAG-Docs-Retrieved', retrievedDocs.length.toString());
    response.headers.set('X-RAG-Reasoning', useReasoning ? 'enabled' : 'disabled');

    return response;
  } catch (error) {
    console.error('RAG error:', error);
    return NextResponse.json(
      { error: 'Failed to process RAG query' },
      { status: 500 }
    );
  }
}

/**
 * Add documents to knowledge base
 */
export async function PUT(req: NextRequest) {
  try {
    const { documents } = await req.json();

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { error: 'Documents array is required' },
        { status: 400 }
      );
    }

    // Process documents
    const texts = documents.map((doc: any) => doc.text || doc.content);
    const metadata = documents[0]?.metadata || { source: 'uploaded' };

    await rag.addDocuments(texts, metadata);

    const stats = rag.getStats();

    return NextResponse.json({
      success: true,
      message: `Added ${documents.length} document(s)`,
      stats,
    });
  } catch (error) {
    console.error('Error adding documents:', error);
    return NextResponse.json(
      { error: 'Failed to add documents' },
      { status: 500 }
    );
  }
}

/**
 * Get RAG statistics
 */
export async function GET() {
  const stats = rag.getStats();
  return NextResponse.json({ stats });
}

