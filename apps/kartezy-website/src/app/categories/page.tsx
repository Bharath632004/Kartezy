"use client';
import { Box, Container, Grid, Typography, TextField, InputAdornment, Card, CardContent, Stack, Chip, Button } from '@mui/material';
import { Search as SearchIcon, LocalGroceryStore, LocalCafe, LocalPizza, LocalFlorist, LocalPharmacy, Pets, Home, Favorite } from '@mui/icons-material';

const categories = [
  {
    id: 1,
    name: 'Fresh Produce',
    icon: <LocalGroceryStore fontSize="large" color="success" />,
    bgColor: '#E8F5E9',
    color: '#2E7D32',
    productCount: 1245,
    description: 'Fresh fruits and vegetables sourced directly from farms',
    featured: true,
  },
  {
    id: 2,
    name: 'Dairy & Eggs',
    icon: <LocalCafe fontSize="large" color="info" />,
    bgColor: '#E3F2FD',
    color: '#1565C0',
    productCount: 892,
    description: 'Fresh dairy products and farm eggs',
    featured: false,
  },
  {
    id: 3,
    name: 'Snacks & Beverages',
    icon: <LocalPizza fontSize="large" color="warning" />,
    bgColor: '#FFF8E1',
    color: '#EF6C00',
    productCount: 2341,
    description: 'Beverages, chips, and snacks for every occasion',
    featured: true,
  },
  {
    id: 4,
    name: 'Personal Care',
    icon: <LocalFlorist fontSize="large" color="error" />,
    bgColor: '#FCE4EC',
    color: '#C2185B',
    productCount: 1567,
    description: 'Skincare, haircare, and wellness products',
    featured: false,
  },
  {
    id: 5,
    name: 'Pharmacy',
    icon: <LocalPharmacy fontSize="large" color="info" />,
    bgColor: '#E8EAF6',
    color: '#303F9F',
    productCount: 783,
    description: 'Healthcare products and medicines',
    featured: false,
  },
  {
    id: 6,
    name: 'Household Essentials',
    icon: <Home fontSize="large" color="success" />,
    bgColor: '#E8F5E9',
    color: '#2E7D32',
    productCount: 1123,
    description: 'Cleaning supplies and household items',
    featured: true,
  },{
    id: 7,
    name: 'Baby & Kids',
    icon: <Favorite fontSize="large" color="warning" />,
    bgColor: '#FFF3E0',
    color: '#EF6C00',
    productCount: 945,
    description: 'Baby care, toys, and kids products',
    featured: false,
  },
  {
    id: 8,
    name: 'Bakery',
    icon: <Pets fontSize="large" color="error" />,
    bgColor: '#FFEBEE',
    color: '#C62828',
    productCount: 678,
    description: 'Fresh bread, pastries, and baked goods',
    featured: false,
  },
];

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredCategories = categories.filter(c => c.featured);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Shop by Category
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
          Browse our comprehensive collection of products organized into easy-to-navigate categories.
          From fresh produce to household essentials, find everything you need in one place.
        </Typography>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }
          }}
        />
      </Box>

      {/* Featured Categories */}
      {featuredCategories.length > 0 && (
        <Box sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
            Featured Categories
          </Typography>
          <Grid container spacing={3}>
            {featuredCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: category.bgColor,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
                      variant="body2}
                      color="text.secondary"
                      sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {category.description}
                    </Typography>

                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {category.productCount.toLocaleString()} products
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Categories Grid */}
      <Box>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
          All Categories
        </Typography>
        <Grid container spacing={3}>
          {filteredCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id} component={GridItem(index)}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedCategory === category.id ? category.bgColor : 'white',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    backgroundColor: selectedCategory === category.id ? category.bgColor : category.bgColor,
                  }
                }}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: category.bgColor,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                    }}
                  >
                    {category.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color={selectedCategory === category.id ? category.color : 'text.primary'}
                    sx={{ mb: 1 }}
                  >
                    {category.name}
                  </Typography>

                  <Typography variant="body2} color="text.secondary" sx={{ mb: 2 }}>
                    {category.description.substring(0, 40)}...
                  </Typography>

                  <Chip
                    label={`${category.productCount.toLocaleString()} items`}
                    size="small"
                    sx={{
                      backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                      color: selectedCategory === category.id ? 'white' : category.color,
                      fontWeight: 600,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredCategories.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6} color="text.secondary">
              No categories found matching your search
            </Typography>
          </Box>
        )
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          mt: { xs: 6, md: 8 },
          backgroundColor: 'linear-gradient(135deg, #ff6b35 0%, #ff8E53 100%)',
          borderRadius: 6,
          p: { xs: 4, md: 6 },
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight={600} sx={{ mb: 2 }}>
          Ready to Start Shopping?
        </Typography>
        <Typography variant="body1} sx={{ mb: 4, opacity: 0.9 }} maxWidth={600} mx="auto">
          Browse through our categories to find the perfect products for your needs.
          Everything is just a click away!
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: 'white',
            color: '#ff6b35',
            fontWeight: 600,
            px: { xs: 4, md: 6 },
            py: { xs: 1.5, md: 2 },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Browse All Products
        </Button>
      </Box>
    </Container>
  );
};

// Helper component for animation
element.animate([{ opacity: 0, y: 20 }, { opacity: 1, y: 0 }], { duration: 300, delay: 100 * index });

export default ProductsPage;