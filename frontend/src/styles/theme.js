import { createTheme } from '@mui/material/styles';

// Palette màu mới cho project
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#42A5F5', // Xanh dương nhạt - màu chủ đạo
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#81C784', // Xanh lá nhạt - màu phụ
      light: '#A5D6A7',
      dark: '#66BB6A',
      contrastText: '#fff',
    },
    accent: {
      main: '#FFB74D', // Cam nhạt - CTA buttons
      light: '#FFCC80',
      dark: '#FFA726',
      contrastText: '#212121',
    },
    background: {
      default: '#F5F5F5', // Xám nhạt - nền chính
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121', // Xám đậm - text chính
      secondary: '#757575',
      disabled: '#BDBDBD',
    },
    divider: '#E0E0E0',
    error: {
      main: '#EF5350',
      light: '#E57373',
      dark: '#C62828',
    },
    warning: {
      main: '#FFB74D',
      light: '#FFCC80',
      dark: '#FFA726',
    },
    info: {
      main: '#42A5F5',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    success: {
      main: '#81C784',
      light: '#A5D6A7',
      dark: '#66BB6A',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      color: '#212121',
      fontWeight: 600,
    },
    h2: {
      color: '#212121',
      fontWeight: 600,
    },
    h3: {
      color: '#212121',
      fontWeight: 600,
    },
    h4: {
      color: '#212121',
      fontWeight: 600,
    },
    h5: {
      color: '#212121',
      fontWeight: 600,
    },
    h6: {
      color: '#212121',
      fontWeight: 600,
    },
    body1: {
      color: '#212121',
    },
    body2: {
      color: '#757575',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: '#42A5F5',
          '&:hover': {
            backgroundColor: '#1976D2',
          },
        },
        containedSecondary: {
          backgroundColor: '#81C784',
          '&:hover': {
            backgroundColor: '#66BB6A',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E0E0E0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused fieldset': {
              borderColor: '#42A5F5',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;

