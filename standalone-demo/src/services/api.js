// Mock API service - no backend needed
// Simulates all API calls with hardcoded data

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const MOCK_DEMO_USERS = [
  {
    username: 'kofi.mensah@example.com',
    password: 'password123',
    role: 'Citizen',
    description: 'View parcels, submit applications, make payments'
  },
  {
    username: 'ama.adjei@example.com',
    password: 'password123',
    role: 'Surveyor',
    description: 'Submit surveys, record GPS data, upload survey documents'
  },
  {
    username: 'abena.osei@example.com',
    password: 'password123',
    role: 'Lands Officer',
    description: 'Approve applications, issue titles, verify documents, manage mortgages'
  },
  {
    username: 'kwame.nkrumah@example.com',
    password: 'password123',
    role: 'Administrator',
    description: 'Full system access, user management, system integrations'
  }
];

const MOCK_PARCELS = [
  {
    id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    location: 'East Legon, Accra',
    region: 'Greater Accra',
    district: 'Accra Metropolitan',
    area: '2.5 hectares',
    area_sqm: 25000,
    landUse: 'Residential',
    land_use: 'Residential',
    status: 'Registered',
    owner: 'Kofi Mensah',
    owner_id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    registrationDate: '2024-01-15',
    registration_date: '2024-01-15',
    lastUpdated: '2024-11-10',
    last_updated: '2024-11-10',
    coordinates: [5.6400, -0.1500],
    boundary_coordinates: [[5.6400, -0.1500], [5.6410, -0.1500], [5.6410, -0.1490], [5.6400, -0.1490]],
    valuation: 95000,
    title_number: 'GA/2024/001/TL'
  },
  {
    id: 'GH-ACC-12346',
    parcel_number: 'GH-ACC-12346',
    location: 'Cantonments, Accra',
    region: 'Greater Accra',
    district: 'Accra Metropolitan',
    area: '1.8 hectares',
    area_sqm: 18000,
    landUse: 'Commercial',
    land_use: 'Commercial',
    status: 'Pending',
    owner: 'Ama Adjei',
    owner_id: '430ab24f-6fba-449a-84b7-885eadefc674',
    registrationDate: '2024-02-20',
    registration_date: '2024-02-20',
    lastUpdated: '2024-11-12',
    last_updated: '2024-11-12',
    coordinates: [5.5800, -0.1900],
    boundary_coordinates: [[5.5800, -0.1900], [5.5810, -0.1900], [5.5810, -0.1890], [5.5800, -0.1890]],
    valuation: 120000,
    title_number: null
  },
  {
    id: 'GH-ASH-45678',
    parcel_number: 'GH-ASH-45678',
    location: 'Kumasi Central',
    region: 'Ashanti',
    district: 'Kumasi Metropolitan',
    area: '3.2 hectares',
    area_sqm: 32000,
    landUse: 'Agricultural',
    land_use: 'Agricultural',
    status: 'Registered',
    owner: 'Kwame Nkrumah',
    owner_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    registrationDate: '2023-11-05',
    registration_date: '2023-11-05',
    lastUpdated: '2024-11-01',
    last_updated: '2024-11-01',
    coordinates: [6.6885, -1.6244],
    boundary_coordinates: [[6.6885, -1.6244], [6.6895, -1.6244], [6.6895, -1.6234], [6.6885, -1.6234]],
    valuation: 75000,
    title_number: 'AS/2023/045/TL'
  },
  {
    id: 'GH-WR-78910',
    parcel_number: 'GH-WR-78910',
    location: 'Takoradi',
    region: 'Western',
    district: 'Sekondi-Takoradi',
    area: '1.5 hectares',
    area_sqm: 15000,
    landUse: 'Industrial',
    land_use: 'Industrial',
    status: 'Verified',
    owner: 'Abena Osei',
    owner_id: '8c9f2d4e-1a3b-4c5d-6e7f-8g9h0i1j2k3l',
    registrationDate: '2024-03-10',
    registration_date: '2024-03-10',
    lastUpdated: '2024-11-08',
    last_updated: '2024-11-08',
    coordinates: [4.8965, -1.7537],
    boundary_coordinates: [[4.8965, -1.7537], [4.8975, -1.7537], [4.8975, -1.7527], [4.8965, -1.7527]],
    valuation: 180000,
    title_number: 'WR/2024/078/TL'
  },
  {
    id: 'GH-NR-11213',
    parcel_number: 'GH-NR-11213',
    location: 'Tamale',
    region: 'Northern',
    district: 'Tamale Metropolitan',
    area: '5.0 hectares',
    area_sqm: 50000,
    landUse: 'Residential',
    land_use: 'Residential',
    status: 'Processing',
    owner: 'Yaw Mensah',
    owner_id: 'b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6',
    registrationDate: '2024-10-01',
    registration_date: '2024-10-01',
    lastUpdated: '2024-11-13',
    last_updated: '2024-11-13',
    coordinates: [9.4008, -0.8393],
    boundary_coordinates: [[9.4008, -0.8393], [9.4018, -0.8393], [9.4018, -0.8383], [9.4008, -0.8383]],
    valuation: 85000,
    title_number: null
  }
];

const MOCK_TITLES = [
  {
    id: 'TL-2024-001',
    parcelId: 'GH-ACC-12345',
    parcel_id: 'GH-ACC-12345',
    titleNumber: 'GA/2024/001/TL',
    title_number: 'GA/2024/001/TL',
    owner: 'Kofi Mensah',
    owner_id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    issueDate: '2024-01-20',
    issue_date: '2024-01-20',
    status: 'Active',
    type: 'Freehold',
    title_type: 'Freehold',
    blockchainHash: '0x1a2b3c4d5e6f7g8h9i0j',
    blockchain_hash: '0x1a2b3c4d5e6f7g8h9i0j',
    location: 'East Legon, Accra',
    area: '2.5 hectares',
    certificate_url: '/certificates/TL-2024-001.pdf'
  },
  {
    id: 'TL-2023-045',
    parcelId: 'GH-ASH-45678',
    parcel_id: 'GH-ASH-45678',
    titleNumber: 'AS/2023/045/TL',
    title_number: 'AS/2023/045/TL',
    owner: 'Kwame Nkrumah',
    owner_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    issueDate: '2023-11-15',
    issue_date: '2023-11-15',
    status: 'Active',
    type: 'Leasehold',
    title_type: 'Leasehold',
    blockchainHash: '0x2b3c4d5e6f7g8h9i0j1k',
    blockchain_hash: '0x2b3c4d5e6f7g8h9i0j1k',
    location: 'Kumasi Central',
    area: '3.2 hectares',
    certificate_url: '/certificates/TL-2023-045.pdf',
    lease_expiry: '2073-11-15'
  },
  {
    id: 'TL-2024-078',
    parcelId: 'GH-WR-78910',
    parcel_id: 'GH-WR-78910',
    titleNumber: 'WR/2024/078/TL',
    title_number: 'WR/2024/078/TL',
    owner: 'Abena Osei',
    owner_id: '8c9f2d4e-1a3b-4c5d-6e7f-8g9h0i1j2k3l',
    issueDate: '2024-03-25',
    issue_date: '2024-03-25',
    status: 'Active',
    type: 'Freehold',
    title_type: 'Freehold',
    blockchainHash: '0x3c4d5e6f7g8h9i0j1k2l',
    blockchain_hash: '0x3c4d5e6f7g8h9i0j1k2l',
    location: 'Takoradi',
    area: '1.5 hectares',
    certificate_url: '/certificates/TL-2024-078.pdf'
  }
];

