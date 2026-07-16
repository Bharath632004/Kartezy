"use client";

import { Box, Container, Typography, Card, CardContent, Button, Divider, Chip, LinearProgress, CircularProgress, Alert, Snackbar, Grid } from '@mui/material';
import { CardMembership, StarBorder, CheckCircle, LocalOffer } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const MembershipPage = () => {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadMembership = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/membership');
      setMembership(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please log in to view membership');
      } else if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to load membership');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMembership(); }, [loadMembership]);

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      const res = await api.post('/api/membership/upgrade');
      setMembership(res.data);
      setSnackbar({ open: true, message: 'Membership upgraded!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Upgrade failed', severity: 'error' });
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) return (
    <Container maxWidth="xl" sx={{ py: 6, textAlign: 'center' }}>
      <CircularProgress /><Typography sx={{ mt: 2 }}>Loading membership...</Typography>
    </Container>
  );

  if (error) return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button variant="outlined" onClick={loadMembership}>Retry</Button>
    </Container>
  );

  if (!membership) return (
    <Container maxWidth="xl" sx={{ py: 6, textAlign: 'center' }}>
      <CardMembership sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h5" sx={{ mb: 1 }}>No Active Membership</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Join our membership program for exclusive benefits</Typography>
      <Button variant="contained" onClick={handleUpgrade} disabled={upgrading}>
        {upgrading ? <CircularProgress size={24} /> : 'Join Now'}
      </Button>
    </Container>
  );

  const pointsProgress = membership.points && membership.pointsToNextLevel
    ? (membership.points / (membership.points + membership.pointsToNextLevel)) * 100
    : 50;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>Kartezy Membership</Typography>
        <Typography variant="body1" color="text.secondary">Unlock exclusive benefits and rewards</Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: { xs: 3, md: 6 }, mb: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <CardMembership sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" fontWeight={600} sx={{ mb: 1 }}>{membership.level} Member</Typography>
            {membership.joinedSince && (
              <Typography variant="body2" color="text.secondary">Member since {membership.joinedSince}</Typography>
            )}
            {membership.expiresIn && (
              <Typography variant="body2" color="text.secondary">Expires in {membership.expiresIn}</Typography>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Benefits */}
          {membership.benefits?.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Membership Benefits</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {membership.benefits.map((benefit, idx) => (
                  <Chip key={idx} icon={<CheckCircle />} label={benefit} variant="outlined" color="primary" />
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Loyalty Points */}
          {membership.points !== undefined && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Loyalty Points</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <StarBorder sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={600}>{membership.points.toLocaleString()} Points</Typography>
                  {membership.pointsToNextLevel && (
                    <Typography variant="body2" color="text.secondary">
                      {membership.pointsToNextLevel} points to reach {membership.nextLevel}
                    </Typography>
                  )}
                </Box>
              </Box>
              {membership.pointsToNextLevel && (
                <>
                  <LinearProgress variant="determinate" value={pointsProgress}
                    sx={{ height: 10, borderRadius: 5, mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">{membership.points} pts</Typography>
                    <Typography variant="caption" color="text.secondary">{membership.points + membership.pointsToNextLevel} pts</Typography>
                  </Box>
                </>
              )}
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Activity */}
          {membership.recentActivity?.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Recent Activity</Typography>
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                {membership.recentActivity.map((activity, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    px: 3, py: 2, borderBottom: idx < membership.recentActivity.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {activity.type === 'earned' ? <StarBorder color="primary" /> : <LocalOffer color="primary" />}
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{activity.description}</Typography>
                        <Typography variant="caption" color="text.secondary">{activity.date}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight={600} color={activity.type === 'earned' ? 'success.main' : 'text.primary'}>
                      {activity.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {membership.nextLevel && (
            <Box sx={{ textAlign: 'right' }}>
              <Button variant="contained" onClick={handleUpgrade} disabled={upgrading}>
                {upgrading ? <CircularProgress size={24} /> : `Upgrade to ${membership.nextLevel}`}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Membership Plans */}
      <Typography variant="h3" fontWeight={600} sx={{ mb: 4, textAlign: 'center' }}>Choose Your Plan</Typography>
      <Grid container spacing={4} justifyContent="center">
        {[
          { name: 'Silver', price: 'Free', benefits: ['Free delivery on orders above ₹199', 'Basic support', 'Standard delivery slots'], color: 'grey' },
          { name: 'Gold', price: '₹199/mo', benefits: ['Free delivery on all orders', '2x loyalty points', 'Priority support', 'Exclusive deals'], color: 'primary', featured: true },
          { name: 'Platinum', price: '₹499/mo', benefits: ['Everything in Gold', '5x loyalty points', '24/7 dedicated support', 'Early sale access', 'Priority booking'], color: 'warning' }
        ].map((plan, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{ borderRadius: 4, boxShadow: plan.featured ? '0 8px 32px rgba(25,118,210,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
              border: plan.featured ? '2px solid #1976d2' : 'none', position: 'relative', overflow: 'visible' }}>
              {plan.featured && (
                <Chip label="BEST VALUE" color="primary" size="small"
                  sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontWeight: 700 }} />
              )}
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>{plan.name}</Typography>
                <Typography variant="h4" fontWeight={700} color={`${plan.color}.main`} sx={{ mb: 3 }}>{plan.price}</Typography>
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  {plan.benefits.map((b, j) => (
                    <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                      <CheckCircle sx={{ fontSize: 18, color: 'success.main' }} />
                      <Typography variant="body2">{b}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button variant={plan.featured ? 'contained' : 'outlined'} fullWidth
                  onClick={() => { setSnackbar({ open: true, message: `${plan.name} plan selected`, severity: 'success' }); }}>
                  {plan.name === 'Silver' ? 'Current Plan' : plan.price === 'Free' ? 'Get Started' : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MembershipPage;
