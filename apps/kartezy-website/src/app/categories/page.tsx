"use client";
import { Box, Container, Grid, Typography, TextField, InputAdornment, Card, CardContent, Stack, Chip, Button } from '@mui/material';
import { Search as SearchIcon, LocalGroceryStore, LocalCafe, LocalPizza, LocalFlorist, LocalPharmacy, Home, Favorite, Pets } from '@mui/icons/material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getCategories } from '@/lib/services';

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const router = useRouter();

  // Fetch categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(selectedCategoryId === categoryId ? null : categoryId);
    // Navigate to products page with category filter
    if (categoryId) {
      router.push(`/products?category=${categoryId}`);
    } else {
      router.push('/products');
    }
  };

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

      {/* Categories Grid */}
      <Box>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
          All Categories
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedCategoryId === category.id ? '#f0f0f0' : 'white',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    backgroundColor: selectedCategoryId === category.id ? '#e0e0e0' : 'white',
                  }
                }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: category.bgColor || '#f5f5f5',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                    }}
                  >
                    {category.icon ? (
                      <Box sx={{ color: category.color || 'primary.main' }}>
                        {category.icon}
                      </Box>
                    ) : (
                      <Box sx={{ bgcolor: 'primary.main', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {category.name[0]}
                      </Box>
                    )}
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color={selectedCategoryId === category.id ? (category.color || 'primary.main') : 'text.primary'}
                    sx={{ mb: 1 }}
                  >
                    {category.name}
                  </Typography>

                  {category.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {category.description.substring(0, 60)}...
                    </Typography>
                  )}

                  {category.productCount && (
                    <Chip
                      label={`${category.productCount} products`}
                      size="small"
                      sx={{
                        backgroundColor: selectedCategoryId === category.id ? (category.color || 'primary.main') : 'transparent',
                        color: selectedCategoryId === category.id ? 'white' : 'text.secondary',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>

          {categories.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No categories found
              </Typography>
            </Box>
          )}
        </Grid>
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
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }} maxWidth={600} mx="auto">
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
          onClick={() => {
            router.push('/products');
          }}
        >
          Browse All Products
        </Button>
      </Box>
    </Container>
  );
};

export default CategoriesPage;