"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent } from '@mui/material';
import { AccountBalanceWallet, TrendingUp, TrendingDown } from '@mui/icons-material';

const walletTxns = [
  { id: 1, walletId: 1001, type: 'CREDIT', merchant: 'FreshMart Grocery', amount: 50000, balanceBefore: 125000, balanceAfter: 175000, ref: 'STL-20260701-001', date: '2026-07-01', status: 'COMPLETED', desc: 'Settlement payout' },
  { id: 2, walletId: 1002, type: 'DEBIT', merchant: 'TechZone Electronics', amount: 15000, balanceBefore: 89000, balanceAfter: 74000, ref: 'WTH-20260630-001', date: '2026-06-30', status: 'COMPLETED', desc: 'Manual withdrawal' },
  { id: 3, walletId: 1001, type: 'CREDIT', merchant: 'FreshMart Grocery', amount: 32000, balanceBefore: 93000, balanceAfter: 125000, ref: 'STL-20260628-001', date: '2026-06-28', status: 'COMPLETED', desc: 'Settlement payout' },
  { id: 4, walletId: 1003, type: 'DEBIT', merchant: 'Daily Needs Store', amount: 25000, balanceBefore: 78000, balanceAfter: 53000, ref: 'PYT-20260625-001', date: '2026-06-25', status: 'COMPLETED', desc: 'Order payment' },
  { id: 5, walletId: 1004, type: 'CREDIT', merchant: 'Organic Foods', amount: 45000, balanceBefore: 34000, balanceAfter: 79000, ref: 'STL-20260620-001', date: '2026-06-20', status: 'PROCESSING', desc: 'Settlement payout' },
];

export default function WalletAccountingPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Wallet Accounting</Typography>
        <Typography variant="body2" color="text.secondary">Track merchant/customer wallet transactions synced with Wallet Service</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Wallet Balance', value: '₹4,56,000', color: '#1976d2' },
          { label: 'Credits (MTD)', value: '₹1,27,000', trend: 12.5, color: '#388e3c' },
          { label: 'Debits (MTD)', value: '₹40,000', trend: -8.3, color: '#d32f2f' },
          { label: 'Active Wallets', value: '24', color: '#7b1fa2' },
        ].map((stat: any) => (
          <Grid item xs={3} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color, mt: 0.5 }}>{stat.value}</Typography>
                {stat.trend && (
                  <Typography variant="caption" color={stat.trend >= 0 ? 'success.main' : 'error.main'}>
                    {stat.trend >= 0 ? '+' : ''}{stat.trend}% vs last month
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
            {walletTxns.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.date}</TableCell>
                <TableCell><Chip label={`#${t.walletId}`} size="small" variant="outlined" /></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.merchant}</TableCell>
                <TableCell>
                  <Chip label={t.type} size="small" color={t.type === 'CREDIT' ? 'success' : 'warning'} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: t.type === 'CREDIT' ? '#388e3c' : '#d32f2f' }}>
                  {t.type === 'CREDIT' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace' }}>₹{t.balanceAfter.toLocaleString()}</TableCell>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{t.ref}</Typography></TableCell>
                <TableCell variant="body2">{t.desc}</TableCell>
                <TableCell><Chip label={t.status} size="small" color={t.status === 'COMPLETED' ? 'success' : 'warning'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
