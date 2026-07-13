"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, Link, TextField, CircularProgress, Alert } from '@mui/material';
import { LocalMall, Person, Shield, Description, Timeline, TimelineItem, TimelineConnector, LocalShipping, LocalTruck, AccessTime, Group, Work, Handshake, Award, Scale, BusinessCenter, Store, LocalAtm, CreditCard, Wallet, Redeem, LocalGasStation, EvStation, DirectionsCar, DirectionsBike, DirectionsWalk, Motorcycle, PedalBike, PedalBike } from '@mui/icons/material';
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

const DeliveryLandingPage = () => {
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
          { title: 'Active Delivery Partners', value: '8,000+', icon: Person, color: 'success' },
          { title: 'Average Earnings per Trip', value: '₹150-250', icon: LocalAtm, color: 'success' },
          { title: 'Monthly Earnings Potential', value: '₹25,000+', icon: Wallet, color: 'success' },
          { title: 'Cities Covered', value: '10+', icon: LocationOn, color: 'info' },
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
    // Redirect to delivery partner registration
    // In a real app, we would use router.push
    window.location.href = '/delivery/register';
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Earn as a Delivery Partner
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Join our fleet and earn money by delivering groceries on your schedule
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 6, py: 2 }}
            onClick={handleSignUp}
          >
            Start Delivering
          </Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <LocalTsunami fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Flexible Working Hours
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Work when you want where you want. Choose your own shifts and areas.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <EarnIcon fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Earn Per Delivery
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Earn a fixed amount per delivery plus tips from customers. No hidden fees.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <LocalShipping fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Keep 100% of Tips
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All tips go directly to you. We don't take a commission on your tips.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <MapIcon fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Easy Navigation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our partner app provides optimized routes and real-time order updates.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <Shield fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Safety & Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We provide safety gear insurance and 24/7 support for all delivery partners.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                <CardContent>
                  <ElectricScooterIcon fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Vehicle Options
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deliver by bike scooter or car. Choose what works best for you.
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
            Join Thousands of Delivery Partners
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
                        {stat.icon && <stat.icon fontSize={36} color={stat.color} />}
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
                <PersonAddIcon fontSize={30} color="primary.main" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Sign Up
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Register with your documents vehicle details and bank information.
                </Typography>
              </Box>
            </TimelineItem>
            <TimelineItem>
              <Connector />
              <Box sx={{ flexGrow: 1 }}>
                <CheckCircleIcon fontSize={30} color="primary.main" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Get Approved
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete a brief orientation and background check to start accepting orders.
                </Typography>
              </Box>
            </TimelineItem>
            <TimelineItem>
              <Connector />
              <Box sx={{ flexGrow: 1 }}>
                <AccessTimeIcon fontSize={30} color="primary.main" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Go Online
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toggle your availability in the app and start receiving order requests.
                </Typography>
              </Box>
            </TimelineItem>
            <TimelineItem>
              <Connector />
              <Box sx={{ flexGrow: 1 }}>
                <LocalTruckIcon fontSize={30} color="primary.main" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Accept & Deliver
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accept orders navigate to the store pickup items and deliver to customers.
                </Typography>
              </Box>
            </TimelineItem>
            <TimelineItem>
              <Connector />
              <Box sx={{ flexGrow: 1 }}>
                <LocalAtmIcon fontSize={30} color="primary.main" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Get Paid
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Earnings are credited to your wallet weekly with instant withdrawals available.
                </Typography>
              </Box>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6 }}>
        <CardContent>
          <Typography variant="h3" fontWeight={600} sx={{ mb: 4 }}>
            Vehicle Requirements
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 3 }}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <PedalBikeIcon fontSize={28} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Bicycle
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Any functional bicycle. Helmet and lock required.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <MotorcycleIcon fontSize={28} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Motorcycle/Scooter
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Two-wheeler with valid license registration and insurance.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <DirectionsCarIcon fontSize={28} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Car
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Four-wheeler with valid license registration and insurance.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DeliveryLandingPage;