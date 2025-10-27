# Installation Guide

Follow these steps to get your AI Elements project up and running.

## Step 1: Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- AI SDK and React hooks
- OpenAI integration

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory and add at least one API key:

### Option 1: Google Gemini ⚡ (Recommended)

```env
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key-here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

**Why Google Gemini?** 
- Millisecond response times
- Excellent performance
- Great for building fast AI applications

### Option 2: Hugging Face

```env
HF_TOKEN=hf_your-hugging-face-token
```

Get your token from [Hugging Face settings](https://huggingface.co/settings/tokens).

### Option 3: OpenAI

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

Get your API key from [OpenAI's dashboard](https://platform.openai.com/api-keys).

### Option 4: Anthropic Claude

```env
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
```

Get your API key from [Anthropic's console](https://console.anthropic.com/).

### Using Multiple Providers

You can add all four providers and switch between them:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your-google-key
HF_TOKEN=hf_your-hf-token
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
```

The chat interface allows you to switch between providers in real-time!

## Step 3: Install AI Elements Components

Your project now has:
- ✅ Next.js 14 with App Router
- ✅ AI SDK installed
- ✅ shadcn/ui configured (components.json)
- ✅ Tailwind CSS with CSS Variables mode

Install all AI Elements components at once using the AI Elements CLI:

```bash
npx ai-elements@latest
```

This single command will:
- Set up shadcn/ui configuration if needed
- Install all AI Elements components to your configured components directory
- Add all necessary dependencies to your project

### Alternative: Install Specific Components

If you prefer to install specific components:

```bash
# Using AI Elements CLI
npx ai-elements@latest add conversation message response code-block

# Or using shadcn CLI directly
npx shadcn@latest add https://registry.ai-sdk.dev/conversation.json
npx shadcn@latest add https://registry.ai-sdk.dev/message.json
```

## Step 4: Run the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Next Steps

After installing the AI Elements components, you'll find them in the `components/ai-elements/` directory. You can now:

1. Import and use them in your React components
2. Customize them to match your design
3. Explore other AI Elements components like `actions`, `branch`, `chain-of-thought`, etc.

See `app/page.tsx` for a basic example of using the chat functionality.

## Troubleshooting

### Component Not Found Error

If you see "Module not found" errors, make sure you've installed the AI Elements components using one of the methods above.

### API Route Not Working

Ensure your `.env.local` file has the correct `OPENAI_API_KEY` set.

### TypeScript Errors

Run `npm run build` to check for TypeScript errors. If you see missing type definitions, you may need to install additional type packages.

## Available Components

After installation, you can use any of these AI Elements components:

- `conversation` - Container for chat conversations
- `message` - Individual chat messages with avatars
- `code-block` - Syntax-highlighted code display with copy
- `response` - Formatted AI response display
- `actions` - Interactive action buttons
- `artifact` - Display code or documents
- `branch` - Visualize conversation flows
- `chain-of-thought` - Display AI reasoning
- `context` - Show context consumption
- `image` - AI-generated image display
- `inline-citation` - Inline source citations
- `loader` - Loading states
- `open-in-chat` - Open in chat button
- `prompt-input` - Advanced input with model selection
- `reasoning` - Display AI reasoning
- `sources` - Source attribution
- `suggestion` - Quick action suggestions
- `task` - Task completion tracking
- `tool` - Tool usage visualization
- `web-preview` - Web page previews

