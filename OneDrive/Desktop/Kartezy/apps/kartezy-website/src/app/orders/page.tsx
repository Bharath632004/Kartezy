"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { History, Receipt, LocalTruck, AccessTime, Schedule, Cancel, CheckCircle, ErrorOutline } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/lib/services';
import Link from 'next/link';

const OrdersPage = () => {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const statusLabels = {
    pending: { label: 'Pending', color: 'warning' },
    confirmed: { label: 'Confirmed', color: 'info' },
    processing: { label: 'Processing', color: 'info' },
    out_for_delivery: { label: 'Out for Delivery', color: 'success' },
    delivered: { label: 'Delivered', color: 'success' },
    cancelled: { label: 'Cancelled', color: 'error' },
    returned: { label: 'Returned', color: 'error' },
  };

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {(error as Error).message}</div>;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your order history and track current orders
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <History fontSize={48} color="text.secondary" sx={{ mb: 3 }} />
          <Typography variant="h5" color="text.secondary">
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Your order history will appear here once you place an order
          </Typography>
          <Link href="/products">
            <Button variant="contained" size="medium">
              Start Shopping
            </Button>
          </Link>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              Recent Orders
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {orders.map((order: any) => (
                <Card
                  key={order.id}
                  sx={{
                    width: 280,
                    borderRadius: 4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Order #{order.id}
                      </Typography>
                      <Chip
                        label={statusLabels[order.status]?.label || order.status}
                        size="small"
                        color={statusLabels[order.status]?.color || 'grey'}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        ₹{order.totalAmount}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outlined" size="small" sx={{ px: 2, py: 1 }}>
                          View Details
                        </Button>
                      </Link>
                      {order.status === 'pending' || order.status === 'confirmed' ? (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          sx={{ px: 2, py: 1 }}
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      ) : null}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Order History
            </Typography>
            <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Items</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          #{order.id}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={`${order.items.length} items`} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} color="primary.main">
                          ₹{order.totalAmount}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={statusLabels[order.status]?.label || order.status}
                          size="small"
                          color={statusLabels[order.status]?.color || 'grey'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ px: 2, py: 1 }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </>
      )}
    </Container>
  );
};

export default OrdersPage;