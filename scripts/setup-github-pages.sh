#!/bin/bash

# VocalnBox - GitHub Pages Setup Script
# This script helps you set up the repository for GitHub Pages deployment

set -e

echo "🚀 VocalnBox - GitHub Pages Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi
print_success "Git is installed"

# Check if node is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
NODE_VERSION=$(node -v)
print_success "Node.js is installed ($NODE_VERSION)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
NPM_VERSION=$(npm -v)
print_success "npm is installed ($NPM_VERSION)"

echo ""
echo "📝 Repository Configuration"
echo "============================"

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    print_error "GitHub username is required"
    exit 1
fi

# Get repository name
read -p "Enter repository name (default: VocalnBox): " REPO_NAME
REPO_NAME=${REPO_NAME:-VocalnBox}

echo ""
print_info "GitHub Username: $GITHUB_USERNAME"
print_info "Repository Name: $REPO_NAME"
echo ""

# Confirm
read -p "Is this correct? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    print_warning "Setup cancelled"
    exit 0
fi

echo ""
echo "🔧 Updating configuration files..."
echo "=================================="

# Update vite.config.ts
if [ -f "vite.config.ts" ]; then
    sed -i.bak "s|/VocalnBox/|/$REPO_NAME/|g" vite.config.ts
    rm vite.config.ts.bak 2>/dev/null || true
    print_success "Updated vite.config.ts"
else
    print_warning "vite.config.ts not found"
fi

# Update package.json
if [ -f "package.json" ]; then
    sed -i.bak "s|YOUR_USERNAME|$GITHUB_USERNAME|g" package.json
    sed -i.bak "s|VocalnBox|$REPO_NAME|g" package.json
    rm package.json.bak 2>/dev/null || true
    print_success "Updated package.json"
else
    print_warning "package.json not found"
fi

# Update README.md
if [ -f "README.md" ]; then
    sed -i.bak "s|YOUR_USERNAME|$GITHUB_USERNAME|g" README.md
    sed -i.bak "s|VocalnBox|$REPO_NAME|g" README.md
    rm README.md.bak 2>/dev/null || true
    print_success "Updated README.md"
else
    print_warning "README.md not found"
fi

# Update DEPLOYMENT.md
if [ -f "DEPLOYMENT.md" ]; then
    sed -i.bak "s|YOUR_USERNAME|$GITHUB_USERNAME|g" DEPLOYMENT.md
    sed -i.bak "s|VocalnBox|$REPO_NAME|g" DEPLOYMENT.md
    rm DEPLOYMENT.md.bak 2>/dev/null || true
    print_success "Updated DEPLOYMENT.md"
else
    print_warning "DEPLOYMENT.md not found"
fi

echo ""
echo "📦 Installing dependencies..."
echo "============================="

npm install
print_success "Dependencies installed"

echo ""
echo "🧪 Running tests..."
echo "==================="

npm run test
print_success "Tests passed"

echo ""
echo "🔍 Running linter..."
echo "===================="

npm run lint || print_warning "Linting completed with warnings"

echo ""
echo "🏗️  Building project..."
echo "======================="

npm run build
print_success "Build successful"

echo ""
echo "📋 Git setup"
echo "============"

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_info "Initializing git repository..."
    git init
    print_success "Git initialized"
else
    print_success "Git already initialized"
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    print_warning "Remote 'origin' already exists"
    CURRENT_REMOTE=$(git remote get-url origin)
    print_info "Current remote: $CURRENT_REMOTE"
    read -p "Do you want to update it? (y/n): " UPDATE_REMOTE
    if [ "$UPDATE_REMOTE" = "y" ] || [ "$UPDATE_REMOTE" = "Y" ]; then
        git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
        print_success "Remote updated"
    fi
else
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    print_success "Remote added"
fi

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
print_info "Next steps:"
echo ""
echo "1. Create repository on GitHub:"
echo "   https://github.com/new"
echo "   Repository name: $REPO_NAME"
echo ""
echo "2. Commit and push your code:"
echo "   git add ."
echo "   git commit -m \"feat: initial commit with GitHub Pages setup\""
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages:"
echo "   Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "   Set Source to: GitHub Actions"
echo ""
echo "4. Your site will be available at:"
echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
print_success "Happy deploying! 🚀"
