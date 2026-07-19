"use client";

import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, IconButton, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Search, Add, Visibility, CheckCircle, Cancel } from '@mui/icons-material';

const mockPOs = [
  { id: 1, po: 'PO-20260701-001', vendor: 'Dairy Fresh Ltd', date: '2026-07-01', expected: '2026-07-10', status: 'APPROVED', items: 5, subtotal: 45000, tax: 8100, total: 53100 },
  { id: 2, po: 'PO-20260628-002', vendor: 'Samsung India', date: '2026-06-28', expected: '2026-07-15', status: 'PENDING_APPROVAL', items: 12, subtotal: 89000, tax: 16020, total: 105020 },
  { id: 3, po: 'PO-20260625-003', vendor: 'Green Valley Farms', date: '2026-06-25', expected: '2026-07-05', status: 'RECEIVED', items: 8, subtotal: 32000, tax: 5760, total: 37760 },
  { id: 4, po: 'PO-20260620-004', vendor: 'ITC Limited', date: '2026-06-20', expected: '2026-06-30', status: 'OVERDUE', items: 3, subtotal: 28000, tax: 5040, total: 33040 },
  { id: 5, po: 'PO-20260618-005', vendor: 'Mother Dairy', date: '2026-06-18', expected: '2026-07-08', status: 'DRAFT', items: 6, subtotal: 15600, tax: 2808, total: 18408 },
];

const statusColors: Record<string, string> = {
  DRAFT: '#757575', PENDING_APPROVAL: '#f57c00', APPROVED: '#1976d2', RECEIVED: '#388e3c', OVERDUE: '#d32f2f', CANCELLED: '#c62828',
};

export default function PurchaseOrdersPage() {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Purchase Orders</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage purchase orders</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" onClick={() => setOpenCreate(true)}>Create PO</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Pending Approval', value: 1, amount: '₹1,05,020', color: '#f57c00' },
          { label: 'Approved', value: 1, amount: '₹53,100', color: '#1976d2' },
          { label: 'Received', value: 1, amount: '₹37,760', color: '#388e3c' },
          { label: 'Overdue', value: 1, amount: '₹33,040', color: '#d32f2f' },
        ].map((stat) => (
          <Grid item xs={3} key={stat.label}>
            <Card sx={{ bgcolor: `${stat.color}08` }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.amount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>PO Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Vendor</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Expected</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPOs.map((po) => (
              <TableRow key={po.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{po.po}</Typography></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{po.vendor}</TableCell>
                <TableCell>{po.date}</TableCell>
                <TableCell>{po.expected}</TableCell>
                <TableCell>{po.items}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>₹{po.total.toLocaleString()}</TableCell>
                <TableCell><Chip label={po.status.replace('_', ' ')} size="small" sx={{ bgcolor: `${statusColors[po.status]}20`, color: statusColors[po.status], fontWeight: 600 }} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  {po.status === 'PENDING_APPROVAL' && <IconButton size="small" color="success"><CheckCircle fontSize="small" /></IconButton>}
                  {po.status === 'DRAFT' && <IconButton size="small" color="error"><Cancel fontSize="small" /></IconButton>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
