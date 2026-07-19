"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent, Switch } from '@mui/material';
import { Rule } from '@mui/icons-material';

const rules = [
  { id: 1, name: 'Standard Commission', type: 'COMMISSION', scope: 'GLOBAL', value: '0.15 (15%)', active: true, priority: 1 },
  { id: 2, name: 'Premium Merchant Commission', type: 'COMMISSION', scope: 'Merchant Category', scopeId: 5, value: '0.12 (12%)', active: true, priority: 2 },
  { id: 3, name: 'Ticket First Response SLA', type: 'SLA', scope: 'GLOBAL', value: '30 minutes', active: true, priority: 1 },
  { id: 4, name: 'Critical Resolution SLA', type: 'SLA', scope: 'Priority: CRITICAL', value: '120 minutes', active: true, priority: 1 },
  { id: 5, name: 'Mumbai City Commission', type: 'COMMISSION', scope: 'City: Mumbai', scopeId: 1, value: '0.10 (10%)', active: true, priority: 3 },
  { id: 6, name: 'Festival Surcharge', type: 'PRICING', scope: 'GLOBAL', value: '0.05 (5% surcharge)', active: false, priority: 5 },
  { id: 7, name: 'Auto-Verification Rule', type: 'VERIFICATION', scope: 'GLOBAL', value: 'Auto-verify < 10 orders', active: true, priority: 2 },
];

const typeColors: Record<string, string> = {
  COMMISSION: '#388e3c', SLA: '#1976d2', PRICING: '#f57c00', VERIFICATION: '#7b1fa2', ALLOCATION: '#00838f',
};

export default function RulesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Business Rules Engine</Typography>
        <Typography variant="body2" color="text.secondary">Configure and manage business rules for operations</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Rules', value: 6, color: '#388e3c' },
          { label: 'Inactive', value: 1, color: '#757575' },
          { label: 'Commission Rules', value: 3, color: '#388e3c' },
          { label: 'SLA Rules', value: 2, color: '#1976d2' },
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
              <TableCell sx={{ fontWeight: 600 }}>Rule Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Scope</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>
                <TableCell><Chip label={r.type} size="small" sx={{ bgcolor: `${typeColors[r.type]}20`, color: typeColors[r.type], fontWeight: 600 }} /></TableCell>
                <TableCell>{r.scope}</TableCell>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.value}</Typography></TableCell>
                <TableCell>{r.priority}</TableCell>
                <TableCell>
                  <Switch checked={r.active} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
