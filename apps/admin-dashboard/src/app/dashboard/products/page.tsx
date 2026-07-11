import { Box, Container, Typography } from '@mui/material';

export default function ProductsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Products
        </Typography>
        <Typography variant="body1">
          Products page content goes here.
        </Typography>
      </Container>
    </Box>
  );
}
