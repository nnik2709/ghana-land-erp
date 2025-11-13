# Ghana Land ERP - Online Deployment Guide

**Version:** 1.0
**Date:** November 2025
**Target:** Production-ready online deployment

---

## Table of Contents

1. [Deployment Options](#deployment-options)
2. [Prerequisites](#prerequisites)
3. [Option 1: Heroku Deployment (Easiest)](#option-1-heroku-deployment)
4. [Option 2: Railway Deployment](#option-2-railway-deployment)
5. [Option 3: DigitalOcean App Platform](#option-3-digitalocean-app-platform)
6. [Option 4: AWS EC2 (Most Flexible)](#option-4-aws-ec2)
7. [Option 5: Docker + Any Cloud Provider](#option-5-docker-any-cloud-provider)
8. [Post-Deployment Configuration](#post-deployment-configuration)
9. [Domain Configuration](#domain-configuration)
10. [SSL/HTTPS Setup](#ssl-https-setup)
11. [Monitoring and Maintenance](#monitoring-and-maintenance)
12. [Troubleshooting](#troubleshooting)

---

## Deployment Options

| Platform | Difficulty | Cost | Best For | Deployment Time |
|----------|------------|------|----------|-----------------|
| **Heroku** | Easy | $16/month | Quick demos | 15 minutes |
| **Railway** | Easy | $5-10/month | Startups | 10 minutes |
| **DigitalOcean** | Medium | $12-20/month | Small-medium orgs | 20 minutes |
| **AWS EC2** | Hard | $20-50/month | Enterprise | 45+ minutes |
| **Docker** | Medium | Varies | Any environment | 30 minutes |

**Recommendation for Demo:** Railway or Heroku (fastest, easiest)
**Recommendation for Production:** AWS or DigitalOcean (more control)

---

## Prerequisites

Before starting any deployment, ensure you have:

- ✅ Git installed locally
- ✅ Node.js 18+ installed locally
- ✅ GitHub/GitLab account
- ✅ Credit card for cloud provider (even free tiers require it)
- ✅ Domain name (optional but recommended)
- ✅ Access to the Ghana Land ERP repository

### Pre-Deployment Checklist

1. **Test Locally**
```bash
cd /Users/nikolay/github/ghana/ghana/backend
npm install
node src/server.js  # Should start on port 5001

cd /Users/nikolay/github/ghana/ghana/frontend
npm install
npm run build  # Should complete without errors
```

2. **Push to Git Repository**
```bash
cd /Users/nikolay/github/ghana/ghana
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Option 1: Heroku Deployment (Easiest)

**Cost:** $7/month for backend, $7/month for frontend = ~$16/month total
**Time:** 15 minutes
**Difficulty:** ⭐ Easy

### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download installer from: https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Login to Heroku

```bash
heroku login
```

### Step 3: Deploy Backend

```bash
cd /Users/nikolay/github/ghana/ghana/backend

# Create Heroku app for backend
heroku create ghana-lands-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=5001
heroku config:set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
heroku config:set FRONTEND_URL=https://ghana-lands-frontend.herokuapp.com

# Create Procfile
echo "web: node src/server.js" > Procfile

# Deploy
git init
git add .
git commit -m "Deploy backend to Heroku"
heroku git:remote -a ghana-lands-backend
git push heroku main

# Check logs
heroku logs --tail
```

**Backend URL will be:** `https://ghana-lands-backend.herokuapp.com`

### Step 4: Deploy Frontend

```bash
cd /Users/nikolay/github/ghana/ghana/frontend

# Create Heroku app for frontend
heroku create ghana-lands-frontend

# Set environment variables
heroku config:set REACT_APP_API_URL=https://ghana-lands-backend.herokuapp.com/api

# Create static.json for serving React app
cat > static.json << EOF
{
  "root": "build/",
  "routes": {
    "/**": "index.html"
  },
  "proxies": {
    "/api/": {
      "origin": "https://ghana-lands-backend.herokuapp.com"
    }
  }
}
EOF

# Add buildpack for React
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static

# Deploy
git init
git add .
git commit -m "Deploy frontend to Heroku"
heroku git:remote -a ghana-lands-frontend
git push heroku main

# Open in browser
heroku open
```

**Frontend URL will be:** `https://ghana-lands-frontend.herokuapp.com`

### Step 5: Configure Database (Optional - Use PostgreSQL)

```bash
cd /Users/nikolay/github/ghana/ghana/backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Get database URL
heroku config:get DATABASE_URL

# Update backend code to use PostgreSQL instead of SQLite
# Install pg module
npm install pg

# Update src/database/init.js to use PostgreSQL
```

---

## Option 2: Railway Deployment

**Cost:** Free tier available, $5-10/month for production
**Time:** 10 minutes
**Difficulty:** ⭐ Very Easy

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### Step 2: Deploy Backend

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose the `ghana` repository
4. Click "Add variables" and set:
   ```
   NODE_ENV=production
   PORT=5001
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://ghana-lands-frontend.up.railway.app
   ```
5. Under "Settings":
   - Set Root Directory: `backend`
   - Set Start Command: `node src/server.js`
   - Enable "Public Domain"
6. Click "Deploy"

Railway will automatically:
- Install dependencies
- Start the server
- Generate a public URL like: `https://ghana-lands-backend.up.railway.app`

### Step 3: Deploy Frontend

1. In same project, click "New Service"
2. Select "Deploy from GitHub repo"
3. Choose the `ghana` repository again
4. Click "Add variables" and set:
   ```
   REACT_APP_API_URL=https://ghana-lands-backend.up.railway.app/api
   ```
5. Under "Settings":
   - Set Root Directory: `frontend`
   - Set Build Command: `npm run build`
   - Set Start Command: `npx serve -s build -l $PORT`
   - Enable "Public Domain"
6. Click "Deploy"

**Done!** Both services will be live in ~5 minutes.

---

## Option 3: DigitalOcean App Platform

**Cost:** $12-20/month
**Time:** 20 minutes
**Difficulty:** ⭐⭐ Medium

### Step 1: Create DigitalOcean Account

1. Go to https://cloud.digitalocean.com
2. Sign up and verify account
3. Add payment method

### Step 2: Create App

1. Click "Create" → "Apps"
2. Choose "GitHub" as source
3. Authorize DigitalOcean and select repository
4. Configure app:

**Backend Component:**
```yaml
Name: ghana-lands-backend
Source Directory: /backend
Run Command: node src/server.js
HTTP Port: 5001
Environment Variables:
  - NODE_ENV=production
  - JWT_SECRET=your-super-secret-jwt-key
  - FRONTEND_URL=${frontend.PUBLIC_URL}
```

**Frontend Component:**
```yaml
Name: ghana-lands-frontend
Source Directory: /frontend
Build Command: npm run build
Output Directory: build
Environment Variables:
  - REACT_APP_API_URL=${backend.PUBLIC_URL}/api
```

5. Choose plan: Basic ($12/month) or Professional ($20/month)
6. Click "Create Resources"

DigitalOcean will:
- Build both components
- Deploy to CDN
- Generate URLs
- Auto-deploy on Git push

**URLs will be:**
- Backend: `https://ghana-lands-backend-xxxxx.ondigitalocean.app`
- Frontend: `https://ghana-lands-frontend-xxxxx.ondigitalocean.app`

---

## Option 4: AWS EC2 (Most Flexible)

**Cost:** $20-50/month (t2.medium instance)
**Time:** 45+ minutes
**Difficulty:** ⭐⭐⭐ Hard

### Step 1: Launch EC2 Instance

1. Go to https://console.aws.amazon.com/ec2
2. Click "Launch Instance"
3. Configure:
   - **Name:** ghana-lands-server
   - **AMI:** Ubuntu Server 22.04 LTS
   - **Instance Type:** t2.medium (2 vCPU, 4 GB RAM)
   - **Key pair:** Create new or use existing
   - **Security Group:** Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000, 5001
4. Click "Launch Instance"
5. Note the Public IP address

### Step 2: Connect to Instance

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 3: Clone and Setup Application

```bash
# Clone repository
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/ghana.git
cd ghana

# Setup backend
cd backend
npm install
cp .env.example .env
nano .env  # Edit environment variables

# Start backend with PM2
pm2 start src/server.js --name ghana-backend
pm2 save
pm2 startup  # Follow instructions to enable auto-start

# Setup frontend
cd ../frontend
npm install
npm run build
```

### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/ghana-lands
```

Add configuration:
```nginx
# Backend API
server {
    listen 80;
    server_name api.ghanalalands.com;  # Use your domain

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name ghanalalands.com www.ghanalalands.com;  # Use your domain

    root /home/ubuntu/ghana/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ghana-lands /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d ghanalalands.com -d www.ghanalalands.com -d api.ghanalalands.com

# Auto-renewal is setup automatically
sudo certbot renew --dry-run
```

---

## Option 5: Docker + Any Cloud Provider

**Cost:** Varies by provider
**Time:** 30 minutes
**Difficulty:** ⭐⭐ Medium

### Step 1: Create Dockerfiles

**Backend Dockerfile:**
```bash
cd /Users/nikolay/github/ghana/ghana/backend
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5001

CMD ["node", "src/server.js"]
EOF
```

**Frontend Dockerfile:**
```bash
cd /Users/nikolay/github/ghana/ghana/frontend
cat > Dockerfile << 'EOF'
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF
```

**Frontend Nginx Config:**
```bash
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
```

### Step 2: Create Docker Compose

```bash
cd /Users/nikolay/github/ghana/ghana
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - PORT=5001
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=http://localhost:3000
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5001/api
    depends_on:
      - backend
    restart: unless-stopped
EOF
```

### Step 3: Build and Test Locally

```bash
cd /Users/nikolay/github/ghana/ghana

# Build images
docker-compose build

# Start containers
docker-compose up -d

# Check logs
docker-compose logs -f

# Test
open http://localhost:3000
```

### Step 4: Deploy to Cloud

**Option A: Push to Docker Hub and deploy anywhere**
```bash
# Login to Docker Hub
docker login

# Tag images
docker tag ghana_backend:latest YOUR_USERNAME/ghana-backend:latest
docker tag ghana_frontend:latest YOUR_USERNAME/ghana-frontend:latest

# Push images
docker push YOUR_USERNAME/ghana-backend:latest
docker push YOUR_USERNAME/ghana-frontend:latest

# On cloud server, pull and run
docker pull YOUR_USERNAME/ghana-backend:latest
docker pull YOUR_USERNAME/ghana-frontend:latest
docker-compose up -d
```

**Option B: Deploy to AWS ECS**
1. Create ECR repositories
2. Push images to ECR
3. Create ECS cluster
4. Create task definitions
5. Create services

**Option C: Deploy to Google Cloud Run**
```bash
# Install gcloud CLI
# Authenticate
gcloud auth login

# Deploy backend
gcloud run deploy ghana-backend \
  --source ./backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy frontend
gcloud run deploy ghana-frontend \
  --source ./frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Post-Deployment Configuration

### 1. Update Environment Variables

After deployment, update these critical values:

**Backend `.env`:**
```bash
NODE_ENV=production
PORT=5001
JWT_SECRET=GENERATE_A_STRONG_SECRET_HERE_32_CHARS_MIN
FRONTEND_URL=https://your-frontend-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
DATABASE_URL=your-database-connection-string  # If using PostgreSQL
```

**Frontend `.env`:**
```bash
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### 2. Initialize Database

If using PostgreSQL instead of SQLite:

```bash
# Connect to your deployed backend
ssh into-server  # or use cloud shell

# Run database migrations
cd /path/to/backend
npm run migrate  # If you have migrations

# Or manually initialize
node -e "require('./src/database/init').initDatabase()"
```

### 3. Test All Features

**Checklist:**
- [ ] Login with all 4 demo users works
- [ ] Maps load correctly
- [ ] Can submit surveys
- [ ] Can create applications
- [ ] Payment processing works
- [ ] Blockchain verification works
- [ ] All navigation tabs functional
- [ ] Mobile responsive design works
- [ ] HTTPS certificate valid
- [ ] CORS configured correctly

### 4. Configure CORS

Ensure backend CORS is properly set:

```javascript
// backend/src/server.js
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com'
  ],
  credentials: true
}));
```

---

## Domain Configuration

### Option A: Use Custom Domain

1. **Purchase domain** (e.g., from Namecheap, GoDaddy)
   - Recommended: `ghanalalands.gov.gh` (if government)
   - Or: `ghanalalands.com`

2. **Configure DNS records:**

**For Heroku:**
```
CNAME   www       ghana-lands-frontend.herokuapp.com
CNAME   api       ghana-lands-backend.herokuapp.com
```

**For Railway:**
```
CNAME   www       ghana-lands-frontend.up.railway.app
CNAME   api       ghana-lands-backend.up.railway.app
```

**For AWS/DigitalOcean:**
```
A       @         YOUR_SERVER_IP
A       www       YOUR_SERVER_IP
A       api       YOUR_SERVER_IP
```

3. **Update platform to use custom domain**

**Heroku:**
```bash
heroku domains:add www.ghanalalands.com -a ghana-lands-frontend
heroku domains:add api.ghanalalands.com -a ghana-lands-backend
```

**Railway:**
- Go to Settings → Networking → Custom Domain
- Add `www.ghanalalands.com` and `api.ghanalalands.com`

### Option B: Use Platform Subdomains

Keep platform-provided URLs:
- Frontend: `https://ghana-lands.railway.app`
- Backend: `https://ghana-lands-api.railway.app`

---

## SSL/HTTPS Setup

### Automatic SSL (Recommended)

Most modern platforms provide automatic SSL:

**Heroku:** Automatic SSL on paid dynos
**Railway:** Automatic SSL included
**DigitalOcean App Platform:** Automatic SSL included
**Netlify/Vercel:** Automatic SSL included

### Manual SSL (AWS EC2, VPS)

Use Let's Encrypt (free):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d ghanalalands.com -d www.ghanalalands.com -d api.ghanalalands.com

# Auto-renewal (runs twice daily)
sudo systemctl status certbot.timer
```

Certificate will auto-renew every 90 days.

---

## Monitoring and Maintenance

### 1. Setup Uptime Monitoring

**Free options:**
- UptimeRobot (https://uptimerobot.com) - Free for 50 monitors
- Pingdom (https://pingdom.com) - 14-day trial
- StatusCake (https://www.statuscake.com) - Free tier

**Monitor these endpoints:**
- `https://your-frontend.com` (should return 200)
- `https://your-api.com/health` (should return 200)

### 2. Setup Error Tracking

**Sentry (Recommended):**
```bash
# Install Sentry
cd backend
npm install @sentry/node

cd ../frontend
npm install @sentry/react
```

**Configure backend:**
```javascript
// backend/src/server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV
});

// Error handler middleware
app.use(Sentry.Handlers.errorHandler());
```

**Configure frontend:**
```javascript
// frontend/src/index.js
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV
});
```

### 3. Setup Logging

**For Railway/Heroku:**
- Use platform's built-in logs
- `railway logs` or `heroku logs --tail`

**For AWS/DigitalOcean:**
- Install winston for structured logging
- Forward logs to CloudWatch or Papertrail

### 4. Database Backups

**For SQLite (demo):**
```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /path/to/lands.db /path/to/backups/lands_$DATE.db

# Run daily via cron
0 2 * * * /path/to/backup.sh
```

**For PostgreSQL (production):**
```bash
# Backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20251113.sql
```

### 5. Performance Monitoring

**Add simple analytics:**

**Frontend - Google Analytics or Plausible:**
```javascript
// frontend/public/index.html
<script defer data-domain="ghanalalands.com" src="https://plausible.io/js/script.js"></script>
```

**Backend - Express middleware:**
```javascript
// backend/src/server.js
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Application Error" or 500 errors

**Cause:** Backend crash or misconfiguration

**Solution:**
```bash
# Check logs
heroku logs --tail -a ghana-lands-backend
# or
railway logs

# Common fixes:
# 1. Check environment variables are set
# 2. Verify PORT is correct
# 3. Check database connection
# 4. Review error stack trace
```

#### Issue 2: Frontend loads but API calls fail (CORS errors)

**Cause:** CORS misconfiguration

**Solution:**
```javascript
// backend/src/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Also check FRONTEND_URL environment variable matches
```

#### Issue 3: Maps not loading

**Cause:** API URL misconfigured

**Solution:**
```bash
# Check frontend environment variable
echo $REACT_APP_API_URL

# Should be: https://your-backend-url.com/api
# NOT: https://your-backend-url.com/api/ (no trailing slash)

# Rebuild frontend if changed
npm run build
```

#### Issue 4: Login not working / JWT errors

**Cause:** JWT_SECRET not set or inconsistent

**Solution:**
```bash
# Generate strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set in backend
heroku config:set JWT_SECRET=generated_secret_here
# or
railway variables set JWT_SECRET=generated_secret_here

# Restart backend
heroku restart -a ghana-lands-backend
```

#### Issue 5: Slow performance

**Causes and solutions:**
1. **Small instance size** → Upgrade to larger plan
2. **No caching** → Add Redis caching layer
3. **Large database** → Add database indexes
4. **No CDN** → Use Cloudflare or CloudFront
5. **Unoptimized images** → Compress and use WebP

#### Issue 6: Build failures

**Cause:** Dependency issues or build script errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check Node version matches
node --version  # Should be 18+

# Test build locally
npm run build

# If still failing, check build logs for specific error
```

#### Issue 7: Database connection errors

**Cause:** Database URL incorrect or database not accessible

**Solution:**
```bash
# For PostgreSQL
# Check DATABASE_URL format:
# postgresql://user:password@host:5432/database

# Test connection
psql $DATABASE_URL

# For SQLite
# Ensure file path is writable
ls -la lands.db
```

---

## Production Checklist

Before going live with real users:

### Security
- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers (helmet.js)
- [ ] Run security audit: `npm audit`
- [ ] Implement brute force protection
- [ ] Set up Web Application Firewall (WAF)

### Performance
- [ ] Enable compression (gzip)
- [ ] Set up CDN for static assets
- [ ] Add database indexes
- [ ] Implement caching (Redis)
- [ ] Optimize images
- [ ] Minify JavaScript/CSS
- [ ] Enable HTTP/2

### Monitoring
- [ ] Setup uptime monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Enable application logging
- [ ] Setup alerts for downtime
- [ ] Configure performance monitoring
- [ ] Create status page

### Backup & Recovery
- [ ] Automated daily database backups
- [ ] Test restore procedure
- [ ] Document disaster recovery plan
- [ ] Set up redundancy (multiple servers)
- [ ] Enable auto-scaling

### Compliance
- [ ] Data privacy policy
- [ ] Terms of service
- [ ] Cookie consent (if applicable)
- [ ] Accessibility compliance (WCAG)
- [ ] Security audit report

### Documentation
- [ ] API documentation
- [ ] User guides
- [ ] Admin manual
- [ ] Deployment runbook
- [ ] Incident response plan

---

## Cost Estimates

### Monthly Hosting Costs

**Minimal (Demo/Testing):**
- Railway Free Tier: $0
- Custom domain: $12/year (~$1/month)
- **Total: ~$1/month**

**Small Scale (100-1000 users):**
- Railway Pro: $10/month
- PostgreSQL database: $7/month
- Custom domain: $12/year
- **Total: ~$18/month**

**Medium Scale (1000-10,000 users):**
- DigitalOcean App Platform: $20/month
- Managed PostgreSQL: $15/month
- CDN (Cloudflare): Free-$20/month
- Custom domain: $12/year
- Monitoring (Sentry): $26/month
- **Total: ~$82/month**

**Large Scale (10,000+ users):**
- AWS EC2 (t2.large x2): $140/month
- RDS PostgreSQL: $30/month
- CloudFront CDN: $50/month
- Route 53 DNS: $1/month
- CloudWatch: $10/month
- Backups: $20/month
- **Total: ~$251/month**

---

## Support

For deployment assistance:
- GitHub Issues: [Repository URL]
- Email: support@ghanalalands.com
- Documentation: https://docs.ghanalalands.com

---

## Quick Start Recommendation

**For immediate online demo (choose one):**

### Railway (Recommended - Easiest)
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to railway.app
# 3. Connect GitHub repo
# 4. Deploy both backend and frontend
# 5. Share URLs with stakeholders
```

**Time: 10 minutes**

### Heroku (More mature platform)
```bash
heroku create ghana-lands-backend
cd backend && git push heroku main

heroku create ghana-lands-frontend
cd frontend && git push heroku main
```

**Time: 15 minutes**

Both provide instant HTTPS URLs you can share immediately for stakeholder demos.

---

**End of Deployment Guide**

*Last updated: November 2025*
