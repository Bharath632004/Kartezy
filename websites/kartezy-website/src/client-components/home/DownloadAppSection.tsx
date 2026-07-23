import { Box, Container, Stack, Typography, Button, Grid, Paper } from '@mui/material';
import {
  Apple,
  Android,
  QrCode,
  Download,
  PhoneIphone,
  ContentCut,
  Laptop,
} from '@mui/icons-material';

export default function DownloadAppSection({ data }: { data?: any } = {}) {
  // Default data if none provided
  const defaultData = {
    title: 'Download the Kartezy App',
    description: 'Shop smarter with our intuitive mobile app. Get exclusive app-only deals, faster checkout, and real-time order tracking.',
    appStoreUrl: '#',
    googlePlayUrl: '#',
    features: [
      {
        icon: PhoneIphone,
        title: '15-Minute Delivery',
        description: 'Get your groceries delivered in as little as 15 minutes with our lightning-fast delivery network.',
        color: '#ff6b35',
      },
      {
        icon: ContentCut,
        title: 'Exclusive App Deals',
        description: 'Access special discounts, coupons, and flash sales only available to app users.',
        color: '#4caf50',
      },
      {
        icon: Laptop,
        title: 'Smart Shopping',
        description: 'Browse products, track orders, and manage your cart across all your devices seamlessly.',
        color: '#2196f3',
      },
    ],
    qrCodeUrl: '/images/qr-code.png',
    alreadyDownloaded: {
      text: 'Already downloaded?',
      actions: [
        { label: 'Login to Account', href: '/login', variant: 'contained' as const },
        { label: 'Help & Support', href: '/support', variant: 'outlined' as const },
      ],
    },
  };

  const dataToUse = data || defaultData;

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }} id="download">
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
            {dataToUse.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            {dataToUse.description}
          </Typography>

          <Grid container spacing={4} alignItems="center">
            {/* App Preview */}
            <Grid item size={{ xs: 12, md: 6 }}>
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
                  {/* Animated gradient bar */}
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
                  {/* App Card */}
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
                        <Typography variant="h4" sx={{ fontWeight: 700 }} color="primary.main">
                          KT
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }} color="white">
                        Kartezy
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.8)">
                        v2.4.1 • Latest Version
                      </Typography>
                    </Stack>
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
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
                      href={dataToUse.appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      href={dataToUse.googlePlayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Scan QR Code
                      </Typography>
                    </Stack>
                    <Stack alignItems="center" spacing={1}>
                      <Download fontSize="large" color="success" />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Direct Download
                      </Typography>
                    </Stack>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* Features */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Stack spacing={4}>
                <Typography variant="h3" sx={{ fontWeight: 600 }} color="text.primary">
                  Why Download the Kartezy App?
                </Typography>

                <Box>
                  {dataToUse.features.map((feature: any, index: number) => (
                    <Stack key={index} direction="row" alignItems="flex-start" spacing={2} sx={{ mb: 3 }}>
                      {feature.icon && (
                        <Box sx={{ fontSize: '1.5rem', color: feature.color, mt: 0.5 }}>
                          <feature.icon />
                        </Box>
                      )}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                          {feature.description}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Box>

                {/* Already downloaded section */}
                {dataToUse.alreadyDownloaded && (
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                      borderRadius: 3,
                      p: 3,
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {dataToUse.alreadyDownloaded.text}
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                      {dataToUse.alreadyDownloaded.actions.map((action: any, index: number) => (
                        <Button
                          key={index}
                          variant={action.variant}
                          size="small"
                          sx={{
                            px: 3,
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': {
                              backgroundColor: action.variant === 'contained'
                                ? 'rgba(255,255,255,0.2)'
                                : 'rgba(255,255,255,0.1)',
                            }
                          }}
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.6; transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}
