import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField } from '@mui/material';
import * as React from 'react';
import { useFinanceStore } from '@/store/financeStore';

export default function RefundsPage() {
  const { refundsData, loading, error, fetchRefundsData } = useFinanceStore();
  const [filters, setFilters] = React.useState({
    dateRange: 'last_30_days',
    startDate: '',
    endDate: '',
    refundId: '',
    status: '',
    reason: '',
  });

  React.useEffect(() => {
    fetchRefundsData(filters);
  }, [filters, fetchRefundsData]);

  if (loading) return <Box p={4}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box p={4}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box p={4}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Refunds Overview
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
            label="Refund ID"
            value={filters.refundId || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, refundId: e.target.value }))}
            sx={{ width: 200 }}
          />
          <TextField
            label="Reason"
            value={filters.reason || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, reason: e.target.value }))}
            sx={{ width: 200 }}
            select
          >
            <option value="">All Reasons</option>
            <option value="defective_product">Defective Product</option>
            <option value="not_as_described">Not As Described</option>
            <option value="changed_mind">Changed Mind</option>
            <option value="fraudulent">Fraudulent</option>
            <option value="duplicate_charge">Duplicate Charge</option>
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
          <Button variant="contained" onClick={() => fetchRefundsData(filters)}>
            Apply Filters
          </Button>
        </Stack>
      </Box>

      {!refundsData || refundsData.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography variant="body2">No refund data available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Refund Transactions
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="refunds table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {refundsData.map((refund: any) => (
                    <TableRow key={refund.id}>
                      <TableCell>{refund.date}</TableCell>
                      <TableCell align="right">{refund.amount}</TableCell>
                      <TableCell>{refund.orderId}</TableCell>
                      <TableCell>{refund.reason}</TableCell>
                      <TableCell>
                        <span sx={{
                          bgcolor: refund.status.toLowerCase() === 'processed' ? 'success.main' :
                                   refund.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {refund.status}
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