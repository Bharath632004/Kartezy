"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent } from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function WalletAccountingPage() {
  const { transactionsData, overview, loading, fetchTransactionsData, fetchOverview } = useFinanceStore();

  useEffect(() => {
    fetchTransactionsData({});
    fetchOverview();
  }, [fetchTransactionsData, fetchOverview]);

  const walletTxns = (transactionsData || []).slice(0, 10).map((t: any, idx: number) => ({
    id: t.id || idx + 1,
    walletId: t.walletId || 1000 + idx,
    type: t.type === 'wallet_topup' || t.type === 'charge' ? 'CREDIT' : 'DEBIT',
    merchant: t.merchantName || t.vendor || '-',
    amount: t.amount || 0,
    balanceBefore: t.balanceBefore || 0,
    balanceAfter: t.balanceAfter || t.amount || 0,
    ref: t.transactionId || t.ref || `TXN-${String(t.id || idx + 1).padStart(6, '0')}`,
    date: t.createdAt?.split('T')[0] || t.date || '-',
    status: t.status === 'failed' ? 'FAILED' : 'COMPLETED',
    desc: t.description || t.type || 'Transaction',
  }));

  const totalCredits = walletTxns.filter((t: any) => t.type === 'CREDIT').reduce((s: number, t: any) => s + t.amount, 0);
  const totalDebits = walletTxns.filter((t: any) => t.type === 'DEBIT').reduce((s: number, t: any) => s + t.amount, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Wallet Accounting</Typography>
        <Typography variant="body2" color="text.secondary">Track wallet transactions synced with Wallet Service</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Wallet Balance', value: `₹${(overview?.walletBalance || 0).toLocaleString()}`, color: '#1976d2' },
          { label: 'Credits (MTD)', value: `₹${totalCredits.toLocaleString()}`, color: '#388e3c' },
          { label: 'Debits (MTD)', value: `₹${totalDebits.toLocaleString()}`, color: '#d32f2f' },
          { label: 'Transactions', value: walletTxns.length.toString(), color: '#7b1fa2' },
        ].map((stat: any) => (
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
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading wallet transactions...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Wallet</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Merchant</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {walletTxns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No wallet transactions found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                walletTxns.map((t: any) => (
                  <TableRow key={t.id} hover>
                    <TableCell>{t.date}</TableCell>
                    <TableCell><Chip label={`#${t.walletId}`} size="small" variant="outlined" /></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t.merchant}</TableCell>
                    <TableCell>
                      <Chip label={t.type} size="small" color={t.type === 'CREDIT' ? 'success' : 'warning'} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: t.type === 'CREDIT' ? '#388e3c' : '#d32f2f' }}>
                      {t.type === 'CREDIT' ? '+' : '-'}₹{(t.amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>₹{(t.balanceAfter || 0).toLocaleString()}</TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{t.ref}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{t.desc}</Typography></TableCell>
                    <TableCell><Chip label={t.status} size="small" color={t.status === 'COMPLETED' ? 'success' : 'error'} /></TableCell>
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
