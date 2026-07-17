import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, MenuItem } from '@mui/material';
import * as React from 'react';
import { useFinanceStore } from '@/store/financeStore';

export default function PayoutsPage() {
  const { payoutsData, loading, error, fetchPayoutsData } = useFinanceStore();
  const [filters, setFilters] = React.useState({
    dateRange: 'last_30_days',
    startDate: '',
    endDate: '',
    payoutId: '',
    status: '',
    recipientType: '',
  });

  React.useEffect(() => {
    fetchPayoutsData(filters);
  }, [filters, fetchPayoutsData]);

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Payouts Overview
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Date Range"
            select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="last_7_days">Last 7 Days</MenuItem>
            <MenuItem value="last_30_days">Last 30 Days</MenuItem>
            <MenuItem value="this_month">This Month</MenuItem>
            <MenuItem value="last_month">Last Month</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </TextField>
          <TextField
            label="Payout ID"
            value={filters.payoutId || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, payoutId: e.target.value }))}
            sx={{ width: 200 }}
          />
          <TextField
            label="Recipient Type"
            select
            value={filters.recipientType || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, recipientType: e.target.value }))}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="merchant">Merchant</MenuItem>
            <MenuItem value="partner">Partner</MenuItem>
            <MenuItem value="driver">Driver</MenuItem>
            <MenuItem value="vendor">Vendor</MenuItem>
          </TextField>
          <TextField
            label="Status"
            select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="processed">Processed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
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
          <Button variant="contained" onClick={() => fetchPayoutsData(filters)}>
            Apply Filters
          </Button>
        </Box>
      </Box>

      {!payoutsData || payoutsData.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No payout data available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payout Transactions
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="payouts table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Recipient Type</TableCell>
                    <TableCell>Reference ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payoutsData.map((payout: any) => (
                    <TableRow key={payout.id}>
                      <TableCell>{payout.date}</TableCell>
                      <TableCell align="right">{payout.amount}</TableCell>
                      <TableCell>{payout.recipientName}</TableCell>
                      <TableCell>{payout.recipientType}</TableCell>
                      <TableCell>{payout.referenceId}</TableCell>
                      <TableCell>
                        <Box sx={{
                          bgcolor: payout.status.toLowerCase() === 'processed' ? 'success.main' :
                                   payout.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1,
                          display: 'inline-block'
                        }}>
                          {payout.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" sx={{ color: 'primary.main' }}>
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      )}
    </Box>
  );
}