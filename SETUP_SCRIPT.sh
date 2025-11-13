#!/bin/bash

# Ghana Land ERP Demo - Setup Script
# This script creates all necessary backend and frontend files

set -e

echo "🚀 Setting up Ghana Land ERP Demo..."
echo

BASE_DIR="/Users/nikolay/Library/CloudStorage/OneDrive-EywaSystems/ghana/land-erp-demo"

# Create all necessary directories
echo "📁 Creating directory structure..."
mkdir -p "$BASE_DIR/backend/src/routes"
mkdir -p "$BASE_DIR/backend/src/middleware"
mkdir -p "$BASE_DIR/backend/src/services"
mkdir -p "$BASE_DIR/backend/data"
mkdir -p "$BASE_DIR/frontend/src/components"
mkdir -p "$BASE_DIR/frontend/src/pages"
mkdir -p "$BASE_DIR/frontend/src/services"
mkdir -p "$BASE_DIR/frontend/src/contexts"
mkdir -p "$BASE_DIR/frontend/public"

echo "✅ Directory structure created"
echo

# Backend routes files
echo "📝 Creating remaining backend route files..."

# Parcels route
cat > "$BASE_DIR/backend/src/routes/parcels.js" << 'EOF'
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all parcels (with filters)
router.get('/', authenticate, (req, res) => {
  try {
    const { region, status, owner_id } = req.query;
    const db = getDatabase();

    let query = 'SELECT * FROM parcels WHERE 1=1';
    const params = [];

    if (region) {
      query += ' AND region = ?';
      params.push(region);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (owner_id) {
      query += ' AND owner_id = ?';
      params.push(owner_id);
    }

    query += ' ORDER BY created_at DESC';

    const parcels = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: parcels,
      total: parcels.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parcels',
      error: error.message
    });
  }
});

// Get parcel by ID
router.get('/:id', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const parcel = db.prepare('SELECT * FROM parcels WHERE id = ?').get(req.params.id);

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: 'Parcel not found'
      });
    }

    // Get related survey
    const survey = db.prepare('SELECT * FROM surveys WHERE parcel_id = ? ORDER BY created_at DESC LIMIT 1').get(parcel.id);

    // Get related title
    const title = db.prepare('SELECT * FROM titles WHERE parcel_id = ?').get(parcel.id);

    res.json({
      success: true,
      data: {
        ...parcel,
        survey,
        title
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parcel',
      error: error.message
    });
  }
});

