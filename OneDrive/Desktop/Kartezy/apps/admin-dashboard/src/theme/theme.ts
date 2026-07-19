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
  const baseTheme = createTheme({
    palette,
  });
  return createTheme(baseTheme, {
    // You can customize other theme properties here
    shape: {
      borderRadius: 8,
    },
    transitions: {
      // Create a theme transition for common properties
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        // most basic recommended timing
        standard: 300,
        // this is to be used for complex animations
        complex: 375,
        // recommended timing for entering a screen
        enteringScreen: 225,
        // recommended timing for leaving a screen
        leavingScreen: 195,
      },
      easing: {
        // This is the most common easing curve.
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        // Enter -> exit
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        // Exit -> enter
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        // Sharp curve
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
  });
};