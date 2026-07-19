"use client";
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useBiStore } from '@/store/biStore';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#f44336', '#00bcd4', '#ff5722', '#607d8b'];

export default function FinanceAnalytics() {
  const { dateRange, fetchExecutiveDashboard, loading, error } = useBiStore();
  const [financeData, setFinanceData] = useState<any>(null);
  const [financeLoading, setFinanceLoading] = useState(true);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const res = await fetch('/api/bi/finance-analytics?start=' + dateRange.start + '&end=' + dateRange.end);
        if (res.ok) setFinanceData(await res.json());
      } catch (e) { console.error(e); }
      finally { setFinanceLoading(false); }
    };
    fetchFinance(); fetchExecutiveDashboard();
  }, [dateRange]);

  if (financeLoading && !financeData) return (<Container sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Container>);
  const f = financeData || {};

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Finance Analytics</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h5" color="success.main">${(f.summary?.netRevenue || 0).toLocaleString()}</Typography><Typography variant="body2">Net Revenue</Typography></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h5" color="primary">${(f.summary?.profit || 0).toLocaleString()}</Typography><Typography variant="body2">Profit</Typography></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h5" color="info.main">{f.summary?.grossMargin || 0}%</Typography><Typography variant="body2">Gross Margin</Typography></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h5" color="warning.main">{f.summary?.profitMargin || 0}%</Typography><Typography variant="body2">Profit Margin</Typography></CardContent></Card></Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card><CardContent><Typography variant="h6" gutterBottom>Revenue Breakdown</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={(f.revenueBreakdown || [])} dataKey="amount" nameKey="source" cx="50%" cy="50%" outerRadius={80} label>
                {(f.revenueBreakdown || []).map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent><Typography variant="h6" gutterBottom>Expense Breakdown</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={(f.expenseBreakdown || [])} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                {(f.expenseBreakdown || []).map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12}>
          <Card><CardContent><Typography variant="h6" gutterBottom>Revenue vs Expense Breakdown</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead><TableRow><TableCell>Category</TableCell><TableCell align="right">Amount</TableCell><TableCell align="right">%</TableCell></TableRow></TableHead>
                <TableBody>{(f.revenueBreakdown || []).map((r: any, i: number) => (
                  <TableRow key={i}><TableCell>{r.source}</TableCell><TableCell align="right">${(r.amount || 0).toLocaleString()}</TableCell><TableCell align="right">{r.percentage}%</TableCell></TableRow>
                ))}</TableBody>
              </Table>
            </TableContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
}
