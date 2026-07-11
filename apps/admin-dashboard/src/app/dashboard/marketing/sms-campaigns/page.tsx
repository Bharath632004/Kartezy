import { Box, Container, Typography } from '@mui/material';

export default function SmsCampaignsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          SMS Campaigns
        </Typography>
        <Typography variant="body1">
          Create and manage SMS marketing campaigns.
        </Typography>
      </Container>
    </Box>
  );
}