import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Drawer, AppBar, Toolbar, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CampaignIcon from '@mui/icons-material/Campaign';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Executive Dashboard', icon: DashboardIcon, href: '/dashboard/bi/executive-dashboard' },
  { label: 'KPI Dashboard', icon: TrendingUpIcon, href: '/dashboard/bi/kpi-dashboard' },
  { label: 'Board Reports', icon: AssessmentIcon, href: '/dashboard/bi/board-reports' },
  { label: 'Customer Analytics', icon: PeopleIcon, href: '/dashboard/bi/customer-analytics' },
  { label: 'Merchant Analytics', icon: StoreIcon, href: '/dashboard/bi/merchant-analytics' },
  { label: 'Delivery Analytics', icon: LocalShippingIcon, href: '/dashboard/bi/delivery-analytics' },
  { label: 'Product Analytics', icon: InventoryIcon, href: '/dashboard/bi/product-analytics' },
  { label: 'Inventory Analytics', icon: InventoryIcon, href: '/dashboard/bi/inventory-analytics' },
  { label: 'Marketing Analytics', icon: CampaignIcon, href: '/dashboard/bi/marketing-analytics' },
  { label: 'City & Heatmap', icon: LocationCityIcon, href: '/dashboard/bi/city-analytics' },
  { label: 'All Reports', icon: BarChartIcon, href: '/dashboard/bi/executive-dashboard' },
];

export default function BiLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = (
    <Box>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700}>BI Platform</Typography>
      </Box>
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton sx={{ borderRadius: 2, mb: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><item.icon fontSize="small" /></ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>{drawer}</Drawer>
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>{drawer}</Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>{children}</Box>
    </Box>
  );
}
