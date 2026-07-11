import { Box, Container, Typography } from '@mui/material';

export default function LoyaltyCampaignsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Loyalty Programs
        </Typography>
        <Typography variant="body1">
          Manage loyalty programs and rewards.
        </Typography>
      </Container>
    </Box>
  );
}