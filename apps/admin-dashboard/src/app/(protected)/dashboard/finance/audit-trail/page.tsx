"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, IconButton, Grid, Card, CardContent, Button } from '@mui/material';
import { Search, Download, History, Description } from '@mui/icons-material';

const auditLogs = [
  { id: 1, action: 'CREATE', entity: 'SETTLEMENT', entityId: 'STL-20260701-001', user: 'System', ip: '10.0.1.25', timestamp: '2026-07-01 10:30:00', description: 'Created settlement for FreshMart Grocery', changes: null },
  { id: 2, action: 'UPDATE', entity: 'INVOICE', entityId: 'INV-20260630-001', user: 'admin@kartezy.com', ip: '192.168.1.100', timestamp: '2026-06-30 15:45:12', description: 'Payment recorded: ₹50,000 against invoice', changes: 'paidAmount: 0 -> 50000; status: SENT -> PARTIALLY_PAID' },
  { id: 3, action: 'APPROVE', entity: 'PURCHASE_ORDER', entityId: 'PO-20260701-001', user: 'finance@kartezy.com', ip: '192.168.1.101', timestamp: '2026-07-01 09:15:00', description: 'Purchase order approved', changes: 'status: PENDING_APPROVAL -> APPROVED' },
  { id: 4, action: 'CREATE', entity: 'JOURNAL_ENTRY', entityId: 'JE-STL-20260701-001', user: 'System', ip: '10.0.1.25', timestamp: '2026-07-01 10:30:05', description: 'Settlement journal entry created', changes: null },
  { id: 5, action: 'SUBMIT', entity: 'GST_RETURN', entityId: 'GSTR3B-05/2026', user: 'tax@kartezy.com', ip: '192.168.1.102', timestamp: '2026-06-18 14:20:00', description: 'GSTR-3B filed for May 2026', changes: 'status: PENDING -> FILED; netPayable: 67220' },
  { id: 6, action: 'RECONCILE', entity: 'RECONCILIATION', entityId: 'RCL-20260701-001', user: 'System', ip: '10.0.1.25', timestamp: '2026-07-01 02:00:00', description: 'Auto-reconciliation completed', changes: 'status: UNMATCHED -> MATCHED' },
  { id: 7, action: 'ROLE_CHANGE', entity: 'USER', entityId: 'user_456', user: 'superadmin@kartezy.com', ip: '192.168.1.200', timestamp: '2026-06-29 11:00:00', description: 'User role updated from VIEWER to FINANCE', changes: 'role: VIEWER -> FINANCE' },
];

const actionColors: Record<string, string> = {
  CREATE: '#388e3c', UPDATE: '#1976d2', DELETE: '#d32f2f', APPROVE: '#f57c00', REJECT: '#c62828',
  SUBMIT: '#7b1fa2', RECONCILE: '#00838f', ROLE_CHANGE: '#4e342e', SYSTEM_OVERRIDE: '#bf360c',
};

export default function AuditTrailPage() {
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
          { label: 'Total Events (24h)', value: 156, color: '#1976d2' },
          { label: 'Critical Actions', value: 3, color: '#d32f2f' },
          { label: 'System Generated', value: 112, color: '#757575' },
          { label: 'User Actions', value: 44, color: '#388e3c' },
        ].map((stat) => (
          <Grid item xs={3} key={stat.label}>
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
          <TextField size="small" label="From" type="datetime-local" InputLabelProps={{ shrink: true }} />
          <TextField size="small" label="To" type="datetime-local" InputLabelProps={{ shrink: true }} />
          <TextField size="small" placeholder="Search by entity, user, or description..." sx={{ flex: 1 }} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Entity</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Entity ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>IP</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{log.timestamp}</Typography></TableCell>
                <TableCell><Chip label={log.action} size="small" sx={{ bgcolor: `${actionColors[log.action]}20`, color: actionColors[log.action], fontWeight: 600 }} /></TableCell>
                <TableCell><Chip icon={<Description sx={{ fontSize: 14 }} />} label={log.entity} size="small" variant="outlined" /></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{log.entityId}</Typography></TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{log.ip}</Typography></TableCell>
                <TableCell>
                  <Typography variant="body2">{log.description}</Typography>
                  {log.changes && <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.65rem', display: 'block' }}>{log.changes}</Typography>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
