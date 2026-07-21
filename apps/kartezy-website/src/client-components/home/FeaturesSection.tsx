import { Box, Container, Stack, Typography, Card, CardContent } from '@mui/material';
import { Schedule, LocalGroceryStore, Inventory, Shield, AccessTime, LocalOffer } from '@mui/icons-material';

export default function FeaturesSection({ data }: { data?: any } = {}) {
  // Default data if none provided
  const defaultData = [
    {
      icon: Schedule,
      title: 'Lightning Fast',
      description: 'Get your order delivered in as fast as 15 minutes. Our optimized logistics network ensures speed without compromising quality.',
      color: 'primary.main',
    },
    {
      icon: LocalGroceryStore,
      title: 'Fresh Quality Guaranteed',
      description: 'We source directly from farms and trusted suppliers. Every item is hand-picked to ensure freshness and quality.',
      color: 'success.main',
    },
    {
      icon: Inventory,
      title: 'Wide Selection',
      description: 'Choose from 10,000+ products across groceries, fruits & vegetables, dairy, snacks, beverages, personal care, pet supplies & more.',
      color: 'info.main',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Contactless delivery, secure payments, and real-time order tracking. Your safety and privacy are our top priorities.',
      color: 'warning.main',
    },
    {
      icon: AccessTime,
      title: '24/7 Availability',
      description: 'We\'re open round the clock. Whether it\'s early morning milk or late-night cravings, we\'ve got you covered.',
      color: 'secondary.main',
    },
    {
      icon: LocalOffer,
      title: 'Best Prices Guaranteed',
      description: 'Get the best prices on all your favorites. We work directly with suppliers to eliminate middlemen and pass savings to you.',
      color: 'error.main',
    },
  ];

  const features = data || defaultData;

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 8 }}>
            Why Choose Kartezy?
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row', md: 'row' }} spacing={4} flexWrap="wrap" justifyContent="center">
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 280,
                  flexGrow: 1,
                  maxWidth: 350,
                  borderRadius: 5,
                }}
              >
                <CardContent sx={{ textAlign: 'center', px: 4, py: 5 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon && (
                      <Box sx={{ color: feature.color, mb: 1 }}>
                        <feature.icon fontSize="large" />
                      </Box>
                    )}
                  </Box>
                  <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}