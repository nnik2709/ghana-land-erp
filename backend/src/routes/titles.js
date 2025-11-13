const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { getDatabase } = require('../database/init');
const { authenticate } = require('../middleware/auth');
const pdfGenerator = require('../services/pdfGenerator');

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

// PDF Download endpoint
router.get('/:id/download-pdf', authenticate, async (req, res) => {
  try {
    const db = getDatabase();

    // Get title with blockchain data
    const title = db.prepare(`
      SELECT t.*, p.parcel_id, p.location, p.area, p.land_type,
             u.full_name as owner_name,
             bt.transaction_hash as blockchain_hash, bt.token_id as blockchain_token_id
      FROM titles t
      LEFT JOIN parcels p ON t.parcel_id = p.id
      LEFT JOIN users u ON t.owner_id = u.id
      LEFT JOIN blockchain_transactions bt ON bt.reference_id = t.id AND bt.transaction_type = 'title_issuance'
      WHERE t.id = ?
    `).get(req.params.id);

    if (!title) {
      return res.status(404).json({ success: false, message: 'Title not found' });
    }

    // Authorization check
    if (req.user.role === 'citizen' && title.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate PDF
    const pdfFilename = `${title.certificate_number.replace(/\//g, '-')}.pdf`;
    const pdfPath = path.join(uploadsDir, pdfFilename);

    // Prepare data for PDF
    const pdfData = {
      certificate_number: title.certificate_number,
      parcel_id: title.parcel_id,
      owner_name: title.owner_name,
      location: title.location,
      area: title.area,
      land_type: title.land_type,
      issue_date: title.issue_date,
      status: title.status,
      blockchain_token_id: title.blockchain_token_id,
      blockchain_hash: title.blockchain_hash,
      issued_by: req.user.full_name,
      officer_id: req.user.id
    };

    await pdfGenerator.generateTitleCertificate(pdfData, pdfPath);

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);

    // Stream PDF to response
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

    // Clean up file after download
    fileStream.on('end', () => {
      fs.unlinkSync(pdfPath);
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF', error: error.message });
  }
});

module.exports = router;
