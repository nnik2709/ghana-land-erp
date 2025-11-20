import { createTheme } from '@mui/material/styles';

// Enterprise Scandinavian Design System
// Minimalist, professional, and functional
// Inspired by: Linear, Vercel, Stripe, Notion

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0D9488', // Teal - modern, professional
      light: '#F0FDFA',
      dark: '#0F766E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#64748B', // Slate
      light: '#F1F5F9',
      dark: '#475569',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
      light: '#FEF2F2',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#059669',
      light: '#ECFDF5',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#D97706',
      light: '#FFFBEB',
      dark: '#B45309',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#0284C7',
      light: '#F0F9FF',
      dark: '#0369A1',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFAFA', // Almost white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A', // Almost black
      secondary: '#64748B', // Slate
      disabled: '#94A3B8',
    },
    divider: '#E2E8F0',
    // Brand accent
    accent: {
      green: '#0D9488',
      gold: '#F59E0B',
      red: '#DC2626',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
      color: '#0F172A',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
      color: '#0F172A',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: '#0F172A',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      color: '#0F172A',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#0F172A',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#0F172A',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      color: '#334155',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      color: '#64748B',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      color: '#334155',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      color: '#64748B',
    },
    button: {
      fontWeight: 500,
      fontSize: '0.8125rem',
      letterSpacing: '0',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#64748B',
      letterSpacing: '0.01em',
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#64748B',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    ...Array(18).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#CBD5E1 transparent',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 6,
            height: 6,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 3,
            backgroundColor: '#CBD5E1',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
          fontSize: '0.8125rem',
          fontWeight: 500,
          boxShadow: 'none',
          transition: 'all 0.15s ease',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0D9488',
          '&:hover': {
            backgroundColor: '#0F766E',
          },
        },
        outlined: {
          borderWidth: '1px',
          borderColor: '#E2E8F0',
          color: '#334155',
          '&:hover': {
            borderWidth: '1px',
            borderColor: '#CBD5E1',
            backgroundColor: '#F8FAFC',
          },
        },
        text: {
          color: '#64748B',
          '&:hover': {
            backgroundColor: '#F1F5F9',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '10px 20px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          border: '1px solid #E2E8F0',
          transition: 'border-color 0.15s ease',
          '&:hover': {
            borderColor: '#CBD5E1',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': {
            paddingBottom: 20,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 8,
        },
        outlined: {
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #E2E8F0',
        },
        colorDefault: {
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E2E8F0',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            fontSize: '0.8125rem',
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: '#CBD5E1',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '1px',
              borderColor: '#0D9488',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.8125rem',
            fontWeight: 500,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
          fontSize: '0.75rem',
          height: 24,
        },
        sizeSmall: {
          height: 20,
          fontSize: '0.6875rem',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 500,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backgroundColor: '#F8FAFC',
            color: '#64748B',
            borderBottom: '1px solid #E2E8F0',
            padding: '12px 16px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          fontSize: '0.8125rem',
          borderBottom: '1px solid #F1F5F9',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F8FAFC',
          },
          '&:last-child .MuiTableCell-root': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E2E8F0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.8125rem',
          minHeight: 40,
          padding: '8px 16px',
          color: '#64748B',
          '&.Mui-selected': {
            color: '#0F172A',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          borderRadius: 1,
          backgroundColor: '#0D9488',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 16px',
          fontSize: '0.8125rem',
        },
        standardSuccess: {
          backgroundColor: '#ECFDF5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
        standardError: {
          backgroundColor: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid #FECACA',
        },
        standardWarning: {
          backgroundColor: '#FFFBEB',
          color: '#92400E',
          border: '1px solid #FDE68A',
        },
        standardInfo: {
          backgroundColor: '#F0F9FF',
          color: '#075985',
          border: '1px solid #BAE6FD',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: 8,
          '&:hover': {
            backgroundColor: '#F1F5F9',
          },
        },
        sizeSmall: {
          padding: 6,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: '#F1F5F9',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 32,
          color: '#64748B',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.8125rem',
          fontWeight: 500,
        },
        secondary: {
          fontSize: '0.75rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 600,
          padding: '20px 24px 16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 20px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0F172A',
          fontSize: '0.75rem',
          padding: '6px 10px',
          borderRadius: 4,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          fontWeight: 500,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.6875rem',
          fontWeight: 600,
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.8125rem',
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
