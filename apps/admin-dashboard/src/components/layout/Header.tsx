"use client";

import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  MenuItem,
  Tooltip,
  Stack,
  Avatar,
  Badge,
  Menu,
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Notifications as NotificationsOutlined,
  AccountCircle,
  Menu as MenuIcon,
  Brightness6,
  Brightness7,
} from '@mui/icons-material';

interface HeaderProps {
  isMobile: boolean;
  setMobileOpen: (open: boolean) => void;
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}

export default function Header({
  isMobile,
  setMobileOpen,
  themeMode,
  setThemeMode,
}: HeaderProps) {
  const { user, logout, logoutAllDevices } = useAuthStore();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleLogoutAllDevices = async () => {
    try {
      await logoutAllDevices();
      // The logoutAllDevices method in the store already redirects to login
    } catch (error) {
      console.error('Failed to log out from all devices', error);
    }
  };

  const handleToggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" flexGrow={1}>
            Admin Dashboard
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="error">
                <IconButton size="large" aria-label="notifications">
                  <NotificationsOutlined />
                </IconButton>
              </Badge>
            </Tooltip>
            <Tooltip title="Profile">
              <div onClick={handleClick}>
                {user ? (
                  <>
                    <Avatar alt={user.name}>
                      {(user.name?.match(/\b\w/g) || []).join('').toUpperCase().slice(0, 2)}
                    </Avatar>
                    <IconButton aria-label="account of current user">
                      <AccountCircle />
                    </IconButton>
                  </>
                ) : (
                  <Button color="inherit" href="/login">
                    Sign in
                  </Button>
                )}
              </div>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={open}
              onClose={handleClose}
            >
              {user ? (
                <div>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  <MenuItem onClick={handleLogoutAllDevices}>Logout from all devices</MenuItem>
                </div>
              ) : null}
            </Menu>
            </Tooltip>
            <Tooltip title="Toggle theme">
              <IconButton
                aria-label="toggle theme"
                onClick={handleToggleTheme}
              >
                {themeMode === 'light' ? (
                  <Brightness7 /> // sun icon for light mode (click to go to dark)
                ) : themeMode === 'dark' ? (
                  <Brightness6 /> // moon icon for dark mode (click to go to system)
                ) : (
                  // system mode: show a sun/moon? We'll show a sun for now.
                  <Brightness7 />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}