"use client";
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
  Collapse,
  ListItemButton,
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ShieldIcon from '@mui/icons-material/Shield';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockOutlined from '@mui/icons-material/LockOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import WidgetsIcon from '@mui/icons-material/Widgets';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import StoreIcon from '@mui/icons-material/Store';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MailIcon from '@mui/icons-material/Mail';
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalcIcon from '@mui/icons-material/Calculate';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function Sidebar() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [openState, setOpenState] = React.useState({
    finance: false,
    marketing: false,
    cms: false,
    reports: false,
    support: false,
  });

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

  // Handler for toggle expand/collapse
  const handleToggle = (section: keyof typeof openState) => {
    setOpenState((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Box sx={{ width: '100%', flexShrink: 0 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin
        </Typography>
      </Toolbar>
      <Divider />

      {/* Main Navigation Items */}
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={item.name} onClick={() => router.push(item.href)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* New Collapsible Sections */}
      <List>
        {/* Finance */}
        <ListItemButton
          onClick={() => handleToggle('finance')}
          sx={{
            ...(openState.finance && { bgcolor: 'action.hover' }),
          }}
        >
          <ListItemIcon>
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Finance" />
          {openState.finance ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItemButton>
        {openState.finance && (
          <Collapse in={true} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/finance/revenue')}>
                <ListItemIcon>💰</ListItemIcon>
                <ListItemText primary="Revenue" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/finance/commission')}>
                <ListItemIcon>💸</ListItemIcon>
                <ListItemText primary="Commission" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/finance/settlements')}>
                <ListItemIcon>🏦</ListItemIcon>
                <ListItemText primary="Settlements" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/finance/wallet')}>
                <ListItemIcon>👛</ListItemIcon>
                <ListItemText primary="Wallet" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/finance/refunds')}>
                <ListItemIcon>↩️</ListItemIcon>
                <ListItemText primary="Refunds" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/finance/taxes')}>
                <ListItemIcon>🧾</ListItemIcon>
                <ListItemText primary="Taxes" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/finance/gst-reports')}>
                <ListItemIcon>📊</ListItemIcon>
                <ListItemText primary="GST Reports" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/finance/payouts')}>
                <ListItemIcon>💳</ListItemIcon>
                <ListItemText primary="Payouts" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/finance/transactions')}>
                <ListItemIcon>🔄</ListItemIcon>
                <ListItemText primary="Transactions" />
              </ListItem>
            </List>
          </Collapse>
        )}

        {/* Marketing */}
        <ListItemButton
          onClick={() => handleToggle('marketing')}
          sx={{
            ...(openState.marketing && { bgcolor: 'action.hover' }),
          }}
        >
          <ListItemIcon>
            <LocalOfferIcon />
          </ListItemIcon>
          <ListItemText primary="Marketing" />
          {openState.marketing ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItemButton>
        {openState.marketing && (
          <Collapse in={true} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/marketing/coupons')}>
                <ListItemIcon>🏷️</ListItemIcon>
                <ListItemText primary="Coupons" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/marketing/campaigns')}>
                <ListItemIcon>📢</ListItemIcon>
                <ListItemText primary="Campaigns" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/marketing/push-notifications')}>
                <ListItemIcon>📱</ListItemIcon>
                <ListItemText primary="Push Notifications" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/marketing/email-campaigns')}>
                <ListItemIcon>📧</ListItemIcon>
                <ListItemText primary="Email Campaigns" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/marketing/sms-campaigns')}>
                <ListItemIcon>💬</ListItemIcon>
                <ListItemText primary="SMS Campaigns" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/marketing/referral-campaigns')}>
                <ListItemIcon>👥</ListItemIcon>
                <ListItemText primary="Referral Programs" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/marketing/loyalty-campaigns')}>
                <ListItemIcon>💎</ListItemIcon>
                <ListItemText primary="Loyalty Programs" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/marketing/sponsored-products')}>
                <ListItemIcon>⭐</ListItemIcon>
                <ListItemText primary="Sponsored Products" />
              </ListItem>
            </List>
          </Collapse>
        )}

        {/* CMS */}
        <ListItemButton
          onClick={() => handleToggle('cms')}
          sx={{
            ...(openState.cms && { bgcolor: 'action.hover' }),
          }}
        >
          <ListItemIcon>
            <StoreIcon />
          </ListItemIcon>
          <ListItemText primary="CMS" />
          {openState.cms ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItemButton>
        {openState.cms && (
          <Collapse in={true} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/cms/pages')}>
                <ListItemIcon>📄</ListItemIcon>
                <ListItemText primary="Pages" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/cms/blogs')}>
                <ListItemIcon>📝</ListItemIcon>
                <ListItemText primary="Blogs" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/cms/faq')}>
                <ListItemIcon>❓</ListItemIcon>
                <ListItemText primary="FAQ" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/cms/banners')}>
                <ListItemIcon>🖼️</ListItemIcon>
                <ListItemText primary="Banners" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/cms/terms')}>
                <ListItemIcon>📋</ListItemIcon>
                <ListItemText primary="Terms & Conditions" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/cms/privacy')}>
                <ListItemIcon>🔒</ListItemIcon>
                <ListItemText primary="Privacy Policy" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/cms/content-editor')}>
                <ListItemIcon>🖋️</ListItemIcon>
                <ListItemText primary="Content Editor" />
              </ListItem>
            </List>
          </Collapse>
        )}

        {/* Reports */}
        <ListItemButton
          onClick={() => handleToggle('reports')}
          sx={{
            ...(openState.reports && { bgcolor: 'action.hover' }),
          }}
        >
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
          {openState.reports ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItemButton>
        {openState.reports && (
          <Collapse in={true} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/reports/revenue')}>
                <ListItemIcon>💰</ListItemIcon>
                <ListItemText primary="Revenue Reports" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/reports/sales')}>
                <ListItemIcon>📈</ListItemIcon>
                <ListItemText primary="Sales Reports" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/reports/merchants')}>
                <ListItemIcon>🏪</ListItemIcon>
                <ListItemText primary="Merchant Reports" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/reports/customers')}>
                <ListItemIcon>👥</ListItemIcon>
                <ListItemText primary="Customer Reports" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/reports/delivery')}>
                <ListItemIcon>🚚</ListItemIcon>
                <ListItemText primary="Delivery Reports" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/reports/inventory')}>
                <ListItemIcon>📦</ListItemIcon>
                <ListItemText primary="Inventory Reports" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/reports/payments')}>
                <ListItemIcon>💳</ListItemIcon>
                <ListItemText primary="Payment Reports" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/reports/export')}>
                <ListItemIcon>📤</ListItemIcon>
                <ListItemText primary="Export Reports" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/reports/schedule')}>
                <ListItemIcon>⏰</ListItemIcon>
                <ListItemText primary="Schedule Reports" />
              </ListItem>
            </List>
          </Collapse>
        )}

        {/* Support */}
        <ListItemButton
          onClick={() => handleToggle('support')}
          sx={{
            ...(openState.support && { bgcolor: 'action.hover' }),
          }}
        >
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Support" />
          {openState.support ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )
        }
        </ListItemButton>
        {openState.support && (
          <Collapse in={true} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/support/tickets')}>
                <ListItemIcon>🎫</ListItemIcon>
                <ListItemText primary="Support Tickets" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/support/live-chat')}>
                <ListItemIcon>💬</ListItemIcon>
                <ListItemText primary="Live Chat" />
              </ListItem>
              <ListItem button sx={{ pl: 3 }} onClick={() => router.push('/support/knowledge-base')}>
                <ListItemIcon>📚</ListItemIcon>
                <ListItemText primary="Knowledge Base" />
              </ListItem>
            </List>
          </Collapse>
        )}
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