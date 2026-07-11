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

  if (loading) return <Box p={4}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box p={4}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box p={4}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          GST Reports Overview
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
            label="Report Type"
            select
            labelId="report-type-label"
            id="report-type-select"
            value={filters.reportType || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
            select
            MenuProps={{ MenuProps: { sx: { width: 200 } } }}
            labelWidth={100}
          >
            <option value="">All Types</option>
            <option value="gstr1">GSTR-1</option>
            <option value="gstr3b">GSTR-3B</option>
            <option value="gstr9">GSTR-9</option>
            <option value="gstr9c">GSTR-9C</option>
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
            <option value="generated">Generated</option>
            <option value="pending">Pending</option>
            <option value="filed">Filed</option>
            <option value="rejected">Rejected</option>
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
          <Button variant="contained" onClick={() => fetchGstReportsData(filters)}>
            Apply Filters
          </Button>
        </Stack>
      </Box>

      {!gstReportsData || gstReportsData.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography variant="body2">No GST reports available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box p={3}>
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
                        <span sx={{
                          bgcolor: report.status.toLowerCase() === 'filed' ? 'success.main' :
                                   report.status.toLowerCase() === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {report.status}
                        </span>
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