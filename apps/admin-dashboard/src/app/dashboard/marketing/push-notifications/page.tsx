import { Box, Container, Typography } from '@mui/material';

export default function PushNotificationsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Push Notifications
        </Typography>
        <Typography variant="body1">
          Manage and send push notifications to users.
        </Typography>
      </Container>
    </Box>
  );
}