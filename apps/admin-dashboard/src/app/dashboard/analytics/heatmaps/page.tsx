import { Box, Container, Typography } from '@mui/material';

export default function HeatmapsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Heat Maps
        </Typography>
        <Typography variant="body1">
          Visualize user interactions and activity heatmaps.
        </Typography>
      </Container>
    </Box>
  );
}