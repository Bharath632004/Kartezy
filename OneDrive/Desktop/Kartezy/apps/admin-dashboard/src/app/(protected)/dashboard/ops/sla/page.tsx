"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent, Button } from '@mui/material';
import { CheckCircle, Warning, Error as ErrorIcon, Timelapse } from '@mui/icons-material';

const slaRecords = [
  { id: 1, type: 'TICKET_FIRST_RESPONSE', entityType: 'TICKET', entityId: 1001, thresholdMins: 30, status: 'MET', startedAt: '2026-07-01 09:00', completedAt: '2026-07-01 09:20' },
  { id: 2, type: 'TICKET_RESOLUTION', entityType: 'TICKET', entityId: 1002, thresholdMins: 480, status: 'AT_RISK', startedAt: '2026-07-01 06:00', deadlineAt: '2026-07-01 14:00' },
  { id: 3, type: 'TICKET_RESOLUTION', entityType: 'TICKET', entityId: 1003, thresholdMins: 120, status: 'BREACHED', startedAt: '2026-06-30 10:00', deadlineAt: '2026-06-30 12:00', breachedMins: 45 },
  { id: 4, type: 'DELIVERY_PICKUP', entityType: 'DELIVERY', entityId: 5001, thresholdMins: 30, status: 'MET', startedAt: '2026-07-01 14:00', completedAt: '2026-07-01 14:15' },
  { id: 5, type: 'INCIDENT_RESPONSE', entityType: 'INCIDENT', entityId: 8001, thresholdMins: 15, status: 'BREACHED', startedAt: '2026-07-01 09:15', deadlineAt: '2026-07-01 09:30', breachedMins: 10 },
  { id: 6, type: 'DELIVERY_TRANSIT', entityType: 'DELIVERY', entityId: 5002, thresholdMins: 240, status: 'AT_RISK', startedAt: '2026-07-01 11:00', deadlineAt: '2026-07-01 15:00' },
];

const slaStatusColors: Record<string, string> = {
  MET: '#388e3c', AT_RISK: '#f57c00', BREACHED: '#d32f2f',
};

export default function SLAPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>SLA Monitoring</Typography>
          <Typography variant="body2" color="text.secondary">Monitor service level agreements and breach detection</Typography>
        </Box>
        <Button startIcon={<Timelapse />} variant="contained">Check All SLAs</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'SLA Met', value: '2', color: '#388e3c', icon: <CheckCircle /> },
          { label: 'At Risk', value: '2', color: '#f57c00', icon: <Warning /> },
          { label: 'Breached', value: '2', color: '#d32f2f', icon: <ErrorIcon /> },
          { label: 'On-Time Rate', value: '88%', color: '#1976d2', icon: <Timelapse /> },
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
              <TableCell sx={{ fontWeight: 600 }}>SLA Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Entity</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Threshold (min)</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Started</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Deadline</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Breached (min)</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slaRecords.map((sla) => (
              <TableRow key={sla.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{sla.type.replace('_', ' ')}</TableCell>
                <TableCell><Typography variant="caption">{sla.entityType} #{sla.entityId}</Typography></TableCell>
                <TableCell>{sla.thresholdMins}</TableCell>
                <TableCell>{sla.startedAt}</TableCell>
                <TableCell>{sla.deadlineAt || '-'}</TableCell>
                <TableCell><Typography color="error" sx={{ fontWeight: 600 }}>{sla.breachedMins || '-'}</Typography></TableCell>
                <TableCell><Chip label={sla.status.replace('_', ' ')} size="small" sx={{ bgcolor: `${slaStatusColors[sla.status]}20`, color: slaStatusColors[sla.status], fontWeight: 600 }} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
