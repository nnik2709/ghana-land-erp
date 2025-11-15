import React, { useState } from 'react';
import {
  Container, Typography, Card, CardContent, Box, TextField, Button, Grid,
  Switch, FormControlLabel, Divider, Alert, Avatar, IconButton, Chip
} from '@mui/material';
import { Settings, Fingerprint, Security, Notifications, AccountCircle, Edit, Save } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    sms: true,
    email: true,
    push: true,
    applicationUpdates: true,
    paymentReceipts: true
  });
  const [saved, setSaved] = useState(false);

  const handleEnableBiometric = async () => {
    if (!biometricEnabled) {
      // Simulate biometric setup
      alert('BIOMETRIC AUTHENTICATION SETUP\n\n' +
            'This would initiate:\n' +
            '1. WebAuthn/FIDO2 registration\n' +
            '2. Fingerprint or Face ID capture\n' +
            '3. Secure key generation\n' +
            '4. Store public key on server\n\n' +
            'Production: Use browser WebAuthn API\n' +
            'navigator.credentials.create({ publicKey: {...} })');
      setBiometricEnabled(true);
    } else {
      setBiometricEnabled(false);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
        <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
        Account Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account preferences and security settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Profile Information</Typography>
                <Button
                  startIcon={editMode ? <Save /> : <Edit />}
                  onClick={() => editMode ? handleSave() : setEditMode(true)}
                >
                  {editMode ? 'Save' : 'Edit'}
                </Button>
              </Box>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#006B3F', fontSize: 32 }}>
                  {user?.full_name?.charAt(0) || 'U'}
                </Avatar>
                {editMode && (
                  <Button size="small" variant="outlined">Change Photo</Button>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    defaultValue={user?.full_name}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={user?.email}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    defaultValue="+233 244 123 456"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    defaultValue={user?.role}
                    disabled
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                Security Settings
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Biometric Authentication */}
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Fingerprint /> Biometric Authentication
                      {biometricEnabled && <Chip label="Enabled" color="success" size="small" />}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use fingerprint or face recognition for secure login
                    </Typography>
                  </Box>
                  <Switch
                    checked={biometricEnabled}
                    onChange={handleEnableBiometric}
                    color="success"
                  />
                </Box>
                {biometricEnabled && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    Biometric authentication is active. You can now use your fingerprint or face to login.
                    <br />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      Production: Uses WebAuthn/FIDO2 standard for secure biometric authentication
                    </Typography>
                  </Alert>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Two-Factor Authentication */}
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1">Two-Factor Authentication (2FA)</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add an extra layer of security with SMS or authenticator app
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small">
                    Setup 2FA
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Password Change */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>Change Password</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm Password"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" size="small">
                      Update Password
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                Notification Preferences
              </Typography>
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.sms}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, sms: e.target.checked })}
                  />
                }
                label="SMS Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.email}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, email: e.target.checked })}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.push}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, push: e.target.checked })}
                  />
                }
                label="Push Notifications"
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>Notification Types</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.applicationUpdates}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, applicationUpdates: e.target.checked })}
                  />
                }
                label="Application Status Updates"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.paymentReceipts}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentReceipts: e.target.checked })}
                  />
                }
                label="Payment Receipts"
              />
              <Box mt={2}>
                <Button variant="contained" onClick={handleSave}>
                  Save Preferences
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Account Summary</Typography>
              <Box sx={{ '& > *': { mb: 2 } }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Account Status</Typography>
                  <Typography variant="body1">
                    <Chip label="Active" color="success" size="small" />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Member Since</Typography>
                  <Typography variant="body1">January 2025</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Last Login</Typography>
                  <Typography variant="body1">Today, 2:30 PM</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" fullWidth>Download Data</Button>
                <Button variant="outlined" fullWidth>Activity Log</Button>
                <Button variant="outlined" color="error" fullWidth>Delete Account</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
