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
