"use client";

import { Box, Container, Typography, Card, CardContent, Button, Divider, Grid, CircularProgress, Alert } from '@mui/material';
import { Person, LocalAtm, Wallet, LocationOn, Shield, AccessTime, LocalShipping, ElectricScooter, CheckCircle } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const DeliveryLandingPage = () => {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/delivery/stats');
      setStats(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Failed to load stats');
      }
      setStats({ activePartners: '0', avgEarnings: '₹0', monthlyPotential: '₹0', cities: '0' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const features = [
    { icon: AccessTime, title: 'Flexible Hours', desc: 'Work when you want. Choose your own shifts.' },
    { icon: LocalAtm, title: 'Earn Per Delivery', desc: 'Fixed amount per delivery plus tips. No hidden fees.' },
    { icon: Wallet, title: 'Keep 100% Tips', desc: 'All tips go directly to you.' },
    { icon: LocationOn, title: 'Easy Navigation', desc: 'Optimized routes and real-time updates.' },
    { icon: Shield, title: 'Safety & Support', desc: 'Safety gear, insurance, and 24/7 support.' },
    { icon: ElectricScooter, title: 'Vehicle Options', desc: 'Deliver by bike, scooter, or car.' }
  ];

  const steps = [
    { icon: '1', title: 'Sign Up', desc: 'Register with your documents and bank info.' },
    { icon: '2', title: 'Get Approved', desc: 'Complete orientation to start accepting orders.' },
    { icon: '3', title: 'Go Online', desc: 'Toggle availability and receive requests.' },
    { icon: '4', title: 'Deliver & Earn', desc: 'Pick up items, deliver, and get paid.' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>Earn as a Delivery Partner</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Join our fleet and earn money delivering groceries on your schedule
        </Typography>
        <Button variant="contained" size="large" sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
          onClick={() => router.push('/delivery/register')}>
          Start Delivering
        </Button>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: { xs: 3, md: 6 }, mb: 4 }}>
        <CardContent>
          <Typography variant="h3" fontWeight={600} sx={{ mb: 4, textAlign: 'center' }}>Join Thousands of Partners</Typography>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
          ) : (
            <Grid container spacing={3}>
              {[
                { value: stats?.activePartners ?? '8,000+', label: 'Active Partners', icon: Person },
                { value: stats?.avgEarnings ?? '₹150-250', label: 'Avg per Trip', icon: LocalAtm },
                { value: stats?.monthlyPotential ?? '₹25,000+', label: 'Monthly Potential', icon: Wallet },
                { value: stats?.cities ?? '10+', label: 'Cities Covered', icon: LocationOn }
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

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: { xs: 3, md: 6 }, mb: 4 }}>
        <CardContent>
          <Typography variant="h3" fontWeight={600} sx={{ mb: 4, textAlign: 'center' }}>Why Partner With Us?</Typography>
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

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: { xs: 3, md: 6 } }}>
        <CardContent>
          <Typography variant="h3" fontWeight={600} sx={{ mb: 4, textAlign: 'center' }}>How It Works</Typography>
          <Grid container spacing={3} justifyContent="center">
            {steps.map((step, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
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
            <Button variant="contained" size="large" onClick={() => router.push('/delivery/register')}>
              Apply Now
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DeliveryLandingPage;
