# Ghana Land ERP Demo - Quick Start Guide

This guide will help you get the Ghana Land ERP Demo application running on your local machine and prepare it for online deployment.

## Overview

The Ghana Land ERP Demo is a full-stack web application that demonstrates:
- Blockchain-integrated land registration system
- Multi-role user management (Citizen, Surveyor, Lands Officer, Admin)
- Parcel management and surveying
- Payment processing with Mobile Money integration
- Land title certificate issuance
- GIS mapping capabilities
- External system integrations (GELIS, GRA)

**Tech Stack:**
- **Frontend:** React 18 + Material-UI + Leaflet Maps
- **Backend:** Node.js + Express + SQLite
- **Containerization:** Docker + Docker Compose

---

## Prerequisites

Choose ONE of the following options:

### Option A: Local Development (Recommended for testing)
- Node.js 18 or higher
- npm or yarn package manager

### Option B: Docker Deployment (Recommended for production)
- Docker Desktop (Mac/Windows) or Docker Engine (Linux)
- Docker Compose

---

## Quick Start - Local Development

### Step 1: Clone and Navigate
```bash
cd /path/to/ghana/ghana
```

### Step 2: Configure Environment Variables

**Backend Configuration:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update:
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your-secure-random-jwt-secret-key-here-64-chars-recommended
JWT_EXPIRES_IN=7d
CORS_ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

**Frontend Configuration:**
```bash
cd ../frontend
cp .env.example .env
```

The default configuration should work:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Step 3: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
🗄️  Initializing database...
✅ Database tables created
✅ Demo users created
✅ Demo data created
✅ Database initialized successfully
🚀 Ghana Land ERP API running on port 5001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The browser will automatically open at `http://localhost:3000`

### Step 5: Login with Demo Credentials

The application comes pre-loaded with 4 demo users:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| **Citizen** | `citizen` | `demo123` | Apply for titles, view parcels, make payments |
| **Surveyor** | `surveyor` | `demo123` | Submit surveys, upload coordinates |
| **Lands Officer** | `officer` | `demo123` | Review applications, approve titles |
| **Admin** | `admin` | `demo123` | Full system access, analytics, integrations |

### Step 6: Explore Features

**As Citizen:**
- View owned parcels (2 parcels: Accra & Kumasi)
- Check land title certificates
- View payment history
- Apply for new titles

**As Surveyor:**
- Submit new surveys
- View survey history
- Upload GPS coordinates

**As Lands Officer:**
- Review pending applications
- Approve/reject surveys
- Issue title certificates

**As Admin:**
- View system analytics dashboard
- Monitor blockchain transactions
- Test external integrations (GELIS, Mobile Money, GRA)
- View all users and data

---

## Quick Start - Docker Deployment

Docker deployment bundles everything into containers for easy deployment to any cloud platform.

### Step 1: Prepare Environment Files

Ensure both `.env` files exist (see Step 2 above).

### Step 2: Build and Run with Docker Compose

```bash
cd /path/to/ghana/ghana
docker-compose up --build
```

This will:
1. Build the backend container (Node.js + Express)
2. Build the frontend container (React + Nginx)
3. Start both services with persistent database storage
4. Set up networking between containers

### Step 3: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/health

### Step 4: Stop the Application

```bash
docker-compose down
```

To also remove the database:
```bash
docker-compose down -v
```

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - New user registration
- `GET /api/auth/me` - Get current user
- `GET /api/auth/demo-users` - List demo credentials

### Parcels
- `GET /api/parcels` - List all parcels (filtered by role)
- `GET /api/parcels/:id` - Get parcel details
- `POST /api/parcels/search` - Search parcels

### Surveys
- `GET /api/surveys` - List surveys
- `POST /api/surveys` - Submit new survey
- `PATCH /api/surveys/:id/approve` - Approve survey (admin/officer)

### Titles
- `GET /api/titles` - List land titles
- `GET /api/titles/:id` - Get title certificate

### Payments
- `GET /api/payments` - Payment history
- `POST /api/payments` - Process payment

### Blockchain
- `GET /api/blockchain/transactions` - List blockchain transactions
- `GET /api/blockchain/token/:id` - Get token details
- `POST /api/blockchain/mint` - Mint new token (admin/officer)

### Integrations
- `GET /api/integrations/logs` - Integration logs (admin)
- `POST /api/integrations/gelis/sync` - Sync with GELIS
- `POST /api/integrations/momo/pay` - Mobile Money payment
- `POST /api/integrations/gra/stamp-duty` - Calculate stamp duty

### Dashboard
- `GET /api/dashboard/stats` - System statistics

### Health
- `GET /health` - Server health status

---

## Database Information

**Location:** `backend/data/land-erp.db` (SQLite)

**Demo Data Included:**
- 4 users (citizen, surveyor, officer, admin)
- 3 parcels across different regions
- 1 approved survey
- 1 issued land title
- 1 completed payment
- 1 blockchain transaction

**Database Tables:**
- users
- parcels
- surveys
- titles
- applications
- payments
- blockchain_transactions
- integration_logs

---

## Deploying to Production

### Option 1: Cloud Platform with Docker

The application is ready to deploy to any Docker-supporting platform:

**Recommended Platforms:**
1. **Railway** (Easiest)
   - Connect GitHub repository
   - Select `docker-compose.yml`
   - Set environment variables
   - Deploy

