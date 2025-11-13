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
