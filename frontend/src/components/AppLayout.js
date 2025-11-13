import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowBack,
  Home
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
  '/settings': 'Settings'
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
      { label: 'Parcels', path: '/parcels' },
      { label: 'Titles', path: '/titles' },
      { label: 'Applications', path: '/applications' },
      { label: 'Mortgages', path: '/mortgages' },
      { label: 'Documents', path: '/documents' },
      { label: 'Payments', path: '/payments' },
      { label: 'Blockchain', path: '/blockchain' },
    ];

    const surveyorTabs = [
      { label: 'Submit', path: '/submit-survey' },
      { label: 'Surveys', path: '/my-surveys' },
      { label: 'Parcels', path: '/parcels' },
      { label: 'Documents', path: '/documents' },
    ];

    const officerTabs = [
      { label: 'Applications', path: '/applications' },
      { label: 'Titles', path: '/titles' },
      { label: 'Mortgages', path: '/mortgages' },
      { label: 'Documents', path: '/documents' },
      { label: 'Parcels', path: '/parcels' },
      { label: 'Payments', path: '/payments' },
      { label: 'Audit', path: '/audit' },
    ];

    const adminTabs = [
      { label: 'Parcels', path: '/parcels' },
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

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate(getHomePath());
  };

  // Build breadcrumbs
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs = [
    <Link
      key="home"
      underline="hover"
      color="inherit"
      onClick={goHome}
      sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
    >
      <Home fontSize="small" />
      Dashboard
    </Link>
  ];

  if (location.pathname !== getHomePath()) {
    const currentPath = location.pathname;
    const pageName = routeNames[currentPath] || pathnames[pathnames.length - 1];
    breadcrumbs.push(
      <Typography key={currentPath} color="text.primary" sx={{ fontWeight: 500 }}>
        {pageName}
      </Typography>
    );
  }

  const roleColor = roleColors[user?.role] || '#006B3F';
  const roleLabel = roleLabels[user?.role] || 'User';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar position="sticky" sx={{ bgcolor: roleColor }}>
        <Toolbar>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 0 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                bgcolor: 'rgba(255,255,255,0.15)',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                border: '2px solid rgba(255,255,255,0.25)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              🇬🇭
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                Ghana Lands Commission
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                NATIONAL LAND ERP SYSTEM
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', mr: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {user?.full_name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '0.7rem', letterSpacing: '0.3px' }}>
                {roleLabel}
              </Typography>
            </Box>
            <IconButton onClick={handleUserMenuOpen} sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.3)' }}>
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

      {/* Navigation Tabs Bar */}
      <Box sx={{
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
      }}>
        <Container maxWidth="lg">
          <Tabs
            value={false}
            textColor="inherit"
            TabIndicatorProps={{
              style: { backgroundColor: '#FCD116' }
            }}
            sx={{
              minHeight: 48,
              '& .MuiTab-root': {
                minHeight: 48,
                color: '#006B3F',
                fontWeight: 500,
                '&:hover': {
                  color: '#CE1126',
                  backgroundColor: 'rgba(0,107,63,0.04)'
                }
              }
            }}
          >
            {getNavigationTabs().map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                onClick={() => handleTabClick(tab)}
                sx={{ fontSize: '0.875rem' }}
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Breadcrumb Navigation Bar */}
      <Box sx={{
        bgcolor: '#FFFFFF',
        borderBottom: '3px solid',
        borderImage: 'linear-gradient(90deg, #CE1126 0%, #FCD116 50%, #006B3F 100%) 1',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 1.2, display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs separator="›" sx={{ flexGrow: 1 }}>
              {breadcrumbs}
            </Breadcrumbs>

            {/* Back Button */}
            {location.pathname !== getHomePath() && (
              <Button
                size="small"
                startIcon={<ArrowBack />}
                onClick={goBack}
                variant="outlined"
                sx={{ minWidth: 'auto' }}
              >
                Back
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: '#1A1A1A',
          color: 'white',
          textAlign: 'center',
          borderTop: '4px solid',
          borderImage: 'linear-gradient(90deg, #CE1126 0%, #FCD116 50%, #006B3F 100%) 1',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
            © 2025 Lands Commission of Ghana. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Powered by Blockchain Technology | Version 1.0.0
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
