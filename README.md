# Ghana Land ERP Demo

**A comprehensive digital platform for modernizing land administration in Ghana**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Demo-orange.svg)]()

## Overview

The Ghana Land ERP (Enterprise Resource Planning) is a full-stack web application designed to digitize and streamline land administration processes in Ghana. This system addresses critical challenges in land registration, title management, surveying, and revenue collection by providing a unified, transparent, and efficient platform.

### Key Features

- **Multi-Role Access**: Citizen, Surveyor, Lands Officer, and Administrator portals
- **GPS-Based Surveying**: Interactive maps with polygon boundary support
- **Real-Time Application Tracking**: Monitor land title applications from submission to approval
- **Blockchain Integration**: Immutable record keeping for land titles
- **Payment Processing**: Multiple payment methods including Mobile Money
- **Offline Capability**: Field data collection without internet connectivity
- **GIS Integration**: Full mapping and spatial data visualization
- **Responsive Design**: Works on desktop, tablet, and mobile devices

---

## Quick Start

### Local Development

\`\`\`bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/ghana-land-erp.git
cd ghana-land-erp/ghana

# Install and run backend
cd backend
npm install
node src/server.js
# Backend runs on http://localhost:5001

# Install and run frontend (in new terminal)
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
\`\`\`

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Citizen | kofi_mensah | demo123 |
| Surveyor | ama_surveyor | demo123 |
| Lands Officer | abena_officer | demo123 |
| Administrator | admin | demo123 |

---

## Documentation

| Document | Description |
|----------|-------------|
| [USER_GUIDE.md](USER_GUIDE.md) | Comprehensive guide for all user roles with workflows |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Detailed deployment instructions for various platforms |
| [QUICK_DEPLOY.md](QUICK_DEPLOY.md) | 5-minute deployment guide for Render.com |

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Material-UI (MUI)** - Component library
- **Leaflet.js** - Interactive mapping
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Better-SQLite3** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

---

## Deployment

**Recommended:** Render.com (FREE)

See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for 5-minute deployment guide.

**Cost:** \$0/month (free tier) or \$7/month (always-on)

---

## Demo Data Included

- 7 Parcels across Ghana regions
- 5 Surveys (various statuses)
- 4 Title Certificates
- 5 Applications (various stages)
- 6 Payments
- 4 Blockchain Transactions
- 4 Demo Users (one per role)

---

## License

MIT License

---

**⚠️ DEMO APPLICATION - Not for Production Use**
