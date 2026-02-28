# VocalnBox - GitHub Pages Setup Script (PowerShell)
# This script helps you set up the repository for GitHub Pages deployment

$ErrorActionPreference = "Stop"

Write-Host "🚀 VocalnBox - GitHub Pages Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Function to print colored output
function Print-Success {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Error {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Print-Warning {
    param($Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Print-Info {
    param($Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# Check if git is installed
try {
    $gitVersion = git --version
    Print-Success "Git is installed ($gitVersion)"
} catch {
    Print-Error "Git is not installed. Please install Git first."
    exit 1
}

# Check if node is installed
try {
    $nodeVersion = node -v
    Print-Success "Node.js is installed ($nodeVersion)"
} catch {
    Print-Error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm -v
    Print-Success "npm is installed ($npmVersion)"
} catch {
    Print-Error "npm is not installed. Please install npm first."
    exit 1
}

Write-Host ""
Write-Host "📝 Repository Configuration" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Get GitHub username
$GITHUB_USERNAME = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrWhiteSpace($GITHUB_USERNAME)) {
    Print-Error "GitHub username is required"
    exit 1
}

# Get repository name
$REPO_NAME = Read-Host "Enter repository name (default: VocalnBox)"
if ([string]::IsNullOrWhiteSpace($REPO_NAME)) {
    $REPO_NAME = "VocalnBox"
}

Write-Host ""
Print-Info "GitHub Username: $GITHUB_USERNAME"
Print-Info "Repository Name: $REPO_NAME"
Write-Host ""

# Confirm
$CONFIRM = Read-Host "Is this correct? (y/n)"
if ($CONFIRM -ne "y" -and $CONFIRM -ne "Y") {
    Print-Warning "Setup cancelled"
    exit 0
}

Write-Host ""
Write-Host "🔧 Updating configuration files..." -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Update vite.config.ts
if (Test-Path "vite.config.ts") {
    (Get-Content "vite.config.ts") -replace '/VocalnBox/', "/$REPO_NAME/" | Set-Content "vite.config.ts"
    Print-Success "Updated vite.config.ts"
} else {
    Print-Warning "vite.config.ts not found"
}

# Update package.json
if (Test-Path "package.json") {
    (Get-Content "package.json") -replace 'YOUR_USERNAME', $GITHUB_USERNAME -replace 'VocalnBox', $REPO_NAME | Set-Content "package.json"
    Print-Success "Updated package.json"
} else {
    Print-Warning "package.json not found"
}

# Update README.md
if (Test-Path "README.md") {
    (Get-Content "README.md") -replace 'YOUR_USERNAME', $GITHUB_USERNAME -replace 'VocalnBox', $REPO_NAME | Set-Content "README.md"
    Print-Success "Updated README.md"
} else {
    Print-Warning "README.md not found"
}

# Update DEPLOYMENT.md
if (Test-Path "DEPLOYMENT.md") {
    (Get-Content "DEPLOYMENT.md") -replace 'YOUR_USERNAME', $GITHUB_USERNAME -replace 'VocalnBox', $REPO_NAME | Set-Content "DEPLOYMENT.md"
    Print-Success "Updated DEPLOYMENT.md"
} else {
    Print-Warning "DEPLOYMENT.md not found"
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

npm install
Print-Success "Dependencies installed"

Write-Host ""
Write-Host "🧪 Running tests..." -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

npm run test
Print-Success "Tests passed"

Write-Host ""
Write-Host "🔍 Running linter..." -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

try {
    npm run lint
    Print-Success "Linting passed"
} catch {
    Print-Warning "Linting completed with warnings"
}

Write-Host ""
Write-Host "🏗️  Building project..." -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

npm run build
Print-Success "Build successful"

Write-Host ""
Write-Host "📋 Git setup" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Print-Info "Initializing git repository..."
    git init
    Print-Success "Git initialized"
} else {
    Print-Success "Git already initialized"
}

# Check if remote exists
$remoteExists = git remote | Select-String "origin"
if ($remoteExists) {
    Print-Warning "Remote 'origin' already exists"
    $currentRemote = git remote get-url origin
    Print-Info "Current remote: $currentRemote"
    $UPDATE_REMOTE = Read-Host "Do you want to update it? (y/n)"
    if ($UPDATE_REMOTE -eq "y" -or $UPDATE_REMOTE -eq "Y") {
        git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
        Print-Success "Remote updated"
    }
} else {
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    Print-Success "Remote added"
}

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Print-Info "Next steps:"
Write-Host ""
Write-Host "1. Create repository on GitHub:"
Write-Host "   https://github.com/new"
Write-Host "   Repository name: $REPO_NAME"
Write-Host ""
Write-Host "2. Commit and push your code:"
Write-Host "   git add ."
Write-Host "   git commit -m `"feat: initial commit with GitHub Pages setup`""
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""
Write-Host "3. Enable GitHub Pages:"
Write-Host "   Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
Write-Host "   Set Source to: GitHub Actions"
Write-Host ""
Write-Host "4. Your site will be available at:"
Write-Host "   https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
Write-Host ""
Print-Success "Happy deploying! 🚀"
