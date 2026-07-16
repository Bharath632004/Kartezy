import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField, MenuItem } from '@mui/material';
import * as React from 'react';
import { useFinanceStore } from '@/store/financeStore';

export default function CommissionPage() {
  const { commissionData, loading, error, fetchCommissionData } = useFinanceStore();
  const [filters, setFilters] = React.useState({
    dateRange: 'last_30_days',
    startDate: '',
    endDate: '',
    merchantId: '',
  });

  React.useEffect(() => {
    fetchCommissionData(filters);
  }, [filters, fetchCommissionData]);

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Commission Overview
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            label="Date Range"
            select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            sx={{ width: 200 }}
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
            label="Merchant ID"
            value={filters.merchantId || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, merchantId: e.target.value }))}
            sx={{ width: 200 }}
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
                sx={{ width: 150, ml: 1 }}
              />
            </>
          )}
          <Button variant="contained" onClick={() => fetchCommissionData(filters)}>
            Apply Filters
          </Button>
        </Stack>
      </Box>

      {!commissionData || commissionData.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No commission data available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Commission Transactions
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="commission table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Rate (%)</TableCell>
                    <TableCell>Merchant</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {commissionData.map((commission: any) => (
                    <TableRow key={commission.id}>
                      <TableCell>{commission.date}</TableCell>
                      <TableCell align="right">{commission.amount}</TableCell>
                      <TableCell align="right">{commission.rate}</TableCell>
                      <TableCell>{commission.merchantName}</TableCell>
                      <TableCell>{commission.transactionId}</TableCell>
                      <TableCell>
                        <Box sx={{
                          bgcolor: commission.status.toLowerCase() === 'paid' ? 'success.main' :
                                   commission.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1,
                          display: 'inline'
                        }}>
                          {commission.status}
                        </Box>
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