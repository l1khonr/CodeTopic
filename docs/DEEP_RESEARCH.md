# Deep Research Multi-Agent System

## Overview

The Deep Research system is a sophisticated multi-agent framework that conducts comprehensive research using specialized AI agents working in coordination.

## Architecture

### Agents & Roles

1. **PLANNER Agent**
   - Breaks down research into structured plan
   - Creates research objectives
   - Defines task dependencies
   - Estimates timelines

2. **RESEARCHER Agent**
   - Autonomous web searching
   - Browses and extracts information
   - Verifies source credibility
   - Gathers multiple perspectives

3. **ANALYST Agent**
   - Reasons through information
   - Identifies patterns and contradictions
   - Performs gap analysis
   - Provides critical evaluation

4. **SYNTHESIZER Agent**
   - Creates comprehensive reports
   - Generates executive summaries
   - Synthesizes findings
   - Creates audio overviews

5. **ORCHESTRATOR Agent**
   - Coordinates all agents
   - Manages task assignment
   - Monitors progress
   - Ensures workflow completion

## Workflow Pipeline

```
1. PLAN → Break down research query
   ↓
2. SEARCH → Autonomous information gathering
   ↓
3. ANALYZE → Critical reasoning and evaluation
   ↓
4. SYNTHESIZE → Comprehensive report generation
   ↓
5. DELIVER → Report with insights and audio overview
```

## Usage

### Basic Research

```typescript
import { DeepResearchWorkflow } from '@/lib/deep-research/workflow';

const workflow = new DeepResearchWorkflow();

// Execute research
const report = await workflow.executeResearch(
  'What are the latest developments in AI?',
  'deep' // depth: 'quick' | 'moderate' | 'deep'
);

console.log(report.synthesis);
console.log(`Found ${report.findings.length} findings`);
```

### Via API

```bash
# Start research
curl -X POST http://localhost:3000/api/deep-research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Latest trends in quantum computing",
    "depth": "deep"
  }'

# Check progress
curl http://localhost:3000/api/deep-research?sessionId=research-123

# Get report
curl -X PUT http://localhost:3000/api/deep-research \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "research-123"}'
```

### Integration with UI

```typescript
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

function ResearchMode() {
  const { messages, append } = useChat({
    api: '/api/deep-research',
  });

  const startResearch = async (query: string) => {
    await append({
      role: 'user',
      content: query,
      body: { depth: 'deep' },
    });
  };

  return <div>Research UI</div>;
}
```

## Features

### Planning
- Multi-step research breakdown
- Dependency management
- Time estimation
- Priority assignment

### Searching
- Autonomous web browsing
- Source verification
- Multiple search strategies
- Citation tracking

### Reasoning
- Pattern recognition
- Contradiction detection
- Gap identification
- Evidence evaluation

### Reporting
- Executive summaries
- Detailed analysis
- Audio overviews
- Source citations
- Actionable insights

## Configuration

### Research Depth

- **Quick** (5 mins): Fast overview, key facts
- **Moderate** (10 mins): Balanced depth, multiple sources
- **Deep** (20 mins): Comprehensive analysis, extensive research

### Agent Coordination

```typescript
// Sequential execution
const plan = await planner.plan(query);
const findings = await researcher.search(plan);
const analysis = await analyst.analyze(findings);
const report = await synthesizer.report(analysis);

// Parallel execution (coming soon)
await Promise.all([
  researcher.searchTopic1(),
  researcher.searchTopic2(),
]);
```

## Extending

### Add Custom Agents

```typescript
export function createCustomAgent() {
  return new Agent({
    model: google('gemini-2.5-pro'),
    system: 'Your agent prompt',
    tools: {
      customTool: tool({
        description: 'Tool description',
        inputSchema: z.object({ ... }),
        execute: async ({ ... }) => { ... },
      }),
    },
  });
}
```

### Add Research Tools

```typescript
// In researcher agent
specializedTool: tool({
  description: 'Access specialized databases',
  inputSchema: z.object({
    query: z.string(),
    database: z.enum(['academic', 'patents', 'news']),
  }),
  execute: async ({ query, database }) => {
    // Your custom search implementation
  },
}),
```

## Best Practices

1. **Start with moderate depth** for most queries
2. **Use quick depth** for fact-checking
3. **Use deep depth** for comprehensive reports
4. **Monitor progress** with getProgress()
5. **Cache findings** to avoid re-researching
6. **Verify sources** before synthesizing
7. **Track citations** throughout process

## Examples

### Market Research
```typescript
const report = await workflow.executeResearch(
  'Current state of the electric vehicle market in 2024',
  'deep'
);
// Returns: Market analysis with trends, players, opportunities
```

### Technical Deep Dive
```typescript
const report = await workflow.executeResearch(
  'React Server Components: architecture and best practices',
  'moderate'
);
// Returns: Technical report with examples and recommendations
```

### Competitive Analysis
```typescript
const report = await workflow.executeResearch(
  'Comparing AI SDK offerings: Vercel, OpenAI, Anthropic',
  'deep'
);
// Returns: Comprehensive comparison with pros/cons
```

## Roadmap

- [ ] Parallel agent execution
- [ ] Real-time collaboration
- [ ] Custom agent creation UI
- [ ] Research template library
- [ ] Citation verification
- [ ] Multi-language support
- [ ] Audio report generation
- [ ] Export to PDF/Markdown

## Learn More

- See `lib/deep-research/` for implementation details
- See `lib/rag-engine.ts` for RAG integration
- See `.cursorrules` for agent behavior configuration

