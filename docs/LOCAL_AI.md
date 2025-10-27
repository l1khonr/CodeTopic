# Local AI Integration Guide

Run AI models locally on your machine without using cloud APIs! Perfect for privacy, offline usage, and cost savings.

## 🖥️ Local AI Options

### 1. Ollama (Recommended)

**Easiest way to run local models**

#### Setup

1. Install Ollama from [ollama.ai](https://ollama.ai)

2. Pull your preferred model:
   ```bash
   # Lightweight & fast
   ollama pull llama3.2:3b
   
   # More capable
   ollama pull llama3.1:8b
   
   # Maximum performance
   ollama pull deepseek-coder:6.7b
   ```

3. Update your `.env.local`:
   ```env
   OLLAMA_BASE_URL=http://localhost:11434
   ```

4. Your app is ready! Select "local" provider.

#### Available Ollama Models

| Model | Size | Use Case |
|-------|------|----------|
| `llama3.2:3b` | 3B | Fast responses, lightweight |
| `llama3.1:8b` | 8B | Balanced performance |
| `deepseek-coder:6.7b` | 7B | Programming tasks |
| `mistral:7b` | 7B | General purpose |
| `codellama:7b` | 7B | Code generation |

### 2. LM Studio

**User-friendly GUI for local models**

#### Setup

1. Download [LM Studio](https://lmstudio.ai)
2. Download a model through the interface
3. Start the local server (usually runs on `http://localhost:1234`)
4. Your app will connect automatically!

### 3. vLLM

**High-performance local inference**

```bash
# Install vLLM
pip install vllm

# Run a model
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --host 0.0.0.0 \
  --port 8000
```

### 4. llama.cpp

**Minimal dependencies, fast inference**

```bash
# Build from source
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make

# Run a model
./llama-cli -m model.gguf -p "Your prompt"
```

## 🔧 Integrating Local Models

### For Ollama

Update your API route to support Ollama:

```typescript
import { createOpenAI } from '@ai-sdk/openai';

const ollamaClient = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
  apiKey: 'ollama', // No key needed for local
});

// In your API route
case 'ollama':
  streamTextOptions = {
    model: ollamaClient(model || 'llama3.2:3b'),
    messages,
  };
  break;
```

### For LM Studio

LM Studio provides an OpenAI-compatible endpoint:

```typescript
const lmStudioClient = createOpenAI({
  baseURL: 'http://localhost:1234/v1',
  apiKey: 'lm-studio', // Not required
});

case 'lmstudio':
  streamTextOptions = {
    model: lmStudioClient(model || 'local-model'),
    messages,
  };
  break;
```

## 🎯 Recommended Setup

### Development

1. **Ollama + Llama 3.2 3B** - Fast, free, good quality
2. Minimal setup required
3. Works offline after initial setup

### Production

1. **vLLM + Llama 3.1 8B** - Best performance
2. Runs on GPU for speed
3. Scales to handle multiple requests

## 💡 Benefits of Local AI

- **Privacy** - Data never leaves your machine
- **Cost** - No API costs
- **Speed** - No network latency (after initial load)
- **Offline** - Works without internet
- **Custom** - Fine-tune for your needs
- **Control** - Full control over model and settings

## 🚀 Quick Start

The easiest way to get started:

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull Llama 3.2
ollama pull llama3.2:3b

# Your app is ready!
```

No API keys needed!

## 📊 System Requirements

### Minimum (for 3B models)
- RAM: 4GB+
- Storage: 2GB+
- CPU: Modern processor

### Recommended (for 8B+ models)
- RAM: 16GB+
- GPU: NVIDIA GPU with 8GB+ VRAM
- Storage: 10GB+

## 🔍 Testing Local Models

```bash
# Test Ollama
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "Why is AI cool?"
}'

# Test LM Studio
curl http://localhost:1234/v1/completions -d '{
  "model": "local-model",
  "prompt": "Hello world",
  "temperature": 0.7
}'
```

## 🎨 Integration with Your App

Your app already supports switching between providers. To use local models:

1. Set up Ollama or your local server
2. Add the environment variable
3. Select the local provider in the UI

## 📚 Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [LM Studio Guide](https://lmstudio.ai/docs)
- [vLLM Documentation](https://docs.vllm.ai)
- [llama.cpp GitHub](https://github.com/ggerganov/llama.cpp)

## 🎉 Get Started

Your chat app is ready for local AI! Just install Ollama and you're good to go:

```bash
# On macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# On Windows
# Download from https://ollama.ai/download
```

Then pull a model and start chatting locally!

