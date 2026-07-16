import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField } from '@mui/material';
import * as React from 'react';
import { useFinanceStore } from '@/store/financeStore';

export default function GstReportsPage() {
  const { gstReportsData, loading, error, fetchGstReportsData } = useFinanceStore();
  const [filters, setFilters] = React.useState({
    dateRange: 'last_30_days',
    startDate: '',
    endDate: '',
    reportType: '',
    status: '',
  });

  React.useEffect(() => {
    fetchGstReportsData(filters);
  }, [filters, fetchGstReportsData]);

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          GST Reports Overview
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
            label="Report Type"
            select
            value={filters.reportType || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
            sx={{ width: 200 }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="gstr1">GSTR-1</MenuItem>
            <MenuItem value="gstr3b">GSTR-3B</MenuItem>
            <MenuItem value="gstr9">GSTR-9</MenuItem>
            <MenuItem value="gstr9c">GSTR-9C</MenuItem>
          </TextField>
          <TextField
            label="Status"
            select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            sx={{ width: 200 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="generated">Generated</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="filed">Filed</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
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
          <Button variant="contained" onClick={() => fetchGstReportsData(filters)}>
            Apply Filters
          </Button>
        </Stack>
      </Box>

      {!gstReportsData || gstReportsData.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No GST reports available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              GST Reports
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="gst reports table">
                <TableHead>
                  <TableRow>
                    <TableCell>Period</TableCell>
                    <TableCell>Report Type</TableCell>
                    <TableCell align="right">Taxable Amount</TableCell>
                    <TableCell align="right">Tax Amount</TableCell>
                    <TableCell>Filing Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {gstReportsData.map((report: any) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>{report.reportType}</TableCell>
                      <TableCell align="right">{report.taxableAmount?.toLocaleString() ?? '0.00'}</TableCell>
                      <TableCell align="right">{report.taxAmount?.toLocaleString() ?? '0.00'}</TableCell>
                      <TableCell>{report.filingDate || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{
                          bgcolor: report.status.toLowerCase() === 'filed' ? 'success.main' :
                                   report.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1,
                          display: 'inline'
                        }} component="span">
                          {report.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" sx={{ color: 'primary.main' }}>
                          View
                        </Button>
                        <Button size="small" variant="outlined" sx={{ ml: 1 }}>
                          Download
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