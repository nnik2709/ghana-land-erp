# Deployment Guide - Ghana Land ERP Demo

## Recommended Hosting: Render.com (FREE)

Render.com offers a free tier that includes:
- Free static site hosting for React frontend
- Free web service for Node.js backend (750 hours/month)
- Automatic HTTPS
- Automatic deployments from Git
- Persistent disk for SQLite database

**Total Cost: $0/month** (on free tier)

---

## Prerequisites

1. GitHub account
2. Render.com account (sign up at https://render.com)
3. Push your code to GitHub

---

## Step 1: Prepare Code for Deployment

### 1.1 Update Backend Configuration

The backend is already configured to use environment variables. Ensure the following in `backend/src/server.js`:
- PORT defaults to 5001 but can be overridden
- CORS configured to accept frontend URL
- Database path can be customized

### 1.2 Update Frontend API URL

The frontend needs to point to the deployed backend URL. This will be configured through Render environment variables.

### 1.3 Push to GitHub

```bash
cd /path/to/ghana
git init
git add .
git commit -m "Prepare for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. Log in to Render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ghana-land-erp-backend`
   - **Region**: Choose closest to your target users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: `Free`

### 2.2 Add Environment Variables

In the Render dashboard, go to "Environment" and add:

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://ghana-land-erp-frontend.onrender.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

### 2.3 Add Persistent Disk (Important!)

1. In your web service, go to "Disks"
2. Click "Add Disk"
3. Configure:
   - **Name**: `data`
   - **Mount Path**: `/data`
   - **Size**: 1 GB (free tier)

4. Update `backend/src/database/init.js` to use `/data/ghana_land.db` in production:

```javascript
const dbPath = process.env.NODE_ENV === 'production'
  ? '/data/ghana_land.db'
  : path.join(__dirname, 'ghana_land.db');
```

### 2.4 Deploy

Click "Create Web Service" - Render will automatically deploy your backend.

**Your backend URL will be**: `https://ghana-land-erp-backend.onrender.com`

---

## Step 3: Deploy Frontend to Render

### 3.1 Create Static Site

1. Click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `ghana-land-erp-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### 3.2 Add Environment Variables

Add this environment variable:

```
REACT_APP_API_URL=https://ghana-land-erp-backend.onrender.com/api
```

### 3.3 Update Frontend API Configuration

The frontend `src/services/api.js` should use the environment variable:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
```

### 3.4 Deploy

Click "Create Static Site" - Render will build and deploy your frontend.

**Your frontend URL will be**: `https://ghana-land-erp-frontend.onrender.com`

---

## Step 4: Update CORS in Backend

Update `backend/src/server.js` CORS configuration to include your deployed frontend URL:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

Push this change to GitHub - Render will auto-redeploy.

---

## Alternative Hosting Options

### Option 2: Vercel (Frontend) + Render (Backend)

**Frontend on Vercel (FREE)**
- Unlimited bandwidth
- Automatic HTTPS
- Global CDN
- Deploy: `vercel --prod` from frontend directory

**Backend on Render (FREE)**
- Same as above

**Cost**: $0/month

### Option 3: Netlify (Frontend) + Railway (Backend)

**Frontend on Netlify (FREE)**
- 100 GB bandwidth/month
- Automatic HTTPS
- Deploy: drag & drop build folder

**Backend on Railway (FREE)**
- $5 free credit/month
- 500 hours execution time
- 512 MB RAM

**Cost**: $0/month (within free tier)

### Option 4: Fly.io (Full Stack)

**Fly.io (FREE tier)**
- Can host both frontend and backend
- 3 shared-cpu VMs
- 160 GB bandwidth/month

**Cost**: $0/month

---

## Important Notes for Free Tier

### Render Free Tier Limitations:
1. **Spins down after 15 minutes of inactivity** - first request after inactivity takes ~30 seconds
2. **750 hours/month** - enough for one service running 24/7
3. **512 MB RAM** - sufficient for this demo
4. **100 GB bandwidth/month** - more than enough

### Solutions for Spin-down Issue:
1. Use a free uptime monitor (e.g., UptimeRobot) to ping every 14 minutes
2. Add a note on login page: "First load may take 30 seconds (free tier limitation)"
3. Upgrade to paid tier ($7/month) for always-on service

---

## Post-Deployment Checklist

- [ ] Backend is accessible at https://your-backend.onrender.com/api/health
- [ ] Frontend loads at https://your-frontend.onrender.com
- [ ] Demo users can log in
- [ ] All API calls work (check browser console)
- [ ] Maps display correctly (check Leaflet CDN loads)
- [ ] Database persists between deploys (test by creating data, redeploying, checking data still exists)
- [ ] CORS is properly configured

---

## Monitoring & Maintenance

1. **Check Logs**: Render dashboard → Your Service → Logs
2. **Monitor Uptime**: Use UptimeRobot (free) to monitor both frontend and backend
3. **Update Dependencies**: Regularly update npm packages for security
4. **Backup Database**: Render allows SSH access to download SQLite file

---

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify environment variables are set
- Ensure Node version compatibility

### Frontend can't reach backend
- Check CORS configuration
- Verify REACT_APP_API_URL is correct
- Check browser console for errors

### Database resets on deploy
- Ensure persistent disk is properly mounted
- Check database path uses `/data/` directory
- Verify disk mount path is correct

### Maps not loading
- Check Leaflet CSS is included in index.html
- Verify OpenStreetMap tiles are accessible
- Check browser console for errors

---

## Custom Domain (Optional)

Both Render and Vercel support custom domains on free tier:
1. Purchase domain (e.g., from Namecheap, ~$10/year)
2. In Render/Vercel dashboard, add custom domain
3. Update DNS records as instructed
4. Automatic HTTPS certificate issued

Example: `demo.ghanalanderp.com`

---

## Estimated Costs Summary

| Option | Frontend | Backend | Total/Month |
|--------|----------|---------|-------------|
| Render Only | Free | Free | $0 |
| Vercel + Render | Free | Free | $0 |
| Netlify + Railway | Free | Free | $0 |
| Custom Domain | N/A | N/A | ~$1/month |
| Render Paid (Always-on) | Free | $7 | $7 |

**Recommended for Demo**: Render Free Tier with UptimeRobot ($0/month)
**Recommended for Production**: Render Paid + Custom Domain (~$8/month)
