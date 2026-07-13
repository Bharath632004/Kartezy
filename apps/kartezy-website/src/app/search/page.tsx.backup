sx={{ display: showFilters ? 'block' : 'none' }}},
          {
            xs: 12,
            md: 3,
            component: motion.div
          },
          layout: 'position'
        }},
        {
          item: 'filters-panel',
          children: {
            xs: 12,
            md: 3,
            component: motion.div,
            layout: 'position',
            sx: {
              display: showFilters ? 'block' : 'none'
            }
          }
        }
      }>

        {/* Filters Panel */}
        <Grid item xs={12} md={3} sx={{ display: showFilters ? 'block' : 'none' }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight={600}>
                Filters
              </Typography>

              {/* Categories */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Categories
                </Typography>
                <Stack spacing={1}>
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      variant={selectedCategory === category ? 'filled' : 'outlined'}
                      color={selectedCategory === category ? 'primary' : 'default'}
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      sx={{ justifyContent: 'flex-start' }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Price Range */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Price Range
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </Typography>
              </Box>

              {/* Sort Options */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
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
                      sx={{ justifyContent: 'flex-start', py: 1 }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Stack>
              </Box>

              {/* Clear Filters */}
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearFilters}
                startIcon={<Close />}
                sx={{ py: 1 }}
              >
                Clear All Filters
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Search Results */}
        <Grid item xs={12} md={9}>
          {/* Active Filters */}
          {(selectedCategory || searchQuery) && (
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                Active Filters:
              </Typography>
              {selectedCategory && (
                <Chip
                  label={`Category: ${selectedCategory}`}
                  size="small"
                  onDelete={() => setSelectedCategory(null)}
                  color="primary"
                />
              )}
              {searchQuery && (
                <Chip
                  label={`Search: ${searchQuery}`}
                  size="small"
                  onDelete={() => setSearchQuery('')}
                  color="secondary"
                />
              )}
            </Box>
          )}

          {/* Results Grid */}
          <Grid container spacing={3}>
            {filteredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
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
                      }}
                    >
                      <Typography variant="h3" color="text.secondary">
                        ₹{product.price}
                      </Typography>
                    </Box>
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
                          <Typography variant="body2" color="text.secondary">
                            {product.deliveryTime}
                          </Typography>
                          <AccessTime sx={{ fontSize: '1rem', color: '#4caf50' }} />
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
                        }}
                      >
                        {product.name}
                      </Typography>

                      {/* Rating */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {product.rating}
                        </Typography>
                        <Typography variant="body2} color="text.secondary">
                          • {product.reviews} reviews
                        </Typography>
                      </Stack>

                      {/* Price */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
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
                            <Chip
                              label={`${product.discount}% OFF`}
                              size="small"
                              color="error"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>

                  {/* Add to cart button */}
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: '#ff6b35',
                        '&:hover': {
                          backgroundColor: '#e55a2b',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(255,107,53,0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No products found
              </Typography>
              <Typography variant="body1} color="text.secondary">
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="outlined" size="small" disabled>
              Previous
            </Button>
            <Chip label="1" color="primary" />
            <Button variant="outlined" size="small">
              Next
            </Button>
          </Stack>
        </Box>
      )}
    </Container>
  );
};

export default SearchPage;