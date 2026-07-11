import { Box, Container, Typography } from '@mui/material';

export default function EmailCampaignsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Email Campaigns
        </Typography>
        <Typography variant="body1">
          Create and manage email marketing campaigns.
        </Typography>
      </Container>
    </Box>
  );
}