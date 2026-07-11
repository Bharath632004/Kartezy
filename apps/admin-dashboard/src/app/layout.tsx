import './globals.css';
import type { Metadata } from 'next';
import { ReactNode, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Providers from './providers';
import { CssBaseline, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard for managing the platform',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');

  // Initialize theme mode from localStorage
  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | 'system' | null;
    if (storedMode) {
      setThemeMode(storedMode);
    }
  }, []);

  // Save theme mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Providers themeMode={themeMode}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
              <Header
                isMobile={isMobile}
                setMobileOpen={setMobileOpen}
                themeMode={themeMode}
                setThemeMode={setThemeMode}
              />
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                {!isMobile && (
                  <Box sx={{ width: 240, flexShrink: 0 }}>
                    <Sidebar />
                  </Box>
                )}
                <Drawer
                  variant="temporary"
                  open={isMobile && mobileOpen}
                  onClose={() => setMobileOpen(false)}
                  sx={{ width: 240 }}
                  ModalProps={{
                    keepMounted: true,
                  }}
                >
                  <Sidebar />
                </Drawer>
                <Box
                  sx={{
                    flexGrow: 1,
                    width: '100%',
                    overflowY: 'auto',
                    bgcolor: 'background.default',
                    pt: 4, // Adjust for header height
                  }}
                >
                  <main>{children}</main>
                </Box>
              </Box>
            </Box>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}