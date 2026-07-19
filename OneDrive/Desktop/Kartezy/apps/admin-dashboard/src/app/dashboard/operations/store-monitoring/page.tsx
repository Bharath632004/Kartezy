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

const StoreMonitoring = () => {
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30000); // 30 seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const {
    data: stores,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['store-monitoring'],
    queryFn: () => operationsService.getStoreMonitoring(),
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
  if (error) return <div>Error loading store monitoring data</div>;

  return (
    <Box sx={{ py: 3 }}>
      <Toolbar>
        <Typography variant="h5" gutterBottom>
          Store Monitoring
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
        <Table sx={{ minWidth: 650 }} aria-label="store monitoring table">
          <TableHead>
            <TableRow>
              <TableCell>Store ID</TableCell>
              <TableCell align="right">Store Name</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Today's Orders</TableCell>
              <TableCell align="right">Today's Revenue</TableCell>
              <TableCell align="right">Avg Order Value</TableCell>
              <TableCell align="right">Last Order</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores?.map((store: any) => (
              <TableRow key={store.id}>
                <TableCell component="th" scope="row">
                  <Link href={`/dashboard/merchants/${store.merchantId}`} underline="hover" color="inherit">
                    {store.id}
                  </Link>
                </TableCell>
                <TableCell align="right">{store.name}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      width={10}
                      height={10}
                      borderRadius="50%"
                      sx={{ bgcolor: store.status === 'open' ? 'success.main' : store.status === 'busy' ? 'warning.main' : store.status === 'closed' ? 'error.main' : 'grey.main' }}
                    />
                    <Typography sx={{ textTransform: 'capitalize' }}>{store.status}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{store.todaysOrders || 0}</TableCell>
                <TableCell align="right">${parseFloat(store.todaysRevenue || 0).toFixed(2)}</TableCell>
                <TableCell align="right">${parseFloat(store.avgOrderValue || 0).toFixed(2)}</TableCell>
                <TableCell align="right">{store.lastOrder ? new Date(store.lastOrder).toLocaleTimeString() : 'None'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
        {stores?.length === 0 && <Typography>No store data available</Typography>}
        {stores?.length > 0 && (
          <Typography>
            Showing <strong>{stores.length}</strong> stores
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default StoreMonitoring;