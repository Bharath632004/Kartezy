"use client";

import { useEffect } from 'react';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme/theme';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const mode = prefersDarkMode ? 'dark' : 'light';

  // Initialize auth state from localStorage and fetch user
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      const store = useAuthStore.getState();
      store.setAccessToken(accessToken);
      store.setRefreshToken(refreshToken);
      store.fetchUser().catch(() => {
        // Silently handle - redirect will happen on protected routes
      });
    }
  }, []);

  const themeMode = theme(mode);

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline enableColorScheme />
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}