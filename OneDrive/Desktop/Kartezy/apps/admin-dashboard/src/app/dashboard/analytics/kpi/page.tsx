import { Box, Container, Typography } from '@mui/material';

export default function KpiDashboard() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          KPI Dashboard
        </Typography>
        <Typography variant="body1">
          Key performance indicators dashboard.
        </Typography>
      </Container>
    </Box>
  );
}