2. **DigitalOcean App Platform**
   - Create new app from GitHub
   - Select Dockerfile deployment
   - Configure environment variables
   - Deploy

3. **AWS Elastic Beanstalk**
   - Create new application
   - Upload docker-compose.yml
   - Configure load balancer
   - Deploy

4. **Google Cloud Run**
   - Build containers separately
   - Deploy frontend and backend
   - Set up Cloud SQL (optional)
   - Configure networking

### Option 2: VPS Deployment

**For Ubuntu/Debian servers:**

```bash
# 1. Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install docker-compose-plugin

# 2. Clone repository
git clone <your-repo-url>
cd ghana

# 3. Configure production environment variables
nano backend/.env
nano frontend/.env

# 4. Run with Docker Compose
docker-compose up -d

# 5. Setup Nginx reverse proxy (optional)
# Configure domain and SSL certificate
```

### Production Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5001
NODE_ENV=production
JWT_SECRET=<generate-64-character-random-string>
JWT_EXPIRES_IN=7d
CORS_ALLOWED_ORIGINS=https://your-domain.com
FRONTEND_URL=https://your-domain.com
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_API_URL=https://api.your-domain.com/api
# or if using same domain:
REACT_APP_API_URL=/api
```

### Security Checklist for Production

- [ ] Change JWT_SECRET to a secure random string (64+ characters)
- [ ] Update CORS_ALLOWED_ORIGINS to your production domain
- [ ] Enable HTTPS/SSL certificate (Let's Encrypt)
- [ ] Set up proper firewall rules
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Review and update rate limiting settings
- [ ] Change all demo passwords
- [ ] Set up proper user authentication (not demo users)

---

## Troubleshooting

### Port Already in Use

If port 5001 or 3000 is already in use:

**Find and kill the process:**
```bash
# Mac/Linux
lsof -i :5001
kill -9 <PID>

# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

**Or change the port:**
Edit `backend/.env` and change `PORT=5001` to another port (e.g., `PORT=5002`)

### Database Not Initializing

Delete the existing database and restart:
```bash
rm backend/data/land-erp.db
npm start
```

### Frontend Can't Connect to Backend

1. Check backend is running: `curl http://localhost:5001/health`
2. Verify `REACT_APP_API_URL` in `frontend/.env` matches backend URL
3. Check CORS settings in `backend/.env`

### Docker Build Fails

1. Clear Docker cache:
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

2. Check Docker has enough resources (4GB RAM minimum)

---

## Project Structure

```
ghana/
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── server.js        # Express server
│   │   ├── database/        # SQLite initialization
│   │   ├── middleware/      # Authentication
│   │   └── routes/          # API endpoints
│   ├── data/                # SQLite database (auto-created)
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── App.js          # Main component
│   │   ├── contexts/       # Auth context
│   │   ├── services/       # API client
│   │   └── pages/          # Route components
│   └── package.json
├── docker-compose.yml       # Docker orchestration
├── Dockerfile.backend       # Backend container
├── Dockerfile.frontend      # Frontend container
├── README.md               # Full documentation
├── DEPLOYMENT_GUIDE.md     # Detailed deployment guide
└── QUICK_START.md          # This file
```

---

## Support and Documentation

- **Full Documentation:** See `README.md` for detailed architecture and API docs
- **Deployment Guide:** See `DEPLOYMENT_GUIDE.md` for platform-specific instructions
- **Technical Specs:** See `Technical_Specifications_Document.docx`
- **API Testing:** Demo credentials are available at `/api/auth/demo-users`

---

## Development Scripts

### Backend
```bash
npm start          # Start server (production mode)
npm run dev        # Start with nodemon (auto-reload)
```

### Frontend
```bash
npm start          # Start dev server (http://localhost:3000)
npm run build      # Create production build
npm test           # Run tests
```

### Docker
```bash
docker-compose up              # Start in foreground
docker-compose up -d           # Start in background (detached)
docker-compose down            # Stop and remove containers
docker-compose logs -f         # View logs
docker-compose restart         # Restart all services
```

---

## Next Steps

After getting the demo running:

1. **Customize Branding:** Update colors, logos, and text in frontend
2. **Add Real Users:** Implement proper user registration
3. **Connect Real Services:** Replace mock integrations with actual APIs
4. **Set Up Production Database:** Migrate from SQLite to PostgreSQL
5. **Implement Real Blockchain:** Connect to Hyperledger Fabric network
6. **Add Email/SMS:** Implement notification system
7. **Deploy to Production:** Follow deployment guide for your chosen platform

---

## Demo Features vs. Production

| Feature | Demo Status | Production Plan |
|---------|-------------|-----------------|
| Authentication | ✅ JWT + Demo Users | Biometric + 2FA |
| Database | ✅ SQLite | PostgreSQL |
| Blockchain | ✅ Mocked | Hyperledger Fabric |
| Mobile Money | ✅ Mocked | Real MTN/Vodafone API |
| GELIS Integration | ✅ Mocked | Real API |
| GRA Integration | ✅ Mocked | Real API |
| GIS Mapping | ✅ Basic Leaflet | Advanced GIS tools |
| Notifications | ❌ Not implemented | Email + SMS |
| Mobile App | ❌ Not implemented | React Native |
| Offline Mode | ❌ Not implemented | PWA with sync |

---

## License

This is a demo application for the Ghana Lands Commission.

---

**Last Updated:** November 2025
**Version:** 1.0.0
**Status:** Ready for Demo Deployment
