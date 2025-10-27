Copilot Instructions

## Project Architecture

This is a Next.js 14 app with integrated AI capabilities for chat, research, and automation:

- `/app` - Next.js app router routes and API endpoints
- `/components` - Reusable UI components (shadcn/ui + custom)
- `/lib` - Core business logic and AI agent implementation

### Key Patterns

1. **AI Agent Architecture**
   - Agent orchestration in `lib/research-orchestrator.ts`
   - Specialized agents (Planner, Researcher, Analyst, Synthesizer) in `lib/research-agents.ts`
   - Tool integration via `lib/research-tools.ts` and `lib/action-engine/tools.ts`

2. **Component Architecture** 
   - Base components extend shadcn/ui primitives
   - Animations use CSS keyframes + React Spring
   - Marketing components in `components/marketing/`
   - Chat components in `components/chatgpt/`

3. **API Routes**
   - AI endpoints under `/app/api/` 
   - Agent endpoints: `/api/research`, `/api/deep-research`, `/api/action-engine`
   - Tool endpoints: `/api/tools/weather`, etc.

## Developer Workflows

### Running Locally
```bash
npm install
npm run dev
```

Requires environment variables:
- `OPENAI_API_KEY` - OpenAI API access
- `DATABASE_URL` - Neon Postgres connection
- Additional provider keys as needed (Google, Anthropic, etc.)

### Component Development
1. Extend shadcn/ui components from `components/`
2. Use Tailwind for styling
3. Follow Radix primitives patterns for accessibility

### Adding AI Features
1. Define agent logic in `lib/`
2. Add API route in `app/api/`
3. Connect to UI via components
4. Register tools in `lib/tools.ts`

### Code Style
- TypeScript for type safety
- React hooks for state management
- Edge runtime optimization
- Prefer streaming responses for AI

## Integration Points

- **Auth**: Auth.js with GitHub/Google OAuth
- **Database**: Neon Postgres via Drizzle ORM
- **Storage**: Vercel Blob for files
- **AI**: OpenAI, Google, Anthropic, Hugging Face
- **Local AI**: Ollama, LM Studio, vLLM support

## Key Files

- `research-orchestrator.ts` - Core research agent coordination
- `action-engine/workflow.ts` - Multi-step workflow execution
- `components/research-interface.tsx` - Main research UI
- `lib/gui-agent.ts` - Automated UI interaction

## Common Tasks

- Add provider: Update `lib/providers.ts`
- Add tool: Create tool in `lib/tools.ts` + API route
- Add agent: Extend `ResearchAgent` in `lib/research-agents.ts`
- Add model: Configure in `lib/agent-logic.ts`