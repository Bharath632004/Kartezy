"use client";
import * as React from "react";
import { Box, Divider, List, ListItemIcon, ListItemText, Toolbar, Typography, Collapse, ListItemButton, Drawer, IconButton } from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CampaignIcon from "@mui/icons-material/Campaign";
import ArticleIcon from "@mui/icons-material/Article";
import BarChartIcon from "@mui/icons-material/BarChart";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import HistoryIcon from "@mui/icons-material/History";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const DRAWER_WIDTH = 260;

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

const mainNavItems: NavItem[] = [
  { name: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
  { name: "Customers", icon: <PeopleIcon />, href: "/dashboard/customers" },
  { name: "Merchants", icon: <StorefrontIcon />, href: "/dashboard/merchants" },
  { name: "Delivery", icon: <LocalShippingIcon />, href: "/dashboard/delivery" },
  { name: "Orders", icon: <ShoppingCartIcon />, href: "/dashboard/orders" },
  { name: "Products", icon: <InventoryIcon />, href: "/dashboard/products" },
  { name: "Finance", icon: <AttachMoneyIcon />, href: "/dashboard/finance" },
  { name: "Marketing", icon: <CampaignIcon />, href: "/dashboard/marketing" },
  { name: "CMS", icon: <ArticleIcon />, href: "/dashboard/cms" },
  { name: "Reports", icon: <BarChartIcon />, href: "/dashboard/reports" },
  { name: "Analytics", icon: <InsightsIcon />, href: "/dashboard/analytics" },
  { name: "Notifications", icon: <NotificationsOutlined />, href: "/dashboard/notifications" },
  { name: "Settings", icon: <SettingsIcon />, href: "/dashboard/settings" },
];

const bottomNavItems: NavItem[] = [
  { name: "Login History", icon: <HistoryIcon />, href: "/login-history" },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  variant?: "permanent" | "temporary";
}

export default function Sidebar({ mobileOpen = false, onMobileClose = () => {}, variant = "permanent" }: SidebarProps) {
  const { logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push("/login"); };
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const renderNavItem = (item: NavItem) => (
    <ListItemButton key={item.href} component={Link} href={item.href} selected={isActive(item.href)} sx={{ pl: 3, borderRadius: 1, mx: 1, mb: 0.5, "&.Mui-selected": { bgcolor: "action.selected" } }}>
      <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
      <ListItemText primary={item.name} primaryTypographyProps={{ variant: "body2" }} />
    </ListItemButton>
  );

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>Kartezy</Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: "auto", py: 1 }}>
        {mainNavItems.map((item) => renderNavItem(item))}
      </Box>
      <Divider />
      <List sx={{ py: 1 }}>
        {bottomNavItems.map((item) => renderNavItem(item))}
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1, mx: 1 }}>
          <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ variant: "body2" }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Drawer variant={variant} open={variant === "temporary" ? mobileOpen : undefined} onClose={variant === "temporary" ? onMobileClose : undefined} ModalProps={{ keepMounted: true }} sx={{ width: DRAWER_WIDTH, flexShrink: 0, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}>
      {drawerContent}
    </Drawer>
  );
}
