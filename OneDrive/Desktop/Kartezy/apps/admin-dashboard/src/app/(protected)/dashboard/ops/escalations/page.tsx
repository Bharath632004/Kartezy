"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';

const escalations = [
  { id: 1, ticket: 'TKT-A1B2C3D4', level: 'L1_SUPPORT', from: 'Support Agent', to: 'Team Lead', reason: 'Payment issue - needs approval', status: 'RESOLVED', escalatedAt: '2026-07-01 09:00' },
  { id: 2, ticket: 'TKT-E5F6G7H8', level: 'L2_SUPPORT', from: 'Team Lead', to: 'Engineering', reason: 'System bug causing order failures', status: 'ACKNOWLEDGED', escalatedAt: '2026-07-01 11:30' },
  { id: 3, ticket: 'TKT-I9J0K1L2', level: 'L3_SUPPORT', from: 'Engineering', to: 'Management', reason: 'Critical payment gateway outage', status: 'PENDING', escalatedAt: '2026-07-01 13:00' },
  { id: 4, ticket: 'TKT-M3N4O5P6', level: 'L1_SUPPORT', from: 'Support Agent', to: 'Team Lead', reason: 'Refund escalation for ₹15,000', status: 'PENDING', escalatedAt: '2026-07-01 14:15' },
];

const levelColors: Record<string, string> = {
  L1_SUPPORT: '#1976d2', L2_SUPPORT: '#f57c00', L3_SUPPORT: '#d32f2f', MANAGEMENT: '#7b1fa2',
};

const statusColors: Record<string, string> = {
  PENDING: '#f57c00', ACKNOWLEDGED: '#1976d2', RESOLVED: '#388e3c',
};

export default function EscalationsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Escalation Management</Typography>
        <Typography variant="body2" color="text.secondary">Track and manage ticket escalations across support tiers</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Pending', value: 2, color: '#f57c00' },
          { label: 'Acknowledged', value: 1, color: '#1976d2' },
          { label: 'Resolved', value: 1, color: '#388e3c' },
          { label: 'L3 Escalations', value: 1, color: '#d32f2f' },
        ].map((s) => (
          <Grid item xs={3} key={s.label}>
            <Card><CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Ticket</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>From</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>To</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Escalated At</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {escalations.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{e.ticket}</TableCell>
                <TableCell><Chip label={e.level.replace('_', ' ')} size="small" sx={{ bgcolor: `${levelColors[e.level]}20`, color: levelColors[e.level], fontWeight: 600 }} /></TableCell>
                <TableCell>{e.from}</TableCell>
                <TableCell>{e.to}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}><Typography variant="body2" noWrap>{e.reason}</Typography></TableCell>
                <TableCell>{e.escalatedAt}</TableCell>
                <TableCell><Chip label={e.status} size="small" sx={{ bgcolor: `${statusColors[e.status]}20`, color: statusColors[e.status], fontWeight: 600 }} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
