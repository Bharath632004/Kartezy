"use client";

import { useState, useEffect } from 'react';import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, TextField, IconButton, Grid, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Search, FilterList, Add, Visibility, Send, Payment } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

const statusColors: Record<string, string> = {
  DRAFT: '#757575', SENT: '#1976d2', PARTIALLY_PAID: '#f57c00', PAID: '#388e3c', 
  OVERDUE: '#d32f2f', CANCELLED: '#c62828', REFUNDED: '#7b1fa2', WRITTEN_OFF: '#4e342e',
};

export default function InvoicesPage() {
  const { transactionsData, loading, fetchTransactionsData } = useFinanceStore();
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    fetchTransactionsData({});
  }, [fetchTransactionsData]);

  const invoices = transactionsData?.length > 0 ? transactionsData.slice(0, 10) : [];

  const totalOutstanding = invoices
    .filter((inv: any) => inv.status !== 'PAID' && inv.status !== 'paid')
    .reduce((sum: number, inv: any) => sum + (inv.total || inv.amount || 0), 0);
  const overdueCount = invoices.filter((inv: any) => inv.status === 'OVERDUE' || inv.status === 'overdue').length;
  const collectedMtd = invoices
    .filter((inv: any) => inv.status === 'PAID' || inv.status === 'paid')
    .reduce((sum: number, inv: any) => sum + (inv.paid || inv.amount || 0), 0);
  const pendingDraft = invoices.filter((inv: any) => inv.status === 'DRAFT' || inv.status === 'draft').length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Invoices</Typography>
          <Typography variant="body2" color="text.secondary">Manage invoices, payments, and outstanding</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" onClick={() => setOpenCreate(true)}>Create Invoice</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Outstanding', value: `₹${totalOutstanding.toLocaleString()}`, count: `${invoices.length} invoices`, color: '#f57c00' },
          { label: 'Overdue', value: `₹...`, count: `${overdueCount} invoices`, color: '#d32f2f' },
          { label: 'Collected (MTD)', value: `₹${collectedMtd.toLocaleString()}`, count: `${invoices.filter((i: any) => i.status === 'PAID' || i.status === 'paid').length} invoices`, color: '#388e3c' },
          { label: 'Pending Approval', value: `₹...`, count: `${pendingDraft} invoices`, color: '#1976d2' },
        ].map((stat) => (
          <Grid size={{ xs: 3 }} key={stat.label}>
            <Card sx={{ bgcolor: `${stat.color}08` }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField size="small" placeholder="Search invoices..." sx={{ flex: 1 }} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> } }} />
          <FormControl size="small" sx={{ minWidth: 150 }}><InputLabel>Status</InputLabel><Select label="Status"><MenuItem value="ALL">All</MenuItem><MenuItem value="PAID">Paid</MenuItem><MenuItem value="SENT">Sent</MenuItem><MenuItem value="OVERDUE">Overdue</MenuItem><MenuItem value="DRAFT">Draft</MenuItem></Select></FormControl>
          <IconButton><FilterList /></IconButton>
        </Box>
      </Paper>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading invoices...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Merchant/Vendor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Paid</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No invoices found. Create one to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((row: any) => {
                  const totalAmt = row.total || row.amount || 0;
                  const paidAmt = row.paid || 0;
                  const balanceAmt = totalAmt - paidAmt;
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.invNo || row.transactionId || `INV-${String(row.id).padStart(6, '0')}`}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.vendor || row.merchantName || '-'}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.merchant || '-'}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>₹{totalAmt.toLocaleString()}</TableCell>
                      <TableCell>₹{paidAmt.toLocaleString()}</TableCell>
                      <TableCell><Typography sx={{ color: balanceAmt > 0 ? '#f57c00' : '#388e3c', fontWeight: 600 }}>₹{balanceAmt.toLocaleString()}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{row.dueDate || row.createdAt?.split('T')[0] || '-'}</Typography></TableCell>
                      <TableCell><Chip label={(row.status || 'DRAFT').replace('_', ' ')} size="small" sx={{ bgcolor: `${statusColors[row.status || 'DRAFT']}20`, color: statusColors[row.status || 'DRAFT'], fontWeight: 600 }} /></TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                        {(row.status === 'SENT') && <IconButton size="small" color="warning"><Payment fontSize="small" /></IconButton>}
                        {(row.status === 'DRAFT') && <IconButton size="small" color="info"><Send fontSize="small" /></IconButton>}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Invoice</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField size="small" label="Merchant/Vendor" fullWidth />
            <TextField size="small" label="Amount" type="number" fullWidth />
            <TextField size="small" label="Due Date" type="date" slotProps={{ inputLabel: { shrink: true } }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenCreate(false)}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
