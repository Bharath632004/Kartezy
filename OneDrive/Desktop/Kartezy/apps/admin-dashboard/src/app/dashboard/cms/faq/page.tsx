import { Box, Container, Typography } from '@mui/material';

export default function FaqPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          FAQ Management
        </Typography>
        <Typography variant="body1">
          Create and manage frequently asked questions.
        </Typography>
      </Container>
    </Box>
  );
}