"use client";

import { Box, Container, Typography, Card, CardContent, Button, Divider, TextField, CircularProgress, Alert, Grid, Stepper, Step, StepLabel } from '@mui/material';
import { ShoppingCart, LocalShipping, Payment, CheckCircle } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const STEPS = ['Cart', 'Delivery', 'Payment', 'Confirm'];

const CheckoutPage = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({ address: '', city: '', pincode: '', phone: '' });

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/cart');
      setCart(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please log in to checkout');
      } else if (err.response?.status === 404) {
        setCart({ items: [], totalAmount: 0, discountAmount: 0, deliveryFee: 0, taxAmount: 0 });
      } else {
        setError(err.response?.data?.message || 'Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const handlePlaceOrder = async () => {
    try {
      setSubmitting(true);
      const res = await api.post('/api/orders', {
        deliveryAddress,
        paymentMethod: 'COD',
        items: cart.items,
        totalAmount: cart.totalAmount
      });
      const orderId = res.data.orderId || res.data.id;
      router.push(`/orders/${orderId}?success=true`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <CircularProgress /><Typography sx={{ mt: 2 }}>Loading cart...</Typography>
    </Container>
  );

  if (error && !cart) return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button variant="outlined" onClick={loadCart}>Retry</Button>
    </Container>
  );

  if (!cart?.items?.length) return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <ShoppingCart sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h5" sx={{ mb: 1 }}>Your cart is empty</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Add items from nearby stores</Typography>
      <Button variant="contained" onClick={() => router.push('/')}>Browse Stores</Button>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h3" fontWeight={600} sx={{ mb: 4 }}>Checkout</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: { xs: 3, md: 5 } }}>
        <CardContent>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>Cart Items</Typography>
              {cart.items.map((item, idx) => (
                <Box key={item.productId || idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: idx < cart.items.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>{item.productName || item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">Qty: {item.quantity} × ₹{item.price || item.unitPrice}</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>₹{((item.price || item.unitPrice) * item.quantity).toLocaleString('en-IN')}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
                <Typography variant="body2">Subtotal: ₹{(cart.subtotal ?? cart.totalAmount).toLocaleString('en-IN')}</Typography>
                {cart.discountAmount > 0 && <Typography variant="body2" color="success.main">Discount: -₹{cart.discountAmount.toLocaleString('en-IN')}</Typography>}
                <Typography variant="body2">Delivery: ₹{(cart.deliveryFee ?? 0).toLocaleString('en-IN')}</Typography>
                <Typography variant="h6" fontWeight={600}>Total: ₹{cart.totalAmount.toLocaleString('en-IN')}</Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => setActiveStep(1)}>Continue to Delivery</Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>Delivery Address</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField fullWidth label="Address" value={deliveryAddress.address} onChange={e => setDeliveryAddress(a => ({ ...a, address: e.target.value }))} multiline rows={2} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="City" value={deliveryAddress.city} onChange={e => setDeliveryAddress(a => ({ ...a, city: e.target.value }))} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Pincode" value={deliveryAddress.pincode} onChange={e => setDeliveryAddress(a => ({ ...a, pincode: e.target.value }))} /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Phone" value={deliveryAddress.phone} onChange={e => setDeliveryAddress(a => ({ ...a, phone: e.target.value }))} /></Grid>
              </Grid>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => setActiveStep(0)}>Back</Button>
                <Button variant="contained" onClick={() => setActiveStep(2)} disabled={!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.phone}>Continue to Payment</Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>Payment Method</Typography>
              <Card sx={{ p: 2, mb: 2, border: '2px solid #1976d2', cursor: 'pointer' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Payment color="primary" />
                  <Typography variant="body1" fontWeight={500}>Cash on Delivery</Typography>
                </Box>
              </Card>
              <Card sx={{ p: 2, mb: 2, cursor: 'pointer' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Payment color="action" />
                  <Typography variant="body1" color="text.secondary">Online Payment (Coming Soon)</Typography>
                </Box>
              </Card>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => setActiveStep(1)}>Back</Button>
                <Button variant="contained" onClick={() => setActiveStep(3)}>Review Order</Button>
              </Box>
            </Box>
          )}

          {activeStep === 3 && (
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>Order Summary</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>Total Amount: <strong>₹{cart.totalAmount.toLocaleString('en-IN')}</strong></Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Pay on delivery</Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="outlined" onClick={() => setActiveStep(2)}>Back</Button>
                <Button variant="contained" onClick={handlePlaceOrder} disabled={submitting}>
                  {submitting ? <CircularProgress size={24} /> : 'Place Order'}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CheckoutPage;
