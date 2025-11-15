import { createTheme } from '@mui/material/styles';

// Clean Scandinavian Design Theme - Ghana Lands Commission
// Inspired by Nordic minimalism: Spotify, Klarna, IKEA design principles
export const theme = createTheme({
  palette: {
    primary: {
      main: '#006B3F', // Ghana Flag Green
      light: '#E8F5E9', // Very soft green background
      dark: '#004D2C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4A5568', // Neutral slate for secondary actions
      light: '#718096',
      dark: '#2D3748',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#E53E3E', // Soft red
      light: '#FED7D7',
      dark: '#C53030',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#006B3F', // Ghana Green
      light: '#E8F5E9',
      dark: '#004D2C',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#D69E2E', // Soft gold
      light: '#FEFCBF',
      dark: '#B7791F',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#3182CE', // Soft blue
      light: '#BEE3F8',
      dark: '#2C5282',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7FAFC', // Ultra-light gray (Scandinavian)
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748', // Soft black
      secondary: '#718096', // Gray
      disabled: '#CBD5E0',
    },
    divider: '#E2E8F0',
    // Ghana-themed accent colors
    ghana: {
      red: '#CE1126',
      gold: '#FCD116',
      green: '#006B3F',
      black: '#000000',
      white: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.03em',
      color: '#1A202C',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
      color: '#1A202C',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: '#2D3748',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#2D3748',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      color: '#2D3748',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: '#2D3748',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.75,
      color: '#4A5568',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      color: '#718096',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#2D3748',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#4A5568',
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
      color: '#718096',
    },
  },
  shape: {
    borderRadius: 12, // More rounded for Scandinavian feel
  },
  spacing: 8, // Base spacing unit
  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.05)', // Soft shadow
    '0px 2px 6px rgba(0,0,0,0.06)',
    '0px 4px 12px rgba(0,0,0,0.08)',
    '0px 8px 24px rgba(0,0,0,0.10)',
    '0px 12px 32px rgba(0,0,0,0.12)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#CBD5E0 #F7FAFC',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#CBD5E0',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            borderRadius: 8,
            backgroundColor: '#F7FAFC',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0,107,63,0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,107,63,0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #006B3F 0%, #008751 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #005530 0%, #006B3F 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(0,107,63,0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0,107,63,0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
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
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 6px rgba(0,0,0,0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
          borderBottom: '1px solid #E2E8F0',
        },
        colorPrimary: {
          backgroundColor: '#FFFFFF',
          color: '#2D3748',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#006B3F',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
                borderColor: '#006B3F',
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          fontSize: '0.8125rem',
        },
        filled: {
          border: 'none',
        },
        outlined: {
          borderWidth: '1.5px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backgroundColor: '#F7FAFC',
            color: '#4A5568',
            borderBottom: '2px solid #E2E8F0',
            padding: '16px 24px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderBottom: '1px solid #E2E8F0',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F7FAFC',
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
          fontWeight: 600,
          fontSize: '0.9375rem',
          minHeight: 48,
          padding: '12px 24px',
          '&.Mui-selected': {
            color: '#006B3F',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 16px',
        },
        standardSuccess: {
          backgroundColor: '#E8F5E9',
          color: '#004D2C',
          border: '1px solid #C8E6C9',
        },
        standardError: {
          backgroundColor: '#FED7D7',
          color: '#C53030',
          border: '1px solid #FEB2B2',
        },
        standardWarning: {
          backgroundColor: '#FEFCBF',
          color: '#B7791F',
          border: '1px solid #FAF089',
        },
        standardInfo: {
          backgroundColor: '#BEE3F8',
          color: '#2C5282',
          border: '1px solid #90CDF4',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(0,107,63,0.04)',
          },
        },
      },
    },
  },
});

export default theme;
