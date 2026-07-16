import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField } from '@mui/material';
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
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Date Range"
            select
            labelId="date-range-label"
            id="date-range-select"
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            select
            MenuProps={{ MenuProps: { sx: { width: 200 } } }}
            labelWidth={100}
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
            label="Payout ID"
            value={filters.payoutId || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, payoutId: e.target.value }))}
            sx={{ width: 200 }}
          />
          <TextField
            label="Recipient Type"
            select
            labelId="recipient-type-label"
            id="recipient-type-select"
            value={filters.recipientType || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, recipientType: e.target.value }))}
            select
            MenuProps={{ MenuProps: { sx: { width: 200 } } }}
            labelWidth={100}
          >
            <option value="">All Types</option>
            <option value="merchant">Merchant</option>
            <option value="partner">Partner</option>
            <option value="driver">Driver</option>
            <option value="vendor">Vendor</option>
          </TextField>
          <TextField
            label="Status"
            select
            labelId="status-label"
            id="status-select"
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            select
            MenuProps={{ MenuProps: { sx: { width: 200 } } }}
            labelWidth={100}
          >
            <option value="">All Statuses</option>
            <option value="processed">Processed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
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
        </Stack>
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
                <tbody>
                  {payoutsData.map((payout: any) => (
                    <TableRow key={payout.id}>
                      <TableCell>{payout.date}</TableCell>
                      <TableCell align="right">{payout.amount}</TableCell>
                      <TableCell>{payout.recipientName}</TableCell>
                      <TableCell>{payout.recipientType}</TableCell>
                      <TableCell>{payout.referenceId}</TableCell>
                      <TableCell>
                        <span sx={{
                          bgcolor: payout.status.toLowerCase() === 'processed' ? 'success.main' :
                                   payout.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {payout.status}
                        </span>
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