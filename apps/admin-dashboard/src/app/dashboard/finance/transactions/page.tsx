import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField } from '@mui/material';
import * as React from 'react';
import { useFinanceStore } from '@/store/financeStore';

export default function TransactionsPage() {
  const { transactionsData, loading, error, fetchTransactionsData } = useFinanceStore();
  const [filters, setFilters] = React.useState({
    dateRange: 'last_30_days',
    startDate: '',
    endDate: '',
    transactionId: '',
    type: '',
    status: '',
    amountMin: '',
    amountMax: '',
  });

  React.useEffect(() => {
    fetchTransactionsData(filters);
  }, [filters, fetchTransactionsData]);

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Transactions Overview
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            label="Date Range"
            select
            id="date-range-select"
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            sx={{ width: 200 }}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="custom">Custom Range</option>
          </TextField>
          <TextField
            label="Transaction ID"
            value={filters.transactionId || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, transactionId: e.target.value }))}
            sx={{ width: 200 }}
          />
          <TextField
            label="Type"
            select
            id="type-select"
            value={filters.type || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            sx={{ width: 200 }}
          >
            <option value="">All Types</option>
            <option value="payment">Payment</option>
            <option value="refund">Refund</option>
            <option value="payout">Payout</option>
            <option value="commission">Commission</option>
            <option value="settlement">Settlement</option>
            <option value="fee">Fee</option>
          </TextField>
          <TextField
            label="Status"
            select
            id="status-select"
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            sx={{ width: 200 }}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
          </TextField>
          <TextField
            label="Min Amount"
            type="number"
            value={filters.amountMin || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, amountMin: e.target.value }))}
            sx={{ width: 120 }}
          />
          <TextField
            label="Max Amount"
            type="number"
            value={filters.amountMax || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, amountMax: e.target.value }))}
            sx={{ width: 120 }}
            style={{ marginLeft: 1 }}
          />
          {filters.dateRange === 'custom' && (
            <>
              <TextField
                label="Start Date"
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                sx={{ width: 150 }}
              />
              <TextField
                label="End Date"
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                sx={{ width: 150 }}
                style={{ marginLeft: 1 }}
              />
            </>
          )}
          <Button variant="contained" onClick={() => fetchTransactionsData(filters)}>
            Apply Filters
          </Button>
        </Stack>
      </Box>

      {!transactionsData || transactionsData.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No transaction data available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Financial Transactions
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="transactions table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Reference ID</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {transactionsData.map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell align="right">{transaction.amount}</TableCell>
                      <TableCell>
                        <Box component="span" sx={{
                          bgcolor: transaction.type === 'payment' ? 'success.main' :
                                   transaction.type === 'refund' ? 'error.main' :
                                   transaction.type === 'payout' ? 'warning.main' : 'info.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {transaction.type}
                        </Box>
                      </TableCell>
                      <TableCell>{transaction.referenceId}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Box component="span" sx={{
                          bgcolor: transaction.status.toLowerCase() === 'completed' ? 'success.main' :
                                   transaction.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {transaction.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" sx={{ color: 'primary.main' }}>
                          Details
                        </Button>
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