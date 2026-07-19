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
  Badge,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  RefreshOutlined,
} from '@mui/icons-material';
import { operationsService } from '@/lib/api';

const Escalations = () => {
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30000); // 30 seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const {
    data: escalations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['escalations'],
    queryFn: () => operationsService.getEscalations(),
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
  if (error) return <div>Error loading escalations</div>;

  // Group escalations by priority
  const urgentEscalations = escalations?.filter((esc: any) => esc.priority === 'urgent') || [];
  const highEscalations = escalations?.filter((esc: any) => esc.priority === 'high') || [];
  const mediumEscalations = escalations?.filter((esc: any) => esc.priority === 'medium') || [];
  const lowEscalations = escalations?.filter((esc: any) => esc.priority === 'low') || [];

  return (
    <Box sx={{ py: 3 }}>
      <Toolbar>
        <Typography variant="h5" gutterBottom>
          Escalations
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

      {/* Escalation Summary */}
      <Box sx={{ mb: 3 }}>
        {urgentEscalations.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>{urgentEscalations.length} Urgent Escalation{urgentEscalations.length !== 1 ? 's' : ''}</AlertTitle>
            {urgentEscalations.map((esc: any) => (
              <Typography key={esc.id} sx={{ mb: 1 }}>
                • {esc.title} ({esc.type}) - {esc.requesterName}
              </Typography>
            ))}
          </Alert>
        )}
        {highEscalations.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>{highEscalations.length} High Priority Escalation{highEscalations.length !== 1 ? 's' : ''}</AlertTitle>
            {highEscalations.map((esc: any) => (
              <Typography key={esc.id} sx={{ mb: 1 }}>
                • {esc.title} ({esc.type}) - {esc.requesterName}
              </Typography>
            ))}
          </Alert>
        )}
        {mediumEscalations.length > 0 && (
          <Alert severity="info">
            <AlertTitle>{mediumEscalations.length} Medium Priority Escalation{mediumEscalations.length !== 1 ? 's' : ''}</AlertTitle>
            {mediumEscalations.map((esc: any) => (
              <Typography key={esc.id} sx={{ mb: 1 }}>
                • {esc.title} ({esc.type}) - {esc.requesterName}
              </Typography>
            ))}
          </Alert>
        )}
        {(urgentEscalations.length + highEscalations.length + mediumEscalations.length + lowEscalations.length) === 0 && (
          <Alert severity="success">
            <AlertTitle>All Clear</AlertTitle>
            <Typography>No active escalations</Typography>
          </Alert>
        )}
      </Box>

      {/* Detailed Escalations Table */}
      {escalations?.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            All Escalations Details
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="escalations table">
              <TableHead>
                <TableRow>
                  <TableCell>Escalation ID</TableCell>
                  <TableCell align="right">Title</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell align="right">Priority</TableCell>
                  <TableCell align="right">Requester</TableCell>
                  <TableCell align="right">Assigned To</TableCell>
                  <TableCell align="right">Created At</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {escalations?.map((esc: any) => (
                  <TableRow key={esc.id}>
                    <TableCell component="th" scope="row">{esc.id}</TableCell>
                    <TableCell align="right">{esc.title}</TableCell>
                    <TableCell align="right">{esc.type}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          width={10}
                          height={10}
                          borderRadius="50%"
                          sx={{ bgcolor: esc.priority === 'urgent' ? 'error.main' : esc.priority === 'high' ? 'warning.main' : esc.priority === 'medium' ? 'info.main' : 'grey.main' }}
                        />
                        <Typography>{esc.priority.toUpperCase()}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{esc.requesterName}</TableCell>
                    <TableCell align="right">{esc.assigneeName || 'Unassigned'}</TableCell>
                    <TableCell align="right">{new Date(esc.createdAt).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          width={10}
                          height={10}
                          borderRadius="50%"
                          sx={{ bgcolor: esc.status === 'open' ? 'warning.main' : esc.status === 'in_progress' ? 'info.main' : esc.status === 'resolved' ? 'success.main' : esc.status === 'closed' ? 'disabled.main' : 'grey.main' }}
                        />
                        <Typography>{esc.status}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {esc.assigneeName ? (
                          <>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => {
                                // Navigate to escalation details
                              }}>
                                <VisibilityOutlined />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Add Note">
                              <IconButton size="small" onClick={() => {
                                // Open add note dialog
                              }}>
                                <AddCommentOutlined />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title="Assign to Me">
                            <IconButton size="small" onClick={() => {
                              // Assign to current user
                            }}>
                              <PersonAddOutlined />
                            </IconButton>
                          </Tooltip>
                        )}
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
        {escalations?.length === 0 && <Typography>No escalation data available</Typography>}
        {escalations?.length > 0 && (
          <Typography>
            Total Escalations: <strong>{escalations.length}</strong> (
            <span sx={{ color: 'error.main' }}>{urgentEscalations.length}</span> Urgent,
            <span sx={{ color: 'warning.main' }}>{highEscalations.length}</span> High,
            <span sx={{ color: 'info.main' }}>{mediumEscalations.length}</span> Medium,
            <span sx={{ color: 'success.main' }}>{lowEscalations.length}</span> Low)
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Escalations;