const MOCK_APPLICATIONS = [
  {
    id: 'APP-2024-001',
    application_number: 'APP-2024-001',
    type: 'Land Registration',
    application_type: 'Land Registration',
    parcelId: 'GH-ACC-12345',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    applicant: 'Kofi Mensah',
    applicant_id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    submittedDate: '2024-01-10',
    submitted_date: '2024-01-10',
    status: 'Approved',
    progress: 100,
    currentStage: 'Completed',
    current_stage: 'Completed',
    location: 'East Legon, Accra',
    area: '2.5 hectares',
    decision_date: '2024-01-18',
    decision: 'Approved',
    remarks: 'All documents verified and approved'
  },
  {
    id: 'APP-2024-012',
    application_number: 'APP-2024-012',
    type: 'Title Transfer',
    application_type: 'Title Transfer',
    parcelId: 'GH-ACC-12346',
    parcel_id: 'GH-ACC-12346',
    parcel_number: 'GH-ACC-12346',
    applicant: 'Ama Adjei',
    applicant_id: '430ab24f-6fba-449a-84b7-885eadefc674',
    submittedDate: '2024-02-15',
    submitted_date: '2024-02-15',
    status: 'Processing',
    progress: 60,
    currentStage: 'Verification',
    current_stage: 'Verification',
    location: 'Cantonments, Accra',
    area: '1.8 hectares',
    remarks: 'Awaiting final verification from land office'
  },
  {
    id: 'APP-2024-025',
    application_number: 'APP-2024-025',
    type: 'Survey Request',
    application_type: 'Survey Request',
    parcelId: 'GH-NR-11213',
    parcel_id: 'GH-NR-11213',
    parcel_number: 'GH-NR-11213',
    applicant: 'Yaw Mensah',
    applicant_id: 'b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6',
    submittedDate: '2024-10-05',
    submitted_date: '2024-10-05',
    status: 'Pending',
    progress: 25,
    currentStage: 'Initial Review',
    current_stage: 'Initial Review',
    location: 'Tamale',
    area: '5.0 hectares',
    remarks: 'Application under initial review'
  },
  {
    id: 'APP-2023-089',
    application_number: 'APP-2023-089',
    type: 'Land Registration',
    application_type: 'Land Registration',
    parcelId: 'GH-ASH-45678',
    parcel_id: 'GH-ASH-45678',
    parcel_number: 'GH-ASH-45678',
    applicant: 'Kwame Nkrumah',
    applicant_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    submittedDate: '2023-10-20',
    submitted_date: '2023-10-20',
    status: 'Approved',
    progress: 100,
    currentStage: 'Completed',
    current_stage: 'Completed',
    location: 'Kumasi Central',
    area: '3.2 hectares',
    decision_date: '2023-11-05',
    decision: 'Approved',
    remarks: 'Agricultural land registration completed successfully'
  },
  {
    id: 'APP-2024-034',
    application_number: 'APP-2024-034',
    type: 'Subdivision',
    application_type: 'Subdivision',
    parcelId: 'GH-WR-78910',
    parcel_id: 'GH-WR-78910',
    parcel_number: 'GH-WR-78910',
    applicant: 'Abena Osei',
    applicant_id: '8c9f2d4e-1a3b-4c5d-6e7f-8g9h0i1j2k3l',
    submittedDate: '2024-05-12',
    submitted_date: '2024-05-12',
    status: 'Processing',
    progress: 45,
    currentStage: 'Survey',
    current_stage: 'Survey',
    location: 'Takoradi',
    area: '1.5 hectares',
    remarks: 'Subdivision survey in progress'
  },
  {
    id: 'APP-2024-041',
    application_number: 'APP-2024-041',
    type: 'Mortgage Registration',
    application_type: 'Mortgage Registration',
    parcelId: 'GH-ACC-12345',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    applicant: 'Ghana Commercial Bank',
    applicant_id: 'bank-gcb-001',
    submittedDate: '2024-02-25',
    submitted_date: '2024-02-25',
    status: 'Approved',
    progress: 100,
    currentStage: 'Completed',
    current_stage: 'Completed',
    location: 'East Legon, Accra',
    area: '2.5 hectares',
    decision_date: '2024-03-01',
    decision: 'Approved',
    remarks: 'Mortgage registration completed'
  }
];

