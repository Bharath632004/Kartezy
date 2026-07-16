"use client";

import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { useAnalyticsStore } from '@/store/analyticsStore';

export default function AnalyticsPage() {
  const { revenueTrend, ordersTrend, customerGrowth, merchantGrowth } = useAnalyticsStore();

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>Analytics Overview</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Revenue Trend</Typography>
              <Typography variant="body2" color="text.secondary">
                {revenueTrend?.length ? `${revenueTrend.length} data points available` : 'Load analytics from the API to view revenue trends'}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Orders Trend</Typography>
              <Typography variant="body2" color="text.secondary">
                {ordersTrend?.length ? `${ordersTrend.length} data points available` : 'Load analytics from the API to view order trends'}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Customer Growth</Typography>
              <Typography variant="body2" color="text.secondary">
                {customerGrowth?.length ? `${customerGrowth.length} data points available` : 'Load analytics from the API to view customer growth'}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Merchant Growth</Typography>
              <Typography variant="body2" color="text.secondary">
                {merchantGrowth?.length ? `${merchantGrowth.length} data points available` : 'Load analytics from the API to view merchant growth'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
