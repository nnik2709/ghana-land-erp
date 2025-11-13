# 🚀 Ghana Land ERP Demo - Deployment Guide

## ✅ Project Status

**Status:** ✨ COMPLETE AND READY TO DEPLOY
**Files Created:** 30+ files
**Demo Users:** 4 (Citizen, Surveyor, Officer, Admin)
**Features:** Full-stack application with blockchain, payments, and integrations

---

## 📦 What's Included

### Backend (Node.js + Express)
- ✅ REST API with 8 route modules
- ✅ SQLite database with auto-initialization
- ✅ JWT authentication & authorization
- ✅ Mock blockchain service (Hyperledger Fabric simulation)
- ✅ Mock payment integration (Mobile Money)
- ✅ Mock external integrations (GELIS, GRA, OASL)
- ✅ Complete CRUD for parcels, surveys, titles, payments
- ✅ Admin dashboard with statistics

### Frontend (React + Material-UI)
- ✅ Multi-portal application (Citizen, Surveyor, Admin)
- ✅ Ghana-themed design (Green, Yellow, Red colors)
- ✅ Responsive UI with Material-UI components
- ✅ Protected routes with role-based access
- ✅ Interactive dashboards
- ✅ Login page with demo credentials display
- ✅ Real-time data from backend API

### Deployment
- ✅ Docker Compose configuration
- ✅ Individual Dockerfiles for backend & frontend
- ✅ Production-ready configurations
- ✅ Health checks and restart policies

---

## 🏃 Quick Start (Local Development)

### Option 1: npm (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd /Users/nikolay/Library/CloudStorage/OneDrive-EywaSystems/ghana/land-erp-demo/backend
npm install
npm start
```
Backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd /Users/nikolay/Library/CloudStorage/OneDrive-EywaSystems/ghana/land-erp-demo/frontend
npm install
npm start
```
Frontend will run on http://localhost:3000

### Option 2: Docker (Recommended for Production)

```bash
cd /Users/nikolay/Library/CloudStorage/OneDrive-EywaSystems/ghana/land-erp-demo
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## 👤 Demo Users

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Citizen** | `citizen` | `demo123` | View parcels, apply for titles, make payments |
| **Surveyor** | `surveyor` | `demo123` | Submit surveys, upload coordinates, view submissions |
| **Lands Officer** | `officer` | `demo123` | Review applications, approve titles, manage workflows |
| **Administrator** | `admin` | `demo123` | Full access - manage users, view analytics, integrations |

---

## 🌐 Online Deployment Options

### Option A: Heroku (Free Tier Available)

**Backend Deployment:**
```bash
cd backend
heroku create ghana-land-erp-api
echo "web: node src/server.js" > Procfile
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a ghana-land-erp-api
git push heroku main
```

**Frontend Deployment (Vercel):**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

Update `frontend/.env`:
```
REACT_APP_API_URL=https://ghana-land-erp-api.herokuapp.com/api
```

### Option B: Railway (Easiest)

1. Push code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Select both `backend` and `frontend`
5. Railway will auto-detect and deploy both
6. Set environment variables in Railway dashboard

### Option C: DigitalOcean App Platform

1. Connect GitHub repository
2. Select `backend` folder as Node.js app
3. Select `frontend` folder as Static Site
4. Configure environment variables
5. Deploy

### Option D: AWS (Most Scalable)

**Using AWS Elastic Beanstalk:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy backend
cd backend
eb init -p node.js ghana-land-erp-api
eb create ghana-land-erp-env
eb deploy

# Deploy frontend to S3 + CloudFront
cd ../frontend
npm run build
aws s3 sync build/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## 🔧 Configuration

### Backend Environment Variables
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables
Create `frontend/.env`:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

---

## 🧪 Testing the Demo

### 1. Login as Citizen
```
Username: citizen
Password: demo123
```
**Test Cases:**
- View dashboard with owned parcels
- Check application status
- View payment history
- Explore blockchain verification

### 2. Login as Surveyor
```
Username: surveyor
Password: demo123
```
**Test Cases:**
- View submitted surveys
- Check approval status
- Submit new survey (UI available)

### 3. Login as Admin
```
Username: admin
Password: demo123
```
**Test Cases:**
- View system statistics
- Browse all parcels
- Check blockchain transactions
- Test external integrations
- View payment reconciliation

---

## 📡 API Endpoints Testing

### Using curl:

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"citizen","password":"demo123"}'

# Get parcels (with token)
curl http://localhost:5000/api/parcels \
  -H "Authorization: Bearer YOUR_TOKEN"

# Blockchain transactions
curl http://localhost:5000/api/blockchain/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"

# Mobile Money payment (mock)
curl -X POST http://localhost:5000/api/integrations/momo/pay \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":500,"phone_number":"0244123456","provider":"MTN"}'
```

