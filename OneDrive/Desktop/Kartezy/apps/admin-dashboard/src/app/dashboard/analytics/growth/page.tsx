import { Box, Container, Typography } from '@mui/material';

export default function GrowthMetricsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Growth Metrics
        </Typography>
        <Typography variant="body1">
          Track user acquisition, activation, retention, and revenue growth.
        </Typography>
      </Container>
    </Box>
  );
}