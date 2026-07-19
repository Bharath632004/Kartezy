"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent, Button } from '@mui/material';
import { Download, TrendingUp, TrendingDown } from '@mui/icons-material';

const incomeItems = [
  { category: 'Commission Revenue', amount: 680000, percentage: 48.1 },
  { category: 'Platform Fees', amount: 195000, percentage: 13.8 },
  { category: 'Delivery Fees', amount: 498000, percentage: 35.2 },
  { category: 'Interest Income', amount: 28000, percentage: 2.0 },
  { category: 'Other Income', amount: 12000, percentage: 0.9 },
];

const expenseItems = [
  { category: 'Cost of Goods Sold', amount: 420000, percentage: 29.7 },
  { category: 'Commission Expenses', amount: 85000, percentage: 6.0 },
  { category: 'Payment Gateway Fees', amount: 45000, percentage: 3.2 },
  { category: 'Salaries & Benefits', amount: 350000, percentage: 24.8 },
  { category: 'Marketing & Ads', amount: 120000, percentage: 8.5 },
  { category: 'Infrastructure & Cloud', amount: 85000, percentage: 6.0 },
  { category: 'Office & Admin', amount: 45000, percentage: 3.2 },
  { category: 'Depreciation', amount: 30000, percentage: 2.1 },
  { category: 'Tax Expenses', amount: 95000, percentage: 6.7 },
];

const totalIncome = incomeItems.reduce((s, i) => s + i.amount, 0);
const totalExpenses = expenseItems.reduce((s, i) => s + i.amount, 0);
const netProfit = totalIncome - totalExpenses;
const profitMargin = ((netProfit / totalIncome) * 100).toFixed(1);

export default function ProfitLossPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Profit & Loss Statement</Typography>
          <Typography variant="body2" color="text.secondary">Financial performance for June 2026</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" startIcon={<Download />}>PDF</Button>
          <Button size="small" variant="outlined" startIcon={<Download />}>Excel</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Income', value: `₹${totalIncome.toLocaleString()}`, color: '#1976d2', trend: 18.5 },
          { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString()}`, color: '#d32f2f', trend: -5.2 },
          { label: 'Net Profit', value: `₹${netProfit.toLocaleString()}`, color: '#388e3c', trend: 22.8 },
          { label: 'Profit Margin', value: `${profitMargin}%`, color: '#7b1fa2', trend: 3.5 },
        ].map((stat) => (
          <Grid item xs={3} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color, my: 0.5 }}>{stat.value}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {stat.trend >= 0 ? <TrendingUp sx={{ color: 'success.main', fontSize: 14 }} /> : <TrendingDown sx={{ color: 'error.main', fontSize: 14 }} />}
                  <Typography variant="caption" color={stat.trend >= 0 ? 'success.main' : 'error.main'}>{stat.trend >= 0 ? '+' : ''}{stat.trend}%</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
                {incomeItems.map((item) => (
                  <TableRow key={item.category} hover>
                    <TableCell>{item.category}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>₹{item.amount.toLocaleString()}</TableCell>
                    <TableCell align="right">{item.percentage}%</TableCell>
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

        <Grid item xs={12} md={6}>
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
                {expenseItems.map((item) => (
                  <TableRow key={item.category} hover>
                    <TableCell>{item.category}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>₹{item.amount.toLocaleString()}</TableCell>
                    <TableCell align="right">{item.percentage}%</TableCell>
                  </TableRow>
                ))}
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
