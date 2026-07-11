import { Box, Container, Typography } from '@mui/material';

export default function MerchantsReport() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Merchant Report
        </Typography>
        <Typography variant="body1">
          Merchant report content goes here.
        </Typography>
      </Container>
    </Box>
  );
}