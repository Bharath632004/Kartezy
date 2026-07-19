"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton, LinearProgress } from '@mui/material';
import { Add, GroupWork, PeopleAlt, TrendingUp, Visibility, Edit } from '@mui/icons-material';

const segments = [
  { id: 1, name: 'High Value Customers', criteria: 'Spent > ₹50,000', count: 1245, avgOrders: 45, avgSpent: 125000, conversionRate: 68.5, color: '#7b1fa2' },
  { id: 2, name: 'Recently Active', criteria: 'Ordered in last 7 days', count: 3450, avgOrders: 12, avgSpent: 28000, conversionRate: 82.0, color: '#1976d2' },
  { id: 3, name: 'At Risk Churn', criteria: 'Inactive > 30 days, previously active', count: 892, avgOrders: 18, avgSpent: 42000, conversionRate: 12.5, color: '#f57c00' },
  { id: 4, name: 'New Users (First Order)', criteria: 'First order in last 30 days', count: 2345, avgOrders: 1, avgSpent: 4500, conversionRate: 45.0, color: '#388e3c' },
  { id: 5, name: 'Premium Tier', criteria: 'Loyalty Tier = Platinum/Diamond', count: 323, avgOrders: 68, avgSpent: 285000, conversionRate: 92.0, color: '#d32f2f' },
  { id: 6, name: 'Cart Abandoners', criteria: 'Added to cart but no order in 24h', count: 567, avgOrders: 0, avgSpent: 0, conversionRate: 8.2, color: '#00838f' },
  { id: 7, name: 'Referral Champions', criteria: 'Referred > 5 customers', count: 128, avgOrders: 52, avgSpent: 175000, conversionRate: 95.0, color: '#4e342e' },
  { id: 8, name: 'Weekend Shoppers', criteria: 'Orders placed on Sat/Sun in last 90d', count: 1890, avgOrders: 22, avgSpent: 55000, conversionRate: 76.0, color: '#e65100' },
];

export default function SegmentsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Customer Segmentation</Typography>
          <Typography variant="body2" color="text.secondary">Define and manage customer segments for targeted marketing</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">Create Segment</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Segments', value: 8, color: '#1976d2', icon: <GroupWork /> },
          { label: 'Total Reachable', value: '10,840', color: '#388e3c', icon: <PeopleAlt /> },
          { label: 'Avg Conversion', value: '59.9%', color: '#7b1fa2', icon: <TrendingUp /> },
          { label: 'Auto-Sync Rules', value: 4, color: '#f57c00', icon: <GroupWork /> },
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

      <Grid container spacing={2}>
        {segments.map((seg) => (
          <Grid item xs={12} md={6} key={seg.id}>
            <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }, borderLeft: 4, borderColor: seg.color }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{seg.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{seg.criteria}</Typography>
                  </Box>
                  <Chip label={`${seg.count.toLocaleString()} users`} size="small" sx={{ bgcolor: `${seg.color}20`, color: seg.color, fontWeight: 600 }} />
                </Box>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Avg Orders</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{seg.avgOrders}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Avg Spent</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{seg.avgSpent.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Conv. Rate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: seg.conversionRate > 50 ? 'success.main' : 'warning.main' }}>{seg.conversionRate}%</Typography>
                  </Grid>
                </Grid>
                <LinearProgress variant="determinate" value={seg.conversionRate} sx={{ mt: 1.5, height: 6, borderRadius: 3, bgcolor: `${seg.color}20`, '& .MuiLinearProgress-bar': { bgcolor: seg.color } }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
