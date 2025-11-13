import { createTheme } from '@mui/material/styles';

// Professional Ghana Lands Commission Theme - Ghana Flag Colors
export const theme = createTheme({
  palette: {
    primary: {
      main: '#006B3F', // Ghana Flag Green
      light: '#008751',
      dark: '#004D2C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FCD116', // Ghana Flag Gold
      light: '#FFDE4D',
      dark: '#C9A200',
      contrastText: '#000000',
    },
    error: {
      main: '#CE1126', // Ghana Flag Red
      light: '#E63946',
      dark: '#A50E1F',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#006B3F', // Use Ghana Green for success
      light: '#008751',
      dark: '#004D2C',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FCD116', // Use Ghana Gold for warnings
      light: '#FFDE4D',
      dark: '#C9A200',
      contrastText: '#000000',
    },
    info: {
      main: '#006B3F', // Use Ghana Green for info
      light: '#008751',
      dark: '#004D2C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFBFC', // Very light neutral
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A', // Near black (from flag star)
      secondary: '#4A4A4A',
      disabled: '#9E9E9E',
    },
    divider: '#E5E5E5',
    // Custom Ghana-themed colors
    ghana: {
      red: '#CE1126',
      gold: '#FCD116',
      green: '#006B3F',
      black: '#000000',
      white: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.75,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.10)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(0,0,0,0.16)',
    '0px 24px 48px rgba(0,0,0,0.18)',
    '0px 28px 56px rgba(0,0,0,0.20)',
    ...Array(16).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          fontWeight: 600,
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #E8EAF0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            backgroundColor: '#F8F9FA',
            color: '#1A1A1A',
            borderBottom: '2px solid #E0E0E0',
          },
        },
      },
    },
  },
});

export default theme;