const MOCK_MORTGAGES = [
  {
    id: 'MTG-2024-001',
    mortgage_id: 'MTG-2024-001',
    parcel_id: 'GH-ACC-12345',
    parcelId: 'GH-ACC-12345',
    titleId: 'TL-2024-001',
    title_id: 'TL-2024-001',
    title_number: 'GA/2024/001/TL',
    lender: 'Ghana Commercial Bank',
    lender_name: 'Ghana Commercial Bank',
    lender_id: 'bank-gcb-001',
    borrower_name: 'Kofi Mensah',
    borrower_id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    amount: 'GHS 250,000',
    loan_amount: 250000,
    startDate: '2024-03-01',
    start_date: '2024-03-01',
    registration_date: '2024-03-01',
    endDate: '2044-03-01',
    end_date: '2044-03-01',
    maturity_date: '2044-03-01',
    status: 'active',
    interestRate: '12.5%',
    interest_rate: 12.5,
    duration_months: 240,
    duration_years: 20,
    monthly_payment: 2750,
    outstanding_balance: 245000,
    original_amount: 250000,
    paid_amount: 5000,
    location: 'East Legon, Accra',
    purpose: 'Property Purchase',
    notes: 'Standard residential mortgage'
  },
  {
    id: 'MTG-2023-045',
    mortgage_id: 'MTG-2023-045',
    parcel_id: 'GH-ASH-45678',
    parcelId: 'GH-ASH-45678',
    titleId: 'TL-2023-045',
    title_id: 'TL-2023-045',
    title_number: 'AS/2023/045/TL',
    lender: 'Agricultural Development Bank',
    lender_name: 'Agricultural Development Bank',
    lender_id: 'bank-adb-001',
    borrower_name: 'Kwame Nkrumah',
    borrower_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    amount: 'GHS 150,000',
    loan_amount: 150000,
    startDate: '2023-12-01',
    start_date: '2023-12-01',
    registration_date: '2023-12-01',
    endDate: '2033-12-01',
    end_date: '2033-12-01',
    maturity_date: '2033-12-01',
    status: 'active',
    interestRate: '10.5%',
    interest_rate: 10.5,
    duration_months: 120,
    duration_years: 10,
    monthly_payment: 2050,
    outstanding_balance: 138000,
    original_amount: 150000,
    paid_amount: 12000,
    location: 'Kumasi Central',
    purpose: 'Agricultural Development',
    notes: 'Agricultural land development loan'
  },
  {
    id: 'MTG-2024-078',
    mortgage_id: 'MTG-2024-078',
    parcel_id: 'GH-WR-78910',
    parcelId: 'GH-WR-78910',
    titleId: 'TL-2024-078',
    title_id: 'TL-2024-078',
    title_number: 'WR/2024/078/TL',
    lender: 'Ecobank Ghana',
    lender_name: 'Ecobank Ghana',
    lender_id: 'bank-eco-001',
    borrower_name: 'Abena Osei',
    borrower_id: '8c9f2d4e-1a3b-4c5d-6e7f-8g9h0i1j2k3l',
    amount: 'GHS 350,000',
    loan_amount: 350000,
    startDate: '2024-04-15',
    start_date: '2024-04-15',
    registration_date: '2024-04-15',
    endDate: '2039-04-15',
    end_date: '2039-04-15',
    maturity_date: '2039-04-15',
    status: 'active',
    interestRate: '13.0%',
    interest_rate: 13.0,
    duration_months: 180,
    duration_years: 15,
    monthly_payment: 4480,
    outstanding_balance: 346500,
    original_amount: 350000,
    paid_amount: 3500,
    location: 'Takoradi',
    purpose: 'Industrial Development',
    notes: 'Commercial/industrial property mortgage'
  },
  {
    id: 'MTG-2024-102',
    mortgage_id: 'MTG-2024-102',
    parcel_id: 'GH-ACC-12346',
    parcelId: 'GH-ACC-12346',
    titleId: null,
    title_id: null,
    title_number: null,
    lender: 'Stanbic Bank Ghana',
    lender_name: 'Stanbic Bank Ghana',
    lender_id: 'bank-stb-001',
    borrower_name: 'Ama Adjei',
    borrower_id: '430ab24f-6fba-449a-84b7-885eadefc674',
    amount: 'GHS 180,000',
    loan_amount: 180000,
    startDate: '2024-06-01',
    start_date: '2024-06-01',
    registration_date: '2024-06-01',
    endDate: '2039-06-01',
    end_date: '2039-06-01',
    maturity_date: '2039-06-01',
    status: 'pending',
    interestRate: '12.0%',
    interest_rate: 12.0,
    duration_months: 180,
    duration_years: 15,
    monthly_payment: 2160,
    outstanding_balance: 180000,
    original_amount: 180000,
    paid_amount: 0,
    location: 'Cantonments, Accra',
    purpose: 'Commercial Property',
    notes: 'Pending title registration completion'
  }
];

const MOCK_DOCUMENTS = [
  {
    id: 'DOC-001',
    document_id: 'DOC-001',
    name: 'Land Certificate - GH-ACC-12345.pdf',
    title: 'Land Certificate',
    type: 'Land Certificate',
    document_type: 'Land Certificate',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    uploadDate: '2024-01-20',
    upload_date: '2024-01-20',
    uploaded_by: 'Kofi Mensah',
    uploader_id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    size: '2.4 MB',
    file_size: 2400000,
    status: 'Verified',
    verification_status: 'Verified',
    qrCode: 'QR-CERT-12345',
    qr_code: 'QR-CERT-12345',
    blockchain_hash: '0x1a2b3c4d5e6f7g8h9i0j',
    download_url: '/documents/DOC-001.pdf',
    description: 'Official land certificate for parcel GH-ACC-12345',
    verified_by: 'Land Officer',
    verified_date: '2024-01-21'
  },
  {
    id: 'DOC-002',
    document_id: 'DOC-002',
    name: 'Survey Report - GH-ACC-12345.pdf',
    title: 'Survey Report',
    type: 'Survey Report',
    document_type: 'Survey Report',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    uploadDate: '2024-01-18',
    upload_date: '2024-01-18',
    uploaded_by: 'Ama Adjei',
    uploader_id: '430ab24f-6fba-449a-84b7-885eadefc674',
    size: '5.1 MB',
    file_size: 5100000,
    status: 'Verified',
    verification_status: 'Verified',
    qrCode: 'QR-SURV-12345',
    qr_code: 'QR-SURV-12345',
    blockchain_hash: '0x2b3c4d5e6f7g8h9i0j1k',
    download_url: '/documents/DOC-002.pdf',
    description: 'Professional survey report with boundary coordinates',
    verified_by: 'Survey Department',
    verified_date: '2024-01-19'
  },
  {
    id: 'DOC-003',
    document_id: 'DOC-003',
    name: 'Indenture - GH-ASH-45678.pdf',
    title: 'Indenture',
    type: 'Indenture',
    document_type: 'Indenture',
    parcel_id: 'GH-ASH-45678',
    parcel_number: 'GH-ASH-45678',
    uploadDate: '2023-11-10',
    upload_date: '2023-11-10',
    uploaded_by: 'Kwame Nkrumah',
    uploader_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    size: '3.2 MB',
    file_size: 3200000,
    status: 'Verified',
    verification_status: 'Verified',
    qrCode: 'QR-IND-45678',
    qr_code: 'QR-IND-45678',
    blockchain_hash: '0x3c4d5e6f7g8h9i0j1k2l',
    download_url: '/documents/DOC-003.pdf',
    description: 'Legal indenture document for agricultural land',
    verified_by: 'Legal Department',
    verified_date: '2023-11-12'
  },
  {
    id: 'DOC-004',
    document_id: 'DOC-004',
    name: 'Mortgage Agreement - MTG-2024-001.pdf',
    title: 'Mortgage Agreement',
    type: 'Mortgage Agreement',
    document_type: 'Mortgage Agreement',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    uploadDate: '2024-03-01',
    upload_date: '2024-03-01',
    uploaded_by: 'Ghana Commercial Bank',
    uploader_id: 'bank-gcb-001',
    size: '1.8 MB',
    file_size: 1800000,
    status: 'Verified',
    verification_status: 'Verified',
    qrCode: 'QR-MTG-001',
    qr_code: 'QR-MTG-001',
    blockchain_hash: '0x4d5e6f7g8h9i0j1k2l3m',
    download_url: '/documents/DOC-004.pdf',
    description: 'Mortgage agreement between GCB and borrower',
    verified_by: 'Mortgage Officer',
    verified_date: '2024-03-02'
  },
  {
    id: 'DOC-005',
    document_id: 'DOC-005',
    name: 'Title Certificate - GA-2024-001-TL.pdf',
    title: 'Title Certificate',
    type: 'Title Certificate',
    document_type: 'Title Certificate',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    uploadDate: '2024-01-20',
    upload_date: '2024-01-20',
    uploaded_by: 'Land Commission',
    uploader_id: 'admin-lc-001',
    size: '1.2 MB',
    file_size: 1200000,
    status: 'Verified',
    verification_status: 'Verified',
    qrCode: 'QR-TITLE-001',
    qr_code: 'QR-TITLE-001',
    blockchain_hash: '0x5e6f7g8h9i0j1k2l3m4n',
    download_url: '/documents/DOC-005.pdf',
    description: 'Official title certificate GA/2024/001/TL',
    verified_by: 'Registrar',
    verified_date: '2024-01-20'
  },
  {
    id: 'DOC-006',
    document_id: 'DOC-006',
    name: 'Site Plan - GH-WR-78910.pdf',
    title: 'Site Plan',
    type: 'Site Plan',
    document_type: 'Site Plan',
    parcel_id: 'GH-WR-78910',
    parcel_number: 'GH-WR-78910',
    uploadDate: '2024-03-08',
    upload_date: '2024-03-08',
    uploaded_by: 'Abena Osei',
    uploader_id: '8c9f2d4e-1a3b-4c5d-6e7f-8g9h0i1j2k3l',
    size: '4.5 MB',
    file_size: 4500000,
    status: 'Verified',
    verification_status: 'Verified',
    qrCode: 'QR-SITE-78910',
    qr_code: 'QR-SITE-78910',
    blockchain_hash: '0x6f7g8h9i0j1k2l3m4n5o',
    download_url: '/documents/DOC-006.pdf',
    description: 'Industrial site development plan',
    verified_by: 'Planning Department',
    verified_date: '2024-03-09'
  },
  {
    id: 'DOC-007',
    document_id: 'DOC-007',
    name: 'Application Form - APP-2024-012.pdf',
    title: 'Application Form',
    type: 'Application Form',
    document_type: 'Application Form',
    parcel_id: 'GH-ACC-12346',
    parcel_number: 'GH-ACC-12346',
    uploadDate: '2024-02-15',
    upload_date: '2024-02-15',
    uploaded_by: 'Ama Adjei',
    uploader_id: '430ab24f-6fba-449a-84b7-885eadefc674',
    size: '850 KB',
    file_size: 850000,
    status: 'Pending Review',
    verification_status: 'Pending Review',
    qrCode: 'QR-APP-012',
    qr_code: 'QR-APP-012',
    blockchain_hash: null,
    download_url: '/documents/DOC-007.pdf',
    description: 'Title transfer application form',
    verified_by: null,
    verified_date: null
  },
  {
    id: 'DOC-008',
    document_id: 'DOC-008',
    name: 'Environmental Assessment - GH-ASH-45678.pdf',
    title: 'Environmental Assessment',
    type: 'Environmental Report',
    document_type: 'Environmental Report',
    parcel_id: 'GH-ASH-45678',
    parcel_number: 'GH-ASH-45678',
    uploadDate: '2023-10-28',
    upload_date: '2023-10-28',
    uploaded_by: 'Kwame Nkrumah',
    uploader_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    size: '6.8 MB',
    file_size: 6800000,
    status: 'Verified',
    verification_status: 'Verified',
    qrCode: 'QR-ENV-45678',
    qr_code: 'QR-ENV-45678',
    blockchain_hash: '0x7g8h9i0j1k2l3m4n5o6p',
    download_url: '/documents/DOC-008.pdf',
    description: 'Environmental impact assessment for agricultural use',
    verified_by: 'EPA Officer',
    verified_date: '2023-11-01'
  }
];

