"use client";

import { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme/theme';
import { useColorScheme } from '@mui/material';
import { Global, css } from '@emotion/react';

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

  const themeMode = theme(mode);

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <Global
        styles={css`
          html {
            height: 100%;
          }
          body {
            height: 100%;
            background-color: ${themeMode.palette.background.default};
            color: ${themeMode.palette.text.primary};
            transition: background-color ${themeMode.transitions.duration.short}ms
                ${themeMode.transitions.easing.easeInOut},
              color ${themeMode.transitions.duration.short}ms
                ${themeMode.transitions.easing.easeInOut};
          }
          #__next {
            min-height: 100vh;
            transition: background-color ${themeMode.transitions.duration.short}ms
                ${themeMode.transitions.easing.easeInOut},
              color ${themeMode.transitions.duration.short}ms
                ${themeMode.transitions.easing.easeInOut};
          }
        `}
      />
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}