import { Box, Container, Stack, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import {
  LocalGroceryStore,
  LocalCafe,
  LocalPizza,
  LocalFlorist,
  LocalPharmacy,
  LocalConvenienceStore,
  ChildCare,
  LocalDrink,
} from '@mui/icons-material';

// Icon mapping
const iconMap = {
  LocalGroceryStore: () => <LocalGroceryStore fontSize="large" />,
  LocalCafe: () => <LocalCafe fontSize="large" />,
  LocalPizza: () => <LocalPizza fontSize="large" />,
  LocalFlorist: () => <LocalFlorist fontSize="large" />,
  LocalPharmacy: () => <LocalPharmacy fontSize="large" />,
  LocalConvenienceStore: () => <LocalConvenienceStore fontSize="large" />,
  ChildCare: () => <ChildCare fontSize="large" />,
  LocalDrink: () => <LocalDrink fontSize="large" />,
};

export default function CategoriesSection({ data }: { data?: any } = {}) {
  // Default data if none provided
  const defaultData = [
    {
      name: 'Fresh Produce',
      icon: 'LocalGroceryStore',
      bg: '#E8F5E9',
      color: '#2E7D32'
    },
    {
      name: 'Dairy & Eggs',
      icon: 'LocalCafe',
      bg: '#E3F2FD',
      color: '#1565C0'
    },
    {
      name: 'Snacks & Beverages',
      icon: 'LocalPizza',
      bg: '#FFF8E1',
      color: '#EF6C00'
    },
    {
      name: 'Personal Care',
      icon: 'LocalFlorist',
      bg: '#FCE4EC',
      color: '#C2185B'
    },
    {
      name: 'Pharmacy',
      icon: 'LocalPharmacy',
      bg: '#E8EAF6',
      color: '#303F9F'
    },
    {
      name: 'Household Essentials',
      icon: 'LocalConvenienceStore',
      bg: '#E8F5E9',
      color: '#2E7D32'
    },
    {
      name: 'Baby & Kids',
      icon: 'ChildCare',
      bg: '#FFF3E0',
      color: '#EF6C00'
    },
    {
      name: 'Bakery',
      icon: 'LocalDrink',
      bg: '#FFEBEE',
      color: '#C62828'
    }
  ];

  const categories = data || defaultData;

  // Helper function to get text color based on background
  const getContrastColor = (hexColor) => {
    // Remove the '#' if present
    const cleanHex = hexColor.replace('#', '');
    // Convert to RGB
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" sx={{ fontWeight: 600  textAlign="center" sx={{ mb: 8 }}>
            Shop by Category
          </Typography>

          <Grid
            container
            spacing={3}>
            {categories.map((category, index) => (
              <Grid key={category.id} size={{xs:12, sm:6, md:4, lg:3}}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
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
                      {iconMap[category.icon] && (
                        <Box sx={{ color: getContrastColor(category.bg), mb: 1 }}>
                          {iconMap[category.icon]()}
                        </Box>
                      )}
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600 }}
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
}