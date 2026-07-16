"use client";

import type { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Box, Toolbar } from '@mui/material';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: '260px', minHeight: '100vh' }}>
        <Toolbar /> {/* Spacer for AppBar */}
        {children}
      </Box>
    </Box>
  );
}
