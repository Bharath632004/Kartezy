import { Box, Container, Typography } from '@mui/material';

export default function RevenuePage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Revenue
        </Typography>
        <Typography variant="body1">
          Revenue management and reporting.
        </Typography>
      </Container>
    </Box>
  );
}