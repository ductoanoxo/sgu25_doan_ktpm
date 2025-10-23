#!/bin/bash

# CI/CD Setup Push Script
# Tự động add, commit và push các file CI/CD lên GitHub

echo "🚀 Starting CI/CD Setup Push..."
echo ""

# Check if in git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not a git repository!"
    exit 1
fi

# Show current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Show status
echo "📋 Current changes:"
git status --short
echo ""

# Confirm before proceeding
read -p "❓ Do you want to add and commit these changes? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted."
    exit 1
fi

# Add files
echo "➕ Adding files..."
git add .github/
git add docs/CI_CD_GUIDE.md
git add docs/PUSH_CICD_GUIDE.md
git add .gitignore
git add README.md

# Show what will be committed
echo ""
echo "📝 Files to be committed:"
git status --short
echo ""

# Commit
echo "💬 Committing changes..."
git commit -m "feat: Add CI/CD pipeline with GitHub Actions

- Add main CI/CD workflow for testing and building
- Add development CI for quick validation
- Add deployment workflow for production
- Add comprehensive documentation
- Update .gitignore to exclude sensitive files
- Update README with CI/CD badges and links
"

# Check if commit was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Commit successful!"
    echo ""
    
    # Ask to push
    read -p "🚀 Push to origin/$CURRENT_BRANCH? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Pushing to origin/$CURRENT_BRANCH..."
        git push origin $CURRENT_BRANCH
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Successfully pushed to GitHub!"
            echo ""
            echo "📊 Next steps:"
            echo "1. Go to: https://github.com/Babyfat012/sgu25_doan_ktpm"
            echo "2. Click on 'Actions' tab"
            echo "3. Watch your CI/CD pipeline run!"
            echo ""
        else
            echo "❌ Push failed! Please check your connection and try again."
            exit 1
        fi
    else
        echo "⏸️  Skipped push. You can push later with:"
        echo "   git push origin $CURRENT_BRANCH"
    fi
else
    echo "❌ Commit failed! Please check the errors above."
    exit 1
fi

echo "✨ Done!"