const MOCK_PAYMENTS = [
  {
    id: 'PAY-2024-001',
    payment_id: 'PAY-2024-001',
    transaction_id: 'TXN-MTN-20240115-001',
    date: '2024-01-15',
    payment_date: '2024-01-15',
    timestamp: '2024-01-15T10:30:00Z',
    created_at: '2024-01-15T10:30:00Z',
    amount: 500,
    amount_value: 500,
    currency: 'GHS',
    method: 'Mobile Money (MTN)',
    payment_method: 'Mobile Money (MTN)',
    provider: 'MTN',
    purpose: 'Land Registration Fee',
    payment_purpose: 'Land Registration Fee',
    status: 'completed',
    payment_status: 'completed',
    reference: 'MTN-20240115-001',
    reference_number: 'MTN-20240115-001',
    payer_name: 'Kofi Mensah',
    payer_id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    user_id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    payer_phone: '+233 24 123 4567',
    parcel_id: 'GH-ACC-12345',
    application_id: 'APP-2024-001',
    description: 'Payment for land registration services'
  },
  {
    id: 'PAY-2024-002',
    payment_id: 'PAY-2024-002',
    transaction_id: 'TXN-VISA-20240120-002',
    date: '2024-01-20',
    payment_date: '2024-01-20',
    timestamp: '2024-01-20T14:45:00Z',
    created_at: '2024-01-20T14:45:00Z',
    amount: 150,
    amount_value: 150,
    currency: 'GHS',
    method: 'Card (Visa)',
    payment_method: 'Card (Visa)',
    provider: 'Visa',
    purpose: 'Title Certificate Fee',
    payment_purpose: 'Title Certificate Fee',
    status: 'completed',
    payment_status: 'completed',
    reference: 'VISA-20240120-002',
    reference_number: 'VISA-20240120-002',
    payer_name: 'Kofi Mensah',
    payer_id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    user_id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    payer_phone: '+233 24 123 4567',
    parcel_id: 'GH-ACC-12345',
    application_id: 'APP-2024-001',
    description: 'Payment for title certificate issuance'
  },
  {
    id: 'PAY-2024-003',
    payment_id: 'PAY-2024-003',
    transaction_id: 'TXN-VOD-20240220-003',
    date: '2024-02-20',
    payment_date: '2024-02-20',
    timestamp: '2024-02-20T09:15:00Z',
    created_at: '2024-02-20T09:15:00Z',
    amount: 800,
    amount_value: 800,
    currency: 'GHS',
    method: 'Mobile Money (Vodafone)',
    payment_method: 'Mobile Money (Vodafone)',
    provider: 'Vodafone',
    purpose: 'Survey Fee',
    payment_purpose: 'Survey Fee',
    status: 'completed',
    payment_status: 'completed',
    reference: 'VOD-20240220-003',
    reference_number: 'VOD-20240220-003',
    payer_name: 'Ama Adjei',
    payer_id: '430ab24f-6fba-449a-84b7-885eadefc674',
    user_id: '430ab24f-6fba-449a-84b7-885eadefc674',
    payer_phone: '+233 20 234 5678',
    parcel_id: 'GH-ACC-12346',
    application_id: 'APP-2024-012',
    description: 'Payment for professional land survey services'
  },
  {
    id: 'PAY-2024-004',
    payment_id: 'PAY-2024-004',
    transaction_id: 'TXN-BANK-20241001-004',
    date: '2024-10-01',
    payment_date: '2024-10-01',
    timestamp: '2024-10-01T11:20:00Z',
    created_at: '2024-10-01T11:20:00Z',
    amount: 1200,
    amount_value: 1200,
    currency: 'GHS',
    method: 'Bank Transfer',
    payment_method: 'Bank Transfer',
    provider: 'GCB Bank',
    purpose: 'Application Processing',
    payment_purpose: 'Application Processing',
    status: 'pending',
    payment_status: 'pending',
    reference: 'BANK-20241001-004',
    reference_number: 'BANK-20241001-004',
    payer_name: 'Yaw Mensah',
    payer_id: 'b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6',
    user_id: 'b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6',
    payer_phone: '+233 55 345 6789',
    parcel_id: 'GH-NR-11213',
    application_id: 'APP-2024-025',
    description: 'Payment for survey request application'
  },
  {
    id: 'PAY-2023-089',
    payment_id: 'PAY-2023-089',
    transaction_id: 'TXN-MTN-20231105-089',
    date: '2023-11-05',
    payment_date: '2023-11-05',
    timestamp: '2023-11-05T16:30:00Z',
    created_at: '2023-11-05T16:30:00Z',
    amount: 650,
    amount_value: 650,
    currency: 'GHS',
    method: 'Mobile Money (MTN)',
    payment_method: 'Mobile Money (MTN)',
    provider: 'MTN',
    purpose: 'Land Registration Fee',
    payment_purpose: 'Land Registration Fee',
    status: 'completed',
    payment_status: 'completed',
    reference: 'MTN-20231105-089',
    reference_number: 'MTN-20231105-089',
    payer_name: 'Kwame Nkrumah',
    payer_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    user_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    payer_phone: '+233 26 456 7890',
    parcel_id: 'GH-ASH-45678',
    application_id: 'APP-2023-089',
    description: 'Payment for agricultural land registration'
  },
  {
    id: 'PAY-2024-034',
    payment_id: 'PAY-2024-034',
    transaction_id: 'TXN-CARD-20240512-034',
    date: '2024-05-12',
    payment_date: '2024-05-12',
    timestamp: '2024-05-12T13:00:00Z',
    created_at: '2024-05-12T13:00:00Z',
    amount: 950,
    amount_value: 950,
    currency: 'GHS',
    method: 'Card (Mastercard)',
    payment_method: 'Card (Mastercard)',
    provider: 'Mastercard',
    purpose: 'Subdivision Fee',
    payment_purpose: 'Subdivision Fee',
    status: 'completed',
    payment_status: 'completed',
    reference: 'MCARD-20240512-034',
    reference_number: 'MCARD-20240512-034',
    payer_name: 'Abena Osei',
    payer_id: '8c9f2d4e-1a3b-4c5d-6e7f-8g9h0i1j2k3l',
    user_id: '8c9f2d4e-1a3b-4c5d-6e7f-8g9h0i1j2k3l',
    payer_phone: '+233 50 567 8901',
    parcel_id: 'GH-WR-78910',
    application_id: 'APP-2024-034',
    description: 'Payment for land subdivision application'
  },
  {
    id: 'PAY-2024-041',
    payment_id: 'PAY-2024-041',
    transaction_id: 'TXN-BANK-20240301-041',
    date: '2024-03-01',
    payment_date: '2024-03-01',
    timestamp: '2024-03-01T08:45:00Z',
    created_at: '2024-03-01T08:45:00Z',
    amount: 350,
    amount_value: 350,
    currency: 'GHS',
    method: 'Bank Transfer',
    payment_method: 'Bank Transfer',
    provider: 'Ghana Commercial Bank',
    purpose: 'Mortgage Registration Fee',
    payment_purpose: 'Mortgage Registration Fee',
    status: 'completed',
    payment_status: 'completed',
    reference: 'GCB-20240301-041',
    reference_number: 'GCB-20240301-041',
    payer_name: 'Ghana Commercial Bank',
    payer_id: 'bank-gcb-001',
    user_id: 'bank-gcb-001',
    payer_phone: '+233 30 266 4414',
    parcel_id: 'GH-ACC-12345',
    application_id: 'APP-2024-041',
    description: 'Payment for mortgage registration processing'
  }
];

