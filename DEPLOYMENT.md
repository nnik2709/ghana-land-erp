# Ghana Land ERP System - Deployment Guide

This guide will help you deploy the Ghana Land ERP demo online so stakeholders can access it remotely.

## 📋 Architecture Overview

- **Frontend**: React app deployed on **Vercel** (free tier)
- **Backend**: Node.js/Express API deployed on **Render** (free tier)
- **Database**: SQLite (in-memory for demo purposes)

## 🚀 Quick Deployment (15 minutes)

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)

---

## STEP 1: Prepare Your Code Repository

### 1.1 Initialize Git Repository (if not already done)
```bash
cd /Users/nikolay/github/ghana/ghana
git init
git add .
git commit -m "Initial commit - Ghana Land ERP Demo"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository: `ghana-land-erp`
3. **Do NOT** initialize with README (we already have code)
4. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/ghana-land-erp.git
git branch -M main
git push -u origin main
```

---

## STEP 2: Deploy Backend to Render

### 2.1 Deploy from GitHub
1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository `ghana-land-erp`
4. Configure the service:

**Basic Settings:**
- **Name**: `ghana-land-erp-backend`
- **Region**: Choose closest to Ghana (e.g., `Frankfurt (EU Central)`)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js`

**Plan:**
- Select **"Free"** plan

### 2.2 Configure Environment Variables
In the Render dashboard, add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | *Click "Generate" to auto-generate* |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ALLOWED_ORIGINS` | *Leave blank for now, will update after frontend deployment* |

### 2.3 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll get a URL like: `https://ghana-land-erp-backend.onrender.com`
4. **Copy this URL** - you'll need it for frontend deployment

### 2.4 Test Backend
Visit: `https://YOUR-BACKEND-URL.onrender.com/health`

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-11-14T...",
  "service": "Ghana Land ERP API",
  "version": "1.0.0"
}
```

---

## STEP 3: Deploy Frontend to Vercel

### 3.1 Deploy from GitHub
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `ghana-land-erp`
4. Configure the project:

**Framework Preset:**
- Vercel will auto-detect **"Create React App"** ✅

**Root Directory:**
- Click **"Edit"** and set to: `frontend`

**Build Settings:**
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3.2 Configure Environment Variables
Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `REACT_APP_API_URL` | `https://YOUR-BACKEND-URL.onrender.com/api` |

Replace `YOUR-BACKEND-URL` with your actual Render backend URL from Step 2.3

### 3.3 Deploy
1. Click **"Deploy"**
2. Wait 2-5 minutes for deployment
3. You'll get a URL like: `https://ghana-land-erp.vercel.app`
4. **Copy this URL**

---

## STEP 4: Update CORS Configuration

Now that you have your frontend URL, update the backend CORS settings:

### 4.1 Update Backend Environment Variables
1. Go to your Render dashboard
2. Navigate to your backend service
3. Go to **"Environment"** tab
4. Update `CORS_ALLOWED_ORIGINS`:
   ```
   https://YOUR-FRONTEND-URL.vercel.app
   ```
   Replace with your actual Vercel URL from Step 3.3

5. Click **"Save Changes"**
6. Render will automatically redeploy (takes 2-3 minutes)

---

## STEP 5: Test Your Deployment

### 5.1 Open Your Demo Site
Visit: `https://YOUR-FRONTEND-URL.vercel.app`

### 5.2 Test Login
Use demo credentials:
- **Citizen**: `kofi.mensah@example.com` / `password123`
- **Admin**: `kwame.nkrumah@example.com` / `password123`

### 5.3 Test All Features
- ✅ ChatBOT widget (bottom-right)
- ✅ Property Valuation (Parcels → Get Valuation)
- ✅ GIS Demo with drawing tools
- ✅ Blockchain verification
- ✅ Payment history
- ✅ All navigation tabs

---

## 📱 Share With Stakeholders

### Demo URL:
```
https://YOUR-FRONTEND-URL.vercel.app
```

### Login Credentials:

**Citizen Role:**
- Email: `kofi.mensah@example.com`
- Password: `password123`

**Surveyor Role:**
- Email: `ama.adjei@example.com`
- Password: `password123`

**Officer Role:**
- Email: `abena.osei@example.com`
- Password: `password123`

