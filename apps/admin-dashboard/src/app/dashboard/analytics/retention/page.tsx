import { Box, Container, Typography, Grid, Paper } from '@mui/material';

export default function RetentionPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>Retention Analysis</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Cohort Retention</Typography>
              <Typography variant="body2" color="text.secondary">
                Weekly cohort retention data will appear here after the analytics pipeline processes user activity.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Churn Rate</Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly churn rate trends will be calculated from active user data.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}