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
