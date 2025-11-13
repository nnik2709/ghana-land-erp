const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Use local writable path (Render free tier has ephemeral storage)
const dbPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../../data/land-erp.db')
  : path.join(__dirname, '../../data/land-erp.db');

// Ensure data directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`📁 Created database directory: ${dbDir}`);
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDatabase() {
  console.log('🗄️  Initializing database...');

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL CHECK(role IN ('citizen', 'surveyor', 'admin', 'lands_officer')),
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Parcels table
  db.exec(`
    CREATE TABLE IF NOT EXISTS parcels (
      id TEXT PRIMARY KEY,
      parcel_id TEXT UNIQUE NOT NULL,
      region TEXT NOT NULL,
      district TEXT NOT NULL,
      location TEXT NOT NULL,
      area REAL NOT NULL,
      land_type TEXT NOT NULL CHECK(land_type IN ('RESIDENTIAL', 'COMMERCIAL', 'AGRICULTURAL', 'INDUSTRIAL', 'STOOL_LAND')),
      coordinates TEXT,
      geometry TEXT,
      geometry_hash TEXT,
      owner_id TEXT,
      status TEXT DEFAULT 'unregistered' CHECK(status IN ('unregistered', 'pending', 'registered', 'disputed')),
      blockchain_token_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `);

  // Surveys table
  db.exec(`
    CREATE TABLE IF NOT EXISTS surveys (
      id TEXT PRIMARY KEY,
      survey_id TEXT UNIQUE NOT NULL,
      parcel_id TEXT NOT NULL,
      surveyor_id TEXT NOT NULL,
      survey_date DATE NOT NULL,
      coordinates TEXT NOT NULL,
      accuracy_score REAL,
      instrument_type TEXT,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'submitted', 'approved', 'rejected')),
      notes TEXT,
      attachments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parcel_id) REFERENCES parcels(id),
      FOREIGN KEY (surveyor_id) REFERENCES users(id)
    )
  `);

  // Titles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS titles (
      id TEXT PRIMARY KEY,
      title_id TEXT UNIQUE NOT NULL,
      parcel_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      title_type TEXT NOT NULL CHECK(title_type IN ('FREEHOLD', 'LEASEHOLD', 'CUSTOMARY')),
      issuance_date DATE,
      expiry_date DATE,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'issued', 'suspended', 'cancelled')),
      blockchain_token_id TEXT,
      certificate_url TEXT,
      qr_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parcel_id) REFERENCES parcels(id),
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `);

  // Applications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      application_id TEXT UNIQUE NOT NULL,
      applicant_id TEXT NOT NULL,
      parcel_id TEXT,
      application_type TEXT NOT NULL CHECK(application_type IN ('NEW_TITLE', 'TRANSFER', 'DUPLICATE', 'MORTGAGE')),
      status TEXT DEFAULT 'submitted' CHECK(status IN ('submitted', 'under_review', 'payment_pending', 'approved', 'rejected', 'completed')),
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_by TEXT,
      reviewed_at DATETIME,
      notes TEXT,
      FOREIGN KEY (applicant_id) REFERENCES users(id),
      FOREIGN KEY (parcel_id) REFERENCES parcels(id),
      FOREIGN KEY (reviewed_by) REFERENCES users(id)
    )
  `);

  // Payments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      transaction_id TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      application_id TEXT,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'GHS',
      payment_method TEXT NOT NULL CHECK(payment_method IN ('MOBILE_MONEY', 'CARD', 'BANK_TRANSFER', 'CASH')),
      payment_provider TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
      reference_number TEXT,
      blockchain_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (application_id) REFERENCES applications(id)
    )
  `);

  // Blockchain transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blockchain_transactions (
      id TEXT PRIMARY KEY,
      transaction_hash TEXT UNIQUE NOT NULL,
      block_number INTEGER,
      token_id TEXT NOT NULL,
      transaction_type TEXT NOT NULL CHECK(transaction_type IN ('MINT', 'TRANSFER', 'ENCUMBRANCE', 'DISCHARGE')),
      from_address TEXT,
      to_address TEXT,
      metadata TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Integration logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS integration_logs (
      id TEXT PRIMARY KEY,
      system_name TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      request_payload TEXT,
      response_payload TEXT,
      status_code INTEGER,
      success BOOLEAN NOT NULL,
      error_message TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Mortgages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS mortgages (
      id TEXT PRIMARY KEY,
      mortgage_id TEXT UNIQUE NOT NULL,
      parcel_id TEXT NOT NULL,
      lender_name TEXT NOT NULL,
      lender_contact TEXT,
      borrower_id TEXT NOT NULL,
      loan_amount REAL NOT NULL,
      interest_rate REAL,
      duration_months INTEGER,
      start_date DATE NOT NULL,
      maturity_date DATE,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'discharged', 'foreclosed', 'defaulted')),
      priority INTEGER DEFAULT 1,
      documents TEXT,
      blockchain_hash TEXT,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      registered_by TEXT,
      discharged_at DATETIME,
      notes TEXT,
      FOREIGN KEY (parcel_id) REFERENCES parcels(id),
      FOREIGN KEY (borrower_id) REFERENCES users(id),
      FOREIGN KEY (registered_by) REFERENCES users(id)
    )
  `);

  // Documents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      document_id TEXT UNIQUE NOT NULL,
      filename TEXT NOT NULL,
      original_filename TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      document_type TEXT NOT NULL CHECK(document_type IN ('TITLE_DEED', 'SURVEY_PLAN', 'ID_CARD', 'PASSPORT', 'LAND_CERTIFICATE', 'MORTGAGE_DEED', 'COURT_ORDER', 'OTHER')),
      related_entity_type TEXT,
      related_entity_id TEXT,
      uploaded_by TEXT NOT NULL,
      hash TEXT NOT NULL,
      blockchain_hash TEXT,
      verified BOOLEAN DEFAULT 0,
      verified_by TEXT,
      verified_at DATETIME,
      ocr_text TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (uploaded_by) REFERENCES users(id),
      FOREIGN KEY (verified_by) REFERENCES users(id)
    )
  `);

  // Notifications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('application_update', 'payment_receipt', 'survey_approved', 'title_issued', 'mortgage_registered', 'document_uploaded', 'system_alert')),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      data TEXT,
      channels TEXT,
      read BOOLEAN DEFAULT 0,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Notification settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notification_settings (
      user_id TEXT PRIMARY KEY,
      sms_enabled BOOLEAN DEFAULT 1,
      email_enabled BOOLEAN DEFAULT 1,
      push_enabled BOOLEAN DEFAULT 1,
      application_updates BOOLEAN DEFAULT 1,
      payment_receipts BOOLEAN DEFAULT 1,
      survey_status BOOLEAN DEFAULT 1,
      title_updates BOOLEAN DEFAULT 1,
      mortgage_updates BOOLEAN DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('✅ Database tables created');

  // Create demo users
  createDemoUsers();
  createDemoData();

  console.log('✅ Database initialized successfully');
}

function createDemoUsers() {
  const users = [
    {
      id: uuidv4(),
      username: 'citizen',
      email: 'citizen@demo.gh',
      password: bcrypt.hashSync('demo123', 10),
      full_name: 'Kofi Mensah',
      phone: '+233244123456',
      role: 'citizen'
    },
    {
      id: uuidv4(),
      username: 'surveyor',
      email: 'surveyor@demo.gh',
      password: bcrypt.hashSync('demo123', 10),
      full_name: 'Ama Adjei',
      phone: '+233244234567',
      role: 'surveyor'
    },
    {
      id: uuidv4(),
      username: 'admin',
      email: 'admin@demo.gh',
      password: bcrypt.hashSync('demo123', 10),
      full_name: 'Kwame Nkrumah',
      phone: '+233244345678',
      role: 'admin'
    },
    {
      id: uuidv4(),
      username: 'officer',
      email: 'officer@demo.gh',
      password: bcrypt.hashSync('demo123', 10),
      full_name: 'Abena Osei',
      phone: '+233244456789',
      role: 'lands_officer'
    }
  ];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO users (id, username, email, password, full_name, phone, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  users.forEach(user => {
    insert.run(user.id, user.username, user.email, user.password, user.full_name, user.phone, user.role);
  });

  console.log('✅ Demo users created');
}

function createDemoData() {
  // Get user IDs
  const citizen = db.prepare('SELECT id FROM users WHERE role = ?').get('citizen');
  const surveyor = db.prepare('SELECT id FROM users WHERE role = ?').get('surveyor');
  const officer = db.prepare('SELECT id FROM users WHERE role = ?').get('lands_officer');
  const admin = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');

  if (!citizen || !surveyor || !officer || !admin) return;

  // Create demo parcels (expanded to 7 parcels with polygon boundaries)
  const parcels = [
    {
      id: uuidv4(),
      parcel_id: 'GH-GAR-ACC-00001',
      region: 'Greater Accra',
      district: 'Accra Metropolitan',
      location: 'East Legon, Accra',
      area: 500.5,
      land_type: 'RESIDENTIAL',
      coordinates: '{"lat": 5.6037, "lng": -0.1870}',
      geometry: JSON.stringify({
        type: 'Polygon',
        coordinates: [[
          [-0.1870, 5.6037],
          [-0.1865, 5.6037],
          [-0.1865, 5.6042],
          [-0.1870, 5.6042],
          [-0.1870, 5.6037]
        ]]
      }),
      geometry_hash: 'a1b2c3d4e5f6',
      owner_id: citizen.id,
      status: 'registered',
      blockchain_token_id: 'LND-GH-GAR-00001'
    },
    {
      id: uuidv4(),
      parcel_id: 'GH-ASH-KUM-00002',
      region: 'Ashanti',
      district: 'Kumasi Metropolitan',
      location: 'Asokwa, Kumasi',
      area: 750.0,
      land_type: 'COMMERCIAL',
      coordinates: '{"lat": 6.6885, "lng": -1.6244}',
      geometry: JSON.stringify({
        type: 'Polygon',
        coordinates: [[
          [-1.6244, 6.6885],
          [-1.6238, 6.6885],
          [-1.6238, 6.6892],
          [-1.6244, 6.6892],
          [-1.6244, 6.6885]
        ]]
      }),
      geometry_hash: 'b2c3d4e5f6g7',
      owner_id: citizen.id,
      status: 'pending',
      blockchain_token_id: null
    },
    {
      id: uuidv4(),
      parcel_id: 'GH-NR-TAM-00003',
      region: 'Northern',
      district: 'Tamale Metropolitan',
      location: 'Tamale Central',
      area: 1000.0,
      land_type: 'AGRICULTURAL',
      coordinates: '{"lat": 9.4034, "lng": -0.8424}',
      geometry: JSON.stringify({
        type: 'Polygon',
        coordinates: [[
          [-0.8424, 9.4034],
          [-0.8415, 9.4034],
          [-0.8415, 9.4044],
          [-0.8424, 9.4044],
          [-0.8424, 9.4034]
        ]]
      }),
      geometry_hash: 'c3d4e5f6g7h8',
      owner_id: null,
      status: 'unregistered',
      blockchain_token_id: null
    },
    {
      id: uuidv4(),
      parcel_id: 'GH-WR-SEK-00004',
      region: 'Western',
      district: 'Sekondi-Takoradi',
      location: 'Takoradi Harbor Area',
      area: 2500.0,
      land_type: 'INDUSTRIAL',
      coordinates: '{"lat": 4.8845, "lng": -1.7554}',
      geometry: JSON.stringify({
        type: 'Polygon',
        coordinates: [[
          [-1.7554, 4.8845],
          [-1.7540, 4.8845],
          [-1.7540, 4.8860],
          [-1.7554, 4.8860],
          [-1.7554, 4.8845]
        ]]
      }),
      geometry_hash: 'd4e5f6g7h8i9',
      owner_id: citizen.id,
      status: 'registered',
      blockchain_token_id: 'LND-GH-WR-00004'
    },
    {
      id: uuidv4(),
      parcel_id: 'GH-ER-KOF-00005',
      region: 'Eastern',
      district: 'Koforidua',
      location: 'New Juaben, Koforidua',
      area: 350.0,
      land_type: 'RESIDENTIAL',
      coordinates: '{"lat": 6.0869, "lng": -0.2584}',
      geometry: JSON.stringify({
        type: 'Polygon',
        coordinates: [[
          [-0.2584, 6.0869],
          [-0.2579, 6.0869],
          [-0.2579, 6.0873],
          [-0.2584, 6.0873],
          [-0.2584, 6.0869]
        ]]
      }),
      geometry_hash: 'e5f6g7h8i9j0',
      owner_id: citizen.id,
      status: 'pending',
      blockchain_token_id: null
    },
    {
      id: uuidv4(),
      parcel_id: 'GH-VR-HO-00006',
      region: 'Volta',
      district: 'Ho Municipal',
      location: 'Ho Township',
      area: 450.0,
      land_type: 'STOOL_LAND',
      coordinates: '{"lat": 6.6108, "lng": 0.4719}',
      geometry: JSON.stringify({
        type: 'Polygon',
        coordinates: [[
          [0.4719, 6.6108],
          [0.4724, 6.6108],
          [0.4724, 6.6113],
          [0.4719, 6.6113],
          [0.4719, 6.6108]
        ]]
      }),
      geometry_hash: 'f6g7h8i9j0k1',
      owner_id: null,
      status: 'unregistered',
      blockchain_token_id: null
    },
    {
      id: uuidv4(),
      parcel_id: 'GH-BAR-BOL-00007',
      region: 'Bono East',
      district: 'Techiman',
      location: 'Techiman Market Area',
      area: 800.0,
      land_type: 'COMMERCIAL',
      coordinates: '{"lat": 7.5931, "lng": -1.9385}',
      geometry: JSON.stringify({
        type: 'Polygon',
        coordinates: [[
          [-1.9385, 7.5931],
          [-1.9378, 7.5931],
          [-1.9378, 7.5939],
          [-1.9385, 7.5939],
          [-1.9385, 7.5931]
        ]]
      }),
      geometry_hash: 'g7h8i9j0k1l2',
      owner_id: citizen.id,
      status: 'registered',
      blockchain_token_id: 'LND-GH-BAR-00007'
    }
  ];

  const insertParcel = db.prepare(`
    INSERT OR IGNORE INTO parcels (id, parcel_id, region, district, location, area, land_type, coordinates, geometry, geometry_hash, owner_id, status, blockchain_token_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  parcels.forEach(parcel => {
    insertParcel.run(parcel.id, parcel.parcel_id, parcel.region, parcel.district, parcel.location, parcel.area, parcel.land_type, parcel.coordinates, parcel.geometry, parcel.geometry_hash, parcel.owner_id, parcel.status, parcel.blockchain_token_id);
  });

  // Create multiple surveys with different statuses
  const surveys = [
    { id: uuidv4(), survey_id: 'SUR-2025-001', parcel_id: parcels[0].id, surveyor_id: surveyor.id, survey_date: '2025-11-01', coordinates: '{"coordinates": [[5.6037, -0.1870], [5.6040, -0.1870], [5.6040, -0.1875], [5.6037, -0.1875]]}', accuracy_score: 0.95, instrument_type: 'Total Station', status: 'approved', notes: 'High accuracy survey completed' },
    { id: uuidv4(), survey_id: 'SUR-2025-002', parcel_id: parcels[1].id, surveyor_id: surveyor.id, survey_date: '2025-11-05', coordinates: '{"coordinates": [[6.6885, -1.6244], [6.6890, -1.6244], [6.6890, -1.6250], [6.6885, -1.6250]]}', accuracy_score: 0.92, instrument_type: 'GPS RTK', status: 'submitted', notes: 'Awaiting review' },
    { id: uuidv4(), survey_id: 'SUR-2025-003', parcel_id: parcels[3].id, surveyor_id: surveyor.id, survey_date: '2025-10-28', coordinates: '{"coordinates": [[4.8845, -1.7554], [4.8850, -1.7554], [4.8850, -1.7560], [4.8845, -1.7560]]}', accuracy_score: 0.98, instrument_type: 'Total Station', status: 'approved', notes: 'Industrial site survey' },
    { id: uuidv4(), survey_id: 'SUR-2025-004', parcel_id: parcels[4].id, surveyor_id: surveyor.id, survey_date: '2025-11-08', coordinates: '{"coordinates": [[6.0869, -0.2584], [6.0872, -0.2584], [6.0872, -0.2588], [6.0869, -0.2588]]}', accuracy_score: 0.89, instrument_type: 'Drone Mapping', status: 'draft', notes: 'Draft - needs verification' },
    { id: uuidv4(), survey_id: 'SUR-2025-005', parcel_id: parcels[6].id, surveyor_id: surveyor.id, survey_date: '2025-10-20', coordinates: '{"coordinates": [[7.5931, -1.9385], [7.5935, -1.9385], [7.5935, -1.9390], [7.5931, -1.9390]]}', accuracy_score: 0.94, instrument_type: 'GPS RTK', status: 'approved', notes: 'Commercial area survey' }
  ];

  const insertSurvey = db.prepare(`
    INSERT OR IGNORE INTO surveys (id, survey_id, parcel_id, surveyor_id, survey_date, coordinates, accuracy_score, instrument_type, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  surveys.forEach(survey => {
    insertSurvey.run(survey.id, survey.survey_id, survey.parcel_id, survey.surveyor_id, survey.survey_date, survey.coordinates, survey.accuracy_score, survey.instrument_type, survey.status, survey.notes);
  });

  // Create multiple titles
  const titles = [
    { id: uuidv4(), title_id: 'TIT-GH-2025-00001', parcel_id: parcels[0].id, owner_id: citizen.id, title_type: 'FREEHOLD', issuance_date: '2025-11-10', status: 'issued', blockchain_token_id: 'LND-GH-GAR-00001', qr_code: 'QR-TIT-001' },
    { id: uuidv4(), title_id: 'TIT-GH-2025-00002', parcel_id: parcels[3].id, owner_id: citizen.id, title_type: 'LEASEHOLD', issuance_date: '2025-10-30', expiry_date: '2075-10-30', status: 'issued', blockchain_token_id: 'LND-GH-WR-00004', qr_code: 'QR-TIT-002' },
    { id: uuidv4(), title_id: 'TIT-GH-2025-00003', parcel_id: parcels[6].id, owner_id: citizen.id, title_type: 'FREEHOLD', issuance_date: '2025-10-22', status: 'issued', blockchain_token_id: 'LND-GH-BAR-00007', qr_code: 'QR-TIT-003' },
    { id: uuidv4(), title_id: 'TIT-GH-2025-00004', parcel_id: parcels[1].id, owner_id: citizen.id, title_type: 'LEASEHOLD', issuance_date: null, expiry_date: null, status: 'pending', blockchain_token_id: null, qr_code: null }
  ];

  const insertTitle = db.prepare(`
    INSERT OR IGNORE INTO titles (id, title_id, parcel_id, owner_id, title_type, issuance_date, expiry_date, status, blockchain_token_id, qr_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  titles.forEach(title => {
    insertTitle.run(title.id, title.title_id, title.parcel_id, title.owner_id, title.title_type, title.issuance_date, title.expiry_date, title.status, title.blockchain_token_id, title.qr_code);
  });

  // Create multiple applications with various statuses
  const applications = [
    { id: uuidv4(), application_id: 'APP-2025-001', applicant_id: citizen.id, parcel_id: parcels[1].id, application_type: 'NEW_TITLE', status: 'under_review', reviewed_by: officer.id, reviewed_at: '2025-11-12 10:30:00', notes: 'Documents under review' },
    { id: uuidv4(), application_id: 'APP-2025-002', applicant_id: citizen.id, parcel_id: parcels[4].id, application_type: 'NEW_TITLE', status: 'submitted', reviewed_by: null, reviewed_at: null, notes: null },
    { id: uuidv4(), application_id: 'APP-2025-003', applicant_id: citizen.id, parcel_id: parcels[0].id, application_type: 'DUPLICATE', status: 'completed', reviewed_by: officer.id, reviewed_at: '2025-11-10 14:20:00', notes: 'Duplicate title issued' },
    { id: uuidv4(), application_id: 'APP-2025-004', applicant_id: citizen.id, parcel_id: parcels[3].id, application_type: 'TRANSFER', status: 'payment_pending', reviewed_by: officer.id, reviewed_at: '2025-11-11 09:15:00', notes: 'Approved - awaiting payment' },
    { id: uuidv4(), application_id: 'APP-2025-005', applicant_id: citizen.id, parcel_id: parcels[6].id, application_type: 'MORTGAGE', status: 'approved', reviewed_by: officer.id, reviewed_at: '2025-10-25 11:00:00', notes: 'Mortgage registration approved' }
  ];

  const insertApplication = db.prepare(`
    INSERT OR IGNORE INTO applications (id, application_id, applicant_id, parcel_id, application_type, status, reviewed_by, reviewed_at, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  applications.forEach(app => {
    insertApplication.run(app.id, app.application_id, app.applicant_id, app.parcel_id, app.application_type, app.status, app.reviewed_by, app.reviewed_at, app.notes);
  });

  // Create multiple payments with different methods and statuses
  const payments = [
    { id: uuidv4(), transaction_id: 'TXN-2025-001', user_id: citizen.id, application_id: applications[2].id, amount: 250.00, currency: 'GHS', payment_method: 'MOBILE_MONEY', payment_provider: 'MTN MoMo', status: 'completed', reference_number: 'MTN-REF-123456', blockchain_hash: null, completed_at: '2025-11-10 15:00:00' },
    { id: uuidv4(), transaction_id: 'TXN-2025-002', user_id: citizen.id, application_id: applications[0].id, amount: 500.00, currency: 'GHS', payment_method: 'MOBILE_MONEY', payment_provider: 'Vodafone Cash', status: 'completed', reference_number: 'VOD-REF-789012', blockchain_hash: null, completed_at: '2025-11-12 11:30:00' },
    { id: uuidv4(), transaction_id: 'TXN-2025-003', user_id: citizen.id, application_id: applications[3].id, amount: 750.00, currency: 'GHS', payment_method: 'MOBILE_MONEY', payment_provider: 'AirtelTigo Money', status: 'pending', reference_number: 'ATM-REF-345678', blockchain_hash: null, completed_at: null },
    { id: uuidv4(), transaction_id: 'TXN-2025-004', user_id: citizen.id, application_id: applications[4].id, amount: 1200.00, currency: 'GHS', payment_method: 'BANK_TRANSFER', payment_provider: 'GCB Bank', status: 'completed', reference_number: 'GCB-TRF-901234', blockchain_hash: null, completed_at: '2025-10-26 09:45:00' },
    { id: uuidv4(), transaction_id: 'TXN-2025-005', user_id: citizen.id, application_id: applications[1].id, amount: 500.00, currency: 'GHS', payment_method: 'CARD', payment_provider: 'Visa', status: 'processing', reference_number: 'VISA-567890', blockchain_hash: null, completed_at: null },
    { id: uuidv4(), transaction_id: 'TXN-2025-006', user_id: citizen.id, application_id: null, amount: 150.00, currency: 'GHS', payment_method: 'CASH', payment_provider: 'Lands Commission Office', status: 'completed', reference_number: 'CASH-112233', blockchain_hash: null, completed_at: '2025-11-08 14:20:00' }
  ];

  const insertPayment = db.prepare(`
    INSERT OR IGNORE INTO payments (id, transaction_id, user_id, application_id, amount, currency, payment_method, payment_provider, status, reference_number, blockchain_hash, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  payments.forEach(payment => {
    insertPayment.run(payment.id, payment.transaction_id, payment.user_id, payment.application_id, payment.amount, payment.currency, payment.payment_method, payment.payment_provider, payment.status, payment.reference_number, payment.blockchain_hash, payment.completed_at);
  });

  // Create multiple blockchain transactions
  const blockchainTxs = [
    { id: uuidv4(), transaction_hash: '0xabcdef123456789012345678901234567890abcd', block_number: 12345, token_id: 'LND-GH-GAR-00001', transaction_type: 'MINT', from_address: null, to_address: citizen.id, metadata: '{"parcel_id": "GH-GAR-ACC-00001", "title_type": "FREEHOLD"}', timestamp: '2025-11-10 15:30:00' },
    { id: uuidv4(), transaction_hash: '0x1234567890abcdef1234567890abcdef12345678', block_number: 12389, token_id: 'LND-GH-WR-00004', transaction_type: 'MINT', from_address: null, to_address: citizen.id, metadata: '{"parcel_id": "GH-WR-SEK-00004", "title_type": "LEASEHOLD"}', timestamp: '2025-10-30 16:00:00' },
    { id: uuidv4(), transaction_hash: '0xfedcba098765432109876543210987654321fedc', block_number: 12401, token_id: 'LND-GH-BAR-00007', transaction_type: 'MINT', from_address: null, to_address: citizen.id, metadata: '{"parcel_id": "GH-BAR-BOL-00007", "title_type": "FREEHOLD"}', timestamp: '2025-10-22 10:15:00' },
    { id: uuidv4(), transaction_hash: '0x9876543210fedcba9876543210fedcba98765432', block_number: 12456, token_id: 'LND-GH-GAR-00001', transaction_type: 'ENCUMBRANCE', from_address: citizen.id, to_address: officer.id, metadata: '{"type": "mortgage", "bank": "GCB Bank", "amount": 1200.00}', timestamp: '2025-10-26 10:00:00' }
  ];

  const insertBlockchainTx = db.prepare(`
    INSERT OR IGNORE INTO blockchain_transactions (id, transaction_hash, block_number, token_id, transaction_type, from_address, to_address, metadata, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  blockchainTxs.forEach(tx => {
    insertBlockchainTx.run(tx.id, tx.transaction_hash, tx.block_number, tx.token_id, tx.transaction_type, tx.from_address, tx.to_address, tx.metadata, tx.timestamp);
  });

  // Create integration logs
  const integrationLogs = [
    { id: uuidv4(), system_name: 'GELIS', endpoint: '/api/sync/parcel', method: 'POST', request_payload: '{"parcel_id": "GH-GAR-ACC-00001"}', response_payload: '{"success": true, "gelis_id": "GELIS-001"}', status_code: 200, success: 1, error_message: null, timestamp: '2025-11-10 15:35:00' },
    { id: uuidv4(), system_name: 'Mobile Money', endpoint: '/api/payment/process', method: 'POST', request_payload: '{"provider": "MTN", "amount": 500, "phone": "+233244123456"}', response_payload: '{"success": true, "reference": "MTN-REF-123456"}', status_code: 200, success: 1, error_message: null, timestamp: '2025-11-12 11:28:00' },
    { id: uuidv4(), system_name: 'GRA', endpoint: '/api/stamp-duty/calculate', method: 'POST', request_payload: '{"property_value": 500000, "transaction_type": "sale"}', response_payload: '{"stamp_duty": 2500, "processing_fee": 50}', status_code: 200, success: 1, error_message: null, timestamp: '2025-11-11 14:20:00' },
    { id: uuidv4(), system_name: 'GELIS', endpoint: '/api/sync/parcel', method: 'POST', request_payload: '{"parcel_id": "GH-ASH-KUM-00002"}', response_payload: null, status_code: 500, success: 0, error_message: 'Connection timeout', timestamp: '2025-11-08 09:15:00' }
  ];

  const insertIntegrationLog = db.prepare(`
    INSERT OR IGNORE INTO integration_logs (id, system_name, endpoint, method, request_payload, response_payload, status_code, success, error_message, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  integrationLogs.forEach(log => {
    insertIntegrationLog.run(log.id, log.system_name, log.endpoint, log.method, log.request_payload, log.response_payload, log.status_code, log.success, log.error_message, log.timestamp);
  });

  // Create mortgages
  const mortgages = [
    { id: uuidv4(), mortgage_id: 'MTG-2025-001', parcel_id: parcels[0].id, lender_name: 'GCB Bank', lender_contact: '+233302664910', borrower_id: citizen.id, loan_amount: 150000.00, interest_rate: 18.5, duration_months: 240, start_date: '2025-01-15', maturity_date: '2045-01-15', status: 'active', priority: 1, documents: '[]', blockchain_hash: '0xmortgage123', registered_at: '2025-01-15 10:00:00', registered_by: officer.id, discharged_at: null, notes: 'Residential property mortgage' },
    { id: uuidv4(), mortgage_id: 'MTG-2025-002', parcel_id: parcels[6].id, lender_name: 'Stanbic Bank', lender_contact: '+233302610800', borrower_id: citizen.id, loan_amount: 250000.00, interest_rate: 20.0, duration_months: 180, start_date: '2025-02-10', maturity_date: '2040-02-10', status: 'active', priority: 1, documents: '[]', blockchain_hash: '0xmortgage456', registered_at: '2025-02-10 14:30:00', registered_by: officer.id, discharged_at: null, notes: 'Commercial property financing' },
    { id: uuidv4(), mortgage_id: 'MTG-2024-003', parcel_id: parcels[3].id, lender_name: 'Ecobank Ghana', lender_contact: '+233302681010', borrower_id: citizen.id, loan_amount: 500000.00, interest_rate: 19.0, duration_months: 180, start_date: '2024-06-01', maturity_date: '2039-06-01', status: 'discharged', priority: 1, documents: '[]', blockchain_hash: '0xmortgage789', registered_at: '2024-06-01 09:00:00', registered_by: officer.id, discharged_at: '2025-11-01 11:00:00', notes: 'Mortgage discharged - loan fully paid' }
  ];

  const insertMortgage = db.prepare(`
    INSERT OR IGNORE INTO mortgages (id, mortgage_id, parcel_id, lender_name, lender_contact, borrower_id, loan_amount, interest_rate, duration_months, start_date, maturity_date, status, priority, documents, blockchain_hash, registered_at, registered_by, discharged_at, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  mortgages.forEach(mortgage => {
    insertMortgage.run(mortgage.id, mortgage.mortgage_id, mortgage.parcel_id, mortgage.lender_name, mortgage.lender_contact, mortgage.borrower_id, mortgage.loan_amount, mortgage.interest_rate, mortgage.duration_months, mortgage.start_date, mortgage.maturity_date, mortgage.status, mortgage.priority, mortgage.documents, mortgage.blockchain_hash, mortgage.registered_at, mortgage.registered_by, mortgage.discharged_at, mortgage.notes);
  });

  // Create documents
  const documents = [
    { id: uuidv4(), document_id: 'DOC-2025-001', filename: 'title_deed_001.pdf', original_filename: 'Title Deed - GH-GAR-ACC-00001.pdf', file_type: 'application/pdf', file_size: 524288, file_path: '/uploads/documents/title_deed_001.pdf', document_type: 'TITLE_DEED', related_entity_type: 'title', related_entity_id: titles[0].id, uploaded_by: citizen.id, hash: 'sha256_abc123', blockchain_hash: '0xdoc123', verified: 1, verified_by: officer.id, verified_at: '2025-11-10 16:00:00', ocr_text: 'Title Deed Certificate...', metadata: '{"pages": 3}', created_at: '2025-11-10 15:00:00' },
    { id: uuidv4(), document_id: 'DOC-2025-002', filename: 'survey_plan_002.pdf', original_filename: 'Survey Plan - GH-ASH-KUM-00002.pdf', file_type: 'application/pdf', file_size: 1048576, file_path: '/uploads/documents/survey_plan_002.pdf', document_type: 'SURVEY_PLAN', related_entity_type: 'survey', related_entity_id: surveys[1].id, uploaded_by: surveyor.id, hash: 'sha256_def456', blockchain_hash: null, verified: 0, verified_by: null, verified_at: null, ocr_text: null, metadata: '{"pages": 5}', created_at: '2025-11-05 10:30:00' },
    { id: uuidv4(), document_id: 'DOC-2025-003', filename: 'id_card_citizen.jpg', original_filename: 'Ghana Card - Kofi Mensah.jpg', file_type: 'image/jpeg', file_size: 204800, file_path: '/uploads/documents/id_card_citizen.jpg', document_type: 'ID_CARD', related_entity_type: 'user', related_entity_id: citizen.id, uploaded_by: citizen.id, hash: 'sha256_ghi789', blockchain_hash: null, verified: 1, verified_by: officer.id, verified_at: '2025-11-08 14:00:00', ocr_text: 'KOFI MENSAH\nGHANA CARD: GHA-123456789-0', metadata: '{"type": "Ghana Card"}', created_at: '2025-11-08 13:00:00' }
  ];

  const insertDocument = db.prepare(`
    INSERT OR IGNORE INTO documents (id, document_id, filename, original_filename, file_type, file_size, file_path, document_type, related_entity_type, related_entity_id, uploaded_by, hash, blockchain_hash, verified, verified_by, verified_at, ocr_text, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  documents.forEach(doc => {
    insertDocument.run(doc.id, doc.document_id, doc.filename, doc.original_filename, doc.file_type, doc.file_size, doc.file_path, doc.document_type, doc.related_entity_type, doc.related_entity_id, doc.uploaded_by, doc.hash, doc.blockchain_hash, doc.verified, doc.verified_by, doc.verified_at, doc.ocr_text, doc.metadata, doc.created_at);
  });

  // Create notifications
  const notifications = [
    { id: uuidv4(), user_id: citizen.id, type: 'title_issued', title: 'Land Title Issued', message: 'Your land title TIT-GH-2025-00001 has been successfully issued and is now available for download.', data: JSON.stringify({ title_id: titles[0].id }), channels: '["email", "sms", "in_app"]', read: 1, sent_at: '2025-11-10 15:30:00', read_at: '2025-11-10 16:00:00' },
    { id: uuidv4(), user_id: citizen.id, type: 'payment_receipt', title: 'Payment Received', message: 'Your payment of GHS 500.00 for application APP-2025-001 has been successfully processed.', data: JSON.stringify({ payment_id: payments[1].id }), channels: '["email", "sms"]', read: 1, sent_at: '2025-11-12 11:35:00', read_at: '2025-11-12 12:00:00' },
    { id: uuidv4(), user_id: citizen.id, type: 'application_update', title: 'Application Under Review', message: 'Your land application APP-2025-001 is currently under review by our lands officer.', data: JSON.stringify({ application_id: applications[0].id }), channels: '["in_app", "email"]', read: 0, sent_at: '2025-11-12 10:35:00', read_at: null },
    { id: uuidv4(), user_id: surveyor.id, type: 'survey_approved', title: 'Survey Approved', message: 'Your survey SUR-2025-001 has been approved by the lands commission.', data: JSON.stringify({ survey_id: surveys[0].id }), channels: '["in_app", "email", "sms"]', read: 1, sent_at: '2025-11-02 09:00:00', read_at: '2025-11-02 09:30:00' },
    { id: uuidv4(), user_id: citizen.id, type: 'mortgage_registered', title: 'Mortgage Registered', message: 'Mortgage MTG-2025-001 with GCB Bank has been successfully registered on your property.', data: JSON.stringify({ mortgage_id: mortgages[0].id }), channels: '["email", "sms", "in_app"]', read: 0, sent_at: '2025-01-15 10:30:00', read_at: null }
  ];

  const insertNotification = db.prepare(`
    INSERT OR IGNORE INTO notifications (id, user_id, type, title, message, data, channels, read, sent_at, read_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  notifications.forEach(notif => {
    insertNotification.run(notif.id, notif.user_id, notif.type, notif.title, notif.message, notif.data, notif.channels, notif.read, notif.sent_at, notif.read_at);
  });

  // Create notification settings for all users
  const allUsers = db.prepare('SELECT id FROM users').all();
  const insertNotificationSettings = db.prepare(`
    INSERT OR IGNORE INTO notification_settings (user_id, sms_enabled, email_enabled, push_enabled, application_updates, payment_receipts, survey_status, title_updates, mortgage_updates)
    VALUES (?, 1, 1, 1, 1, 1, 1, 1, 1)
  `);

  allUsers.forEach(user => {
    insertNotificationSettings.run(user.id);
  });

  console.log('✅ Comprehensive demo data created');
  console.log('   📦 7 parcels across different regions');
  console.log('   📐 5 surveys with various statuses');
  console.log('   📜 4 title certificates');
  console.log('   📝 5 applications in different stages');
  console.log('   💳 6 payments with multiple methods');
  console.log('   ⛓️  4 blockchain transactions');
  console.log('   🔗 4 integration logs');
  console.log('   🏦 3 mortgages (2 active, 1 discharged)');
  console.log('   📄 3 documents (verified and pending)');
  console.log('   🔔 5 notifications (read and unread)');
}

function getDatabase() {
  return db;
}

module.exports = {
  initDatabase,
  getDatabase
};
