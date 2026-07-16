import { Box, Typography, Container } from '@mui/material';

export default function DriversPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Drivers Management
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
        <Typography color="text.secondary">
          Drivers management interface would go here.
        </Typography>
      </Box>
    </Container>
  );
}