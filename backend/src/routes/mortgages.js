const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all mortgages (filtered by role)
router.get('/', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    let query = `
      SELECT m.*,
             p.parcel_id, p.location, p.area, p.land_type,
             u.full_name as borrower_name, u.email as borrower_email,
             u2.full_name as registered_by_name
      FROM mortgages m
      LEFT JOIN parcels p ON m.parcel_id = p.id
      LEFT JOIN users u ON m.borrower_id = u.id
      LEFT JOIN users u2 ON m.registered_by = u2.id
    `;

    let mortgages;
    if (req.user.role === 'citizen') {
      // Citizens see only their own mortgages
      query += ' WHERE m.borrower_id = ? ORDER BY m.registered_at DESC';
      mortgages = db.prepare(query).all(req.user.id);
    } else {
      // Officers and admins see all mortgages
      query += ' ORDER BY m.registered_at DESC';
      mortgages = db.prepare(query).all();
    }

    res.json({ success: true, data: mortgages });
  } catch (error) {
    console.error('Error fetching mortgages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single mortgage by ID
router.get('/:id', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const mortgage = db.prepare(`
      SELECT m.*,
             p.parcel_id, p.location, p.area, p.land_type, p.region, p.district,
             u.full_name as borrower_name, u.email as borrower_email, u.phone as borrower_phone,
             u2.full_name as registered_by_name
      FROM mortgages m
      LEFT JOIN parcels p ON m.parcel_id = p.id
      LEFT JOIN users u ON m.borrower_id = u.id
      LEFT JOIN users u2 ON m.registered_by = u2.id
      WHERE m.id = ?
    `).get(req.params.id);

    if (!mortgage) {
      return res.status(404).json({ success: false, message: 'Mortgage not found' });
    }

    // Authorization check
    if (req.user.role === 'citizen' && mortgage.borrower_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: mortgage });
  } catch (error) {
    console.error('Error fetching mortgage:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Register new mortgage (officers and admins only)
router.post('/', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'lands_officer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only lands officers can register mortgages' });
    }

    const {
      parcel_id,
      lender_name,
      lender_contact,
      borrower_id,
      loan_amount,
      interest_rate,
      duration_months,
      start_date,
      notes
    } = req.body;

    // Validate required fields
    if (!parcel_id || !lender_name || !borrower_id || !loan_amount || !start_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: parcel_id, lender_name, borrower_id, loan_amount, start_date'
      });
    }

    const db = getDatabase();

    // Check if parcel exists
    const parcel = db.prepare('SELECT id FROM parcels WHERE id = ?').get(parcel_id);
    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found' });
    }

    // Calculate maturity date
    const startDate = new Date(start_date);
    const maturityDate = new Date(startDate);
    maturityDate.setMonth(maturityDate.getMonth() + (duration_months || 240)); // Default 20 years

    // Get existing mortgages count for priority
    const existingMortgages = db.prepare('SELECT COUNT(*) as count FROM mortgages WHERE parcel_id = ? AND status = ?')
      .get(parcel_id, 'active');
    const priority = (existingMortgages.count || 0) + 1;

    // Generate mortgage ID
    const mortgage_id = `MTG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    // Simulated blockchain hash
    const blockchain_hash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const id = uuidv4();

    db.prepare(`
      INSERT INTO mortgages (
        id, mortgage_id, parcel_id, lender_name, lender_contact, borrower_id,
        loan_amount, interest_rate, duration_months, start_date, maturity_date,
        status, priority, blockchain_hash, registered_by, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, mortgage_id, parcel_id, lender_name, lender_contact || null, borrower_id,
      loan_amount, interest_rate || null, duration_months || 240, start_date, maturityDate.toISOString().split('T')[0],
      'active', priority, blockchain_hash, req.user.id, notes || null
    );

    // Create notification for borrower
    db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, data, channels)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      borrower_id,
      'mortgage_registered',
      'Mortgage Registered',
      `Mortgage ${mortgage_id} with ${lender_name} has been successfully registered on your property.`,
      JSON.stringify({ mortgage_id: id }),
      '["email", "sms", "in_app"]'
    );

    // Fetch the created mortgage
    const createdMortgage = db.prepare(`
      SELECT m.*,
             p.parcel_id, p.location,
             u.full_name as borrower_name
      FROM mortgages m
      LEFT JOIN parcels p ON m.parcel_id = p.id
      LEFT JOIN users u ON m.borrower_id = u.id
      WHERE m.id = ?
    `).get(id);

    console.log(`✅ Mortgage registered: ${mortgage_id} by ${req.user.full_name}`);
    console.log(`   💰 Amount: GHS ${loan_amount.toFixed(2)}`);
    console.log(`   🏦 Lender: ${lender_name}`);
    console.log(`   🔗 Blockchain: ${blockchain_hash}`);

    res.status(201).json({
      success: true,
      message: 'Mortgage registered successfully',
      data: createdMortgage
    });
  } catch (error) {
    console.error('Error registering mortgage:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Discharge mortgage (officers and admins only)
router.put('/:id/discharge', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'lands_officer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only lands officers can discharge mortgages' });
    }

    const { notes } = req.body;
    const db = getDatabase();

    // Check if mortgage exists
    const mortgage = db.prepare('SELECT * FROM mortgages WHERE id = ?').get(req.params.id);
    if (!mortgage) {
      return res.status(404).json({ success: false, message: 'Mortgage not found' });
    }

    if (mortgage.status === 'discharged') {
      return res.status(400).json({ success: false, message: 'Mortgage already discharged' });
    }

    // Update mortgage status
    db.prepare(`
      UPDATE mortgages
      SET status = ?, discharged_at = CURRENT_TIMESTAMP, notes = ?
      WHERE id = ?
    `).run('discharged', notes || 'Mortgage discharged', req.params.id);

    // Create notification for borrower
    db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, data, channels)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      mortgage.borrower_id,
      'mortgage_registered',
      'Mortgage Discharged',
      `Mortgage ${mortgage.mortgage_id} has been successfully discharged. Your property is now free from this encumbrance.`,
      JSON.stringify({ mortgage_id: req.params.id }),
      '["email", "sms", "in_app"]'
    );

    console.log(`✅ Mortgage discharged: ${mortgage.mortgage_id} by ${req.user.full_name}`);

    res.json({ success: true, message: 'Mortgage discharged successfully' });
  } catch (error) {
    console.error('Error discharging mortgage:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all encumbrances for a parcel
router.get('/parcel/:parcelId/encumbrances', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const mortgages = db.prepare(`
      SELECT m.*,
             u.full_name as borrower_name,
             u2.full_name as registered_by_name
      FROM mortgages m
      LEFT JOIN users u ON m.borrower_id = u.id
      LEFT JOIN users u2 ON m.registered_by = u2.id
      WHERE m.parcel_id = ?
      ORDER BY m.priority ASC, m.registered_at DESC
    `).all(req.params.parcelId);

    res.json({ success: true, data: mortgages });
  } catch (error) {
    console.error('Error fetching encumbrances:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
