"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Card, CardContent,
  Tabs, Tab, Button, IconButton, Tooltip, Badge, Divider,
  Chip, Stack, LinearProgress, Select, MenuItem, FormControl, InputLabel,
  Avatar,
} from '@mui/material';
import {
  Refresh, Download, TrendingUp, People, Store,
  LocalShipping, AccountBalance, Campaign, Inventory2,
  Assessment, Share, Insights, Addchart, Map,
  BubbleChart, DonutLarge, Timeline, Waves,
  Warning, CheckCircle, Speed, Star, LocationOn,
  GroupAdd, MonetizationOn, ReportProblem,
  Visibility, Category,
} from '@mui/icons-material';
import { useBIStore } from '@/store/biStore';
import type {
  DeliveryAnalyticsOverview, MarketingAnalyticsOverview,
  ProductAnalyticsOverview, InventoryAnalyticsOverview,
  FinanceAnalyticsOverview, FunnelStageData, CohortMatrixData,
} from '@/store/biStore';

const DOMAINS = [
  { id: 'executive', label: 'Executive Dashboard', icon: Assessment, color: '#2F5496' },
  { id: 'customers', label: 'Customer Analytics', icon: People, color: '#4CAF50' },
  { id: 'merchants', label: 'Merchant Analytics', icon: Store, color: '#FF9800' },
  { id: 'delivery', label: 'Delivery Analytics', icon: LocalShipping, color: '#00BCD4' },
  { id: 'finance', label: 'Finance Analytics', icon: AccountBalance, color: '#9C27B0' },
  { id: 'marketing', label: 'Marketing Analytics', icon: Campaign, color: '#E91E63' },
  { id: 'products', label: 'Product Analytics', icon: Inventory2, color: '#607D8B' },
  { id: 'inventory', label: 'Inventory Analytics', icon: Waves, color: '#795548' },
  { id: 'cohort', label: 'Cohort Analysis', icon: BubbleChart, color: '#3F51B5' },
  { id: 'funnel', label: 'Funnel Analysis', icon: DonutLarge, color: '#009688' },
  { id: 'heatmap', label: 'Heat Maps', icon: Map, color: '#FF5722' },
  { id: 'cities', label: 'City Analytics', icon: Share, color: '#673AB7' },
  { id: 'clv', label: 'CLV Analysis', icon: Timeline, color: '#2196F3' },
  { id: 'churn', label: 'Churn Prediction', icon: TrendingUp, color: '#F44336' },
  { id: 'board', label: 'Board Reports', icon: Assessment, color: '#1B5E20' },
];

export default function BIDashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('last_30_days');
  const { loading, error, fetchAll } = useBIStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const domain = DOMAINS[activeTab];

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1a1a2e' }}>
              Business Intelligence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enterprise analytics platform with real-time insights across all business domains
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Period</InputLabel>
              <Select value={dateRange} label="Period" onChange={(e) => setDateRange(e.target.value)}>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="last_7_days">Last 7 Days</MenuItem>
                <MenuItem value="last_30_days">Last 30 Days</MenuItem>
                <MenuItem value="this_month">This Month</MenuItem>
                <MenuItem value="this_quarter">This Quarter</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Refresh Data">
              <IconButton onClick={() => fetchAll()} color="primary"><Refresh /></IconButton>
            </Tooltip>
            <Tooltip title="Export Report">
              <IconButton color="primary"><Download /></IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Loading & Error */}
        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}
        {error && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#FFF0F0', borderLeft: '4px solid #F44336', borderRadius: 1 }}>
            <Typography variant="body2" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning fontSize="small" /> {error}
            </Typography>
          </Paper>
        )}

        {/* Domain Navigation Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { minHeight: 56, textTransform: 'none', fontWeight: 600 },
              '& .Mui-selected': { color: `${domain?.color} !important` },
              '& .MuiTabs-indicator': { backgroundColor: domain?.color },
            }}
          >
            {DOMAINS.map((d) => {
              const Icon = d.icon;
              return <Tab key={d.id} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Icon sx={{ fontSize: 20 }} /><Typography variant="body2" sx={{ fontWeight: 600 }}>{d.label}</Typography></Box>} />;
            })}
          </Tabs>
        </Paper>

        {/* Dashboard Content */}
        {activeTab === 0 && <ExecutiveDashboardContent />}
        {activeTab === 1 && <CustomerAnalyticsContent />}
        {activeTab === 2 && <MerchantAnalyticsContent />}
        {activeTab === 3 && <DeliveryAnalyticsContent />}
        {activeTab === 4 && <FinanceAnalyticsContent />}
        {activeTab === 5 && <MarketingAnalyticsContent />}
        {activeTab === 6 && <ProductAnalyticsContent />}
        {activeTab === 7 && <InventoryAnalyticsContent />}
        {activeTab === 8 && <CohortAnalysisContent />}
        {activeTab === 9 && <FunnelAnalysisContent />}
        {activeTab === 10 && <HeatMapContent />}
        {activeTab === 11 && <CityAnalyticsContent />}
        {activeTab === 12 && <CLVContent />}
        {activeTab === 13 && <ChurnContent />}
        {activeTab === 14 && <BoardReportContent />}
      </Container>
    </Box>
  );
}

