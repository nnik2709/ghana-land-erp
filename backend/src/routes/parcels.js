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
