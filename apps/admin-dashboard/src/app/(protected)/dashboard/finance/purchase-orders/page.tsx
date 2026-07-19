"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, IconButton, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Search, Add, Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

const statusColors: Record<string, string> = {
  DRAFT: '#757575', PENDING_APPROVAL: '#f57c00', APPROVED: '#1976d2', RECEIVED: '#388e3c', OVERDUE: '#d32f2f', CANCELLED: '#c62828',
};

export default function PurchaseOrdersPage() {
  const { transactionsData, loading, fetchTransactionsData } = useFinanceStore();
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    fetchTransactionsData({});
  }, [fetchTransactionsData]);

  const purchaseOrders = transactionsData?.length > 0 ? transactionsData.slice(0, 10) : [];

  const pendingApproval = purchaseOrders.filter((po: any) => po.status === 'PENDING_APPROVAL' || po.status === 'pending').length;
  const approved = purchaseOrders.filter((po: any) => po.status === 'APPROVED' || po.status === 'approved').length;
  const received = purchaseOrders.filter((po: any) => po.status === 'RECEIVED' || po.status === 'completed').length;
  const overdue = purchaseOrders.filter((po: any) => po.status === 'OVERDUE' || po.status === 'overdue').length;

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
          { label: 'Pending Approval', value: pendingApproval, color: '#f57c00' },
          { label: 'Approved', value: approved, color: '#1976d2' },
          { label: 'Received', value: received, color: '#388e3c' },
          { label: 'Overdue', value: overdue, color: '#d32f2f' },
        ].map((stat) => (
          <Grid size={{ xs: 3 }} key={stat.label}>
            <Card sx={{ bgcolor: `${stat.color}08` }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading purchase orders...</Typography>
      ) : (
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
              {purchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No purchase orders found. Create one to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                purchaseOrders.map((po: any) => (
                  <TableRow key={po.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{po.po || po.transactionId || `PO-${String(po.id).padStart(6, '0')}`}</Typography></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{po.vendor || po.merchantName || '-'}</TableCell>
                    <TableCell>{po.date || po.createdAt?.split('T')[0] || '-'}</TableCell>
                    <TableCell>{po.expected || po.dueDate || '-'}</TableCell>
                    <TableCell>{po.items || po.itemCount || 0}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>₹{((po.total || po.amount || 0))?.toLocaleString()}</TableCell>
                    <TableCell><Chip label={(po.status || 'DRAFT').replace('_', ' ')} size="small" sx={{ bgcolor: `${statusColors[po.status || 'DRAFT']}20`, color: statusColors[po.status || 'DRAFT'], fontWeight: 600 }} /></TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                      {(po.status === 'PENDING_APPROVAL' || po.status === 'pending') && <IconButton size="small" color="success"><CheckCircle fontSize="small" /></IconButton>}
                      {(po.status === 'DRAFT' || po.status === 'draft') && <IconButton size="small" color="error"><Cancel fontSize="small" /></IconButton>}
                    </TableCell>
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
