# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in VocalnBox, please report it by:

1. **DO NOT** open a public issue
2. Email the maintainers directly (if available)
3. Or use GitHub's private vulnerability reporting feature

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Best Practices

### For Users

1. **API Keys**: Never share your Gemini API key
2. **Browser Storage**: Clear localStorage when using shared computers
3. **HTTPS**: Always access the app via HTTPS
4. **Updates**: Keep your browser updated

### For Developers

1. **Dependencies**: Run `npm audit` regularly
2. **Environment Variables**: Never commit `.env.local` files
3. **Code Review**: Review all PRs for security issues
4. **Secrets**: Use GitHub Secrets for CI/CD variables

## Known Security Considerations

### Client-Side Storage
- User data is stored in browser localStorage
- This is suitable for demo/personal use
- For production with real emails, implement server-side storage

### API Keys
- Gemini API keys are stored in localStorage
- Users must provide their own keys
- Keys are never transmitted to any server except Google's Gemini API

### Authentication
- Current implementation uses demo authentication
- For production, implement proper OAuth/JWT authentication
- Use secure session management

## Security Headers

GitHub Pages automatically provides:
- HTTPS encryption
- Basic security headers

For enhanced security with custom domains, consider:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options

## Dependency Security

We regularly update dependencies to patch security vulnerabilities:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## Compliance

- No personal data is collected by the application
- API keys are user-provided and stored locally
- No analytics or tracking by default

## Contact

For security concerns, please contact the repository maintainers.
