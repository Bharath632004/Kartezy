"use client";

import { Box, Card, CardContent, Typography, Container, Skeleton } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const {
    fetchStats,
    gmv,
    revenue,
    totalOrders,
    activeOrders,
    customers,
    merchants,
    deliveryPartners,
    products,
    categories,
    inventoryAlerts,
    refundRequests,
    supportTickets,
    walletBalance,
    activePromotions,
    todaySales,
    monthlyRevenue,
    loading: dashboardLoading
  } = useDashboardStore();
  const { revenueTrend, ordersTrend, loading: analyticsLoading } = useAnalyticsStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchStats();
        // Fetch some analytics data for the charts
        await useAnalyticsStore.getState().fetchRevenueTrend('month');
        await useAnalyticsStore.getState().fetchOrdersTrend('month');
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchData();
  }, [fetchStats]);

  if (dashboardLoading || analyticsLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard Overview
          </Typography>
          <Grid2 container spacing={3}>
            {/* Skeletons for the 16 metric cards */}
            {Array.from({ length: 16 }).map((_, index) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Skeleton variant="rectangle" width={100} height={16} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangle" width={80} height={24} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              Trends
            </Typography>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Revenue Trend
                  </Typography>
                  <Skeleton variant="rectangle" width={300} height={200} sx={{ display: 'block', margin: '0 auto' }} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Orders Trend
                  </Typography>
                  <Skeleton variant="rectangle" width={300} height={200} sx={{ display: 'block', margin: '0 auto' }} />
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <Grid2 container spacing={3}>
          {/* GMV */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Gross Merchandise Value (GMV)
                </Typography>
                <Typography variant="h4">
                  {gmv !== null ? `$${gmv.toLocaleString()}` : '$0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Revenue */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Revenue
                </Typography>
                <Typography variant="h4">
                  {revenue !== null ? `$${revenue.toLocaleString()}` : '$0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Total Orders */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
                <Typography variant="h4">
                  {totalOrders !== null ? totalOrders.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Active Orders */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Active Orders
                </Typography>
                <Typography variant="h4">
                  {activeOrders !== null ? activeOrders.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Customers */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Customers
                </Typography>
                <Typography variant="h4">
                  {customers !== null ? customers.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Merchants */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Merchants
                </Typography>
                <Typography variant="h4">
                  {merchants !== null ? merchants.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Delivery Partners */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Delivery Partners
                </Typography>
                <Typography variant="h4">
                  {deliveryPartners !== null ? deliveryPartners.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Products */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Products
                </Typography>
                <Typography variant="h4">
                  {products !== null ? products.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Categories
                </Typography>
                <Typography variant="h4">
                  {categories !== null ? categories.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Inventory Alerts */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Inventory Alerts
                </Typography>
                <Typography variant="h4">
                  {inventoryAlerts !== null ? inventoryAlerts.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Refund Requests */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Refund Requests
                </Typography>
                <Typography variant="h4">
                  {refundRequests !== null ? refundRequests.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Support Tickets */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Support Tickets
                </Typography>
                <Typography variant="h4">
                  {supportTickets !== null ? supportTickets.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Wallet Balance */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Wallet Balance
                </Typography>
                <Typography variant="h4">
                  {walletBalance !== null ? walletBalance.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Active Promotions */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Active Promotions
                </Typography>
                <Typography variant="h4">
                  {activePromotions !== null ? activePromotions.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Today's Sales */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Today&apos;s Sales
                </Typography>
                <Typography variant="h4">
                  {todaySales !== null ? todaySales.toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Monthly Revenue */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Monthly Revenue
                </Typography>
                <Typography variant="h4">
                  {monthlyRevenue !== null ? `$${monthlyRevenue.toLocaleString()}` : '$0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Trends
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Revenue Trend
                </Typography>
                {revenueTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={revenueTrend}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    Loading revenue trend...
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Orders Trend
                </Typography>
                {ordersTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={ordersTrend}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    Loading orders trend...
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}