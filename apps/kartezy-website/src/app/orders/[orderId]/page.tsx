import { Box, Container, Stack, Typography, Card, CardContent, CardActions, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, Table, TableHead, TableRow, TableCell, TableBody, Paper, LinearProgress } from '@mui/material';
import { History, Receipt, LocalTruck, AccessTime, Schedule, Cancel, CheckCircle, ErrorOutline, LocalMall, LocationOn, Phone, Email } from '@mui/icons/material';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '@/lib/services';
import Link from 'next/link';

const OrderDetailPage = ({ params }: { params: { orderId: string } }) => {
  const { orderId } = params;
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });

  const statusSteps = [
    { label: 'Order Placed', icon: Receipt, completed: true },
    { label: 'Confirmed', icon: CheckCircle, completed: true },
    { label: 'Processing', icon: LocalMall, completed: true },
    { label: 'Out for Delivery', icon: LocalTruck, completed: false },
    { label: 'Delivered', icon: CheckCircle, completed: false },
  ];

  const statusLabels = {
    pending: { label: 'Pending', color: 'warning' },
    confirmed: { label: 'Confirmed', color: 'info' },
    processing: { label: 'Processing', color: 'info' },
    out_for_delivery: { label: 'Out for Delivery', color: 'success' },
    delivered: { label: 'Delivered', color: 'success' },
    cancelled: { label: 'Cancelled', color: 'error' },
    returned: { label: 'Returned', color: 'error' },
  };

  const getStepStatus = (stepIndex: number) => {
    switch (order?.status) {
      case 'pending':
        return stepIndex === 0;
      case 'confirmed':
        return stepIndex <= 1;
      case 'processing':
        return stepIndex <= 2;
      case 'out_for_delivery':
        return stepIndex <= 3;
      case 'delivered':
        return stepIndex <= 4;
      default:
        return false;
    }
  };

  if (isLoading) return <div>Loading order details...</div>;
  if (error) return <div>Error loading order: {(error as Error).message}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Order Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Order #{order.id}
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 4, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Order Status
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={4} alignItems="center">
              {statusSteps.map((step, index) => (
                <Box key={step.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  {getStepStatus(index) ? (
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <step.icon fontSize="small" color="white" />
                    </Box>
                  ) : (
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <step.icon fontSize="small" color="text.secondary" />
                    </Box>
                  )}
                  <Typography variant="body2" color={getStepStatus(index) ? 'primary.main' : 'text.secondary'} sx={{ mb: 1, fontWeight: 500 }}>
                    {step.label}
                  </Typography>
                  {index < statusSteps.length - 1 && (
                    <Box sx={{ width: '100%', height: 2, bg: getStepStatus(index) ? 'primary.main' : '#e0e0e0', borderRadius: 1 }} />
                  )}
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">
              Order Date
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">
              Status
            </Typography>
            <Typography variant="body2" fontWeight={600} color={statusLabels[order.status]?.color || 'text.primary'}>
              {statusLabels[order.status]?.label || order.status}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">
              Delivery Address
            </Typography>
            <Typography variant="body2" fontWeight={600} maxWidth={200}>
              {order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city} {order.shippingAddress?.pincode}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">
              Contact
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {order.shippingAddress?.phone}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">
              Payment Method
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {order.paymentMethod?.toUpperCase() || 'Cash on Delivery'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 4, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Order Items
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
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
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.product.brand || 'Brand'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">₹{item.price}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">₹{item.price * item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Order Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">
              Subtotal
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              ₹{order.subtotal}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">
              Delivery Fee
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              ₹{order.deliveryFee || 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">
              Discount
            </Typography>
            <Typography variant="body2" fontWeight={600} color="error">
              -₹{order.discount || 0}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Total
            </Typography>
            <Typography variant="h5" fontWeight={600} color="primary.main">
              ₹{order.totalAmount}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OrderDetailPage;