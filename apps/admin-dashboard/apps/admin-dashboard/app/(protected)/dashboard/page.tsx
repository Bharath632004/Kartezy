import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';

export default function DashboardPage() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom mb={4}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>GMV</Typography>
              <Typography variant="h4">$1,250,000</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Revenue</Typography>
              <Typography variant="h4">$250,000</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Orders</Typography>
              <Typography variant="h4">1,250</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Customers</Typography>
              <Typography variant="h4">8,500</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
