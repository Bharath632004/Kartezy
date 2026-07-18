import { Box, Container, Stack, Typography } from '@mui/material';

export const BrandsSection = () => {
  const brands = [
    { name: 'Coca-Cola', logo: '/brands/coca-cola.svg' },
    { name: 'Pepsi', logo: '/brands/pepsi.svg' },
    { name: 'Nestlé', logo: '/brands/nestle.svg' },
    { name: 'Unilever', logo: '/brands/unilever.svg' },
    { name: 'P&G', logo: '/brands/procter-gamble.svg' },
    { name: 'Tata', logo: '/brands/tata.svg' },
  ];

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 4 }}>
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
          <Stack direction="row" spacing={4} justifyContent="center" alignItems="center" flexWrap="wrap" sx={{ gap: 4 }}>
            {brands.map((brand, index) => (
              <Box
                key={index}
                sx={{
                  width: 140,
                  height: 60,
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  textAlign="center"
                  sx={{ px: 2 }}
                >
                  {brand.name}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
