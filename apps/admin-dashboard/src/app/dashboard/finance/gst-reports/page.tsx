import { Box, Container, Typography } from '@mui/material';

export default function GstReportsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          GST Reports
        </Typography>
        <Typography variant="body1">
          GST report generation and filing.
        </Typography>
      </Container>
    </Box>
  );
}