"use client";
import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useBiStore } from '@/store/biStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function MerchantAnalytics() {
  const { merchantAnalytics, dateRange, fetchMerchantAnalytics, loading, error } = useBiStore();
  useEffect(() => { fetchMerchantAnalytics(); }, [dateRange]);

  if (loading && !merchantAnalytics) return (<Container sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Container>);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Merchant Analytics</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Top Merchants</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead><TableRow><TableCell>Merchant</TableCell><TableCell align="right">Revenue</TableCell><TableCell align="right">Orders</TableCell><TableCell align="right">Commission</TableCell><TableCell align="right">Rating</TableCell></TableRow></TableHead>
                <TableBody>{(merchantAnalytics?.topMerchants || []).map((m: any, i: number) => (
                  <TableRow key={i}><TableCell>{m.name}</TableCell><TableCell align="right">${(m.revenue || 0).toLocaleString()}</TableCell><TableCell align="right">{m.orders}</TableCell><TableCell align="right">${(m.commission || 0).toLocaleString()}</TableCell><TableCell align="right">{m.rating ? Number(m.rating).toFixed(1) : '—'}</TableCell></TableRow>
                ))}</TableBody>
              </Table>
            </TableContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Revenue by Category</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={merchantAnalytics?.categorySummary || []} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                {(merchantAnalytics?.categorySummary || []).map((_: any, i: number) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Merchant Trend</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={merchantAnalytics?.trend || []}>
                <XAxis dataKey="date" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#8884d8" name="Orders" />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
}
