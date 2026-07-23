"use client";
import React from 'react';

import { Box, Container, Grid, Typography, TextField, InputAdornment, Card, CardContent, Stack, Chip, Button, IconButton } from '@mui/material';
import { Search as SearchIcon, Favorite, Visibility, LocalOffer, AccessTime, Store } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '@/lib/services';

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState('featured');
  const [selectedPriceRange, setSelectedPriceRange] = React.useState<string | null>(null);
  const [selectedStores, setSelectedStores] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Fetch categories for filter (optional)
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Fetch products with filters
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['products', searchQuery, sortBy, selectedPriceRange, selectedStores, selectedCategory],
    queryFn: () => getProducts({
      search: searchQuery,
      sort: sortBy,
      priceRange: selectedPriceRange,
      stores: selectedStores.join(','),
      category: selectedCategory,
    }),
  });

  const priceRanges = [
    { label: 'Under ₹100', min: 0, max: 100 },
    { label: '₹100 - ₹200', min: 100, max: 200 },
    { label: '₹200 - ₹500', min: 200, max: 500 },
    { label: 'Over ₹500', min: 500, max: 1000 },
  ];

  const stores = Array.from(new Set(products.map((p: any) => p.store)));

  const handlePriceRangeClick = (range: string) => {
    setSelectedPriceRange(selectedPriceRange === range ? null : range);
  };

  const handleStoreClick = (store: string) => {
    setSelectedStores(prev =>
      prev.includes(store)
        ? prev.filter(s => s !== store)
        : [...prev, store]
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      <Grid container spacing={4}>
        {/* Sidebar Filters */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={4}>
            {/* Search */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 2 }}>
                Search Products
              </Typography>
              <TextField
                fullWidth
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon size="small" />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Box>

            {/* Sort Options */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 2 }}>
                Sort By
              </Typography>
              <Stack spacing={1}>
                {[
                  { value: 'featured', label: 'Featured' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'rating', label: 'Top Rated' },
                  { value: 'discount', label: 'Best Discount' },
                  { value: 'newest', label: 'Newest' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setSortBy(option.value)}
                    sx={{ justifyContent: 'flex-start', py: 1, px: 2 }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Price Range */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 2 }}>
                Price Range
              </Typography>
              <Stack spacing={1}>
                {priceRanges.map((range) => (
                  <Button
                    key={range.label}
                    variant={selectedPriceRange === range.label ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handlePriceRangeClick(range.label)}
                    sx={{ justifyContent: 'flex-start', py: 1, px: 2 }}
                  >
                    {range.label}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Category Filter */}
            {!categoriesLoading && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 2 }}>
                  Category
                </Typography>
                <Stack spacing={1}>
                  {categories.map((category: any) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                      sx={{ justifyContent: 'flex-start', py: 1, px: 2 }}
                    >
                      {category.name}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Store Filters */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 2 }}>
                Store Filters
              </Typography>
              <Stack spacing={1}>
                {stores.map((store: string) => (
                  <Button
                    key={store}
                    variant={selectedStores.includes(store) ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handleStoreClick(store)}
                    sx={{ justifyContent: 'flex-start', py: 1, px: 2 }}
                  >
                    {store}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Clear Filters */}
            {(selectedPriceRange || selectedStores.length > 0 || searchQuery || selectedCategory) && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => {
                  setSelectedPriceRange(null);
                  setSelectedStores([]);
                  setSearchQuery('');
                  setSortBy('featured');
                  setSelectedCategory(null);
                }}
                sx={{ py: 1, px: 2, alignSelf: 'flex-start' }}
              >
                Clear All Filters
              </Button>
            )}
          </Stack>
        </Grid>

        {/* Products Grid */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Results Count */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              All Products ({products.length})
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Sort by:
              </Typography>
              <Chip
                label={sortBy.replace('-', ' ')}
                size="small"
                onDelete={() => setSortBy('featured')}
              />
            </Stack>
          </Box>

          {/* Active Filters */}
          {(selectedPriceRange || selectedStores.length > 0 || searchQuery || selectedCategory) && (
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedPriceRange && (
                <Chip
                  label={`Price: ${selectedPriceRange}`}
                  size="small"
                  onDelete={() => setSelectedPriceRange(null)}
                  color="primary"
                />
              )}
              {selectedStores.map((store: string) => (
                <Chip
                  key={store}
                  label={`Store: ${store}`}
                  size="small"
                  onDelete={() => handleStoreClick(store)}
                  color="secondary"
                />
              ))}
              {searchQuery && (
                <Chip
                  label={`Search: ${searchQuery}`}
                  size="small"
                  onDelete={() => setSearchQuery('')}
                  color="secondary"
                />
              )}
              {selectedCategory && (
                <Chip
                  label={`Category: {categories.find((c: any) => c.id === selectedCategory)?.name}`}
                  size="small"
                  onDelete={() => setSelectedCategory(null)}
                  color="primary"
                />
              )}
            </Box>
          )}

          {/* Products Grid */}
          <Grid container spacing={3}>
            {products.map((product: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  {/* Product Image */}
                  <Box sx={{ position: 'relative', pb: '75%', overflow: 'hidden' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundImage: `url(${product.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    {product.isFresh && (
                      <Chip
                        label="FRESH"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: '#4caf50',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                    {product.isSponsored && (
                      <Chip
                        label="SPONSORED"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: '#ff9800',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                  </Box>

                  {/* Product Details */}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Stack spacing={2}>
                      {/* Store info */}
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Chip
                          label={product.store}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <AccessTime sx={{ fontSize: '1rem', color: '#4caf50' }} />
                          <Typography variant="body2" color="text.secondary" fontSize='0.75rem'>
                            {product.deliveryTime}
                          </Typography>
                        </Stack>
                      </Box>

                      {/* Product name */}
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '2.4rem',
                          fontSize: '1rem', }}
                      >
                        {product.name}
                      </Typography>

                      {/* Rating */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.primary">
                          {product.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontSize='0.75rem'>
                          • {product.reviews} reviews
                        </Typography>
                      </Stack>

                      {/* Price */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }} color="primary.main" fontSize='1.1rem'>
                          ₹{product.price}
                        </Typography>
                        {product.originalPrice && (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontSize='0.75rem'
                              sx={{ textDecoration: 'line-through' }}
                            >
                              ₹{product.originalPrice}
                            </Typography>
                            <Chip
                              label={`${product.discount}% OFF`}
                              size="small"
                              color="error"
                              sx={{ fontSize: '0.65rem', height: 18, fontWeight: 600 }}
                            />
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>

                  {/* Action Buttons */}
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Stack spacing={1}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="medium"
                        sx={{
                          py: 1,
                          borderRadius: 2,
                          backgroundColor: '#ff6b35',
                          '&:hover': {
                            backgroundColor: '#e55a2b',
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" sx={{ border: '1px solid #e0e0e0' }}>
                          <Favorite fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ border: '1px solid #e0e0e0' }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* No Results */}
          {products.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductsPage;