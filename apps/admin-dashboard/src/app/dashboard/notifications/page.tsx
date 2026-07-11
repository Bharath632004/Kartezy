import { Box, Container, Typography } from '@mui/material';

export default function NotificationsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        <Typography variant="body1">
          Notifications page content goes here.
        </Typography>
      </Container>
    </Box>
  );
}
