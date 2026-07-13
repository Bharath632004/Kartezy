import { Box, Container, Stack, Typography, Button, Grid, Paper } from '@mui/material';
import {
  Apple,
  Android,
  Smartphone,
  QrCode,
  Download,
  PhoneIphone,
  Tablet,
  Laptop,
  ContentCut
} from '@mui/icons-material';

export default function DownloadAppSection() {
  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }} id="download">
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 4 }}>
            Download the Kartezy App
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Shop smarter with our intuitive mobile app. Get exclusive app-only deals, faster checkout, and real-time order tracking.
          </Typography>

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Paper
                elevation={12}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 5,
                  padding: { xs: 4, md: 6 },
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #ff6b35, #4caf50, #2196f3, #ff9800)',
                    animation: 'pulse 3s infinite',
                  }}
                />
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      width: 60,
                      height: 60,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 20,
                      right: 20,
                      width: 40,
                      height: 40,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                    },
                  }}
                >
                  <Stack alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: 'white',
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }}
                    >
                      <Typography variant="h4" fontWeight={700} color="primary.main">
                        KT
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight={600} color="white">
                      Kartezy
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.8)">
                      v2.4.1 • Latest Version
                    </Typography>
                  </Stack>
                </Box>

                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 3 }}>
                  Available on all platforms
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      height: 56,
                      borderRadius: 2,
                      px: 4,
                      minWidth: 140,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#1565c0',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    startIcon={<Apple fontSize="large" />}
                  >
                    App Store
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      height: 56,
                      borderRadius: 2,
                      px: 4,
                      minWidth: 140,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#1565c0',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    startIcon={<Android fontSize="large" />}
                  >
                    Google Play
                  </Button>
                </Stack>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    p: 3,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 3,
                  }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <QrCode fontSize="large" color="primary" />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Scan QR Code
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" spacing={1}>
                    <Download fontSize="large" color="success" />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Direct Download
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <Typography variant="h3" fontWeight={600} color="text.primary">
                Why Download the Kartezy App?
              </Typography>

              <Box>
                <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mb: 3 }}>
                  <PhoneIphone sx={{ fontSize: '1.5rem', color: '#ff6b35', mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                      15-Minute Delivery
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                      Get your groceries delivered in as little as 15 minutes with our lightning-fast delivery network.
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mb: 3 }}>
                  <ContentCut sx={{ fontSize: '1.5rem', color: '#4caf50', mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                      Exclusive App Deals
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                      Access special discounts, coupons, and flash sales only available to app users.
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mb: 3 }}>
                  <Laptop sx={{ fontSize: '1.5rem', color: '#2196f3', mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                      Smart Shopping
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                      Browse products, track orders, and manage your cart across all your devices seamlessly.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                  borderRadius: 3,
                  p: 3,
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Already downloaded?
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center} flexWrap="wrap">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)',
                      }
                    }}
                  >
                    Login to Account
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      fontWeight: 600,
                      px: 3,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    Help & Support
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        </Stack>
      </Container>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
        }
      `}</style>
    </Box>
  );
};
