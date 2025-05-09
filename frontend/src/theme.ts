import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          background: {
            default: '#fff',
            paper: '#fff',
          },
          text: {
            primary: '#111',
            secondary: '#444',
          },
          primary: {
            main: '#111',
            contrastText: '#fff',
          },
          divider: '#E5E7EB',
        }
      : {
          background: {
            default: '#111',
            paper: '#18181b',
          },
          text: {
            primary: '#fff',
            secondary: '#d1d5db',
          },
          primary: {
            main: '#fff',
            contrastText: '#111',
          },
          divider: '#27272a',
        }),
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: mode === 'light' ? '1px solid #E5E7EB' : '1px solid #27272a',
          background: mode === 'light' ? '#fff' : '#18181b',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: mode === 'light' ? '1px solid #E5E7EB' : '1px solid #27272a',
          background: mode === 'light' ? '#fff' : '#18181b',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          variants: [],
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        },
      },
    },
  },
});

// Default: light mode
const theme = createTheme({
  ...getDesignTokens('light'),
  components: {
    ...getDesignTokens('light').components,
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none'
        }
      }
    }
  }
});

export default theme;
export { getDesignTokens };