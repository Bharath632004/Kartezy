import { Box, Typography, Container } from '@mui/material';

export default function OrdersPage() {
  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h3" gutterBottom>
        Orders Management
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
        <Typography color="text.secondary">
          Orders management interface would go here.
        </Typography>
      </Box>
    </Container>
  );
}