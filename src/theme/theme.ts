import { createTheme, ThemeOptions } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Palette for Light Mode
          primary: {
            main: '#4f46e5', // Deep Indigo
            light: '#6366f1',
            dark: '#3730a3',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#06b6d4', // Teal/Cyan
            light: '#22d3ee',
            dark: '#0891b2',
            contrastText: '#ffffff',
          },
          background: {
            default: '#f8fafc', // Slate 50
            paper: '#ffffff',
          },
          text: {
            primary: '#0f172a', // Slate 900
            secondary: '#475569', // Slate 600
          },
        }
      : {
          // Palette for Premium Dark Mode
          primary: {
            main: '#818cf8', // Bright Indigo
            light: '#a5b4fc',
            dark: '#4f46e5',
            contrastText: '#0f172a',
          },
          secondary: {
            main: '#22d3ee', // Neon Cyan
            light: '#67e8f9',
            dark: '#06b6d4',
            contrastText: '#0f172a',
          },
          background: {
            default: '#0b0f19', // Deep dark cosmic blue
            paper: '#111827', // Dark gray/blue card
          },
          text: {
            primary: '#f3f4f6', // Light gray
            secondary: '#9ca3af', // Medium gray
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      borderRadius: '8px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
          boxShadow: mode === 'light' 
            ? '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)'
            : '0 4px 20px 0 rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          border: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #1f2937',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              : '0 10px 25px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#111827',
          color: mode === 'light' ? '#0f172a' : '#f3f4f6',
          boxShadow: 'none',
          borderBottom: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #1f2937',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
        },
      },
    },
  },
});

export const themeLight = createTheme(getDesignTokens('light'));
export const themeDark = createTheme(getDesignTokens('dark'));
