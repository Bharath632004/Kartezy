import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField } from '@mui/material';
import * as React from 'react';
import { useFinanceStore } from '@/store/financeStore';

export default function TaxesPage() {
  const { taxesData, loading, error, fetchTaxesData } = useFinanceStore();
  const [filters, setFilters] = React.useState({
    dateRange: 'last_30_days',
    startDate: '',
    endDate: '',
    taxType: '',
    status: '',
  });

  React.useEffect(() => {
    fetchTaxesData(filters);
  }, [filters, fetchTaxesData]);

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Taxes Overview
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            label="Date Range"
            select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
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
            label="Tax Type"
            select
            value={filters.taxType || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, taxType: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="sales_tax">Sales Tax</option>
            <option value="vat">VAT</option>
            <option value="gst">GST</option>
            <option value="income_tax">Income Tax</option>
            <option value="service_tax">Service Tax</option>
          </TextField>
          <TextField
            label="Status"
            select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="refunded">Refunded</option>
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
          <Button variant="contained" onClick={() => fetchTaxesData(filters)}>
            Apply Filters
          </Button>
        </Stack>
      </Box>

      {!taxesData || taxesData.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No tax data available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tax Transactions
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="taxes table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Tax Type</TableCell>
                    <TableCell>Reference ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {taxesData.map((tax: any) => (
                    <TableRow key={tax.id}>
                      <TableCell>{tax.date}</TableCell>
                      <TableCell align="right">{tax.amount}</TableCell>
                      <TableCell>{tax.taxType}</TableCell>
                      <TableCell>{tax.referenceId}</TableCell>
                      <TableCell>
                        <Box component="span" sx={{
                          bgcolor: tax.status.toLowerCase() === 'paid' ? 'success.main' :
                                   tax.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {tax.status}
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