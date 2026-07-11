import { Box, Container, Typography } from '@mui/material';

export default function PayoutsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Payouts
        </Typography>
        <Typography variant="body1">
          Manage payouts to merchants and partners.
        </Typography>
      </Container>
    </Box>
  );
}