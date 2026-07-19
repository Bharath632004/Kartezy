"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, Store, TrendingUp, Verified, Warning, Visibility, Edit } from '@mui/icons-material';

const merchants = [
  { id: 1, name: 'Priya Foods', category: 'Restaurant', city: 'Mumbai', tier: 'PREMIUM', orders: 1520, revenue: 4560000, rating: 4.5, status: 'ACTIVE' },
  { id: 2, name: 'Delhi Bazaar', category: 'Grocery', city: 'Delhi', tier: 'STANDARD', orders: 890, revenue: 2340000, rating: 4.2, status: 'ACTIVE' },
  { id: 3, name: 'Spice Junction', category: 'Restaurant', city: 'Mumbai', tier: 'STANDARD', orders: 450, revenue: 1120000, rating: 4.0, status: 'PENDING' },
  { id: 4, name: 'TechMart', category: 'Electronics', city: 'Bangalore', tier: 'PREMIUM', orders: 2340, revenue: 8900000, rating: 3.8, status: 'ACTIVE' },
  { id: 5, name: 'Hyderabad Hub', category: 'Restaurant', city: 'Hyderabad', tier: 'STANDARD', orders: 650, revenue: 1680000, rating: 4.3, status: 'SUSPENDED' },
  { id: 6, name: 'FreshCart', category: 'Grocery', city: 'Chennai', tier: 'STANDARD', orders: 320, revenue: 780000, rating: 4.1, status: 'PENDING' },
];

const tierColors: Record<string, string> = {
  PREMIUM: '#7b1fa2', STANDARD: '#1976d2', BASIC: '#757575',
};

const statusColors: Record<string, string> = {
  ACTIVE: '#388e3c', PENDING: '#f57c00', SUSPENDED: '#d32f2f',
};

export default function CrmMerchantsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Merchant CRM</Typography>
          <Typography variant="body2" color="text.secondary">Manage merchant relationships, tiers, and performance</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">Onboard Merchant</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Merchants', value: '1,234', color: '#1976d2', icon: <Store /> },
          { label: 'Premium', value: '156', color: '#7b1fa2', icon: <Verified /> },
          { label: 'Active This Month', value: '892', color: '#388e3c', icon: <TrendingUp /> },
          { label: 'Pending Review', value: '28', color: '#f57c00', icon: <Warning /> },
        ].map((s) => (
          <Grid size={{ xs: 3 }} key={s.label}>
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
              <TableCell sx={{ fontWeight: 600 }}>Business</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tier</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Orders</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Revenue</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {merchants.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{m.name}</TableCell>
                <TableCell><Chip label={m.category} size="small" variant="outlined" /></TableCell>
                <TableCell>{m.city}</TableCell>
                <TableCell><Chip label={m.tier} size="small" sx={{ bgcolor: `${tierColors[m.tier]}20`, color: tierColors[m.tier], fontWeight: 600 }} /></TableCell>
                <TableCell>{m.orders.toLocaleString()}</TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>₹{(m.revenue / 100000).toFixed(2)}L</Typography></TableCell>
                <TableCell>{m.rating}</TableCell>
                <TableCell><Chip label={m.status} size="small" sx={{ bgcolor: `${statusColors[m.status]}20`, color: statusColors[m.status], fontWeight: 600 }} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  <IconButton size="small" color="info"><Edit fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
