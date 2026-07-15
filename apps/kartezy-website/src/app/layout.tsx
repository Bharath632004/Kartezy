import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CssBaseline as MuiCssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { Provider as AuthProvider } from '@/auth/context';
import Navigation from '@/client-components/layout/Navigation';
import Footer from '@/client-components/layout/Footer';
import { QueryClientProviderWrapper } from '@/lib/query';

const inter = Inter({ subsets: ['latin'] });

// Create a theme customizable for the Kartezy brand
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Kartezy blue
    },
    secondary: {
      main: '#dc004e', // Kartezy accent
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

export const metadata: Metadata = {
  title: 'Kartezy - Hyperlocal Quick Commerce',
  description: 'Shop from nearby local merchants for groceries, essentials, electronics, and more. Get everything delivered in minutes.',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
  openGraph: {
    title: 'Kartezy - Hyperlocal Quick Commerce',
    description: 'Shop from nearby local merchants for everything you need, delivered in minutes.',
    url: 'https://kartezy.com',
    images: [
      {
        url: 'https://kartezy.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kartezy - Quick Commerce Marketplace',
      },
    ],
    siteName: 'Kartezy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kartezy - Hyperlocal Quick Commerce',
    description: 'Shop from nearby merchants for everything you need, delivered in minutes.',
    images: ['https://kartezy.com/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider store={store}>
          <AuthProvider>
            <QueryClientProviderWrapper>
              <ThemeProvider theme={theme}>
                <CssBaseline>
                  <Navigation />
                  <main className="min-h-screen bg-background">{children}</main>
                  <Footer />
                </CssBaseline>
              </ThemeProvider>
            </QueryClientProviderWrapper>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}