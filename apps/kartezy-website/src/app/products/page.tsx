"use client';
import { Box, Container, Grid, Typography, TextField, InputAdornment, Card, CardContent, Stack, Chip, Button, IconButton } from '@mui/material';
import { Search as SearchIcon, Favorite, Visibility, LocalOffer, AccessTime, Store } from '@mui/icons-material';

// Sample products data
const sampleProducts = [
  {
    id: 1,
    name: 'Fresh Organic Bananas',
    price: 49,
    originalPrice: 59,
    discount: 17,
    rating: 4.5,
    reviews: 128,
    image: '/images/products/bananas.jpg',
    category: 'Fresh Produce',
    store: 'Sunshine Supermarket',
    deliveryTime: '15-20 min',
    isFresh: true,
    isSponsored: false,
  },
  {
    id: 2,
    name: 'Dove Soap - Pack of 3',
    price: 199,
    originalPrice: 249,
    discount: 20,
    rating: 4.8,
    reviews: 256,
    image: '/images/products/dove-soap.jpg',
    category: 'Personal Care',
    store: 'Daily Essentials',
    deliveryTime: '10-15 min',
    isFresh: false,
    isSponsored: true,
  },
  {
    id: 3,
    name: 'Bournvita - 500g',
    price: 299,
    originalPrice: 350,
    discount: 15,
    rating: 4.3,
    reviews: 89,
    image: '/images/products/bournvita.jpg',
    category: 'Beverages',
    store: 'Heritage Store',
    deliveryTime: '20-25 min',
    isFresh: false,
    isSponsored: false,
  },
  {
    id: 4,
    name: 'Sodium bicarbonate',
    price: 99,
    originalPrice: null,
    discount: 0,
    rating: 4.7,
    reviews: 342,
    image: '/images/products/baking-soda.jpg',
    category: 'Kitchen',
    store: 'QualityBakery',
    deliveryTime: '15-20 min',
    isFresh: true,
    isSponsored: false,
  },
  {
    id: 5,
    name: 'Amul Butter - 500g',
    price: 199,
    originalPrice: 229,
    discount: 13,
    rating: 4.9,
    reviews: 567,
    image: '/images/products/amul-butter.jpg',
    category: 'Dairy',
    store: 'Dairy Fresh',
    deliveryTime: '12-18 min',
    isFresh: true,
    isSponsored: false,
  },
  {
    id: 6,
    name: 'Lays Classic - 100g',
    price: 29,
    originalPrice: 35,
    discount: 17,
    rating: 4.2,
    reviews: 203,
    image: '/images/products/lays.jpg',
    category: 'Snacks',
    store: 'Snack Corner',
    deliveryTime: '10-15 min',
    isFresh: false,
    isSponsored: false,
  },
  {
    id: 7,
    name: 'Fresh Tomatoes - 1kg',
    price: 89,
    originalPrice: 99,
    discount: 10,
    rating: 4.6,
    reviews: 445,
    image: '/images/products/tomatoes.jpg',
    category: 'Fresh Produce',
    store: 'Sunrise Farms',
    deliveryTime: '15-20 min',
    isFresh: true,
    isSponsored: false,
  },
  {
    id: 8,
    name: 'Moderno Coffee - 250g',
    price: 199,
    originalPrice: 249,
    discount: 20,
    rating: 4.4,
    reviews: 189,
    image: '/images/products/coffee.jpg',
    category: 'Beverages',
    store: 'Coffee House',
    deliveryTime: '10-15 min',
    isFresh: false,
    isSponsored: false,
  },
];

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  const priceRanges = [
    { label: 'Under ₹100', min: 0, max: 100 },
    { label: '₹100 - ₹200', min: 100, max: 200 },
    { label: '₹200 - ₹500', min: 200, max: 500 },
    { label: 'Over ₹500', min: 500, max: 1000 },
  ];

  const stores = Array.from(new Set(sampleProducts.map(p => p.store)));

  const filteredProducts = sampleProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = !selectedPriceRange || (
        selectedPriceRange === 'Under ₹100' && product.price < 100 ||
        selectedPriceRange === '₹100 - ₹200' && product.price >= 100 && product.price <= 200 ||
        selectedPriceRange === '₹200 - ₹500' && product.price >= 200 && product.price <= 500 ||
        selectedPriceRange === 'Over ₹500' && product.price > 500
      );
      const matchesStore = selectedStores.length === 0 || selectedStores.includes(product.store);
      return matchesSearch && matchesPrice && matchesStore;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return b.id - a.id;
        case 'discount': return b.discount - a.discount;
        default: return b.isSponsored ? 1 : 0; // featured first
      }
    });

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

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      <Grid container spacing={4}>
        {/* Sidebar Filters */}
        <Grid item xs={12} md={3}>
          <Stack spacing={4}>
            {/* Search */}
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
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
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
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
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
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
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Store Filters
              </Typography>
              <Stack spacing={1}>
                {stores.map((store) => (
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
            {(selectedPriceRange || selectedStores.length > 0 || searchQuery) && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => {
                  setSelectedPriceRange(null);
                  setSelectedStores([]);
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                sx={{ py: 1, px: 2, alignSelf: 'flex-start' }}
              >
                Clear All Filters
              </Button>
            )}
          </Stack>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {/* Results Count */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              All Products ({filteredProducts.length})
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
          {(selectedPriceRange || selectedStores.length > 0) && (
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedPriceRange && (
                <Chip
                  label={`Price: ${selectedPriceRange}`}
                  size="small"
                  onDelete={() => setSelectedPriceRange(null)}
                  color="primary"
                />
              )}
              {selectedStores.map((store) => (
                <Chip
                  key={store}
                  label={`Store: ${store}`}
                  size="small"
                  onDelete={() => handleStoreClick(store)}
                  color="secondary"
                />
              ))}
            </Box>
          )}

          {/* Products Grid */}
          <Grid container spacing={3}>
            {filteredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                        fontWeight={600}
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '2.4rem',
                          fontSize: '1rem',
                        }}
                      >
                        {product.name}
                      </Typography>

                      {/* Rating */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {product.rating}
                        </Typography>
                        <Typography variant="body2} color="text.secondary" fontSize='0.75rem">
                          • {product.reviews} reviews
                        </Typography>
                      </Stack>

                      {/* Price */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h6" fontWeight={700} color="primary.main" fontSize='1.1rem'>
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
          {filteredProducts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6} color="text.secondary" sx={{ mb: 2 }}>
                No products found
              </Typography>
              <Typography variant="body2} color="text.secondary">
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