import { Box, Container, Typography } from '@mui/material';

export default function CampaignsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Marketing Campaigns
        </Typography>
        <Typography variant="body1">
          Create and manage marketing campaigns across channels.
        </Typography>
      </Container>
    </Box>
  );
}