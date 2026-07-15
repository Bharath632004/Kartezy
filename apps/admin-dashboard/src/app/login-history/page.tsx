"use client";

import { Box, Typography, Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { History, Refresh as Reload, CheckCircle, Cancel } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const LoginHistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      const mockLogs = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        timestamp: new Date(Date.now() - i * 86400000).toLocaleString(),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        device: ['Windows Chrome', 'Mac Safari', 'iPhone Safari', 'Android Chrome'][Math.floor(Math.random() * 4)],
        location: ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia'][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.5 ? 'Success' : 'Failed',
      }));
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const mockLogs = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        timestamp: new Date(Date.now() - i * 86400000).toLocaleString(),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        device: ['Windows Chrome', 'Mac Safari', 'iPhone Safari', 'Android Chrome'][Math.floor(Math.random() * 4)],
        location: ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia'][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.5 ? 'Success' : 'Failed',
      }));
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
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