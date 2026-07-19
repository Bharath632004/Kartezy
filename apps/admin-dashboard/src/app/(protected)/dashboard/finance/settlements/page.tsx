"use client";

import { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, TextField, IconButton, Grid, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Search, FilterList, Download, Add, Visibility } from '@mui/icons-material';

const mockSettlements = [
  { id: 1, settlementNo: 'STL-20260701-001', merchant: 'FreshMart Grocery', period: '01-Jun to 15-Jun', orders: 156, grossAmount: 456000, commission: 22800, deliveryFee: 15600, platformFee: 7800, gst: 7296, tds: 4560, netAmount: 397944, status: 'COMPLETED', date: '2026-07-01' },
  { id: 2, settlementNo: 'STL-20260701-002', merchant: 'TechZone Electronics', period: '01-Jun to 15-Jun', orders: 89, grossAmount: 389000, commission: 19450, deliveryFee: 8900, platformFee: 4450, gst: 5835, tds: 3890, netAmount: 346475, status: 'PROCESSING', date: '2026-07-01' },
  { id: 3, settlementNo: 'STL-20260628-001', merchant: 'Daily Needs Store', period: '15-May to 31-May', orders: 234, grossAmount: 345000, commission: 17250, deliveryFee: 23400, platformFee: 6900, gst: 5805, tds: 3450, netAmount: 288195, status: 'PENDING', date: '2026-06-28' },
  { id: 4, settlementNo: 'STL-20260625-001', merchant: 'Organic Foods', period: '10-May to 25-May', orders: 67, grossAmount: 234000, commission: 11700, deliveryFee: 6700, platformFee: 4680, gst: 4446, tds: 2340, netAmount: 204134, status: 'FAILED', date: '2026-06-25', reason: 'Bank verification failed' },
  { id: 5, settlementNo: 'STL-20260620-001', merchant: 'BookWorld', period: '05-May to 20-May', orders: 112, grossAmount: 178000, commission: 8900, deliveryFee: 11200, platformFee: 3560, gst: 3382, tds: 1780, netAmount: 149178, status: 'COMPLETED', date: '2026-06-20' },
];

const statusColors: Record<string, string> = {
  PENDING: '#f57c00', PROCESSING: '#1976d2', COMPLETED: '#388e3c', FAILED: '#d32f2f', CANCELLED: '#757575', PARTIALLY_COMPLETED: '#7b1fa2', ON_HOLD: '#e65100', REVERSED: '#c62828',
};

export default function SettlementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [openNew, setOpenNew] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Merchant Settlements</Typography>
          <Typography variant="body2" color="text.secondary">Manage and process merchant payouts</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Download />} variant="outlined" size="small">Export</Button>
          <Button startIcon={<Add />} variant="contained" onClick={() => setOpenNew(true)}>Create Settlement</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Pending', value: '₹2,88,195', count: 1, color: '#f57c00' },
          { label: 'Processing', value: '₹3,46,475', count: 1, color: '#1976d2' },
          { label: 'Completed (MTD)', value: '₹5,47,122', count: 2, color: '#388e3c' },
          { label: 'Failed', value: '₹2,04,134', count: 1, color: '#d32f2f' },
        ].map((stat) => (
          <Grid item xs={3} key={stat.label}>
            <Card sx={{ bgcolor: `${stat.color}08` }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.count} settlement(s)</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField size="small" placeholder="Search by settlement no. or merchant..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ flex: 1 }} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="ALL">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="PROCESSING">Processing</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
            </Select>
          </FormControl>
          <IconButton><FilterList /></IconButton>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Settlement #</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Merchant</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Orders</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Gross Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Net Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockSettlements.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{row.settlementNo}</Typography></TableCell>
                <TableCell>{row.merchant}</TableCell>
                <TableCell><Typography variant="caption">{row.period}</Typography></TableCell>
                <TableCell>{row.orders}</TableCell>
                <TableCell>₹{row.grossAmount.toLocaleString()}</TableCell>
                <TableCell><Typography sx={{ fontWeight: 600, color: '#388e3c' }}>₹{row.netAmount.toLocaleString()}</Typography></TableCell>
                <TableCell>
                  <Chip label={row.status} size="small" sx={{ bgcolor: `${statusColors[row.status]}20`, color: statusColors[row.status], fontWeight: 600 }} />
                </TableCell>
                <TableCell><Typography variant="caption">{row.date}</Typography></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openNew} onClose={() => setOpenNew(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Settlement</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Merchant</InputLabel>
              <Select label="Merchant">
                <MenuItem value={1}>FreshMart Grocery</MenuItem>
                <MenuItem value={2}>TechZone Electronics</MenuItem>
                <MenuItem value={3}>Daily Needs Store</MenuItem>
              </Select>
            </FormControl>
            <TextField size="small" label="Cycle Start Date" type="date" InputLabelProps={{ shrink: true }} />
            <TextField size="small" label="Cycle End Date" type="date" InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNew(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenNew(false)}>Create Settlement</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
