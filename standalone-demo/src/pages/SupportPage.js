import React, { useState } from 'react';
import {
  Container, Typography, Card, CardContent, Box, TextField, Button, Grid,
  MenuItem, Alert, Chip, Rating, LinearProgress
} from '@mui/material';
import { ContactSupport, BugReport, Lightbulb, Help, Send } from '@mui/icons-material';

const mockTickets = [
  { id: 'TKT-2025-001', subject: 'Payment not reflecting', category: 'Payment', status: 'In Progress', priority: 'High', created: '2025-11-12', rating: null },
  { id: 'TKT-2025-002', subject: 'Cannot download title certificate', category: 'Technical', status: 'Resolved', priority: 'Medium', created: '2025-11-10', rating: 5 },
  { id: 'TKT-2025-003', subject: 'Survey overlap issue', category: 'Survey', status: 'Open', priority: 'High', created: '2025-11-13', rating: null }
];

export default function SupportPage() {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'Medium'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ category: '', subject: '', description: '', priority: 'Medium' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
        <ContactSupport sx={{ mr: 1, verticalAlign: 'middle' }} />
        Support & Feedback
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Get help or share your feedback with us
      </Typography>

      <Grid container spacing={3}>
        {/* Submit Ticket Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Submit Support Ticket</Typography>
              {submitted && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Ticket submitted successfully! Ticket ID: TKT-2025-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Technical">Technical Issue</MenuItem>
                  <MenuItem value="Payment">Payment Related</MenuItem>
                  <MenuItem value="Survey">Survey Issue</MenuItem>
                  <MenuItem value="Document">Document Problem</MenuItem>
                  <MenuItem value="General">General Inquiry</MenuItem>
                  <MenuItem value="Feedback">Feedback/Suggestion</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  required
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  label="Description"
                  placeholder="Please describe your issue or feedback in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  select
                  fullWidth
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </TextField>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<Send />}
                  disabled={!formData.category || !formData.subject || !formData.description}
                >
                  Submit Ticket
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Help & My Tickets */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Help</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Help />}
                  fullWidth
                  onClick={() => alert('Opening FAQ...')}
                >
                  View FAQ
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Lightbulb />}
                  fullWidth
                  onClick={() => alert('Opening tutorials...')}
                >
                  Video Tutorials
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<BugReport />}
                  fullWidth
                  onClick={() => alert('Opening known issues...')}
                >
                  Known Issues
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              <Box sx={{ '& > *': { mb: 1 } }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Phone:</strong> +233 302 664910
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Email:</strong> support@landscommission.gov.gh
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Hours:</strong> Mon-Fri, 8:00 AM - 5:00 PM
                </Typography>
                <Typography variant="body2">
                  <strong>Address:</strong> PMB, Ministries Post Office, Accra
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My Tickets */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>My Recent Tickets</Typography>
              <Grid container spacing={2}>
                {mockTickets.map((ticket) => (
                  <Grid item xs={12} md={4} key={ticket.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Typography variant="caption" color="text.secondary">{ticket.id}</Typography>
                          <Chip
                            label={ticket.status}
                            size="small"
                            color={ticket.status === 'Resolved' ? 'success' : ticket.status === 'In Progress' ? 'warning' : 'default'}
                          />
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>{ticket.subject}</Typography>
                        <Box display="flex" gap={1} mb={1}>
                          <Chip label={ticket.category} size="small" variant="outlined" />
                          <Chip label={ticket.priority} size="small" color={ticket.priority === 'High' ? 'error' : 'default'} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Created: {ticket.created}
                        </Typography>
                        {ticket.rating && (
                          <Box mt={1}>
                            <Rating value={ticket.rating} size="small" readOnly />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
