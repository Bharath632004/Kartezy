"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, AccountBalance, Sync, Refresh } from '@mui/icons-material';

const bankAccounts = [
  { id: 1, bank: 'HDFC Bank', holder: 'Kartezy Technologies', accountNo: 'XXXX-XXXX-4567', ifsc: 'HDFC0001234', type: 'CURRENT', balance: 1850000, available: 1845000, isPrimary: true, lastSync: '2026-07-01 10:30 AM' },
  { id: 2, bank: 'ICICI Bank', holder: 'Kartezy Escrow', accountNo: 'XXXX-XXXX-7890', ifsc: 'ICIC0005678', type: 'ESCROW', balance: 985000, available: 985000, isPrimary: false, lastSync: '2026-07-01 10:30 AM' },
  { id: 3, bank: 'Kotak Mahindra', holder: 'Kartezy Payable', accountNo: 'XXXX-XXXX-2345', ifsc: 'KKBK0009012', type: 'PAYOUT', balance: 456000, available: 456000, isPrimary: false, lastSync: '2026-07-01 10:30 AM' },
];

const dummyTransactions = [
  { id: 1, date: '2026-07-01', description: 'Payment from ORD-45678', ref: 'PAY-20260701-001', debit: 0, credit: 53100, balance: 1850000, reconciled: true },
  { id: 2, date: '2026-06-30', description: 'Settlement payout - FreshMart', ref: 'STL-20260630-001', debit: 397944, credit: 0, balance: 1796900, reconciled: false },
  { id: 3, date: '2026-06-29', description: 'Commission revenue', ref: 'COM-20260629-001', debit: 0, credit: 28500, balance: 2194844, reconciled: true },
  { id: 4, date: '2026-06-28', description: 'Payment gateway fees', ref: 'PGF-20260628-001', debit: 4500, credit: 0, balance: 2166344, reconciled: false },
];

export default function BanksPage() {
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
          <Grid item xs={12} md={4} key={b.id}>
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

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Recent Transactions - HDFC Bank</Typography>
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
              <TableCell sx={{ fontWeight: 600 }}>Reconciled</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyTransactions.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{t.ref}</Typography></TableCell>
                <TableCell sx={{ color: '#d32f2f', fontWeight: 600 }}>{t.debit > 0 ? `₹${t.debit.toLocaleString()}` : '-'}</TableCell>
                <TableCell sx={{ color: '#388e3c', fontWeight: 600 }}>{t.credit > 0 ? `₹${t.credit.toLocaleString()}` : '-'}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>₹{t.balance.toLocaleString()}</TableCell>
                <TableCell><Chip label={t.reconciled ? 'Yes' : 'No'} size="small" color={t.reconciled ? 'success' : 'warning'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