const MOCK_BLOCKCHAIN = [
  {
    id: 'BLK-001',
    block_id: 'BLK-001',
    action: 'Land Registration',
    transaction_type: 'Land Registration',
    parcelId: 'GH-ACC-12345',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    timestamp: '2024-01-15T14:30:00Z',
    transaction_date: '2024-01-15T14:30:00Z',
    hash: '0x1a2b3c4d5e6f7g8h9i0j',
    transaction_hash: '0x1a2b3c4d5e6f7g8h9i0j',
    previousHash: '0x0a1b2c3d4e5f6g7h8i9j',
    previous_hash: '0x0a1b2c3d4e5f6g7h8i9j',
    blockNumber: 12345,
    block_number: 12345,
    user_name: 'Kofi Mensah',
    user_id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    details: 'Parcel GH-ACC-12345 registered on blockchain',
    status: 'Confirmed',
    confirmations: 1024,
    network: 'Ghana Land Registry Chain',
    gas_fee: 0.0012
  },
  {
    id: 'BLK-002',
    block_id: 'BLK-002',
    action: 'Title Issuance',
    transaction_type: 'Title Issuance',
    parcelId: 'GH-ACC-12345',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    timestamp: '2024-01-20T10:15:00Z',
    transaction_date: '2024-01-20T10:15:00Z',
    hash: '0x2b3c4d5e6f7g8h9i0j1k',
    transaction_hash: '0x2b3c4d5e6f7g8h9i0j1k',
    previousHash: '0x1a2b3c4d5e6f7g8h9i0j',
    previous_hash: '0x1a2b3c4d5e6f7g8h9i0j',
    blockNumber: 12346,
    block_number: 12346,
    user_name: 'Land Commission',
    user_id: 'admin-lc-001',
    details: 'Title GA/2024/001/TL issued and recorded',
    status: 'Confirmed',
    confirmations: 987,
    network: 'Ghana Land Registry Chain',
    gas_fee: 0.0015
  },
  {
    id: 'BLK-003',
    block_id: 'BLK-003',
    action: 'Mortgage Registration',
    transaction_type: 'Mortgage Registration',
    parcelId: 'GH-ACC-12345',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    timestamp: '2024-03-01T09:00:00Z',
    transaction_date: '2024-03-01T09:00:00Z',
    hash: '0x3c4d5e6f7g8h9i0j1k2l',
    transaction_hash: '0x3c4d5e6f7g8h9i0j1k2l',
    previousHash: '0x2b3c4d5e6f7g8h9i0j1k',
    previous_hash: '0x2b3c4d5e6f7g8h9i0j1k',
    blockNumber: 12347,
    block_number: 12347,
    user_name: 'Ghana Commercial Bank',
    user_id: 'bank-gcb-001',
    details: 'Mortgage MTG-2024-001 registered (GHS 250,000)',
    status: 'Confirmed',
    confirmations: 768,
    network: 'Ghana Land Registry Chain',
    gas_fee: 0.0018
  },
  {
    id: 'BLK-004',
    block_id: 'BLK-004',
    action: 'Land Registration',
    transaction_type: 'Land Registration',
    parcelId: 'GH-ASH-45678',
    parcel_id: 'GH-ASH-45678',
    parcel_number: 'GH-ASH-45678',
    timestamp: '2023-11-05T15:20:00Z',
    transaction_date: '2023-11-05T15:20:00Z',
    hash: '0x4d5e6f7g8h9i0j1k2l3m',
    transaction_hash: '0x4d5e6f7g8h9i0j1k2l3m',
    previousHash: '0x3c4d5e6f7g8h9i0j1k2l',
    previous_hash: '0x3c4d5e6f7g8h9i0j1k2l',
    blockNumber: 11890,
    block_number: 11890,
    user_name: 'Kwame Nkrumah',
    user_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    details: 'Agricultural parcel GH-ASH-45678 registered',
    status: 'Confirmed',
    confirmations: 1456,
    network: 'Ghana Land Registry Chain',
    gas_fee: 0.0011
  },
  {
    id: 'BLK-005',
    block_id: 'BLK-005',
    action: 'Title Issuance',
    transaction_type: 'Title Issuance',
    parcelId: 'GH-ASH-45678',
    parcel_id: 'GH-ASH-45678',
    parcel_number: 'GH-ASH-45678',
    timestamp: '2023-11-15T11:30:00Z',
    transaction_date: '2023-11-15T11:30:00Z',
    hash: '0x5e6f7g8h9i0j1k2l3m4n',
    transaction_hash: '0x5e6f7g8h9i0j1k2l3m4n',
    previousHash: '0x4d5e6f7g8h9i0j1k2l3m',
    previous_hash: '0x4d5e6f7g8h9i0j1k2l3m',
    blockNumber: 11902,
    block_number: 11902,
    user_name: 'Land Commission',
    user_id: 'admin-lc-001',
    details: 'Leasehold title AS/2023/045/TL issued',
    status: 'Confirmed',
    confirmations: 1444,
    network: 'Ghana Land Registry Chain',
    gas_fee: 0.0013
  },
  {
    id: 'BLK-006',
    block_id: 'BLK-006',
    action: 'Land Registration',
    transaction_type: 'Land Registration',
    parcelId: 'GH-WR-78910',
    parcel_id: 'GH-WR-78910',
    parcel_number: 'GH-WR-78910',
    timestamp: '2024-03-10T13:45:00Z',
    transaction_date: '2024-03-10T13:45:00Z',
    hash: '0x6f7g8h9i0j1k2l3m4n5o',
    transaction_hash: '0x6f7g8h9i0j1k2l3m4n5o',
    previousHash: '0x5e6f7g8h9i0j1k2l3m4n',
    previous_hash: '0x5e6f7g8h9i0j1k2l3m4n',
    blockNumber: 12365,
    block_number: 12365,
    user_name: 'Abena Osei',
    user_id: '8c9f2d4e-1a3b-4c5d-6e7f-8g9h0i1j2k3l',
    details: 'Industrial parcel GH-WR-78910 registered',
    status: 'Confirmed',
    confirmations: 756,
    network: 'Ghana Land Registry Chain',
    gas_fee: 0.0014
  },
  {
    id: 'BLK-007',
    block_id: 'BLK-007',
    action: 'Title Issuance',
    transaction_type: 'Title Issuance',
    parcelId: 'GH-WR-78910',
    parcel_id: 'GH-WR-78910',
    parcel_number: 'GH-WR-78910',
    timestamp: '2024-03-25T09:20:00Z',
    transaction_date: '2024-03-25T09:20:00Z',
    hash: '0x7g8h9i0j1k2l3m4n5o6p',
    transaction_hash: '0x7g8h9i0j1k2l3m4n5o6p',
    previousHash: '0x6f7g8h9i0j1k2l3m4n5o',
    previous_hash: '0x6f7g8h9i0j1k2l3m4n5o',
    blockNumber: 12388,
    block_number: 12388,
    user_name: 'Land Commission',
    user_id: 'admin-lc-001',
    details: 'Freehold title WR/2024/078/TL issued',
    status: 'Confirmed',
    confirmations: 733,
    network: 'Ghana Land Registry Chain',
    gas_fee: 0.0016
  },
  {
    id: 'BLK-008',
    block_id: 'BLK-008',
    action: 'Document Verification',
    transaction_type: 'Document Verification',
    parcelId: 'GH-ACC-12345',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    timestamp: '2024-01-21T16:00:00Z',
    transaction_date: '2024-01-21T16:00:00Z',
    hash: '0x8h9i0j1k2l3m4n5o6p7q',
    transaction_hash: '0x8h9i0j1k2l3m4n5o6p7q',
    previousHash: '0x7g8h9i0j1k2l3m4n5o6p',
    previous_hash: '0x7g8h9i0j1k2l3m4n5o6p',
    blockNumber: 12348,
    block_number: 12348,
    user_name: 'Land Officer',
    user_id: 'officer-001',
    details: 'Document DOC-001 verified and hashed',
    status: 'Confirmed',
    confirmations: 773,
    network: 'Ghana Land Registry Chain',
    gas_fee: 0.0008
  },
  {
    id: 'BLK-009',
    block_id: 'BLK-009',
    action: 'Payment Confirmation',
    transaction_type: 'Payment Confirmation',
    parcelId: 'GH-ACC-12345',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    timestamp: '2024-01-15T10:32:00Z',
    transaction_date: '2024-01-15T10:32:00Z',
    hash: '0x9i0j1k2l3m4n5o6p7q8r',
    transaction_hash: '0x9i0j1k2l3m4n5o6p7q8r',
    previousHash: '0x8h9i0j1k2l3m4n5o6p7q',
    previous_hash: '0x8h9i0j1k2l3m4n5o6p7q',
    blockNumber: 12344,
    block_number: 12344,
    user_name: 'Payment Gateway',
    user_id: 'system-payment',
    details: 'Payment PAY-2024-001 confirmed (GHS 500)',
    status: 'Confirmed',
    confirmations: 1027,
    network: 'Ghana Land Registry Chain',
    gas_fee: 0.0005
  },
  {
    id: 'BLK-010',
    block_id: 'BLK-010',
    action: 'Survey Completion',
    transaction_type: 'Survey Completion',
    parcelId: 'GH-ACC-12345',
    parcel_id: 'GH-ACC-12345',
    parcel_number: 'GH-ACC-12345',
    timestamp: '2024-01-15T17:00:00Z',
    transaction_date: '2024-01-15T17:00:00Z',
    hash: '0xa0j1k2l3m4n5o6p7q8r9s',
    transaction_hash: '0xa0j1k2l3m4n5o6p7q8r9s',
    previousHash: '0x9i0j1k2l3m4n5o6p7q8r',
    previous_hash: '0x9i0j1k2l3m4n5o6p7q8r',
    blockNumber: 12345,
    block_number: 12345,
    user_name: 'Ama Adjei',
    user_id: '430ab24f-6fba-449a-84b7-885eadefc674',
    details: 'Survey SRV-2024-001 completed with 98.5% accuracy',
    status: 'Confirmed',
    confirmations: 1020,
    network: 'Ghana Land Registry Chain',
    gas_fee: 0.0009
  }
];

