import { Box, Container, Typography } from '@mui/material';

export default function InventoryReport() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Inventory Report
        </Typography>
        <Typography variant="body1">
          Inventory report content goes here.
        </Typography>
      </Container>
    </Box>
  );
}