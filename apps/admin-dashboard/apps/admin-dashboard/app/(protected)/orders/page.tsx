import { Box, Container, Typography, Card, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, TextField, Select, MenuItem, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { ordersService } from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    page: 0,
    size: 10
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersService.getOrders(filters);
        setOrders(response.data.content || response.data.orders || []);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filters]);

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value, page: 0 });
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Orders Management
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Orders Management
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom mb={4}>
        Orders Management
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search orders"
          placeholder="Order ID, Customer Name..."
          sx={{ width: 300, marginRight: 2 }}
        />
        <Select
          label="Status"
          value={filters.status}
          onChange={handleStatusChange}
          sx={{ minWidth: 150, marginRight: 2 }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="processing">Processing</MenuItem>
          <MenuItem value="shipped">Shipped</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
        <Button variant="contained" color="primary" sx={{ marginLeft: 2 }}>
          New Order
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell align="left">Customer</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell component="th" scope="row">
                  #{order.id}
                </TableCell>
                <TableCell align="left">{order.customer?.name || 'Guest Customer'}</TableCell>
                <TableCell align="right">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">${order.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                <TableCell align="center">
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor:
                        order.status === 'pending'
                          ? '#fff3e0'
                          : order.status === 'processing'
                            ? '#e3f2fd'
                            : order.status === 'shipped'
                              ? '#e8f5e9'
                              : order.status === 'delivered'
                                ? '#e8f5e9'
                                : '#ffebee',
                      color:
                        order.status === 'pending'
                          ? '#e65100'
                          : order.status === 'processing'
                            ? '#1565c0'
                            : order.status === 'shipped'
                              ? '#2e7d32'
                              : order.status === 'delivered'
                                ? '#2e7d32'
                                : '#c62828',
                    }}
                  >
                    {order.status?.toUpperCase() || 'PENDING'}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined" color="primary">
                    View
                  </Button>
                  <Button size="small" variant="outlined" color="secondary" sx={{ mx: 1 }}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}