const MOCK_INTEGRATIONS = [
  {
    id: 'INT-001',
    name: 'GELIS',
    description: 'Ghana Enterprise Land Information System',
    status: 'Active',
    lastSync: '2024-11-14T12:00:00Z',
    syncFrequency: 'Real-time'
  },
  {
    id: 'INT-002',
    name: 'OASL',
    description: 'Office of the Administrator of Stool Lands',
    status: 'Active',
    lastSync: '2024-11-14T11:45:00Z',
    syncFrequency: 'Hourly'
  },
  {
    id: 'INT-003',
    name: 'GRA',
    description: 'Ghana Revenue Authority',
    status: 'Active',
    lastSync: '2024-11-14T12:30:00Z',
    syncFrequency: 'Daily'
  },
  {
    id: 'INT-004',
    name: 'Mobile Money',
    description: 'MTN, Vodafone, AirtelTigo Payment Integration',
    status: 'Active',
    lastSync: '2024-11-15T09:15:00Z',
    syncFrequency: 'Real-time'
  },
  {
    id: 'INT-005',
    name: 'Land Valuation Board',
    description: 'Property Valuation and Assessment System',
    status: 'Active',
    lastSync: '2024-11-15T08:00:00Z',
    syncFrequency: 'Daily'
  }
];

