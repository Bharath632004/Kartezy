import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { dashboardService } from '@/lib/api';

interface DashboardStats {
  gmv: number;
  revenue: number;
  orders: number;
  customers: number;
  merchants: number;
  deliveryPartners: number;
  products: number;
  categories: number;
  inventoryValue: number;
  refunds: number;
  payments: number;
  walletBalance: number;
  supportTickets: number;
  activePromotions: number;
  fraudAlerts: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats:', err);
        setError(err?.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Dashboard Overview
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Dashboard Overview
        </Typography>
        <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Dashboard Overview
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom mb={4}>
        Dashboard Overview
      </Typography>

      {/* First Row - Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>GMV</Typography>
              <Typography variant="h3">${stats.gmv.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 12.5% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Revenue</Typography>
              <Typography variant="h3">${stats.revenue.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 8.3% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Orders</Typography>
              <Typography variant="h3">{stats.orders.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 5.2% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Customers</Typography>
              <Typography variant="h3">{stats.customers.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 3.1% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Second Row - More Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Merchants</Typography>
              <Typography variant="h3">{stats.merchants.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 2.8% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Delivery Partners</Typography>
              <Typography variant="h3">{stats.deliveryPartners.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 4.7% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Products</Typography>
              <Typography variant="h3">{stats.products.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 1.9% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Categories</Typography>
              <Typography variant="h3">{stats.categories.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 0.5% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Third Row - Operations Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Inventory Value</Typography>
              <Typography variant="h3">${stats.inventoryValue.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 0.8% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Refunds</Typography>
              <Typography variant="h3">{stats.refunds.toLocaleString()}</Typography>
              <Typography variant="body2" color="error.main">
                ▼ 2.1% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Payments</Typography>
              <Typography variant="h3">{stats.payments.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 6.3% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Wallet Balance</Typography>
              <Typography variant="h3">${stats.walletBalance.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 3.7% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fourth Row - Support & Security Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Support Tickets</Typography>
              <Typography variant="h3">{stats.supportTickets.toLocaleString()}</Typography>
              <Typography variant="body2" color="warning.main">
                ▲ 10.2% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Active Promotions</Typography>
              <Typography variant="h3">{stats.activePromotions.toLocaleString()}</Typography>
              <Typography variant="body2" color="error.main">
                ▼ 1.5% vs last month
              </Typography>
            </CardContent>
          </Card>
        </grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Fraud Alerts</Typography>
              <Typography variant="h3">{stats.fraudAlerts.toLocaleString()}</Typography>
              <Typography variant="body2" color="error.main">
                ▲ 20.5% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>System Health</Typography>
              <Typography variant="h3">99.8%</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 0.2% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}