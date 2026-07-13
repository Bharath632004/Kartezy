"use client";

import { Box, Container, Stack, Typography, Card, CardContent, TextField, Button, Divider, Chip, Avatar, Stack as MuiStack } from '@mui/material';
import { Person, Phone, Email, LocationOn, Edit, Wallet, StarBorder, History, Receipt, LocalOffer, Shield, Settings } from '@mui/icons-material';
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

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/profile');
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phone: responseData.phone || '',
          address: response.data.address || '',
        });
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset form data to current user data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/user/profile', formData);
      setUser(response.data);
      setEditMode(false);
      alert('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Unable to load profile</div>;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account details and preferences
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6 }}>
        {!editMode ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80, bgColor: 'primary.main' }}>
                {(user.firstName?.[0] || 'U') + (user.lastName?.[0] || '')}
              </Avatar>
              <Box sx={{ ml: 4, flexGrow: 1 }}>
                <Typography variant="h4" fontWeight={600}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {user.email}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Chip label="Verified" size="small" color="success" />
                  <Chip label={user.memberSince || 'Member since 2023'} size="small" />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 4 }}>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Wallet fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                  Wallet Balance
                </Typography>
                <Typography variant="h3" fontWeight={600} color="primary.main">
                  ₹{user.walletBalance || 0}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2 }}
                >
                  Add Money
                </Button>
              </Card>

              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <History fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                  Total Orders
                </Typography>
                <Typography variant="h3" fontWeight={600} color="primary.main">
                  {user.totalOrders || 0}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2 }}
                >
                  View Orders
                </Button>
              </Card>

              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <LocalOffer fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                  Loyalty Points
                </Typography>
                <Typography variant="h3" fontWeight={600} color="primary.main">
                  {user.loyaltyPoints || 0}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2 }}
                >
                  Redeem
                </Button>
              </Card>

              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Shield fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                  Referral Code
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {user.referralCode || 'KRTZ123'}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Share
                </Button>
              </Card>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ px: 4, py: 2 }}
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            </Box>
          </>
        } : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
                Edit Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your account details below
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                sx={{ mb: 2 }}
                rows={4}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                size="medium"
                sx={{ px: 4, py: 2 }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                sx={{ px: 4, py: 2 }}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          </>
        )}
      </Card>
    </Container>
  );
};

export default ProfilePage;