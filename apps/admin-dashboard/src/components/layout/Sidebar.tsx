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
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ArticleIcon from "@mui/icons-material/Article";
import BarChartIcon from "@mui/icons-material/BarChart";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import HistoryIcon from "@mui/icons-material/History";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ForumIcon from "@mui/icons-material/Forum";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SupportIcon from "@mui/icons-material/Support";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TimerIcon from "@mui/icons-material/Timer";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
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
  { name: "Operations", icon: <TrackChangesIcon />, href: "/dashboard/operations" },
  { name: "Support", icon: <SupportIcon />, href: "/dashboard/support" },
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

  const [marketingOpen, setMarketingOpen] = React.useState(
    pathname?.startsWith("/dashboard/marketing") ?? false
  );

  const handleLogout = () => { logout(); router.push("/login"); };
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const [operationsOpen, setOperationsOpen] = React.useState(
    pathname?.startsWith("/dashboard/operations") ?? false
  );
  const [supportOpen, setSupportOpen] = React.useState(
    pathname?.startsWith("/dashboard/support") ?? false
  );

  const marketingSubItems = [
    { name: "Overview", href: "/dashboard/marketing" },
    { name: "Customers", href: "/dashboard/marketing/customers" },
    { name: "Leads", href: "/dashboard/marketing/leads" },
    { name: "Campaigns", href: "/dashboard/marketing/campaigns" },
    { name: "Automation", href: "/dashboard/marketing/automation" },
    { name: "Segments", href: "/dashboard/marketing/segments" },
    { name: "Coupons", href: "/dashboard/marketing/coupons" },
    { name: "Rewards", href: "/dashboard/marketing/rewards" },
    { name: "Analytics", href: "/dashboard/marketing/analytics" },
  ];

  const operationsSubItems = [
    { name: "Dashboard", href: "/dashboard/operations", icon: <DashboardIcon fontSize="small" /> },
    { name: "City Operations", href: "/dashboard/operations/cities", icon: <LocationCityIcon fontSize="small" /> },
    { name: "Zone Management", href: "/dashboard/operations/zones", icon: <MapIcon fontSize="small" /> },
    { name: "Warehouse Operations", href: "/dashboard/operations/warehouses", icon: <WarehouseIcon fontSize="small" /> },
    { name: "Merchant Operations", href: "/dashboard/operations/merchants", icon: <StoreMallDirectoryIcon fontSize="small" /> },
    { name: "Inventory Operations", href: "/dashboard/operations/inventory", icon: <Inventory2Icon fontSize="small" /> },
    { name: "Delivery Operations", href: "/dashboard/operations/delivery", icon: <LocalShippingIcon fontSize="small" /> },
    { name: "Customer Operations", href: "/dashboard/operations/customers", icon: <PeopleIcon fontSize="small" /> },
    { name: "Support Operations", href: "/dashboard/operations/support", icon: <HeadsetMicIcon fontSize="small" /> },
    { name: "Escalation Management", href: "/dashboard/operations/escalations", icon: <WarningAmberIcon fontSize="small" /> },
    { name: "SLA Monitoring", href: "/dashboard/operations/sla", icon: <TimerIcon fontSize="small" /> },
    { name: "Incident Tracking", href: "/dashboard/operations/incidents", icon: <ReportProblemIcon fontSize="small" /> },
    { name: "Business Rules", href: "/dashboard/operations/rules", icon: <AccountTreeIcon fontSize="small" /> },
  ];

  const supportSubItems = [
    { name: "Dashboard", href: "/dashboard/support", icon: <DashboardIcon fontSize="small" /> },
    { name: "Ticketing", href: "/dashboard/support/ticketing", icon: <ConfirmationNumberIcon fontSize="small" /> },
    { name: "Customer Support", href: "/dashboard/support/customer", icon: <PeopleIcon fontSize="small" /> },
    { name: "Merchant Support", href: "/dashboard/support/merchant", icon: <StoreMallDirectoryIcon fontSize="small" /> },
    { name: "Delivery Support", href: "/dashboard/support/delivery", icon: <LocalShippingIcon fontSize="small" /> },
    { name: "Admin Support", href: "/dashboard/support/admin", icon: <SupportAgentIcon fontSize="small" /> },
    { name: "Live Chat", href: "/dashboard/support/live-chat", icon: <ForumIcon fontSize="small" /> },
    { name: "AI Chatbot", href: "/dashboard/support/ai-chatbot", icon: <SmartToyIcon fontSize="small" /> },
    { name: "Knowledge Base", href: "/dashboard/support/knowledge-base", icon: <MenuBookIcon fontSize="small" /> },
    { name: "Escalations", href: "/dashboard/support/escalations", icon: <WarningAmberIcon fontSize="small" /> },
    { name: "SLA", href: "/dashboard/support/sla", icon: <TimerIcon fontSize="small" /> },
    { name: "Email Support", href: "/dashboard/support/email", icon: <EmailIcon fontSize="small" /> },
    { name: "Call Center", href: "/dashboard/support/call-center", icon: <PhoneIcon fontSize="small" /> },
    { name: "Feedback & CSAT", href: "/dashboard/support/feedback", icon: <SentimentSatisfiedAltIcon fontSize="small" /> },
    { name: "NPS", href: "/dashboard/support/nps", icon: <TrendingUpIcon fontSize="small" /> },
    { name: "Analytics", href: "/dashboard/support/analytics", icon: <AnalyticsIcon fontSize="small" /> },
  ];

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
        {mainNavItems.map((item) => {
          if (item.href === "/dashboard/marketing") {
            return (
              <React.Fragment key={item.href}>
                <ListItemButton
                  onClick={() => setMarketingOpen(!marketingOpen)}
                  selected={isActive("/dashboard/marketing")}
                  sx={{ pl: 3, borderRadius: 1, mx: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} primaryTypographyProps={{ variant: "body2" }} />
                  {marketingOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={marketingOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {marketingSubItems.map((sub) => (
                      <ListItemButton
                        key={sub.href}
                        component={Link}
                        href={sub.href}
                        selected={pathname === sub.href}
                        sx={{ pl: 6, borderRadius: 1, mx: 1, mb: 0.3, "&.Mui-selected": { bgcolor: "action.selected" } }}
                      >
                        <ListItemText primary={sub.name} primaryTypographyProps={{ variant: "body2", fontSize: "0.8rem" }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }
          if (item.href === "/dashboard/operations") {
            return (
              <React.Fragment key={item.href}>
                <ListItemButton
                  onClick={() => setOperationsOpen(!operationsOpen)}
                  selected={isActive("/dashboard/operations")}
                  sx={{ pl: 3, borderRadius: 1, mx: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} primaryTypographyProps={{ variant: "body2" }} />
                  {operationsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={operationsOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {operationsSubItems.map((sub) => (
                      <ListItemButton
                        key={sub.href}
                        component={Link}
                        href={sub.href}
                        selected={pathname === sub.href}
                        sx={{ pl: 6, borderRadius: 1, mx: 1, mb: 0.3, "&.Mui-selected": { bgcolor: "action.selected" } }}
                      >
                        <ListItemIcon sx={{ minWidth: 24 }}>{sub.icon}</ListItemIcon>
                        <ListItemText primary={sub.name} primaryTypographyProps={{ variant: "body2", fontSize: "0.8rem" }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }
          if (item.href === "/dashboard/support") {
            return (
              <React.Fragment key={item.href}>
                <ListItemButton
                  onClick={() => setSupportOpen(!supportOpen)}
                  selected={isActive("/dashboard/support")}
                  sx={{ pl: 3, borderRadius: 1, mx: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} primaryTypographyProps={{ variant: "body2" }} />
                  {supportOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={supportOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {supportSubItems.map((sub) => (
                      <ListItemButton
                        key={sub.href}
                        component={Link}
                        href={sub.href}
                        selected={pathname === sub.href}
                        sx={{ pl: 6, borderRadius: 1, mx: 1, mb: 0.3, "&.Mui-selected": { bgcolor: "action.selected" } }}
                      >
                        <ListItemIcon sx={{ minWidth: 24 }}>{sub.icon}</ListItemIcon>
                        <ListItemText primary={sub.name} primaryTypographyProps={{ variant: "body2", fontSize: "0.8rem" }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }
          return renderNavItem(item);
        })}
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
