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
  Collapse,
  Typography as MuiTypography,
  IconButton,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function Sidebar() {
  const pathname = usePathname();

  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const handleClick = (item: string) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(item);
      const newList = [...prev];
      if (isOpen) {
        newList.splice(newList.indexOf(item), 1);
      } else {
        newList.push(item);
      }
      return newList;
    });
  };

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
          {/* Main items */}
          {[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Customers', href: '/customers' },
            { name: 'Merchants', href: '/merchants' },
            { name: 'Delivery', href: '/delivery' },
            { name: 'Orders', href: '/orders' },
            { name: 'Products', href: '/products' },
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

          {/* Finance */}
          <ListItem>
            <ListItemButton
              onClick={() => handleClick('finance')}
              sx={{
                color: 'inherit',
                textAlign: 'left',
                ...(pathname.startsWith('/dashboard/finance') && { backgroundColor: 'rgba(255,255,255,0.1)' }),
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography>Finance</Typography>
                {openItems.includes('finance') ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </Box>
            </ListItemButton>
            <Collapse in={openItems.includes('finance')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {[
                  { name: 'Revenue', href: '/dashboard/finance/revenue' },
                  { name: 'Commission', href: '/dashboard/finance/commission' },
                  { name: 'Settlements', href: '/dashboard/finance/settlements' },
                  { name: 'Wallet', href: '/dashboard/finance/wallet' },
                  { name: 'Refunds', href: '/dashboard/finance/refunds' },
                  { name: 'Taxes', href: '/dashboard/finance/taxes' },
                  { name: 'GST Reports', href: '/dashboard/finance/gst-reports' },
                  { name: 'Payouts', href: '/dashboard/finance/payouts' },
                  { name: 'Transactions', href: '/dashboard/finance/transactions' },
                ].map((subItem) => (
                  <ListItem key={subItem.name} sx={{ pl: 4 }}>
                    <ListItemButton
                      component="a"
                      href={subItem.href}
                      sx={{
                        color: 'inherit',
                        textAlign: 'left',
                        ...(pathname === subItem.href && { backgroundColor: 'rgba(255,255,255,0.15)' }),
                      }}
                    >
                      {subItem.name}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </ListItem>

          {/* Marketing */}
          <ListItem>
            <ListItemButton
              onClick={() => handleClick('marketing')}
              sx={{
                color: 'inherit',
                textAlign: 'left',
                ...(pathname.startsWith('/dashboard/marketing') && { backgroundColor: 'rgba(255,255,255,0.1)' }),
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography>Marketing</Typography>
                {openItems.includes('marketing') ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </Box>
            </ListItemButton>
            <Collapse in={openItems.includes('marketing')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {[
                  { name: 'Coupons', href: '/dashboard/marketing/coupons' },
                  { name: 'Campaigns', href: '/dashboard/marketing/campaigns' },
                  { name: 'Push Notifications', href: '/dashboard/marketing/push-notifications' },
                  { name: 'Email Campaigns', href: '/dashboard/marketing/email-campaigns' },
                  { name: 'SMS Campaigns', href: '/dashboard/marketing/sms-campaigns' },
                  { name: 'Referral Campaigns', href: '/dashboard/marketing/referral-campaigns' },
                  { name: 'Loyalty Campaigns', href: '/dashboard/marketing/loyalty-campaigns' },
                  { name: 'Sponsored Products', href: '/dashboard/marketing/sponsored-products' },
                ].map((subItem) => (
                  <ListItem key={subItem.name} sx={{ pl: 4 }}>
                    <ListItemButton
                      component="a"
                      href={subItem.href}
                      sx={{
                        color: 'inherit',
                        textAlign: 'left',
                        ...(pathname === subItem.href && { backgroundColor: 'rgba(255,255,255,0.15)' }),
                      }}
                    >
                      {subItem.name}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </ListItem>

          {/* CMS */}
          <ListItem>
            <ListItemButton
              onClick={() => handleClick('cms')}
              sx={{
                color: 'inherit',
                textAlign: 'left',
                ...(pathname.startsWith('/dashboard/cms') && { backgroundColor: 'rgba(255,255,255,0.1)' }),
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography>CMS</Typography>
                {openItems.includes('cms') ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </Box>
            </ListItemButton>
            <Collapse in={openItems.includes('cms')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {[
                  { name: 'Banners', href: '/dashboard/cms/banners' },
                  { name: 'Categories', href: '/dashboard/cms/categories' },
                  { name: 'Pages', href: '/dashboard/cms/pages' },
                  { name: 'FAQ', href: '/dashboard/cms/faq' },
                  { name: 'Blogs', href: '/dashboard/cms/blogs' },
                  { name: 'Terms', href: '/dashboard/cms/terms' },
                  { name: 'Privacy', href: '/dashboard/cms/privacy' },
                  { name: 'Content Editor', href: '/dashboard/cms/content-editor' },
                ].map((subItem) => (
                  <ListItem key={subItem.name} sx={{ pl: 4 }}>
                    <ListItemButton
                      component="a"
                      href={subItem.href}
                      sx={{
                        color: 'inherit',
                        textAlign: 'left',
                        ...(pathname === subItem.href && { backgroundColor: 'rgba(255,255,255,0.15)' }),
                      }}
                    >
                      {subItem.name}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </ListItem>

          {/* Reports */}
          <ListItem>
            <ListItemButton
              onClick={() => handleClick('reports')}
              sx={{
                color: 'inherit',
                textAlign: 'left',
                ...(pathname.startsWith('/dashboard/reports') && { backgroundColor: 'rgba(255,255,255,0.1)' }),
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography>Reports</Typography>
                {openItems.includes('reports') ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </Box>
            </ListItemButton>
            <Collapse in={openItems.includes('reports')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {[
                  { name: 'Revenue Reports', href: '/dashboard/reports/revenue' },
                  { name: 'Sales Reports', href: '/dashboard/reports/sales' },
                  { name: 'Merchant Reports', href: '/dashboard/reports/merchants' },
                  { name: 'Customer Reports', href: '/dashboard/reports/customers' },
                  { name: 'Delivery Reports', href: '/dashboard/reports/delivery' },
                  { name: 'Inventory Reports', href: '/dashboard/reports/inventory' },
                  { name: 'Payment Reports', href: '/dashboard/reports/payments' },
                ].map((subItem) => (
                  <ListItem key={subItem.name} sx={{ pl: 4 }}>
                    <ListItemButton
                      component="a"
                      href={subItem.href}
                      sx={{
                        color: 'inherit',
                        textAlign: 'left',
                        ...(pathname === subItem.href && { backgroundColor: 'rgba(255,255,255,0.15)' }),
                      }}
                    >
                      {subItem.name}
                    </ListItemButton>
                  </ListItem
                ))}
              </List>
            </Collapse>
          </ListItem>

          {/* Analytics */}
          <ListItem>
            <ListItemButton
              onClick={() => handleClick('analytics')}
              sx={{
                color: 'inherit',
                textAlign: 'left',
                ...(pathname.startsWith('/dashboard/analytics') && { backgroundColor: 'rgba(255,255,255,0.1)' }),
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography>Analytics</Typography>
                {openItems.includes('analytics') ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </Box>
            </ListItemButton>
            <Collapse in={openItems.includes('analytics')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {[
                  { name: 'KPI Dashboard', href: '/dashboard/analytics/kpi' },
                  { name: 'Heat Maps', href: '/dashboard/analytics/heatmaps' },
                  { name: 'Retention', href: '/dashboard/analytics/retention' },
                  { name: 'Cohort Analysis', href: '/dashboard/analytics/cohort' },
                  { name: 'Funnel Analysis', href: '/dashboard/analytics/funnel' },
                  { name: 'Growth Metrics', href: '/dashboard/analytics/growth' },
                ].map((subItem) => (
                  <ListItem key={subItem.name} sx={{ pl: 4 }}>
                    <ListItemButton
                      component="a"
                      href={subItem.href}
                      sx={{
                        color: 'inherit',
                        textAlign: 'left',
                        ...(pathname === subItem.href && { backgroundColor: 'rgba(255,255,255,0.15)' }),
                      }}
                    >
                      {subItem.name}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </ListItem>

          {/* Existing items that were at the bottom */}
          {[
            { name: 'Analytics', href: '/analytics' }, // Note: This is the top-level analytics, we might want to remove or adjust
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
