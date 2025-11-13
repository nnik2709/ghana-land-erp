const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only specific file types
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Upload document
router.post('/upload', authenticate, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const {
      document_type,
      related_entity_type,
      related_entity_id
    } = req.body;

    if (!document_type) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Document type is required' });
    }

    const db = getDatabase();

    // Calculate file hash
    const fileBuffer = fs.readFileSync(req.file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Simulated blockchain hash
    const blockchain_hash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Simulated OCR text extraction (would use AWS Textract in production)
    let ocr_text = null;
    if (req.file.mimetype === 'application/pdf') {
      ocr_text = `[SIMULATED OCR] This is extracted text from ${req.file.originalname}. In production, this would be processed by AWS Textract or similar OCR service.`;
    }

    const document_id = `DOC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const id = uuidv4();

    db.prepare(`
      INSERT INTO documents (
        id, document_id, filename, original_filename, file_type, file_size,
        file_path, document_type, related_entity_type, related_entity_id,
        uploaded_by, hash, blockchain_hash, ocr_text, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, document_id, req.file.filename, req.file.originalname, req.file.mimetype,
      req.file.size, req.file.path, document_type,
      related_entity_type || null, related_entity_id || null,
      req.user.id, hash, blockchain_hash, ocr_text,
      JSON.stringify({ uploadDate: new Date().toISOString() })
    );

    // Create notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, data, channels)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      req.user.id,
      'document_uploaded',
      'Document Uploaded',
      `Your document ${req.file.originalname} has been successfully uploaded and is pending verification.`,
      JSON.stringify({ document_id: id }),
      '["in_app", "email"]'
    );

    console.log(`📄 Document uploaded: ${document_id}`);
    console.log(`   📁 File: ${req.file.originalname}`);
    console.log(`   👤 Uploaded by: ${req.user.full_name}`);
    console.log(`   🔐 Hash: ${hash.substring(0, 16)}...`);
    console.log(`   🔗 Blockchain: ${blockchain_hash}`);

    // Simulated virus scan
    console.log(`   🛡️  Virus scan: CLEAN (simulated - would use ClamAV in production)`);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        id,
        document_id,
        filename: req.file.filename,
        original_filename: req.file.originalname,
        file_type: req.file.mimetype,
        file_size: req.file.size,
        document_type,
        hash,
        blockchain_hash
      }
    });
  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error uploading document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all documents (filtered by role)
router.get('/', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const { document_type, verified } = req.query;

    let query = `
      SELECT d.*,
             u.full_name as uploaded_by_name,
             u2.full_name as verified_by_name
      FROM documents d
      LEFT JOIN users u ON d.uploaded_by = u.id
      LEFT JOIN users u2 ON d.verified_by = u2.id
    `;

    const conditions = [];
    const params = [];

    // Role-based filtering
    if (req.user.role === 'citizen') {
      conditions.push('d.uploaded_by = ?');
      params.push(req.user.id);
    }

    // Filter by document type
    if (document_type) {
      conditions.push('d.document_type = ?');
      params.push(document_type);
    }

    // Filter by verification status
    if (verified !== undefined) {
      conditions.push('d.verified = ?');
      params.push(verified === 'true' ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY d.created_at DESC';

    const documents = db.prepare(query).all(...params);

    res.json({ success: true, data: documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single document
router.get('/:id', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const document = db.prepare(`
      SELECT d.*,
             u.full_name as uploaded_by_name, u.email as uploaded_by_email,
             u2.full_name as verified_by_name
      FROM documents d
      LEFT JOIN users u ON d.uploaded_by = u.id
      LEFT JOIN users u2 ON d.verified_by = u2.id
      WHERE d.id = ?
    `).get(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Authorization check
    if (req.user.role === 'citizen' && document.uploaded_by !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: document });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Download document
router.get('/:id/download', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Authorization check
    if (req.user.role === 'citizen' && document.uploaded_by !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    res.download(document.file_path, document.original_filename);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify document (officers and admins only)
router.put('/:id/verify', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'lands_officer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only lands officers can verify documents' });
    }

    const db = getDatabase();
    const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.verified) {
      return res.status(400).json({ success: false, message: 'Document already verified' });
    }

    db.prepare(`
      UPDATE documents
      SET verified = 1, verified_by = ?, verified_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.user.id, req.params.id);

    // Create notification for uploader
    db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, data, channels)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      document.uploaded_by,
      'document_uploaded',
      'Document Verified',
      `Your document ${document.original_filename} has been verified and accepted.`,
      JSON.stringify({ document_id: req.params.id }),
      '["in_app", "email"]'
    );

    console.log(`✅ Document verified: ${document.document_id} by ${req.user.full_name}`);

    res.json({ success: true, message: 'Document verified successfully' });
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete document (officers and admins only, or owner)
router.delete('/:id', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Authorization check
    const canDelete = req.user.role === 'admin' ||
                      req.user.role === 'lands_officer' ||
                      (req.user.role === 'citizen' && document.uploaded_by === req.user.id);

    if (!canDelete) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Delete file from disk
    if (fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }

    // Delete from database
    db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);

    console.log(`🗑️  Document deleted: ${document.document_id} by ${req.user.full_name}`);

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify document hash (blockchain verification simulation)
router.post('/:id/verify-hash', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    // Recalculate hash
    const fileBuffer = fs.readFileSync(document.file_path);
    const currentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Compare with stored hash
    const isValid = currentHash === document.hash;

    console.log(`🔐 Document hash verification: ${document.document_id}`);
    console.log(`   Stored hash: ${document.hash.substring(0, 16)}...`);
    console.log(`   Current hash: ${currentHash.substring(0, 16)}...`);
    console.log(`   Result: ${isValid ? 'VALID ✅' : 'INVALID ❌'}`);

    res.json({
      success: true,
      data: {
        document_id: document.document_id,
        stored_hash: document.hash,
        current_hash: currentHash,
        is_valid: isValid,
        blockchain_hash: document.blockchain_hash,
        message: isValid ? 'Document integrity verified' : 'Document has been modified'
      }
    });
  } catch (error) {
    console.error('Error verifying hash:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
