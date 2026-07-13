"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, Link } from '@mui/material';
import { LocalOffer, LocalMall, Store, Receipt, Wallet, CardGiftcard, History, Favorite, Share } from '@mui/icons-material';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, groceries, electronics, fashion, etc.

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from API
        // For now, we'll use mock data
        const mockOffers = [
          {
            id: '1',
            title: 'Flat 50% Off on Fruits & Vegetables',
            description: 'Get fresh produce at half the price. Limited time offer!',
            discount: '50% OFF',
            validUntil: '2023-06-30',
            image: 'https://example.com/offer1.jpg',
            category: 'Groceries',
            store: 'FreshMart',
            isFeatured: true,
          },
          {
            id: '2',
            title: 'Buy 1 Get 1 Free on Snacks',
            description: 'Enjoy your favorite snacks with this BOGO offer.',
            discount: 'BOGO',
            validUntil: '2023-06-25',
            image: 'https://example.com/offer2.jpg',
            category: 'Snacks',
            store: 'SnackHub',
            isFeatured: true,
          },
          {
            id: '3',
            title: 'Flat 30% Off on Dairy Products',
            description: 'Get milk, cheese, yogurt and more at discounted prices.',
            discount: '30% OFF',
            validUntil: '2023-06-28',
            image: 'https://example.com/offer3.jpg',
            category: 'Dairy',
            store: 'DailyDairy',
            isFeatured: false,
          },
          {
            id: '4',
            title: 'Extra 20% Off on Personal Care',
            description: 'Save on shampoos, soaps, skincare and more.',
            discount: '20% OFF',
            validUntil: '2023-06-27',
            image: 'https://example.com/offer4.jpg',
            category: 'Personal Care',
            store: 'CarePlus',
            isFeatured: false,
          },
          {
            id: '5',
            title: 'Flat 40% Off on Beverages',
            description: 'Quench your thirst with our beverage selection.',
            discount: '40% OFF',
            validUntil: '2023-06-29',
            image: 'https://example.com/offer5.jpg',
            category: 'Beverages',
            store: 'SipStation',
            isFeatured: false,
          },
          {
            id: '6',
            title: 'Special Combo: Breakfast Essentials',
            description: 'Get bread, eggs, milk and juice at a special price.',
            discount: 'Combo Deal',
            validUntil: '2023-06-26',
            image: 'https://example.com/offer6.jpg',
            category: 'Breakfast',
            store: 'MorningMart',
            isFeatured: false,
          },
        ];
        setOffers(mockOffers);
      } catch (err) {
        setError('Failed to load offers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, [filter]);

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