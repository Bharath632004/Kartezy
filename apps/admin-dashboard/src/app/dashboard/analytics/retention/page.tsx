import { Box, Container, Typography } from '@mui/material';

export default function RetentionPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Retention Analysis
        </Typography>
        <Typography variant="body1">
          Analyze user retention and churn rates.
        </Typography>
      </Container>
    </Box>
  );
}