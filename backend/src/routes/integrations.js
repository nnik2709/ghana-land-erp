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
