import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Box,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Security,
  Notifications,
  AccountBalance,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning,
  Badge,
  Business
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function MyAccountPage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  // User profile data
  const [profile, setProfile] = useState({
    firstName: 'Kwame',
    lastName: 'Asante',
    email: 'kwame.asante@email.com',
    phone: '+233 24 123 4567',
    alternatePhone: '',
    address: '15 Independence Avenue',
    city: 'Accra',
    region: 'Greater Accra',
    postalCode: 'GA-123',
    idType: 'Ghana Card',
    idNumber: 'GHA-123456789',
    dateOfBirth: '1985-03-15',
    nationality: 'Ghanaian',
    occupation: 'Business Owner',
    employer: 'Self-Employed',
    accountType: 'Individual',
    accountStatus: 'verified',
    createdDate: '2024-01-15',
    lastLogin: '2024-11-18'
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailBillReminders: true,
    emailPaymentConfirmation: true,
    emailNewsletter: false,
    smsBillReminders: true,
    smsPaymentConfirmation: true,
    smsUrgentAlerts: true
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Billing info
  const [billingInfo, setBillingInfo] = useState({
    preferredPaymentMethod: 'card',
    autoPayEnabled: false,
    billingAddress: 'Same as profile address',
    paperlessBilling: true
  });

  const handleProfileSave = async () => {
    setProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessing(false);
    setEditing(false);
    setAlert({ type: 'success', message: 'Profile updated successfully!' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match!' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setAlert({ type: 'error', message: 'Password must be at least 8 characters!' });
      return;
    }

    setProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessing(false);
    setPasswordDialogOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setAlert({ type: 'success', message: 'Password changed successfully!' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleNotificationSave = async () => {
    setProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessing(false);
    setAlert({ type: 'success', message: 'Notification preferences updated!' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleBillingSave = async () => {
    setProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessing(false);
    setAlert({ type: 'success', message: 'Billing preferences updated!' });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          My Account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your profile, security settings, and preferences
        </Typography>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Account Overview Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#006B3F', fontSize: '2rem' }}>
              {profile.firstName[0]}{profile.lastName[0]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Chip
                  icon={profile.accountStatus === 'verified' ? <CheckCircle /> : <Warning />}
                  label={profile.accountStatus === 'verified' ? 'Verified Account' : 'Pending Verification'}
                  size="small"
                  color={profile.accountStatus === 'verified' ? 'success' : 'warning'}
                />
                <Chip
                  label={profile.accountType}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography variant="caption" color="text.secondary" display="block">
                Member since
              </Typography>
              <Typography variant="body2">
                {new Date(profile.createdDate).toLocaleDateString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Last login
              </Typography>
              <Typography variant="body2">
                {new Date(profile.lastLogin).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Profile" icon={<Person />} iconPosition="start" />
          <Tab label="Security" icon={<Security />} iconPosition="start" />
          <Tab label="Notifications" icon={<Notifications />} iconPosition="start" />
          <Tab label="Billing Info" icon={<AccountBalance />} iconPosition="start" />
        </Tabs>

        {/* Profile Tab */}
        {tabValue === 0 && (
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Personal Information</Typography>
              {!editing ? (
                <Button startIcon={<Edit />} onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <Box>
                  <Button
                    startIcon={<Cancel />}
                    onClick={() => setEditing(false)}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={processing ? <CircularProgress size={20} /> : <Save />}
                    onClick={handleProfileSave}
                    disabled={processing}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.disabled' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.disabled' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alternate Phone"
                  value={profile.alternatePhone}
                  onChange={(e) => setProfile({ ...profile, alternatePhone: e.target.value })}
                  disabled={!editing}
                  placeholder="Optional"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  disabled={!editing}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ mb: 2, mt: 1 }}>
                  Address
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: 'text.disabled' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth disabled={!editing}>
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={profile.region}
                    onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                    label="Region"
                  >
                    <MenuItem value="Greater Accra">Greater Accra</MenuItem>
                    <MenuItem value="Ashanti">Ashanti</MenuItem>
                    <MenuItem value="Western">Western</MenuItem>
                    <MenuItem value="Eastern">Eastern</MenuItem>
                    <MenuItem value="Central">Central</MenuItem>
                    <MenuItem value="Northern">Northern</MenuItem>
                    <MenuItem value="Volta">Volta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={profile.postalCode}
                  onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                  disabled={!editing}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ mb: 2, mt: 1 }}>
                  Identification
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!editing}>
                  <InputLabel>ID Type</InputLabel>
                  <Select
                    value={profile.idType}
                    onChange={(e) => setProfile({ ...profile, idType: e.target.value })}
                    label="ID Type"
                  >
                    <MenuItem value="Ghana Card">Ghana Card</MenuItem>
                    <MenuItem value="Passport">Passport</MenuItem>
                    <MenuItem value="Voter ID">Voter ID</MenuItem>
                    <MenuItem value="Driver License">Driver's License</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID Number"
                  value={profile.idNumber}
                  onChange={(e) => setProfile({ ...profile, idNumber: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <Badge sx={{ mr: 1, color: 'text.disabled' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ mb: 2, mt: 1 }}>
                  Employment
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nationality"
                  value={profile.nationality}
                  onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={profile.occupation}
                  onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Employer"
                  value={profile.employer}
                  onChange={(e) => setProfile({ ...profile, employer: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <Business sx={{ mr: 1, color: 'text.disabled' }} />
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Security Tab */}
        {tabValue === 1 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last changed: Never
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setPasswordDialogOpen(true)}
                  >
                    Change Password
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Two-Factor Authentication
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add an extra layer of security to your account
                    </Typography>
                  </Box>
                  <Button variant="outlined" color="success">
                    Enable 2FA
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Login History
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Nov 18, 2024 10:30 AM</TableCell>
                      <TableCell>Accra, Ghana</TableCell>
                      <TableCell>Chrome on Windows</TableCell>
                      <TableCell>
                        <Chip label="Current" size="small" color="success" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Nov 17, 2024 3:45 PM</TableCell>
                      <TableCell>Accra, Ghana</TableCell>
                      <TableCell>Safari on iPhone</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Nov 15, 2024 9:00 AM</TableCell>
                      <TableCell>Accra, Ghana</TableCell>
                      <TableCell>Chrome on Windows</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </CardContent>
        )}

        {/* Notifications Tab */}
        {tabValue === 2 && (
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Notification Preferences</Typography>
              <Button
                variant="contained"
                onClick={handleNotificationSave}
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : <Save />}
              >
                Save Preferences
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Email />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Email Notifications
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.emailBillReminders}
                          onChange={(e) => setNotifications({ ...notifications, emailBillReminders: e.target.checked })}
                        />
                      }
                      label="Bill Reminders"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.emailPaymentConfirmation}
                          onChange={(e) => setNotifications({ ...notifications, emailPaymentConfirmation: e.target.checked })}
                        />
                      }
                      label="Payment Confirmations"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.emailNewsletter}
                          onChange={(e) => setNotifications({ ...notifications, emailNewsletter: e.target.checked })}
                        />
                      }
                      label="Newsletter & Updates"
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Phone />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        SMS Notifications
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.smsBillReminders}
                          onChange={(e) => setNotifications({ ...notifications, smsBillReminders: e.target.checked })}
                        />
                      }
                      label="Bill Reminders"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.smsPaymentConfirmation}
                          onChange={(e) => setNotifications({ ...notifications, smsPaymentConfirmation: e.target.checked })}
                        />
                      }
                      label="Payment Confirmations"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.smsUrgentAlerts}
                          onChange={(e) => setNotifications({ ...notifications, smsUrgentAlerts: e.target.checked })}
                        />
                      }
                      label="Urgent Alerts"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Billing Info Tab */}
        {tabValue === 3 && (
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Billing Information</Typography>
              <Button
                variant="contained"
                onClick={handleBillingSave}
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : <Save />}
              >
                Save Changes
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Payment Method</InputLabel>
                  <Select
                    value={billingInfo.preferredPaymentMethod}
                    onChange={(e) => setBillingInfo({ ...billingInfo, preferredPaymentMethod: e.target.value })}
                    label="Preferred Payment Method"
                  >
                    <MenuItem value="card">Credit/Debit Card</MenuItem>
                    <MenuItem value="bank">Bank Transfer</MenuItem>
                    <MenuItem value="mobile">Mobile Money</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={billingInfo.autoPayEnabled}
                      onChange={(e) => setBillingInfo({ ...billingInfo, autoPayEnabled: e.target.checked })}
                    />
                  }
                  label="Enable Auto-Pay"
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  Automatically pay bills on due date
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={billingInfo.paperlessBilling}
                      onChange={(e) => setBillingInfo({ ...billingInfo, paperlessBilling: e.target.checked })}
                    />
                  }
                  label="Paperless Billing"
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  Receive bills and statements via email only
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Billing Address"
                  value={billingInfo.billingAddress}
                  onChange={(e) => setBillingInfo({ ...billingInfo, billingAddress: e.target.value })}
                  helperText="Leave as 'Same as profile address' to use your profile address"
                />
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Current Password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            margin="normal"
            helperText="Minimum 8 characters"
          />
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Confirm New Password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={processing || !passwordForm.currentPassword || !passwordForm.newPassword}
            startIcon={processing ? <CircularProgress size={20} /> : null}
          >
            {processing ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
