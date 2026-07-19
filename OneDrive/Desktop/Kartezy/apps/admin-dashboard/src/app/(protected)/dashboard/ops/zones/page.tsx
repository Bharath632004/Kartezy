"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent } from '@mui/material';
import { Map } from '@mui/icons-material';

const zones = [
  { id: 1, name: 'Mumbai-Central', city: 'Mumbai', type: 'PRIMARY', population: 250000, partners: 45, radius: 5.0 },
  { id: 2, name: 'Mumbai-North', city: 'Mumbai', type: 'EXPANDED', population: 180000, partners: 28, radius: 8.0 },
  { id: 3, name: 'Delhi-South', city: 'Delhi', type: 'PRIMARY', population: 320000, partners: 52, radius: 4.5 },
  { id: 4, name: 'Bangalore-East', city: 'Bangalore', type: 'PREMIUM', population: 200000, partners: 35, radius: 3.0 },
  { id: 5, name: 'Hyderabad-West', city: 'Hyderabad', type: 'EXPANDED', population: 150000, partners: 22, radius: 7.0 },
  { id: 6, name: 'Mumbai-South', city: 'Mumbai', type: 'PREMIUM', population: 190000, partners: 38, radius: 3.5 },
];

const typeColors: Record<string, string> = {
  PRIMARY: '#1976d2', EXPANDED: '#388e3c', PREMIUM: '#f57c00',
};

export default function ZonesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Zone Management</Typography>
        <Typography variant="body2" color="text.secondary">Manage delivery zones and coverage areas</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Zones', value: 6, color: '#1976d2' },
          { label: 'Primary Zones', value: 2, color: '#1976d2' },
          { label: 'Expanded', value: 2, color: '#388e3c' },
          { label: 'Premium', value: 2, color: '#f57c00' },
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
              <TableCell sx={{ fontWeight: 600 }}>Zone Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Population</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Partners</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Radius (km)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zones.map((z) => (
              <TableRow key={z.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{z.name}</TableCell>
                <TableCell>{z.city}</TableCell>
                <TableCell><Chip label={z.type} size="small" sx={{ bgcolor: `${typeColors[z.type]}20`, color: typeColors[z.type], fontWeight: 600 }} /></TableCell>
                <TableCell>{z.population.toLocaleString()}</TableCell>
                <TableCell>{z.partners}</TableCell>
                <TableCell>{z.radius}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
