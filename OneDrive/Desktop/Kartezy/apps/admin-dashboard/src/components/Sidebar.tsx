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
  useTheme,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

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
      { name: 'CRM', href: '/dashboard/crm' },
      { name: 'Operations', href: '/dashboard/ops' },
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
          <ListItem disablePadding key={item.name}>
            <Link href={item.href} passHref legacyBehavior>
              <ListItemButton
                selected={pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href + '/'))}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  width: '100%',
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  },
                  '&.Mui-selected': {
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(25,118,210,0.12)',
                    color: isDarkMode ? 'primary.light' : 'primary.main',
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