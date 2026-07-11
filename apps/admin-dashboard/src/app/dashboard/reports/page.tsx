import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import Link from 'next/link';

export default function ReportsOverview() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Reports Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Revenue Reports
                </Typography>
                <Typography variant="body1">
                  Track revenue trends and forecasts.
                </Typography>
                <Button size="small" variant="contained" href="/dashboard/reports/revenue">
                  View Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Sales Reports
                </Typography>
                <Typography variant="body1">
                  Monitor sales performance and product movement.
                </Typography>
                <Button size="small" variant="contained" href="/dashboard/reports/sales">
                  View Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Merchant Reports
                </Typography>
                <Typography variant="body1">
                  Analyze merchant performance and activity.
                </Typography>
                <Button size="small" variant="contained" href="/dashboard/reports/merchants">
                  View Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Customer Reports
                </Typography>
                <Typography variant="body1">
                  Understand customer behavior and demographics.
                </Typography>
                <Button size="small" variant="contained" href="/dashboard/reports/customers">
                  View Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Delivery Reports
                </Typography>
                <Typography variant="body1">
                  Track delivery performance and times.
                </Typography>
                <Button size="small" variant="contained" href="/dashboard/reports/delivery">
                  View Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Inventory Reports
                </Typography>
                <Typography variant="body1">
                  Monitor stock levels and turnover.
                </Typography>
                <Button size="small" variant="contained" href="/dashboard/reports/inventory">
                  View Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Payment Reports
                </Typography>
                <Typography variant="body1">
                  Track transactions, refunds, and fees.
                </Typography>
                <Button size="small" variant="contained" href="/dashboard/reports/payments">
                  View Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Export Reports
                </Typography>
                <Typography variant="body1">
                  Export data in PDF, Excel, or CSV format.
                </Typography>
                <Button size="small" variant="contained" href="/dashboard/reports/export">
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Scheduled Reports
                </Typography>
                <Typography variant="body1">
                  Set up automated report delivery.
                </Typography>
                <Button size="small" variant="contained" href="/dashboard/reports/schedule">
                  Schedule Reports
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}