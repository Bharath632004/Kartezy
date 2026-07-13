import { Box, Container, Stack, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { LocalGroceryStore, LocalShipping, LocationOn, CheckCircle } from '@mui/icons-material';

export default function HowItWorksSection() {
  const steps = [
    {
      title: 'Browse & Select',
      icon: <LocalGroceryStore />,
      description: 'Explore our wide range of products organized in intuitive categories.'
    },
    {
      title: 'Place Order',
      icon: <LocalShipping />,
      description: 'Review your cart, apply promo codes, and proceed to secure checkout.'
    },
    {
      title: 'Track Delivery',
      icon: <LocationOn />,
      description: 'Get real-time updates on your order status and see your delivery partner.'
    },
    {
      title: 'Enjoy!',
      icon: <CheckCircle />,
      description: 'Your order arrives fresh and on time. Rate your experience.'
    }
  ];

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Typography variant="h2" fontWeight={600} textAlign="center">
            How It Works
          </Typography>

          <Stepper alternativeLabel orientation="horizontal">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel icon={step.icon}>
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, mx: 'auto' }}>
                      {step.description}
                    </Typography>
                  </Stack>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </Container>
    </Box>
  );
};
