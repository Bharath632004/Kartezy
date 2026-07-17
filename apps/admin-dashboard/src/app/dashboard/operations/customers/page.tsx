"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Stack, Avatar,
} from '@mui/material';
import {
  Search, RefreshOutlined, People, TrendingUp, WarningAmber, Star, ShoppingCart, MonetizationOn,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const lifecycleColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'primary'> = {
  NEW: 'info', ACTIVE: 'success', AT_RISK: 'warning', CHURNED: 'error', VIP: 'primary',
};

export default function CustomerOperations() {
  const { opsCustomers, opsCustomerLoading, fetchOpsCustomers } = useOperationsStore();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchOpsCustomers(); }, [fetchOpsCustomers]);

  const filtered = opsCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.cityName.toLowerCase().includes(search.toLowerCase())
  );

  if (opsCustomerLoading && opsCustomers.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  const atRisk = opsCustomers.filter(c => c.lifecycleStage === 'AT_RISK' || c.lifecycleStage === 'CHURNED').length;

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Customer Operations</Typography>
          <Typography variant="body2" color="text.secondary">{opsCustomers.length} customers tracked</Typography>
        </Box>
        <Tooltip title="Refresh"><IconButton onClick={() => fetchOpsCustomers()}><RefreshOutlined /></IconButton></Tooltip>
      </Box>

      <TextField fullWidth size="small" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'success.main' }}>
            <CardContent><Typography variant="body2" color="text.secondary">VIP</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>{opsCustomers.filter(c => c.lifecycleStage === 'VIP').length}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
            <CardContent><Typography variant="body2" color="text.secondary">At Risk</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>{atRisk}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
            <CardContent><Typography variant="body2" color="text.secondary">Avg LTV</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>₹{Math.round(opsCustomers.reduce((a, c) => a + c.lifetimeValue, 0) / (opsCustomers.length || 1)).toLocaleString()}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'error.main' }}>
            <CardContent><Typography variant="body2" color="text.secondary">Avg Churn Prob</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>{(opsCustomers.reduce((a, c) => a + c.churnProbability, 0) / (opsCustomers.length || 1) * 100).toFixed(1)}%</Typography></CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Email / Phone</TableCell>
              <TableCell>City / Zone</TableCell>
              <TableCell>Lifecycle</TableCell>
              <TableCell>Segment</TableCell>
              <TableCell align="right">Orders</TableCell>
              <TableCell align="right">Total Spent</TableCell>
              <TableCell align="right">Avg Order</TableCell>
              <TableCell align="right">LTV</TableCell>
              <TableCell align="right">Churn Prob</TableCell>
              <TableCell align="right">Feedback</TableCell>
              <TableCell align="right">Support Tickets</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell><Typography fontWeight={600}>{c.name}</Typography></TableCell>
                <TableCell>
                  <Typography variant="caption">{c.email}</Typography>
                  <br /><Typography variant="caption" color="text.secondary">{c.phone}</Typography>
                </TableCell>
                <TableCell>{c.cityName}{c.zoneName ? ` / ${c.zoneName}` : ''}</TableCell>
                <TableCell><Chip label={c.lifecycleStage} color={lifecycleColors[c.lifecycleStage] ?? 'default'} size="small" /></TableCell>
                <TableCell><Chip label={c.segment} size="small" variant="outlined" /></TableCell>
                <TableCell align="right">{c.totalOrders}</TableCell>
                <TableCell align="right">₹{c.totalSpent.toLocaleString()}</TableCell>
                <TableCell align="right">₹{c.avgOrderValue}</TableCell>
                <TableCell align="right"><Typography fontWeight={600}>₹{c.lifetimeValue.toLocaleString()}</Typography></TableCell>
                <TableCell align="right">
                  <Chip label={`${(c.churnProbability * 100).toFixed(0)}%`} color={c.churnProbability > 0.5 ? 'error' : c.churnProbability > 0.3 ? 'warning' : 'success'} size="small" />
                </TableCell>
                <TableCell align="right">{c.feedbackScore}/10</TableCell>
                <TableCell align="right">{c.supportTickets}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={12} align="center"><Typography color="text.secondary">No customer data available</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
