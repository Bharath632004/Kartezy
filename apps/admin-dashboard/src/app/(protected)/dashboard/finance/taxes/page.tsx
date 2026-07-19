"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent } from '@mui/material';
import { Download } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function TaxesPage() {
  const { transactionsData, loading, fetchTransactionsData } = useFinanceStore();

  useEffect(() => {
    fetchTransactionsData({});
  }, [fetchTransactionsData]);

  const tdsRecords = (transactionsData || []).slice(0, 8).map((t: any, idx: number) => ({
    id: t.id || idx + 1,
    section: t.type === 'charge' ? '194C' : t.type === 'payout' ? '194J' : '194H',
    vendor: t.merchantName || t.vendor || t.description || `Vendor ${idx + 1}`,
    entityId: t.transactionId || t.invNo || `REF-${String(t.id || idx + 1).padStart(6, '0')}`,
    date: t.createdAt?.split('T')[0] || '-',
    amount: t.amount || 0,
    tdsRate: t.type === 'charge' ? 1.0 : t.type === 'payout' ? 10.0 : 5.0,
    tdsAmount: Math.round((t.amount || 0) * (t.type === 'charge' ? 0.01 : t.type === 'payout' ? 0.10 : 0.05)),
    status: t.status === 'completed' || t.status === 'COMPLETED' ? 'DEPOSITED' : 'DEDUCTED',
    dueDate: t.dueDate || '-',
  }));

  const totalTds = tdsRecords.reduce((s: number, r: any) => s + r.tdsAmount, 0);
  const depositedTds = tdsRecords.filter((r: any) => r.status === 'DEPOSITED').reduce((s: number, r: any) => s + r.tdsAmount, 0);
  const pendingTds = tdsRecords.filter((r: any) => r.status === 'DEDUCTED').reduce((s: number, r: any) => s + r.tdsAmount, 0);
  const sections = new Set(tdsRecords.map((r: any) => r.section)).size;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Tax Management</Typography>
          <Typography variant="body2" color="text.secondary">TDS, tax deductions, and compliance tracking</Typography>
        </Box>
        <Button startIcon={<Download />} variant="outlined">Download TDS Certificates</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'TDS Deducted (MTD)', value: `₹${totalTds.toLocaleString()}`, color: '#d32f2f' },
          { label: 'TDS Deposited', value: `₹${depositedTds.toLocaleString()}`, color: '#388e3c' },
          { label: 'TDS Pending Deposit', value: `₹${pendingTds.toLocaleString()}`, color: '#f57c00' },
          { label: 'Active Deductions', value: `${sections} sections`, color: '#1976d2' },
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

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>TDS Records</Typography>
      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading TDS records...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Section</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Deductee</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Bill Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rate</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>TDS Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tdsRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No TDS records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tdsRecords.map((r: any) => (
                  <TableRow key={r.id} hover>
                    <TableCell><Chip label={r.section} size="small" color="primary" /></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{r.vendor}</TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.entityId}</Typography></TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>₹{(r.amount || 0).toLocaleString()}</TableCell>
                    <TableCell>{r.tdsRate}%</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#d32f2f' }}>₹{(r.tdsAmount || 0).toLocaleString()}</TableCell>
                    <TableCell>{r.dueDate}</TableCell>
                    <TableCell><Chip label={r.status} size="small" color={r.status === 'DEPOSITED' ? 'success' : 'warning'} /></TableCell>
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
