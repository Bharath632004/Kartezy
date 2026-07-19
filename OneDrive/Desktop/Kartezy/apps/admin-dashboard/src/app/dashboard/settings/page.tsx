import { Box, Container, Typography } from '@mui/material';

export default function SettingsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1">
          Settings page content goes here.
        </Typography>
      </Container>
    </Box>
  );
}
