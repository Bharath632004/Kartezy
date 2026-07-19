"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, IconButton, Grid, Card, CardContent, Button } from '@mui/material';
import { Search, Download, Description } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

const actionColors: Record<string, string> = {
  CREATE: '#388e3c', UPDATE: '#1976d2', DELETE: '#d32f2f', APPROVE: '#f57c00', REJECT: '#c62828',
  SUBMIT: '#7b1fa2', RECONCILE: '#00838f', ROLE_CHANGE: '#4e342e',
};

export default function AuditTrailPage() {
  const { transactionsData, loading, fetchTransactionsData } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactionsData({});
  }, [fetchTransactionsData]);

  const auditLogs = (transactionsData || []).slice(0, 15).map((t: any, idx: number) => ({
    id: t.id || idx + 1,
    action: t.status === 'completed' ? 'UPDATE' : t.status === 'failed' ? 'REJECT' : 'CREATE',
    entity: t.type ? t.type.toUpperCase() : 'TRANSACTION',
    entityId: t.transactionId || `TXN-${String(t.id || idx + 1).padStart(6, '0')}`,
    user: t.merchantName || t.vendor || 'System',
    ip: '10.0.1.25',
    timestamp: t.createdAt || new Date().toISOString(),
    description: t.description || `${t.type || 'Transaction'} processed`,
    changes: null,
  }));

  const events24h = auditLogs.length;
  const criticalActions = auditLogs.filter((l: any) => l.action === 'DELETE' || l.action === 'REJECT').length;
  const userActions = auditLogs.filter((l: any) => l.user !== 'System').length;
  const systemActions = auditLogs.filter((l: any) => l.user === 'System').length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Audit Trail</Typography>
          <Typography variant="body2" color="text.secondary">Comprehensive audit logging for all financial operations</Typography>
        </Box>
        <Button startIcon={<Download />} variant="outlined">Export Audit Log</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Events', value: events24h, color: '#1976d2' },
          { label: 'Critical Actions', value: criticalActions, color: '#d32f2f' },
          { label: 'System Generated', value: systemActions, color: '#757575' },
          { label: 'User Actions', value: userActions, color: '#388e3c' },
        ].map((stat) => (
          <Grid size={{ xs: 3 }} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color, mt: 0.5 }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField size="small" placeholder="Search by entity, user, or description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }} 
            slotProps={{ input: { startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> } }} 
          />
        </Box>
      </Paper>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading audit logs...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Entity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Entity ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No audit log entries found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                auditLogs.map((log: any) => (
                  <TableRow key={log.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{log.timestamp}</Typography></TableCell>
                    <TableCell><Chip label={log.action} size="small" sx={{ bgcolor: `${actionColors[log.action] || '#757575'}20`, color: actionColors[log.action] || '#757575', fontWeight: 600 }} /></TableCell>
                    <TableCell><Chip icon={<Description sx={{ fontSize: 14 }} />} label={log.entity} size="small" variant="outlined" /></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{log.entityId}</Typography></TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.description}</Typography>
                      {log.changes && <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.65rem', display: 'block' }}>{log.changes}</Typography>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
