"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, LinearProgress } from '@mui/material';
import { LocalTruck, AccessTime, Schedule, CheckCircle, LocationOn, Person, Phone, LocalMall, Receipt } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById } from '@/lib/services';

const TrackingPage = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderTracking = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrderById(id);
      setOrder(response.data);
    } catch (err) {
      setError('Failed to load order tracking');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = () => {
    if (!orderId) {
      setError('Please enter an order ID');
      return;
    }
    fetchOrderTracking(orderId);
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case 'pending': return 20;
      case 'confirmed': return 40;
      case 'processing': return 60;
      case 'out_for_delivery': return 80;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 600  sx={{ mb: 2 }}>
          Track Your Order
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your order ID to see real-time tracking
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 4 }}>
        {!order ? (
          <>
            <Box sx={{ mb: 4 }}>
              <TextField
                label="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ pointerEvents: 'none', px: 1 }}>
                      <Receipt fontSize="small" />
                    </Box>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{ px: 4, py: 2 }}
                  disabled={loading}
                  onClick={handleTrack}
                >
                  {loading ? 'Tracking...' : 'Track Order'}
                </Button>
              </Box>
              {error && (
                <Box sx={{ mt: 2, color: 'error.main' }}>
                  <Typography variant="body2">{error}</Typography>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600  sx={{ mb: 2 }}>
                Order #{order.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600  sx={{ mb: 2 }}>
                Delivery Progress
              </Typography>
              <LinearProgress
                value={getStatusProgress(order.status)}
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'text.secondary' }}>
                <Typography variant="body2">Order Placed</Typography>
                <Typography variant="body2">Delivered</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 3 }}>
              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <LocalMall fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 1 }}>
                  Store
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.items[0]?.product?.store || 'N/A'}
                </Typography>
              </Card>

              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <AccessTime fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 1 }}>
                  Delivery Time
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.estimatedDeliveryTime || 'Calculating...'}
                </Typography>
              </Card>

              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <LocationOn fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 1 }}>
                  Distance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.distanceToDestination || 'Calculating...'} km
                </Typography>
              </Card>

              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Person fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 1 }}>
                  Delivery Agent
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.deliveryAgent?.name || 'Assigning...'}
                </Typography>
              </Card>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600  sx={{ mb: 2 }}>
                Order Items
              </Typography>
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, p: 3 }}>
                {order.items.map((item: any) => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 3, pb: 3, borderBottom: '1px solid #f0f0f0' }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 3,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img src={item.product.image} alt={item.product.name} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600  sx={{ mb: 0.5 }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {item.product.store}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{item.product.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          x{item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="medium"
                sx={{ px: 4, py: 2 }}
              >
                Contact Support
              </Button>
              <Button
                variant="contained"
                size="medium"
                color="primary"
                sx={{ px: 4, py: 2, ml: 2 }}
              >
                View Order Details
              </Button>
            </Box>
          </>
        )}
      </Card>
    </Container>
  );
};

export default TrackingPage;