"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent } from '@mui/material';
import { People, Verified, Block, Warning } from '@mui/icons-material';

const customers = [
  { id: 1, name: 'Rahul Sharma', kyc: 'VERIFIED', orders: 45, cancelled: 2, returned: 1, clv: 12500, blacklisted: false },
  { id: 2, name: 'Priya Patel', kyc: 'VERIFIED', orders: 28, cancelled: 1, returned: 0, clv: 8900, blacklisted: false },
  { id: 3, name: 'Amit Singh', kyc: 'PENDING', orders: 0, cancelled: 0, returned: 0, clv: 0, blacklisted: false },
  { id: 4, name: 'Neha Gupta', kyc: 'VERIFIED', orders: 12, cancelled: 3, returned: 2, clv: 3400, blacklisted: true },
  { id: 5, name: 'Vikram Kumar', kyc: 'VERIFIED', orders: 68, cancelled: 4, returned: 1, clv: 28500, blacklisted: false },
  { id: 6, name: 'Deepa Nair', kyc: 'PENDING', orders: 2, cancelled: 0, returned: 0, clv: 450, blacklisted: false },
];

const kycColors: Record<string, string> = {
  VERIFIED: '#388e3c', PENDING: '#f57c00', REJECTED: '#d32f2f',
};

export default function CustomerOpsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Customer Operations</Typography>
        <Typography variant="body2" color="text.secondary">Customer management, KYC verification, and compliance</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'KYC Verified', value: 4, color: '#388e3c', icon: <Verified /> },
          { label: 'KYC Pending', value: 2, color: '#f57c00', icon: <Warning /> },
          { label: 'Blacklisted', value: 1, color: '#d32f2f', icon: <Block /> },
          { label: 'Total Customers', value: 6, color: '#1976d2', icon: <People /> },
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
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>KYC Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Orders</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cancelled</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Returned</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>CLV (₹)</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                <TableCell><Chip label={c.kyc} size="small" sx={{ bgcolor: `${kycColors[c.kyc]}20`, color: kycColors[c.kyc], fontWeight: 600 }} /></TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell><Typography color={c.cancelled > 2 ? 'error' : 'inherit'} sx={{ fontWeight: c.cancelled > 2 ? 600 : 400 }}>{c.cancelled}</Typography></TableCell>
                <TableCell>{c.returned}</TableCell>
                <TableCell>₹{c.clv.toLocaleString()}</TableCell>
                <TableCell>{c.blacklisted ? <Chip label="Blacklisted" size="small" color="error" /> : <Chip label="Active" size="small" color="success" />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
