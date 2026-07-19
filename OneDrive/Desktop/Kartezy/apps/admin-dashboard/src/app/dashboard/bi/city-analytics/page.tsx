"use client";
import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useBiStore } from '@/store/biStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CityAnalyticsPage() {
  const { cityAnalytics, heatmapData, fetchCityAnalytics, fetchHeatmapData, loading, error } = useBiStore();
  useEffect(() => { fetchCityAnalytics(); fetchHeatmapData(); }, []);

  if (loading && !cityAnalytics) return (<Container sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Container>);
  const c = cityAnalytics || {};

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>City & Heatmap Analytics</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Top Cities - Revenue</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={c.topCities || []}><XAxis dataKey="city" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#8884d8" /><Bar dataKey="orders" fill="#82ca9d" /></BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>City Performance Details</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small"><TableHead><TableRow><TableCell>City</TableCell><TableCell align="right">Orders</TableCell><TableCell align="right">Revenue</TableCell><TableCell align="right">Growth</TableCell></TableRow></TableHead>
              <TableBody>{(c.topCities || []).map((ct: any, i: number) => (
                <TableRow key={i}><TableCell>{ct.city}</TableCell><TableCell align="right">{(ct.orders || 0).toLocaleString()}</TableCell><TableCell align="right">${(ct.revenue || 0).toLocaleString()}</TableCell><TableCell align="right"><Typography color={ct.growth > 0 ? 'success.main' : 'error.main'}>{ct.growth > 0 ? '+' : ''}{ct.growth}%</Typography></TableCell></TableRow>
              ))}</TableBody></Table>
            </TableContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Hourly Heatmap (Last {(heatmapData?.hourlyOrders || []).length > 0 ? Math.ceil((heatmapData?.hourlyOrders || []).length / 8) : 7} Days)</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead><TableRow>
                  <TableCell>Hour</TableCell>
                  {Array.from({ length: Math.min(7, Math.ceil((heatmapData?.hourlyOrders || []).length / 8)) }).map((_, d) => (
                    <TableCell key={d} align="center">Day {d + 1}</TableCell>
                  ))}
                </TableRow></TableHead>
                <TableBody>
                  {['00-03','03-06','06-09','09-12','12-15','15-18','18-21','21-00'].map((hour, hi) => (
                    <TableRow key={hour}>
                      <TableCell>{hour}</TableCell>
                      {(heatmapData?.hourlyOrders || []).filter((_: any, i: number) => i % 8 === hi).slice(0, 7).map((entry: any, di: number) => (
                        <TableCell key={di} align="center" sx={{ bgcolor: entry.orders > 70 ? 'success.light' : entry.orders > 40 ? 'warning.light' : 'grey.100' }}>
                          {entry.orders}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
}