// Search parcels
router.post('/search', authenticate, (req, res) => {
  try {
    const { parcel_id, location, region } = req.body;
    const db = getDatabase();

    let query = 'SELECT * FROM parcels WHERE 1=1';
    const params = [];

    if (parcel_id) {
      query += ' AND parcel_id LIKE ?';
      params.push(`%${parcel_id}%`);
    }

    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    if (region) {
      query += ' AND region = ?';
      params.push(region);
    }

    const parcels = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: parcels,
      total: parcels.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

module.exports = router;
EOF

# Surveys route
cat > "$BASE_DIR/backend/src/routes/surveys.js" << 'EOF'
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all surveys
router.get('/', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    let query = 'SELECT s.*, p.parcel_id, p.location, u.full_name as surveyor_name FROM surveys s LEFT JOIN parcels p ON s.parcel_id = p.id LEFT JOIN users u ON s.surveyor_id = u.id';

    if (req.user.role === 'surveyor') {
      query += ' WHERE s.surveyor_id = ?';
      var surveys = db.prepare(query + ' ORDER BY s.created_at DESC').all(req.user.id);
    } else {
      var surveys = db.prepare(query + ' ORDER BY s.created_at DESC').all();
    }

    res.json({
      success: true,
      data: surveys,
      total: surveys.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch surveys',
      error: error.message
    });
  }
});

// Create survey
router.post('/', authenticate, authorize('surveyor', 'admin'), (req, res) => {
  try {
    const { parcel_id, survey_date, coordinates, instrument_type, notes } = req.body;
    const db = getDatabase();

    const surveyId = uuidv4();
    const survey_number = `SUR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;

    db.prepare(`
      INSERT INTO surveys (id, survey_id, parcel_id, surveyor_id, survey_date, coordinates, instrument_type, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(surveyId, survey_number, parcel_id, req.user.id, survey_date, JSON.stringify(coordinates), instrument_type, notes, 'submitted');

    res.status(201).json({
      success: true,
      message: 'Survey created successfully',
      data: {
        id: surveyId,
        survey_id: survey_number
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create survey',
      error: error.message
    });
  }
});

// Approve survey
router.patch('/:id/approve', authenticate, authorize('admin', 'lands_officer'), (req, res) => {
  try {
    const db = getDatabase();
    db.prepare('UPDATE surveys SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('approved', req.params.id);

    res.json({
      success: true,
      message: 'Survey approved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve survey',
      error: error.message
    });
  }
});

module.exports = router;
EOF

echo "✅ Backend routes created"
echo

# Create remaining backend files efficiently
cat > "$BASE_DIR/backend/src/routes/titles.js" << 'EOF'
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    let query = 'SELECT t.*, p.parcel_id, p.location, u.full_name as owner_name FROM titles t LEFT JOIN parcels p ON t.parcel_id = p.id LEFT JOIN users u ON t.owner_id = u.id';

    if (req.user.role === 'citizen') {
      query += ' WHERE t.owner_id = ?';
      var titles = db.prepare(query + ' ORDER BY t.created_at DESC').all(req.user.id);
    } else {
      var titles = db.prepare(query + ' ORDER BY t.created_at DESC').all();
    }

    res.json({ success: true, data: titles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const title = db.prepare(`
      SELECT t.*, p.*, u.full_name as owner_name, u.email as owner_email
      FROM titles t
      LEFT JOIN parcels p ON t.parcel_id = p.id
      LEFT JOIN users u ON t.owner_id = u.id
      WHERE t.id = ?
    `).get(req.params.id);

    if (!title) {
      return res.status(404).json({ success: false, message: 'Title not found' });
    }

    res.json({ success: true, data: title });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
EOF

cat > "$BASE_DIR/backend/src/routes/payments.js" << 'EOF'
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    let query = 'SELECT * FROM payments';

    if (req.user.role === 'citizen') {
      query += ' WHERE user_id = ?';
      var payments = db.prepare(query + ' ORDER BY created_at DESC').all(req.user.id);
    } else {
      var payments = db.prepare(query + ' ORDER BY created_at DESC').all();
    }

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authenticate, (req, res) => {
  try {
    const { application_id, amount, payment_method, payment_provider } = req.body;
    const db = getDatabase();

    const paymentId = uuidv4();
    const transaction_id = `TXN-${Date.now()}`;

    // Simulate payment processing
    const status = Math.random() > 0.1 ? 'completed' : 'failed';

    db.prepare(`
      INSERT INTO payments (id, transaction_id, user_id, application_id, amount, payment_method, payment_provider, status, reference_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(paymentId, transaction_id, req.user.id, application_id, amount, payment_method, payment_provider, status, `REF-${Math.random().toString(36).substr(2, 9)}`);

    res.status(201).json({
      success: true,
      message: `Payment ${status}`,
      data: { id: paymentId, transaction_id, status }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
EOF

cat > "$BASE_DIR/backend/src/routes/blockchain.js" << 'EOF'
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/transactions', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const transactions = db.prepare('SELECT * FROM blockchain_transactions ORDER BY timestamp DESC LIMIT 50').all();

    res.json({
      success: true,
      data: transactions,
      blockchain_info: {
        network: 'Hyperledger Fabric',
        consensus: 'RAFT',
        current_block: 12500,
        total_transactions: transactions.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/token/:token_id', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const transactions = db.prepare('SELECT * FROM blockchain_transactions WHERE token_id = ? ORDER BY timestamp DESC').all(req.params.token_id);

    const parcel = db.prepare('SELECT * FROM parcels WHERE blockchain_token_id = ?').get(req.params.token_id);

    res.json({
      success: true,
      data: {
        token_id: req.params.token_id,
        parcel,
        transactions,
        metadata: {
          total_transactions: transactions.length,
          first_transaction: transactions[transactions.length - 1]?.timestamp,
          last_transaction: transactions[0]?.timestamp
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/mint', authenticate, authorize('admin', 'lands_officer'), (req, res) => {
  try {
    const { token_id, parcel_id, owner_id } = req.body;
    const db = getDatabase();

    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const blockNumber = Math.floor(Math.random() * 1000) + 12000;

    db.prepare(`
      INSERT INTO blockchain_transactions (id, transaction_hash, block_number, token_id, transaction_type, to_address, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), txHash, blockNumber, token_id, 'MINT', owner_id, JSON.stringify({ parcel_id }));

    res.status(201).json({
      success: true,
      message: 'Token minted successfully',
      data: { transaction_hash: txHash, block_number: blockNumber }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
EOF

cat > "$BASE_DIR/backend/src/routes/integrations.js" << 'EOF'
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get integration logs
router.get('/logs', authenticate, authorize('admin'), (req, res) => {
  try {
    const db = getDatabase();
    const logs = db.prepare('SELECT * FROM integration_logs ORDER BY timestamp DESC LIMIT 100').all();

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mock GELIS integration
router.post('/gelis/sync', authenticate, authorize('admin', 'lands_officer'), (req, res) => {
  try {
    const db = getDatabase();

    // Simulate API call
    setTimeout(() => {
      db.prepare(`
        INSERT INTO integration_logs (id, system_name, endpoint, method, status_code, success, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(uuidv4(), 'GELIS', '/api/parcels/sync', 'POST', 200, 1);

      res.json({
        success: true,
        message: 'GELIS sync completed',
        data: { parcels_synced: 5, new_parcels: 2, updated_parcels: 3 }
      });
    }, 1000);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mock Mobile Money payment
router.post('/momo/pay', authenticate, (req, res) => {
  try {
    const { amount, phone_number, provider } = req.body;
    const db = getDatabase();

    // Simulate payment request
    setTimeout(() => {
      const success = Math.random() > 0.1;

      db.prepare(`
        INSERT INTO integration_logs (id, system_name, endpoint, method, request_payload, status_code, success, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(uuidv4(), `${provider} MoMo`, '/api/payment/request', 'POST', JSON.stringify({ amount, phone_number }), success ? 200 : 500, success ? 1 : 0);

      res.json({
        success,
        message: success ? 'Payment initiated. Check your phone for approval.' : 'Payment failed. Please try again.',
        data: { reference: `MOMO-${Date.now()}`, provider, amount }
      });
    }, 1500);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mock GRA integration
router.post('/gra/stamp-duty', authenticate, (req, res) => {
  try {
    const { parcel_value, transaction_type } = req.body;

    // Calculate stamp duty (simplified)
    const stamp_duty = parcel_value * 0.015; // 1.5%

    res.json({
      success: true,
      data: {
        parcel_value,
        stamp_duty_rate: '1.5%',
        stamp_duty_amount: stamp_duty,
        gra_reference: `GRA-${Date.now()}`,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
EOF

cat > "$BASE_DIR/backend/src/routes/dashboard.js" << 'EOF'
const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authenticate, (req, res) => {
  try {
    const db = getDatabase();

    const total_parcels = db.prepare('SELECT COUNT(*) as count FROM parcels').get().count;
    const registered_parcels = db.prepare('SELECT COUNT(*) as count FROM parcels WHERE status = ?').get('registered').count;
    const pending_applications = db.prepare('SELECT COUNT(*) as count FROM applications WHERE status IN (?, ?)').get('submitted', 'under_review').count;
    const total_payments = db.prepare('SELECT SUM(amount) as total FROM payments WHERE status = ?').get('completed').total || 0;
    const total_surveys = db.prepare('SELECT COUNT(*) as count FROM surveys').get().count;
    const blockchain_transactions = db.prepare('SELECT COUNT(*) as count FROM blockchain_transactions').get().count;

    // Recent activity
    const recent_applications = db.prepare(`
      SELECT a.*, u.full_name, p.parcel_id
      FROM applications a
      LEFT JOIN users u ON a.applicant_id = u.id
      LEFT JOIN parcels p ON a.parcel_id = p.id
      ORDER BY a.submitted_at DESC LIMIT 5
    `).all();

    res.json({
      success: true,
      data: {
        overview: {
          total_parcels,
          registered_parcels,
          pending_applications,
          total_payments,
          total_surveys,
          blockchain_transactions
        },
        recent_activity: recent_applications
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
EOF

echo "✅ All backend files created successfully"
echo

chmod +x "$BASE_DIR/SETUP_SCRIPT.sh"

echo "🎉 Setup script created! Next steps:"
echo "1. cd $BASE_DIR/backend && npm install"
echo "2. cd $BASE_DIR/frontend && npm install"
echo "3. npm start in both directories"
EOF

chmod +x "/Users/nikolay/Library/CloudStorage/OneDrive-EywaSystems/ghana/land-erp-demo/SETUP_SCRIPT.sh"
