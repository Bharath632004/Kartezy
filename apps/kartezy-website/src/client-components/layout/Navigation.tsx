import { AppBar, Toolbar, Typography, Button, Box, Stack, Link } from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search, 
  ShoppingCart, 
  Person 
} from '@mui/icons-material';
import Link from 'next/link';

export const Navigation = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} elevation={0}>
      <Toolbar sx={{ minHeight: 64, px: { xs: 3, md: 6 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {/* Logo */}
          <Link href="/" passHref>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mr: 2, flexShrink: 0 }}>
              Kartezy
            </Typography>
          </Link>
          
          {/* Desktop Menu - Hidden on mobile */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, ml: 4 }}>
            <Stack direction="row" spacing={4} alignItems="center">
              <Link href="/" passHref>
                <Button size="small" variant="text" color="text.primary" sx={{ fontWeight: 500 }}>
                  Home
                </Button>
              </Link>
              
              <Link href="/categories" passHref>
                <Button size="small" variant="text" color="text.primary" sx={{ fontWeight: 500 }}>
                  Categories
                </Button>
              </Link>
              
              <Link href="/offers" passHref>
                <Button size="small" variant="text" color="text.primary" sx={{ fontWeight: 500 }}>
                  Offers
                </Button>
              </Link>
              
              <Link href="/blog: Link href="/blog" passHref>
                <Button size="small" variant="text" color="text.primary" sx={{ fontWeight: 500 }}>
                  Blog
                </Button>
              </Link>
            </Stack>
          </Box>
          
          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 3 }}>
              <Link href="/cart" passHref>
                <Button size="small" variant="contained" color="secondary" sx={{ height: 40, px: 2, fontWeight: 500 }} startIcon={<ShoppingCart fontSize="inherit" }}>
                  Cart
                </Button>
              </Link>
            </Box>
            
            <Box>
              <Button size="small" variant="contained" color="primary" sx={{ height: 40, px: 2, fontWeight: 500 }} startIcon={<Person fontSize="inherit" }}>
                Account
              </Button>
            </Box>
          </Box>
        </Box>
        
        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 2 }}>
          <Button size="small" variant="contained" color="primary" sx={{ height: 40, px: 2 }} startIcon={<MenuIcon fontSize="inherit" }}>
            Menu
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
