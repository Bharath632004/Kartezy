"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, LocalOffer, CheckCircle, Edit, Visibility } from '@mui/icons-material';

const coupons = [
  { id: 1, code: 'SUMMER25', type: 'PERCENTAGE', discount: 25, minOrder: 500, maxDiscount: 2000, usageLimit: 500, used: 234, validFrom: '2026-07-01', validTill: '2026-07-31', status: 'ACTIVE' },
  { id: 2, code: 'FLAT200', type: 'FLAT', discount: 200, minOrder: 1000, maxDiscount: 200, usageLimit: 1000, used: 567, validFrom: '2026-06-01', validTill: '2026-07-15', status: 'ACTIVE' },
  { id: 3, code: 'NEWUSER50', type: 'PERCENTAGE', discount: 50, minOrder: 200, maxDiscount: 500, usageLimit: 2000, used: 1245, validFrom: '2026-06-01', validTill: '2026-08-31', status: 'ACTIVE' },
  { id: 4, code: 'FREEDELIVERY', type: 'FREE_DELIVERY', discount: 0, minOrder: 300, maxDiscount: 0, usageLimit: 5000, used: 3456, validFrom: '2026-06-01', validTill: '2026-07-10', status: 'ACTIVE' },
  { id: 5, code: 'WEEKEND50', type: 'PERCENTAGE', discount: 50, minOrder: 1000, maxDiscount: 1500, usageLimit: 200, used: 200, validFrom: '2026-06-15', validTill: '2026-06-16', status: 'EXPIRED' },
  { id: 6, code: 'PREMIUM100', type: 'FLAT', discount: 1000, minOrder: 5000, maxDiscount: 1000, usageLimit: 100, used: 45, validFrom: '2026-07-01', validTill: '2026-07-31', status: 'ACTIVE' },
];

const typeColors: Record<string, string> = {
  PERCENTAGE: '#7b1fa2', FLAT: '#1976d2', FREE_DELIVERY: '#388e3c',
};

const statusColors: Record<string, string> = {
  ACTIVE: '#388e3c', EXPIRED: '#757575', DISABLED: '#d32f2f',
};

export default function CouponsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Coupons</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage discount coupons for customers</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">Create Coupon</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Coupons', value: 5, color: '#388e3c', icon: <LocalOffer /> },
          { label: 'Total Issued', value: '5,747', color: '#1976d2', icon: <CheckCircle /> },
          { label: 'Redemption Rate', value: '68.2%', color: '#7b1fa2', icon: <LocalOffer /> },
          { label: 'Revenue Impact', value: '₹12.5L', color: '#f57c00', icon: <LocalOffer /> },
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
              <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Discount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Min Order</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Usage</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Valid Till</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{c.code}</Typography></TableCell>
                <TableCell><Chip label={c.type.replace('_', ' ')} size="small" sx={{ bgcolor: `${typeColors[c.type]}20`, color: typeColors[c.type], fontWeight: 600 }} /></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{c.type === 'PERCENTAGE' ? `${c.discount}%` : c.type === 'FLAT' ? `₹${c.discount}` : 'Free Delivery'}</TableCell>
                <TableCell>₹{c.minOrder}</TableCell>
                <TableCell><Typography variant="body2">{c.used.toLocaleString()} / {c.usageLimit.toLocaleString()}</Typography></TableCell>
                <TableCell><Typography variant="caption">{c.validTill}</Typography></TableCell>
                <TableCell><Chip label={c.status} size="small" sx={{ bgcolor: `${statusColors[c.status]}20`, color: statusColors[c.status], fontWeight: 600 }} /></TableCell>
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
