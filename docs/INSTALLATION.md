# Codetopic Installation Guide

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/l1khonr/CodeTopic.git

# Navigate to the project directory
cd CodeTopic

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔧 Environment Setup

```env
# Core Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=your_postgres_url

# AI Providers
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
ANTHROPIC_API_KEY=your_anthropic_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Storage
BLOB_READ_WRITE_TOKEN=your_blob_token
```

## 🎯 Quick Start Guide

1. Clone and install dependencies as shown above
2. Configure your environment variables
3. Start the development server:

```bash
npm run dev
```

4. Visit [http://localhost:3000](http://localhost:3000)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes:

```bash
git commit -m 'Add amazing feature'
```

4. Push to the branch:

```bash
git push origin feature/amazing-feature
```

5. Create a Pull Request

## 📱 Community & Support

- **Telegram Community**: Join our [Telegram group](https://t.me/CodeTopic) for discussions
- **GitHub Issues**: Report bugs or suggest features on our [issue tracker](https://github.com/l1khonr/CodeTopic/issues)
- **Documentation**: Read our comprehensive [documentation](https://github.com/l1khonr/CodeTopic/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org)
- [Vercel](https://vercel.com)
- [shadcn](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- All our amazing contributors!