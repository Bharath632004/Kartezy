import { Box, Container, Stack, Typography, Grid } from '@mui/material';

export default function BrandsSection({ data } = {}) {
  // Default data if none provided
  const defaultData = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: `Brand ${index + 1}`,
    logo: `/images/brand-${index + 1}.png`,
  }));

  const brands = data || defaultData;

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
            Trusted Brands You Love
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            We partner with India's most trusted brands to bring you quality products at competitive prices.
          </Typography>

          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {brands.map((brand) => (
              <Grid item key={brand.id} xs={6} sm={4} md={2}>
                <Box
                  sx={{
                    width: '100%',
                    height: 80,
                    backgroundColor: '#fff',
                    borderRadius: 2,
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
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                      }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                      textAlign="center"
                    >
                      {brand.name}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}