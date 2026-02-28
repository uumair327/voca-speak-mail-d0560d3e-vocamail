# 🚀 VocalnBox - Quick Start Guide

## ⚡ 3-Minute Setup

### 1️⃣ Run Setup Script

**macOS/Linux:**
```bash
./scripts/setup-github-pages.sh
```

**Windows:**
```powershell
.\scripts\setup-github-pages.ps1
```

### 2️⃣ Create GitHub Repository

Go to: https://github.com/new
- Name: `VocalnBox`
- Visibility: **Public**
- Click "Create repository"

### 3️⃣ Push Code

```bash
git add .
git commit -m "feat: initial commit"
git push -u origin main
```

### 4️⃣ Enable GitHub Pages

1. Go to: **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Save

### 5️⃣ Done! 🎉

Your site will be live at:
```
https://uumair327.github.io/VocalnBox/
```

---

## 📋 Manual Setup (If Script Fails)

### Update These Files:

**vite.config.ts** (line 9):
```typescript
base: mode === "production" ? "/YOUR_REPO_NAME/" : "/"
```

**package.json** (lines 7-12):
```json
"repository": {
  "url": "https://github.com/uumair327/YOUR_REPO_NAME.git"
},
"homepage": "https://uumair327.github.io/YOUR_REPO_NAME/"
```

### Then Run:
```bash
npm install
npm run test
npm run build
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/uumair327/YOUR_REPO_NAME.git
git push -u origin main
```

---

## 🔐 Secrets (Optional)

No secrets required! Users add their Gemini API key in Settings.

---

## ✅ Verify Deployment

- [ ] Site loads
- [ ] No console errors
- [ ] All pages work
- [ ] Mobile responsive

---

## 📚 Full Documentation

- **SETUP_SUMMARY.md** - Complete setup guide
- **DEPLOYMENT.md** - Detailed deployment instructions
- **DEPLOYMENT_CHECKLIST.md** - Full checklist
- **README.md** - Project documentation

---

## 🆘 Help

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**404 errors?**
- Check `base` in `vite.config.ts`
- Wait 5-10 minutes

**Need more help?**
- See DEPLOYMENT.md
- Check GitHub Actions logs
- Open an issue

---

## 🎯 Key Commands

```bash
npm run dev              # Development
npm run build            # Production build
npm run test             # Run tests
npm run lint             # Lint code
```

---

**Ready to deploy?** Follow steps 1-5 above! 🚀
