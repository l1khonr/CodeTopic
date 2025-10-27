# GEMINI.md

## Project Overview

This is a Next.js 14 project called "Codetopic," an intelligent coding partner that uses XML-powered AI assistance for smarter development. The project is designed to be a comprehensive AI chat application with a modern UI/UX, multi-provider support for AI models, and advanced capabilities like tool orchestration and auto-learning.

The key technologies used are:

*   **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, `shadcn/ui`, and `Radix UI`.
*   **AI Integration:** Vercel AI SDK, XML System Prompts, and support for multiple AI providers including Google Gemini, Hugging Face, OpenAI, and Anthropic, as well as local AI models.
*   **Backend:** Next.js API Routes, NextAuth.js for authentication, Neon Postgres database with Drizzle ORM, and Vercel Blob for file storage.

## Building and Running

The following commands are available to build, run, and test the project:

*   **`npm run dev`**: Starts the development server at `http://localhost:3000`.
*   **`npm run build`**: Creates a production-ready build of the application.
*   **`npm run start`**: Starts the production server.
*   **`npm run lint`**: Lints the codebase using ESLint to enforce code quality.

Before running the application, make sure to install the dependencies using `npm install` and set up the environment variables by copying `.env.local.example` to `.env.local` and adding the required API keys.

## Development Conventions

The project follows a set of modern development conventions to ensure code quality, consistency, and maintainability:

*   **TypeScript:** The entire codebase is written in TypeScript for strict type safety.
*   **ESLint and Prettier:** ESLint is used for linting, and it's recommended to use Prettier for code formatting to maintain a consistent style.
*   **Component-Based Architecture:** The UI is built using a component-based architecture with `shadcn/ui` and `Radix UI` for creating accessible and reusable components.
*   **Git Hooks:** The project uses Husky for Git hooks, which can be used to run linters and tests before committing code.
*   **Modular Code:** The code is organized into modules with a clear separation of concerns, making it easier to understand and maintain. The `lib` directory contains the core business logic, while the `app` directory handles the routing and UI.
