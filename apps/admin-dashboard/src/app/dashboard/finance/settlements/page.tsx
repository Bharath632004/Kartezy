import { Box, Container, Typography } from '@mui/material';

export default function SettlementsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Settlements
        </Typography>
        <Typography variant="body1">
          Settlement management and reports.
        </Typography>
      </Container>
    </Box>
  );
}