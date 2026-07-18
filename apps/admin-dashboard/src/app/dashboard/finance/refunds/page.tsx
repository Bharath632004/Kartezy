import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, MenuItem } from '@mui/material';
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

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Refunds Overview
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
            label="Refund ID"
            value={filters.refundId || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, refundId: e.target.value }))}
            sx={{ width: 200 }}
          />
          <TextField
            label="Reason"
            select
            value={filters.reason || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, reason: e.target.value }))}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Reasons</MenuItem>
            <MenuItem value="defective_product">Defective Product</MenuItem>
            <MenuItem value="not_as_described">Not As Described</MenuItem>
            <MenuItem value="changed_mind">Changed Mind</MenuItem>
            <MenuItem value="fraudulent">Fraudulent</MenuItem>
            <MenuItem value="duplicate_charge">Duplicate Charge</MenuItem>
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
                sx={{ width: 150, ml: 1 }}
              />
            </>
          )}
          <Button variant="contained" onClick={() => fetchRefundsData(filters)}>
            Apply Filters
          </Button>
        </Box>
      </Box>

      {!refundsData || refundsData.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No refund data available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
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
                <TableBody>
                  {refundsData.map((refund: any) => (
                    <TableRow key={refund.id}>
                      <TableCell>{refund.date}</TableCell>
                      <TableCell align="right">{refund.amount}</TableCell>
                      <TableCell>{refund.orderId}</TableCell>
                      <TableCell>{refund.reason}</TableCell>
                      <TableCell>
                        <Box sx={{
                          bgcolor: refund.status.toLowerCase() === 'processed' ? 'success.main' :
                                   refund.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1,
                          display: 'inline-block'
                        }}>
                          {refund.status}
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