import { Box, Container, Typography } from '@mui/material';

export default function CustomersReport() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Customer Report
        </Typography>
        <Typography variant="body1">
          Customer report content goes here.
        </Typography>
      </Container>
    </Box>
  );
}