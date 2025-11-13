#!/bin/bash

echo "🔐 GitHub Authentication Required"
echo ""
echo "When prompted for password, paste your Personal Access Token (PAT)"
echo "Not your GitHub password!"
echo ""
echo "Token format: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
echo ""

# Check if already committed
if git diff --cached --quiet; then
    echo "📦 Adding files..."
    git add .
    git commit -m "Initial commit: Ghana Land ERP Demo - 65% functional requirements implemented"
fi

echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done!"
echo "View your repository at: https://github.com/nnik2709/ghana-land-erp"
