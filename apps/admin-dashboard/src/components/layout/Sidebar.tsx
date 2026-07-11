import * as React from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DashboardIcon,
  PeopleIcon,
  LocalShippingIcon,
  AttachMoneyIcon,
  AccountBalanceWalletIcon,
  ShowChartIcon,
  ShieldIcon,
  SettingsIcon,
  HistoryIcon,
  LogoutIcon,
  NotificationsOutlined,
  AccessTimeIcon,
  LockOutlined,
} from '@mui/icons-material';

export default function Sidebar() {
  const { user } = useAuthStore();
  const router = useRouter();

  const getMenuItems = () => {
    const common = [
      { name: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
      { name: 'Users', icon: <PeopleIcon />, href: '/users' },
      { name: 'Merchants', icon: <LocalShippingIcon />, href: '/merchants' },
      { name: 'Drivers', icon: <LocalShippingIcon />, href: '/drivers' },
      { name: 'Orders', icon: <AttachMoneyIcon />, href: '/orders' },
      { name: 'Wallet', icon: <AccountBalanceWalletIcon />, href: '/wallet' },
      { name: 'Analytics', icon: <ShowChartIcon />, href: '/analytics' },
      { name: 'Notifications', icon: <NotificationsOutlined />, href: '/notifications' },
      { name: 'Login History', icon: <AccessTimeIcon />, href: '/login-history' },
      { name: 'MFA', icon: <LockOutlined />, href: '/mfa' },
    ];

    const admin = [
      { name: 'Settings', icon: <SettingsIcon />, href: '/settings' },
    ];

    const superAdmin = [
      { name: 'Roles & Permissions', icon: <ShieldIcon />, href: '/roles' },
      { name: 'System Logs', icon: <HistoryIcon />, href: '/logs' },
    ];

    if (!user) return [];
    if (user.role === 'super_admin') return [...common, ...admin, ...superAdmin];
    if (user.role === 'admin') return [...common, ...admin];
    // For other roles, return common (they might have limited access)
    return common;
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    const { logout } = useAuthStore.getState();
    logout();
    router.push('/login');
  };

  return (
    <Box sx={{ width: 240 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={item.name}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem button onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </Box>
  );
}