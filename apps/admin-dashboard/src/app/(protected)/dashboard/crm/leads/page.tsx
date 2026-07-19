"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, Edit, PersonAdd, Visibility } from '@mui/icons-material';

const leads = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91-9876543210', source: 'WEBSITE', status: 'NEW', score: 75, assigned: 'Amit K.', created: '2026-07-01' },
  { id: 2, name: 'Priya Patel', email: 'priya@cafebusiness.com', phone: '+91-9876543211', source: 'REFERRAL', status: 'CONTACTED', score: 88, assigned: 'Sneha R.', created: '2026-06-30' },
  { id: 3, name: 'Vikram Singh', email: 'vikram@retail.org', phone: '+91-9876543212', source: 'SOCIAL_MEDIA', status: 'QUALIFIED', score: 92, assigned: 'Amit K.', created: '2026-06-28' },
  { id: 4, name: 'Neha Gupta', email: 'neha@startup.in', phone: '+91-9876543213', source: 'EMAIL_CAMPAIGN', status: 'NEW', score: 45, assigned: '', created: '2026-06-27' },
  { id: 5, name: 'Arun Kumar', email: 'arun@traders.com', phone: '+91-9876543214', source: 'ORGANIC_SEARCH', status: 'CONVERTED', score: 95, assigned: 'Sneha R.', created: '2026-06-25' },
  { id: 6, name: 'Deepa Nair', email: 'deepa@restaurant.in', phone: '+91-9876543215', source: 'WALK_IN', status: 'LOST', score: 30, assigned: '', created: '2026-06-24' },
];

const statusColors: Record<string, string> = {
  NEW: '#1976d2', CONTACTED: '#f57c00', QUALIFIED: '#7b1fa2', CONVERTED: '#388e3c', LOST: '#d32f2f',
};

export default function LeadsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Lead Management</Typography>
          <Typography variant="body2" color="text.secondary">Capture, score, and convert leads</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">Add Lead</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'New Leads', value: 2, color: '#1976d2' },
          { label: 'Contacted', value: 1, color: '#f57c00' },
          { label: 'Qualified', value: 1, color: '#7b1fa2' },
          { label: 'Converted (MTD)', value: 12, color: '#388e3c' },
        ].map((s) => (
          <Grid size={{ xs: 3 }} key={s.label}>
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
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((l) => (
              <TableRow key={l.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{l.name}</TableCell>
                <TableCell>
                  <Typography variant="body2">{l.email}</Typography>
                  <Typography variant="caption" color="text.secondary">{l.phone}</Typography>
                </TableCell>
                <TableCell><Chip label={l.source.replace('_', ' ')} size="small" variant="outlined" /></TableCell>
                <TableCell>
                  <Chip label={l.score} size="small" color={l.score >= 80 ? 'success' : l.score >= 50 ? 'warning' : 'default'} />
                </TableCell>
                <TableCell>{l.assigned || '-'}</TableCell>
                <TableCell>{l.created}</TableCell>
                <TableCell><Chip label={l.status} size="small" sx={{ bgcolor: `${statusColors[l.status]}20`, color: statusColors[l.status], fontWeight: 600 }} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  <IconButton size="small" color="info"><Edit fontSize="small" /></IconButton>
                  {l.status === 'NEW' && <IconButton size="small" color="success"><PersonAdd fontSize="small" /></IconButton>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
