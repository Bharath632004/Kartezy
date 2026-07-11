import { Sidebar } from '@/components/Sidebar';
import type { ReactNode } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main style={{ marginLeft: 240, padding: '2rem' }}>
        {children}
      </main>
    </>
  );
}
