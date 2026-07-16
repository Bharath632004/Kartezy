import { Box, Container, Typography, Grid, Paper } from '@mui/material';

export default function KpiDashboard() {
  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>KPI Dashboard</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Avg Order Value</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>₹--</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Customer Lifetime Value</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>₹--</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Customer Acquisition Cost</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>₹--</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Repeat Purchase Rate</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>--%</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}