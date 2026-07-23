"use client";

import { Box, Container, Typography, Card, CardContent, Button, Divider, TextField, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Wallet as WalletIcon, AccountBalance as Bank, CreditCard } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadWalletData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [balanceRes, txnRes] = await Promise.all([
        api.get('/api/wallet/balance'),
        api.get('/api/wallet/transactions', { params: { limit: 20 } })
      ]);
      setBalance(balanceRes.data.balance ?? balanceRes.data.amount ?? 0);
      setTransactions(txnRes.data.transactions ?? txnRes.data ?? []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please log in to view your wallet');
      } else {
        setError(err.response?.data?.message || 'Failed to load wallet data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadWalletData(); }, [loadWalletData]);

  const handleAddMoney = async () => {
    const amount = parseFloat(addMoneyAmount);
    if (isNaN(amount) || amount <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid amount', severity: 'warning' });
      return;
    }
    try {
      setActionLoading(true);
      const res = await api.post('/api/wallet/add', { amount });
      setBalance(res.data.balance ?? balance + amount);
      setAddMoneyAmount('');
      setSnackbar({ open: true, message: `₹${amount} added successfully`, severity: 'success' });
      loadWalletData();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to add money', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid amount', severity: 'warning' });
      return;
    }
    if (amount > balance) {
      setSnackbar({ open: true, message: 'Insufficient balance', severity: 'warning' });
      return;
    }
    try {
      setActionLoading(true);
      const res = await api.post('/api/wallet/withdraw', { amount });
      setBalance(res.data.balance ?? balance - amount);
      setWithdrawAmount('');
      setSnackbar({ open: true, message: `₹${amount} withdrawal initiated`, severity: 'success' });
      loadWalletData();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to withdraw', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <Container maxWidth="xl" sx={{ py: 6, textAlign: 'center' }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Loading wallet...</Typography>
    </Container>
  );

  if (error && !balance) return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button variant="outlined" onClick={loadWalletData}>Retry</Button>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 600  sx={{ mb: 2 }}>Kartezy Wallet</Typography>
        <Typography variant="body1" color="text.secondary">Your secure digital wallet for faster transactions</Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: { xs: 3, md: 6 }, mb: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <WalletIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 600  sx={{ mb: 1 }}>Wallet Balance</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }} color="primary.main">₹{balance.toLocaleString('en-IN')}</Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 4 }}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <Bank sx={{ fontSize: 32, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 1 }}>Add Money</Typography>
              <TextField label="Amount (₹)" value={addMoneyAmount} onChange={(e) => setAddMoneyAmount(e.target.value)}
                sx={{ mb: 2, width: '100%' }} type="number" inputProps={{ min: 1 }} />
              <Button variant="contained" color="primary" size="medium" sx={{ width: '100%' }}
                onClick={handleAddMoney} disabled={actionLoading || !addMoneyAmount}>
                {actionLoading ? <CircularProgress size={24} /> : 'Add Money'}
              </Button>
            </Card>

            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CreditCard sx={{ fontSize: 32, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600  sx={{ mb: 1 }}>Withdraw to Bank</Typography>
              <TextField label="Amount (₹)" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}
                sx={{ mb: 2, width: '100%' }} type="number" inputProps={{ min: 1, max: balance }} />
              <Button variant="contained" color="secondary" size="medium" sx={{ width: '100%' }}
                onClick={handleWithdraw} disabled={actionLoading || !withdrawAmount || parseFloat(withdrawAmount) > balance}>
                {actionLoading ? <CircularProgress size={24} /> : 'Withdraw'}
              </Button>
            </Card>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600  sx={{ mb: 2 }}>Transaction History</Typography>
            {transactions.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No transactions yet</Typography>
            ) : (
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                {transactions.map((txn, idx) => (
                  <Box key={txn.id || idx}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2,
                      borderBottom: idx < transactions.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%',
                        backgroundColor: (txn.type === 'credit' || txn.amount > 0) ? '#e8f5e9' : '#ffebee',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                        {(txn.type === 'credit' || txn.amount > 0)
                          ? <Box sx={{ color: 'success.main', fontSize: 20 }}>+</Box>
                          : <Box sx={{ color: 'error.main', fontSize: 20 }}>-</Box>}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{txn.description || txn.type}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {txn.date ? new Date(txn.date).toLocaleDateString('en-IN') : ''}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}
                        color={(txn.type === 'credit' || txn.amount > 0) ? 'success.main' : 'error.main'}>
                        {(txn.type === 'credit' || txn.amount > 0) ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{txn.status}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default WalletPage;
