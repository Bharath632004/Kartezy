import { Box, Container, Typography } from '@mui/material';

export default function FunnelAnalysisPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Funnel Analysis
        </Typography>
        <Typography variant="body1">
          Analyze conversion funnels and drop-off points.
        </Typography>
      </Container>
    </Box>
  );
}