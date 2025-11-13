# Quick Deployment Guide

## Deploy to Render.com in 5 Minutes

### Prerequisites
- GitHub account
- Render.com account (free signup at https://render.com)

---

## Step 1: Push Code to GitHub

```bash
cd ghana
git init
git add .
git commit -m "Initial commit - Ghana Land ERP Demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ghana-land-erp.git
git push -u origin main
```

---

## Step 2: Deploy on Render (Using render.yaml)

### Option A: Blueprint Deployment (Easiest)

1. Go to https://render.com/dashboard
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` and show:
   - Backend service
   - Frontend service
5. Click "Apply"
6. Set environment variables:
   - **Backend**:
     - `FRONTEND_URL`: (will update after frontend deploys)
     - `JWT_SECRET`: Click "Generate" for random secret
   - **Frontend**:
     - `REACT_APP_API_URL`: (will update after backend deploys)
7. Click "Create Services"

### Step 3: Update Environment Variables (After Initial Deploy)

Once both services deploy:

1. Get your backend URL: `https://ghana-land-erp-backend.onrender.com`
2. Get your frontend URL: `https://ghana-land-erp-frontend.onrender.com`

3. Update backend environment variables:
   - `FRONTEND_URL` = `https://ghana-land-erp-frontend.onrender.com`

4. Update frontend environment variables:
   - `REACT_APP_API_URL` = `https://ghana-land-erp-backend.onrender.com/api`

5. Services will auto-redeploy with new settings

---

## Option B: Manual Deployment

### Deploy Backend

1. **Create Web Service**
   - New + → Web Service
   - Connect GitHub repo
   - Name: `ghana-land-erp-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
   - Instance Type: Free

2. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://YOUR-FRONTEND-URL.onrender.com
   JWT_SECRET=your-secret-key-here
   ```

3. **Add Disk**
   - Go to Disks tab
   - Add Disk
   - Name: `data`
   - Mount Path: `/data`
   - Size: 1 GB

4. **Deploy**

### Deploy Frontend

1. **Create Static Site**
   - New + → Static Site
   - Connect same GitHub repo
   - Name: `ghana-land-erp-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

2. **Add Environment Variable**
   ```
   REACT_APP_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
   ```

3. **Deploy**

---

## Step 4: Verify Deployment

1. Visit your frontend URL
2. You should see the login page
3. Try logging in with demo credentials:
   - Username: `kofi_mensah`
   - Password: `demo123`
4. Test features:
   - View parcels
   - Check map displays
   - Navigate to different pages

---

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify environment variables are set
- Ensure disk is mounted at `/data`

### Frontend can't connect to backend
- Check browser console for errors
- Verify `REACT_APP_API_URL` is correct
- Check backend CORS settings include frontend URL

### Maps not loading
- Ensure internet connection
- Check browser console for Leaflet errors
- Verify OpenStreetMap tiles accessible

### Database resets on deploy
- Confirm disk is properly mounted
- Check disk mount path is `/data`
- Verify `NODE_ENV=production` is set

---

## Free Tier Limitations

### What to Expect:
- **Spin-down**: Services sleep after 15 minutes of inactivity
- **Cold start**: First request after sleep takes 30-60 seconds
- **Uptime**: 750 hours/month per service (enough for 24/7)

### Solutions:
1. **Add note on login page**: "First load may take up to 60 seconds"
2. **Use uptime monitor**: UptimeRobot (free) pings every 5 minutes
3. **Upgrade to paid**: $7/month for always-on service

---

## Next Steps

1. **Add Custom Domain** (Optional)
   - Purchase domain (~$10/year)
   - Add in Render dashboard
   - Update DNS records
   - Automatic HTTPS

2. **Setup Monitoring**
   - UptimeRobot for uptime monitoring
   - Render provides basic metrics
   - Check logs regularly

3. **Backup Database**
   - SSH into service
   - Download `/data/land-erp.db`
   - Store securely
   - Schedule regular backups

---

## Cost Estimate

| Item | Cost |
|------|------|
| Render Backend (Free Tier) | $0/month |
| Render Frontend (Free Tier) | $0/month |
| Custom Domain (Optional) | ~$1/month |
| Uptime Monitor (UptimeRobot) | $0/month |
| **Total** | **$0-1/month** |

---

## URLs After Deployment

**Your Demo Will Be Available At:**
- Frontend: `https://ghana-land-erp-frontend.onrender.com`
- Backend API: `https://ghana-land-erp-backend.onrender.com/api`

**Share With:**
- Stakeholders
- Potential clients
- Team members
- Demo purposes

---

## Support

For detailed deployment information, see: `DEPLOYMENT.md`
For user guide and workflows, see: `USER_GUIDE.md`
For technical documentation, see: `README.md`
