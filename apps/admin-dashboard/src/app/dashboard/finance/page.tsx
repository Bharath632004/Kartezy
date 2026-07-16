"use client";

import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { useFinanceStore } from '@/store/financeStore';
import { useEffect } from 'react';

export default function FinanceOverview() {
  const { revenueData, loading, fetchRevenueData } = useFinanceStore();

  useEffect(() => {
    fetchRevenueData({ dateRange: 'last_30_days' });
  }, [fetchRevenueData]);

  const totalRevenue = revenueData?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0;
  const totalTransactions = revenueData?.length || 0;

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>Finance Overview</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Revenue</Typography>
                <Typography variant="h5">
                  {loading ? 'Loading...' : `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Transactions</Typography>
                <Typography variant="h5">{loading ? '...' : totalTransactions}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Payouts</Typography>
                <Typography variant="h5">₹0.00</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Refunds</Typography>
                <Typography variant="h5">₹0.00</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Wallet Balance</Typography>
                <Typography variant="h5">₹0.00</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Pending Settlements</Typography>
                <Typography variant="h5">₹0.00</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}