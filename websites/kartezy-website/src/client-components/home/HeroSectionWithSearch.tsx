"use client";
import { Box, Container, Stack, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { Search as SearchIcon, AccessTime, LocalShipping as Truck } from '@mui/icons-material';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface HeroSectionWithSearchProps {
  data?: any;
}

export default function HeroSectionWithSearch({ data }: HeroSectionWithSearchProps) {
  // Default data if none provided
  const defaultData = {
    title: 'Get essentials delivered in minutes',
    subtitle: 'Shop from local merchants for groceries, electronics, pharmacy & more delivered to your doorstep',
    primaryButtonText: 'Shop Now',
    secondaryButtonText: 'How it works',
    backgroundImage: '/images/hero-bg.jpg',
    logo: '/images/logo.png',
    badges: [
      { text: '15-min Delivery', icon: AccessTime, color: 'success.main' },
      { text: 'Fresh Quality', icon: Truck, color: 'error.main' },
      { text: '24/7 Service', icon: AccessTime, color: 'info.main' },
    ],
    popularSearches: [
      'Fresh Vegetables', 'Dairy Products', 'Snacks', 'Beverages',
      'Personal Care', 'Household Items', 'Fruits', 'Bread & Bakery', 'Pharmacy'
    ],
  };

  const dataToUse = data || defaultData;
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search page with query
      // In a real app, we would use useRouter from next/router
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
  };

  return (
    <Box component="section" sx={{ position: 'relative', py: 20 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
          {/* Text Content */}
          <Box flex={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {/* Badges */}
              {dataToUse.badges?.map((badge: any, index: number) => (
                <Box key={index} display="flex" alignItems="center" sx={{ mb: 1 }}>
                  {badge.icon && (
                    <Box sx={{ color: badge.color, mr: 1 }}>
                      <badge.icon fontSize="small" />
                    </Box>
                  )}
                  <Typography variant="caption" sx={{ fontWeight: 500 }} color="text.secondary">
                    {badge.text}
                  </Typography>
                </Box>
              ))}

              {/* Title */}
              <Typography variant="h3" color="text.primary" sx={{ fontWeight: 700, mb: 2 }}>
                {dataToUse.title}
              </Typography>

              {/* Subtitle */}
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {dataToUse.subtitle}
              </Typography>

              {/* Buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: '#e55a2b',
                    }
                  }}
                >
                  {dataToUse.primaryButtonText || 'Shop Now'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    border: '2px solid',
                    '&:hover': {
                      backgroundColor: 'rgba(25,118,210,0.05)',
                    }
                  }}
                >
                  {dataToUse.secondaryButtonText || 'Learn More'}
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Image / Search Card */}
          <Box flex={{ xs: 12, md: 5 }} sx={{ position: 'relative' }}>
            {dataToUse.backgroundImage && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${dataToUse.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                  zIndex: 0,
                }}
              />
            )}
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              <TextField
                label="Search products, brands & more"
                placeholder="Search for products, brands & more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '100%', mb: 2 }}
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                size="medium"
                sx={{
                  width: '100%',
                  py: 1.5,
                  fontSize: '0.9rem',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: '#e55a2b',
                  }
                }}
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
              >
                Search Products
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                <Typography component="span" sx={{ fontWeight: 600 }} color="primary">Popular Searches:</Typography>
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                {dataToUse.popularSearches.map((term: string, index: number) => (
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
            </Box>
          </Box>
        </Stack>
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
    </Box>
  );
}
