import { Box, Container, Typography } from '@mui/material';

export default function AnalyticsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Analytics
        </Typography>
        <Typography variant="body1">
          Analytics page content goes here.
        </Typography>
      </Container>
    </Box>
  );
}
