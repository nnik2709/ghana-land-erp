# Ghana Land ERP - Standalone Demo

This is a **100% frontend-only** version of the Ghana Land ERP demo that requires **NO backend server**.

All functionality is hardcoded in the frontend, making it perfect for:
- ✅ Static hosting (Vercel, Netlify, GitHub Pages)
- ✅ Quick stakeholder demos
- ✅ Offline presentations
- ✅ Zero deployment complexity

## Features

All features from the main demo work without a backend:
- ✅ Multi-role login (Citizen, Surveyor, Officer, Admin)
- ✅ Interactive GIS Demo with drawing tools
- ✅ ChatBOT widget
- ✅ Property valuation
- ✅ Blockchain verification
- ✅ Payment history
- ✅ Document management
- ✅ All navigation and pages

## Quick Start

### Install Dependencies
```bash
cd standalone-demo
npm install
```

### Run on Port 3001
```bash
PORT=3001 BROWSER=none npm start
```

The app will be available at: http://localhost:3001

## Login Credentials

All users use password: `password123`

**Citizen:**
- Email: kofi.mensah@example.com
- Password: password123

**Surveyor:**
- Email: ama.adjei@example.com
- Password: password123

**Officer:**
- Email: abena.osei@example.com
- Password: password123

**Admin:**
- Email: kwame.nkrumah@example.com
- Password: password123

## Deploy to Vercel

1. Push this standalone-demo folder to GitHub
2. Connect to Vercel
3. Deploy - that's it! No backend needed!

## Differences from Main Demo

- ✅ No backend server required
- ✅ All data is hardcoded/mocked
- ✅ Login works with mock authentication
- ✅ All pages and features functional
- ⚠️ Data doesn't persist (reloads reset state)
- ⚠️ No real blockchain integration (mocked)

Perfect for demonstrations and stakeholder reviews!
