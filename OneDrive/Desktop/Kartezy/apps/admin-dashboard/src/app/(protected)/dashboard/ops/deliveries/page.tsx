"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent } from '@mui/material';
import { LocalShipping, CheckCircle, Warning, Error as ErrorIcon, Schedule } from '@mui/icons-material';

const deliveries = [
  { id: 1, orderId: 'ORD-1201', partner: 'Rahul S.', zone: 'MUM-Central', status: 'IN_TRANSIT', distance: 8, eta: 12, assignedAt: '2026-07-01 14:00' },
  { id: 2, orderId: 'ORD-1202', partner: 'Priya K.', zone: 'MUM-North', status: 'PICKED_UP', distance: 5, eta: 10, assignedAt: '2026-07-01 14:15' },
  { id: 3, orderId: 'ORD-1203', partner: 'Amit P.', zone: 'MUM-South', status: 'DELIVERED', distance: 3, eta: 8, assignedAt: '2026-07-01 13:30' },
  { id: 4, orderId: 'ORD-1204', partner: 'Sneha M.', zone: 'MUM-West', status: 'ASSIGNED', distance: 6, eta: 15, assignedAt: '2026-07-01 14:30' },
  { id: 5, orderId: 'ORD-1205', partner: 'Vikram J.', zone: 'MUM-East', status: 'FAILED', distance: 10, eta: 0, assignedAt: '2026-07-01 12:00' },
  { id: 6, orderId: 'ORD-1206', partner: 'Neha G.', zone: 'MUM-Central', status: 'IN_TRANSIT', distance: 4, eta: 8, assignedAt: '2026-07-01 14:10' },
];

const statusColors: Record<string, string> = {
  PENDING: '#757575', ASSIGNED: '#1976d2', PICKED_UP: '#f57c00', IN_TRANSIT: '#7b1fa2', DELIVERED: '#388e3c', FAILED: '#d32f2f',
};

export default function DeliveryOpsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Delivery Operations</Typography>
        <Typography variant="body2" color="text.secondary">Live delivery tracking, fleet management, and performance</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Live Deliveries', value: '3', color: '#7b1fa2', icon: <LocalShipping /> },
          { label: 'Completed Today', value: '18', color: '#388e3c', icon: <CheckCircle /> },
          { label: 'Failed Today', value: '2', color: '#d32f2f', icon: <ErrorIcon /> },
          { label: 'On-Time Rate', value: '92%', color: '#1976d2', icon: <Schedule /> },
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
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Partner</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Zone</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Distance</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ETA (min)</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Assigned At</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.map((d) => (
              <TableRow key={d.id} hover>
                <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{d.orderId}</TableCell>
                <TableCell>{d.partner}</TableCell>
                <TableCell>{d.zone}</TableCell>
                <TableCell>{d.distance} km</TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: d.eta > 0 ? 600 : 400 }}>{d.eta > 0 ? `${d.eta}` : '-'}</Typography></TableCell>
                <TableCell>{d.assignedAt}</TableCell>
                <TableCell><Chip label={d.status.replace('_', ' ')} size="small" sx={{ bgcolor: `${statusColors[d.status]}20`, color: statusColors[d.status], fontWeight: 600 }} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