// ==================== KPI Card Component ====================
function KPICard({ label, value, sub, color, icon: Icon, change }: {
  label: string; value: string; sub?: string; color: string; icon: any; change?: string;
}) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>{label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>{value}</Typography>
            {change && <Chip label={change} size="small" sx={{ bgcolor: `${color}18`, color, fontWeight: 600, fontSize: 11 }} />}
            {sub && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>{sub}</Typography>}
          </Box>
          <Avatar sx={{ bgcolor: `${color}18`, width: 48, height: 48 }}><Icon sx={{ color, fontSize: 24 }} /></Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ label, value, max, color = '#2F5496' }: { label: string; value: number; max: number; color?: string }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{label}</Typography>
        <Typography variant="body2" color="text.secondary">{typeof value === 'number' ? value.toLocaleString() : value}</Typography>
      </Box>
      <LinearProgress variant="determinate" value={(value / max) * 100} sx={{ height: 8, borderRadius: 4, bgcolor: '#E8EAF6', '& .MuiLinearProgress-bar': { bgcolor: color } }} />
    </Box>
  );
}

// ==================== 1. EXECUTIVE DASHBOARD ====================
function ExecutiveDashboardContent() {
  const { executiveSummary } = useBIStore();
  const e = executiveSummary;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard label="Total Revenue" value={e?.totalRevenue || '₹0'} change="+22.5%" color="#4CAF50" icon={TrendingUp} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard label="Active Customers" value={(e?.activeCustomers || 0).toLocaleString()} change="+12.3%" color="#2196F3" icon={People} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard label="Active Merchants" value={(e?.activeMerchants || 0).toLocaleString()} change="+15.8%" color="#FF9800" icon={Store} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard label="Delivery Success" value={`${((e?.deliverySuccessRate || 0) * 100).toFixed(1)}%`} change="+2.1%" color="#00BCD4" icon={LocalShipping} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Speed sx={{ color: '#2F5496' }} /> Strategic Health Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 700, color: e?.companyHealthScore && e.companyHealthScore >= 70 ? '#4CAF50' : '#FF9800' }}>
                {e?.companyHealthScore || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">Company Health</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Stack spacing={1.5}>
                <ProgressBar label="Revenue Growth" value={e?.revenueGrowth || 0} max={50} color="#4CAF50" />
                <ProgressBar label="Profit Margin" value={e?.profitMargin || 0} max={30} color="#2196F3" />
                <ProgressBar label="Customer Retention" value={(e?.customerRetention || 0)} max={100} color="#FF9800" />
                <ProgressBar label="Market Share" value={(e?.marketShare || 0)} max={30} color="#9C27B0" />
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ color: '#4CAF50' }} /> Growth Metrics
          </Typography>
          <Stack spacing={2}>
            <Box><Typography variant="body2" color="text.secondary">YoY Growth</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{e?.yoyGrowth || 0}%</Typography></Box>
            <Divider />
            <Box><Typography variant="body2" color="text.secondary">Total Orders</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{(e?.totalOrders || 0).toLocaleString()}</Typography></Box>
            <Divider />
            <Box><Typography variant="body2" color="text.secondary">Market Share</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{e?.marketShare || 0}%</Typography></Box>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportProblem sx={{ color: '#FF9800' }} /> Strategic Alerts
          </Typography>
          <Stack spacing={2}>
            {(e?.strategicAlerts || []).map((alert, i) => (
              <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2, borderLeft: `4px solid ${alert.severity === 'high' ? '#F44336' : alert.severity === 'medium' ? '#FF9800' : '#2196F3'}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>{alert.title}</Typography>
                <Typography variant="body2" color="text.secondary">{alert.description}</Typography>
                <Chip label={alert.severity.toUpperCase()} size="small" sx={{ mt: 1, bgcolor: alert.severity === 'high' ? '#FFEBEE' : '#FFF3E0', color: alert.severity === 'high' ? '#F44336' : '#FF9800', fontWeight: 600 }} />
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

// ==================== 2. CUSTOMER ANALYTICS ====================
function CustomerAnalyticsContent() {
  const { customerOverview, clvDistribution, churnOverview, customerSegments } = useBIStore();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Total Customers" value={(customerOverview?.totalCustomers || 0).toLocaleString()} change={`${((customerOverview?.customerGrowthRate || 0) * 100).toFixed(1)}%`} color="#4CAF50" icon={People} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Active Customers" value={(customerOverview?.activeCustomers || 0).toLocaleString()} sub={`${((customerOverview?.activeCustomers || 0) / (customerOverview?.totalCustomers || 1) * 100).toFixed(1)}% active rate`} color="#2196F3" icon={GroupAdd} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Retention Rate" value={`${((customerOverview?.retentionRate || 0) * 100).toFixed(0)}%`} sub={`Avg lifetime: ${customerOverview?.averageCustomerLifetimeDays || 0} days`} color="#FF9800" icon={Star} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Avg Lifetime Value" value={`₹${(customerOverview?.averageLifetimeValue || 0).toLocaleString()}`} sub="Per customer" color="#9C27B0" icon={MonetizationOn} /></Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Customer Segments</Typography>
          <Stack spacing={2}>
            {(clvDistribution || []).map((seg) => (
              <Box key={seg.segment}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{seg.segment}</Typography>
                  <Typography variant="body2" color="text.secondary">₹{seg.averageCLV.toLocaleString()} avg</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(seg.customerCount / (Math.max(...(clvDistribution || []).map(s => s.customerCount), 1))) * 100} sx={{ height: 8, borderRadius: 4 }} />
                <Typography variant="caption" color="text.secondary">{seg.customerCount.toLocaleString()} customers • ₹{(seg.totalValue / 100000).toFixed(1)}L total</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning sx={{ color: '#F44336' }} /> Churn Risk
          </Typography>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#F44336' }}>{((churnOverview?.predictedChurnRate || 0) * 100).toFixed(1)}%</Typography>
            <Typography variant="body2" color="text.secondary">Predicted Churn Rate</Typography>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>{(churnOverview?.customersAtRisk || 0).toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Customers at Risk</Typography>
            <Typography variant="h6" sx={{ mt: 2, color: '#FF9800' }}>₹{(churnOverview?.estimatedRevenueAtRisk || 0).toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Revenue at Risk</Typography>
          </Box>
          <Stack spacing={1}>
            {(churnOverview?.topRiskFactors || []).map((f, i) => (
              <Box key={i}><Typography variant="caption">{f.factor}</Typography><LinearProgress variant="determinate" value={f.weight * 100} sx={{ height: 4, borderRadius: 2 }} /></Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

// ==================== 3. MERCHANT ANALYTICS ====================
function MerchantAnalyticsContent() {
  const { merchantOverview } = useBIStore();
  const m = merchantOverview;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Total Merchants" value={(m?.totalMerchants || 0).toLocaleString()} color="#FF9800" icon={Store} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Active Merchants" value={(m?.activeMerchants || 0).toLocaleString()} sub={`${((m?.activeMerchants || 0) / (m?.totalMerchants || 1) * 100).toFixed(0)}% active`} color="#4CAF50" icon={CheckCircle} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Average Rating" value={(m?.averageRating || 0).toString()} color="#2196F3" icon={Star} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Total Commission" value={`₹${(m?.totalCommission || 0).toLocaleString()}`} color="#9C27B0" icon={MonetizationOn} /></Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Merchants by City</Typography>
          <Stack spacing={1.5}>
            {Object.entries(m?.merchantsByCity || {}).map(([city, count]) => (
              <ProgressBar key={city} label={city} value={count as number} max={Math.max(...Object.values(m?.merchantsByCity || {})) as number} color="#FF9800" />
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Merchants by Tier</Typography>
          <Stack spacing={1.5}>
            {Object.entries(m?.merchantsByTier || {}).map(([tier, count]) => (
              <ProgressBar key={tier} label={tier} value={count as number} max={m?.totalMerchants || 1} color="#673AB7" />
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Pending Approvals</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>{m?.pendingMerchants || 0}</Typography>
          <Typography variant="body2" color="text.secondary">Merchants pending verification</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

// ==================== 4-8. DELIVERY, FINANCE, MARKETING, PRODUCTS, INVENTORY ====================
function DeliveryAnalyticsContent() {
  const { deliveryOverview, driverPerformance } = useBIStore();
  const d = deliveryOverview;
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Total Deliveries" value={(d?.totalDeliveries || 0).toLocaleString()} color="#00BCD4" icon={LocalShipping} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Success Rate" value={`${((d?.deliverySuccessRate || 0) * 100).toFixed(1)}%`} color="#4CAF50" icon={CheckCircle} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Avg Delivery Time" value={`${d?.averageDeliveryTime || 0} min`} color="#FF9800" icon={Timeline} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Active Drivers" value={(d?.totalActiveDrivers || 0).toLocaleString()} sub={`${((d?.driverUtilizationRate || 0) * 100).toFixed(0)}% utilization`} color="#2196F3" icon={People} /></Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Deliveries by Zone</Typography>
          <Stack spacing={1.5}>
            {Object.entries(d?.deliveriesByZone || {}).map(([zone, count]) => (
              <ProgressBar key={zone} label={zone} value={count as number} max={Math.max(...Object.values(d?.deliveriesByZone || {})) as number} color="#00BCD4" />
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Top Drivers</Typography>
          <Stack spacing={1.5}>
            {(driverPerformance || []).slice(0, 5).map((driver, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#F5F7FA', borderRadius: 1 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{driver.driverName}</Typography>
                  <Typography variant="caption" color="text.secondary">{driver.totalDeliveries} deliveries • {driver.averageRating.toFixed(1)}★</Typography>
                </Box>
                <Chip label={`${(driver.onTimeRate * 100).toFixed(0)}%`} size="small" color={driver.onTimeRate > 0.9 ? 'success' : 'warning'} />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

function FinanceAnalyticsContent() {
  const { financeOverview, revenueBreakdown } = useBIStore();
  const f = financeOverview;
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Total Revenue" value={`₹${(f?.totalRevenue || 0).toLocaleString()}`} change={`${((f?.revenueGrowth || 0) * 100).toFixed(1)}%`} color="#4CAF50" icon={TrendingUp} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Gross Margin" value={`${((f?.grossMargin || 0) * 100).toFixed(1)}%`} sub={`₹${(f?.grossProfit || 0).toLocaleString()}`} color="#2196F3" icon={MonetizationOn} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Net Margin" value={`${((f?.netMargin || 0) * 100).toFixed(1)}%`} sub={`₹${(f?.netProfit || 0).toLocaleString()}`} color="#9C27B0" icon={AccountBalance} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Total Commission" value={`₹${(f?.totalCommission || 0).toLocaleString()}`} color="#FF9800" icon={Store} /></Grid>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Revenue by Source</Typography>
          <Stack spacing={1.5}>
            {Object.entries(f?.revenueBySource || {}).map(([source, amount]) => (
              <ProgressBar key={source} label={source} value={amount as number} max={(f?.totalRevenue || 1)} color="#9C27B0" />
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

function MarketingAnalyticsContent() {
  const { marketingOverview, channelPerformance } = useBIStore();
  const m = marketingOverview;
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Active Campaigns" value={(m?.activeCampaigns || 0).toString()} color="#E91E63" icon={Campaign} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Total Impressions" value={(m?.totalImpressions || 0).toLocaleString()} color="#2196F3" icon={Visibility} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Conversions" value={(m?.totalConversions || 0).toLocaleString()} sub={`${((m?.totalConversions || 0) / (m?.totalClicks || 1) * 100).toFixed(1)}% CVR`} color="#4CAF50" icon={CheckCircle} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="ROAS" value={`${(m?.overallROAS || 0).toFixed(1)}x`} sub={`₹${(m?.totalSpend || 0).toLocaleString()} spent`} color="#9C27B0" icon={TrendingUp} /></Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Campaigns by Channel</Typography>
          <Stack spacing={1.5}>
            {Object.entries(m?.campaignByChannel || {}).map(([channel, count]) => (
              <ProgressBar key={channel} label={channel} value={count as number} max={Math.max(...Object.values(m?.campaignByChannel || {})) as number} color="#E91E63" />
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

function ProductAnalyticsContent() {
  const { productOverview } = useBIStore();
  const p = productOverview;
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Total Products" value={(p?.totalProducts || 0).toLocaleString()} color="#607D8B" icon={Category} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Active Products" value={(p?.activeProducts || 0).toLocaleString()} sub={`${((p?.activeProducts || 0) / (p?.totalProducts || 1) * 100).toFixed(0)}% active`} color="#4CAF50" icon={CheckCircle} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Categories" value={(p?.categories || 0).toString()} color="#2196F3" icon={Category} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Avg Product Price" value={`₹${(p?.averageProductPrice || 0).toFixed(0)}`} color="#FF9800" icon={MonetizationOn} /></Grid>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Top Categories by Revenue</Typography>
          <Stack spacing={1.5}>
            {(p?.topCategories || []).map((cat) => (
              <Box key={cat.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{cat.name}</Typography>
                  <Typography variant="body2" color="text.secondary">₹{(cat.revenue / 100000).toFixed(1)}L • {cat.products} products</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(cat.revenue / (Math.max(...(p?.topCategories || []).map((c: any) => c.revenue), 1))) * 100} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

function InventoryAnalyticsContent() {
  const { inventoryOverview, replenishmentSuggestions } = useBIStore();
  const i = inventoryOverview;
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Total SKUs" value={(i?.totalSKUs || 0).toLocaleString()} color="#795548" icon={Waves} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Stockout Rate" value={`${((i?.stockoutRate || 0) * 100).toFixed(2)}%`} color="#F44336" icon={Warning} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Inventory Turnover" value={(i?.averageTurnover || 0).toFixed(1)} color="#4CAF50" icon={Speed} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Accuracy" value={`${((i?.inventoryAccuracy || 0) * 100).toFixed(0)}%`} color="#2196F3" icon={CheckCircle} /></Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Stock Status Distribution</Typography>
          <Stack spacing={1.5}>
            {Object.entries(i?.stockStatusDistribution || {}).map(([status, count]) => (
              <ProgressBar key={status} label={status.replace('_', ' ')} value={count as number} max={(i?.totalSKUs || 1)} color={status === 'OUT_OF_STOCK' ? '#F44336' : status === 'LOW_STOCK' ? '#FF9800' : '#4CAF50'} />
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning sx={{ color: '#FF9800' }} /> Replenishment Required
          </Typography>
          <Stack spacing={1.5}>
            {(replenishmentSuggestions || []).slice(0, 5).map((item, i) => (
              <Box key={i} sx={{ p: 1.5, bgcolor: item.priority === 'CRITICAL' ? '#FFEBEE' : '#FFF3E0', borderRadius: 1, borderLeft: `3px solid ${item.priority === 'CRITICAL' ? '#F44336' : '#FF9800'}` }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.productName}</Typography>
                <Typography variant="caption" color="text.secondary">Stock: {item.currentStock} • Reorder at: {item.reorderPoint} • Recommend: {item.recommendedQuantity}</Typography>
                <Chip label={item.priority} size="small" sx={{ ml: 1, bgcolor: item.priority === 'CRITICAL' ? '#FFEBEE' : '#FFF3E0', color: item.priority === 'CRITICAL' ? '#F44336' : '#FF9800', fontWeight: 600 }} />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

// ==================== 9-14. ADVANCED ANALYTICS ====================
function CohortAnalysisContent() {
  const { cohortMatrix } = useBIStore();
  const c = cohortMatrix;
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Retention Cohort Matrix</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #E0E0E0', color: '#666' }}>Cohort</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #E0E0E0', color: '#666' }}>Size</th>
                  {(c?.periods || []).map((p, i) => (
                    <th key={i} style={{ textAlign: 'center', padding: '8px 4px', borderBottom: '2px solid #E0E0E0', color: '#666', fontSize: 12 }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(c?.cohorts || []).map((cohort, ci) => (
                  <tr key={ci}>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #F0F0F0', fontWeight: 500 }}>{cohort}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #F0F0F0', color: '#666' }}>{(c?.cohortSizes?.[ci] || 0).toLocaleString()}</td>
                    {(c?.data?.[ci] || []).map((val, pi) => (
                      <td key={pi} style={{
                        padding: '8px 4px', textAlign: 'center', borderBottom: '1px solid #F0F0F0',
                        backgroundColor: val > 0.6 ? '#C8E6C9' : val > 0.4 ? '#FFF9C4' : val > 0.2 ? '#FFECB3' : '#FFCCBC',
                        fontWeight: val > 0 ? 600 : 400, color: val > 0.6 ? '#2E7D32' : val > 0.4 ? '#F57F17' : '#C62828',
                      }}>
                        {val > 0 ? `${(val * 100).toFixed(0)}%` : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Cohort Insights</Typography>
          <Stack spacing={1}>
            <Typography variant="body2">• Best performing cohort retains {(c?.data?.[0]?.[c?.data?.[0]?.length ? c.data[0].length - 1 : 0] || 0) * 100}% by the last period</Typography>
            <Typography variant="body2">• Average retention across all cohorts: {((c?.data || []).map(row => row[row.length - 1] || 0).reduce((a, b) => a + b, 0) / (c?.data?.length || 1) * 100).toFixed(0)}%</Typography>
            <Typography variant="body2">• Recent cohorts show {(c?.data?.[0]?.[1] || 0) > (c?.data?.[c?.data?.length ? c.data.length - 1 : 0]?.[1] || 0) ? 'improving' : 'stable'} retention trends</Typography>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

function FunnelAnalysisContent() {
  const { funnelStages } = useBIStore();
  if (!funnelStages || funnelStages.length === 0) return <EmptySection />;
  const maxUsers = funnelStages[0]?.users || 1;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Order Conversion Funnel</Typography>
          <Stack spacing={2}>
            {funnelStages.map((stage, i) => (
              <Box key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ minWidth: 140 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{stage.name}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress variant="determinate" value={(stage.users / maxUsers) * 100}
                      sx={{ height: 28, borderRadius: 2, bgcolor: '#F0F0F0', '& .MuiLinearProgress-bar': { bgcolor: i < 3 ? '#4CAF50' : i < 5 ? '#FF9800' : '#F44336', borderRadius: 2 } }} />
                  </Box>
                  <Box sx={{ minWidth: 120, textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{stage.users.toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">{stage.percentage.toFixed(1)}%</Typography>
                  </Box>
                </Box>
                {i > 0 && stage.dropOff > 0 && (
                  <Typography variant="caption" color="error" sx={{ ml: 18 }}>
                    Drop-off: {stage.dropOff.toLocaleString()} ({((funnelStages[i - 1]?.users || 0) > 0 ? (stage.dropOff / funnelStages[i - 1].users) * 100 : 0).toFixed(1)}%)
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

function HeatMapContent() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Map sx={{ color: '#FF5722' }} /> Order Density Heat Map
          </Typography>
          <Box sx={{ position: 'relative', height: 400, bgcolor: '#1a1a2e', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* Simulated heat map visualization */}
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <Box key={i} sx={{
                  position: 'absolute',
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  width: `${20 + Math.random() * 60}px`,
                  height: `${20 + Math.random() * 60}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(255,${Math.floor(50 + Math.random() * 100)},${Math.floor(Math.random() * 50)},${0.3 + Math.random() * 0.5}) 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
              ))}
              <Box sx={{ position: 'absolute', bottom: 16, left: 16, color: 'white' }}>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>Mumbai Metropolitan Region</Typography>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>50 data points • Last 30 days</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

