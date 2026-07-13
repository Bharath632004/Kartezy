"use client";

import { Box, Container, Stack, Typography, Card, CardContent, CardActions, Button, Divider, TextField, Chip, Stack as MuiStack, IconButton, Typography as MuiTypography } from '@mui/material';
import { Remove, CheckCircle, OutlineOutlined, LocalMall, Money, Schedule, LocalAtm, Person, SupportAgent } from '@mui/icons-material';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, updateCartItem, removeFromCart, createOrder } from '@/lib/services';
import Link from 'next/link';

const CartPage = () => {
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const { data: cart = null, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  const updateCartMutation = useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: any }) => updateCartItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (itemId: string) => removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData: any) => createOrder(orderData),
    onSuccess: (data) => {
      // Clear cart after successful order
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // Redirect to order confirmation
      // In a real app, we would navigate to order confirmation page with order ID
      alert('Order placed successfully! Order ID: ' + data.id);
    },
    onError: (error) => {
      alert('Failed to place order: ' + error.message);
    },
  });

  const handleUpdateQuantity = (itemId: string, change: number) => {
    if (!cart) return;
    const item = cart.items.find((i: any) => i.id === itemId);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + change);
    updateCartMutation.mutate({ itemId, data: { quantity: newQuantity } });
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCartMutation.mutate(itemId);
  };

  const handleApplyCoupon = () => {
    // In a real app, we would validate the coupon with the API
    if (couponCode) {
      // For demo, let's assume a fixed discount
      setDiscount(50); // ₹50 off
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    // Prepare order data
    const orderData = {
      items: cart.items.map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: cart.totalAmount,
      discount: discount,
      finalAmount: cart.totalAmount - discount,
      // In a real app, we would also include shipping address, payment method, etc.
    };
    createOrderMutation.mutate(orderData);
  };

  if (isLoading) return <div>Loading cart...</div>;
  if (error) return <div>Error loading cart: {(error as Error).message}</div>;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Your Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your items before checkout
        </Typography>
      </Box>

      {!cart || cart.items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LocalMall fontSize={48} color="text.secondary" sx={{ mb: 3 }} />
          <Typography variant="h5" color="text.secondary">
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Add some products to your cart to get started
          </Typography>
          <Link href="/products">
            <Button variant="contained" size="medium">
              Continue Shopping
            </Button>
          </Link>
        </Box>
      ) : (
        <>
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, p: 4, mb: 4 }}>
            {cart.items.map((item: any) => (
              <Card key={item.id} sx={{ mb: 3, p: 3, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
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
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.product.store} • {item.product.deliveryTime}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ mr: 2 }}>
                        ₹{item.product.price}
                      </Typography>
                      {item.product.originalPrice && (
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through', mr: 2 }}
                          >
                            ₹{item.product.originalPrice}
                          </Typography>
                          <Chip
                            label={`${item.product.discount}% OFF`}
                            size="small"
                            color="error"
                            sx={{ fontSize: '0.65rem' }}
                          />
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        sx={{ border: '1px solid #e0e0e0', p: 0 }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Box sx={{ minWidth: 24, textAlign: 'center', fontWeight: 500 }}>
                        {item.quantity}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        sx={{ border: '1px solid #e0e0e0', p: 0 }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{ border: '1px solid #e0e0e0', p: 0, color: 'error' }}
                      >
                        <RemoveFontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Subtotal
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                ₹{cart.totalAmount}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">
                Discount
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  label="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  sx={{ width: 200 }}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ pointerEvents: 'none', px: 1 }}>
                        <TagOutlined fontSize="small" />
                      </Box>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={handleApplyCoupon}
                  sx={{ px: 2 }}
                >
                  Apply
                </Button>
              </Box>
            </Box>

            {discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">
                  Discount (₹{discount})
                </Typography>
                <Typography variant="body2" color="error">
                  -₹{discount}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h5" fontWeight={600}>
                Total
              </Typography>
              <Typography variant="h5" fontWeight={600} color="primary.main">
                ₹{cart.totalAmount - discount}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                sx={{ px: 6, py: 2 }}
                disabled={cart.items.length === 0}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default CartPage;