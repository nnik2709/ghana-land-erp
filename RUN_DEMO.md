# 🚀 Run Ghana Land ERP Demo - Quick Commands

## Option 1: Local Development (Recommended for Testing)

### Step 1: Start Backend
```bash
cd /Users/nikolay/github/ghana/ghana/backend
npm start
```

**Expected output:**
```
🗄️  Initializing database...
✅ Database tables created
✅ Demo users created
✅ Demo data created
✅ Database initialized successfully
🚀 Ghana Land ERP API running on port 5001
```

### Step 2: Start Frontend (New Terminal)
```bash
cd /Users/nikolay/github/ghana/ghana/frontend
npm start
```

Browser will automatically open at: **http://localhost:3000**

---

## Option 2: Docker Deployment

### Single Command
```bash
cd /Users/nikolay/github/ghana/ghana
docker-compose up --build
```

Access at: **http://localhost:3000**

To stop:
```bash
docker-compose down
```

---

## Demo Login Credentials

**All passwords:** `demo123`

| Role | Username | Use Case |
|------|----------|----------|
| 👤 Citizen | `citizen` | View parcels, apply for titles, make payments |
| 📐 Surveyor | `surveyor` | Submit surveys, upload GPS data |
| 👔 Officer | `officer` | Approve applications, issue titles |
| ⚙️ Admin | `admin` | System analytics, integrations, all features |

---

## Quick Test Commands

### Check Backend Health
```bash
curl http://localhost:5001/health
```

### Login as Citizen
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"citizen","password":"demo123"}'
```

### Get Demo Users List
```bash
curl http://localhost:5001/api/auth/demo-users
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5001
lsof -i :5001
kill -9 <PID>

# Or use port 5002 by editing backend/.env
PORT=5002
```

### Reset Database
```bash
rm /Users/nikolay/github/ghana/ghana/backend/data/land-erp.db
npm start  # Will recreate with fresh demo data
```

---

## Access Points

- **Frontend UI:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/health
- **Demo Users:** http://localhost:5001/api/auth/demo-users

---

## What to Test

1. **Login** - Try all 4 user roles
2. **Parcels** - View 3 demo parcels (Accra, Kumasi, Tamale)
3. **Surveys** - See approved survey data
4. **Titles** - View issued land title
5. **Payments** - Check payment history
6. **Blockchain** - Explore blockchain transactions
7. **Integrations** - Test GELIS, Mobile Money, GRA (mocked)
8. **Dashboard** - View system analytics

---

## Full Documentation

- **Quick Start:** `QUICK_START.md`
- **Summary:** `DEMO_READY_SUMMARY.md`
- **Full Docs:** `README.md`
- **Deployment:** `DEPLOYMENT_GUIDE.md`

---

**Status:** ✅ Ready to Demo
**Version:** 1.0.0
