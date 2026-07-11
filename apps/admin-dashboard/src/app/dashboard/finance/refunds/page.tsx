import { Box, Container, Typography } from '@mui/material';

export default function RefundsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Refunds
        </Typography>
        <Typography variant="body1">
          Refund processing and management.
        </Typography>
      </Container>
    </Box>
  );
}