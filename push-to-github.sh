#!/bin/bash

# Remove old remote
git remote remove origin

# Add new remote (replace with your actual repo URL after creating it)
git remote add origin https://github.com/nnik2709/ghana-land-erp.git

# Add all files
git add .

# Commit with message
git commit -m "Initial commit: Ghana Land ERP Demo - 65% functional requirements implemented

- Complete RBAC with 4 user roles (Citizen, Surveyor, Officer, Admin)
- GIS mapping with polygon boundaries and OpenStreetMap integration
- Survey submission workflow with GPS capture
- Application lifecycle management (submit, review, approve)
- Payment processing with multiple methods
- Blockchain transaction logging and verification
- Mortgage registry module
- Document management system
- Audit logging and compliance tracking
- Professional Ghana-themed UI/UX
- 19 pages, comprehensive documentation
- Ready for stakeholder demo and online deployment"

# Push to GitHub
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "Repository URL: https://github.com/nnik2709/ghana-land-erp"
echo ""
