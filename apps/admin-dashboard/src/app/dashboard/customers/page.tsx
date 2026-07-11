import { Box, Container, Typography } from '@mui/material';

export default function CustomersPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Customers
        </Typography>
        <Typography variant="body1">
          Customers page content goes here.
        </Typography>
      </Container>
    </Box>
  );
}
