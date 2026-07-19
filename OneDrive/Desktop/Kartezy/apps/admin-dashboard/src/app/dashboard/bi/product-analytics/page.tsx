"use client";
import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useBiStore } from '@/store/biStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ProductAnalytics() {
  const { productAnalytics, dateRange, fetchProductAnalytics, loading, error } = useBiStore();
  useEffect(() => { fetchProductAnalytics(); }, [dateRange]);

  if (loading && !productAnalytics) return (<Container sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Container>);
  const p = productAnalytics || {};

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Product Analytics</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Top Products by Revenue</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small"><TableHead><TableRow><TableCell>Product</TableCell><TableCell align="right">Units Sold</TableCell><TableCell align="right">Revenue</TableCell><TableCell align="right">Rating</TableCell><TableCell align="right">Views</TableCell></TableRow></TableHead>
              <TableBody>{(p.topProducts || []).slice(0,10).map((pr: any, i: number) => (
                <TableRow key={i}><TableCell>{pr.name}</TableCell><TableCell align="right">{pr.unitsSold}</TableCell><TableCell align="right">${(pr.revenue || 0).toLocaleString()}</TableCell><TableCell align="right">{Number(pr.rating || 0).toFixed(1)}</TableCell><TableCell align="right">{pr.views}</TableCell></TableRow>
              ))}</TableBody></Table>
            </TableContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Sales by Category</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={p.byCategory || []} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                {(p.byCategory || []).map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Low Stock Products</Typography>
            {p.lowStockProducts?.length ? (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(p.lowStockProducts || []).map((name: string, i: number) => (<Chip key={i} label={name} color="warning" size="small" />))}
              </Box>
            ) : <Typography color="text.secondary">All products sufficiently stocked</Typography>}
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
}
