"use client";

import { usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: '#1976d2',
          color: '#fff',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap color="inherit">
          Admin
        </Typography>
      </Toolbar>
      <div>
        <List>
          {[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Customers', href: '/customers' },
            { name: 'Merchants', href: '/merchants' },
            { name: 'Delivery', href: '/delivery' },
            { name: 'Orders', href: '/orders' },
            { name: 'Products', href: '/products' },
            { name: 'Analytics', href: '/analytics' },
            { name: 'Notifications', href: '/notifications' },
            { name: 'Settings', href: '/settings' },
          ].map((item) => (
            <ListItem key={item.name}>
              <ListItemButton
                component="a"
                href={item.href}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  ...(pathname === item.href && { backgroundColor: 'rgba(255,255,255,0.1)' }),
                }}
              >
                {item.name}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
