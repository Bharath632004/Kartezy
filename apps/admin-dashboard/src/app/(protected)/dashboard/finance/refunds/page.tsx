"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Visibility, CheckCircle } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function RefundsPage() {
  const { refundsData, loading, fetchRefundsData } = useFinanceStore();

  useEffect(() => {
    fetchRefundsData({});
  }, [fetchRefundsData]);

  const refunds = (refundsData || []).slice(0, 10).map((r: any, idx: number) => ({
    id: r.id || idx + 1,
    refNo: r.refNo || r.refundId || `RFD-${String(r.id || idx + 1).padStart(6, '0')}`,
    orderNo: r.orderNo || r.orderId || '-',
    merchant: r.merchant || r.merchantName || '-',
    customer: r.customer || r.userId || '-',
    reason: r.reason || r.description || '-',
    amount: r.amount || 0,
    commissionRev: r.commissionRev || Math.round((r.amount || 0) * 0.05) || 0,
    deliveryRev: r.deliveryRev || Math.round((r.amount || 0) * 0.02) || 0,
    netRefund: r.netRefund || r.amount || 0,
    method: r.method || 'ORIGINAL',
    status: r.status || 'COMPLETED',
    date: r.date || r.createdAt?.split('T')[0] || '-',
  }));

  const totalRefundAmount = refunds.reduce((s: number, r: any) => s + r.amount, 0);
  const pendingCount = refunds.filter((r: any) => r.status === 'PENDING_APPROVAL' || r.status === 'PENDING').length;
  const commissionRev = refunds.reduce((s: number, r: any) => s + r.commissionRev, 0);
  const completedCount = refunds.filter((r: any) => r.status === 'COMPLETED').length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Refund Accounting</Typography>
          <Typography variant="body2" color="text.secondary">Track and process refunds with commission reversals</Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Refunds (MTD)', value: `₹${totalRefundAmount.toLocaleString()}`, color: '#d32f2f' },
          { label: 'Pending Approval', value: pendingCount, color: '#f57c00' },
          { label: 'Commission Reversed', value: `₹${commissionRev.toLocaleString()}`, color: '#7b1fa2' },
          { label: 'Completion Rate', value: refunds.length > 0 ? `${Math.round((completedCount / refunds.length) * 100)}%` : '0%', color: '#388e3c' },
        ].map((stat) => (
          <Grid size={{ xs: 3 }} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color, mt: 0.5 }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading refunds...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Refund #</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Merchant</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Net Refund</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {refunds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No refunds found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                refunds.map((r: any) => (
                  <TableRow key={r.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.refNo}</Typography></TableCell>
                    <TableCell>{r.orderNo}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{r.merchant}</TableCell>
                    <TableCell><Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.reason}</Typography></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>₹{(r.amount || 0).toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#d32f2f' }}>₹{(r.netRefund || 0).toLocaleString()}</TableCell>
                    <TableCell><Chip label={r.method} size="small" /></TableCell>
                    <TableCell><Chip label={(r.status || '').replace('_', ' ')} size="small" color={r.status === 'COMPLETED' ? 'success' : r.status === 'PENDING_APPROVAL' ? 'warning' : 'info'} /></TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                      {(r.status === 'PENDING_APPROVAL' || r.status === 'APPROVED') && <IconButton size="small" color="success"><CheckCircle fontSize="small" /></IconButton>}
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
