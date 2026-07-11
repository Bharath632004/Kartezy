import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useColorScheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/theme/theme';

// Create a query client
const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard for managing the platform',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const colorScheme = useColorScheme();

  // Get the theme based on color scheme
  const muiTheme = theme(colorScheme === 'dark' ? 'dark' : 'light');

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
