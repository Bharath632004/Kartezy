"use client";
import { Box, Container, Grid, Typography, TextField, InputAdornment, Card, CardContent, Button, IconButton, Paper, Chip, Stack } from '@mui/material';
import { Search as SearchIcon, Favorite, Visibility, AccessTime } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getProducts, getCategories } from '@/lib/services';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  // Fetch categories for filter
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
    queryKey: ['search', searchQuery, sortBy, selectedPriceRange, selectedCategory, selectedStores],
    queryFn: () => getProducts({
      search: searchQuery,
      sort: sortBy,
      priceRange: selectedPriceRange || undefined,
      stores: selectedStores.join(','),
      category: selectedCategory || undefined,
    }),
  });

  const priceRanges = [
    { label: 'Under ₹100', min: 0, max: 100 },
    { label: '₹100 - ₹200', min: 100, max: 200 },
    { label: '₹200 - ₹500', min: 200, max: 500 },
    { label: 'Over ₹500', min: 500, max: 1000 },
  ];

  const stores: string[] = Array.from(new Set(products.map((p: any) => p.store)));

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

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search products, brands & more"
          placeholder="Search for products, brands & more"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: '100%', maxWidth: 600 }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar Filters */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filters
              </Typography>

              {/* Categories */}
              {!categoriesLoading && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Category
                  </Typography>
                  <Stack spacing={1}>
                    {categories.map((category: any) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleCategoryClick(category.id)}
                        sx={{ justifyContent: 'flex-start', py: 1, px: 2 }}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Price Range */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
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

              {/* Store Filters */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Store
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

              {/* Sort Options */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Sort By
                </Typography>
                <Stack spacing={1}>
                  {[
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Top Rated' },
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

              {/* Clear Filters */}
              {(selectedPriceRange || selectedCategory || selectedStores.length > 0 || searchQuery) && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    setSelectedPriceRange(null);
                    setSelectedCategory(null);
                    setSelectedStores([]);
                    setSearchQuery('');
                    setSortBy('relevance');
                  }}
                  sx={{ py: 1, px: 2, alignSelf: 'flex-start' }}
                >
                  Clear All Filters
                </Button>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Search Results */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Results Count */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Search Results ({products.length})
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Sort by:
              </Typography>
              <Chip
                label={sortBy.replace('-', ' ')}
                size="small"
                onDelete={() => setSortBy('relevance')}
              />
            </Stack>
          </Box>

          {/* Active Filters */}
          {(selectedPriceRange || selectedCategory || selectedStores.length > 0 || searchQuery) && (
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedPriceRange && (
                <Chip
                  label={`Price: ${selectedPriceRange}`}
                  size="small"
                  onDelete={() => setSelectedPriceRange(null)}
                  color="primary"
                />
              )}
              {selectedCategory && (
                <Chip
                  label={`Category: ${categories.find((c: any) => c.id === selectedCategory)?.name || ''}`}
                  size="small"
                  onDelete={() => setSelectedCategory(null)}
                  color="secondary"
                />
              )}
              {selectedStores.map((store) => (
                <Chip
                  key={store}
                  label={`Store: ${store}`}
                  size="small"
                  onDelete={() => handleStoreClick(store)}
                  color="error"
                />
              ))}
              {searchQuery && (
                <Chip
                  label={`Search: ${searchQuery}`}
                  size="small"
                  onDelete={() => setSearchQuery('')}
                  color="info"
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
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '2.4rem', }}
                      >
                        {product.name}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {product.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • {product.reviews} reviews
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }} color="primary.main">
                          ₹{product.price}
                        </Typography>
                        {product.originalPrice && (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              ₹{product.originalPrice}
                            </Typography>
                            {product.discount && (
                              <Chip
                                label={`${product.discount}% OFF`}
                                size="small"
                                color="error"
                                sx={{ fontSize: '0.65rem', height: 18, fontWeight: 600 }}
                              />
                            )}
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

export default SearchPage;
