import './globals.css';
import type { Metadata } from 'next';
import Providers from '@/app/providers';

// Metadata is exported from server component
// Pages using layout will handle Header/Sidebar rendering

export const metadata: Metadata = {
  title: 'Kartezy Admin Dashboard',
  description: 'Enterprise administration panel for Kartezy hyperlocal quick commerce platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
