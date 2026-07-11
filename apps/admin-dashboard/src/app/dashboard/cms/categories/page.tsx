import { Box, Container, Typography } from '@mui/material';

export default function CategoriesPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Categories Management
        </Typography>
        <Typography variant="body1">
          Organize products and services into categories.
        </Typography>
      </Container>
    </Box>
  );
}