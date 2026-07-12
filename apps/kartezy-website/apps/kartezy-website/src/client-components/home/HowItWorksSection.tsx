import { Box, Container, Stack, Typography, Stepper, Step, StepConnector, StepLabel } from '@mui/material';
import { 
  LocalGroceryStore, 
  LocalTruck, 
  Person, 
  CheckCircle 
} from '@mui/icons/material';

export const HowItWorksSection = () => {
  return (
    <section sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 8 }}>
            How It Works
          </Typography>
          
          <Stepper 
            orientation={{ xs: 'vertical', md: 'horizontal' }}
            sx={{ maxWidth: { xs: '100%', md: 800 }, marginX: 'auto' }}
          >
            {/* Step 1: Browse & Select */}
            <Step>
              <StepLabel 
                StepIconProps={{
                  sx: { fontSize: 24, color: 'primary.main' }
                }}
                sx={{ mb: 2 }}
              >
                <LocalGroceryStore fontSize="inherit" />
                <Typography variant="h5" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                  Browse & Select
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 300 }}>
                  Explore our wide range of products organized in intuitive categories. Add items to your cart with just a tap.
                </Typography>
              </StepLabel>
            </Step>
            
            {/* Step Connector */}
            <StepConnector sx={{ mb: 2 }} />
            
            {/* Step 2: Place Order */}
            <Step>
              <StepLabel 
                StepIconProps={{
                  sx: { fontSize: 24, color: 'primary.main' }
                }}
                sx={{ mb: 2 }}
              >
                <LocalTruck fontSize="inherit" />
                <Typography variant="h5" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                  Place Order
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 300 }}>
                  Review your cart, apply promo codes if any, and proceed to secure checkout. Multiple payment options available.
                </Typography>
              </StepLabel>
            </Step>
            
            {/* Step Connector */}
            <StepConnector sx={{ mb: 2 }} />
            
            {/* Step 3: Track Delivery */}
            <Step>
              <StepLabel 
                StepIconProps={{
                  sx: { fontSize: 24, color: 'primary.main' }
                }}
                sx={{ mb: 2 }}
              >
                <Person fontSize="inherit" />
                <Typography variant="h5" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                  Track Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 300 }}>
                  Get real-time updates on your order status. See exactly when your delivery partner is approaching your location.
                </Typography>
              </StepLabel>
            </Step>
            
            {/* Step Connector */}
            <StepConnector sx={{ mb: 2 }} />
            
            {/* Step 4: Enjoy! */}
            <Step>
              <StepLabel 
                StepIconProps={{
                  sx: { fontSize: 24, color: 'primary.main' }
                }}
                sx={{ mb: 2 }}
              >
                <CheckCircle fontSize="inherit" />
                <Typography variant="h5" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                  Enjoy!
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 300 }}>
                  Your order arrives fresh and on time. Rate your experience and reorder favorites with one tap.
                </Typography>
              </StepLabel>
            </Step>
          </Stepper>
        </Stack>
      </Container>
    </section>
  );
};
