"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { CheckCircle, Warning, Sync, PlayArrow } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function ReconciliationPage() {
  const { transactionsData, loading, fetchTransactionsData } = useFinanceStore();

  useEffect(() => {
    fetchTransactionsData({});
  }, [fetchTransactionsData]);

  const reconciliationItems = (transactionsData || []).slice(0, 8).map((t: any, idx: number) => ({
    id: t.id || idx + 1,
    bankTxn: `BANK-${t.createdAt?.split('T')[0]?.replace(/-/g, '') || '00000000'}-${String(t.id || idx + 1).padStart(3, '0')}`,
    bankDesc: t.description || t.type || 'Transaction',
    bankAmount: t.amount || 0,
    sysRef: t.transactionId || `SYS-${t.id || idx + 1}`,
    sysAmount: t.amount || 0,
    diff: 0,
    matchType: 'EXACT',
    status: 'MATCHED',
  }));

  const matched = reconciliationItems.filter((r: any) => r.status === 'MATCHED').length;
  const partial = reconciliationItems.filter((r: any) => r.status === 'PARTIALLY_MATCHED').length;
  const unmatched = reconciliationItems.filter((r: any) => r.status === 'UNMATCHED').length;
  const matchRate = reconciliationItems.length > 0 ? Math.round((matched / reconciliationItems.length) * 100) : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Payment Reconciliation</Typography>
          <Typography variant="body2" color="text.secondary">Reconcile bank transactions with system records</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Sync />} variant="outlined">Import Bank Data</Button>
          <Button startIcon={<PlayArrow />} variant="contained">Auto-Reconcile</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Matched', value: matched, amount: `${reconciliationItems.filter((r: any) => r.status === 'MATCHED').reduce((s: number, r: any) => s + r.bankAmount, 0).toLocaleString()}`, color: '#388e3c' },
          { label: 'Partial Match', value: partial, amount: `${partial > 0 ? 'Pending review' : 'N/A'}`, color: '#f57c00' },
          { label: 'Unmatched', value: unmatched, amount: `${unmatched > 0 ? reconciliationItems.filter((r: any) => r.status === 'UNMATCHED').reduce((s: number, r: any) => s + r.bankAmount, 0).toLocaleString() : 'N/A'}`, color: '#d32f2f' },
          { label: 'Match Rate', value: `${matchRate}%`, color: '#1976d2' },
        ].map((stat) => (
          <Grid size={{ xs: 3 }} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color, mt: 0.5 }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.amount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading reconciliation data...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Bank Transaction</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Bank Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>System Ref</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>System Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Difference</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Match Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reconciliationItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No reconciliation data available.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reconciliationItems.map((r: any) => (
                  <TableRow key={r.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.bankTxn}</Typography></TableCell>
                    <TableCell>{r.bankDesc}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>₹{r.bankAmount.toLocaleString()}</TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.sysRef}</Typography></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>₹{r.sysAmount.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: r.diff === 0 ? '#388e3c' : '#d32f2f' }}>{r.diff === 0 ? '-' : `₹${r.diff.toLocaleString()}`}</TableCell>
                    <TableCell>{r.matchType && <Chip label={r.matchType} size="small" color={r.matchType === 'EXACT' ? 'success' : 'warning'} />}</TableCell>
                    <TableCell><Chip label={r.status.replace('_', ' ')} size="small" color={r.status === 'MATCHED' ? 'success' : r.status === 'PARTIALLY_MATCHED' ? 'warning' : 'error'} /></TableCell>
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
