import { Box, Container, Stack, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { 
  LocalGroceryStore, LocalCafe, LocalPizza, LocalBar, 
  LocalFlorist, LocalPharmacy, PetServices, ChildCare,
  ElectricRocket, LocalLaundryService, LocalShipping,
  LocalAtm, LocalConvenienceStore, LocalDrink
} from '@mui/icons-material';

export const CategoriesSection = () => {
  const categories = [
    { 
      name: 'Fresh Produce', 
      icon: <LocalGroceryStore fontSize="large" color="success.main" />, 
      bg: '#E8F5E9',
      color: '#2E7D32'
    },
    { 
      name: 'Dairy & Eggs', 
      icon: <LocalCafe fontSize="large" color="info.main" />, 
      bg: '#E3F2FD',
      color: '#1565C0'
    },
    { 
      name: 'Snacks & Beverages', 
      icon: <LocalPizza fontSize="large" color="warning.main" />, 
      bg: '#FFF8E1',
      color: '#EF6C00'
    },
    { 
      name: 'Personal Care', 
      icon: <LocalFlorist fontSize="large" color="error.main" />, 
      bg: '#FCE4EC',
      color: '#C2185B'
    },
    { 
      name: 'Pet Supplies', 
      icon: <PetServices fontSize="large" color="secondary.main" />, 
      bg: '#F3E5F5',
      color: '#6A1B9A'
    },
    { 
      name: 'Pharmacy', 
      icon: <LocalPharmacy fontSize="large" color="info.main" />, 
      bg: '#E8EAF6',
      color: '#303F9F'
    },
    { 
      name: 'Household Essentials', 
      icon: <LocalConvenienceStore fontSize="large" color="success.main" />, 
      bg: '#E8F5E9',
      color: '#2E7D32'
    },
    { 
      name: 'Baby & Kids', 
      icon: <ChildCare fontSize="large" color="warning.main" />, 
      bg: '#FFF3E0',
      color: '#EF6C00'
    },
    { 
      name: 'Bakery', 
      icon: <LocalDrink fontSize="large" color="error.main" />, 
      bg: '#FFEBEE',
      color: '#C62828'
    }
  ];

  return (
    <section sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 8 }}>
            Shop by Category
          </Typography>
          
          <Grid 
            container 
            spacing={3} 
            columns={{ xs: 2, sm: 3, md: 4, lg: 3 }}
          >
            {categories.map((category, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 20,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center', flexGrow: 1 }}>
                    <Box 
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: category.bg,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      {category.icon}
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      color={category.color}
                      sx={{ mb: 2 }}
                    >
                      {category.name}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
                    >
                      Fresh & quality products delivered fast
                    </Typography>
                  </CardContent>
                  
                  {/* Gradient overlay on hover */}
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.05))',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                      '&:hover': {
                        opacity: 1,
                      }
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{
                px: { xs: 16, md: 32 },
                py: { xs: 2, md: 3 },
                fontSize: '1rem',
                fontWeight: 600,
              }}
              startIcon={<LocalGroceryStore />}
            >
              Explore All Categories
            </Button>
          </Box>
        </Stack>
      </Container>
    </section>
  );
};
