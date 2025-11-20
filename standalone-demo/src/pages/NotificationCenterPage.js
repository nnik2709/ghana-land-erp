import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  MenuItem, Divider, Alert, Tabs, Tab, List, ListItem, ListItemText, ListItemIcon,
  ListItemSecondaryAction, IconButton, Switch, FormControlLabel
} from '@mui/material';
import {
  Notifications, Sms, Email, Send, Settings, CheckCircle, Schedule, Warning,
  Delete, Visibility, FilterList, Refresh, Person, Business, Add
} from '@mui/icons-material';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function NotificationCenterPage() {
  const [tabValue, setTabValue] = useState(0);
  const [composeOpen, setComposeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  // Mock notification history
  const notifications = [
    {
      id: 1,
      type: 'SMS',
      recipient: '+233244123456',
      recipientName: 'Kwame Asante',
      subject: 'Title Approved',
      message: 'Your land title application (TIT/2024/001) has been approved. Please visit our office to collect your certificate.',
      status: 'Delivered',
      sentDate: '2024-11-15 14:30',
      category: 'Title'
    },
    {
      id: 2,
      type: 'Email',
      recipient: 'accra.developers@email.com',
      recipientName: 'Accra Developers Ltd',
      subject: 'Payment Reminder - Annual Lease',
      message: 'Dear Customer, this is a reminder that your annual lease payment of GHS 25,000 is due on 2025-01-01. Please ensure timely payment to avoid penalties.',
      status: 'Delivered',
      sentDate: '2024-11-14 09:00',
      category: 'Payment'
    },
    {
      id: 3,
      type: 'SMS',
      recipient: '+233201987654',
      recipientName: 'Ama Mensah',
      subject: 'Survey Scheduled',
      message: 'Your parcel survey (ACC/2024/015) is scheduled for 2024-11-20 at 10:00 AM. Please ensure access to the property.',
      status: 'Delivered',
      sentDate: '2024-11-13 16:45',
      category: 'Survey'
    },
    {
      id: 4,
      type: 'Email',
      recipient: 'western.shipping@email.com',
      recipientName: 'Western Shipping Co',
      subject: 'Lease Expiry Warning',
      message: 'Your lease (LSE/2024/003) will expire on 2025-03-15. Please submit a renewal application at least 60 days before expiry to ensure continuity.',
      status: 'Delivered',
      sentDate: '2024-11-12 11:00',
      category: 'Lease'
    },
    {
      id: 5,
      type: 'SMS',
      recipient: '+233277654321',
      recipientName: 'Kofi Boateng',
      subject: 'Dispute Resolution Update',
      message: 'Your dispute case (DSP/2024/002) has been scheduled for mediation on 2024-11-25. Please attend with all relevant documents.',
      status: 'Failed',
      sentDate: '2024-11-11 08:30',
      category: 'Dispute'
    },
    {
      id: 6,
      type: 'Email',
      recipient: 'ashanti.estates@email.com',
      recipientName: 'Ashanti Estates',
      subject: 'Subdivision Application Status',
      message: 'Your subdivision application (SUB/2024/003) has passed survey verification. Next step: Planning Review. Estimated completion: 15 business days.',
      status: 'Pending',
      sentDate: '2024-11-10 14:00',
      category: 'Subdivision'
    }
  ];

  // Mock templates
  const templates = [
    { id: 1, name: 'Title Approval', category: 'Title', type: 'Both' },
    { id: 2, name: 'Payment Reminder', category: 'Payment', type: 'Both' },
    { id: 3, name: 'Survey Schedule', category: 'Survey', type: 'SMS' },
    { id: 4, name: 'Lease Expiry Warning', category: 'Lease', type: 'Email' },
    { id: 5, name: 'Application Status Update', category: 'General', type: 'Both' },
    { id: 6, name: 'Document Required', category: 'General', type: 'Both' },
    { id: 7, name: 'Dispute Hearing Notice', category: 'Dispute', type: 'Both' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const handleSendNotification = () => {
    setAlert({ type: 'success', message: 'Notification sent successfully!' });
    setComposeOpen(false);
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setViewDialogOpen(true);
  };

  const smsCount = notifications.filter(n => n.type === 'SMS').length;
  const emailCount = notifications.filter(n => n.type === 'Email').length;
  const deliveredCount = notifications.filter(n => n.status === 'Delivered').length;
  const failedCount = notifications.filter(n => n.status === 'Failed').length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
            Notification Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            SMS and Email notification management hub
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={() => setComposeOpen(true)}
            sx={{ bgcolor: '#006B3F' }}
          >
            Compose
          </Button>
        </Box>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Sms sx={{ fontSize: 32, color: '#006B3F', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{smsCount}</Typography>
              <Typography variant="body2" color="text.secondary">SMS Sent</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Email sx={{ fontSize: 32, color: '#FCD116', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{emailCount}</Typography>
              <Typography variant="body2" color="text.secondary">Emails Sent</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{deliveredCount}</Typography>
              <Typography variant="body2" color="text.secondary">Delivered</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{failedCount}</Typography>
              <Typography variant="body2" color="text.secondary">Failed</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="History" />
          <Tab label="Templates" />
          <Tab label="Scheduled" />
        </Tabs>

        {/* History Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Recipient</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Sent</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      {notification.type === 'SMS' ? (
                        <Chip icon={<Sms />} label="SMS" size="small" variant="outlined" />
                      ) : (
                        <Chip icon={<Email />} label="Email" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{notification.recipientName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.recipient}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{notification.subject}</TableCell>
                    <TableCell>
                      <Chip label={notification.category} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{notification.sentDate}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={notification.status}
                        size="small"
                        color={getStatusColor(notification.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewNotification(notification)}
                      >
                        <Visibility />
                      </IconButton>
                      {notification.status === 'Failed' && (
                        <IconButton size="small" color="primary">
                          <Refresh />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Templates Tab */}
        <TabPanel value={tabValue} index={1}>
          <List>
            {templates.map((template) => (
              <ListItem key={template.id} divider>
                <ListItemIcon>
                  {template.type === 'SMS' ? <Sms /> : template.type === 'Email' ? <Email /> : <Notifications />}
                </ListItemIcon>
                <ListItemText
                  primary={template.name}
                  secondary={`Category: ${template.category} | Type: ${template.type}`}
                />
                <ListItemSecondaryAction>
                  <Button size="small" variant="outlined">
                    Edit
                  </Button>
                  <Button size="small" sx={{ ml: 1 }}>
                    Use
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 2 }}>
            <Button startIcon={<Add />} variant="outlined">
              Create Template
            </Button>
          </Box>
        </TabPanel>

        {/* Scheduled Tab */}
        <TabPanel value={tabValue} index={2}>
          <Alert severity="info">
            No scheduled notifications. Use the compose feature to schedule notifications for future delivery.
          </Alert>
        </TabPanel>
      </Paper>

      {/* Compose Dialog */}
      <Dialog
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Compose Notification</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Notification Type</InputLabel>
                  <Select label="Notification Type" defaultValue="sms">
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="both">Both SMS & Email</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Template</InputLabel>
                  <Select label="Template" defaultValue="">
                    <MenuItem value="">None (Custom)</MenuItem>
                    {templates.map((t) => (
                      <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Recipient Type</InputLabel>
                  <Select label="Recipient Type" defaultValue="individual">
                    <MenuItem value="individual">Individual</MenuItem>
                    <MenuItem value="group">User Group</MenuItem>
                    <MenuItem value="bulk">Bulk (CSV Upload)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Recipient Name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone/Email" placeholder="+233244123456 or email@example.com" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Subject" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  helperText="SMS: Max 160 characters per segment"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch />}
                  label="Schedule for later"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSendNotification}
            sx={{ bgcolor: '#006B3F' }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Notification Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedNotification.subject}</Typography>
                <Chip
                  label={selectedNotification.status}
                  size="small"
                  color={getStatusColor(selectedNotification.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Typography variant="body1">{selectedNotification.type}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Sent</Typography>
                  <Typography variant="body1">{selectedNotification.sentDate}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Recipient</Typography>
                  <Typography variant="body1">
                    {selectedNotification.recipientName} ({selectedNotification.recipient})
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Message</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 0.5, bgcolor: '#f5f5f5' }}>
                    <Typography variant="body2">{selectedNotification.message}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              {selectedNotification.status === 'Failed' && (
                <Button variant="contained" startIcon={<Refresh />} sx={{ bgcolor: '#006B3F' }}>
                  Retry
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>SMS Gateway</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Provider</InputLabel>
              <Select label="Provider" defaultValue="hubtel">
                <MenuItem value="hubtel">Hubtel</MenuItem>
                <MenuItem value="mnotify">mNotify</MenuItem>
                <MenuItem value="arkesel">Arkesel</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="API Key"
              type="password"
              sx={{ mb: 3 }}
              placeholder="••••••••••••"
            />

            <Typography variant="subtitle2" gutterBottom>Email Configuration</Typography>
            <TextField fullWidth label="SMTP Server" sx={{ mb: 2 }} defaultValue="smtp.gmail.com" />
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField fullWidth label="Port" defaultValue="587" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="From Email" defaultValue="noreply@lands.gov.gh" />
              </Grid>
            </Grid>

            <Typography variant="subtitle2" gutterBottom>Auto-Notifications</Typography>
            <FormControlLabel control={<Switch defaultChecked />} label="Title approval notifications" />
            <FormControlLabel control={<Switch defaultChecked />} label="Payment reminders" />
            <FormControlLabel control={<Switch defaultChecked />} label="Lease expiry warnings" />
            <FormControlLabel control={<Switch />} label="Survey schedule updates" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#006B3F' }}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
