# VocalnBox - GitHub Pages Deployment Guide

## Prerequisites

- GitHub account
- Git installed locally
- Node.js 18+ installed

## Initial Setup

### 1. Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: VocalnBox email client"

# Create repository on GitHub, then:
git remote add origin https://github.com/uumair327/VocalnBox.git
git branch -M main
git push -u origin main
```

### 2. Configure GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 3. Configure GitHub Secrets (Optional but Recommended)

If you want to use environment variables in production:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Gemini AI API key for email composition | No* |

*Note: The Gemini API key is stored in localStorage by users, so this is optional. However, you can set a default key if needed.

### 4. Update Base URL

The `vite.config.ts` is already configured with:
```typescript
base: mode === "production" ? "/VocalnBox/" : "/"
```

**Important:** If your repository name is different from "VocalnBox", update this line in `vite.config.ts`:
```typescript
base: mode === "production" ? "/YOUR_REPO_NAME/" : "/"
```

## Deployment

### Automatic Deployment

Every push to the `main` branch automatically triggers deployment:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The GitHub Action will:
1. Install dependencies
2. Run tests
3. Lint code
4. Build the project
5. Deploy to GitHub Pages

### Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

## Accessing Your Site

After successful deployment, your site will be available at:
```
https://uumair327.github.io/VocalnBox/
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

### Development
Create `.env.local` file (copy from `.env.example`):
```bash
cp .env.example .env.local
```

Then add your API keys.

### Production
Users will configure their Gemini API key through the Settings page in the app.

## Troubleshooting

### 404 on Refresh
GitHub Pages doesn't support client-side routing by default. The app uses hash-based routing to work around this.

### Build Fails
- Check Node.js version (requires 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check GitHub Actions logs for specific errors

### Assets Not Loading
- Verify `base` path in `vite.config.ts` matches your repository name
- Check browser console for 404 errors

## Security Best Practices

✅ **Implemented:**
- `.env` files in `.gitignore`
- No hardcoded secrets in code
- API keys stored in localStorage (user-provided)
- Production build minification
- Secure headers via GitHub Pages

⚠️ **Important:**
- Never commit `.env.local` or any file containing secrets
- Users must provide their own Gemini API keys
- Review dependencies regularly for vulnerabilities: `npm audit`

## Monitoring

Monitor your deployment:
- **Actions Tab**: View build and deployment logs
- **Insights → Traffic**: See visitor statistics
- **Settings → Pages**: Check deployment status

## Custom Domain (Optional)

To use a custom domain:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Add DNS records as instructed
4. Enable **Enforce HTTPS**

## Updates and Maintenance

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update to latest versions
npx npm-check-updates -u
npm install
```

## Support

For issues:
- Check [GitHub Actions logs](https://github.com/uumair327/VocalnBox/actions)
- Review [GitHub Pages documentation](https://docs.github.com/en/pages)
- Open an issue in the repository
