const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const router = express.Router();

// Get user notifications
router.get('/', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const { read, limit = 50 } = req.query;

    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [req.user.id];

    // Filter by read status
    if (read !== undefined) {
      query += ' AND read = ?';
      params.push(read === 'true' ? 1 : 0);
    }

    query += ' ORDER BY sent_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const notifications = db.prepare(query).all(...params);

    // Get unread count
    const unreadCount = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0')
      .get(req.user.id).count;

    res.json({
      success: true,
      data: notifications,
      unread_count: unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get unread count
router.get('/unread-count', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const result = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0')
      .get(req.user.id);

    res.json({
      success: true,
      unread_count: result.count
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, (req, res) => {
  try {
    const db = getDatabase();

    // Check if notification belongs to user
    const notification = db.prepare('SELECT * FROM notifications WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.read) {
      return res.json({ success: true, message: 'Notification already marked as read' });
    }

    // Mark as read
    db.prepare('UPDATE notifications SET read = 1, read_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(req.params.id);

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark all as read
router.put('/mark-all-read', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    db.prepare('UPDATE notifications SET read = 1, read_at = CURRENT_TIMESTAMP WHERE user_id = ? AND read = 0')
      .run(req.user.id);

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get notification settings
router.get('/settings', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    let settings = db.prepare('SELECT * FROM notification_settings WHERE user_id = ?')
      .get(req.user.id);

    // Create default settings if none exist
    if (!settings) {
      db.prepare(`
        INSERT INTO notification_settings (user_id, sms_enabled, email_enabled, push_enabled, application_updates, payment_receipts, survey_status, title_updates, mortgage_updates)
        VALUES (?, 1, 1, 1, 1, 1, 1, 1, 1)
      `).run(req.user.id);

      settings = db.prepare('SELECT * FROM notification_settings WHERE user_id = ?')
        .get(req.user.id);
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update notification settings
router.put('/settings', authenticate, (req, res) => {
  try {
    const {
      sms_enabled,
      email_enabled,
      push_enabled,
      application_updates,
      payment_receipts,
      survey_status,
      title_updates,
      mortgage_updates
    } = req.body;

    const db = getDatabase();

    // Check if settings exist
    const existing = db.prepare('SELECT * FROM notification_settings WHERE user_id = ?')
      .get(req.user.id);

    if (existing) {
      // Update existing settings
      db.prepare(`
        UPDATE notification_settings
        SET sms_enabled = ?, email_enabled = ?, push_enabled = ?,
            application_updates = ?, payment_receipts = ?, survey_status = ?,
            title_updates = ?, mortgage_updates = ?
        WHERE user_id = ?
      `).run(
        sms_enabled !== undefined ? sms_enabled : existing.sms_enabled,
        email_enabled !== undefined ? email_enabled : existing.email_enabled,
        push_enabled !== undefined ? push_enabled : existing.push_enabled,
        application_updates !== undefined ? application_updates : existing.application_updates,
        payment_receipts !== undefined ? payment_receipts : existing.payment_receipts,
        survey_status !== undefined ? survey_status : existing.survey_status,
        title_updates !== undefined ? title_updates : existing.title_updates,
        mortgage_updates !== undefined ? mortgage_updates : existing.mortgage_updates,
        req.user.id
      );
    } else {
      // Create new settings
      db.prepare(`
        INSERT INTO notification_settings (user_id, sms_enabled, email_enabled, push_enabled, application_updates, payment_receipts, survey_status, title_updates, mortgage_updates)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        req.user.id,
        sms_enabled !== undefined ? sms_enabled : 1,
        email_enabled !== undefined ? email_enabled : 1,
        push_enabled !== undefined ? push_enabled : 1,
        application_updates !== undefined ? application_updates : 1,
        payment_receipts !== undefined ? payment_receipts : 1,
        survey_status !== undefined ? survey_status : 1,
        title_updates !== undefined ? title_updates : 1,
        mortgage_updates !== undefined ? mortgage_updates : 1
      );
    }

    console.log(`⚙️  Notification settings updated for ${req.user.full_name}`);

    res.json({ success: true, message: 'Notification settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send notification (admin only - for testing)
router.post('/send', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can send notifications' });
    }

    const { user_id, type, title, message, data, channels } = req.body;

    if (!user_id || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, type, title, message'
      });
    }

    const result = await notificationService.sendNotification(
      user_id,
      type,
      title,
      message,
      data || {},
      channels || ['in_app']
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Notification sent successfully',
        data: result.results
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete notification
router.delete('/:id', authenticate, (req, res) => {
  try {
    const db = getDatabase();

    // Check if notification belongs to user
    const notification = db.prepare('SELECT * FROM notifications WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    db.prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Test notification (for development)
router.post('/test', authenticate, async (req, res) => {
  try {
    console.log('\n🧪 TESTING NOTIFICATION SYSTEM');
    console.log('================================');

    const result = await notificationService.sendNotification(
      req.user.id,
      'system_alert',
      'Test Notification',
      'This is a test notification to verify the system is working correctly.',
      { test: true, timestamp: new Date().toISOString() },
      ['in_app', 'email', 'sms', 'push']
    );

    console.log('================================\n');

    res.json({
      success: true,
      message: 'Test notification sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
