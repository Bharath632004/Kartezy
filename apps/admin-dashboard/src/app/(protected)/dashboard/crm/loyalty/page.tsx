"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, LinearProgress, IconButton } from '@mui/material';
import { EmojiEvents, Star, TrendingUp, PeopleAlt, Visibility, Edit } from '@mui/icons-material';

const programs = [
  { id: 1, name: 'Silver Tier', minPoints: 0, pointsPerRs: 1, benefits: 'Free delivery, Birthday reward', activeMembers: 1245, color: '#757575' },
  { id: 2, name: 'Gold Tier', minPoints: 1000, pointsPerRs: 1.5, benefits: '5% cashback, Priority support', activeMembers: 567, color: '#f57c00' },
  { id: 3, name: 'Platinum Tier', minPoints: 5000, pointsPerRs: 2, benefits: '10% cashback, Free priority delivery, Exclusive offers', activeMembers: 234, color: '#7b1fa2' },
  { id: 4, name: 'Diamond Tier', minPoints: 15000, pointsPerRs: 3, benefits: '15% cashback, Dedicated manager, Early access', activeMembers: 89, color: '#1976d2' },
];

const transactions = [
  { id: 1, customer: 'Rahul Sharma', type: 'EARNED', points: 250, balance: 12500, description: 'Order #ORD-1201', date: '2026-07-01' },
  { id: 2, customer: 'Priya Patel', type: 'REDEEMED', points: -500, balance: 3400, description: '₹500 discount on order', date: '2026-06-30' },
  { id: 3, customer: 'Vikram Kumar', type: 'EARNED', points: 150, balance: 8500, description: 'Order #ORD-1203', date: '2026-06-29' },
  { id: 4, customer: 'Neha Gupta', type: 'BONUS', points: 1000, balance: 2800, description: 'Birthday bonus', date: '2026-06-28' },
  { id: 5, customer: 'Amit Singh', type: 'EXPIRED', points: -200, balance: 600, description: 'Points expired - 90 days', date: '2026-06-25' },
  { id: 6, customer: 'Sneha R.', type: 'EARNED', points: 300, balance: 6200, description: 'Order #ORD-1206', date: '2026-06-24' },
];

const typeColors: Record<string, string> = {
  EARNED: '#388e3c', REDEEMED: '#d32f2f', BONUS: '#1976d2', EXPIRED: '#757575',
};

export default function LoyaltyPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Loyalty Engine</Typography>
          <Typography variant="body2" color="text.secondary">Manage loyalty programs, tiers, and point transactions</Typography>
        </Box>
        <Button startIcon={<EmojiEvents />} variant="contained">Create Program</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Members', value: '2,135', color: '#1976d2', icon: <PeopleAlt /> },
          { label: 'Points Issued (MTD)', value: '45,000', color: '#388e3c', icon: <Star /> },
          { label: 'Points Redeemed', value: '12,500', color: '#f57c00', icon: <TrendingUp /> },
          { label: 'Redemption Rate', value: '27.8%', color: '#7b1fa2', icon: <EmojiEvents /> },
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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {programs.map((p) => (
          <Grid size={{ xs: 6, md: 3 }} key={p.id}>
            <Card sx={{ borderTop: 4, borderColor: p.color, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>{p.minPoints.toLocaleString()} points minimum</Typography>
                <Typography variant="body2"><strong>{p.pointsPerRs}x</strong> points per ₹</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>{p.benefits}</Typography>
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption">{p.activeMembers} members</Typography>
                  <LinearProgress variant="determinate" value={Math.min(100, (p.activeMembers / 1245) * 100)} sx={{ mt: 0.5, height: 6, borderRadius: 3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Recent Transactions</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Points</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{t.customer}</TableCell>
                <TableCell><Chip label={t.type} size="small" sx={{ bgcolor: `${typeColors[t.type]}20`, color: typeColors[t.type], fontWeight: 600 }} /></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: t.points > 0 ? 'success.main' : 'error.main' }}>{t.points > 0 ? '+' : ''}{t.points.toLocaleString()}</Typography></TableCell>
                <TableCell>{t.balance.toLocaleString()}</TableCell>
                <TableCell><Typography variant="caption">{t.description}</Typography></TableCell>
                <TableCell>{t.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
