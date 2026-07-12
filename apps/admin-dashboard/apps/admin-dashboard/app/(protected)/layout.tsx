import { CssBaseline, AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import Link from 'next/link';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" flexGrow={1}>
            Kartxyz Admin Dashboard
          </Typography>
          <Button color="inherit">
            <Avatar sx={{ mr: 1 }}>AD</Avatar>
            Profile
          </Button>
          <Button color="inherit" href="/login">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 4 }}>
        {children}
      </Box>
    </>
  );
}
