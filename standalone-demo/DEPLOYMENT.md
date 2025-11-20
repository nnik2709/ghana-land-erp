# Ghana Land ERP Demo - Deployment Guide

The production build is ready in the `build/` folder.

---

## Quick Deployment Options

### Option 1: Netlify (Easiest - Free)

**One-click deploy:**

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Drag and drop the `build` folder onto the Netlify dashboard
3. Done! You'll get a URL like `https://random-name.netlify.app`

**Or via CLI:**
```bash
npm install -g netlify-cli
cd /Users/nikolay/github/ghana/ghana/standalone-demo
netlify deploy --prod --dir=build
```

### Option 2: Vercel (Free)

```bash
npm install -g vercel
cd /Users/nikolay/github/ghana/ghana/standalone-demo
vercel --prod
```

Follow the prompts. You'll get a URL like `https://your-project.vercel.app`

### Option 3: GitHub Pages (Free)

1. Create a GitHub repository
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/ghana-land-erp"
   ```
3. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
4. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
5. Deploy:
   ```bash
   npm run deploy
   ```

### Option 4: Surge.sh (Free - Instant)

```bash
npm install -g surge
cd /Users/nikolay/github/ghana/ghana/standalone-demo/build
surge
```

You'll get a URL like `https://your-name.surge.sh`

### Option 5: Firebase Hosting (Free tier)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select "build" as public directory
# Configure as single-page app: Yes
firebase deploy
```

---

## Recommended: Netlify Drop

For the absolute easiest deployment:

1. Open https://app.netlify.com/drop
2. Drag the entire `build` folder from:
   ```
   /Users/nikolay/github/ghana/ghana/standalone-demo/build
   ```
3. Wait 30 seconds
4. Copy your URL and share with stakeholders!

---

## Custom Domain (Optional)

After deploying to any platform, you can add a custom domain like:
- `demo.ghanalands.gov.gh`
- `land-erp-demo.example.com`

Each platform has settings for custom domains in their dashboard.

---

## Demo Credentials

Share these with stakeholders:

| Role | Email | Password |
|------|-------|----------|
| Citizen | citizen@demo.com | demo123 |
| Surveyor | surveyor@demo.com | demo123 |
| Lands Officer | officer@demo.com | demo123 |
| Administrator | admin@demo.com | demo123 |

---

## Build Information

- **Build Size:** 372 KB (gzipped JS) + 10 KB (CSS)
- **Build Date:** November 2025
- **Node Version:** 16+
- **React Version:** 18

---

## Troubleshooting

### Blank page after deploy
Add to `package.json`:
```json
"homepage": "."
```
Then rebuild: `npm run build`

### Routes not working (404 on refresh)
Create `build/_redirects` file:
```
/*    /index.html   200
```

Or for Vercel, create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### API calls failing
The demo uses mock data and doesn't require a backend. All data is client-side.

---

## Sharing with Stakeholders

**Email Template:**

```
Subject: Ghana Land ERP Demo - Ready for Review

Dear [Stakeholder],

The Ghana National Land ERP demo is now available for your review at:
[YOUR DEPLOYMENT URL]

Login credentials:
- Citizen: citizen@demo.com / demo123
- Officer: officer@demo.com / demo123
- Admin: admin@demo.com / demo123

Please note this is a UI demonstration with mock data. Production implementation
will include real database connections, blockchain integration, and payment processing.

Documentation is available in the /docs folder of the project.

Best regards,
[Your Name]
```

---

## Local Testing Before Deploy

To test the build locally:

```bash
npm install -g serve
cd /Users/nikolay/github/ghana/ghana/standalone-demo
serve -s build
```

Opens at http://localhost:3000

---

## Next Steps After Deployment

1. Share URL with stakeholders
2. Collect feedback in a structured format
3. Schedule demo walkthrough sessions
4. Document feature requests and priorities
5. Plan production implementation phases
