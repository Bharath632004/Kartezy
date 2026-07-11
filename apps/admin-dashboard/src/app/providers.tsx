"use client";

import { useColorScheme } from '@mui/material';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/theme/theme';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();

  // Get the theme based on color scheme
  const muiTheme = theme(colorScheme === 'dark' ? 'dark' : 'light');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
