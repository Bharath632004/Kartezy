"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent, LinearProgress } from '@mui/material';
import { Warehouse } from '@mui/icons-material';

const warehouses = [
  { id: 1, code: 'WH-MUM-01', name: 'Mumbai Central Hub', city: 'Mumbai', capacitySqFt: 50000, usedSqFt: 38000, status: 'ACTIVE', bays: 20, occupiedBays: 15, utilization: 76 },
  { id: 2, code: 'WH-DEL-01', name: 'Delhi Gateway', city: 'Delhi', capacitySqFt: 75000, usedSqFt: 62000, status: 'ACTIVE', bays: 30, occupiedBays: 24, utilization: 83 },
  { id: 3, code: 'WH-BLR-01', name: 'Bangalore Tech Park', city: 'Bangalore', capacitySqFt: 40000, usedSqFt: 32000, status: 'ACTIVE', bays: 15, occupiedBays: 14, utilization: 80 },
  { id: 4, code: 'WH-HYD-01', name: 'Hyderabad Logistics', city: 'Hyderabad', capacitySqFt: 30000, usedSqFt: 15000, status: 'ACTIVE', bays: 12, occupiedBays: 6, utilization: 50 },
  { id: 5, code: 'WH-MUM-02', name: 'Mumbai West Fulfillment', city: 'Mumbai', capacitySqFt: 25000, usedSqFt: 22000, status: 'MAINTENANCE', bays: 10, occupiedBays: 2, utilization: 88 },
];

const statusColors: Record<string, string> = {
  ACTIVE: '#388e3c', MAINTENANCE: '#f57c00', INACTIVE: '#757575',
};

export default function WarehousesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Warehouse Operations</Typography>
        <Typography variant="body2" color="text.secondary">Manage warehouses, capacity, and utilization</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active', value: 4, color: '#388e3c' },
          { label: 'Maintenance', value: 1, color: '#f57c00' },
          { label: 'Total Capacity', value: '220K sq.ft', color: '#1976d2' },
          { label: 'Avg Utilization', value: '75%', color: '#7b1fa2' },
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
              <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Capacity</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Bays</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Utilization</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.map((w) => (
              <TableRow key={w.id} hover>
                <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{w.code}</TableCell>
                <TableCell>{w.name}</TableCell>
                <TableCell>{w.city}</TableCell>
                <TableCell>{w.capacitySqFt.toLocaleString()} sq.ft</TableCell>
                <TableCell>{w.occupiedBays}/{w.bays}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress variant="determinate" value={w.utilization} sx={{ flexGrow: 1, height: 8, borderRadius: 4 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{w.utilization}%</Typography>
                  </Box>
                </TableCell>
                <TableCell><Chip label={w.status} size="small" sx={{ bgcolor: `${statusColors[w.status]}20`, color: statusColors[w.status], fontWeight: 600 }} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
