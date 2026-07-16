"use client";

import { Box, Container, Typography, Card, CardContent, Button, Chip, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Favorite, LocalOffer } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const CATEGORIES = ['all', 'groceries', 'snacks', 'dairy', 'beverages', 'breakfast', 'personal-care'];

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [savedOffers, setSavedOffers] = useState(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? { category: filter } : {};
      const res = await api.get('/api/offers', { params });
      setOffers(res.data.offers ?? res.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { loadOffers(); }, [loadOffers]);

  const handleSaveOffer = async (offerId) => {
    try {
      await api.post(`/api/offers/${offerId}/save`);
      setSavedOffers(prev => { const next = new Set(prev); next.add(offerId); return next; });
      setSnackbar({ open: true, message: 'Offer saved!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to save offer', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>Special Offers & Deals</Typography>
        <Typography variant="body1" color="text.secondary">Save big on your favorite products</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
        {CATEGORIES.map(cat => (
          <Button key={cat} variant={filter === cat ? 'contained' : 'outlined'} size="small"
            onClick={() => setFilter(cat)} sx={{ textTransform: 'capitalize' }}>
            {cat === 'all' ? 'All Categories' : cat.replace('-', ' ')}
          </Button>
        ))}
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="outlined" onClick={loadOffers}>Retry</Button>
        </Box>
      ) : offers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No offers found</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {offers.map(offer => (
            <Card key={offer.id} sx={{ borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
              border: offer.isFeatured ? '2px solid #1976d2' : 'none' }}>
              <CardContent sx={{ p: 3 }}>
                {offer.isFeatured && <Chip label="FEATURED" size="small" color="primary" sx={{ mb: 1 }} />}
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>{offer.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{offer.description}</Typography>
                {offer.validUntil && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    Valid till: {new Date(offer.validUntil).toLocaleDateString('en-IN')}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" fontWeight={700} color="primary.main">{offer.discount}</Typography>
                  {offer.store && <Chip label={offer.store} size="small" sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }} />}
                </Box>
                <Button variant="contained" fullWidth onClick={() => handleSaveOffer(offer.id)}
                  startIcon={<Favorite />} disabled={savedOffers.has(offer.id)}>
                  {savedOffers.has(offer.id) ? 'Saved' : 'Save Offer'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default OffersPage;
