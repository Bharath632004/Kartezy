"use client";

import { Box, Container, Typography, Card, CardContent, Button, Chip, CircularProgress } from '@mui/material';
import { LocalOffer, Favorite } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, groceries, electronics, fashion, etc.

  const fetchOffers = async (categoryFilter) => {
    try {
      setLoading(true);
      const params = categoryFilter !== 'all' ? `?category=${categoryFilter}` : '';
      const response = await fetch(`/api/offers${params}`);
      if (!response.ok) throw new Error('Failed to fetch offers');
      const data = await response.json();
      setOffers(data);
    } catch (err) {
      setError('Failed to load offers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(filter); }, [filter]);

  const handleViewOffer = (offerId) => {
    window.location.href = `/offers/${offerId}`;
  };

  const filteredOffers = filter === 'all'
    ? offers
    : offers.filter(offer => offer.category.toLowerCase() === filter.toLowerCase());

  const handleViewOffer = (offerId) => {
    // In a real app, we would navigate to an offer details page
    alert(`Viewing offer ${offerId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Special Offers & Deals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Save big on your favorite products with our exclusive offers
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Browse Offers by Category
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                selected={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All Categories
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                selected={filter === 'groceries'}
                onClick={() => setFilter('groceries')}
              >
                Groceries
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                selected={filter === 'snacks'}
                onClick={() => setFilter('snacks')}
              >
                Snacks
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                selected={filter === 'dairy'}
                onClick={() => setFilter('dairy')}
              >
                Dairy
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                selected={filter === 'personal-care'}
                onClick={() => setFilter('personal-care')}
              >
                Personal Care
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                selected={filter === 'beverages'}
                onClick={() => setFilter('beverages')}
              >
                Beverages
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                selected={filter === 'breakfast'}
                onClick={() => setFilter('breakfast')}
              >
                Breakfast
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="error.main">
                {error}
              </Typography>
            </Box>
          ) : filteredOffers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary">
                No offers found for this category
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 4 }}>
              {filteredOffers.map((offer) => (
                <Card
                  key={offer.id}
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                    border: offer.isFeatured ? '2px solid #1976d2' : 'none',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    {offer.isFeatured && (
                      <Box sx={{ mb: 2 }}>
                        <Chip label="FEATURED" size="small" color="primary" />
                      </Box>
                    )}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {offer.title}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {offer.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h4" fontWeight={600} color="primary.main">
                        {offer.discount}
                      </Typography>
                      <Chip
                        label={offer.store}
                        size="small"
                        sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ px: 2, py: 1 }}
                        onClick={() => handleViewOffer(offer.id)}
                      >
                        View Deal
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ px: 2, py: 1 }}
                        onClick={() => {/* Add to favorites or share */}}
                      >
                        <Favorite fontSize="small" sx={{ mr: 1 }} />
                        Save
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default OffersPage;