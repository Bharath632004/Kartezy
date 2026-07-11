import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define your color scheme
const lightPalette = {
  mode: 'light' as const,
  primary: {
    main: '#1976d2',
  },
  secondary: {
    main: '#dc004e',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};

const darkPalette = {
  mode: 'dark' as const,
  primary: {
    main: '#90caf9',
  },
  secondary: {
    main: '#f48fb1',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
};

export const theme = (mode: 'light' | 'dark') => {
  const palette = mode === 'light' ? lightPalette : darkPalette;
  return createTheme({
    palette,
    // You can customize other theme properties here
    shape: {
      borderRadius: 8,
    },
  } as ThemeOptions);
};
