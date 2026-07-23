import { Box, Container, Stack, Typography, Chip, Button } from '@mui/material';
import { Place } from '@mui/icons-material';

export default function CitiesSection({ data }: { data?: any } = {}) {
  // Default data if none provided
  const defaultData = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
    "Kochi", "Goa", "Chandigarh", "Indore", "Surat"
  ];

  const cities = data || defaultData;

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: '#fff' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
            We Deliver Across Major Cities
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Our lightning-fast delivery service is available in major metropolitan areas across India, with more cities being added regularly.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            {cities.map((city, index) => (
              <Chip
                key={index}
                label={city}
                variant="outlined"
                sx={{
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  fontWeight: 600,
                  px: 1
                }}
              />
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 2,
                fontWeight: 600,
              }}
              startIcon={<Place />}
            >
              Check Service Availability
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}