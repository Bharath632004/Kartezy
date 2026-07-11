"use client";

import { useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useColorScheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient();

export default function Providers({
  children,
  themeMode: initialMode = 'system'
}: {
  children: React.ReactNode;
  themeMode?: 'light' | 'dark' | 'system';
}) {
  const colorScheme = useColorScheme();
  const mode =
    initialMode === 'system'
      ? (colorScheme === 'dark' ? 'dark' : 'light')
      : initialMode;

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  // Initialize auth state from localStorage and fetch user
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      const authStore = useAuthStore.getState();
      authStore.setAccessToken(accessToken);
      authStore.setRefreshToken(refreshToken);
      // Fetch user details
      authStore.fetchUser().catch((err) => {
        console.error('Failed to fetch user', err);
      });
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}