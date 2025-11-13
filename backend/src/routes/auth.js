const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active'
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    delete user.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Register (demo - simplified)
router.post('/register', (req, res) => {
  try {
    const { username, email, password, full_name, phone } = req.body;

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const db = getDatabase();

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = uuidv4();

    db.prepare(`
      INSERT INTO users (id, username, email, password, full_name, phone, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, username, email, hashedPassword, full_name, phone || null, 'citizen');

    const token = jwt.sign(
      { userId, role: 'citizen' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: userId,
          username,
          email,
          full_name,
          phone,
          role: 'citizen'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Get demo users (for testing)
router.get('/demo-users', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        username: 'citizen',
        password: 'demo123',
        role: 'Citizen',
        description: 'Regular landowner - can apply for titles, make payments, view certificates'
      },
      {
        username: 'surveyor',
        password: 'demo123',
        role: 'Surveyor',
        description: 'Licensed surveyor - can submit surveys, upload coordinates, generate reports'
      },
      {
        username: 'officer',
        password: 'demo123',
        role: 'Lands Officer',
        description: 'Lands Commission officer - can review applications, approve titles'
      },
      {
        username: 'admin',
        password: 'demo123',
        role: 'Administrator',
        description: 'System admin - full access to all features, analytics, and settings'
      }
    ]
  });
});

module.exports = router;
