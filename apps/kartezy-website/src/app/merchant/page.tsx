"use client";

import { Box, Container, Typography, Card, CardContent, Button, Divider, Grid, CircularProgress, Alert } from '@mui/material';
import { Store, TrendingUp, Group, LocationOn, LocalShipping, Shield, Handshake, Timeline, Payment } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const MerchantLandingPage = () => {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/merchants/stats');
      setStats(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Failed to load stats');
      }
      setStats({ activeMerchants: '0', avgRevenue: '₹0', cities: '0', customerBase: '0' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const features = [
    { icon: Store, title: 'Instant Online Presence', desc: 'Get your storefront on Kartezy in minutes. No technical expertise needed.' },
    { icon: Shield, title: 'Secure & Reliable Payments', desc: 'We handle all payment processing. Get paid directly to your bank weekly.' },
    { icon: LocalShipping, title: 'Hassle-Free Logistics', desc: 'Our delivery network ensures timely doorstep delivery to customers.' },
    { icon: Handshake, title: 'Dedicated Support', desc: 'Merchant success team available 24/7 to help you grow.' },
    { icon: Timeline, title: 'Real-Time Analytics', desc: 'Track sales, inventory, and customer insights on your dashboard.' },
    { icon: Payment, title: 'Marketing & Promotions', desc: 'Participate in campaigns and create discounts to boost sales.' }
  ];

  const howItWorks = [
    { icon: '1', title: 'Sign Up', desc: 'Register as a merchant with basic business details.' },
    { icon: '2', title: 'List Products', desc: 'Upload your catalog, set prices, and manage inventory.' },
    { icon: '3', title: 'Receive Orders', desc: 'Get notified instantly when customers place orders.' },
    { icon: '4', title: 'We Deliver', desc: 'Our partners pick up and deliver to customers.' },
    { icon: '5', title: 'Get Paid', desc: 'Receive weekly payouts directly to your bank.' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Hero */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>Sell on Kartezy</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Reach millions of customers and grow your business with India&apos;s fastest grocery delivery platform
        </Typography>
        <Button variant="contained" size="large" sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
          onClick={() => router.push('/merchant/register')}>
          Join as a Merchant
        </Button>
      </Box>

      {/* Stats */}
      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: { xs: 3, md: 6 }, mb: 4 }}>
        <CardContent>
          <Typography variant="h3" fontWeight={600} sx={{ mb: 4, textAlign: 'center' }}>Join Thousands of Successful Merchants</Typography>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
          ) : (
            <Grid container spacing={3}>
              {[
                { value: stats?.activeMerchants ?? '1,200+', label: 'Active Merchants', icon: Group },
                { value: stats?.avgRevenue ?? '₹2.5L+', label: 'Avg Monthly Revenue', icon: TrendingUp },
                { value: stats?.cities ?? '10+', label: 'Cities Covered', icon: LocationOn },
                { value: stats?.customerBase ?? '500K+', label: 'Customer Base', icon: Group }
              ].map((stat, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card sx={{ p: 3, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <stat.icon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight={700} color="primary.main">{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: { xs: 3, md: 6 }, mb: 4 }}>
        <CardContent>
          <Typography variant="h3" fontWeight={600} sx={{ mb: 4, textAlign: 'center' }}>Why Sell on Kartezy?</Typography>
          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ p: 3, borderRadius: 4, height: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <f.icon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: { xs: 3, md: 6 } }}>
        <CardContent>
          <Typography variant="h3" fontWeight={600} sx={{ mb: 4, textAlign: 'center' }}>How It Works</Typography>
          <Grid container spacing={3} justifyContent="center">
            {howItWorks.map((step, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'primary.main', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, mx: 'auto', mb: 2 }}>
                    {step.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" size="large" onClick={() => router.push('/merchant/register')}>
              Start Selling Today
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MerchantLandingPage;
