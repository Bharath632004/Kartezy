import { Box, Container, Typography } from '@mui/material';

export default function CouponsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Coupons Management
        </Typography>
        <Typography variant="body1">
          Create, manage, and track coupons and promo codes.
        </Typography>
      </Container>
    </Box>
  );
}