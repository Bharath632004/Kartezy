"use client";

import { Box, Typography, Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Tooltip, CircularProgress } from '@mui/material';
import { Refresh as Reload, CheckCircle, Cancel } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const LoginHistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const fetchLoginHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login-history');
      if (!response.ok) throw new Error('Failed to fetch login history');
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch login history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLoginHistory();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '8vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Login History
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Button variant="outlined" onClick={handleRefresh} startIcon={<Reload />}>
          Refresh
        </Button>
      </Box>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date & Time</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.ipAddress}</TableCell>
                <TableCell>{log.device}</TableCell>
                <TableCell>{log.location}</TableCell>
                <TableCell>
                  {log.status === 'Success' ? (
                    <Tooltip title="Successful login">
                      <Typography color="success.main">
                        <CheckCircle fontSize="small" />
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Failed login">
                      <Typography color="error.main">
                        <Cancel fontSize="small" />
                      </Typography>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default LoginHistoryPage;