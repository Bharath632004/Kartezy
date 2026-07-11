import { Box, Container, Typography } from '@mui/material';

export default function ReferralCampaignsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Referral Programs
        </Typography>
        <Typography variant="body1">
          Manage referral programs and track conversions.
        </Typography>
      </Container>
    </Box>
  );
}