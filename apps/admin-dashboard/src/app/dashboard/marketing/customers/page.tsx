"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, Stack, Button, TextField, MenuItem,
  Avatar, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, IconButton, Tooltip, LinearProgress, Rating, Tabs, Tab, Dialog, DialogTitle,
  DialogContent, DialogActions, Badge, Divider, Alert,
} from '@mui/material';
import { useCRMStore } from '@/store/crmStore';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import DiamondIcon from '@mui/icons-material/Diamond';

const lifecycleColors: Record<string, string> = {
  NEW: '#2196f3',
  ACTIVE: '#4caf50',
  AT_RISK: '#ff9800',
  CHURNED: '#f44336',
  VIP: '#9c27b0',
};

const tierIcons: Record<string, React.ReactNode> = {
  BRONZE: <Typography variant="caption" sx={{ fontWeight: 700, color: '#cd7f32' }}>B</Typography>,
  SILVER: <Typography variant="caption" sx={{ fontWeight: 700, color: '#9e9e9e' }}>S</Typography>,
  GOLD: <Typography variant="caption" sx={{ fontWeight: 700, color: '#ffd700' }}>G</Typography>,
  PLATINUM: <span>💎</span>,
  DIAMOND: <DiamondIcon sx={{ fontSize: 16, color: '#b9f2ff' }} />,
};

