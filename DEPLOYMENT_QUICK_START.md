# 🚀 Quick Start Deployment Guide

Deploy your Ghana Land ERP demo in **15 minutes** with these simple steps.

## Prerequisites
- GitHub account
- Credit/Debit card for verification (services are FREE, card is just for verification)

## Step 1: Push to GitHub (5 minutes)

```bash
cd /Users/nikolay/github/ghana/ghana

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ghana Land ERP Demo"

# Create GitHub repo at: https://github.com/new
# Name it: ghana-land-erp
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/ghana-land-erp.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render (5 minutes)

1. Go to: https://render.com/dashboard
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Select your `ghana-land-erp` repository
5. Configure:
   - **Name**: `ghana-erp-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Plan**: Free
6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `JWT_SECRET` = *Click "Generate"*
   - `JWT_EXPIRES_IN` = `7d`
7. Click **Create Web Service**
8. **Copy your backend URL** (e.g., `https://ghana-erp-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to: https://vercel.com/dashboard
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Select your `ghana-land-erp` repository
5. Configure:
   - **Framework**: Create React App (auto-detected)
   - **Root Directory**: `frontend`
   - Click **Edit** next to Root Directory and set to `frontend`
6. Add Environment Variable:
   - Name: `REACT_APP_API_URL`
   - Value: `https://YOUR-BACKEND-URL.onrender.com/api`
   - Replace `YOUR-BACKEND-URL` with your Render URL from Step 2
7. Click **Deploy**
8. **Copy your frontend URL** (e.g., `https://ghana-land-erp.vercel.app`)

## Step 4: Update CORS (2 minutes)

1. Go back to Render dashboard
2. Open your backend service
3. Go to **Environment** tab
4. Add/Update:
   - `CORS_ALLOWED_ORIGINS` = `https://YOUR-FRONTEND-URL.vercel.app`
   - Replace with your Vercel URL from Step 3
5. Click **Save Changes** (will auto-redeploy)

## Step 5: Test! (3 minutes)

1. Visit your Vercel URL
2. Login with: `kwame.nkrumah@example.com` / `password123`
3. Test features:
   - ✅ ChatBOT (bottom-right button)
   - ✅ GIS Demo → Draw tools
   - ✅ Parcels → Get Valuation
   - ✅ All navigation tabs

## 🎉 Done!

Share with stakeholders:
```
Demo URL: https://YOUR-FRONTEND-URL.vercel.app

Login:
- Email: kwame.nkrumah@example.com
- Password: password123
```

## Troubleshooting

**Problem**: "Failed to fetch" errors  
**Solution**: Wait 2-3 minutes for Render backend to finish deploying

**Problem**: CORS errors in console  
**Solution**: Double-check `CORS_ALLOWED_ORIGINS` matches your Vercel URL exactly

**Problem**: Backend slow on first load  
**Solution**: Normal! Free tier sleeps after 15min inactivity. First request wakes it up (30-60 sec)

---

For detailed instructions, see `DEPLOYMENT.md`
