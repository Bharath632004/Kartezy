"use client";

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  LinearProgress,
  Stack,
  Paper,
  Avatar,
  AvatarGroup,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  RefreshOutlined,
  WarningAmberOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  Timeline,
  TrendingUp,
  TrendingDown,
  LocalShipping,
  Storefront,
  ShoppingCart,
  People,
  Speed,
  AccessTime,
  NotificationsActive,
  AssignmentLate,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';
import { useTheme } from '@mui/material/styles';

const metricCardSx = {
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 4,
  },
};

function StatCard({ title, value, icon, color, trend, subtitle }: {
  title: string; value: string | number; icon: React.ReactNode; color: string; trend?: { value: number; isUp: boolean }; subtitle?: string;
}) {
  return (
    <Card sx={metricCardSx}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color }}>{value}</Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                {trend.isUp ? <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} /> : <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />}
                <Typography variant="caption" color={trend.isUp ? 'success.main' : 'error.main'}>
                  {trend.value}% vs last hour
                </Typography>
              </Box>
            )}
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          </Box>
          <Avatar sx={{ bgcolor: `${color}15`, color, width: 48, height: 48 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

function AlertBarrier({ level, count, label, icon }: { level: 'error' | 'warning' | 'info'; count: number; label: string; icon: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <Alert severity={level} sx={{ mb: 1, '&:hover': { transform: 'translateX(4px)', transition: '0.2s' } }}>
      <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        {count} {label}
      </AlertTitle>
    </Alert>
  );
}

export default function OperationsDashboard() {
  const theme = useTheme();
  const { dashboard, dashboardLoading, dashboardError, fetchDashboard } = useOperationsStore();
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchDashboard();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchDashboard, 15000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [fetchDashboard, autoRefresh]);

  if (dashboardLoading && !dashboard) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (dashboardError) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" action={<IconButton onClick={fetchDashboard}><RefreshOutlined /></IconButton>}>
          <AlertTitle>Error Loading Dashboard</AlertTitle>
          {dashboardError}
        </Alert>
      </Container>
    );
  }

  const s = dashboard?.summary;

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Operations Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time operational overview &middot; Auto-refreshing every 15s
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<Timeline />}
            label={autoRefresh ? 'Live' : 'Paused'}
            color={autoRefresh ? 'success' : 'default'}
            size="small"
            onClick={() => setAutoRefresh(!autoRefresh)}
            sx={{ cursor: 'pointer' }}
          />
          <Tooltip title="Refresh now">
            <IconButton onClick={fetchDashboard}><RefreshOutlined /></IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Realtime Metrics Strip */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>{dashboard?.realtimeMetrics?.ordersPerMinute ?? 0}</Typography>
              <Typography variant="caption" color="text.secondary">Orders/min</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>{dashboard?.realtimeMetrics?.deliveriesPerMinute ?? 0}</Typography>
              <Typography variant="caption" color="text.secondary">Deliveries/min</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>₹{(dashboard?.realtimeMetrics?.revenuePerMinute ?? 0).toLocaleString()}</Typography>
              <Typography variant="caption" color="text.secondary">Revenue/min</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>{dashboard?.realtimeMetrics?.activeUsers ?? 0}</Typography>
              <Typography variant="caption" color="text.secondary">Active Users</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Orders"
            value={s?.totalActiveOrders ?? 0}
            icon={<ShoppingCart />}
            color={theme.palette.primary.main}
            trend={{ value: 12, isUp: true }}
            subtitle={`${s?.totalPendingOrders ?? 0} pending`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Delivered Today"
            value={s?.totalDeliveredToday ?? 0}
            icon={<CheckCircleOutlined />}
            color={theme.palette.success.main}
            trend={{ value: 8, isUp: true }}
            subtitle={`${s?.totalFailedDeliveries ?? 0} failed`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Drivers"
            value={s?.activeDrivers ?? 0}
            icon={<LocalShipping />}
            color={theme.palette.info.main}
            subtitle={`${s?.availableDrivers ?? 0} available`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Merchants"
            value={s?.activeMerchants ?? 0}
            icon={<Storefront />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Avg Delivery Time"
            value={`${s?.avgDeliveryTime ?? 0} min`}
            icon={<AccessTime />}
            color={theme.palette.error.main}
            trend={{ value: 5, isUp: false }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="SLA Compliance"
            value={`${(s?.SLAComplianceRate ?? 0).toFixed(1)}%`}
            icon={<Speed />}
            color={theme.palette.success.main}
            trend={{ value: 2, isUp: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Incidents"
            value={s?.activeIncidents ?? 0}
            icon={<ErrorOutlined />}
            color={s?.criticalIncidents && s.criticalIncidents > 0 ? theme.palette.error.main : theme.palette.warning.main}
            subtitle={`${s?.criticalIncidents ?? 0} critical`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Support Tickets"
            value={s?.totalSupportTickets ?? 0}
            icon={<People />}
            color={theme.palette.secondary.main}
            subtitle={`${s?.openSupportTickets ?? 0} open`}
          />
        </Grid>
      </Grid>

      {/* Alerts Section */}
      {(dashboard?.alertSummary?.critical ?? 0) > 0 || (dashboard?.alertSummary?.warning ?? 0) > 0 || (dashboard?.alertSummary?.pendingEscalations ?? 0) > 0 ? (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsActive color="warning" /> Active Alerts
          </Typography>
          <AlertBarrier level="error" count={dashboard?.alertSummary?.critical ?? 0} label="Critical Alerts Requiring Immediate Action" icon={<ErrorOutlined />} />
          <AlertBarrier level="warning" count={(dashboard?.alertSummary?.warning ?? 0) + (dashboard?.alertSummary?.pendingEscalations ?? 0)} label="Warnings & Escalations Need Review" icon={<WarningAmberOutlined />} />
          <AlertBarrier level="info" count={dashboard?.alertSummary?.info ?? 0} label="Informational Alerts" icon={<AssignmentLate />} />
        </Paper>
      ) : null}

      {/* City Performance */}
      <Typography variant="h6" sx={{ mb: 2 }}>City Performance</Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell align="right">Orders Today</TableCell>
              <TableCell align="right">Active Drivers</TableCell>
              <TableCell align="right">Avg Delivery Time</TableCell>
              <TableCell align="right">SLA Compliance</TableCell>
              <TableCell align="right">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboard?.cityPerformance?.map((city) => (
              <TableRow key={city.cityId} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell>{city.cityName}</TableCell>
                <TableCell align="right">{city.ordersToday}</TableCell>
                <TableCell align="right">{city.activeDrivers}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{city.avgDeliveryTime} min</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((city.avgDeliveryTime / 30) * 100, 100)}
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                      color={city.avgDeliveryTime < 20 ? 'success' : city.avgDeliveryTime < 30 ? 'warning' : 'error'}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${(city.SLACompliance * 100).toFixed(0)}%`}
                    color={city.SLACompliance >= 0.95 ? 'success' : city.SLACompliance >= 0.85 ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">₹{city.revenue.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {(!dashboard?.cityPerformance || dashboard.cityPerformance.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">No city performance data available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Zone Heatmap + Alert Summary */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Zone Demand Heatmap</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Zone</TableCell>
                  <TableCell>Demand Level</TableCell>
                  <TableCell align="right">Active Orders</TableCell>
                  <TableCell align="right">Available Drivers</TableCell>
                  <TableCell align="right">Avg Wait Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboard?.zoneHeatmap?.map((zone) => (
                  <TableRow key={zone.zoneId} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell>{zone.zoneName}</TableCell>
                    <TableCell>
                      <Chip
                        label={zone.demandLevel}
                        color={zone.demandLevel === 'HIGH' ? 'error' : zone.demandLevel === 'MEDIUM' ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{zone.activeOrders}</TableCell>
                    <TableCell align="right">{zone.availableDrivers}</TableCell>
                    <TableCell align="right">{zone.avgWaitTime} min</TableCell>
                  </TableRow>
                ))}
                {(!dashboard?.zoneHeatmap || dashboard.zoneHeatmap.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">No zone data available</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Alert Summary</Typography>
          <Stack spacing={1.5}>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: 4, borderColor: 'error.main' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Inventory Alerts</Typography>
                <Typography variant="caption" color="text.secondary">Low stock & overstock</Typography>
              </Box>
              <Chip label={dashboard?.alertSummary?.inventoryAlerts ?? 0} color="error" />
            </Paper>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: 4, borderColor: 'warning.main' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Fraud Alerts</Typography>
                <Typography variant="caption" color="text.secondary">Suspicious activities</Typography>
              </Box>
              <Chip label={dashboard?.alertSummary?.fraudAlerts ?? 0} color="warning" />
            </Paper>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: 4, borderColor: 'info.main' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Delivery Alerts</Typography>
                <Typography variant="caption" color="text.secondary">Failed & delayed</Typography>
              </Box>
              <Chip label={dashboard?.alertSummary?.deliveryAlerts ?? 0} color="info" />
            </Paper>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: 4, borderColor: 'secondary.main' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Pending Escalations</Typography>
                <Typography variant="caption" color="text.secondary">Needs assignment</Typography>
              </Box>
              <Chip label={dashboard?.summary?.pendingEscalations ?? 0} color="secondary" />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
