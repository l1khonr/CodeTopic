Copilot Instructions

## Project Architecture

This is a Next.js 14 app with integrated AI capabilities for chat, research, and automation:

### Core Components
- `/app` - Next.js app router routes and API endpoints
- `/components` - Reusable UI components (shadcn/ui + custom)
- `/lib` - Core business logic and AI agent implementation
- `/docs` - Comprehensive guides and documentation

### Key Architectural Patterns

1. **AI Agent System**
   - Orchestration via `lib/research-orchestrator.ts` - coordinates multiple specialized agents
   - Agent types (Planner, Researcher, Analyst, Synthesizer) defined in `lib/research-agents.ts`
   - Communication via message bus pattern for inter-agent coordination
   - Tool registration and integration through `lib/research-tools.ts` and `lib/action-engine/tools.ts`

2. **Component Architecture** 
   - Base components extend shadcn/ui primitives
   - Marketing components in `components/marketing/`
   - Chat interface components in `components/chatgpt/`
   - Animations use CSS keyframes + React Spring (see `app/animations.css`)

3. **API & Data Flow**
   - Edge-optimized API routes under `/app/api/`
   - Research pipeline: `/api/research` → `/api/deep-research` → `/api/action-engine`
   - Streaming responses preferred for AI interactions
   - Drizzle ORM for database interactions (see `lib/db/schema.ts`)

## Developer Workflows

### Environment Setup
```bash
npm install
npm run dev # Runs on localhost:3000
```

Required Environment Variables:
- `OPENAI_API_KEY` - OpenAI API access
- `DATABASE_URL` - Neon Postgres connection
- Add provider keys as needed (see `lib/providers.ts`)

### Code Style & Patterns
- TypeScript with strict mode
- 2-space indentation
- kebab-case for files (`research-agents.ts`)
- PascalCase for components (`ResearchInterface`)
- camelCase for functions/variables
- Absolute imports from project root
- Tailwind CSS with CSS variables mode

### Testing Approach
- Playwright for E2E testing
- Focus on critical AI integration flows
- Run tests: `npx playwright test`
- No unit tests currently configured

## Integration Points

- **Auth**: Auth.js (GitHub/Google OAuth)
- **Database**: Neon Postgres via Drizzle
- **Storage**: Vercel Blob
- **AI Providers**: 
  - OpenAI (primary)
  - Google, Anthropic, Hugging Face (secondary)
  - Local AI support: Ollama, LM Studio, vLLM

## Common Tasks

1. **Adding New AI Provider**
   - Add provider config to `lib/providers.ts`
   - Implement provider interface
   - Add environment variables

2. **Creating New Agent**
   - Extend `ResearchAgent` in `lib/research-agents.ts`
   - Register in `RESEARCH_AGENTS` constant
   - Add to orchestrator pipeline

3. **Adding New Tool**
   - Create tool in `lib/tools.ts`
   - Add corresponding API route if needed
   - Register in appropriate agent's toolset

4. **UI Component Development**
   - Extend shadcn/ui components
   - Follow Radix primitives for accessibility
   - Use Tailwind for styling
   - Place in appropriate `/components` subdirectory