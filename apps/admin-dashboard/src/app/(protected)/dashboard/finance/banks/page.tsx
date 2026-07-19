"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Card, CardContent, IconButton, Grid } from '@mui/material';
import { Add, AccountBalance, Sync, Refresh } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function BanksPage() {
  const { overview, transactionsData, loading, fetchOverview, fetchTransactionsData } = useFinanceStore();
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  useEffect(() => {
    fetchOverview();
    fetchTransactionsData({});
  }, [fetchOverview, fetchTransactionsData]);

  useEffect(() => {
    if (overview) {
      setBankAccounts([
        { id: 1, bank: 'HDFC Bank', holder: 'Kartezy Technologies', accountNo: 'XXXX-XXXX-4567', ifsc: 'HDFC0001234', type: 'CURRENT', balance: overview.walletBalance || 0, available: overview.walletBalance || 0, isPrimary: true, lastSync: new Date().toISOString() },
      ]);
    }
  }, [overview]);

  const recentTransactions = transactionsData?.slice(0, 5) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Multi-Bank Accounts</Typography>
          <Typography variant="body2" color="text.secondary">Manage bank accounts, balances, and transactions</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Sync />} variant="outlined">Sync All</Button>
          <Button startIcon={<Add />} variant="contained">Add Bank Account</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {bankAccounts.map((b) => (
          <Grid size={{ xs: 12, md: 4 }} key={b.id}>
            <Card sx={{ border: b.isPrimary ? '2px solid #1976d2' : 'none' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalance sx={{ color: '#1976d2' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{b.bank}</Typography>
                  </Box>
                  {b.isPrimary && <Chip label="PRIMARY" size="small" color="primary" />}
                </Box>
                <Typography variant="body2" color="text.secondary">{b.holder}</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{b.accountNo}</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>{b.ifsc}</Typography>
                <Typography variant="caption" color="text.secondary">{b.type}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#388e3c', my: 1 }}>₹{b.balance.toLocaleString()}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Available: ₹{b.available.toLocaleString()}</Typography>
                  <Typography variant="caption" color="text.secondary">Last sync: {b.lastSync}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                  <Button size="small" startIcon={<Refresh />}>Sync</Button>
                  <Button size="small">View</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Recent Transactions</Typography>
      
      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading transactions...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Debit</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Credit</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No recent transactions found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recentTransactions.map((t: any) => {
                  const amount = t.amount || 0;
                  const isDebit = t.type === 'refund' || t.type === 'payout' || t.type === 'withdrawal';
                  return (
                    <TableRow key={t.id} hover>
                      <TableCell>{t.createdAt?.split('T')[0] || t.date || '-'}</TableCell>
                      <TableCell>{t.description || t.type || 'Transaction'}</TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{t.transactionId || t.id}</Typography></TableCell>
                      <TableCell sx={{ color: '#d32f2f', fontWeight: 600 }}>{isDebit ? `₹${amount.toLocaleString()}` : '-'}</TableCell>
                      <TableCell sx={{ color: '#388e3c', fontWeight: 600 }}>{!isDebit ? `₹${amount.toLocaleString()}` : '-'}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>₹{amount.toLocaleString()}</TableCell>
                      <TableCell><Chip label={t.status || 'completed'} size="small" color={t.status === 'failed' ? 'error' : 'success'} /></TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
