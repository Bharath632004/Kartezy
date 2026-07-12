import { Box, Container, Stack, Typography, Button, Grid, CssBaseline } from '@mui/material';
import { 
  Apple, 
  GooglePlay, 
  HuaweiAppGallery 
} from '@mui/icons-material';

export const DownloadAppSection = () => {
  return (
    <section sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 4 }}>
            Download the Kartezy App
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            textAlign="center" 
            sx={{ mb: 6, maxWidth: 600 }}
          >
            Shop smarter with our intuitive mobile app. Get exclusive app-only deals, faster checkout, and real-time order tracking.
          </Typography>
          
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Box 
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 24,
                  padding: 6,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                }}
              >
                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 4 }}>
                  Available on all platforms
                </Typography>
                
                <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap">
                  <Button 
                    variant="contained" 
                    sx={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      height: 56,
                      borderRadius: 16,
                      px: 4,
                      minWidth: 140,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      }
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
                      borderRadius: 16,
                      px: 4,
                      minWidth: 140,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      }
                    }}
                    startIcon={<GooglePlay fontSize="large" />}
                  >
                    Google Play
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    sx={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      height: 56,
                      borderRadius: 16,
                      px: 4,
                      minWidth: 140,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      }
                    }}
                    startIcon={<HuaweiAppGallery fontSize="large" />}
                  >
                    App Gallery
                  </Button>
                </Stack>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mt: 4, fontSize: '0.875rem', textAlign: 'center' }}
                >
                  Scan QR code to download
                </Typography>
                
                <Box 
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '12px auto',
                  }}
                >
                  <QRCodeScanner fontSize="large" color="primary.main" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </section>
  );
};

// Import additional icons
import { QRCodeScanner } from '@mui/icons-material/QRCodeScanner';
