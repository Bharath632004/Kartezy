import { Box, Typography, Paper, Stack, Button, TextField, Typography as MuiTypography } from '@mui/material';
import * as React from 'react';
import { useFinanceStore } from '@/store/financeStore';

export default function WalletPage() {
  const { walletData, loading, error, fetchWalletData } = useFinanceStore();

  React.useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  if (loading) return <Box p={4}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box p={4}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box p={4}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Wallet Overview
        </Typography>
        <Stack direction="row" spacing={3} flexWrap="wrap">
          <Paper elevation={3} sx={{ p: 3, flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>
              Total Balance
            </Typography>
            <Typography variant="h4" gutterBottom>
              {walletData?.totalBalance?.toLocaleString() ?? '0.00'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {walletData?.currency ?? 'USD'}
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>
              Available Balance
            </Typography>
            <Typography variant="h4" gutterBottom>
              {walletData?.availableBalance?.toLocaleString() ?? '0.00'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {walletData?.currency ?? 'USD'}
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>
              Pending Transactions
            </Typography>
            <Typography variant="h4" gutterBottom>
              {walletData?.pendingTransactions?.length ?? 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Transactions
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>
              Today's Volume
            </Typography>
            <Typography variant="h4" gutterBottom>
              {walletData?.dailyVolume?.toLocaleString() ?? '0.00'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {walletData?.currency ?? 'USD'}
            </Typography>
          </Paper>
        </Stack>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <Button variant="outlined" sx={{ mb: 2 }}>
          Add Funds
        </Button>
        <Button variant="outlined" sx={{ mb: 2 }}>
          Withdraw Funds
        </Button>
      </Box>

      {!walletData || !walletData.transactions || walletData.transactions.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography variant="body2">No wallet transactions available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box p={3}>
            <TableContainer>
              <Table stickyHeader aria-label="wallet transactions table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Balance After</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {walletData.transactions.map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell align="right">{transaction.amount}</TableCell>
                      <TableCell>
                        <span sx={{
                          bgcolor: transaction.type === 'credit' ? 'success.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell align="right">{transaction.balanceAfter}</TableCell>
                      <TableCell>
                        <span sx={{
                          bgcolor: transaction.status.toLowerCase() === 'completed' ? 'success.main' :
                                   transaction.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {transaction.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      )}
    </Box>
  );
}