"use client";

import Link from 'next/link';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
  Drawer,
  Divider,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const isDarkMode = document.documentElement.classList.contains('dark');

  const items = useMemo(
    () => [
      { name: 'Overview', href: '/dashboard' },
      { name: 'Fleet', href: '/dashboard/fleet' },
      { name: 'Orders', href: '/dashboard/orders' },
      { name: 'Customers', href: '/dashboard/customers' },
      { name: 'Merchants', href: '/dashboard/merchants' },
      { name: 'Delivery', href: '/dashboard/delivery' },
      { name: 'Products', href: '/dashboard/products' },
      { name: 'Analytics', href: '/dashboard/analytics' },
      { name: 'Finance', href: '/dashboard/finance' },
      { name: 'Marketing', href: '/dashboard/marketing' },
      { name: 'CMS', href: '/dashboard/cms' },
      { name: 'Reports', href: '/dashboard/reports' },
      { name: 'Settings', href: '/dashboard/settings' },
    ],
    [pathname]
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: isDarkMode ? '#1a2027' : '#fff',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {items.map((item) => (
          <ListItem button key={item.name}>
            <Link
              href={item.href}
              replace
              passHref
              legacyBehavior
              style={{ textDecoration: 'none', width: '100%', inherit: true }}
            >
              <ListItemButton
                sx={{
                  bgcolor: pathname === item.href
                    ? isDarkMode
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.08)'
                    : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                  width: '100%',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                {item.name}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}