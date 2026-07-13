"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, TextField, LinearProgress, CircularProgress } from '@mui/material';
import { Wallet, Bank, History, TransferWithinAStation, Login, Redeem, CardGiftcard, LocalAtm, CreditCard, Payments, Receipt } from '@mui/icons-material';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    const loadWalletData = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from API
        // For now, we'll use mock data
        const mockBalance = 500; // ₹500
        const mockTransactions = [
          {
            id: 'txn1',
            date: '2023-05-15',
            description: 'Added to wallet',
            amount: 1000,
            type: 'credit',
            status: 'success',
          },
          {
            id: 'txn2',
            date: '2023-05-14',
            description: 'Order #1001',
            amount: -450,
            type: 'debit',
            status: 'success',
          },
          {
            id: 'txn3',
            date: '2023-05-13',
            description: 'Cashback',
            amount: 50,
            type: 'credit',
            status: 'success',
          },
          {
            id: 'txn4',
            date: '2023-05-12',
            description: 'Order #1000',
            amount: -300,
            type: 'debit',
            status: 'success',
          },
        ];
        setBalance(mockBalance);
        setTransactions(mockTransactions);
      } catch (err) {
        setError('Failed to load wallet data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, []);

  const handleAddMoney = async () => {
    const amount = parseFloat(addMoneyAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    try {
      // In a real app, we would call the API to add money
      // For now, we'll just update the balance locally
      setBalance(prev => prev + amount);
      setAddMoneyAmount('');
      // Add transaction to the list
      const newTransaction = {
        id: `txn${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: 'Added to wallet',
        amount: amount,
        type: 'credit',
        status: 'success',
      };
      setTransactions(prev => [newTransaction, ...prev]);
      alert(`₹${amount} added to wallet successfully`);
    } catch (err) {
      setError('Failed to add money');
      console.error(err);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (amount > balance) {
      setError('Insufficient balance');
      return;
    }
    try {
      // In a real app, we would call the API to withdraw money
      // For now, we'll just update the balance locally
      setBalance(prev => prev - amount);
      setWithdrawAmount('');
      // Add transaction to the list
      const newTransaction = {
        id: `txn${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: 'Withdrawn to bank',
        amount: -amount,
        type: 'debit',
        status: 'success',
      };
      setTransactions(prev => [newTransaction, ...prev]);
      alert(`₹${amount} withdrawn successfully`);
    } catch (err) {
      setError('Failed to withdraw money');
      console.error(err);
    }
  };

  if (loading) return <div>Loading wallet...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Kartify Wallet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your secure digital wallet for faster transactions
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Wallet fontSize={48} color="primary.main" sx={{ mb: 2 }} />
            <Typography variant="h3" fontWeight={600} sx={{ mb: 1 }}>
              Wallet Balance
            </Typography>
            <Typography variant="h4" fontWeight={600} color="primary.main">
              ₹{balance}
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 4 }}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <Bank fontSize={32} color="primary.main" sx={{ mb: 2 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Add Money
              </Typography>
              <TextField
                label="Amount (₹)"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                sx={{ mb: 2, width: '100%' }}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                color="primary"
                size="medium"
                sx={{ width: '100%' }}
                onClick={handleAddMoney}
              >
                Add Money
              </Button>
            </Card>

            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CreditCard fontSize={32} color="primary.main" sx={{ mb: 2 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Withdraw to Bank
              </Typography>
              <TextField
                label="Amount (₹)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                sx={{ mb: 2, width: '100%' }}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                sx={{ width: '100%' }}
                disabled={withdrawAmount === '' || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > balance}
                onClick={handleWithdraw}
              >
                Withdraw
              </Button>
            </Card>

            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <TransferWithinAStation fontSize={32} color="primary.main" sx={{ mb: 2 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Send to Friend
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                sx={{ width: '100%' }}
              >
                Send Money
              </Button>
            </Card>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Transaction History
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Button
                variant="text"
                size="small"
                color="primary.main"
              >
                View All
              </Button>
            </Box>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
              {transactions.map((txn) => (
                <Box key={txn.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderBottom: txn.id !== transactions[transactions.length - 1].id ? '1px solid #f0f0f0' : 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {txn.type === 'credit' ? (
                      <Box sx={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                        <AddCircleOutline fontSize="small" color="success.main" />
                      </Box>
                    ) : (
                      <Box sx={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                        <RemoveCircleOutline fontSize="small" color="error.main" />
                      </Box>
                    )}
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.2 }}>
                        {txn.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {txn.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={txn.type === 'credit' ? 'success.main' : 'error.main'}
                    sx={{ minWidth: 80 }}
                  >
                    {txn.type === 'credit' ? `+₹${txn.amount}` : `-₹${Math.abs(txn.amount)}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default WalletPage;