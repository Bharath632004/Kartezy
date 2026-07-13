"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, Link, TextField, CircularProgress, Alert } from '@mui/material';
import { LocalMall, Person, Shield, Description, Timeline, TimelineItem, TimelineConnector, TrendingUp, AccessTime, Group, Work, Handshake, Award, Scale, BusinessCenter, Store, LocalShipping, LocalAtm, CreditCard, Wallet, Redeem } from '@mui/icons/material';
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

const MerchantLandingPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from API
        // For now, mock data
        const mockStats = [
          { title: 'Active Merchants', value: '1,200+', icon: Store, color: 'success' },
          { title: 'Average Monthly Revenue', value: '₹2.5L+', icon: TrendingUp, color: 'success' },
          { title: 'Cities Covered', value: '10+', icon: LocationOn, color: 'info' },
          { title: 'Customer Base', value: '500K+', icon: Group, color: 'success' },
        ];
        setStats(mockStats);
      } catch (err) {
        setError('Failed to load stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleSignUp = () => {
    // Redirect to merchant registration
    // In a real app, we would use router.push
    window.location.href = '/merchant/register';
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Sell on Kartify
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reach millions of customers and grow your business with India's fastest grocery delivery platform
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 6, py: 2 }}
            onClick={handleSignUp}
          >
            Join as a Merchant
          </Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <LocalMall fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Instant Online Presence
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get your own online storefront on Kartify within minutes. No technical expertise needed.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <Shield fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Secure & Reliable Payments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We handle all payment processing securely. Get paid directly to your bank account weekly.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <LocalShipping fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Hassle-Free Logistics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our dedicated delivery network ensures timely delivery to customers doorstep.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <Handshake fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Dedicated Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our merchant success team is available 24/7 to help you grow your business.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <TimelineIcon fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Real-Time Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track sales inventory and customer insights with our easy-to-use dashboard.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <DiscountIcon fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Marketing & Promotions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Participate in platform-wide campaigns and create your own discounts to boost sales.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Typography variant="h3" fontWeight={600} sx={{ mb: 4 }}>
            Join Thousands of Successful Merchants
          </Typography>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <fontSize={36} color={stat.color} sx={{ mb: 1 }} />
                      </Box>
                      <Typography variant="h4" fontWeight={600} color={stat.color}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6 }}>
        <CardContent>
          <Typography variant="h3" fontWeight={600} sx={{ mb: 4 }}>
            How It Works
          </Typography>
          <Timeline alignLeft>
            <TimelineItem>
              <TimelineConnector />
              <Box sx={{ flexGrow: 1 }}>
                <TimerIcon fontSize={30} color="primary.main" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Sign Up
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Register as a merchant in minutes with basic business details.
                </Typography>
              </Box>
            </TimelineItem>
            <TimelineItem>
              <Connector />
              <Box sx={{ flexGrow: 1 }}>
                <StoreIcon fontSize={30} color="primary.main" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  List Your Products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload your product catalog set prices and manage inventory.
                </Typography>
              </Box>
            </TimelineItem>
            <TimelineItem>
              <Connector />
              <Box sx={{ flexGrow: 1 }}>
                <ShoppingCartIcon fontSize={30} color="primary.main" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Receive Orders
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get notified instantly when customers place orders from your store.
                </Typography>
              </Box>
            </TimelineItem>
            <TimelineItem>
              <Connector />
              <Box sx={{ flexGrow: 1 }}>
                <LocalShippingIcon fontSize={30} color="primary.main" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  We Handle Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our delivery partners pick up and deliver orders to customers doorstep.
                </Typography>
              </Box>
            </TimelineItem>
            <TimelineItem>
              <Connector />
              <Box sx={{ flexGrow: 1 }}>
                <PaymentIcon fontSize={30} color="primary.main" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Get Paid
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive weekly payouts directly to your bank account minus our commission.
                </Typography>
              </Box>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MerchantLandingPage;