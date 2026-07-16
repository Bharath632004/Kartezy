import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import Link from 'next/link';

export default function MarketingOverview() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Marketing Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Active Campaigns
                </Typography>
                <Typography variant="h5">
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Coupons Issued
                </Typography>
                <Typography variant="h5">
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Referral Signups
                </Typography>
                <Typography variant="h5">
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Loyalty Members
                </Typography>
                <Typography variant="h5">
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Email Sent Today
                </Typography>
                <Typography variant="h5">
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  SMS Sent Today
                </Typography>
                <Typography variant="h5">
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}