export default function CustomersPage() {
  const {
    customers, customerLoading, customerError, selectedCustomer, customerActivities,
    fetchCustomers, fetchCustomerById, fetchCustomerActivities, updateCustomer, setSelectedCustomer,
  } = useCRMStore();

  const [filters, setFilters] = useState({ search: '', lifecycleStage: '', tier: '', segment: '' });
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTab, setDetailTab] = useState(0);

  useEffect(() => { fetchCustomers(filters); }, [filters, fetchCustomers]);

  const handleViewCustomer = async (customer: any) => {
    setSelectedCustomer(customer);
    await fetchCustomerActivities(customer.id);
    setDetailOpen(true);
  };

  const getLifecycleColor = (stage: string) => lifecycleColors[stage] || '#999';

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  if (customerError) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" action={<Button onClick={() => fetchCustomers()} size="small">Retry</Button>}>
          {customerError}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Customer CRM</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<FilterListIcon />}>Save Segment</Button>
            <Button variant="contained" startIcon={<RefreshIcon />} onClick={() => fetchCustomers()}>
              Refresh
            </Button>
          </Stack>
        </Stack>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Customers</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {customers.length.toLocaleString()}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                    <GroupIcon />
                  </Avatar>
                </Stack>
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                  ↑ 12.5% this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">Avg. LTV</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      ${customers.reduce((sum, c) => sum + c.lifetimeValue, 0) > 0
                        ? (customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / customers.length).toFixed(0)
                        : '0'}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                    <AttachMoneyIcon />
                  </Avatar>
                </Stack>
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                  ↑ 8.3% vs last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">At Risk</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: 'warning.main' }}>
                      {customers.filter(c => c.lifecycleStage === 'AT_RISK').length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                    <WarningIcon />
                  </Avatar>
                </Stack>
                <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                  Needs attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">VIP Members</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: 'secondary.main' }}>
                      {customers.filter(c => c.lifecycleStage === 'VIP').length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'secondary.light', width: 48, height: 48 }}>
                    <DiamondIcon />
                  </Avatar>
                </Stack>
                <Typography variant="caption" color="secondary.main" sx={{ mt: 1, display: 'block' }}>
                  ↑ 3 new this week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              size="small"
              placeholder="Search customers..."
              value={filters.search}
              onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
              sx={{ minWidth: 250 }}
              slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
            />
            <TextField
              select size="small" label="Lifecycle"
              value={filters.lifecycleStage}
              onChange={(e) => setFilters(p => ({ ...p, lifecycleStage: e.target.value }))}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">All Stages</MenuItem>
              <MenuItem value="NEW">New</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="AT_RISK">At Risk</MenuItem>
              <MenuItem value="CHURNED">Churned</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
            </TextField>
            <TextField
              select size="small" label="Tier"
              value={filters.tier}
              onChange={(e) => setFilters(p => ({ ...p, tier: e.target.value }))}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">All Tiers</MenuItem>
              <MenuItem value="BRONZE">Bronze</MenuItem>
              <MenuItem value="SILVER">Silver</MenuItem>
              <MenuItem value="GOLD">Gold</MenuItem>
              <MenuItem value="PLATINUM">Platinum</MenuItem>
              <MenuItem value="DIAMOND">Diamond</MenuItem>
            </TextField>
            <TextField
              select size="small" label="Segment"
              value={filters.segment}
              onChange={(e) => setFilters(p => ({ ...p, segment: e.target.value }))}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">All Segments</MenuItem>
              <MenuItem value="High Value">High Value</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="At Risk">At Risk</MenuItem>
              <MenuItem value="Loyal">Loyal</MenuItem>
              <MenuItem value="Whale">Whale</MenuItem>
            </TextField>
          </Stack>
        </Paper>

        {/* Customers Table */}
        {customerLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography color="text.secondary">Loading customers...</Typography>
          </Box>
        ) : customers.length === 0 ? (
          <Paper elevation={1} sx={{ py: 6, textAlign: 'center', borderRadius: 2 }}>
            <StorefrontIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No customers found</Typography>
            <Typography variant="body2" color="text.disabled">Try adjusting your filters</Typography>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Lifecycle</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tier</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Segment</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Orders</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Total Spent</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">LTV</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Engagement</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Churn Risk</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      hover
                      sx={{ '&:hover': { cursor: 'pointer' }, '&:last-child td': { border: 0 } }}
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
                            {customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{customer.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{customer.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.lifecycleStage}
                          size="small"
                          sx={{
                            bgcolor: getLifecycleColor(customer.lifecycleStage),
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={tierIcons[customer.tier]}
                          label={customer.tier}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600, borderColor: 'divider' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{customer.segment}</Typography>
                      </TableCell>
                      <TableCell align="right">{customer.totalOrders}</TableCell>
                      <TableCell align="right">${customer.totalSpent.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                        ${customer.lifetimeValue.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={`Engagement: ${customer.engagementScore}/100`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LinearProgress
                              variant="determinate"
                              value={customer.engagementScore}
                              color={getEngagementColor(customer.engagementScore)}
                              sx={{ width: 60, height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: customer.churnProbability > 0.4 ? 'error.main' :
                                   customer.churnProbability > 0.2 ? 'warning.main' : 'success.main',
                          }}
                        >
                          {(customer.churnProbability * 100).toFixed(0)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewCustomer(customer); }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                            <EmailIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                            <LocalOfferIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Customer Detail Dialog */}
        <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
          {selectedCustomer && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: 18 }}>
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedCustomer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{selectedCustomer.email}</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={selectedCustomer.lifecycleStage}
                      size="small"
                      sx={{ bgcolor: getLifecycleColor(selectedCustomer.lifecycleStage), color: '#fff' }}
                    />
                    <Chip
                      icon={tierIcons[selectedCustomer.tier]}
                      label={selectedCustomer.tier}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </DialogTitle>
              <Divider />
              <DialogContent>
                <Tabs value={detailTab} onChange={(_, v) => setDetailTab(v)} sx={{ mb: 2 }}>
                  <Tab label="Overview" />
                  <Tab label="Activity Timeline" />
                  <Tab label="Segments & Tags" />
                </Tabs>

                {detailTab === 0 && (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Customer Details</Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Phone</Typography>
                            <Typography variant="body2">{selectedCustomer.phone || '-'}</Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Member Since</Typography>
                            <Typography variant="body2">{selectedCustomer.signupDate}</Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Last Order</Typography>
                            <Typography variant="body2">{selectedCustomer.lastOrderDate}</Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Last Activity</Typography>
                            <Typography variant="body2">{selectedCustomer.lastActivityDate}</Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Metrics</Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedCustomer.totalOrders}</Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>${selectedCustomer.totalSpent.toLocaleString()}</Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Avg Order Value</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>${selectedCustomer.averageOrderValue.toFixed(2)}</Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Lifetime Value</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                              ${selectedCustomer.lifetimeValue.toLocaleString()}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Loyalty Points</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedCustomer.loyaltyPoints}</Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Referrals</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedCustomer.referralCount}</Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                )}

                {detailTab === 1 && (
                  <Box>
                    {customerActivities.length === 0 ? (
                      <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                        No recent activity found
                      </Typography>
                    ) : (
                      <Stack spacing={1.5}>
                        {customerActivities.map((activity) => (
                          <Paper key={activity.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                  label={activity.type}
                                  size="small"
                                  color={
                                    activity.type === 'ORDER' ? 'primary' :
                                    activity.type === 'LOGIN' ? 'default' :
                                    activity.type === 'REVIEW' ? 'success' :
                                    activity.type === 'REFERRAL' ? 'secondary' :
                                    activity.type === 'LOYALTY' ? 'warning' : 'info'
                                  }
                                  variant="outlined"
                                />
                                <Typography variant="body2">{activity.description}</Typography>
                              </Stack>
                              <Typography variant="caption" color="text.secondary">{activity.timestamp}</Typography>
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </Box>
                )}

                {detailTab === 2 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Tags</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                      {selectedCustomer.tags.length > 0 ? selectedCustomer.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      )) : (
                        <Typography variant="body2" color="text.secondary">No tags</Typography>
                      )}
                    </Stack>
                    <Typography variant="subtitle2" gutterBottom>Segment: {selectedCustomer.segment}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Engagement Score</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={selectedCustomer.engagementScore}
                        color={getEngagementColor(selectedCustomer.engagementScore)}
                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">{selectedCustomer.engagementScore}/100</Typography>
                    </Box>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailOpen(false)}>Close</Button>
                <Button variant="contained" startIcon={<PhoneIcon />}>Contact</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
}
