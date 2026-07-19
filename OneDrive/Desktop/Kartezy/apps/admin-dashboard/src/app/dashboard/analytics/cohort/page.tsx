import { Box, Container, Typography } from '@mui/material';

export default function CohortAnalysisPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Cohort Analysis
        </Typography>
        <Typography variant="body1">
          Analyze user behavior by cohorts.
        </Typography>
      </Container>
    </Box>
  );
}