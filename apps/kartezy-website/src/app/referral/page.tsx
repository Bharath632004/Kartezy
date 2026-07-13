"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, TextField, Avatar, Link as MuiLink } from '@mui/material';
import { Person, LocalOffer, Share, Wallet, History, Receipt, Group, Lock, Redeem, Analytics } from '@mui/icons-material';
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

const ReferralPage = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadReferralData = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from API
        // For now, we'll use mock data
        const mockData = {
          referralCode: 'KRTZ789',
          referredFriends: 12,
          earnings: 2400, // ₹2400
          pendingEarnings: 300, // ₹300
          totalEarned: 2700, // ₹2700
          rewards: [
            {
              id: 1,
              title: 'First Referral',
              description: 'Earn ₹100 when your friend places their first order',
              status: 'completed',
              date: '2023-05-10',
            },
            {
              id: 2,
              title: 'Five Referrals Bonus',
              description: 'Earn an extra ₹500 when you refer 5 friends',
              status: 'completed',
              date: '2023-05-12',
            },
            {
              id: 3,
              title: 'Ten Referrals Bonus',
              description: 'Earn an extra ₹1000 when you refer 10 friends',
              status: 'completed',
              date: '2023-05-15',
            },
            {
              id: 4,
              title: 'Fifteen Referrals Bonus',
              description: 'Earn an extra ₹1500 when you refer 15 friends',
              status: 'pending',
              date: '2023-05-20',
            },
          ],
        };
        setReferralData(mockData);
      } catch (err) {
        setError('Failed to load referral data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReferralData();
  }, []);

  const handleCopyCode = () => {
    // In a real app, we would use navigator.clipboard
    // For now, we'll just show a message
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert('Referral code copied to clipboard!');
  };

  const handleShare = () => {
    // In a real app, we would use the Web Share API or open share dialog
    alert('Share feature coming soon!');
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