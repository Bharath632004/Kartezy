"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton, Avatar } from '@mui/material';
import { Add, PeopleAlt, Email, Phone, Edit, Visibility } from '@mui/icons-material';

const customers = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91-9876543210', segment: 'HIGH_VALUE', orders: 45, spent: 125000, lastOrder: '2026-07-01', status: 'ACTIVE' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '+91-9876543211', segment: 'ACTIVE', orders: 28, spent: 68000, lastOrder: '2026-06-30', status: 'ACTIVE' },
  { id: 3, name: 'Amit Singh', email: 'amit@example.com', phone: '+91-9876543212', segment: 'NEW', orders: 3, spent: 4500, lastOrder: '2026-06-28', status: 'ACTIVE' },
  { id: 4, name: 'Neha Gupta', email: 'neha@example.com', phone: '+91-9876543213', segment: 'AT_RISK', orders: 12, spent: 34000, lastOrder: '2026-06-15', status: 'AT_RISK' },
  { id: 5, name: 'Vikram Kumar', email: 'vikram@example.com', phone: '+91-9876543214', segment: 'HIGH_VALUE', orders: 68, spent: 285000, lastOrder: '2026-07-01', status: 'ACTIVE' },
  { id: 6, name: 'Deepa Nair', email: 'deepa@example.com', phone: '+91-9876543215', segment: 'CHURNED', orders: 8, spent: 12000, lastOrder: '2026-05-20', status: 'CHURNED' },
];

const segmentColors: Record<string, string> = {
  HIGH_VALUE: '#7b1fa2', ACTIVE: '#1976d2', NEW: '#388e3c', AT_RISK: '#f57c00', CHURNED: '#d32f2f',
};

const statusColors: Record<string, string> = {
  ACTIVE: '#388e3c', AT_RISK: '#f57c00', CHURNED: '#d32f2f',
};

export default function CrmCustomersPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Customer CRM</Typography>
          <Typography variant="body2" color="text.secondary">Manage customer profiles, segments, and relationships</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Add />} variant="contained">Add Customer</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Customers', value: '2,458', color: '#1976d2', icon: <PeopleAlt /> },
          { label: 'High Value', value: '345', color: '#7b1fa2', icon: <PeopleAlt /> },
          { label: 'At Risk', value: '128', color: '#f57c00', icon: <PeopleAlt /> },
          { label: 'Churned (MTD)', value: '42', color: '#d32f2f', icon: <PeopleAlt /> },
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
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Segment</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Orders</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total Spent</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Last Order</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#1976d2', fontSize: 14 }}>{c.name.charAt(0)}</Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption">{c.email}</Typography>
                    <Typography variant="caption" color="text.secondary">{c.phone}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Chip label={c.segment.replace('_', ' ')} size="small" sx={{ bgcolor: `${segmentColors[c.segment]}20`, color: segmentColors[c.segment], fontWeight: 600, fontSize: 11 }} /></TableCell>
                <TableCell><Typography sx={{ fontWeight: 600 }}>{c.orders}</Typography></TableCell>
                <TableCell><Typography sx={{ fontWeight: 600 }}>₹{c.spent.toLocaleString()}</Typography></TableCell>
                <TableCell><Typography variant="caption">{c.lastOrder}</Typography></TableCell>
                <TableCell><Chip label={c.status} size="small" color={c.status === 'ACTIVE' ? 'success' : c.status === 'AT_RISK' ? 'warning' : 'default'} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  <IconButton size="small" color="info"><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" color="success"><Email fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
