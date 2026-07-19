"use client";

import { Box, Container, Typography, Card, CardContent, Button, Divider } from '@mui/material';
import { Share, Wallet, Group, History } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const ReferralPage = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/referral');
      if (!response.ok) throw new Error('Failed to fetch referral data');
      const data = await response.json();
      setReferralData(data);
    } catch (err) {
      setError('Failed to load referral data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReferralData(); }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Kartezy',
          text: `Use my referral code ${referralData.referralCode} to get started!`,
          url: window.location.origin,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopyCode();
    }
  };

  if (loading) return <div>Loading referral data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Refer and Earn
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Share your love for Kartify and earn rewards
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Group fontSize={48} color="primary.main" sx={{ mb: 2 }} />
            <Typography variant="h3" fontWeight={600} sx={{ mb: 1 }}>
              Referral Program
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share your referral code and earn rewards when friends join and shop
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Your Referral Code
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '8px 16px', borderRadius: 4 }}>
                <Typography variant="body2" fontWeight={600} letterSpacing="0.5px">
                  {referralData.referralCode}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                sx={{ px: 2, py: 1 }}
                onClick={handleCopyCode}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ px: 2, py: 1 }}
                onClick={handleShare}
                startIcon={<Share fontSize="small" />}
              >
                Share
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Your Earnings
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 4 }}>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Wallet fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Total Earned
                </Typography>
                <Typography variant="h4" fontWeight={600} color="primary.main">
                  ₹{referralData.totalEarned}
                </Typography>
              </Card>

              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <History fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Referred Friends
                </Typography>
                <Typography variant="h4" fontWeight={600} color="primary.main">
                  {referralData.referredFriends}
                </Typography>
              </Card>

              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <PendingActions fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Pending Earnings
                </Typography>
                <Typography variant="h4" fontWeight={600} color="warning.main">
                  ₹{referralData.pendingEarnings}
                </Typography>
              </Card>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Rewards & Milestones
            </Typography>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
              {referralData.rewards.map((reward) => (
                <Box key={reward.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderBottom: reward.id !== referralData.rewards[referralData.rewards.length - 1].id ? '1px solid #f0f0f0' : 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {reward.status === 'completed' ? (
                      <CheckCircle fontSize={20} color="success.main" sx={{ mr: 2 }} />
                    ) : (
                      <HourglassEmpty fontSize={20} color="warning.main" sx={{ mr: 2 }} />
                    )}
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.2 }}>
                        {reward.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {reward.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right' }}>
                    {reward.status === 'completed' ? (
                      <Span>Earned on {new Date(reward.date).toLocaleDateString()}</Span>
                    ) : (
                      <Span>Earn when you reach {referralData.referredFriends}/15 referrals</Span>
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReferralPage;