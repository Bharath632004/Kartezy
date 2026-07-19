"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, IconButton, Grid, Card, CardContent } from '@mui/material';
import { Search, Add, Edit, Visibility, Star } from '@mui/icons-material';

const mockSuppliers = [
  { id: 1, code: 'SUP-20260601-001', name: 'Puma Sports India', company: 'Puma India Pvt Ltd', contact: 'Arun Mehta', gstin: '27AABCP1234D1Z1', category: 'Sports, Apparel', rating: 5, status: 'ACTIVE', preferred: true, contractEnd: '2027-06-30' },
  { id: 2, code: 'SUP-20260605-002', name: 'Tata Consumer Products', company: 'Tata Group', contact: 'Vikram Joshi', gstin: '27AABCT5678E1Z1', category: 'FMCG, Beverages', rating: 5, status: 'ACTIVE', preferred: true, contractEnd: '2027-12-31' },
  { id: 3, code: 'SUP-20260610-003', name: 'Hindustan Unilever', company: 'HUL Limited', contact: 'Deepa Nair', gstin: '27AABCH9012F1Z1', category: 'FMCG, Personal Care', rating: 4, status: 'ACTIVE', preferred: false, contractEnd: '2026-09-30' },
  { id: 4, code: 'SUP-20260615-004', name: 'Nestlé India', company: 'Nestlé India Ltd', contact: 'Rohan Verma', gstin: '07AABCN3456G1Z1', category: 'Food & Beverages', rating: 4, status: 'ACTIVE', preferred: true, contractEnd: '2026-08-15' },
  { id: 5, code: 'SUP-20260620-005', name: 'Dabur India', company: 'Dabur India Ltd', contact: 'Priyanka Gupta', gstin: '07AABDD7890H1Z1', category: 'Healthcare, FMCG', rating: 3, status: 'ACTIVE', preferred: false, contractEnd: '2026-07-20' },
];

export default function SuppliersPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Suppliers</Typography>
          <Typography variant="body2" color="text.secondary">Manage direct suppliers and contracts</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">Add Supplier</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Suppliers', value: 5, color: '#388e3c' },
          { label: 'Preferred Partners', value: 3, color: '#f57c00' },
          { label: 'Expiring Soon', value: 2, color: '#d32f2f' },
          { label: 'Avg Rating', value: '4.2/5', color: '#7b1fa2' },
        ].map((stat) => (
          <Grid item xs={3} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField size="small" placeholder="Search suppliers..." sx={{ flex: 1 }} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} />
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contract End</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockSuppliers.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.code}</Typography></TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.contact}</Typography>
                </TableCell>
                <TableCell>{s.company}</TableCell>
                <TableCell><Chip label={s.category} size="small" /></TableCell>
                <TableCell>{'★'.repeat(s.rating)}{'☆'.repeat(5-s.rating)}</TableCell>
                <TableCell>
                  <Typography variant="body2" color={new Date(s.contractEnd) < new Date(Date.now() + 60*24*60*60*1000) ? 'error' : 'text.primary'}>{s.contractEnd}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={s.status} size="small" color="success" />
                  {s.preferred && <Star sx={{ fontSize: 14, color: '#f57c00', ml: 0.5 }} />}
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  <IconButton size="small" color="info"><Edit fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
