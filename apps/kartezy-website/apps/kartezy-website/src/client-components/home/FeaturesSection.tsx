import { Box, Container, Stack, Typography, Card, CardContent } from '@mui/material';
import { 
  Schedule, 
  LocalGroceryStore, 
  LocalMall, 
  Shield,
  LocalFlorist,
  BreadsAndNoodles
} from '@mui/icons/material';

export const FeaturesSection = () => {
  return (
    <section sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 8 }}>
            Why Choose Kartezy?
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row', md: 'row' }} spacing={4} flexWrap="wrap">
            {/* Feature 1: Lightning Fast */}
            <Card sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
              <CardContent sx={{ textAlign: 'center', px: 4, py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Schedule fontSize="large" color="primary.main" />
                </Box>
                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
                  Lightning Fast
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Get your order delivered in as fast as 15 minutes. Our optimized logistics network ensures speed without compromising quality.
                </Typography>
              </CardContent>
            </Card>
            
            {/* Feature 2: Fresh Quality */}
            <Card sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
              <CardContent sx={{ textAlign: 'center', px: 4, py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <LocalGroceryStore fontSize="large" color="success.main" />
                </Box>
                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
                  Fresh Quality Guaranteed
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  We source directly from farms and trusted suppliers. Every item is hand-picked to ensure freshness and quality.
                </Typography>
              </CardContent>
            </Card>
            
            {/* Feature 3: Wide Selection */}
            <Card sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
              <CardContent sx={{ textAlign: 'center', px: 4, py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <LocalMall fontSize="large" color="info.main" />
                </Box>
                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
                  Wide Selection
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Choose from 10,000+ products across groceries, fruits & vegetables, dairy, snacks, beverages, personal care, pet supplies & more.
                </Typography>
              </CardContent>
            </Card>
            
            {/* Feature 4: Safe & Secure */}
            <Card sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
              <CardContent sx={{ textAlign: 'center', px: 4, py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Shield fontSize="large" color="warning.main" />
                </Box>
                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
                  Safe & Secure
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Contactless delivery, secure payments, and real-time order tracking. Your safety and privacy are our top priorities.
                </Typography>
              </CardContent>
            </Card>
            
            {/* Feature 5: 24/7 Availability */}
            <Card sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
              <CardContent sx={{ textAlign: 'center', px: 4, py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <LocalFlorist fontSize="large" color="secondary.main" />
                </Box>
                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
                  24/7 Availability
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  We're open round the clock. Whether it's early morning milk or late-night cravings, we've got you covered.
                </Typography>
              </CardContent>
            </Card>
            
            {/* Feature 6: Best Prices */}
            <Card sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
              <CardContent sx={{ textAlign: 'center', px: 4, py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <BreadsAndNoodles fontSize="large" color="error.main" />
                </Box>
                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
                  Best Prices Guaranteed
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Get the best prices on all your favorites. We work directly with suppliers to eliminate middlemen and pass savings to you.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </section>
  );
};
