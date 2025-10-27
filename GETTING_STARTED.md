# Getting Started - Full Featured AI Chat

Welcome! This is your complete guide to getting your hackable AI chat app running.

## 🎯 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Copy `.env.local.example` to `.env.local` and configure:

**Minimum Required:**
```env
# At least one AI provider
GOOGLE_GENERATIVE_AI_API_KEY=your-key
# OR
HF_TOKEN=hf_your-token
```

**For Full Features:**
```env
# Database
DATABASE_URL=your_neon_postgres_url

# Authentication
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# File Storage
BLOB_READ_WRITE_TOKEN=your_blob_token
```

### 3. Initialize Database (Optional)

If using data persistence:

```bash
npx prisma generate
npx drizzle-kit push
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚀 What You Get

### Basic Setup (No Database)
- ✅ Multi-provider AI chat
- ✅ Tool integration
- ✅ Streaming responses
- ✅ Provider switching

### Full Setup (With Database & Auth)
- ✅ Everything above
- ✅ User authentication
- ✅ Persistent chat history
- ✅ File uploads
- ✅ User sessions

## 📚 Setup Guides

- **[INSTALLATION.md](INSTALLATION.md)** - Detailed installation
- **[FULL_FEATURES_SETUP.md](FULL_FEATURES_SETUP.md)** - Complete feature setup
- **[HUGGING_FACE_GUIDE.md](HUGGING_FACE_GUIDE.md)** - HF integration
- **[LOCAL_AI.md](LOCAL_AI.md)** - Local inference
- **[PROVIDERS.md](PROVIDERS.md)** - AI providers

## 🎓 Learning Path

1. **Start Simple**: Run with basic setup
2. **Add Auth**: Enable user login
3. **Enable Persistence**: Connect database
4. **Customize Tools**: Add your own tools
5. **Deploy**: Push to Vercel

## 💡 Next Steps

1. Choose your AI provider (Google Gemini recommended)
2. Add environment variables
3. Run the app
4. Start chatting!

For detailed instructions, see [INSTALLATION.md](INSTALLATION.md)

