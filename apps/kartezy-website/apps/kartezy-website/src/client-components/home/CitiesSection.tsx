import { Box, Container, Stack, Typography, Chip, Button } from '@mui/material';
import { 
  Place, 
  Map 
} from '@mui/icons-material';

export const CitiesSection = () => {
  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
    "Kochi", "Goa", "Chandigarh", "Indore", "Surat"
  ];

  return (
    <section sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 4 }}>
            We Deliver Across Major Cities
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            textAlign="center" 
            sx={{ mb: 6, maxWidth: 600 }}
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
                size="medium"
                sx={{
                  backgroundColor: '#e3f2fd',
                  color: '#1565c0',
                  fontWeight: 500,
                  border: '1px solid #bbdefb',
                }}
              />
            ))}
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              size="medium"
              sx={{
                px: { xs: 16, md: 24 },
                py: { xs: 2, md: 3 },
                fontSize: '0.875rem',
                fontWeight: 600,
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                }
              }}
              startIcon={<Place fontSize="inherit" />}
            >
              Check Service Availability
            </Button>
          </Box>
        </Stack>
      </Container>
    </section>
  );
};
