"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, Visibility, CheckCircle, Error as ErrorIcon, Warning } from '@mui/icons-material';

const incidents = [
  { id: 1, number: 'INC-001', title: 'Delivery System Outage', category: 'TECHNICAL', severity: 'CRITICAL', status: 'INVESTIGATING', reportedBy: 'Amit K.', reportedAt: '2026-07-01 09:15', affectedOrders: 45, affectedCustomers: 38 },
  { id: 2, number: 'INC-002', title: 'Warehouse Power Failure', category: 'INFRASTRUCTURE', severity: 'MAJOR', status: 'MITIGATED', reportedBy: 'Sneha R.', reportedAt: '2026-07-01 11:30', affectedOrders: 12, affectedCustomers: 10 },
  { id: 3, number: 'INC-003', title: 'Payment Gateway Latency', category: 'TECHNICAL', severity: 'MAJOR', status: 'RESOLVED', reportedBy: 'System', reportedAt: '2026-06-30 14:00', affectedOrders: 28, affectedCustomers: 25 },
  { id: 4, number: 'INC-004', title: 'Fleet GPS Disconnect', category: 'OPERATIONAL', severity: 'MINOR', status: 'NEW', reportedBy: 'Raj P.', reportedAt: '2026-07-01 13:45', affectedOrders: 5, affectedCustomers: 5 },
];

const severityColors: Record<string, string> = {
  CRITICAL: '#d32f2f', MAJOR: '#f57c00', MINOR: '#1976d2', TRIVIAL: '#757575',
};

const statusColors: Record<string, string> = {
  NEW: '#1976d2', INVESTIGATING: '#f57c00', MITIGATED: '#7b1fa2', RESOLVED: '#388e3c',
};

export default function IncidentsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Incident Tracking</Typography>
          <Typography variant="body2" color="text.secondary">Track and manage operational incidents</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" color="error">Report Incident</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Open Incidents', value: '2', color: '#1976d2', icon: <Warning /> },
          { label: 'Critical', value: '1', color: '#d32f2f', icon: <ErrorIcon /> },
          { label: 'Resolved (MTD)', value: '5', color: '#388e3c', icon: <CheckCircle /> },
          { label: 'Total Affected Orders', value: '90', color: '#f57c00', icon: <Warning /> },
        ].map((s) => (
          <Grid item xs={3} key={s.label}>
            <Card><CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              </Box>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Incident</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reported By</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Affected</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Severity</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((inc) => (
              <TableRow key={inc.id} hover>
                <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{inc.number}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{inc.title}</TableCell>
                <TableCell><Chip label={inc.category} size="small" variant="outlined" /></TableCell>
                <TableCell>{inc.reportedBy}</TableCell>
                <TableCell>
                  <Typography variant="caption">{inc.affectedOrders} orders, {inc.affectedCustomers} customers</Typography>
                </TableCell>
                <TableCell><Chip label={inc.severity} size="small" sx={{ bgcolor: `${severityColors[inc.severity]}20`, color: severityColors[inc.severity], fontWeight: 600 }} /></TableCell>
                <TableCell><Chip label={inc.status} size="small" sx={{ bgcolor: `${statusColors[inc.status]}20`, color: statusColors[inc.status], fontWeight: 600 }} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
