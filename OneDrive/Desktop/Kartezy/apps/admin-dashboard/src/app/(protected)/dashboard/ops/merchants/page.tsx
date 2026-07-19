"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent } from '@mui/material';
import { Store, Verified, Warning, Block, PendingActions } from '@mui/icons-material';

const merchants = [
  { id: 1, name: 'Priya Foods', type: 'Restaurant', city: 'Mumbai', status: 'VERIFIED', orders: 1520, sla: 98.5, rating: 4.5 },
  { id: 2, name: 'Delhi Bazaar', type: 'Grocery', city: 'Delhi', status: 'VERIFIED', orders: 890, sla: 96.2, rating: 4.2 },
  { id: 3, name: 'Spice Junction', type: 'Restaurant', city: 'Mumbai', status: 'PENDING_VERIFICATION', orders: 0, sla: 0, rating: 0 },
  { id: 4, name: 'TechMart', type: 'Electronics', city: 'Bangalore', status: 'SUSPENDED', orders: 2340, sla: 82.1, rating: 3.8 },
  { id: 5, name: 'Hyderabad Hub', type: 'Restaurant', city: 'Hyderabad', status: 'VERIFIED', orders: 650, sla: 97.0, rating: 4.3 },
  { id: 6, name: 'FreshCart', type: 'Grocery', city: 'Chennai', status: 'PENDING_VERIFICATION', orders: 0, sla: 0, rating: 0 },
];

const statusColors: Record<string, string> = {
  VERIFIED: '#388e3c', PENDING_VERIFICATION: '#f57c00', SUSPENDED: '#d32f2f', REJECTED: '#757575',
};

export default function MerchantOpsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Merchant Operations</Typography>
        <Typography variant="body2" color="text.secondary">Manage merchant verification, performance, and compliance</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Verified', value: 3, color: '#388e3c', icon: <Verified /> },
          { label: 'Pending Verification', value: 2, color: '#f57c00', icon: <PendingActions /> },
          { label: 'Suspended', value: 1, color: '#d32f2f', icon: <Block /> },
          { label: 'Total Active', value: 3, color: '#1976d2', icon: <Store /> },
        ].map((s) => (
          <Grid item xs={3} key={s.label}>
            <Card><CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              </Box>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Business Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total Orders</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>SLA Rate</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Verification</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {merchants.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{m.name}</TableCell>
                <TableCell><Chip label={m.type} size="small" variant="outlined" /></TableCell>
                <TableCell>{m.city}</TableCell>
                <TableCell>{m.orders.toLocaleString()}</TableCell>
                <TableCell>{m.sla > 0 ? `${m.sla}%` : '-'}</TableCell>
                <TableCell>{m.rating > 0 ? m.rating : '-'}</TableCell>
                <TableCell><Chip label={m.status.replace('_', ' ')} size="small" sx={{ bgcolor: `${statusColors[m.status]}20`, color: statusColors[m.status], fontWeight: 600 }} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
