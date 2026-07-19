import { Box, Container, Typography } from '@mui/material';

export default function PrivacyPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1">
          View and edit the website's privacy policy.
        </Typography>
      </Container>
    </Box>
  );
}