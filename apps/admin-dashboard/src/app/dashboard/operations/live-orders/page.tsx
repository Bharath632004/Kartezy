"use client";

import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Toolbar,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  RefreshOutlined,
} from '@mui/icons-material';
import { operationsService } from '@/lib/api';

const LiveOrders = () => {
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30000); // 30 seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['live-orders'],
    queryFn: () => operationsService.getLiveOrders(),
    refetchInterval: refreshInterval || false,
  });

  const handleRefreshClick = () => {
    // Trigger manual refresh
    window.location.reload();
  };

  const handleToggleAutoRefresh = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setRefreshInterval(null);
    } else {
      const id = setInterval(() => {
        window.location.reload();
      }, 30000);
      setIntervalId(id);
      setRefreshInterval(30000);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading live orders</div>;

  return (
    <Box sx={{ py: 3 }}>
      <Toolbar>
        <Typography variant="h5" gutterBottom>
          Live Order Monitoring
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Refresh Now">
          <IconButton onClick={handleRefreshClick}>
            <RefreshOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Auto-refresh: ${refreshInterval ? 'ON' : 'OFF'}`}>
          <IconButton onClick={handleToggleAutoRefresh}>
            {intervalId ? <><RefreshOutlined /><br /><span>ON</span></> : <><RefreshOutlined /><br /><span>OFF</span></>}
          </IconButton>
        </Tooltip>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="live orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell align="right">Customer</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Assigned Driver</TableCell>
              <TableCell align="right">Time Placed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell component="th" scope="row">
                  <Link href={`/dashboard/orders/${order.id}`} underline="hover" color="inherit">
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell align="right">{order.customerName}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      width={10}
                      height={10}
                      borderRadius="50%"
                      sx={{ bgcolor: order.status === 'pending' ? 'warning.main' : order.status === 'confirmed' ? 'info.main' : order.status === 'processing' ? 'primary.main' : order.status === 'shipped' ? 'secondary.main' : order.status === 'delivered' ? 'success.main' : 'error.main' }}
                    />
                    <Typography sx={{ textTransform: 'capitalize' }}>{order.status}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{order.items?.length || 0}</TableCell>
                <TableCell align="right">${parseFloat(order.totalAmount).toFixed(2)}</TableCell>
                <TableCell align="right">{order.driverName || 'Unassigned'}</TableCell>
                <TableCell align="right">{new Date(order.createdAt).toLocaleTimeString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
        {orders?.length === 0 && <Typography>No live orders at the moment</Typography>}
        {orders?.length > 0 && (
          <Typography>
            Showing <strong>{orders.length}</strong> live{' '}
            {orders.length === 1 ? 'order' : 'orders'}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LiveOrders;