"use client";
import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useBiStore } from '@/store/biStore';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const COLORS = ['#4CAF50', '#FF9800', '#f44336'];

export default function InventoryAnalytics() {
  const { inventoryAnalytics, fetchInventoryAnalytics, loading, error } = useBiStore();
  useEffect(() => { fetchInventoryAnalytics(); }, []);

  if (loading && !inventoryAnalytics) return (<Container sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Container>);
  const inv = inventoryAnalytics || {};

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Inventory Analytics</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>ABC Analysis</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={inv.abcAnalysis || []} dataKey="revenuePercentage" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                {(inv.abcAnalysis || []).map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Stock Turnover (Days)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inv.stockTurnover || []}><XAxis dataKey="category" /><YAxis /><Tooltip /><Bar dataKey="turnoverDays" fill="#8884d8" /></BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>ABC Item Breakdown</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small"><TableHead><TableRow><TableCell>Category</TableCell><TableCell align="right">Items</TableCell><TableCell align="right">Revenue %</TableCell></TableRow></TableHead>
              <TableBody>{(inv.abcAnalysis || []).map((a: any, i: number) => (
                <TableRow key={i}><TableCell>{a.category}</TableCell><TableCell align="right">{a.items}</TableCell><TableCell align="right">{a.revenuePercentage}%</TableCell></TableRow>
              ))}</TableBody></Table>
            </TableContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
}
