import { Box, Typography, Container } from '@mui/material';

export default function RolesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Roles & Permissions
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
        <Typography color="text.secondary">
          Roles and permissions management interface would go here.
        </Typography>
      </Box>
    </Container>
  );
}