function CityAnalyticsContent() {
  const { cityComparison } = useBIStore();
  const c = cityComparison;
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>City Performance Comparison</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid #E0E0E0', color: '#666' }}>City</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', borderBottom: '2px solid #E0E0E0', color: '#666' }}>Orders</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', borderBottom: '2px solid #E0E0E0', color: '#666' }}>Revenue</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', borderBottom: '2px solid #E0E0E0', color: '#666' }}>AOV</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', borderBottom: '2px solid #E0E0E0', color: '#666' }}>Delivery Time</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', borderBottom: '2px solid #E0E0E0', color: '#666' }}>Growth</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid #E0E0E0', color: '#666' }}>Tier</th>
                </tr>
              </thead>
              <tbody>
                {(c?.cities || []).map((city, i) => (
                  <tr key={i}>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #F0F0F0', fontWeight: 600 }}>
                      {city.city} {city.city === c?.topCity ? <Chip label="TOP" size="small" sx={{ bgcolor: '#FFD700', color: '#000', fontWeight: 700, ml: 1, fontSize: 10 }} /> : null}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #F0F0F0', textAlign: 'right' }}>{city.totalOrders.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #F0F0F0', textAlign: 'right' }}>₹{(city.totalRevenue / 100000).toFixed(1)}L</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #F0F0F0', textAlign: 'right' }}>₹{city.averageOrderValue.toFixed(0)}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #F0F0F0', textAlign: 'right' }}>{city.averageDeliveryTime.toFixed(1)}m</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #F0F0F0', textAlign: 'right', color: city.growthRate > 0.2 ? '#4CAF50' : '#FF9800' }}>{(city.growthRate * 100).toFixed(1)}%</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #F0F0F0', textAlign: 'center' }}><Chip label={city.tier} size="small" variant="outlined" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

function CLVContent() {
  const { clvDistribution } = useBIStore();
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>CLV by Segment</Typography>
          <Stack spacing={2}>
            {(clvDistribution || []).map((seg) => (
              <Box key={seg.segment}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{seg.segment}</Typography>
                  <Typography variant="body2" color="text.secondary">₹{seg.averageCLV.toLocaleString()}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(seg.averageCLV / (Math.max(...(clvDistribution || []).map(s => s.averageCLV), 1))) * 100} sx={{ height: 8, borderRadius: 4 }} />
                <Typography variant="caption" color="text.secondary">{seg.customerCount.toLocaleString()} customers • Total: ₹{(seg.totalValue / 10000000).toFixed(2)}Cr</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>CLV Distribution Summary</Typography>
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#2F5496' }}>
            ₹{((clvDistribution || []).reduce((sum, s) => sum + s.totalValue, 0) / 10000000).toFixed(1)}Cr
          </Typography>
          <Typography variant="body2" color="text.secondary">Total Customer Value</Typography>
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 600, color: '#4CAF50' }}>
            {(clvDistribution || []).reduce((sum, s) => sum + s.customerCount, 0).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">Total Customers Analyzed</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

function ChurnContent() {
  const { churnOverview } = useBIStore();
  const c = churnOverview;
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Total Customers" value={(c?.totalCustomers || 0).toLocaleString()} color="#2196F3" icon={People} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Customers at Risk" value={(c?.customersAtRisk || 0).toLocaleString()} color="#F44336" icon={Warning} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Predicted Churn Rate" value={`${((c?.predictedChurnRate || 0) * 100).toFixed(1)}%`} color="#FF9800" icon={TrendingUp} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}><KPICard label="Revenue at Risk" value={`₹${(c?.estimatedRevenueAtRisk || 0).toLocaleString()}`} color="#F44336" icon={MonetizationOn} /></Grid>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Top Churn Risk Factors</Typography>
          <Stack spacing={2}>
            {(c?.topRiskFactors || []).map((f, i) => (
              <Box key={i}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{f.factor}</Typography>
                  <Typography variant="body2" color="text.secondary">{f.affectedCustomers.toLocaleString()} customers • {((f.weight || 0) * 100).toFixed(0)}% impact</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(f.weight || 0) * 100} sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { bgcolor: (f.weight || 0) > 0.3 ? '#F44336' : (f.weight || 0) > 0.2 ? '#FF9800' : '#2196F3' } }} />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

// ==================== 15. BOARD REPORTS ====================
function BoardReportContent() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assessment sx={{ color: '#1B5E20' }} /> Quarterly Board Report - Q3 FY2024
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1B5E20', mb: 1 }}>Executive Summary</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Revenue grew 28% YoY to ₹14.5Cr, exceeding targets by 4%. Gross merchandise value crossed ₹50Cr milestone.
            Expanded to 3 new Tier-2 cities. Customer base grew 35% to 2.5L active users. Launched AI-powered recommendation engine improving AOV by 12%.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1B5E20', mb: 1 }}>Key Highlights</Typography>
          <Stack spacing={1} sx={{ mb: 3 }}>
            {['Revenue grew 28% YoY to ₹14.5Cr, exceeding target by 4%', 'Gross merchandise value (GMV) crossed ₹50Cr milestone', 'Expanded to 3 new Tier-2 cities - Pune, Jaipur, Lucknow', 'Customer base grew 35% to 2.5L active users', 'Delivery success rate improved to 94.5%'].map((h, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: '#4CAF50', fontSize: 18 }} />
                <Typography variant="body2">{h}</Typography>
              </Box>
            ))}
          </Stack>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1B5E20', mb: 1 }}>Strategic Initiatives</Typography>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {[{ name: 'AI-Powered Personalization', status: 'Completed', progress: 100, impact: '12% AOV increase' },
              { name: 'Tier-2 City Expansion', status: 'On Track', progress: 65, impact: '35% increase in addressable market' },
              { name: 'Merchant Self-Service Portal', status: 'In Progress', progress: 40, impact: 'Reduce onboarding time by 60%' },
              { name: 'Dark Store Network', status: 'Planning', progress: 15, impact: 'Reduce delivery time to under 15 min' },
            ].map((init, i) => (
              <Box key={i}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{init.name}</Typography>
                  <Chip label={init.status} size="small" color={init.status === 'Completed' ? 'success' : init.status === 'On Track' ? 'info' : 'default'} />
                </Box>
                <LinearProgress variant="determinate" value={init.progress} sx={{ height: 6, borderRadius: 3 }} />
                <Typography variant="caption" color="text.secondary">{init.impact}</Typography>
              </Box>
            ))}
          </Stack>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1B5E20', mb: 1 }}>Recommendations</Typography>
          <Stack spacing={1}>
            {['Increase marketing budget by 25% for festive season', 'Accelerate dark store network to 10 locations', 'Launch merchant financing program', 'Invest in AI retention engine to reduce churn by 25%'].map((r, i) => (
              <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star sx={{ color: '#FFD700', fontSize: 16 }} /> {r}
              </Typography>
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Report Summary</Typography>
          <Stack spacing={2}>
            <Box><Typography variant="caption" color="text.secondary">Period</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>Q3 2024 (Jul-Sep)</Typography></Box>
            <Divider />
            <Box><Typography variant="caption" color="text.secondary">Prepared For</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>Board of Directors</Typography></Box>
            <Divider />
            <Box><Typography variant="caption" color="text.secondary">Prepared By</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>Kartezy BI Platform</Typography></Box>
            <Divider />
            <Box><Typography variant="caption" color="text.secondary">Generated</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{new Date().toLocaleDateString()}</Typography></Box>
            <Divider />
            <Box><Typography variant="caption" color="text.secondary">Company Health</Typography><Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>78/100</Typography></Box>
            <Divider />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" size="small" fullWidth startIcon={<Download />}>Download PDF</Button>
              <Button variant="outlined" size="small" fullWidth startIcon={<Share />}>Share</Button>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

function EmptySection() {
  return (
    <Paper sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
      <Assessment sx={{ fontSize: 64, color: '#2F5496', mb: 2, opacity: 0.3 }} />
      <Typography variant="h6" color="text.secondary">No data available. Refresh to load analytics.</Typography>
    </Paper>
  );
}
