import { Box, Container, Stack, Typography, Grid } from '@mui/material';

export const BrandsSection = () => {
  const brands = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: 'Brand ' + (index + 1),
    imageUrl: '/images/brands/brand-' + (index + 1) + '.png'
  }));

  return (
    <section sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 4 }}>
            Trusted Brands You Love
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            textAlign="center" 
            sx={{ mb: 6, maxWidth: 600 }}
          >
            We partner with India's most trusted brands to bring you quality products at competitive prices.
          </Typography>
          
          <Grid 
            container 
            spacing={3} 
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: 120 }}
          >
            {brands.map((brand) => (
              <Box 
                key={brand.id} 
                sx={{
                  width: 120,
                  height: 60,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  fontWeight={500}
                  textAlign="center"
                >
                  {brand.name}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  );
};