const MOCK_INTEGRATION_LOGS = [
  {
    id: 'LOG-001',
    system: 'GELIS',
    action: 'Parcel Data Sync',
    status: 'success',
    created_at: '2024-11-15T10:30:00Z',
    request_data: 'Synced 1,247 parcel records: 823 updates, 424 new registrations'
  },
  {
    id: 'LOG-002',
    system: 'Mobile Money',
    action: 'Payment Processing',
    status: 'success',
    created_at: '2024-11-15T10:25:00Z',
    request_data: 'MTN MoMo: GHS 500.00 for Land Registration Fee (Ref: MTN-20241115-001)'
  },
  {
    id: 'LOG-003',
    system: 'GRA',
    action: 'Stamp Duty Calculation',
    status: 'success',
    created_at: '2024-11-15T10:20:00Z',
    request_data: 'Property Value: GHS 150,000 | Calculated Duty: GHS 2,250 (1.5%)'
  },
  {
    id: 'LOG-004',
    system: 'OASL',
    action: 'Stool Lands Data Export',
    status: 'success',
    created_at: '2024-11-15T09:45:00Z',
    request_data: 'Exported 342 stool land records with revenue allocations for October 2024'
  },
  {
    id: 'LOG-005',
    system: 'GELIS',
    action: 'Title Registration Update',
    status: 'success',
    created_at: '2024-11-15T09:30:00Z',
    request_data: 'Title GA/2024/001/TL registered and synced to GELIS central database'
  },
  {
    id: 'LOG-006',
    system: 'Land Valuation Board',
    action: 'Valuation Request',
    status: 'success',
    created_at: '2024-11-15T09:15:00Z',
    request_data: 'Parcel GH-ACC-12345: Valuation updated to GHS 95,000 (approved)'
  },
  {
    id: 'LOG-007',
    system: 'Mobile Money',
    action: 'Payment Processing',
    status: 'success',
    created_at: '2024-11-15T09:00:00Z',
    request_data: 'Vodafone Cash: GHS 800.00 for Survey Fee (Ref: VOD-20241115-002)'
  },
  {
    id: 'LOG-008',
    system: 'GRA',
    action: 'Tax Assessment Sync',
    status: 'success',
    created_at: '2024-11-15T08:45:00Z',
    request_data: 'Synced property tax assessments for 156 parcels in Greater Accra Region'
  },
  {
    id: 'LOG-009',
    system: 'GELIS',
    action: 'Boundary Verification',
    status: 'success',
    created_at: '2024-11-15T08:30:00Z',
    request_data: 'Verified boundaries for 45 parcels using GPS coordinates from survey data'
  },
  {
    id: 'LOG-010',
    system: 'OASL',
    action: 'Revenue Distribution Report',
    status: 'success',
    created_at: '2024-11-15T08:00:00Z',
    request_data: 'Generated revenue distribution report: GHS 2.4M allocated across 23 stools'
  },
  {
    id: 'LOG-011',
    system: 'Mobile Money',
    action: 'Payment Processing',
    status: 'error',
    created_at: '2024-11-15T07:45:00Z',
    request_data: 'AirtelTigo Money: GHS 1,200 - Transaction timeout (retrying)'
  },
  {
    id: 'LOG-012',
    system: 'GRA',
    action: 'Stamp Duty Calculation',
    status: 'success',
    created_at: '2024-11-15T07:30:00Z',
    request_data: 'Property Value: GHS 320,000 | Calculated Duty: GHS 4,800 (1.5%)'
  },
  {
    id: 'LOG-013',
    system: 'GELIS',
    action: 'Application Status Update',
    status: 'success',
    created_at: '2024-11-15T07:15:00Z',
    request_data: 'APP-2024-012 status updated to Processing in GELIS workflow system'
  },
  {
    id: 'LOG-014',
    system: 'Land Valuation Board',
    action: 'Bulk Valuation Import',
    status: 'success',
    created_at: '2024-11-15T07:00:00Z',
    request_data: 'Imported 89 property valuations from Ashanti Region assessment campaign'
  },
  {
    id: 'LOG-015',
    system: 'OASL',
    action: 'Concession Agreement Sync',
    status: 'success',
    created_at: '2024-11-15T06:30:00Z',
    request_data: 'Synced 12 new mining concession agreements with stool lands database'
  },
  {
    id: 'LOG-016',
    system: 'Mobile Money',
    action: 'Payment Processing',
    status: 'success',
    created_at: '2024-11-15T06:15:00Z',
    request_data: 'MTN MoMo: GHS 150.00 for Title Certificate Fee (Ref: MTN-20241115-003)'
  },
  {
    id: 'LOG-017',
    system: 'GRA',
    action: 'Property Tax Update',
    status: 'success',
    created_at: '2024-11-15T06:00:00Z',
    request_data: 'Updated annual property tax rates for commercial properties in Kumasi Metropolitan'
  },
  {
    id: 'LOG-018',
    system: 'GELIS',
    action: 'Document Upload Verification',
    status: 'success',
    created_at: '2024-11-15T05:45:00Z',
    request_data: 'Verified and archived 23 land certificates with blockchain hash validation'
  },
  {
    id: 'LOG-019',
    system: 'Land Valuation Board',
    action: 'Valuation Dispute Review',
    status: 'success',
    created_at: '2024-11-15T05:30:00Z',
    request_data: 'Reviewed valuation appeal for GH-WR-78910: Adjusted from GHS 165K to GHS 180K'
  },
  {
    id: 'LOG-020',
    system: 'Mobile Money',
    action: 'Reconciliation Report',
    status: 'success',
    created_at: '2024-11-15T05:00:00Z',
    request_data: 'Daily reconciliation: 247 transactions totaling GHS 184,500 processed successfully'
  }
];

