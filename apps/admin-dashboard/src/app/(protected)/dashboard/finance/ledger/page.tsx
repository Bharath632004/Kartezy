"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, Button } from '@mui/material';
import { Search, Download } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function LedgerPage() {
  const { transactionsData, loading, fetchTransactionsData } = useFinanceStore();
  const [accountFilter, setAccountFilter] = useState('ALL');

  useEffect(() => {
    fetchTransactionsData({});
  }, [fetchTransactionsData]);

  const ledgerEntries = (transactionsData || []).slice(0, 15).map((t: any, idx: number) => ({
    id: t.id || idx + 1,
    date: t.createdAt?.split('T')[0] || '-',
    account: t.type === 'charge' ? 'Cash' : t.type === 'refund' ? 'Accounts Receivable' : 'Revenue',
    code: t.type === 'charge' ? '101001' : t.type === 'refund' ? '104001' : '401001',
    description: t.description || `${t.type || 'Transaction'} - ${t.transactionId || t.id}`,
    type: t.type || 'PAYMENT_RECEIVED',
    debit: t.type === 'refund' || t.type === 'payout' ? (t.amount || 0) : 0,
    credit: t.type !== 'refund' && t.type !== 'payout' ? (t.amount || 0) : 0,
    balance: t.amount || 0,
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>General Ledger</Typography>
          <Typography variant="body2" color="text.secondary">View all financial transactions with running balances</Typography>
        </Box>
        <Button startIcon={<Download />} variant="outlined" size="small">Export Ledger</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 4 }}>
            <TextField size="small" label="From Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <TextField size="small" label="To Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Account</InputLabel>
              <Select value={accountFilter} label="Account" onChange={(e) => setAccountFilter(e.target.value)}>
                <MenuItem value="ALL">All Accounts</MenuItem>
                <MenuItem value="101001">Cash</MenuItem>
                <MenuItem value="104001">Accounts Receivable</MenuItem>
                <MenuItem value="401001">Commission Revenue</MenuItem>
                <MenuItem value="202001">GST Payable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading ledger entries...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Debit</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Credit</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Running Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ledgerEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No ledger entries found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                ledgerEntries.map((row: any) => (
                  <TableRow key={row.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.date}</Typography></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.account}</TableCell>
                    <TableCell><Chip label={row.code} size="small" variant="outlined" /></TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell><Chip label={row.type.replace('_', ' ')} size="small" color={row.debit > 0 ? 'warning' : 'info'} variant="outlined" /></TableCell>
                    <TableCell align="right" sx={{ color: '#d32f2f', fontWeight: 600 }}>{row.debit > 0 ? `₹${row.debit.toLocaleString()}` : '-'}</TableCell>
                    <TableCell align="right" sx={{ color: '#388e3c', fontWeight: 600 }}>{row.credit > 0 ? `₹${row.credit.toLocaleString()}` : '-'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{row.balance.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
