import { Box, Container, Typography, Card, CardContent, Grid, CircularProgress, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { analyticsService } from '@/lib/api';

export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsService.getSalesAnalytics({ period: 'monthly' });
        setSalesData(response.data || []);
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Analytics Dashboard
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
          Analytics Dashboard
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom mb={4}>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Monthly Sales" />
            <CardContent sx={{ height: 300 }}>
              {/* Note: For a real implementation, you would use a charting library like Recharts or Chart.js */}
              <Typography variant="body2" textAlign="center" sx={{ mt: 4 }}>
                Sales chart would be displayed here
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Key Metrics" />
            <CardContent>
              <Typography variant="h5" gutterBottom>Total Revenue</Typography>
              <Typography variant="h3">$125,430</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 12.5% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Conversion Rate" />
            <CardContent>
              <Typography variant="h5" gutterBottom>Conversion Rate</Typography>
              <Typography variant="h3">3.2%</Typography>
              <Typography variant="body2" color="success.main">
                ▲ 0.8% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}