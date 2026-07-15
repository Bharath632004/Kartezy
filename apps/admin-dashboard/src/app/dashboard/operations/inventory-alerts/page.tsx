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
  Alert,
  AlertTitle,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  RefreshOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';
import { operationsService } from '@/lib/api';

const InventoryAlerts = () => {
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30000); // 30 seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const {
    data: alerts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: () => operationsService.getInventoryAlerts(),
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
  if (error) return <div>Error loading inventory alerts</div>;

  // Group alerts by severity
  const criticalAlerts = alerts?.filter((alert: any) => alert.severity === 'critical') || [];
  const warningAlerts = alerts?.filter((alert: any) => alert.severity === 'warning') || [];
  const infoAlerts = alerts?.filter((alert: any) => alert.severity === 'info') || [];

  return (
    <Box sx={{ py: 3 }}>
      <Toolbar>
        <Typography variant="h5" gutterBottom>
          Inventory Alerts
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

      {/* Alert Summary */}
      <Box sx={{ mb: 3 }}>
        {criticalAlerts.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>{criticalAlerts.length} Critical Alert{criticalAlerts.length !== 1 ? 's' : ''}</AlertTitle>
            {criticalAlerts.map((alert: any) => (
              <Typography key={alert.id} sx={{ mb: 1 }}>
                • {alert.message} ({alert.itemName} - Low Stock: {alert.currentQuantity}/{alert.threshold})
              </Typography>
            ))}
          </Alert>
        )}
        {warningAlerts.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>{warningAlerts.length} Warning Alert{warningAlerts.length !== 1 ? 's' : ''}</AlertTitle>
            {warningAlerts.map((alert: any) => (
              <Typography key={alert.id} sx={{ mb: 1 }}>
                • {alert.message} ({alert.itemName} - Low Stock: {alert.currentQuantity}/{alert.threshold})
              </Typography>
            ))}
          </Alert>
        )}
        {infoAlerts.length > 0 && (
          <Alert severity="info">
            <AlertTitle>{infoAlerts.length} Info Alert{infoAlerts.length !== 1 ? 's' : ''}</AlertTitle>
            {infoAlerts.map((alert: any) => (
              <Typography key={alert.id} sx={{ mb: 1 }}>
                • {alert.message} ({alert.itemName})
              </Typography>
            ))}
          </Alert>
        )}
        {(criticalAlerts.length + warningAlerts.length + infoAlerts.length) === 0 && (
          <Alert severity="success">
            <AlertTitle>All Clear</AlertTitle>
            <Typography>No inventory alerts at this time</Typography>
          </Alert>
        )}
      </Box>

      {/* Detailed Alerts Table */}
      {alerts?.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            All Alerts Details
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="inventory alerts table">
              <TableHead>
                <TableRow>
                  <TableCell>Alert ID</TableCell>
                  <TableCell align="right">Item</TableCell>
                  <TableCell align="right">Alert Type</TableCell>
                  <TableCell align="right">Severity</TableCell>
                  <TableCell align="right">Current Stock</TableCell>
                  <TableCell align="right">Threshold</TableCell>
                  <TableCell align="right">Location</TableCell>
                  <TableCell align="right">Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts?.map((alert: any) => (
                  <TableRow key={alert.id}>
                    <TableCell component="th" scope="row">{alert.id}</TableCell>
                    <TableCell align="right">{alert.itemName}</TableCell>
                    <TableCell align="right">{alert.alertType}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          width={10}
                          height={10}
                          borderRadius="50%"
                          sx={{ bgcolor: alert.severity === 'critical' ? 'error.main' : alert.severity === 'warning' ? 'warning.main' : 'info.main' }}
                        />
                        <Typography>{alert.severity.toUpperCase()}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{alert.currentQuantity}</TableCell>
                    <TableCell align="right">{alert.threshold}</TableCell>
                    <TableCell align="right">{alert.location || 'N/A'}</TableCell>
                    <TableCell align="right">{new Date(alert.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
        {alerts?.length === 0 && <Typography>No inventory data available</Typography>}
        {alerts?.length > 0 && (
          <Typography>
            Total Alerts: <strong>{alerts.length}</strong> (
            <span sx={{ color: 'error.main' }}>{criticalAlerts.length}</span> Critical,
            <span sx={{ color: 'warning.main' }}>{warningAlerts.length}</span> Warning,
            <span sx={{ color: 'info.main' }}>{infoAlerts.length}</span> Info)
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default InventoryAlerts;