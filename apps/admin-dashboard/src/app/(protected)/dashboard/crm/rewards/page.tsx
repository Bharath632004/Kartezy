"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, CardGiftcard, EmojiEvents, CheckCircle, Visibility, Edit } from '@mui/icons-material';

const rewards = [
  { id: 1, name: '₹50 Cashback', pointsRequired: 500, category: 'CASHBACK', stock: 1000, claimed: 456, validTill: '2026-12-31', status: 'ACTIVE' },
  { id: 2, name: 'Free Delivery Coupon', pointsRequired: 200, category: 'DELIVERY', stock: 5000, claimed: 2340, validTill: '2026-12-31', status: 'ACTIVE' },
  { id: 3, name: '₹200 Gift Card', pointsRequired: 2000, category: 'GIFT_CARD', stock: 500, claimed: 167, validTill: '2026-12-31', status: 'ACTIVE' },
  { id: 4, name: 'Premium Membership', pointsRequired: 5000, category: 'MEMBERSHIP', stock: 100, claimed: 34, validTill: '2026-12-31', status: 'ACTIVE' },
  { id: 5, name: 'Weekend 20% Off Coupon', pointsRequired: 300, category: 'DISCOUNT', stock: 0, claimed: 500, validTill: '2026-06-30', status: 'EXPIRED' },
  { id: 6, name: 'Exclusive Webinar Access', pointsRequired: 1000, category: 'EXPERIENCE', stock: 50, claimed: 12, validTill: '2026-09-30', status: 'ACTIVE' },
];

const categoryColors: Record<string, string> = {
  CASHBACK: '#388e3c', DELIVERY: '#1976d2', GIFT_CARD: '#7b1fa2', MEMBERSHIP: '#f57c00', DISCOUNT: '#00838f', EXPERIENCE: '#4e342e',
};

const statusColors: Record<string, string> = {
  ACTIVE: '#388e3c', EXPIRED: '#757575', DISABLED: '#d32f2f',
};

export default function RewardsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Rewards Catalog</Typography>
          <Typography variant="body2" color="text.secondary">Manage rewards and redemption options for loyalty program</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">Add Reward</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Rewards', value: 5, color: '#388e3c', icon: <CardGiftcard /> },
          { label: 'Total Claimed', value: '3,509', color: '#1976d2', icon: <CheckCircle /> },
          { label: 'Redemption Rate', value: '62.4%', color: '#7b1fa2', icon: <EmojiEvents /> },
          { label: 'Points in Circulation', value: '2,45,000', color: '#f57c00', icon: <EmojiEvents /> },
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
              <TableCell sx={{ fontWeight: 600 }}>Reward Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Points Required</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Claimed</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Valid Till</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rewards.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>
                <TableCell><Chip label={r.category.replace('_', ' ')} size="small" sx={{ bgcolor: `${categoryColors[r.category]}20`, color: categoryColors[r.category], fontWeight: 600 }} /></TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{r.pointsRequired.toLocaleString()}</TableCell>
                <TableCell>{r.stock.toLocaleString()}</TableCell>
                <TableCell>{r.claimed.toLocaleString()}</TableCell>
                <TableCell><Typography variant="caption">{r.validTill}</Typography></TableCell>
                <TableCell><Chip label={r.status} size="small" sx={{ bgcolor: `${statusColors[r.status]}20`, color: statusColors[r.status], fontWeight: 600 }} /></TableCell>
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
