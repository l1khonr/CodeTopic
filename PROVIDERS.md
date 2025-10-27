# AI Provider Configuration Guide

This project supports multiple AI providers that you can switch between in real-time.

## Available Providers

### 1. OpenAI (Default)

**Models Available:**
- GPT-4o (Most capable)
- GPT-4o-mini (Fast and cost-effective)
- GPT-4 Turbo
- GPT-4

**Setup:**
```env
OPENAI_API_KEY=sk-your-key-here
```

Get your key from [OpenAI Platform](https://platform.openai.com/api-keys).

**Best for:**
- General purpose conversations
- Code generation and debugging
- Creative writing
- Fast responses

---

### 2. Anthropic Claude

**Models Available:**
- Claude 3.5 Sonnet (Most capable)
- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku (Fast)

**Setup:**
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key from [Anthropic Console](https://console.anthropic.com/).

**Best for:**
- Long-form conversations
- Complex reasoning
- Code review and analysis
- Context-aware responses

---

### 3. Hugging Face Inference

**Models Available via HF Router:**
- `meta-llama/Llama-3.2-3B-Instruct` - Llama 3.2 3B
- `meta-llama/Llama-3.1-8B-Instruct` - Llama 3.1 8B
- `mistralai/Mistral-7B-Instruct-v0.3` - Mistral 7B
- `google/gemma-2-2b-it` - Gemma 2 2B
- `Qwen/Qwen2.5-3B-Instruct` - Qwen 2.5 3B

**Setup:**
```env
HF_TOKEN=hf_your-token-here
# or
HUGGINGFACE_HUB_TOKEN=hf_your-token-here
```

Get your token from [Hugging Face Settings](https://huggingface.co/settings/tokens).

**Best for:**
- Open-source models
- Testing different architectures
- Cost-effective options
- On-device inference

---

## Hugging Face Inference Providers

The Hugging Face Inference Router provides access to **15+ inference partners** through a unified, OpenAI-compatible endpoint:

- Groq
- Novita
- Nebius AI
- Cerebras
- SambaNova
- Nscale
- fal
- Hyperbolic
- Together AI
- Fireworks
- Featherless AI
- Zai
- Replicate
- Cohere
- Scaleway

**Advantages:**
- No infrastructure to manage
- Direct access to cutting-edge models
- Cost-effective pricing
- Easy model switching

Learn more at [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/).

---

## Model Comparison

| Model | Context | Speed | Best For |
|-------|---------|-------|----------|
| GPT-4o | 128K | Fast | General purpose |
| GPT-4o-mini | 128K | Very Fast | Quick responses |
| Claude 3.5 Sonnet | 200K | Medium | Long context |
| Claude 3 Haiku | 200K | Fast | Quick tasks |
| Llama 3.2 3B | 8K | Fast | On-device |
| Mistral 7B | 32K | Fast | Balance |

---

## Using Multiple Providers

You can configure all three providers simultaneously:

```env
# .env.local
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
HF_TOKEN=hf_your-hf-token
```

The chat interface will automatically use whichever provider you select, and you can switch between them instantly without restarting the server.

---

## Code Examples

### Using OpenAI

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const result = await streamText({
  model: openai('gpt-4o-mini'),
  messages: conversation,
});
```

### Using Anthropic

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

const result = await streamText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  messages: conversation,
});
```

### Using Hugging Face

```typescript
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const hfOpenAI = createOpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN,
});

const result = await streamText({
  model: hfOpenAI('meta-llama/Llama-3.2-3B-Instruct'),
  messages: conversation,
});
```

---

## Troubleshooting

### "Invalid API Key" Error

Make sure your API key is correctly set in `.env.local` and restart the dev server.

### Provider Not Available

Check that:
1. The API key is set in `.env.local`
2. You've installed the required dependencies
3. The dev server has been restarted after adding environment variables

### Model Not Found (HF)

Ensure the model ID is correct. Browse available models at [Hugging Face](https://huggingface.co/models).

---

## Cost Considerations

- **OpenAI**: Pay-per-use, varies by model
- **Anthropic**: Pay-per-use, competitive pricing
- **Hugging Face**: Free for many models, paid for premium access

For development and testing, Hugging Face often offers free tiers or lower-cost options.

