import { Box, Container, Typography } from '@mui/material';

export default function TermsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Terms & Conditions
        </Typography>
        <Typography variant="body1">
          View and edit the website's terms and conditions.
        </Typography>
      </Container>
    </Box>
  );
}