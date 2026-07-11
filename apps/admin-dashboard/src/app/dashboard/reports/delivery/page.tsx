import { Box, Container, Typography } from '@mui/material';

export default function DeliveryReport() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Delivery Report
        </Typography>
        <Typography variant="body1">
          Delivery report content goes here.
        </Typography>
      </Container>
    </Box>
  );
}