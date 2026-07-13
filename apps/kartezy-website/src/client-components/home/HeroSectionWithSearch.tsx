"use client';'
import { Box, Container, Stack, Typography, TextField, Button, InputAdornment, Grid } from '@mui/material';
import { Search as SearchIcon, LocalOffer as LocalOfferIcon, PlayArrow as PlayArrowIcon, AccessTime, Security, Truck, Star } from '@mui/icons-material';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroSectionWithSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularSearches] = useState([
    'Fresh Vegetables', 'Dairy Products', 'Snacks', 'Beverages',
    'Personal Care', 'Household', 'Fruits', 'Bread & Bakery'
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    window.location.href = `/search?q=${encodeURIComponent(term)}`;
  };

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8E53 100%)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Text Content */}
          <Grid item xs={12} md={7} lg={6} component={motion.div}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Stack
              spacing={3}
              maxWidth={{ xs: '100%', md: '500px' }}
              textAlign="left"
            >
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <AccessTime sx={{ color: 'white', fontSize: '1.2rem' }} />
                <Typography variant="subtitle1" fontWeight={600} color="white">
                  15-Minute Delivery
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5} ml={3}>
                  <Star sx={{ color: 'white', fontSize: '1rem' }} />
                  <Typography variant="subtitle2" color="white" fontWeight={500}>
                    Rated 4.8/5
                  </Typography>
                </Box>
              </Box>

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
                  startIcon={<LocalOfferIcon />}
                  onClick={() => window.location.href = '/offers'}
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
                  onClick={() => {
                    const element = document.getElementById('how-it-works');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  How It Works
                </Button>
              </Stack>

              {/* Trust Indicators */}
              <Stack direction="row" spacing={3} alignItems="center" mt={4} flexWrap="wrap">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Security sx={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="body2" color="white" opacity={0.9}>Secure Checkout</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Truck sx={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="body2" color="white" opacity={0.9}>Express Delivery</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>

          {/* Search Section */}
          <Grid item xs={12} md={5} lg={4} component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{ mt: { xs: 6, md: 0 } }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: 5,
                padding: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                color: 'text.primary',
              }}
            >
              <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 3, textAlign: 'center' }}>
                What do you need?
              </Typography>

              {/* Search Bar */}
              <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
                <TextField
                  fullWidth
                  placeholder="Search for products, brands or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#f8f9fa',
                      '&:hover': {
                        backgroundColor: '#fff',
                      },
                    }
                  }}
                />
              </form>

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  fontWeight: 600,
                  py: 1.5,
                  mb: 3,
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: '#e55a2b',
                  }
                }}
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
              >
                Search Products
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                <Typography component="span" fontWeight={600} color="primary.main">Popular Searches:</Typography><br />
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                {popularSearches.map((term, index) => (
                  <Box
                    key={index}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleQuickSearch(term)}
                      sx={{
                        borderColor: '#e0e0e0',
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 2,
                        '&:hover': {
                          borderColor: '#ff6b35',
                          color: '#ff6b35',
                          backgroundColor: 'rgba(255,107,53,0.05)',
                        }
                      }}
                    >
                      {term}
                    </Button>
                  </Box>
                ))}
              </Stack>

              {/* Features */}
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Grid container spacing={2} textAlign="center">
                  <Grid item xs={4}>
                    <Stack alignItems="center" spacing={0.5}>
                      <Typography variant="h6" fontWeight={700} color="primary.main">15min</Typography>
                      <Typography variant="caption" color="text.secondary">Delivery</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack alignItems="center" spacing={0.5}>
                      <Typography variant="h6" fontWeight={700} color="success.main">10K+</Typography>
                      <Typography variant="caption" color="text.secondary">Products</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack alignItems="center" spacing={0.5}>
                      <Typography variant="h6" fontWeight={700} color="warning.main">4.8</Typography>
                      <Typography variant="caption" color="text.secondary">Rating</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />
    </section>
  );
};

export { }; // Restore exports