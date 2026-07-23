"use client";

import { Box, Container, Typography, Card, CardContent, Button, Divider, Chip, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Group, Share, Wallet, History, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const ReferralPage = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadReferralData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/referrals');
      setReferralData(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please log in to view referral data');
      } else {
        setError(err.response?.data?.message || 'Failed to load referral data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReferralData(); }, [loadReferralData]);

  const handleCopyCode = async () => {
    if (!referralData?.referralCode) return;
    try {
      await navigator.clipboard.writeText(referralData.referralCode);
      setCopied(true);
      setSnackbar({ open: true, message: 'Referral code copied!', severity: 'success' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setSnackbar({ open: true, message: 'Failed to copy', severity: 'warning' });
    }
  };

  const handleShare = async () => {
    if (!referralData?.referralCode) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Kartezy',
          text: `Use my referral code ${referralData.referralCode} to get discounts on Kartezy!`,
          url: `${window.location.origin}/auth/register?ref=${referralData.referralCode}`
        });
      } catch { /* user cancelled */ }
    } else {
      handleCopyCode();
    }
  };

  if (loading) return (
    <Container maxWidth="xl" sx={{ py: 6, textAlign: 'center' }}>
      <CircularProgress /><Typography sx={{ mt: 2 }}>Loading referral data...</Typography>
    </Container>
  );

  if (error) return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button variant="outlined" onClick={loadReferralData}>Retry</Button>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 600  sx={{ mb: 2 }}>Refer and Earn</Typography>
        <Typography variant="body1" color="text.secondary">Share and earn rewards with every friend who joins</Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: { xs: 3, md: 6 }, mb: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Group sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 600  sx={{ mb: 1 }}>Referral Program</Typography>
            <Typography variant="body2" color="text.secondary">Share your code and earn rewards</Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600  sx={{ mb: 2 }}>Your Referral Code</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', px: 4, py: 2, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }} letterSpacing={2} fontFamily="monospace">
                  {referralData?.referralCode || '------'}
                </Typography>
              </Box>
              <Button variant="outlined" onClick={handleCopyCode}>{copied ? 'Copied!' : 'Copy'}</Button>
              <Button variant="outlined" startIcon={<Share />} onClick={handleShare}>Share</Button>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600  sx={{ mb: 2 }}>Your Earnings</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Wallet sx={{ fontSize: 32, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 1 }}>Total Earned</Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }} color="primary.main">
                  ₹{(referralData?.totalEarned ?? 0).toLocaleString('en-IN')}
                </Typography>
              </Card>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <History sx={{ fontSize: 32, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 1 }}>Referred Friends</Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }} color="primary.main">{referralData?.referredFriends ?? 0}</Typography>
              </Card>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <HourglassEmpty sx={{ fontSize: 32, color: 'warning.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 1 }}>Pending</Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }} color="warning.main">
                  ₹{(referralData?.pendingEarnings ?? 0).toLocaleString('en-IN')}
                </Typography>
              </Card>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600  sx={{ mb: 2 }}>Rewards & Milestones</Typography>
            {(!referralData?.rewards || referralData.rewards.length === 0) ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No rewards yet. Start referring friends!</Typography>
            ) : (
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                {referralData.rewards.map((reward, idx) => (
                  <Box key={reward.id || idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    px: 3, py: 2, borderBottom: idx < referralData.rewards.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      {reward.status === 'completed'
                        ? <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
                        : <HourglassEmpty sx={{ color: 'warning.main', mr: 2 }} />}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{reward.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{reward.description}</Typography>
                      </Box>
                    </Box>
                    <Chip label={reward.status} size="small" color={reward.status === 'completed' ? 'success' : 'warning'} sx={{ ml: 2 }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ReferralPage;
