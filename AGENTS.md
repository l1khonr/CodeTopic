# Repository Guidelines

## Project Structure & Module Organization

This Next.js application follows a modular structure:

- `app/`: Next.js App Router with pages, API routes, and global styles
- `components/`: Reusable UI components (shadcn/ui, Radix UI, custom marketing components)
- `lib/`: Core business logic, AI agents, tools, database schema, and utilities
- `docs/`: Comprehensive documentation and guides
- `public/`: Static assets and icons

Source code is in TypeScript with AI integrations in `lib/` and UI components in `components/`.

## Build, Test, and Development Commands

Key commands for development:

- `npm run dev`: Start development server on localhost:3000
- `npm run build`: Build optimized production bundle
- `npm run start`: Serve production build locally
- `npm run lint`: Run ESLint with Next.js rules

Testing uses Playwright for end-to-end scenarios. No dedicated unit test runner configured.

## Coding Style & Naming Conventions

- **Language**: TypeScript with strict type checking
- **Linting**: ESLint extends `next/core-web-vitals`
- **Indentation**: 2 spaces (standard Next.js)
- **Naming**:
  - Variables/functions: camelCase (`userData`, `fetchAgents`)
  - Components: PascalCase (`ChatInterface`, `ApiRoute`)
  - Files: kebab-case (`research-agents.ts`, `api-route.ts`)
- **Styling**: Tailwind CSS with CSS variables mode
- **Imports**: Absolute paths from project root

## Testing Guidelines

- **Framework**: Playwright for browser-based end-to-end testing
- **Coverage**: Focus on critical user flows and AI integrations
- **Naming**: Test files as `*.test.ts` or `*.spec.ts`
- **Running Tests**: `npx playwright test` (configure in package.json if needed)

Unit tests not currently configured; consider Jest for component testing.

## Commit & Pull Request Guidelines

- **Commit Messages**: Use imperative mood, e.g., "Add AI agent routing" or "Fix chat streaming bug"
- **Pull Requests**:
  - Provide clear descriptions of changes
  - Link related issues or features
  - Include screenshots for UI changes
  - Ensure CI passes (linting, build)
- **Branching**: Feature branches from main, squash merges preferred

Follow conventional commits for automated versioning if implemented.