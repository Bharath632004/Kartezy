"use client";

import { Box, Typography, Container, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Tooltip, CircularProgress } from '@mui/material';
import { Refresh as Reload, CheckCircle, Cancel } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/lib/api';

const LoginHistoryPage = () => {
  const { data: logs, isLoading, error, refetch } = useQuery({
    queryKey: ['login-history'],
    queryFn: () => userService.getLoginHistory('current'),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '8vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login History
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Button variant="outlined" onClick={() => refetch()} startIcon={<Reload />}>
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