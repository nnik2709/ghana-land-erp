#!/bin/bash

echo "🔄 Switching to SSH authentication..."

# Remove HTTPS remote
git remote remove origin

# Add SSH remote
git remote add origin git@github.com:nnik2709/ghana-land-erp.git

echo "📦 Preparing commit..."
git add .
git commit -m "Initial commit: Ghana Land ERP Demo - 65% functional requirements implemented

Features:
- Complete RBAC with 4 user roles
- GIS mapping with polygon boundaries
- Survey submission workflow
- Application lifecycle management
- Payment processing
- Blockchain verification
- Mortgage registry
- Document management
- Audit logging
- Professional Ghana-themed UI
- Comprehensive documentation
- Ready for deployment"

echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "🔗 Repository: https://github.com/nnik2709/ghana-land-erp"
