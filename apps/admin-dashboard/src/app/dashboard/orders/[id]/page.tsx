import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Chip,
  Button,
  TextField,
} from '@mui/material';
import { orderService } from '@/lib/api';

export default function OrderDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getDetail(id),
  });

  const {
    data: invoice,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useQuery({
    queryKey: ['order-invoice', id],
    queryFn: () => orderService.getInvoice(id),
    enabled: !!id,
  });

  const {
    data: paymentStatus,
    isLoading: paymentLoading,
    error: paymentError,
  } = useQuery({
    queryKey: ['order-payment', id],
    queryFn: () => orderService.getPaymentStatus(id),
    enabled: !!id,
  });

  if (isLoading || invoiceLoading || paymentLoading) {
    return <div>Loading...</div>;
  }
  if (error || invoiceError || paymentError) {
    return <div>Error loading order data</div>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>
      <Divider />
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6">
            Order #{order.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Customer
            </Typography>
            <Typography>
              {order.customerName} ({order.customerEmail})
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Status
            </Typography>
            <Chip
              label={order.status}
              size="small"
              color={order.status === 'delivered' ? 'success' :
                     order.status === 'shipped' ? 'info' :
                     order.status === 'processing' ? 'warning' :
                     order.status === 'confirmed' ? 'info' :
                     order.status === 'pending' ? 'default' :
                     order.status === 'cancelled' ? 'error' : 'default'}
            />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Assigned Driver
            </Typography>
            <Typography>
              {order.driverName || 'Unassigned'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Payment Method
            </Typography>
            <Typography>{order.paymentMethod}</Typography>
          </Box>
        </Box>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Items & Pricing
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">${parseFloat(String(item.price)).toFixed(2)}</TableCell>
                  <TableCell align="right">${(parseFloat(String(item.price)) * parseInt(String(item.quantity))).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ borderTop: '2px solid #ddd' }}>
                <TableCell colSpan={3} sx={{ fontWeight: 'medium' }}>
                  Subtotal
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                  ${parseFloat(String(order.subtotal || 0)).toFixed(2)}
                </TableCell>
              </TableRow>
              {order.tax > 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    Tax
                  </TableCell>
                  <TableCell align="right">
                    ${parseFloat(String(order.tax)).toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
              {order.deliveryFee > 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    Delivery Fee
                  </TableCell>
                  <TableCell align="right">
                    ${parseFloat(String(order.deliveryFee)).toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow sx={{ borderTop: '2px solid #ddd' }}>
                <TableCell colSpan={3} sx={{ fontWeight: 'medium' }}>
                  Total Amount
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                  ${parseFloat(String(order.totalAmount)).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Timeline & Tracking
        </Typography>
        <Box sx={{ borderLeft: '2px solid #eee', pl: 3, mt: 2 }}>
          {order.timeline?.map((event: any, index: number) => (
            <Box key={event.id} sx={{ mb: 4, position: 'relative' }}>
              <Box sx={{
                position: 'absolute',
                left: -8,
                top: 4,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: event.completed ? '#4caf50' : '#ff9800',
                border: '2px solid white',
                boxShadow: '0 0 0 2px #eee'
              }} />
              <Box sx={{ ml: 4 }}>
                <Typography variant="body2" fontWeight="medium" color={event.completed ? '#4caf50' : '#ff9800'}>
                  {event.status}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(event.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
              </Box>
            </Box>
          ))}
          {!order.timeline || order.timeline.length === 0 && (
            <Typography>No timeline events available</Typography>
          )}
        </Box>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Invoice
        </Typography>
        {invoice ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Invoice Number
              </Typography>
              <Typography>{invoice.invoiceNumber}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Issued Date
              </Typography>
              <Typography>{new Date(invoice.issuedAt).toLocaleDateString()}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Due Date
              </Typography>
              <Typography>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Status
              </Typography>
              <Typography>
                <Chip
                  label={invoice.status}
                  size="small"
                  color={invoice.status === 'paid' ? 'success' :
                         invoice.status === 'pending' ? 'warning' :
                         invoice.status === 'overdue' ? 'error' : 'default'}
                />
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography>Invoice not generated yet</Typography>
        )}
        <Divider />
        <Typography variant="h5" gutterBottom>
          Payment Status
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Status
            </Typography>
            <Typography>
              <Chip
                label={paymentStatus.status}
                size="small"
                color={paymentStatus.status === 'paid' ? 'success' :
                       paymentStatus.status === 'pending' ? 'warning' :
                       paymentStatus.status === 'failed' ? 'error' :
                       paymentStatus.status === 'refunded' ? 'info' : 'default'}
              />
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Amount Paid
            </Typography>
            <Typography>${parseFloat(paymentStatus.amountPaid || 0).toFixed(2)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Payment Date
            </Typography>
            <Typography>
              {paymentStatus.paymentDate ? new Date(paymentStatus.paymentDate).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Transaction ID
            </Typography>
            <Typography>{paymentStatus.transactionId || 'N/A'}</Typography>
          </Box>
        </Box>
        {paymentStatus.status === 'pending' && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                // In a real app, this would open a payment modal
                alert('Process payment functionality would be implemented here');
              }}
            >
              Process Payment
            </Button>
          </Box>
        )}
      </Stack>
    </Container>
  );
}