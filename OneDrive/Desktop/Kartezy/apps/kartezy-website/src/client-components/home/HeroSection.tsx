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
              fontWeight={700}
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
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" fontWeight={300} color="white">
                App Screenshot
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Container>
    </section>
  );
};
