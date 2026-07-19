"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Share, EmojiEvents, PeopleAlt, TrendingUp, Visibility, CheckCircle } from '@mui/icons-material';

const referrals = [
  { id: 1, referrer: 'Rahul Sharma', referee: 'Amit Singh', code: 'RAHUL10', status: 'CONVERTED', rewardType: 'WALLET_CREDIT', rewardValue: 100, referredAt: '2026-06-15', convertedAt: '2026-06-20' },
  { id: 2, referrer: 'Priya Patel', referee: 'Sneha Gupta', code: 'PRIYA20', status: 'PENDING', rewardType: 'DISCOUNT_COUPON', rewardValue: 50, referredAt: '2026-06-28', convertedAt: null },
  { id: 3, referrer: 'Vikram Kumar', referee: 'Arun Nair', code: 'VIKRAM5', status: 'CONVERTED', rewardType: 'WALLET_CREDIT', rewardValue: 200, referredAt: '2026-06-10', convertedAt: '2026-06-18' },
  { id: 4, referrer: 'Neha Gupta', referee: 'Deepak Verma', code: 'NEHA15', status: 'EXPIRED', rewardType: 'DISCOUNT_COUPON', rewardValue: 75, referredAt: '2026-05-01', convertedAt: null },
  { id: 5, referrer: 'Amit Singh', referee: 'Kiran Joshi', code: 'AMIT25', status: 'CONVERTED', rewardType: 'WALLET_CREDIT', rewardValue: 150, referredAt: '2026-06-22', convertedAt: '2026-06-28' },
  { id: 6, referrer: 'Sneha R.', referee: 'Meera Iyer', code: 'SNEHA10', status: 'PENDING', rewardType: 'DISCOUNT_COUPON', rewardValue: 50, referredAt: '2026-07-01', convertedAt: null },
];

const statusColors: Record<string, string> = {
  PENDING: '#f57c00', CONVERTED: '#388e3c', EXPIRED: '#757575', CANCELLED: '#d32f2f',
};

const rewardColors: Record<string, string> = {
  WALLET_CREDIT: '#1976d2', DISCOUNT_COUPON: '#7b1fa2', GIFT_CARD: '#388e3c',
};

export default function ReferralsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Referral Engine</Typography>
          <Typography variant="body2" color="text.secondary">Track referrals, rewards, and conversion performance</Typography>
        </Box>
        <Button startIcon={<Share />} variant="contained">Create Referral Campaign</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Referrals', value: '234', color: '#1976d2', icon: <Share /> },
          { label: 'Converted', value: '156', color: '#388e3c', icon: <CheckCircle /> },
          { label: 'Pending', value: '42', color: '#f57c00', icon: <PeopleAlt /> },
          { label: 'Conversion Rate', value: '66.7%', color: '#7b1fa2', icon: <TrendingUp /> },
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
              <TableCell sx={{ fontWeight: 600 }}>Referrer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Referee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reward Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reward Value</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Referred At</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Converted At</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referrals.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{r.referrer}</TableCell>
                <TableCell>{r.referee}</TableCell>
                <TableCell><Chip label={r.code} size="small" variant="outlined" /></TableCell>
                <TableCell><Chip label={r.rewardType.replace('_', ' ')} size="small" sx={{ bgcolor: `${rewardColors[r.rewardType]}20`, color: rewardColors[r.rewardType], fontWeight: 600 }} /></TableCell>
                <TableCell>₹{r.rewardValue}</TableCell>
                <TableCell>{r.referredAt}</TableCell>
                <TableCell>{r.convertedAt || '-'}</TableCell>
                <TableCell><Chip label={r.status} size="small" sx={{ bgcolor: `${statusColors[r.status]}20`, color: statusColors[r.status], fontWeight: 600 }} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
