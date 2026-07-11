import { Box, Container, Typography } from '@mui/material';

export default function SponsoredProductsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Sponsored Products
        </Typography>
        <Typography variant="body1">
          Manage sponsored product listings and campaigns.
        </Typography>
      </Container>
    </Box>
  );
}