import { createTheme } from '@mui/material/styles';

const glassMorphismBase = {
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  backgroundColor: 'rgba(26, 28, 41, 0.75)',
  border: '1px solid rgba(255, 255, 255, 0.125)',
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7b61ff',
      light: '#a48eff',
      dark: '#5a41d6',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00f2fe',
      contrastText: '#0d0f17',
    },
    background: {
      default: '#0d0f17',
      paper: '#1a1c29',
    },
    text: {
      primary: '#f8f8f8',
      secondary: '#b3b9cc',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "Avenir", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(90deg, #fff 0%, #a48eff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...glassMorphismBase,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          ...glassMorphismBase,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
        rounded: {
          borderRadius: 24,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(123, 97, 255, 0.4)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #7b61ff 0%, #4facfe 100%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.03)',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.06)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255,255,255,0.08)',
              boxShadow: '0 0 0 2px rgba(123, 97, 255, 0.2)',
            },
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255,255,255,0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7b61ff',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.03)',
        },
      },
    },
  },
});
