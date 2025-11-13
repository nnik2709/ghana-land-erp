const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all applications (with role-based filtering)
router.get('/', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    let query = `
      SELECT
        a.*,
        p.parcel_id,
        p.location,
        u.full_name as applicant_name,
        u.email as applicant_email,
        reviewer.full_name as reviewer_name
      FROM applications a
      LEFT JOIN parcels p ON a.parcel_id = p.id
      LEFT JOIN users u ON a.applicant_id = u.id
      LEFT JOIN users reviewer ON a.reviewed_by = reviewer.id
    `;

    // Citizens only see their own applications
    if (req.user.role === 'citizen') {
      query += ' WHERE a.applicant_id = ?';
      var applications = db.prepare(query + ' ORDER BY a.submitted_at DESC').all(req.user.id);
    } else {
      // Officers and admins see all applications
      var applications = db.prepare(query + ' ORDER BY a.submitted_at DESC').all();
    }

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get application by ID
router.get('/:id', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const application = db.prepare(`
      SELECT
        a.*,
        p.parcel_id,
        p.location,
        p.area,
        p.land_type,
        u.full_name as applicant_name,
        u.email as applicant_email,
        u.phone as applicant_phone,
        reviewer.full_name as reviewer_name
      FROM applications a
      LEFT JOIN parcels p ON a.parcel_id = p.id
      LEFT JOIN users u ON a.applicant_id = u.id
      LEFT JOIN users reviewer ON a.reviewed_by = reviewer.id
      WHERE a.id = ?
    `).get(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Citizens can only view their own applications
    if (req.user.role === 'citizen' && application.applicant_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new application
router.post('/', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const { parcel_id, application_type, notes } = req.body;

    const id = uuidv4();
    const application_id = `APP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    const stmt = db.prepare(`
      INSERT INTO applications (id, application_id, applicant_id, parcel_id, application_type, status, notes)
      VALUES (?, ?, ?, ?, ?, 'submitted', ?)
    `);

    stmt.run(id, application_id, req.user.id, parcel_id, application_type, notes || null);

    const newApplication = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: newApplication
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update application status (Officers/Admin only)
router.put('/:id', authenticate, (req, res) => {
  try {
    // Only officers and admins can update applications
    if (req.user.role !== 'lands_officer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const db = getDatabase();
    const { status, notes } = req.body;

    const application = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const stmt = db.prepare(`
      UPDATE applications
      SET status = ?,
          notes = COALESCE(?, notes),
          reviewed_by = ?,
          reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(status, notes, req.user.id, req.params.id);

    const updatedApplication = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      data: updatedApplication
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete application
router.delete('/:id', authenticate, (req, res) => {
  try {
    // Only admin can delete applications
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const db = getDatabase();
    const application = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);

    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
