import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider as MuiThemeProvider, CssBaseline, useTheme, createTheme } from '@mui/material';
import { ThemeProvider as EmotionProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { queryClient } from '@/src/queryClient';
import { getTheme } from '@/src/theme/theme';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kartezy Admin Dashboard',
  description: 'Enterprise admin dashboard for Kartezy platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme: nextTheme, setTheme } = useNextTheme();
  const prefersDark = useNextTheme().systemPreference === 'dark';
  const currentTheme = nextTheme === 'dark' || (nextTheme === 'system' && prefersDark) ? 'dark' : 'light';
  const [muiTheme, setMuiTheme] = useState(() => getTheme(currentTheme));

  useEffect(() => {
    setMounted(true);
    const handleChange = () => {
      const newTheme = nextTheme === 'dark' || (nextTheme === 'system' && prefersDark) ? 'dark' : 'light';
      setTheme(newTheme);
      setMuiTheme(getTheme(newTheme));
    };

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleChange);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleChange);
    };
  }, [nextTheme, prefersDark, setTheme]);

  if (!mounted) {
    return null; // Prevent flash of unstyled content
  }

  return (
    <html lang="en" className={inter.className}>
      <body>
        <EmotionProvider>
          <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </MuiThemeProvider>
        </EmotionProvider>
      </body>
    </html>
  );
}
