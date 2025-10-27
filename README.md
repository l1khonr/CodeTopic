# Codetopic

![Codetopic Logo](/public/CODETOPIC.png)

> Your Intelligent Coding Partner: Experience coding reimagined with XML-powered AI assistance for smarter development

[![GitHub Repository](https://img.shields.io/badge/GitHub-CodeTopic-blue?style=for-the-badge&logo=github)](https://github.com/l1khonr/CodeTopic)
[![Telegram Community](https://img.shields.io/badge/Telegram-CodeTopic-blue?style=for-the-badge&logo=telegram)](https://t.me/CodeTopic)

## 🚀 Features

### 🤖 AI Agent Features

- **XML-Structured Intelligence**
  - XML-powered system prompts for precise code understanding
  - Context-aware code analysis and suggestions
  - Automated documentation generation
  - Smart code completion and refactoring

- **Multi-Provider Support**
  - OpenAI, Google Gemini, Anthropic integration
  - Local AI support with Ollama and LM Studio
  - Real-time provider switching
  - Low-latency responses

- **Advanced Capabilities**
  - Auto-learning from user interactions
  - Multi-step reasoning with tool orchestration
  - Deep code analysis and pattern recognition
  - Intelligent error detection and fixes

### 🎨 Modern UI/UX

- **Responsive Design**
  - Mobile-first approach
  - Dark/Light mode support
  - Smooth animations and transitions
  - Optimized for all screen sizes

- **Professional Components**
  - shadcn/ui integration
  - Radix UI primitives
  - Custom marketing components
  - Accessible and performant

- **Brand Identity**
  - Consistent typography (Libre Baskerville + DM Sans)
  - Professional color palette
  - High-quality icons and graphics
  - Branded UI elements

### 🛠 Technical Stack

- **Frontend**
  - Next.js 14 with App Router
  - React and TypeScript
  - Tailwind CSS for styling
  - Edge Runtime optimization

- **AI Integration**
  - XML System Prompts
  - AI SDK implementation
  - Tool orchestration system
  - Real-time streaming responses

- **Development Tools**
  - TypeScript for type safety
  - ESLint and Prettier
  - Husky for git hooks
  - Jest for testing

### 🔒 Security & Data

- **Authentication**
  - Next Auth integration
  - GitHub and Google OAuth
  - JWT token handling
  - Secure session management

- **Data Storage**
  - Neon Postgres database
  - Drizzle ORM
  - Vercel Blob for files
  - Type-safe database operations

### 🌐 Community Features

- **Collaboration Tools**
  - Real-time code sharing
  - Team workspaces
  - Shared code snippets
  - Collaborative editing

- **Integration Support**
  - GitHub integration
  - VS Code extension
  - Terminal commands
  - API endpoints
- 📦 **Resource Access** - Share chat history and profiles
- 🎨 **Inline UI** - Display content above model responses
- 🤖 **Follow-up Suggestions** - Context-aware next steps
- 🎴 **Inline Cards** - Lightweight displays with actions
- 🎠 **Inline Carousel** - Side-by-side browsing of items
- 🖼️ **Fullscreen** - Immersive experiences with composer
- 📺 **Picture-in-Picture** - Persistent floating windows

## Requirements

- **Node.js 18+** (specified in package.json)
- **Next.js 14** with App Router ✅
- **AI SDK installed** ✅ 
- **shadcn/ui initialized** ✅
- **Tailwind CSS** in CSS Variables mode ✅

All requirements are already configured! You just need to:
1. Install dependencies
2. Add API keys
3. Install AI Elements components
4. Start building!

## ChatGPT Integration

This project is **ChatGPT-ready** with full MCP server integration and design-compliant UI components.

### Quick Start for ChatGPT

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set Environment Variable**
   ```env
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

3. **Add to ChatGPT**
   - Go to ChatGPT settings
   - Add your MCP server URL: `https://your-app.vercel.app/mcp`
   - Enable your app

4. **Start Chatting**
   - Your app now runs inside ChatGPT conversations
   - Tools are automatically available
   - UI components display inline

### Available Components

- **Inline Cards** - Lightweight displays with actions
- **Inline Carousel** - Browse 3-8 items side-by-side
- **Fullscreen** - Immersive experiences with composer
- **Picture-in-Picture** - Persistent floating windows

See `CHATGPT_INTEGRATION.md` and `CHATGPT_DESIGN.md` for details.

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add at least one API key:

```env
# Google Gemini (recommended - fast & powerful)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key

# Hugging Face (access to thousands of models)
HF_TOKEN=hf_your-token-here

# OpenAI (optional)
OPENAI_API_KEY=sk-your-key-here

# Anthropic Claude (optional)
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Install AI Elements Components

Install all AI Elements components at once:

```bash
npx ai-elements@latest
```

This single command will:
- Install all AI Elements components
- Set up any missing dependencies
- Configure your project automatically

#### Alternative: Install Specific Components

```bash
# Install specific components
npx ai-elements@latest add conversation message response code-block
```

### 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Multi-Provider Support

This project supports four cloud providers + local inference:

### Cloud Providers

- **Google Gemini** ⚡ (Recommended) - Fast, low-latency models: Gemini 2.5 Pro, 2.5 Flash, 2.0 Flash
- **Hugging Face** - Access to thousands of models: DeepSeek V3, Llama 3, Qwen, and more
- **OpenAI** - GPT-4, GPT-4 Turbo, GPT-4o, GPT-4o Mini
- **Anthropic** - Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku

### Local Inference (Optional)

- **Ollama** 🖥️ - Run models locally, no API keys needed
- **LM Studio** - GUI-based local model serving
- **vLLM** - High-performance local inference
- **llama.cpp** - Minimal C++ implementation

Switch between providers directly in the chat interface! Run completely offline with local models.

See [LOCAL_AI.md](LOCAL_AI.md) for local setup guide.

## Hugging Face Integration

Your app has full access to Hugging Face Inference API with your token configured! This gives you access to:

- **Thousands of models** from Meta, DeepSeek, Qwen, Google, and more
- **Free tier** for development and testing
- **Low-latency inference** via Hugging Face router
- **15+ inference partners** (Groq, Together AI, Replicate, etc.)

**Your HF Token:** Already configured in your environment! Just select "Hugging Face" as your provider.

### Quick Access to Popular Models

- `deepseek-ai/DeepSeek-V3-0324` - Advanced reasoning
- `meta-llama/Llama-3.3-70B-Instruct` - Meta's latest model
- `Qwen/Qwen3-235B-A22B-Instruct` - Massive 235B model
- `meta-llama/Llama-3.2-3B-Instruct` - Fast and compact

See [HUGGING_FACE_GUIDE.md](HUGGING_FACE_GUIDE.md) for detailed information!

## Available AI Elements Components

After installation, you can use these components:

- **`conversation`** - Container for chat conversations
- **`message`** - Individual chat messages with avatars
- **`code-block`** - Syntax-highlighted code display with copy functionality
- **`response`** - Formatted AI response display
- **`actions`** - Interactive action buttons
- **`artifact`** - Display a code or document
- **`branch`** - Branch visualization for conversation flows
- **`chain-of-thought`** - Display AI reasoning
- **`context`** - Display context consumption
- **`image`** - AI-generated image display
- **`inline-citation`** - Inline source citations
- **`loader`** - Loading states for AI operations
- **`open-in-chat`** - Open in chat button
- **`prompt-input`** - Advanced input with model selection
- **`reasoning`** - Display AI reasoning
- **`sources`** - Source attribution
- **`suggestion`** - Quick action suggestions
- **`task`** - Task completion tracking
- **`tool`** - Tool usage visualization
- **`web-preview`** - Embedded web page previews

## Example Usage

See `app/page.tsx` for a basic chat implementation example.

For advanced usage with AI Elements components, see the [official documentation](https://sdk.vercel.ai/docs).

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── chat/          # API route for chat
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── ai-elements/       # AI Elements components (installed via CLI)
└── lib/
    └── utils.ts           # Utility functions
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **AI Elements** - AI chat components
- **AI SDK** - Vercel AI SDK for streaming

## Learning Resources

- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [AI SDK llms.txt](https://ai-sdk.dev/llms.txt) - For AI assistants
- [Project llms.txt](llms.txt) - Project documentation for AI assistants
- [Getting Started Guide](GETTING_STARTED.md)
- [Full Features Setup](FULL_FEATURES_SETUP.md)

## For AI Assistants

This project includes comprehensive documentation in `llms.txt` for Cursor, Windsurf, Copilot, and other AI coding assistants. The file contains:
- Complete project structure
- AI SDK integration details
- Tool usage examples
- Provider configurations
- Common patterns and code snippets

## License

MIT

