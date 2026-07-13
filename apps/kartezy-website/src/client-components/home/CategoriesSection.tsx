import { Box, Container, Stack, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import {
  LocalGroceryStore, LocalCafe, LocalPizza,
  LocalFlorist, LocalPharmacy,
  LocalConvenienceStore, ChildCare, LocalDrink
} from '@mui/icons-material';

export default function CategoriesSection() {
  const categories = [
    {
      name: 'Fresh Produce',
      icon: <LocalGroceryStore fontSize="large" color="success" />,
      bg: '#E8F5E9',
      color: '#2E7D32'
    },
    {
      name: 'Dairy & Eggs',
      icon: <LocalCafe fontSize="large" color="info" />,
      bg: '#E3F2FD',
      color: '#1565C0'
    },
    {
      name: 'Snacks & Beverages',
      icon: <LocalPizza fontSize="large" color="warning" />,
      bg: '#FFF8E1',
      color: '#EF6C00'
    },
    {
      name: 'Personal Care',
      icon: <LocalFlorist fontSize="large" color="error" />,
      bg: '#FCE4EC',
      color: '#C2185B'
    },
    {
      name: 'Pharmacy',
      icon: <LocalPharmacy fontSize="large" color="info" />,
      bg: '#E8EAF6',
      color: '#303F9F'
    },
    {
      name: 'Household Essentials',
      icon: <LocalConvenienceStore fontSize="large" color="success" />,
      bg: '#E8F5E9',
      color: '#2E7D32'
    },
    {
      name: 'Baby & Kids',
      icon: <ChildCare fontSize="large" color="warning" />,
      bg: '#FFF3E0',
      color: '#EF6C00'
    },
    {
      name: 'Bakery',
      icon: <LocalDrink fontSize="large" color="error" />,
      bg: '#FFEBEE',
      color: '#C62828'
    }
  ];

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 8 }}>
            Shop by Category
          </Typography>

          <Grid
            container
            spacing={3}
          >
            {categories.map((category, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 5,
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
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: { xs: 8, md: 16 },
                py: { xs: 2, md: 2 },
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
    </Box>
  );
};
