"use client";

import { Box, Container, Stack, Typography, Card, CardContent, TextField, Button, Chip, Divider, Stack as MuiStack, Typography as MuiTypography } from '@mui/material';
import { LocalMall, LocationOn, Phone, Email, Money, Schedule, Lock, Person, CreditCard, Wallet, Redeem } from '@mui/icons-material';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '@/lib/services';
import Link from 'next/link';

const CheckoutPage = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod', // cod, card, wallet
    useWallet: false,
  });
  const [orderSummary, setOrderSummary] = useState(null);

  // In a real app, we would fetch cart data and user profile
  // For now, we'll simulate
  const mockCart = {
    items: [
      {
        id: 1,
        product: {
          id: 'p1',
          name: 'Organic Apples',
          image: 'https://example.com/apples.jpg',
          price: 120,
          originalPrice: 150,
          discount: 20,
          store: 'FreshMart',
          deliveryTime: '20-30 mins',
        },
        quantity: 2,
      },
      {
        id: 2,
        product: {
          id: 'p2',
          name: 'Bread Loaf',
          image: 'https://example.com/bread.jpg',
          price: 40,
          originalPrice: 50,
          discount: 20,
          store: 'Bakery Corner',
          'deliveryTime': '15-20 mins',
        },
        quantity: 1,
      },
    ],
    totalAmount: 280, // (120*2 + 40) = 280
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Calculate total with discount (if any)
      const totalAmount = mockCart.totalAmount;
      const discount = 0; // Would come from coupon
      const finalAmount = totalAmount - discount;

      const orderData = {
        items: mockCart.items.map((item: any) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount,
        discount,
        finalAmount,
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
        // In a real app, we would also include wallet usage, etc.
      };

      // Call API to create order
      const response = await createOrder(orderData);

      // Clear cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      // Set order summary for confirmation
      setOrderSummary({
        orderId: response.id,
        status: 'confirmed',
        totalAmount: finalAmount,
        items: mockCart.items,
        shippingAddress: formData,
      });

      setLoading(false);
    } catch (error) {
      alert('Failed to place order: ' + (error as Error).message);
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
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, p: 3, mb: 3 }}>
                {mockCart.items.map((item: any) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 2,
                          backgroundColor: '#f5f5f5',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img src={item.product.image} alt={item.product.name} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          {item.product.store}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{item.product.price} × {item.quantity}
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">
                      Subtotal
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{mockCart.totalAmount}
                    </Typography>
                  </Box>
                  {/* Discount section would go here */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">
                      Estimated Total
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="primary.main">
                      ₹{mockCart.totalAmount}
                    </Typography>
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
              <Stack spacing={2}>
                <FormControlLabel
                  value="cod"
                  control={<Radio color="primary" />}
                  label="Cash on Delivery"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="card"
                  control={<Radio color="primary" />}
                  label="Credit/Debit Card"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="wallet"
                  control={<Radio color="primary" />}
                  label="Kartezy Wallet"
                  labelPlacement="start"
                />
              </Stack>
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Wallet Balance: ₹500
                </Typography>
                <Checkbox
                  checked={formData.useWallet}
                  onChange={(e) => setFormData({ ...formData, useWallet: e.target.checked })}
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2">
                  Use Wallet Balance
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Button
              variant="outlined"
              size="medium"
              sx={{ px: 4, py: 2, mr: 2 }}
              onClick={() => {
                // Go back to cart
              }}
            >
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

  // Order Confirmation View
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CheckCircle fontSize={60} color="success.main" sx={{ mb: 4 }} />
        <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
          Order Confirmed!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Your order has been placed successfully. We’ll notify you once it’s on the way.
        </Typography>

        <Card sx={{ maxWidth: 400, mx: 'auto', mb: 6 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Order Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Typography variant="body2">
                <Strong>Order ID:</Strong> {orderSummary.orderId}
              </Typography>
              <Typography variant="body2">
                <Strong>Status:</Strong> {orderSummary.status}
              </Typography>
              <Typography variant="body2">
                <Strong>Total:</Strong> ₹{orderSummary.totalAmount}
              </Typography>
              <Typography variant="body2">
                <Strong>Delivery To:</Strong> {orderSummary.shippingAddress.fullName}
              </Typography>
              <Typography variant="body2">
                <Strong>Phone:</Strong> {orderSummary.shippingAddress.phone}
              </Typography>
              <Typography variant="body2">
                <Strong>Address:</Strong> {orderSummary.shippingAddress.address}, {orderSummary.shippingAddress.city} {orderSummary.shippingAddress.pincode}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 6 }}>
          <Button
            variant="outlined"
            size="medium"
            sx={{ px: 4, py: 2 }}
          >
            Track Order
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            sx={{ px: 4, py: 2 }}
          >
            Shop Again
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CheckoutPage;