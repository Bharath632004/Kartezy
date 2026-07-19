"use client";

import { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, TextField, IconButton, Grid, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Search, FilterList, Add, Visibility, Send, Payment } from '@mui/icons-material';

const mockInvoices = [
  { id: 1, invNo: 'INV-20260701-001', merchant: 'FreshMart Grocery', vendor: 'Dairy Fresh Ltd', orderNo: 'ORD-45678', date: '2026-07-01', dueDate: '2026-07-31', subtotal: 45000, taxAmount: 8100, total: 53100, paid: 53100, balance: 0, status: 'PAID' },
  { id: 2, invNo: 'INV-20260630-001', merchant: 'TechZone', vendor: 'Samsung India', orderNo: 'ORD-45612', date: '2026-06-30', dueDate: '2026-07-30', subtotal: 89000, taxAmount: 16020, total: 105020, paid: 50000, balance: 55020, status: 'PARTIALLY_PAID' },
  { id: 3, invNo: 'INV-20260628-001', merchant: 'BookWorld', vendor: 'Penguin Books', orderNo: 'ORD-45589', date: '2026-06-28', dueDate: '2026-07-13', subtotal: 12400, taxAmount: 2232, total: 14632, paid: 0, balance: 14632, status: 'SENT' },
  { id: 4, invNo: 'INV-20260625-001', merchant: 'Organic Foods', vendor: 'Green Valley Farms', orderNo: 'ORD-45500', date: '2026-06-25', dueDate: '2026-07-10', subtotal: 32000, taxAmount: 5760, total: 37760, paid: 0, balance: 37760, status: 'OVERDUE' },
  { id: 5, invNo: 'INV-20260620-001', merchant: 'Daily Needs', vendor: 'ITC Limited', orderNo: 'ORD-45421', date: '2026-06-20', dueDate: '2026-07-05', subtotal: 28000, taxAmount: 5040, total: 33040, paid: 33040, balance: 0, status: 'PAID' },
  { id: 6, invNo: 'INV-20260618-001', merchant: 'FreshMart Grocery', vendor: 'Mother Dairy', orderNo: 'ORD-45389', date: '2026-06-18', dueDate: '2026-07-03', subtotal: 15600, taxAmount: 2808, total: 18408, paid: 0, balance: 18408, status: 'DRAFT' },
];

const statusColors: Record<string, string> = {
  DRAFT: '#757575', SENT: '#1976d2', PARTIALLY_PAID: '#f57c00', PAID: '#388e3c', OVERDUE: '#d32f2f', CANCELLED: '#c62828', REFUNDED: '#7b1fa2', WRITTEN_OFF: '#4e342e',
};

export default function InvoicesPage() {
  const [openCreate, setOpenCreate] = useState(false);

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
          { label: 'Total Outstanding', value: '₹2,62,422', count: '14 invoices', color: '#f57c00' },
          { label: 'Overdue', value: '₹37,760', count: '3 invoices', color: '#d32f2f' },
          { label: 'Collected (MTD)', value: '₹1,84,532', count: '23 invoices', color: '#388e3c' },
          { label: 'Pending Approval', value: '₹18,408', count: '2 invoices', color: '#1976d2' },
        ].map((stat) => (
          <Grid item xs={3} key={stat.label}>
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
          <TextField size="small" placeholder="Search invoices..." sx={{ flex: 1 }} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} />
          <FormControl size="small" sx={{ minWidth: 150 }}><InputLabel>Status</InputLabel><Select label="Status"><MenuItem value="ALL">All</MenuItem><MenuItem value="PAID">Paid</MenuItem><MenuItem value="SENT">Sent</MenuItem><MenuItem value="OVERDUE">Overdue</MenuItem><MenuItem value="DRAFT">Draft</MenuItem></Select></FormControl>
          <IconButton><FilterList /></IconButton>
        </Box>
      </Paper>

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
            {mockInvoices.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.invNo}</Typography></TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.vendor}</Typography>
                  <Typography variant="caption" color="text.secondary">{row.merchant}</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>₹{row.total.toLocaleString()}</TableCell>
                <TableCell>₹{row.paid.toLocaleString()}</TableCell>
                <TableCell><Typography sx={{ color: row.balance > 0 ? '#f57c00' : '#388e3c', fontWeight: 600 }}>₹{row.balance.toLocaleString()}</Typography></TableCell>
                <TableCell><Typography variant="body2">{row.dueDate}</Typography></TableCell>
                <TableCell><Chip label={row.status.replace('_', ' ')} size="small" sx={{ bgcolor: `${statusColors[row.status]}20`, color: statusColors[row.status], fontWeight: 600 }} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  {row.status === 'SENT' && <IconButton size="small" color="warning"><Payment fontSize="small" /></IconButton>}
                  {row.status === 'DRAFT' && <IconButton size="small" color="info"><Send fontSize="small" /></IconButton>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
