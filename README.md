# VocalnBox

A modern, voice-enabled email client built with React, TypeScript, and AI-powered composition features.

## 🚀 Features

- 📧 Full-featured email client interface
- 🎤 Voice composition with AI assistance
- 🤖 Gemini AI integration for smart email drafting
- 📱 Responsive design with mobile support
- 🎨 Modern UI with shadcn/ui components
- 🔐 Secure authentication system
- 📊 Email management (inbox, sent, drafts, spam, trash)

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **AI Integration**: Google Gemini API
- **Testing**: Vitest + Testing Library
- **Mobile**: Capacitor (Android support)

## 📋 Prerequisites

- Node.js 18+ and npm
- Git
- A Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🏃 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/uumair327/VocalnBox.git
cd VocalnBox

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your Gemini API key to .env.local (optional - users can add it in Settings)

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see the app.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Lint code
```

## 🌐 Deployment to GitHub Pages

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

1. Push to GitHub:
```bash
git add .
git commit -m "Deploy VocalnBox"
git push origin main
```

2. Enable GitHub Pages in repository settings (Source: GitHub Actions)

3. Your site will be live at: `https://uumair327.github.io/VocalnBox/`

## 🔐 Environment Variables

The app uses the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Gemini AI API key | No* |

*Users can configure their API key through the Settings page.

## 🏗️ Project Structure

```
VocalnBox/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── NavDrawer.tsx     # Navigation drawer
│   │   ├── NavLink.tsx       # Navigation links
│   │   └── VoiceCompose.tsx  # Voice composition
│   ├── contexts/
│   │   └── AppContext.tsx    # Global app state
│   ├── hooks/                # Custom React hooks
│   ├── lib/
│   │   ├── gemini.ts         # Gemini AI integration
│   │   ├── mockData.ts       # Demo data
│   │   └── utils.ts          # Utility functions
│   ├── pages/                # Page components
│   │   ├── Dashboard.tsx     # Main email dashboard
│   │   ├── Compose.tsx       # Email composition
│   │   ├── EmailDetail.tsx   # Email viewer
│   │   ├── Login.tsx         # Authentication
│   │   ├── Settings.tsx      # User settings
│   │   └── ...
│   ├── test/                 # Test files
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── DEPLOYMENT.md             # Deployment guide
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

## 🔒 Security

- API keys are never committed to the repository
- User credentials stored in localStorage (demo mode)
- Environment variables for sensitive configuration
- Regular dependency updates via `npm audit`
- Production builds are minified and optimized

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is built with [Lovable](https://lovable.dev) and is available for personal and commercial use.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [Deployment Guide](./DEPLOYMENT.md)
- Review [Lovable Documentation](https://docs.lovable.dev)

---

Made with ❤️ using Lovable
