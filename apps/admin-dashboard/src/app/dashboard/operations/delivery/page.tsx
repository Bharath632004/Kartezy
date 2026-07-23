"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, LinearProgress, Stack, Link,
} from '@mui/material';
import {
  Search, RefreshOutlined, LocalShipping, CheckCircle, ErrorOutlined, AccessTime, LocationOn, Phone,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const deliveryStatusColors: Record<string, 'info' | 'primary' | 'warning' | 'success' | 'error'> = {
  ASSIGNED: 'info', PICKED_UP: 'primary', IN_TRANSIT: 'warning', ARRIVED: 'info', DELIVERED: 'success', FAILED: 'error', CANCELLED: 'error',
};

export default function DeliveryOperations() {
  const { opsDeliveries, opsDeliveryLoading, fetchOpsDeliveries } = useOperationsStore();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchOpsDeliveries(); }, [fetchOpsDeliveries]);

  const filtered = opsDeliveries.filter((d) =>
    d.driverName.toLowerCase().includes(search.toLowerCase()) ||
    d.customerName.toLowerCase().includes(search.toLowerCase()) ||
    d.zoneName.toLowerCase().includes(search.toLowerCase())
  );

  if (opsDeliveryLoading && opsDeliveries.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Delivery Operations</Typography>
          <Typography variant="body2" color="text.secondary">{opsDeliveries.length} active deliveries</Typography>
        </Box>
        <Tooltip title="Refresh"><IconButton onClick={() => fetchOpsDeliveries()}><RefreshOutlined /></IconButton></Tooltip>
      </Box>

      <TextField fullWidth size="small" placeholder="Search by driver, customer or zone..." value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'In Transit', value: opsDeliveries.filter(d => d.status === 'IN_TRANSIT').length, color: 'warning.main' },
          { label: 'Delivered', value: opsDeliveries.filter(d => d.status === 'DELIVERED').length, color: 'success.main' },
          { label: 'Failed', value: opsDeliveries.filter(d => d.status === 'FAILED').length, color: 'error.main' },
          { label: 'Avg ETA', value: `${Math.round(opsDeliveries.reduce((a, d) => a + d.estimatedTime, 0) / (opsDeliveries.length || 1))} min`, color: 'info.main' },
        ].map((stat) => (
          <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
            <Card sx={{ borderLeft: 4, borderColor: stat.color, '&:hover': { transform: 'translateY(-2px)', boxShadow: 3, transition: '0.3s' } }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>City / Zone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Distance</TableCell>
              <TableCell align="right">ETA</TableCell>
              <TableCell align="right">Actual Time</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Started</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell>
                  <Link href={`/dashboard/orders/${d.orderId}`} underline="hover" color="inherit">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>#{d.orderId.slice(0, 8)}</Typography>
                  </Link>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.driverName}</Typography>
                    <Typography variant="caption" color="text.secondary">{d.vehicleType}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{d.customerName}</TableCell>
                <TableCell>{d.cityName} / {d.zoneName}</TableCell>
                <TableCell><Chip label={d.status.replace('_', ' ')} color={deliveryStatusColors[d.status] ?? 'default'} size="small" /></TableCell>
                <TableCell align="right">{d.distance} km</TableCell>
                <TableCell align="right">{d.eta ? new Date(d.eta).toLocaleTimeString() : '-'}</TableCell>
                <TableCell align="right">{d.actualTime ? `${d.actualTime} min` : '-'}</TableCell>
                <TableCell align="right">₹{d.amount}</TableCell>
                <TableCell align="right">{new Date(d.startedAt).toLocaleTimeString()}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={10} align="center"><Typography color="text.secondary">No delivery data available</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