### Using Postman:
1. Import collection from `postman_collection.json` (create if needed)
2. Set environment variable `API_URL` to `http://localhost:5000/api`
3. Login to get token
4. Test all endpoints

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000
kill -9 PID_IF_NEEDED

# Reinitialize database
cd backend
rm -rf data/
npm start
```

### Frontend can't connect
1. Verify backend is running: http://localhost:5000/health
2. Check CORS settings in `backend/src/server.js`
3. Verify `.env` has correct API_URL

### Docker issues
```bash
# Clean everything
docker-compose down -v
docker system prune -a

# Rebuild from scratch
docker-compose up --build --force-recreate
```

### Database issues
```bash
cd backend
rm data/land-erp.db
npm start  # Will auto-recreate with demo data
```

---

## 📊 Features Demonstration

### 1. Blockchain Integration
- Navigate to http://localhost:3000/blockchain
- View all blockchain transactions
- See token minting events
- Verify land ownership via blockchain

### 2. Payment Processing
- Navigate to http://localhost:3000/payments
- View payment history
- Simulate Mobile Money payment
- Check payment reconciliation

### 3. External Integrations
- Navigate to http://localhost:3000/integrations
- Test GELIS sync
- Test Mobile Money payment
- Calculate GRA stamp duty
- View integration logs

### 4. GIS/Mapping (Future Enhancement)
- Parcel coordinates stored in database
- Ready for Leaflet/OpenLayers integration
- Geometry data available via API

---

## 🔐 Security Notes

**⚠️ This is a DEMO application. Before production:**

1. Change JWT_SECRET to a strong random string (min 32 chars)
2. Enable HTTPS/TLS
3. Implement rate limiting per user
4. Add input validation and sanitization
5. Enable SQL injection protection (already using parameterized queries)
6. Add CSRF protection
7. Implement proper password reset flow
8. Add email/SMS verification
9. Enable audit logging
10. Set up monitoring and alerting

---

## 📈 Performance Optimization

### For Production:

**Backend:**
- Add Redis for caching
- Implement connection pooling
- Enable gzip compression
- Add CDN for static assets

**Frontend:**
- Enable code splitting
- Implement lazy loading
- Add service worker for PWA
- Optimize images

**Database:**
- Add indexes for frequently queried fields
- Implement database connection pooling
- Consider PostgreSQL for production

---

## 🎯 Next Steps After Demo

1. ✅ **Test all features** with demo users
2. ✅ **Present to stakeholders**
3. 🔄 **Gather feedback**
4. 🔄 **Integrate real blockchain** (Hyperledger Fabric)
5. 🔄 **Connect real Mobile Money APIs**
6. 🔄 **Add biometric authentication**
7. 🔄 **Implement GIS mapping features**
8. 🔄 **Build React Native mobile app**
9. 🔄 **Add email/SMS notifications**
10. 🔄 **Production deployment**

---

## 📞 Support

For demo issues or questions:
- Check `README.md` for detailed documentation
- Review API endpoints in backend route files
- Check browser console for frontend errors
- Check backend terminal for API errors

---

## 🎉 Success Criteria

✅ Backend API running on port 5000
✅ Frontend running on port 3000
✅ 4 demo users can login
✅ Dashboard loads with statistics
✅ Parcels page shows data
✅ Blockchain transactions visible
✅ Mock integrations working
✅ No console errors

---

**🚀 Your Ghana Land ERP Demo is ready for deployment!**

**Next Command:**
```bash
cd /Users/nikolay/Library/CloudStorage/OneDrive-EywaSystems/ghana/land-erp-demo
# Choose one:
# Option 1: npm start (for development)
# Option 2: docker-compose up (for production-like testing)
```

Good luck with your demo! 🇬🇭
