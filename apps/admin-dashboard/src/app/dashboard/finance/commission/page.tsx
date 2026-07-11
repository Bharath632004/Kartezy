import { Box, Container, Typography } from '@mui/material';

export default function CommissionPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Commission
        </Typography>
        <Typography variant="body1">
          Commission management and payouts.
        </Typography>
      </Container>
    </Box>
  );
}