/**
 * R2AG Framework - Reasoning-Augmented Retrieval-Augmented Generation
 * Combines retrieval with reasoning for superior AI responses
 */

import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { createReadStream } from 'fs';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    page?: number;
    timestamp?: number;
  };
  embedding?: number[];
}

export interface RAGConfig {
  chunkSize?: number;
  chunkOverlap?: number;
  topK?: number;
  similarityThreshold?: number;
}

/**
 * RAG Engine for retrieval
 */
export class RAGEngine {
  private documents: DocumentChunk[] = [];
  private config: Required<RAGConfig>;

  constructor(config: RAGConfig = {}) {
    this.config = {
      chunkSize: config.chunkSize || 1000,
      chunkOverlap: config.chunkOverlap || 200,
      topK: config.topK || 5,
      similarityThreshold: config.similarityThreshold || 0.7,
    };
  }

  /**
   * Add documents to the knowledge base
   */
  async addDocuments(
    texts: string[],
    metadata: { source: string; [key: string]: any }
  ): Promise<void> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.config.chunkSize,
      chunkOverlap: this.config.chunkOverlap,
    });

    for (let i = 0; i < texts.length; i++) {
      const chunks = await splitter.splitText(texts[i]);

      for (const chunk of chunks) {
        // Generate embeddings
        const { embedding } = await embed({
          model: google.textEmbedding('text-embedding-004'),
          value: chunk,
        });

        this.documents.push({
          id: `${metadata.source}-${i}-${Date.now()}`,
          content: chunk,
          metadata: {
            ...metadata,
            index: i,
          },
          embedding: embedding as number[],
        });
      }
    }
  }

  /**
   * Retrieve relevant documents based on query
   */
  async retrieve(query: string): Promise<DocumentChunk[]> {
    // Generate query embedding
    const { embedding: queryEmbedding } = await embed({
      model: google.textEmbedding('text-embedding-004'),
      value: query,
    });

    // Calculate similarities
    const similarities = this.documents
      .map((doc) => ({
        doc,
        similarity: this.cosineSimilarity(
          queryEmbedding as number[],
          doc.embedding || []
        ),
      }))
      .filter((item) => item.similarity >= this.config.similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, this.config.topK);

    return similarities.map((item) => item.doc);
  }

  /**
   * Calculate cosine similarity
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Get all documents (for debugging)
   */
  getAllDocuments(): DocumentChunk[] {
    return this.documents;
  }
}

/**
 * Reasoning Layer - Analyze and reason with retrieved context
 */
export class ReasoningLayer {
  /**
   * Analyze retrieved documents and generate reasoning
   */
  async analyzeContext(
    query: string,
    documents: DocumentChunk[]
  ): Promise<{
    relevant: DocumentChunk[];
    reasoning: string;
    keyPoints: string[];
  }> {
    // Filter by relevance score
    const relevant = documents; // Already filtered by RAG

    // Extract key points
    const keyPoints = relevant.map((doc, idx) =>
      `[${idx + 1}] ${doc.content.substring(0, 200)}...`
    );

    // Generate reasoning
    const reasoning = `Found ${relevant.length} relevant document(s). Key information:
${keyPoints.join('\n')}

Query analysis: ${this.extractQueryIntent(query)}
Relevance threshold: ${relevant.length > 0 ? 'Documents match query well' : 'Limited relevant information found'}`;

    return {
      relevant,
      reasoning,
      keyPoints,
    };
  }

  /**
   * Extract intent from query
   */
  private extractQueryIntent(query: string): string {
    const intentPatterns = [
      { pattern: /what|explain|describe/i, intent: 'Request for explanation' },
      { pattern: /how|steps|process/i, intent: 'Request for process/method' },
      { pattern: /why|reason|cause/i, intent: 'Request for reasoning' },
      { pattern: /compare|difference|versus/i, intent: 'Request for comparison' },
      { pattern: /when|time|date|history/i, intent: 'Request for temporal information' },
    ];

    for (const { pattern, intent } of intentPatterns) {
      if (pattern.test(query)) return intent;
    }

    return 'General information request';
  }
}

/**
 * R2AG Framework - Complete pipeline
 */
export class R2AGFramework {
  private ragEngine: RAGEngine;
  private reasoningLayer: ReasoningLayer;

  constructor(config?: RAGConfig) {
    this.ragEngine = new RAGEngine(config);
    this.reasoningLayer = new ReasoningLayer();
  }

  /**
   * Add documents to knowledge base
   */
  async addDocuments(
    texts: string[],
    metadata: { source: string; [key: string]: any }
  ): Promise<void> {
    return this.ragEngine.addDocuments(texts, metadata);
  }

  /**
   * Process query with R2AG pipeline
   */
  async processQuery(query: string): Promise<{
    retrievedDocs: DocumentChunk[];
    reasoning: string;
    keyPoints: string[];
    context: string;
  }> {
    // Step 1: Retrieve relevant documents
    const retrievedDocs = await this.ragEngine.retrieve(query);

    // Step 2: Reason about the retrieved context
    const { reasoning, keyPoints } = await this.reasoningLayer.analyzeContext(
      query,
      retrievedDocs
    );

    // Step 3: Build context for LLM
    const context = this.buildContext(retrievedDocs, reasoning);

    return {
      retrievedDocs,
      reasoning,
      keyPoints,
      context,
    };
  }

  /**
   * Build context string from documents and reasoning
   */
  private buildContext(docs: DocumentChunk[], reasoning: string): string {
    if (docs.length === 0) {
      return 'No relevant documents found in knowledge base.';
    }

    const documentSections = docs
      .map(
        (doc, idx) => `
[Document ${idx + 1}: ${doc.metadata.source}]
${doc.content}
`
      )
      .join('\n');

    return `
${reasoning}

RELEVANT CONTEXT:
${documentSections}

Use this context to answer the user's question accurately and comprehensively.
`;
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalDocuments: number;
    config: Required<RAGConfig>;
  } {
    return {
      totalDocuments: this.ragEngine.getAllDocuments().length,
      config: (this.ragEngine as any).config,
    };
  }
}