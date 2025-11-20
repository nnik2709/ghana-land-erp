import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings,
  Help,
  Notifications,
  Person,
  ExpandLess,
  ExpandMore,
  Home,
  Receipt,
  Search
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

// Navigation structure with grouped menus
const getNavigationConfig = (role) => {
  const citizenNav = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Home fontSize="small" />,
      path: '/citizen',
    },
    {
      id: 'search',
      label: 'Land Search',
      icon: <Search fontSize="small" />,
      path: '/land-search',
    },
    {
      id: 'properties',
      label: 'Properties',
      children: [
        { label: 'My Properties', path: '/my-properties' },
        { label: 'Land Titles', path: '/titles' },
        { label: 'Parcels', path: '/parcels' },
      ],
    },
    {
      id: 'payments',
      label: 'Payments & Billing',
      children: [
        { label: 'Pay Online', path: '/pay-online' },
        { label: 'Billing History', path: '/billing-history' },
        { label: 'Payment Assistance', path: '/payment-assistance' },
      ],
    },
    {
      id: 'services',
      label: 'Services',
      children: [
        { label: 'Applications', path: '/applications' },
        { label: 'Documents', path: '/documents' },
        { label: 'Mortgages', path: '/mortgages' },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      path: '/my-account',
    },
  ];

  const surveyorNav = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Home fontSize="small" />,
      path: '/surveyor',
    },
    {
      id: 'surveys',
      label: 'Surveys',
      children: [
        { label: 'Submit Survey', path: '/submit-survey' },
        { label: 'My Surveys', path: '/my-surveys' },
      ],
    },
    {
      id: 'spatial',
      label: 'Spatial Data',
      children: [
        { label: 'Parcels', path: '/parcels' },
        { label: 'Spatial Dashboard', path: '/spatial' },
        { label: 'GIS Platform', path: '/gis-demo' },
      ],
    },
    {
      id: 'admin',
      label: 'Administration',
      children: [
        { label: 'Documents', path: '/documents' },
        { label: 'Payments', path: '/payments' },
        { label: 'Audit Log', path: '/audit' },
      ],
    },
  ];

  const officerNav = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Home fontSize="small" />,
      path: '/officer',
    },
    {
      id: 'processing',
      label: 'Processing',
      children: [
        { label: 'Applications', path: '/applications' },
        { label: 'Titles', path: '/titles' },
        { label: 'Parcels', path: '/parcels' },
      ],
    },
    {
      id: 'transactions',
      label: 'Transactions',
      children: [
        { label: 'Title Transfer', path: '/title-transfer' },
        { label: 'Subdivision', path: '/subdivision' },
        { label: 'Leases', path: '/leases' },
        { label: 'Stamp Duty Calculator', path: '/stamp-duty-calculator' },
      ],
    },
    {
      id: 'special',
      label: 'Special Cases',
      children: [
        { label: 'Disputes', path: '/disputes' },
        { label: 'Customary Land', path: '/customary-land' },
        { label: 'Succession', path: '/succession' },
      ],
    },
    {
      id: 'ffp',
      label: 'Fit-for-Purpose',
      children: [
        { label: 'Tiered Registration', path: '/tiered-registration' },
        { label: 'Community Mapping', path: '/community-mapping' },
        { label: 'Para-Surveyors', path: '/para-surveyors' },
        { label: 'Women\'s Rights', path: '/women-inclusion' },
      ],
    },
    {
      id: 'valuation',
      label: 'Valuation',
      children: [
        { label: 'Property Valuation', path: '/valuation' },
        { label: 'Payments', path: '/payments' },
        { label: 'Analytics', path: '/analytics' },
      ],
    },
  ];

  const adminNav = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Home fontSize="small" />,
      path: '/admin',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      children: [
        { label: 'Dashboard', path: '/analytics' },
        { label: 'Revenue Reports', path: '/revenue-reporting' },
      ],
    },
    {
      id: 'registry',
      label: 'Land Registry',
      children: [
        { label: 'Parcels', path: '/parcels' },
        { label: 'Titles', path: '/titles' },
        { label: 'Applications', path: '/applications' },
      ],
    },
    {
      id: 'financial',
      label: 'Financial',
      children: [
        { label: 'Payments', path: '/payments' },
        { label: 'Valuation', path: '/valuation' },
        { label: 'Mortgages', path: '/mortgages' },
        { label: 'Stamp Duty Calculator', path: '/stamp-duty-calculator' },
      ],
    },
    {
      id: 'operations',
      label: 'Operations',
      children: [
        { label: 'Disputes', path: '/disputes' },
        { label: 'Leases', path: '/leases' },
        { label: 'Notifications', path: '/notifications' },
      ],
    },
    {
      id: 'ffp',
      label: 'Fit-for-Purpose',
      children: [
        { label: 'Tiered Registration', path: '/tiered-registration' },
        { label: 'Community Mapping', path: '/community-mapping' },
        { label: 'Para-Surveyors', path: '/para-surveyors' },
        { label: 'Women\'s Rights', path: '/women-inclusion' },
      ],
    },
    {
      id: 'system',
      label: 'System',
      children: [
        { label: 'Blockchain', path: '/blockchain' },
        { label: 'Integrations', path: '/integrations' },
        { label: 'Audit Log', path: '/audit' },
        { label: 'Surveyor Accreditation', path: '/surveyor-accreditation' },
      ],
    },
  ];

  switch (role) {
    case 'citizen': return citizenNav;
    case 'surveyor': return surveyorNav;
    case 'lands_officer': return officerNav;
    case 'admin': return adminNav;
    default: return [];
  }
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const navigationConfig = getNavigationConfig(user?.role);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleExpandClick = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

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

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const isActiveGroup = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  // Sidebar content
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: '#0D9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            LC
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Lands Commission
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6875rem' }}>
              Ghana
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List sx={{ px: 1 }}>
          {navigationConfig.map((item) => (
            <React.Fragment key={item.id}>
              {item.children ? (
                <>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleExpandClick(item.id)}
                      sx={{
                        borderRadius: 1.5,
                        py: 1,
                        px: 1.5,
                        minHeight: 40,
                        bgcolor: isActiveGroup(item.children) ? 'rgba(13, 148, 136, 0.08)' : 'transparent',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.8125rem',
                          fontWeight: isActiveGroup(item.children) ? 600 : 500,
                          color: isActiveGroup(item.children) ? '#0D9488' : 'text.primary',
                        }}
                      />
                      {expandedItems[item.id] || isActiveGroup(item.children) ? (
                        <ExpandLess sx={{ fontSize: 18, color: 'text.secondary' }} />
                      ) : (
                        <ExpandMore sx={{ fontSize: 18, color: 'text.secondary' }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={expandedItems[item.id] || isActiveGroup(item.children)} timeout="auto">
                    <List disablePadding sx={{ pl: 2 }}>
                      {item.children.map((child) => (
                        <ListItem key={child.path} disablePadding sx={{ mb: 0.25 }}>
                          <ListItemButton
                            onClick={() => handleNavClick(child.path)}
                            sx={{
                              borderRadius: 1.5,
                              py: 0.75,
                              px: 1.5,
                              minHeight: 36,
                              bgcolor: isActivePath(child.path) ? 'rgba(13, 148, 136, 0.08)' : 'transparent',
                              '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                              },
                            }}
                          >
                            <ListItemText
                              primary={child.label}
                              primaryTypographyProps={{
                                fontSize: '0.8125rem',
                                fontWeight: isActivePath(child.path) ? 600 : 400,
                                color: isActivePath(child.path) ? '#0D9488' : 'text.secondary',
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleNavClick(item.path)}
                    sx={{
                      borderRadius: 1.5,
                      py: 1,
                      px: 1.5,
                      minHeight: 40,
                      bgcolor: isActivePath(item.path) ? 'rgba(13, 148, 136, 0.08)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    {item.icon && (
                      <ListItemIcon sx={{
                        minWidth: 32,
                        color: isActivePath(item.path) ? '#0D9488' : 'text.secondary'
                      }}>
                        {item.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.8125rem',
                        fontWeight: isActivePath(item.path) ? 600 : 500,
                        color: isActivePath(item.path) ? '#0D9488' : 'text.primary',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Bottom section */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 1 }}>
        <List sx={{ px: 0 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavClick('/help')}
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: 1.5,
                minHeight: 40,
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                <Help fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Help & Support"
                primaryTypographyProps={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavClick('/settings')}
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: 1.5,
                minHeight: 40,
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              bgcolor: 'background.paper',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main content area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <AppBar
          position="sticky"
          color="default"
          elevation={0}
          sx={{ bgcolor: 'background.paper' }}
        >
          <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 } }}>
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Search */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                bgcolor: '#F1F5F9',
                borderRadius: 1.5,
                px: 1.5,
                py: 0.75,
                flex: 1,
                maxWidth: 400,
              }}
            >
              <Search sx={{ fontSize: 18, color: 'text.disabled', mr: 1 }} />
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                Search...
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  ml: 'auto',
                  bgcolor: 'white',
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.5,
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                }}
              >
                /
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <Badge badgeContent={3} color="error" variant="dot">
                    <Notifications fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User menu */}
              <Box
                onClick={handleUserMenuOpen}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  ml: 1,
                  p: 0.5,
                  borderRadius: 1,
                  '&:hover': { bgcolor: '#F1F5F9' },
                }}
              >
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem', lineHeight: 1.2 }}>
                    {user?.full_name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6875rem' }}>
                    {roleLabels[user?.role] || 'User'}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: '#0D9488',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                  }}
                >
                  {user?.full_name?.charAt(0) || 'U'}
                </Avatar>
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
                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/my-account'); }}>
                  <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                  My Account
                </MenuItem>
                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/billing-history'); }}>
                  <ListItemIcon><Receipt fontSize="small" /></ListItemIcon>
                  Billing
                </MenuItem>
                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/settings'); }}>
                  <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            overflow: 'auto',
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              2025 Lands Commission of Ghana
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              v1.0.0
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
