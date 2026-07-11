import { Box, Container, Typography } from '@mui/material';

export default function PagesPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Pages Management
        </Typography>
        <Typography variant="body1">
          Create and manage static pages (About, Contact, etc.).
        </Typography>
      </Container>
    </Box>
  );
}