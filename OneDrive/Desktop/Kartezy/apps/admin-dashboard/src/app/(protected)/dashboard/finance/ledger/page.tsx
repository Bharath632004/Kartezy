"use client";

import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, Button } from '@mui/material';
import { Search, Download } from '@mui/icons-material';

const ledgerEntries = [
  { id: 1, date: '2026-07-01', account: 'Cash', code: '101001', description: 'Payment from ORD-45678', type: 'PAYMENT_RECEIVED', debit: 0, credit: 53100, balance: 2845000 },
  { id: 2, date: '2026-07-01', account: 'Accounts Receivable', code: '104001', description: 'Invoice INV-20260701-001', type: 'SALE', debit: 53100, credit: 0, balance: 124500 },
  { id: 3, date: '2026-06-30', account: 'Commission Revenue', code: '401001', description: 'Commission from ORD-45612', type: 'COMMISSION', debit: 0, credit: 19450, balance: 680000 },
  { id: 4, date: '2026-06-30', account: 'GST Payable', code: '202001', description: 'GST collected ORD-45612', type: 'GST_COLLECTED', debit: 0, credit: 3240, balance: 67800 },
  { id: 5, date: '2026-06-28', account: 'Salary Payable', code: '203001', description: 'June salary accrual', type: 'PAYMENT_MADE', debit: 0, credit: 350000, balance: 350000 },
  { id: 6, date: '2026-06-25', account: 'Marketing Expenses', code: '505001', description: 'Google Ads June campaign', type: 'PAYMENT_MADE', debit: 120000, credit: 0, balance: 480000 },
];

export default function LedgerPage() {
  const [accountFilter, setAccountFilter] = useState('ALL');

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
          <Grid item xs={4}>
            <TextField size="small" label="From Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={4}>
            <TextField size="small" label="To Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={4}>
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
            {ledgerEntries.map((row) => (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