**Admin Role:**
- Email: `kwame.nkrumah@example.com`
- Password: `password123`

### Email Template for Stakeholders:

```
Subject: Ghana Land ERP System - Live Demo Available

Dear [Stakeholder Name],

I'm pleased to share a live demonstration of the Ghana Land ERP System. You can now access the demo online without any installation:

🌐 Demo URL: https://YOUR-FRONTEND-URL.vercel.app

📋 Login Credentials:
- Email: kwame.nkrumah@example.com
- Password: password123

This demo showcases:
✅ AI-powered ChatBOT assistant (click green button in bottom-right)
✅ Property valuation with blockchain verification
✅ Interactive GIS mapping with drawing tools
✅ Multi-role access control
✅ Clean Scandinavian design

Please explore the system and provide your feedback. All features from the proposal are implemented and functional.

Best regards,
[Your Name]
```

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch" or CORS errors
**Solution**: 
1. Check backend is running: Visit `https://YOUR-BACKEND-URL.onrender.com/health`
2. Verify CORS_ALLOWED_ORIGINS includes your Vercel URL
3. Wait 2-3 minutes after updating environment variables for redeployment

### Issue: Render backend shows "Service Unavailable"
**Solution**:
- Free tier services on Render sleep after 15 minutes of inactivity
- First request may take 30-60 seconds to wake up
- Subsequent requests will be fast

### Issue: Map tiles not loading in GIS Demo
**Solution**:
- This is normal - OpenStreetMap and satellite tiles work fine in production
- Try switching between Satellite/Street/Terrain views

### Issue: Login fails
**Solution**:
1. Check browser console (F12) for errors
2. Verify `REACT_APP_API_URL` points to your backend `/api` endpoint
3. Ensure backend health check passes

---

## 💰 Cost Breakdown

### Current Setup (100% FREE):
- **Vercel Free Tier**: 
  - 100GB bandwidth/month
  - Unlimited deployments
  - Custom domains supported
  
- **Render Free Tier**:
  - 750 hours/month (sufficient for demos)
  - Sleeps after 15 min inactivity
  - Wakes up automatically on request

### Upgrade Options (if needed for production):

**Render Starter ($7/month):**
- Always-on (no sleep)
- 400GB bandwidth
- Better for production use

**Vercel Pro ($20/month):**
- Priority support
- Enhanced analytics
- More build minutes

**Total Production Cost**: ~$27/month (vs Paycode's recurring costs)

---

## 🔄 Updating Your Deployment

### To deploy new changes:

```bash
# Make your code changes
git add .
git commit -m "Description of changes"
git push origin main
```

Both Vercel and Render will **automatically redeploy** within 2-5 minutes.

---

## 🛡️ Security Considerations

For production deployment (not demo):

1. **Change JWT_SECRET**: Use a strong random secret
2. **Enable HTTPS only**: Both Vercel and Render provide free SSL
3. **Rate limiting**: Already configured in backend (100 req/15min in production)
4. **Environment variables**: Never commit `.env` files to Git
5. **Database**: Migrate from SQLite to PostgreSQL for production
6. **Authentication**: Consider adding password reset, 2FA
7. **Monitoring**: Set up error tracking (Sentry, LogRocket)

---

## 📞 Support

If you encounter any deployment issues:

1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Logs
3. Review browser console errors (F12 → Console tab)

---

## ✅ Deployment Checklist

Before sharing with stakeholders:

- [ ] Backend deployed and health check passes
- [ ] Frontend deployed and loads correctly
- [ ] CORS configured properly (no console errors)
- [ ] All 4 user roles can log in
- [ ] ChatBOT widget appears and responds
- [ ] Property valuation modal works
- [ ] GIS Demo map loads with drawing tools
- [ ] Blockchain verification displays
- [ ] Payment history shows
- [ ] All navigation tabs accessible
- [ ] Mobile responsive (test on phone)

---

## 🎯 Next Steps After Stakeholder Review

1. Gather stakeholder feedback
2. Make requested changes
3. Deploy updates (automatic via Git push)
4. Schedule follow-up demo
5. Prepare production deployment plan if approved

---

**Deployment Prepared By**: Ghana Land ERP Development Team  
**Last Updated**: November 14, 2024  
**Version**: 1.0

**Questions?** Review this guide or contact your development team.
