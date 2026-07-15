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

const FleetMonitoring = () => {
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30000); // 30 seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const {
    data: fleet,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['fleet-monitoring'],
    queryFn: () => operationsService.getFleetMonitoring(),
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
  if (error) return <div>Error loading fleet monitoring data</div>;

  return (
    <Box sx={{ py: 3 }}>
      <Toolbar>
        <Typography variant="h5" gutterBottom>
          Fleet Monitoring
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
        <Table sx={{ minWidth: 650 }} aria-label="fleet monitoring table">
          <TableHead>
            <TableRow>
              <TableCell>Driver ID</TableCell>
              <TableCell align="right">Driver Name</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Current Location</TableCell>
              <TableCell align="right">Active Orders</TableCell>
              <TableCell align="right">Today's Trips</TableCell>
              <TableCell align="right">Earnings Today</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fleet?.map((driver: any) => (
              <TableRow key={driver.id}>
                <TableCell component="th" scope="row">
                  <Link href={`/dashboard/delivery/${driver.driverId}`} underline="hover" color="inherit">
                    {driver.id}
                  </Link>
                </TableCell>
                <TableCell align="right">{driver.name}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      width={10}
                      height={10}
                      borderRadius="50%"
                      sx={{ bgcolor: driver.status === 'available' ? 'success.main' : driver.status === 'busy' ? 'warning.main' : driver.status === 'offline' ? 'error.main' : 'grey.main' }}
                    />
                    <Typography sx={{ textTransform: 'capitalize' }}>{driver.status}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{driver.lastKnownLocation || 'Unknown'}</TableCell>
                <TableCell align="right">{driver.activeOrders || 0}</TableCell>
                <TableCell align="right">{driver.todaysTrips || 0}</TableCell>
                <TableCell align="right">${parseFloat(driver.earningsToday || 0).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
        {fleet?.length === 0 && <Typography>No fleet data available</Typography>}
        {fleet?.length > 0 && (
          <Typography>
            Showing <strong>{fleet.length}</strong> drivers
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default FleetMonitoring;