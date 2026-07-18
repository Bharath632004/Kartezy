import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, MenuItem } from '@mui/material';
import * as React from 'react';
import { useFinanceStore } from '@/store/financeStore';

export default function SettlementsPage() {
  const { settlementsData, loading, error, fetchSettlementsData } = useFinanceStore();
  const [filters, setFilters] = React.useState({
    dateRange: 'last_30_days',
    startDate: '',
    endDate: '',
    settlementId: '',
    status: '',
  });

  React.useEffect(() => {
    fetchSettlementsData(filters);
  }, [filters, fetchSettlementsData]);

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Settlements Overview
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
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
            label="Settlement ID"
            value={filters.settlementId || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, settlementId: e.target.value }))}
            sx={{ width: 200 }}
          />
          <TextField
            label="Status"
            select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
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
          <Button variant="contained" onClick={() => fetchSettlementsData(filters)}>
            Apply Filters
          </Button>
        </Box>
      </Box>

      {!settlementsData || settlementsData.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No settlement data available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Settlement Transactions
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="settlements table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Currency</TableCell>
                    <TableCell>Reference ID</TableCell>
                    <TableCell>Merchant</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {settlementsData.map((settlement: any) => (
                    <TableRow key={settlement.id}>
                      <TableCell>{settlement.date}</TableCell>
                      <TableCell align="right">{settlement.amount}</TableCell>
                      <TableCell align="right">{settlement.currency}</TableCell>
                      <TableCell>{settlement.referenceId}</TableCell>
                      <TableCell>{settlement.merchantName}</TableCell>
                      <TableCell>
                        <Box sx={{
                          bgcolor: settlement.status.toLowerCase() === 'completed' ? 'success.main' :
                                   settlement.status.toLowerCase() === 'processing' ? 'info.main' :
                                   settlement.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1,
                          display: 'inline-block'
                        }}>
                          {settlement.status}
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