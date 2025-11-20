# Implementation Guide: From Demo to Production

This document outlines the steps required to implement fully functional features for the Ghana Lands Commission National Land ERP System. The current demo showcases UI/UX with mock data - this guide details backend requirements, API integrations, and infrastructure needed for production deployment.

## Table of Contents

1. [Overview](#overview)
2. [Core Infrastructure Requirements](#core-infrastructure-requirements)
3. [Feature Implementation Guides](#feature-implementation-guides)
4. [Security Considerations](#security-considerations)
5. [Integration Requirements](#integration-requirements)
6. [Testing & Quality Assurance](#testing--quality-assurance)

---

## Overview

### Current Demo Status

The standalone demo includes the following mockup pages that require backend implementation:

| Feature | Demo Page | Status | Priority |
|---------|-----------|--------|----------|
| Online Payment Portal | `/pay-online` | UI Complete | High |
| My Properties | `/my-properties` | UI Complete | High |
| Billing History | `/billing-history` | UI Complete | High |
| Payment Assistance | `/payment-assistance` | UI Complete | Medium |
| My Account | `/my-account` | UI Complete | High |
| All other existing pages | Various | UI Complete | Varies |

---

## Core Infrastructure Requirements

### 1. Backend API Server

**Technology Stack Recommendation:**
- **Runtime:** Node.js (Express/NestJS) or Python (FastAPI/Django)
- **Database:** PostgreSQL with PostGIS extension for spatial data
- **Cache:** Redis for session management and caching
- **Queue:** Bull/RabbitMQ for async job processing
- **File Storage:** AWS S3 or compatible (MinIO for on-premise)

**API Structure:**
```
/api/v1/
├── auth/           # Authentication endpoints
├── users/          # User management
├── properties/     # Property/parcel management
├── payments/       # Payment processing
├── billing/        # Billing and invoicing
├── applications/   # Application workflows
├── documents/      # Document management
└── notifications/  # Notification system
```

### 2. Database Schema Requirements

#### Users & Authentication
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    id_type VARCHAR(50),
    id_number VARCHAR(50),
    role VARCHAR(50) NOT NULL,
    account_status VARCHAR(20) DEFAULT 'pending',
    verification_status VARCHAR(20) DEFAULT 'unverified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- User verification
CREATE TABLE user_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    verification_type VARCHAR(50), -- email, phone, id
    verification_code VARCHAR(10),
    expires_at TIMESTAMP,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Properties & Billing
```sql
-- Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brn VARCHAR(50) UNIQUE NOT NULL, -- Billing Reference Number
    title_number VARCHAR(50),
    address TEXT NOT NULL,
    region VARCHAR(100),
    district VARCHAR(100),
    property_type VARCHAR(50),
    land_use VARCHAR(100),
    size_sqm DECIMAL(12,2),
    ownership_type VARCHAR(50),
    coordinates GEOMETRY(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property ownership/linking
CREATE TABLE property_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    property_id UUID REFERENCES properties(id),
    ownership_type VARCHAR(50), -- owner, authorized_user
    verification_status VARCHAR(20) DEFAULT 'pending',
    linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- Bills
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    property_id UUID REFERENCES properties(id),
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_reference VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    gateway_reference VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment-Bill junction
CREATE TABLE payment_bills (
    payment_id UUID REFERENCES payments(id),
    bill_id UUID REFERENCES bills(id),
    amount DECIMAL(12,2),
    PRIMARY KEY (payment_id, bill_id)
);
```

---

## Feature Implementation Guides

### 1. Online Payment Portal (`/pay-online`)

#### Backend Requirements

**API Endpoints:**
```
POST   /api/v1/payments/initiate
GET    /api/v1/payments/:reference
POST   /api/v1/payments/:reference/confirm
GET    /api/v1/payments/:reference/receipt
```

**Implementation Steps:**

1. **Payment Gateway Integration**
   - Integrate with local payment processors:
     - **Mobile Money:** MTN MoMo, Vodafone Cash, AirtelTigo Money
     - **Card Payments:** Paystack, Flutterwave, or local banks
     - **Bank Transfer:** GhIPSS (Ghana Interbank Payment and Settlement Systems)

   ```javascript
   // Example: Paystack integration
   const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

   async function initiatePayment(amount, email, reference) {
     const response = await paystack.transaction.initialize({
       amount: amount * 100, // Amount in pesewas
       email: email,
       reference: reference,
       currency: 'GHS',
       callback_url: `${process.env.APP_URL}/payment/callback`
     });
     return response.data.authorization_url;
   }
   ```

2. **Payment Processing Flow**
   ```
   User selects bills → Initiate payment → Gateway redirect →
   Payment confirmation → Webhook verification → Update bill status →
   Generate receipt → Send confirmation (email/SMS)
   ```

3. **Webhook Handler**
   ```javascript
   // Verify payment callback
   app.post('/api/webhooks/paystack', async (req, res) => {
     const hash = crypto
       .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
       .update(JSON.stringify(req.body))
       .digest('hex');

     if (hash === req.headers['x-paystack-signature']) {
       const event = req.body;
       if (event.event === 'charge.success') {
         await confirmPayment(event.data.reference);
       }
     }
     res.sendStatus(200);
   });
   ```

4. **Receipt Generation**
   - Use libraries like `pdfkit` or `puppeteer` for PDF generation
   - Include QR code for verification
   - Store receipts in S3/file storage

---

### 2. My Properties (`/my-properties`)

#### Backend Requirements

**API Endpoints:**
```
GET    /api/v1/properties/linked
POST   /api/v1/properties/link
DELETE /api/v1/properties/:id/unlink
GET    /api/v1/properties/search?brn=xxx
POST   /api/v1/properties/:id/verify
```

**Implementation Steps:**

1. **Property Search Service**
   ```javascript
   async function searchProperty(searchType, searchValue) {
     const query = searchType === 'brn'
       ? { brn: searchValue }
       : { title_number: searchValue };

     return await Property.findOne(query);
   }
   ```

2. **Property Linking Workflow**
   - User searches for property
   - System validates property exists in registry
   - User provides proof of ownership
   - Admin/automated verification
   - Link property to user account

3. **Ownership Verification**
   - **Option A:** Manual verification by Lands Officer
   - **Option B:** Document upload + OCR verification
   - **Option C:** In-person verification at Lands Commission office
   - **Option D:** Integration with national ID system for automated verification

4. **Integration with Land Registry**
   - Connect to existing Lands Commission database
   - Sync property data periodically
   - Real-time verification API

---

### 3. Billing History (`/billing-history`)

#### Backend Requirements

**API Endpoints:**
```
GET    /api/v1/billing/history
GET    /api/v1/billing/bills/:id
GET    /api/v1/billing/payments
GET    /api/v1/billing/bills/:id/download
GET    /api/v1/billing/payments/:id/receipt
```

**Implementation Steps:**

1. **Bill Generation System**
   ```javascript
   // Automated bill generation (cron job)
   async function generateAnnualBills() {
     const properties = await Property.findAll({
       where: { status: 'active' }
     });

     for (const property of properties) {
       const amount = calculateLandRent(property);
       await Bill.create({
         property_id: property.id,
         description: `Annual Land Rent - ${new Date().getFullYear()}`,
         amount: amount,
         due_date: getYearEndDate(),
         status: 'pending'
       });
     }
   }
   ```

2. **Notification System**
   - Email reminders for upcoming bills
   - SMS alerts for overdue payments
   - Push notifications for mobile app

3. **Export Functionality**
   - PDF bill statements
   - CSV export for accounting
   - Annual summaries

---

### 4. Payment Assistance (`/payment-assistance`)

#### Backend Requirements

**API Endpoints:**
```
POST   /api/v1/assistance/apply
GET    /api/v1/assistance/applications
GET    /api/v1/assistance/applications/:id
PUT    /api/v1/assistance/applications/:id/status
POST   /api/v1/assistance/applications/:id/documents
```

**Implementation Steps:**

1. **Application Workflow**
   ```
   Submit application → Document upload → Initial review →
   Background check → Committee review → Decision →
   Notify applicant → Implement plan/waiver
   ```

2. **Eligibility Engine**
   ```javascript
   function calculateEligibility(application) {
     const { monthlyIncome, householdSize, outstandingBalance } = application;

     // Example eligibility criteria
     const incomePerCapita = monthlyIncome / householdSize;
     const debtToIncome = outstandingBalance / (monthlyIncome * 12);

     if (incomePerCapita < 500 && debtToIncome > 0.3) {
       return { eligible: true, recommendedPlan: 'hardship_waiver' };
     } else if (debtToIncome > 0.2) {
       return { eligible: true, recommendedPlan: 'payment_plan_12' };
     }

     return { eligible: false, reason: 'Does not meet criteria' };
   }
   ```

3. **Document Verification**
   - Integration with government databases
   - OCR for document processing
   - Fraud detection algorithms

4. **Payment Plan Management**
   - Automated installment scheduling
   - Reminder notifications
   - Grace period handling
   - Default management

---

### 5. My Account (`/my-account`)

#### Backend Requirements

**API Endpoints:**
```
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
PUT    /api/v1/users/password
PUT    /api/v1/users/notifications
PUT    /api/v1/users/billing-preferences
POST   /api/v1/users/2fa/enable
DELETE /api/v1/users/2fa/disable
GET    /api/v1/users/login-history
```

**Implementation Steps:**

1. **Profile Management**
   - Field validation for Ghana-specific formats
   - Phone number verification via SMS
   - Address validation against postal database

2. **Security Features**
   - Two-factor authentication (TOTP)
   - Password strength requirements
   - Login attempt limiting
   - Session management
   - Audit logging

3. **Notification Preferences**
   ```javascript
   // SMS Gateway integration
   const smsGateway = require('./sms-gateway'); // Hubtel, Arkesel, etc.

   async function sendNotification(userId, type, message) {
     const user = await User.findById(userId);
     const preferences = await NotificationPreferences.findByUserId(userId);

     if (preferences[`sms_${type}`]) {
       await smsGateway.send(user.phone, message);
     }
     if (preferences[`email_${type}`]) {
       await emailService.send(user.email, message);
     }
   }
   ```

4. **Auto-Pay Feature**
   - Saved payment methods (tokenization)
   - Scheduled payment processing
   - Failed payment retry logic

---

## Security Considerations

### 1. Authentication & Authorization

```javascript
// JWT with refresh tokens
const jwt = require('jsonwebtoken');

function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}
```

### 2. Data Protection

- **Encryption:** AES-256 for sensitive data at rest
- **PII Handling:** Mask ID numbers, encrypt storage
- **GDPR/Data Protection Act compliance**
- **Audit trails for all data access**

### 3. Payment Security

- PCI-DSS compliance for card data
- Tokenization for saved cards
- SSL/TLS for all communications
- 3D Secure for card transactions

### 4. API Security

- Rate limiting
- Input validation and sanitization
- CORS configuration
- API key management
- Request signing

---

## Integration Requirements

### 1. Government Systems

| System | Purpose | Integration Type |
|--------|---------|-----------------|
| Ghana Card/NIA | Identity verification | REST API |
| GRA | Tax verification | SOAP/REST API |
| Ghana Post | Address validation | API |
| GhIPSS | Bank transfers | Direct integration |
| eCourts | Legal dispute data | API |

### 2. Payment Gateways

| Provider | Payment Types | Notes |
|----------|--------------|-------|
| Paystack | Cards, Mobile Money | Primary gateway |
| Flutterwave | Cards, Bank Transfer | Backup gateway |
| MTN MoMo | Mobile Money | Direct API |
| Vodafone Cash | Mobile Money | Direct API |
| GCB Bank | Bank Transfer, Cards | Local bank option |

### 3. Communication Services

| Service | Purpose | Provider Options |
|---------|---------|-----------------|
| SMS | Notifications, OTP | Hubtel, Arkesel, Twilio |
| Email | Transactional emails | SendGrid, SES, Mailgun |
| Push Notifications | Mobile alerts | Firebase, OneSignal |

---

## Testing & Quality Assurance

### 1. Test Categories

```javascript
// Unit test example
describe('Payment Service', () => {
  it('should calculate correct total with multiple bills', async () => {
    const bills = [
      { id: 1, amount: 1000 },
      { id: 2, amount: 500 }
    ];
    const total = paymentService.calculateTotal(bills);
    expect(total).toBe(1500);
  });
});

// Integration test example
describe('Payment API', () => {
  it('should initiate payment successfully', async () => {
    const response = await request(app)
      .post('/api/v1/payments/initiate')
      .send({ billIds: [1, 2], paymentMethod: 'card' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.paymentReference).toBeDefined();
  });
});
```

### 2. Test Environments

| Environment | Purpose | Data |
|-------------|---------|------|
| Development | Feature development | Synthetic data |
| Staging | Pre-production testing | Anonymized prod data |
| UAT | User acceptance | Production-like |
| Production | Live system | Real data |

### 3. Performance Testing

- Load testing with k6 or Artillery
- Target: 1000 concurrent users
- Response time < 200ms for API calls
- Payment processing < 5 seconds

---

## Deployment Checklist

### Pre-Production

- [ ] All API endpoints implemented and tested
- [ ] Database migrations ready
- [ ] Payment gateway sandbox testing complete
- [ ] SSL certificates configured
- [ ] Environment variables secured
- [ ] Backup and recovery tested
- [ ] Monitoring and alerting configured
- [ ] Documentation complete

### Production Launch

- [ ] Payment gateway switched to live mode
- [ ] DNS configured
- [ ] CDN configured for static assets
- [ ] Auto-scaling configured
- [ ] Log aggregation setup
- [ ] Error tracking (Sentry, etc.)
- [ ] Uptime monitoring
- [ ] On-call rotation established

---

## Support & Maintenance

### Monitoring

- Application metrics (response times, error rates)
- Business metrics (payments, registrations)
- Infrastructure metrics (CPU, memory, disk)

### Incident Response

1. Detection (automated alerts)
2. Assessment (severity classification)
3. Response (on-call team)
4. Resolution (fix deployed)
5. Post-mortem (documentation)

### Regular Maintenance

- Security patches (weekly)
- Dependency updates (monthly)
- Database optimization (quarterly)
- Disaster recovery drills (bi-annually)

---

## Estimated Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1: Core Infrastructure | 4-6 weeks | API server, database, auth |
| Phase 2: Payment System | 6-8 weeks | Gateway integration, billing |
| Phase 3: User Features | 4-6 weeks | Properties, account, history |
| Phase 4: Integrations | 6-8 weeks | Government systems, notifications |
| Phase 5: Testing & QA | 4-6 weeks | All test types, fixes |
| Phase 6: Deployment | 2-4 weeks | Staging, UAT, production |

**Total Estimated Timeline: 26-38 weeks**

---

## Contact & Resources

- **Technical Lead:** [TBD]
- **Project Manager:** [TBD]
- **DevOps:** [TBD]

### Useful Resources

- [Paystack Documentation](https://paystack.com/docs)
- [Ghana Card API Documentation](https://nia.gov.gh)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [OWASP Security Guidelines](https://owasp.org)

---

*Document Version: 1.0*
*Last Updated: November 2024*
*Author: Development Team*