const MOCK_DASHBOARD_STATS = {
  totalParcels: 2,
  activeTitles: 1,
  pendingApplications: 0,
  completedPayments: 2
};

const MOCK_SURVEYS = [
  {
    id: 'SRV-2024-001',
    parcelId: 'GH-ACC-12345',
    surveyor: 'Ama Adjei',
    date: '2024-01-12',
    status: 'Approved',
    accuracy: '98.5%'
  }
];

const MOCK_AUDIT_LOGS = [
  {
    id: 'AUD-001',
    timestamp: '2024-11-14T14:30:00Z',
    user: 'Kofi Mensah',
    action: 'Viewed Parcel Details',
    resource: 'GH-ACC-12345',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    id: 'AUD-002',
    timestamp: '2024-11-14T14:25:00Z',
    user: 'Abena Osei',
    action: 'Updated Application Status',
    resource: 'APP-2024-001',
    ipAddress: '192.168.1.101',
    status: 'Success'
  }
];

// Mock API class
class MockAPI {
  async get(url) {
    await delay();

    // Handle individual parcel GET request
    if (url.match(/\/parcels\/[A-Z0-9-]+$/)) {
      const parcelId = url.split('/').pop();
      const parcel = MOCK_PARCELS.find(p => p.id === parcelId);
      if (parcel) {
        // Format coordinates and geometry for map display
        const parcelWithMap = {
          ...parcel,
          coordinates: JSON.stringify({
            lat: parcel.coordinates[0],
            lng: parcel.coordinates[1]
          }),
          geometry: JSON.stringify({
            type: 'Polygon',
            coordinates: [parcel.boundary_coordinates.map(c => [c[1], c[0]])]
          })
        };
        return { data: { success: true, data: parcelWithMap } };
      }
      return { data: { success: false, message: 'Parcel not found' } };
    }

    // Handle parcels list GET request
    if (url.includes('/parcels')) {
      return { data: { success: true, data: MOCK_PARCELS } };
    }
    if (url.includes('/titles')) {
      return { data: { success: true, data: MOCK_TITLES } };
    }
    if (url.includes('/applications')) {
      return { data: { success: true, data: MOCK_APPLICATIONS } };
    }
    if (url.includes('/mortgages')) {
      return { data: { success: true, data: MOCK_MORTGAGES } };
    }
    if (url.includes('/documents')) {
      return { data: { success: true, data: MOCK_DOCUMENTS } };
    }
    if (url.includes('/payments')) {
      return { data: { success: true, data: MOCK_PAYMENTS } };
    }
    if (url.includes('/blockchain')) {
      return { data: { success: true, data: MOCK_BLOCKCHAIN } };
    }
    if (url.includes('/integrations/logs')) {
      return { data: { success: true, data: MOCK_INTEGRATION_LOGS } };
    }
    if (url.includes('/integrations')) {
      return { data: { success: true, data: MOCK_INTEGRATIONS } };
    }
    if (url.includes('/dashboard/stats')) {
      return { data: { success: true, data: MOCK_DASHBOARD_STATS } };
    }
    if (url.includes('/surveys')) {
      return { data: { success: true, data: MOCK_SURVEYS } };
    }
    if (url.includes('/audit')) {
      return { data: { success: true, data: MOCK_AUDIT_LOGS } };
    }
    if (url.includes('/notifications')) {
      return { data: { success: true, data: [] } };
    }
    if (url.includes('/auth/demo-users')) {
      return { data: { success: true, data: MOCK_DEMO_USERS } };
    }

    return { data: { success: true, data: [] } };
  }

  async post(url, data) {
    await delay();

    // Handle GELIS sync
    if (url.includes('/integrations/gelis/sync')) {
      return {
        data: {
          success: true,
          message: 'GELIS sync completed successfully. Synced 1,247 parcel records.',
          data: {
            records_synced: 1247,
            updates: 823,
            new_records: 424
          }
        }
      };
    }

    // Handle Mobile Money payment
    if (url.includes('/integrations/momo/pay')) {
      const reference = `${data.provider.toUpperCase()}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      return {
        data: {
          success: true,
          message: 'Payment processed successfully',
          reference: reference,
          data: {
            amount: data.amount,
            provider: data.provider,
            phone: data.phone_number,
            reference: reference
          }
        }
      };
    }

    // Handle GRA stamp duty calculation
    if (url.includes('/integrations/gra/stamp-duty')) {
      const propertyValue = parseFloat(data.property_value);
      const stampDuty = propertyValue * 0.015; // 1.5%
      return {
        data: {
          success: true,
          message: 'Stamp duty calculated successfully',
          stamp_duty: stampDuty,
          rate: '1.5',
          property_value: propertyValue,
          data: {
            property_value: propertyValue,
            stamp_duty: stampDuty,
            rate: 1.5
          }
        }
      };
    }

    // Handle parcel creation
    if (url.includes('/parcels') && !url.includes('/parcels/')) {
      // Generate unique parcel ID based on region code
      const regionCodes = {
        'Greater Accra': 'ACC',
        'Ashanti': 'ASH',
        'Western': 'WR',
        'Northern': 'NR',
        'Eastern': 'ER',
        'Central': 'CR',
        'Volta': 'VR',
        'Upper East': 'UE',
        'Upper West': 'UW',
        'Bono': 'BO'
      };

      const regionCode = regionCodes[data.region] || 'GH';
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const parcelId = `GH-${regionCode}-${randomNum}`;

      const newParcel = {
        id: parcelId,
        parcel_number: parcelId,
        parcel_id: parcelId,
        location: data.location,
        region: data.region,
        district: data.district,
        area: `${data.area} hectares`,
        area_sqm: parseFloat(data.area) * 10000,
        land_use: data.land_use,
        land_type: data.land_use,
        landUse: data.land_use,
        status: 'Pending Survey',
        owner: data.owner,
        owner_id: data.owner_id || null,
        owner_phone: data.owner_phone || null,
        registration_date: new Date().toISOString().split('T')[0],
        registrationDate: new Date().toISOString().split('T')[0],
        last_updated: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        coordinates: null,
        boundary_coordinates: null,
        valuation: null,
        title_number: null
      };

      return {
        data: {
          success: true,
          message: 'Parcel created successfully',
          data: newParcel
        }
      };
    }

    return { data: { success: true, message: 'Operation successful', data: {} } };
  }

  async put(url, data) {
    await delay();
    return { data: { success: true, message: 'Updated successfully', data: {} } };
  }

  async delete(url) {
    await delay();
    return { data: { success: true, message: 'Deleted successfully' } };
  }
}

const api = new MockAPI();

// No interceptors needed for mock API
api.interceptors = {
  request: { use: () => {} },
  response: { use: () => {} }
};

export default api;
