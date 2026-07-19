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
} from '@mui/icons-material';
import { operationsService } from '@/lib/api';

const FraudAlerts = () => {
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30000); // 30 seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const {
    data: alerts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['fraud-alerts'],
    queryFn: () => operationsService.getFraudAlerts(),
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
  if (error) return <div>Error loading fraud alerts</div>;

  // Group alerts by severity
  const highRiskAlerts = alerts?.filter((alert: any) => alert.riskLevel === 'high') || [];
  const mediumRiskAlerts = alerts?.filter((alert: any) => alert.riskLevel === 'medium') || [];
  const lowRiskAlerts = alerts?.filter((alert: any) => alert.riskLevel === 'low') || [];

  return (
    <Box sx={{ py: 3 }}>
      <Toolbar>
        <Typography variant="h5" gutterBottom>
          Fraud Alerts
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
        {highRiskAlerts.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>{highRiskAlerts.length} High Risk Alert{highRiskAlerts.length !== 1 ? 's' : ''}</AlertTitle>
            {highRiskAlerts.map((alert: any) => (
              <Typography key={alert.id} sx={{ mb: 1 }}>
                • {alert.description} (Score: ${alert.fraudScore}/100)
              </Typography>
            ))}
          </Alert>
        )}
        {mediumRiskAlerts.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>{mediumRiskAlerts.length} Medium Risk Alert{mediumRiskAlerts.length !== 1 ? 's' : ''}</AlertTitle>
            {mediumRiskAlerts.map((alert: any) => (
              <Typography key={alert.id} sx={{ mb: 1 }}>
                • {alert.description} (Score: ${alert.fraudScore}/100)
              </Typography>
            ))}
          </Alert>
        )}
        {lowRiskAlerts.length > 0 && (
          <Alert severity="info">
            <AlertTitle>{lowRiskAlerts.length} Low Risk Alert{lowRiskAlerts.length !== 1 ? 's' : ''}</AlertTitle>
            {lowRiskAlerts.map((alert: any) => (
              <Typography key={alert.id} sx={{ mb: 1 }}>
                • {alert.description} (Score: ${alert.fraudScore}/100)
              </Typography>
            ))}
          </Alert>
        )}
        {(highRiskAlerts.length + mediumRiskAlerts.length + lowRiskAlerts.length) === 0 && (
          <Alert severity="success">
            <AlertTitle>All Clear</AlertTitle>
            <Typography>No fraud alerts at this time</Typography>
          </Alert>
        )}
      </Box>

      {/* Detailed Alerts Table */}
      {alerts?.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            All Fraud Alerts Details
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="fraud alerts table">
              <TableHead>
                <TableRow>
                  <TableCell>Alert ID</TableCell>
                  <TableCell align="right">Order ID</TableCell>
                  <TableCell align="right">Customer</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Risk Score</TableCell>
                  <TableCell align="right">Risk Level</TableCell>
                  <TableCell align="right">Detected At</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts?.map((alert: any) => (
                  <TableRow key={alert.id}>
                    <TableCell component="th" scope="row">{alert.id}</TableCell>
                    <TableCell align="right">{alert.orderId}</TableCell>
                    <TableCell align="right">{alert.customerName}</TableCell>
                    <TableCell align="right">${parseFloat(alert.amount || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">{alert.fraudScore}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          width={10}
                          height={10}
                          borderRadius="50%"
                          sx={{ bgcolor: alert.riskLevel === 'high' ? 'error.main' : alert.riskLevel === 'medium' ? 'warning.main' : alert.riskLevel === 'low' ? 'info.main' : 'grey.main' }}
                        />
                        <Typography>{alert.riskLevel.toUpperCase()}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{new Date(alert.detectedAt).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          width={10}
                          height={10}
                          borderRadius="50%"
                          sx={{ bgcolor: alert.status === 'reviewing' ? 'warning.main' : alert.status === 'blocked' ? 'error.main' : alert.status === 'cleared' ? 'success.main' : 'grey.main' }}
                        />
                        <Typography>{alert.status}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
        {alerts?.length === 0 && <Typography>No fraud data available</Typography>}
        {alerts?.length > 0 && (
          <Typography>
            Total Alerts: <strong>{alerts.length}</strong> (
            <span sx={{ color: 'error.main' }}>{highRiskAlerts.length}</span> High Risk,
            <span sx={{ color: 'warning.main' }}>{mediumRiskAlerts.length}</span> Medium Risk,
            <span sx={{ color: 'info.main' }}>{lowRiskAlerts.length}</span> Low Risk)
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FraudAlerts;