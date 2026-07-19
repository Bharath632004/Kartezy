"use client";

import { Box, Container, Stack, Typography, Card, CardContent, TextField, Button, Divider, FormControlLabel, Radio, RadioGroup, Checkbox, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createOrder } from '@/lib/services';
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
    useWallet: false,
  });
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCart(data);
      } catch (err) {
        console.error('Failed to load cart:', err);
      } finally {
        setCartLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: cart.totalAmount,
        discount: cart.discount || 0,
        finalAmount: cart.finalAmount || cart.totalAmount,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          landmark: formData.landmark,
          city: formData.city,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
        useWallet: formData.useWallet,
      };

      const response = await createOrder(orderData);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setOrderSummary({
        orderId: response.id,
        status: 'confirmed',
        totalAmount: orderData.finalAmount,
        items: cart.items,
        shippingAddress: formData,
      });
    } catch (error) {
      alert('Failed to place order: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!orderSummary) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
            Checkout
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your delivery and payment details to complete your order
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 4 }}>
          <Stack spacing={4}>
            {/* Order Summary */}
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Order Summary
              </Typography>
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, p: 3 }}>
                {cart.items.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 40, height: 40, mr: 2, backgroundColor: '#f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.product.image && <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{item.product.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>{item.product.store}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600} sx={{ ml: 2 }}>₹{item.product.price} × {item.quantity}</Typography>
                    </Box>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{cart.totalAmount}</Typography>
                </Box>
                {cart.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="success.main">Discount</Typography>
                    <Typography variant="body2" fontWeight={600} color="success.main">-₹{cart.discount}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Estimated Total</Typography>
                  <Typography variant="h5" fontWeight={600} color="primary.main">₹{cart.finalAmount || cart.totalAmount}</Typography>
                </Box>
                </Box>
            </Box>

            {/* Delivery Details */}
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Delivery Details
              </Typography>
              <Stack spacing={3}>
                <TextField
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    sx={{ flex: 1, mb: 2 }}
                  />
                  <TextField
                    label="Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                    sx={{ width: 100, mb: 2 }}
                  />
                </Stack>
              </Stack>
            </Box>

            {/* Payment Method */}
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Payment Method
              </Typography>
              <RadioGroup value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                <FormControlLabel value="wallet" control={<Radio />} label="Kartezy Wallet" />
              </RadioGroup>
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Wallet Balance: ₹{cart.walletBalance || 0}</Typography>
                <FormControlLabel control={<Checkbox checked={formData.useWallet} onChange={(e) => setFormData({ ...formData, useWallet: e.target.checked })} />} label="Use Wallet Balance" />
              </Box>
            </Box>
          </Stack>

          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Button variant="outlined" size="medium" sx={{ px: 4, py: 2, mr: 2 }} onClick={() => router.push('/cart')}>
              Back to Cart
            </Button>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              sx={{ px: 4, py: 2 }}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </Box>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box sx={{ fontSize: 60, color: 'success.main', mb: 4 }}>✓</Box>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
          Order Confirmed!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Your order has been placed successfully. We&apos;ll notify you once it&apos;s on the way.
        </Typography>

        <Card sx={{ maxWidth: 400, mx: 'auto', mb: 6 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Order Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2} textAlign="left">
              <Typography variant="body2"><strong>Order ID:</strong> {orderSummary.orderId}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {orderSummary.status}</Typography>
              <Typography variant="body2"><strong>Total:</strong> ₹{orderSummary.totalAmount}</Typography>
              <Typography variant="body2"><strong>Delivery To:</strong> {orderSummary.shippingAddress.fullName}</Typography>
              <Typography variant="body2"><strong>Phone:</strong> {orderSummary.shippingAddress.phone}</Typography>
              <Typography variant="body2"><strong>Address:</strong> {orderSummary.shippingAddress.address}, {orderSummary.shippingAddress.city} {orderSummary.shippingAddress.pincode}</Typography>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 6 }}>
          <Button variant="outlined" size="medium" sx={{ px: 4, py: 2 }} onClick={() => router.push(`/orders/${orderSummary.orderId}`)}>Track Order</Button>
          <Button variant="contained" size="medium" color="primary" sx={{ px: 4, py: 2 }} onClick={() => router.push('/')}>Shop Again</Button>
        </Box>
      </Box>
    </Container>
  );
};
export default CheckoutPage;