import { Box, Container, Typography } from '@mui/material';

export default function TaxesPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Taxes
        </Typography>
        <Typography variant="body1">
          Tax management and reporting.
        </Typography>
      </Container>
    </Box>
  );
}