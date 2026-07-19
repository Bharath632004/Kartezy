"use client";

import { Box, Container, Typography, Card, CardContent, Button, Divider, Chip, LinearProgress, Alert } from '@mui/material';
import { StarBorder, CardMembership, Redeem } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const MembershipPage = () => {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembershipData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/membership');
      if (!response.ok) throw new Error('Failed to fetch membership');
      const data = await response.json();
      setMembership(data);
    } catch (err) {
      setError('Failed to load membership data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembershipData(); }, []);

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/membership/upgrade', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to upgrade membership');
      await fetchMembershipData();
    } catch (err) {
      console.error('Upgrade failed:', err);
    }
  };

  if (loading) return <div>Loading membership...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Kartify Membership
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Unlock exclusive benefits and rewards
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <CardMembership fontSize={48} color="primary.main" sx={{ mb: 2 }} />
            <Typography variant="h3" fontWeight={600} sx={{ mb: 1 }}>
              {membership.level} Member
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Member since {membership.joinedSince} • Expires in {membership.expiresIn}
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Membership Benefits
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              {membership.benefits.map((benefit, index) => (
                <Chip
                  key={index}
                  label={benefit}
                  size="small"
                  sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Loyalty Points
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StarBorder fontSize={32} color="primary.main" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {membership.points} Points
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {membership.pointsToNextLevel} points to reach {membership.nextLevel}
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              value={(membership.points / (membership.points + membership.pointsToNextLevel)) * 100}
              sx={{ width: '100%', height: 8, borderRadius: 4, mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'text.secondary' }}>
              <Typography variant="body2">
                {membership.points} / {membership.points + membership.pointsToNextLevel}
              </Typography>
              <Typography variant="body2">
                {membership.pointsToNextLevel} to {membership.nextLevel}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid #f0f0f0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Receipt fontSize={24} color="primary.main" sx={{ mr: 2 }} />
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.2 }}>
                      Loyalty points earned
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      Today
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600} color="success.main" sx={{ minWidth: 80 }}>
                    +50 pts
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid #f0f0f0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalOffer fontSize={24} color="primary.main" sx={{ mr: 2 }} />
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.2 }}>
                      Exclusive discount used
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      Yesterday
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600} color="error.main" sx={{ minWidth: 80 }}>
                    -10%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle fontSize={24} color="primary.main" sx={{ mr: 2 }} />
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.2 }}>
                      Order delivered
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      Today
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ minWidth: 80 }}>
                    Order #1002
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Divider>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              sx={{ px: 4, py: 2 }}
              onClick={handleUpgrade}
            >
              Upgrade to {membership.nextLevel}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MembershipPage;