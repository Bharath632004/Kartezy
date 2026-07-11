import { Box, Container, Typography } from '@mui/material';

export default function BannersPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Banners Management
        </Typography>
        <Typography variant="body1">
          Create, edit, and manage promotional banners.
        </Typography>
      </Container>
    </Box>
  );
}