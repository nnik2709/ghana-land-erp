const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');

/**
 * Notification Service (Simulated)
 *
 * Production Integration:
 * - SMS: Twilio or Africa's Talking
 * - Email: SendGrid or AWS SES
 * - Push: Firebase Cloud Messaging (FCM)
 */

class NotificationService {
  /**
   * Send notification to user
   */
  async sendNotification(userId, type, title, message, data = {}, channels = ['in_app']) {
    try {
      const db = getDatabase();

      // Get user details
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      if (!user) {
        console.error(`❌ User not found: ${userId}`);
        return { success: false, error: 'User not found' };
      }

      // Get notification settings
      const settings = db.prepare('SELECT * FROM notification_settings WHERE user_id = ?').get(userId);

      // Check if user has settings, if not create default
      if (!settings) {
        db.prepare(`
          INSERT INTO notification_settings (user_id, sms_enabled, email_enabled, push_enabled)
          VALUES (?, 1, 1, 1)
        `).run(userId);
      }

      // Create notification record
      const notificationId = uuidv4();
      db.prepare(`
        INSERT INTO notifications (id, user_id, type, title, message, data, channels)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(notificationId, userId, type, title, message, JSON.stringify(data), JSON.stringify(channels));

      console.log(`\n📬 NOTIFICATION SENT`);
      console.log(`   To: ${user.full_name} (${user.email})`);
      console.log(`   Type: ${type}`);
      console.log(`   Title: ${title}`);
      console.log(`   Message: ${message}`);
      console.log(`   Channels: ${channels.join(', ')}`);

      // Simulate sending through different channels
      const results = {
        notification_id: notificationId,
        channels: {}
      };

      for (const channel of channels) {
        switch (channel) {
          case 'sms':
            if (!settings || settings.sms_enabled) {
              results.channels.sms = this.sendSMS(user.phone, message);
            } else {
              results.channels.sms = { sent: false, reason: 'SMS disabled in user settings' };
            }
            break;

          case 'email':
            if (!settings || settings.email_enabled) {
              results.channels.email = this.sendEmail(user.email, title, message);
            } else {
              results.channels.email = { sent: false, reason: 'Email disabled in user settings' };
            }
            break;

          case 'push':
            if (!settings || settings.push_enabled) {
              results.channels.push = this.sendPush(userId, title, message);
            } else {
              results.channels.push = { sent: false, reason: 'Push disabled in user settings' };
            }
            break;

          case 'in_app':
            results.channels.in_app = { sent: true, notification_id: notificationId };
            break;
        }
      }

      return { success: true, results };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send SMS (Simulated - would use Twilio in production)
   */
  sendSMS(phoneNumber, message) {
    console.log(`\n📱 SMS SIMULATION`);
    console.log(`   To: ${phoneNumber}`);
    console.log(`   Message: ${message}`);
    console.log(`   Status: SENT (simulated)`);
    console.log(`\n   PRODUCTION INTEGRATION:`);
    console.log(`   Provider: Twilio / Africa's Talking`);
    console.log(`   Code:`);
    console.log(`     const twilio = require('twilio');`);
    console.log(`     const client = twilio(ACCOUNT_SID, AUTH_TOKEN);`);
    console.log(`     await client.messages.create({`);
    console.log(`       body: message,`);
    console.log(`       from: '+1234567890',`);
    console.log(`       to: '${phoneNumber}'`);
    console.log(`     });`);

    return {
      sent: true,
      provider: 'simulated',
      phoneNumber: phoneNumber,
      messageId: `SMS-${Date.now()}`
    };
  }

  /**
   * Send Email (Simulated - would use SendGrid in production)
   */
  sendEmail(email, subject, message) {
    console.log(`\n📧 EMAIL SIMULATION`);
    console.log(`   To: ${email}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Message: ${message}`);
    console.log(`   Status: SENT (simulated)`);
    console.log(`\n   PRODUCTION INTEGRATION:`);
    console.log(`   Provider: SendGrid / AWS SES`);
    console.log(`   Code:`);
    console.log(`     const sgMail = require('@sendgrid/mail');`);
    console.log(`     sgMail.setApiKey(process.env.SENDGRID_API_KEY);`);
    console.log(`     await sgMail.send({`);
    console.log(`       to: '${email}',`);
    console.log(`       from: 'noreply@landscommission.gov.gh',`);
    console.log(`       subject: '${subject}',`);
    console.log(`       html: '<p>${message}</p>'`);
    console.log(`     });`);

    // Simulate email template
    const emailTemplate = this.generateEmailTemplate(subject, message);
    console.log(`\n   EMAIL TEMPLATE PREVIEW:`);
    console.log(`   -------------------------`);
    console.log(emailTemplate);
    console.log(`   -------------------------`);

    return {
      sent: true,
      provider: 'simulated',
      email: email,
      messageId: `EMAIL-${Date.now()}`
    };
  }

  /**
   * Send Push Notification (Simulated - would use Firebase in production)
   */
  sendPush(userId, title, message) {
    console.log(`\n🔔 PUSH NOTIFICATION SIMULATION`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Title: ${title}`);
    console.log(`   Message: ${message}`);
    console.log(`   Status: SENT (simulated)`);
    console.log(`\n   PRODUCTION INTEGRATION:`);
    console.log(`   Provider: Firebase Cloud Messaging (FCM)`);
    console.log(`   Code:`);
    console.log(`     const admin = require('firebase-admin');`);
    console.log(`     const message = {`);
    console.log(`       notification: {`);
    console.log(`         title: '${title}',`);
    console.log(`         body: '${message}'`);
    console.log(`       },`);
    console.log(`       token: deviceToken`);
    console.log(`     };`);
    console.log(`     await admin.messaging().send(message);`);

    return {
      sent: true,
      provider: 'simulated',
      userId: userId,
      messageId: `PUSH-${Date.now()}`
    };
  }

  /**
   * Generate HTML email template
   */
  generateEmailTemplate(subject, message) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { background-color: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
    .header { border-bottom: 4px solid #006B3F; padding-bottom: 20px; }
    .flag { height: 8px; background: linear-gradient(to bottom, #CE1126 33%, #FCD116 33%, #FCD116 66%, #006B3F 66%); margin-bottom: 20px; }
    .logo { color: #006B3F; font-size: 24px; font-weight: bold; }
    .content { padding: 20px 0; }
    .footer { border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="flag"></div>
      <div class="logo">🇬🇭 Ghana Lands Commission</div>
    </div>
    <div class="content">
      <h2 style="color: #006B3F;">${subject}</h2>
      <p>${message}</p>
    </div>
    <div class="footer">
      <p>Ghana Lands Commission | Land Administration System</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(userIds, type, title, message, data = {}, channels = ['in_app']) {
    const results = [];
    for (const userId of userIds) {
      const result = await this.sendNotification(userId, type, title, message, data, channels);
      results.push({ userId, ...result });
    }
    return results;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId) {
    try {
      const db = getDatabase();
      db.prepare(`
        UPDATE notifications
        SET read = 1, read_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(notificationId);
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NotificationService();
