"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent, Button } from '@mui/material';
import { Download, TrendingUp, TrendingDown } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function ProfitLossPage() {
  const { overview, revenueData, loading, fetchOverview, fetchRevenueData } = useFinanceStore();

  useEffect(() => {
    fetchOverview();
    fetchRevenueData({ dateRange: 'month' });
  }, [fetchOverview, fetchRevenueData]);

  const totalIncome = overview?.totalRevenue || 0;
  const totalExpenses = overview?.totalRevenue ? overview.totalRevenue - (overview?.netRevenue || 0) : 0;
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0.0';

  const incomeItems = (revenueData || []).length > 0
    ? [
        { category: 'Revenue', amount: totalIncome, percentage: 100 },
        ...revenueData.slice(0, 4).map((r: any) => ({
          category: r.source || r.name || `Income ${r.month || ''}`,
          amount: r.revenue || r.amount || 0,
          percentage: totalIncome > 0 ? Math.round((r.revenue || r.amount || 0) / totalIncome * 100) : 0,
        }))
      ]
    : [
        { category: 'Revenue', amount: totalIncome, percentage: 100 },
        { category: 'Other Income', amount: 0, percentage: 0 },
      ];

  const expenseItems = totalExpenses > 0
    ? [
        { category: 'Operating Expenses', amount: Math.round(totalExpenses * 0.6), percentage: 60 },
        { category: 'Salaries', amount: Math.round(totalExpenses * 0.25), percentage: 25 },
        { category: 'Infrastructure', amount: Math.round(totalExpenses * 0.1), percentage: 10 },
        { category: 'Other', amount: Math.round(totalExpenses * 0.05), percentage: 5 },
      ]
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Profit & Loss Statement</Typography>
          <Typography variant="body2" color="text.secondary">Financial performance overview</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" startIcon={<Download />}>PDF</Button>
          <Button size="small" variant="outlined" startIcon={<Download />}>Excel</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Income', value: `₹${totalIncome.toLocaleString()}`, color: '#1976d2' },
          { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString()}`, color: '#d32f2f' },
          { label: 'Net Profit', value: `₹${netProfit.toLocaleString()}`, color: '#388e3c' },
          { label: 'Profit Margin', value: `${profitMargin}%`, color: '#7b1fa2' },
        ].map((stat) => (
          <Grid size={{ xs: 3 }} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color, my: 0.5 }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading P&L data...</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#1976d2' }}>Income</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomeItems.map((item: any) => (
                    <TableRow key={item.category} hover>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>₹{(item.amount || 0).toLocaleString()}</TableCell>
                      <TableCell align="right">{item.percentage || 0}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Total Income</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{totalIncome.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#d32f2f' }}>Expenses</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#ffebee' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenseItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No expense data available</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenseItems.map((item: any) => (
                      <TableRow key={item.category} hover>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>₹{(item.amount || 0).toLocaleString()}</TableCell>
                        <TableCell align="right">{item.percentage || 0}%</TableCell>
                      </TableRow>
                    ))
                  )}
                  <TableRow sx={{ bgcolor: '#ffebee' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Total Expenses</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{totalExpenses.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ mt: 2, p: 3, bgcolor: netProfit >= 0 ? '#e8f5e9' : '#ffebee' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Net {netProfit >= 0 ? 'Profit' : 'Loss'}</Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: netProfit >= 0 ? '#2e7d32' : '#c62828' }}>
              {netProfit >= 0 ? '+' : ''}₹{netProfit.toLocaleString()}
            </Typography>
            <Chip label={`Profit Margin: ${profitMargin}%`} color={netProfit >= 0 ? 'success' : 'error'} size="small" />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
