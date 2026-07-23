import { Badge, Box, Button, Container, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { LocalOffer, PlayArrow as PlayArrowIcon } from '@mui/icons-material';

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8E53 100%)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'center', md: 'flex-start' }}
          spacing={4}
          sx={{ flexGrow: 1 }}
        >
          {/* Text Content */}
          <Stack
            spacing={3}
            maxWidth={{ xs: '100%', md: '500px' }}
            textAlign="left"
          >
            <Badge
              variant="outlined"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                width: 'fit-content'
              }}
            >
              15-Minute Delivery
            </Badge>

            <Typography
              variant="h1"
              sx={{ fontWeight: 700 }}
              lineHeight={1.2}
              sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.75rem' } }}
            >
              Get Your Groceries, Essentials & More Delivered in Minutes
            </Typography>

            <Typography
              variant="body1"
              lineHeight={1.6}
              color="white"
              sx={{ mb: 4, maxWidth: '400px', opacity: 0.9 }}
            >
              From fresh produce to household essentials, we deliver everything you need right to your doorstep. No more waiting in lines or carrying heavy bags - just tap, order, and relax.
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: '#ff6b35',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  }
                }}
                startIcon={<LocalOffer />}
              >
                Order Now
              </Button>

              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white',
                  },
                }}
                startIcon={<PlayArrowIcon />}
              >
                How It Works
              </Button>
            </Stack>
          </Stack>

          {/* App Hero Illustration */}
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: { xs: '100%', md: '400px' },
              display: { xs: 'none', md: 'block' },
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: 400,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative elements */}
              <Box sx={{
                position: 'absolute',
                top: -30, right: -30,
                width: 120, height: 120,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: -20, left: -20,
                width: 80, height: 80,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }} />
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'white',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  mb: 2,
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800 }} color="#ff6b35">
                  K
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600  color="white" sx={{ mb: 1 }}>
                Kartezy
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.8)">
                15-Minute Delivery App
              </Typography>
              {/* Download badges */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Box sx={{
                  px: 2, py: 1,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Typography variant="caption" color="white" sx={{ fontWeight: 500 }}>App Store</Typography>
                </Box>
                <Box sx={{
                  px: 2, py: 1,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Typography variant="caption" color="white" sx={{ fontWeight: 500 }}>Google Play</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Container>
    </section>
  );
};
