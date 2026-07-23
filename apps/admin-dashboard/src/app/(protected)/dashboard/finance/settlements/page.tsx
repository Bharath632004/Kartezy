"use client";

import { useState, useEffect } from 'react';import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, TextField, IconButton, Grid, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Search, FilterList, Download, Add, Visibility } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

const statusColors: Record<string, string> = {
  PENDING: '#f57c00', PROCESSING: '#1976d2', COMPLETED: '#388e3c', FAILED: '#d32f2f', CANCELLED: '#757575',
  PARTIALLY_COMPLETED: '#7b1fa2', ON_HOLD: '#e65100', REVERSED: '#c62828',
};

export default function SettlementsPage() {
  const { settlementsData, loading, fetchSettlementsData } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [openNew, setOpenNew] = useState(false);

  useEffect(() => {
    fetchSettlementsData({});
  }, [fetchSettlementsData]);

  const displayedSettlements = (settlementsData || []).filter((row: any) => {
    if (statusFilter !== 'ALL' && row.status !== statusFilter) return false;
    if (searchTerm && !row.settlementNo?.includes(searchTerm) && !row.merchant?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const pendingCount = displayedSettlements.filter((s: any) => s.status === 'PENDING').length;
  const processingCount = displayedSettlements.filter((s: any) => s.status === 'PROCESSING').length;
  const completedCount = displayedSettlements.filter((s: any) => s.status === 'COMPLETED').length;
  const failedCount = displayedSettlements.filter((s: any) => s.status === 'FAILED').length;
  const pendingAmount = displayedSettlements.filter((s: any) => s.status === 'PENDING').reduce((sum: number, s: any) => sum + (s.netAmount || 0), 0);
  const processingAmount = displayedSettlements.filter((s: any) => s.status === 'PROCESSING').reduce((sum: number, s: any) => sum + (s.netAmount || 0), 0);
  const completedAmount = displayedSettlements.filter((s: any) => s.status === 'COMPLETED').reduce((sum: number, s: any) => sum + (s.netAmount || 0), 0);
  const failedAmount = displayedSettlements.filter((s: any) => s.status === 'FAILED').reduce((sum: number, s: any) => sum + (s.netAmount || 0), 0);

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
          { label: 'Total Pending', value: `₹${pendingAmount.toLocaleString()}`, count: pendingCount, color: '#f57c00' },
          { label: 'Processing', value: `₹${processingAmount.toLocaleString()}`, count: processingCount, color: '#1976d2' },
          { label: 'Completed (MTD)', value: `₹${completedAmount.toLocaleString()}`, count: completedCount, color: '#388e3c' },
          { label: 'Failed', value: `₹${failedAmount.toLocaleString()}`, count: failedCount, color: '#d32f2f' },
        ].map((stat) => (
          <Grid size={{ xs: 3 }} key={stat.label}>
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
          <TextField size="small" placeholder="Search by settlement no. or merchant..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ flex: 1 }} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> } }} />
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

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading settlements...</Typography>
      ) : (
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
              {displayedSettlements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No settlements found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedSettlements.map((row: any) => (
                  <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{row.settlementNo || row.payoutId || `STL-${String(row.id).padStart(6, '0')}`}</Typography></TableCell>
                    <TableCell>{row.merchant || row.merchantName || '-'}</TableCell>
                    <TableCell><Typography variant="caption">{row.period || '-'}</Typography></TableCell>
                    <TableCell>{row.orders || row.orderCount || 0}</TableCell>
                    <TableCell>₹{((row.grossAmount || row.totalAmount || 0))?.toLocaleString() || '0'}</TableCell>
                    <TableCell><Typography sx={{ fontWeight: 600, color: '#388e3c' }}>₹{((row.netAmount || row.amount || 0))?.toLocaleString() || '0'}</Typography></TableCell>
                    <TableCell>
                      <Chip label={row.status || 'PENDING'} size="small" sx={{ bgcolor: `${statusColors[row.status || 'PENDING']}20`, color: statusColors[row.status || 'PENDING'], fontWeight: 600 }} />
                    </TableCell>
                    <TableCell><Typography variant="caption">{row.date || row.createdAt?.split('T')[0] || '-'}</Typography></TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
            <TextField size="small" label="Cycle Start Date" type="date" slotProps={{ inputLabel: { shrink: true } }} />
            <TextField size="small" label="Cycle End Date" type="date" slotProps={{ inputLabel: { shrink: true } }} />
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
