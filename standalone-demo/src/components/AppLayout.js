import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import {
  Home,
  Chat,
  Close,
  Send
} from '@mui/icons-material';

const routeNames = {
  '/citizen': 'Citizen Dashboard',
  '/surveyor': 'Surveyor Dashboard',
  '/officer': 'Officer Dashboard',
  '/admin': 'Admin Dashboard',
  '/parcels': 'Parcels',
  '/titles': 'Land Titles',
  '/applications': 'Applications',
  '/payments': 'Payments',
  '/blockchain': 'Blockchain',
  '/integrations': 'Integrations',
  '/submit-survey': 'Submit Survey',
  '/my-surveys': 'My Surveys',
  '/mortgages': 'Mortgages',
  '/documents': 'Documents',
  '/help': 'Help & FAQ',
  '/audit': 'Audit Logs',
  '/support': 'Support',
  '/settings': 'Settings',
  '/spatial': 'Spatial Dashboard',
  '/gis-demo': 'GIS Platform Demo'
};

const roleColors = {
  citizen: '#006B3F',      // Ghana Green
  surveyor: '#008751',     // Lighter Ghana Green
  lands_officer: '#C9A200', // Darker Gold
  admin: '#CE1126'         // Ghana Red
};

const roleLabels = {
  citizen: 'Citizen',
  surveyor: 'Surveyor',
  lands_officer: 'Lands Officer',
  admin: 'Administrator'
};

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatMessage, setChatMessage] = React.useState('');

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  const handleTabClick = (tab) => {
    if (tab.onClick) {
      tab.onClick();
    } else {
      navigate(tab.path);
    }
  };

  // Role-specific navigation tabs with shortened labels
  const getNavigationTabs = () => {
    const role = user?.role;

    const citizenTabs = [
      { label: 'Home', path: getHomePath(), icon: true },
      { label: 'Parcels', path: '/parcels' },
      { label: 'Titles', path: '/titles' },
      { label: 'Applications', path: '/applications' },
      { label: 'Mortgages', path: '/mortgages' },
      { label: 'Documents', path: '/documents' },
      { label: 'Payments', path: '/payments' },
      { label: 'Blockchain', path: '/blockchain' },
      { label: 'Audit', path: '/audit' },
    ];

    const surveyorTabs = [
      { label: 'Home', path: getHomePath(), icon: true },
      { label: 'Submit', path: '/submit-survey' },
      { label: 'Surveys', path: '/my-surveys' },
      { label: 'Parcels', path: '/parcels' },
      { label: 'Documents', path: '/documents' },
      { label: 'Audit', path: '/audit' },
    ];

    const officerTabs = [
      { label: 'Home', path: getHomePath(), icon: true },
      { label: 'Applications', path: '/applications' },
      { label: 'Titles', path: '/titles' },
      { label: 'Mortgages', path: '/mortgages' },
      { label: 'Documents', path: '/documents' },
      { label: 'Parcels', path: '/parcels' },
      { label: 'GIS Demo', path: '/gis-demo' },
      { label: 'Payments', path: '/payments' },
      { label: 'Audit', path: '/audit' },
    ];

    const adminTabs = [
      { label: 'Home', path: getHomePath(), icon: true },
      { label: 'Parcels', path: '/parcels' },
      { label: 'GIS Demo', path: '/gis-demo' },
      { label: 'Titles', path: '/titles' },
      { label: 'Applications', path: '/applications' },
      { label: 'Mortgages', path: '/mortgages' },
      { label: 'Documents', path: '/documents' },
      { label: 'Payments', path: '/payments' },
      { label: 'Blockchain', path: '/blockchain' },
      { label: 'Integrations', path: '/integrations' },
      { label: 'Audit', path: '/audit' },
      { label: 'Users', path: '/users', onClick: () => {
        alert('User Management\n\nTotal Users: 4\n\nKofi Mensah (citizen) - Active\nAma Adjei (surveyor) - Active\nAbena Osei (lands_officer) - Active\nKwame Nkrumah (admin) - Active\n\nIn the full application:\n- Create new users\n- Modify user roles\n- Suspend/activate accounts\n- View activity logs\n- Reset passwords');
      }},
    ];

    if (role === 'citizen') return citizenTabs;
    if (role === 'surveyor') return surveyorTabs;
    if (role === 'lands_officer') return officerTabs;
    if (role === 'admin') return adminTabs;
    return [];
  };

  const getHomePath = () => {
    const roleMap = {
      citizen: '/citizen',
      surveyor: '/surveyor',
      lands_officer: '/officer',
      admin: '/admin'
    };
    return roleMap[user?.role] || '/login';
  };

  const roleColor = roleColors[user?.role] || '#006B3F';
  const roleLabel = roleLabels[user?.role] || 'User';

  // Sample chatbot conversations
  const sampleChats = [
    { user: 'Check my land title status', bot: 'Your land title LND-GH-AC-2024-001 is Active and verified on blockchain. Last updated: 2024-11-10' },
    { user: 'Calculate stamp duty for GHS 100,000 property', bot: 'Stamp duty for GHS 100,000 property:\n• Stamp Duty (1%): GHS 1,000\n• Registration Fee: GHS 250\n• Processing Fee: GHS 100\nTotal: GHS 1,350' },
    { user: 'How do I register a mortgage?', bot: 'To register a mortgage:\n1. Submit mortgage application\n2. Upload bank approval letter\n3. Pay registration fees (GHS 350)\n4. Biometric verification\n5. Smart contract execution on blockchain\nProcessing time: 3-5 business days' },
    { user: 'Verify certificate by QR code', bot: 'Please scan or upload the QR code from your certificate. You can also enter the certificate number manually.' }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation Bar - Scandinavian White Design */}
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 0 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#006B3F',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,107,63,0.15)'
              }}
            >
              🇬🇭
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'text.primary' }}>
                Ghana Lands Commission
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500 }}>
                NATIONAL LAND ERP SYSTEM
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
                {user?.full_name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: roleColor,
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500 }}>
                  {roleLabel}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ width: 44, height: 44, bgcolor: roleColor, fontWeight: 600 }}>
                {user?.full_name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { mt: 1, minWidth: 200 }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.full_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleUserMenuClose(); navigate('/settings'); }}>
              Settings
            </MenuItem>
            <MenuItem onClick={() => { handleUserMenuClose(); navigate('/help'); }}>
              Help & FAQ
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Navigation Tabs Bar - Minimal Scandinavian */}
      <Box sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Tabs
          value={getNavigationTabs().findIndex(tab => tab.path === location.pathname)}
          variant="fullWidth"
          textColor="inherit"
          TabIndicatorProps={{
            style: { backgroundColor: '#006B3F', height: 3 }
          }}
          sx={{
            minHeight: 48,
            maxWidth: 'lg',
            mx: 'auto',
            px: 2,
            '& .MuiTab-root': {
              minHeight: 48,
              minWidth: 0,
              flex: 1,
              px: 1,
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.8125rem',
              transition: 'all 0.2s',
              '&:hover': {
                color: '#006B3F',
                backgroundColor: 'rgba(0,107,63,0.04)'
              },
              '&.Mui-selected': {
                color: '#006B3F',
              }
            }
          }}
        >
          {getNavigationTabs().map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon ? <Home sx={{ fontSize: '1.1rem' }} /> : undefined}
              iconPosition="start"
              label={tab.icon ? undefined : tab.label}
              onClick={() => handleTabClick(tab)}
            />
          ))}
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        {children}
      </Box>

      {/* ChatBOT Widget */}
      {!chatOpen && (
        <IconButton
          onClick={() => setChatOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            bgcolor: '#006B3F',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,107,63,0.3)',
            '&:hover': {
              bgcolor: '#008751',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s',
            zIndex: 1000
          }}
        >
          <Chat />
        </IconButton>
      )}

      {/* ChatBOT Dialog */}
      {chatOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 380,
            height: 520,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              bgcolor: '#006B3F',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chat />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  LC Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  AI-Powered Land Registry Help
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setChatOpen(false)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Language Selector */}
          <Box sx={{ px: 2, py: 1, bgcolor: '#F5F5F5', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
              Language:
            </Typography>
            {['English', 'Twi', 'Ga', 'Ewe'].map((lang) => (
              <Button
                key={lang}
                size="small"
                variant={lang === 'English' ? 'contained' : 'text'}
                sx={{
                  mr: 0.5,
                  minWidth: 'auto',
                  fontSize: '0.7rem',
                  px: 1,
                  py: 0.3,
                  ...(lang === 'English' && {
                    bgcolor: '#006B3F',
                    '&:hover': { bgcolor: '#008751' }
                  })
                }}
              >
                {lang}
              </Button>
            ))}
          </Box>

          {/* Chat Messages */}
          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#FAFAFA' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2, textAlign: 'center' }}>
              Try these sample questions:
            </Typography>
            {sampleChats.map((chat, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                {/* User Message */}
                <Box
                  sx={{
                    bgcolor: '#E3F2FD',
                    p: 1.5,
                    borderRadius: 2,
                    mb: 1,
                    maxWidth: '85%',
                    ml: 'auto',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    {chat.user}
                  </Typography>
                </Box>
                {/* Bot Response */}
                <Box
                  sx={{
                    bgcolor: 'white',
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '85%',
                    border: '1px solid rgba(0,107,63,0.1)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', whiteSpace: 'pre-line', color: 'text.primary' }}>
                    {chat.bot}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Chat Input */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'white',
              borderTop: '1px solid rgba(0,0,0,0.08)',
              display: 'flex',
              gap: 1
            }}
          >
            <Box
              component="input"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your question... (Demo only)"
              sx={{
                flexGrow: 1,
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 1,
                px: 1.5,
                py: 1,
                fontSize: '0.875rem',
                outline: 'none',
                '&:focus': {
                  borderColor: '#006B3F'
                }
              }}
            />
            <IconButton
              sx={{
                bgcolor: '#006B3F',
                color: 'white',
                '&:hover': { bgcolor: '#008751' }
              }}
              onClick={() => {
                alert('ChatBOT Demo: In production, this would send: "' + chatMessage + '" to the AI assistant');
                setChatMessage('');
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Footer - Minimal Scandinavian */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                © 2025 Lands Commission of Ghana
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Powered by Blockchain Technology • Version 1.0.0
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#CE1126' }} />
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FCD116' }} />
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#006B3F' }} />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
