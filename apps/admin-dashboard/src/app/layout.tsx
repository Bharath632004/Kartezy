"use client";

import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Providers from '@/app/providers';
import { CssBaseline } from '@mui/material';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ErrorBoundary from '@/components/ErrorBoundary';

// Note: metadata export is not supported in 'use client' components
// Metadata should be set via next/link or layout.tsx files in app router

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Providers>
            <CssBaseline />
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-background pt-16">
                  {children}
                </main>
              </div>
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
