import { Box, Container, Typography } from '@mui/material';

export default function PaymentsReport() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Payment Report
        </Typography>
        <Typography variant="body1">
          Payment report content goes here.
        </Typography>
      </Container>
    </Box>
  );
}