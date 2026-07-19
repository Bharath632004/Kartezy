"use client";
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useBiStore } from '@/store/biStore';
import { biService } from '@/lib/biService';

export default function BoardReports() {
  const { executiveDashboard, dateRange, setDateRange, fetchExecutiveDashboard, loading, error } = useBiStore();
  const [exportFormat, setExportFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState('');

  useEffect(() => { fetchExecutiveDashboard(); }, [dateRange]);

  const handleExport = async () => {
    setExporting(true); setExportMsg('');
    try {
      const data = executiveDashboard?.revenueTrend || [];
      const res = await biService.exportData(data, exportFormat, 'board-report');
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a'); link.href = url; link.download = 'board-report.' + exportFormat;
      link.click(); setExportMsg('Report exported successfully');
    } catch (e: any) { setExportMsg('Export failed: ' + e.message); }
    finally { setExporting(false); }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Board Reports</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small">
            <InputLabel>Period</InputLabel>
            <Select value={dateRange.preset} label="Period" onChange={(e) => setDateRange(e.target.value)}>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Format</InputLabel>
            <Select value={exportFormat} label="Format" onChange={(e) => setExportFormat(e.target.value)}>
              <MenuItem value="csv">CSV</MenuItem><MenuItem value="excel">Excel</MenuItem><MenuItem value="pdf">PDF</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleExport} disabled={exporting || loading}>
            {exporting ? <CircularProgress size={20} /> : 'Export Report'}
          </Button>
        </Box>
      </Box>
      {exportMsg && <Alert severity={exportMsg.includes('failed') ? 'error' : 'success'} sx={{ mb: 2 }}>{exportMsg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card><CardContent>
              <Typography variant="h6" gutterBottom>Executive Summary</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}><Typography variant="body2" color="text.secondary">Total Revenue</Typography><Typography variant="h5">${(executiveDashboard?.totalRevenue || 0).toLocaleString()}</Typography></Grid>
                <Grid item xs={6} md={3}><Typography variant="body2" color="text.secondary">Total Orders</Typography><Typography variant="h5">{(executiveDashboard?.totalOrders || 0).toLocaleString()}</Typography></Grid>
                <Grid item xs={6} md={3}><Typography variant="body2" color="text.secondary">Active Customers</Typography><Typography variant="h5">{(executiveDashboard?.activeCustomers || 0).toLocaleString()}</Typography></Grid>
                <Grid item xs={6} md={3}><Typography variant="body2" color="text.secondary">New Customers</Typography><Typography variant="h5">{(executiveDashboard?.newCustomers || 0).toLocaleString()}</Typography></Grid>
              </Grid>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12}>
            <Card><CardContent>
              <Typography variant="h6" gutterBottom>Revenue Trend (Daily)</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead><TableRow>
                    <TableCell>Date</TableCell><TableCell align="right">Revenue</TableCell><TableCell align="right">Orders</TableCell>
                  </TableRow></TableHead>
                  <TableBody>
                    {(executiveDashboard?.revenueTrend || []).map((row: any, i: number) => (
                      <TableRow key={i}><TableCell>{row.date}</TableCell><TableCell align="right">${row.revenue?.toLocaleString()}</TableCell><TableCell align="right">{row.orders}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent></Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
