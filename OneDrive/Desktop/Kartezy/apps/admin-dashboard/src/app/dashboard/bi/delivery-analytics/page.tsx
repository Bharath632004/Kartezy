"use client";
import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useBiStore } from '@/store/biStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DeliveryAnalytics() {
  const { deliveryAnalytics, dateRange, fetchDeliveryAnalytics, loading, error } = useBiStore();
  useEffect(() => { fetchDeliveryAnalytics(); }, [dateRange]);

  if (loading && !deliveryAnalytics) return (<Container sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Container>);
  const d = deliveryAnalytics || {};

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Delivery Analytics</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h4">{(d.completedDeliveries || 0).toLocaleString()}</Typography><Typography variant="body2" color="text.secondary">Completed</Typography></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h4" color="error">{(d.failedDeliveries || 0).toLocaleString()}</Typography><Typography variant="body2" color="text.secondary">Failed</Typography></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h4">${(d.totalEarnings || 0).toLocaleString()}</Typography><Typography variant="body2" color="text.secondary">Total Earnings</Typography></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h4" color="success.main">{Number(d.onTimeRate || 0).toFixed(1)}%</Typography><Typography variant="body2" color="text.secondary">On-Time Rate</Typography></CardContent></Card></Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Delivery Trend</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={d.trend || []}><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="deliveries" stroke="#8884d8" /><Line type="monotone" dataKey="earnings" stroke="#82ca9d" /></LineChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Delivery by City</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={d.byCity || []}><XAxis dataKey="city" /><YAxis /><Tooltip /><Bar dataKey="deliveries" fill="#8884d8" /><Bar dataKey="onTimeRate" fill="#82ca9d" /></BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Top Delivery Partners</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small"><TableHead><TableRow><TableCell>Partner</TableCell><TableCell align="right">Deliveries</TableCell><TableCell align="right">Earnings</TableCell><TableCell align="right">Rating</TableCell><TableCell align="right">On-Time</TableCell></TableRow></TableHead>
              <TableBody>{(d.topPartners || []).map((p: any, i: number) => (
                <TableRow key={i}><TableCell>{p.name}</TableCell><TableCell align="right">{p.deliveries}</TableCell><TableCell align="right">${(p.earnings || 0).toLocaleString()}</TableCell><TableCell align="right">{Number(p.rating || 0).toFixed(1)}</TableCell><TableCell align="right">{Number(p.onTimeRate || 0).toFixed(1)}%</TableCell></TableRow>
              ))}</TableBody></Table>
            </TableContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
}
