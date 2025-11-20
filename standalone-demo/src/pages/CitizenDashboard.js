import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Fab,
  Collapse,
} from '@mui/material';
import {
  Send,
  Close,
  SmartToy,
} from '@mui/icons-material';
import api from '../services/api';

// AI Assistant responses based on common citizen queries
const getAIResponse = (query) => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('pay') || lowerQuery.includes('payment') || lowerQuery.includes('bill')) {
    return {
      text: "To pay your land rent or fees, go to 'Pay Online' in the Payments & Billing menu. You can pay via Mobile Money (MTN, Vodafone, AirtelTigo), bank card, or bank transfer. Your current outstanding balance is GHS 500.",
      actions: [{ label: 'Pay Now', path: '/pay-online' }]
    };
  }

  if (lowerQuery.includes('title') || lowerQuery.includes('certificate')) {
    return {
      text: "To check your land titles, visit 'Land Titles' in the Properties menu. You have 1 issued title. If you need a certified copy, you can request it from the Documents section.",
      actions: [{ label: 'View Titles', path: '/titles' }]
    };
  }

  if (lowerQuery.includes('application') || lowerQuery.includes('status') || lowerQuery.includes('track')) {
    return {
      text: "You have 1 active application. You can track its status in the 'Applications' section under Services. Current processing time is approximately 10 days.",
      actions: [{ label: 'Track Application', path: '/applications' }]
    };
  }

  if (lowerQuery.includes('register') || lowerQuery.includes('new land') || lowerQuery.includes('first registration')) {
    return {
      text: "To register new land, you'll need: 1) Proof of ownership (deed, allocation letter), 2) Site plan from licensed surveyor, 3) Valid ID (Ghana Card). Visit our office or start online through Applications.",
      actions: [{ label: 'Start Application', path: '/applications' }]
    };
  }

  if (lowerQuery.includes('survey') || lowerQuery.includes('surveyor') || lowerQuery.includes('boundary')) {
    return {
      text: "For surveying services, you can find licensed surveyors through our directory. Average cost is GHS 2,000-5,000 depending on parcel size. We also offer community para-surveyor services at lower cost.",
      actions: [{ label: 'View Parcels', path: '/parcels' }]
    };
  }

  if (lowerQuery.includes('dispute') || lowerQuery.includes('conflict') || lowerQuery.includes('boundary problem')) {
    return {
      text: "For land disputes, we recommend first attempting mediation through our Dispute Resolution service. You can file a case online or visit our Alternative Dispute Resolution (ADR) office.",
      actions: [{ label: 'Dispute Resolution', path: '/disputes' }]
    };
  }

  if (lowerQuery.includes('mortgage') || lowerQuery.includes('loan') || lowerQuery.includes('collateral')) {
    return {
      text: "Your land title can be used as collateral for loans. Visit the Mortgages section to see encumbrance status and register new mortgages with partner banks.",
      actions: [{ label: 'View Mortgages', path: '/mortgages' }]
    };
  }

  if (lowerQuery.includes('transfer') || lowerQuery.includes('sell') || lowerQuery.includes('buy')) {
    return {
      text: "To transfer land ownership, both parties must complete a Title Transfer application. Required: Deed of transfer, Stamp duty receipt, Capital gains tax clearance. Processing takes 2-3 weeks.",
      actions: [{ label: 'Learn More', path: '/help' }]
    };
  }

  if (lowerQuery.includes('document') || lowerQuery.includes('download') || lowerQuery.includes('copy')) {
    return {
      text: "You can download your documents from the Documents section. Available: Site plans, title certificates, receipts, and application forms.",
      actions: [{ label: 'View Documents', path: '/documents' }]
    };
  }

  if (lowerQuery.includes('help') || lowerQuery.includes('contact') || lowerQuery.includes('office')) {
    return {
      text: "Need more help? Visit our Help & Support section for guides, FAQs, and contact information. You can also call our helpline at 0800-LANDS or visit any regional office.",
      actions: [{ label: 'Help Center', path: '/help' }]
    };
  }

  // Default response
  return {
    text: "I can help you with: payments, land titles, applications, registration, surveys, disputes, mortgages, transfers, and documents. What would you like to know?",
    actions: []
  };
};

export default function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: `Hello ${user?.full_name?.split(' ')[0] || 'there'}! I'm your Land Services Assistant. How can I help you today?`,
      actions: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data.data));
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);

    // Get AI response
    const response = getAIResponse(inputValue);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', ...response }]);
    }, 500);

    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'How do I pay my land rent?',
    'Track my application status',
    'How to register new land?',
    'Report a boundary dispute',
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          My Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back, {user?.full_name}! Here's your land management overview.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                My Parcels
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>2</Typography>
              <Button size="small" onClick={() => navigate('/parcels')} sx={{ mt: 1, p: 0 }}>
                View all
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Active Applications
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>1</Typography>
              <Button size="small" onClick={() => navigate('/applications')} sx={{ mt: 1, p: 0 }}>
                Track status
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Issued Titles
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>1</Typography>
              <Button size="small" onClick={() => navigate('/titles')} sx={{ mt: 1, p: 0 }}>
                View titles
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Pending Payments
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                GHS 500
              </Typography>
              <Button size="small" onClick={() => navigate('/pay-online')} sx={{ mt: 1, p: 0 }}>
                Pay now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions & Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Pay Land Rent', path: '/pay-online' },
                  { label: 'Track Application', path: '/applications' },
                  { label: 'View Documents', path: '/documents' },
                  { label: 'Get Help', path: '/help' },
                ].map((action) => (
                  <Grid item xs={6} key={action.label}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate(action.path)}
                      sx={{ py: 1.5 }}
                    >
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
              <List dense>
                {[
                  { text: 'Application #APP-2024-1234 submitted', date: 'Nov 15, 2024' },
                  { text: 'Payment of GHS 250 received', date: 'Nov 10, 2024' },
                  { text: 'Title certificate downloaded', date: 'Nov 5, 2024' },
                  { text: 'Parcel boundary updated', date: 'Oct 28, 2024' },
                ].map((activity, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={activity.text}
                      secondary={activity.date}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Assistant FAB */}
      <Fab
        color="primary"
        onClick={() => setChatOpen(!chatOpen)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        {chatOpen ? <Close /> : <SmartToy />}
      </Fab>

      {/* AI Assistant Chat Window */}
      <Collapse in={chatOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 88,
            right: 24,
            width: 380,
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Chat Header */}
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToy />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Land Services Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Online - Ask me anything
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Chat Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2, maxHeight: 300, bgcolor: '#F8FAFC' }}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                {msg.type === 'bot' && (
                  <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: 'primary.main' }}>
                    <SmartToy sx={{ fontSize: 16 }} />
                  </Avatar>
                )}
                <Box
                  sx={{
                    maxWidth: '80%',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.type === 'user' ? 'primary.main' : 'white',
                    color: msg.type === 'user' ? 'white' : 'text.primary',
                    boxShadow: msg.type === 'bot' ? 1 : 0,
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                  {msg.actions && msg.actions.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {msg.actions.map((action, i) => (
                        <Chip
                          key={i}
                          label={action.label}
                          size="small"
                          onClick={() => {
                            navigate(action.path);
                            setChatOpen(false);
                          }}
                          sx={{ cursor: 'pointer' }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Quick questions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {quickQuestions.map((q) => (
                  <Chip
                    key={q}
                    label={q}
                    size="small"
                    onClick={() => {
                      setInputValue(q);
                      handleSendMessage();
                    }}
                    sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider />

          {/* Chat Input */}
          <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
}
