import { Box, Container, Stack, Typography } from '@mui/material';

export const BrandsSection = () => {
  const brands = [
    'https://via.placeholder.com/150x50?text=Brand+1',
    'https://via.placeholder.com/150x50?text=Brand+2',
    'https://via.placeholder.com/150x50?text=Brand+3',
    'https://via.placeholder.com/150x50?text=Brand+4',
    'https://via.placeholder.com/150x50?text=Brand+5',
    'https://via.placeholder.com/150x50?text=Brand+6',
  ];

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
            Trusted Brands
          </Typography>
          <Stack direction="row" spacing={4} justifyContent="center" alignItems="center" flexWrap="wrap" sx={{ gap: 4 }}>
            {brands.map((brand, index) => (
              <Box
                key={index}
                component="img"
                src={brand}
                alt={`Brand ${index + 1}`}
                sx={{ height: 50, opacity: 0.6, filter: 'grayscale(100%)', transition: 'all 0.3s ease', '&:hover': { opacity: 1, filter: 'grayscale(0%)' } }}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
