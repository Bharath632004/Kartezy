"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const cashFlowData = [
  { month: 'Jan', operating: 125000, investing: -45000, financing: 30000, net: 110000 },
  { month: 'Feb', operating: 142000, investing: -38000, financing: 25000, net: 129000 },
  { month: 'Mar', operating: 168000, investing: -52000, financing: 35000, net: 151000 },
  { month: 'Apr', operating: 155000, investing: -48000, financing: 28000, net: 135000 },
  { month: 'May', operating: 195000, investing: -55000, financing: 32000, net: 172000 },
  { month: 'Jun', operating: 225000, investing: -62000, financing: 40000, net: 203000 },
];

const operatingActivities = [
  { item: 'Collections from Customers', amount: 2250000 },
  { item: 'Commission Income', amount: 155000 },
  { item: 'Platform Fees', amount: 42000 },
  { item: 'Delivery Fees', amount: 108000 },
  { item: 'Payments to Merchants', amount: -1450000 },
  { item: 'Salaries & Wages', amount: -350000 },
  { item: 'Operating Expenses', amount: -280000 },
  { item: 'Tax Payments', amount: -95000 },
];

const investingActivities = [
  { item: 'Purchase of Equipment', amount: -35000 },
  { item: 'Software & Licenses', amount: -12000 },
  { item: 'Investment in Securities', amount: -15000 },
];

const financingActivities = [
  { item: 'Capital Injection', amount: 50000 },
  { item: 'Loan Repayment', amount: -15000 },
  { item: 'Dividend Paid', amount: 0 },
  { item: 'Interest Income', amount: 5000 },
];

const sumAmount = (items: { amount: number }[]) => items.reduce((s, i) => s + i.amount, 0);
const netOperating = sumAmount(operatingActivities);
const netInvesting = sumAmount(investingActivities);
const netFinancing = sumAmount(financingActivities);
const netCashFlow = netOperating + netInvesting + netFinancing;

export default function CashFlowPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Cash Flow Statement</Typography>
        <Typography variant="body2" color="text.secondary">Cash flow analysis for June 2026</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Operating Cash Flow', value: `₹${netOperating.toLocaleString()}`, color: '#1976d2', trend: 15.4 },
          { label: 'Investing Cash Flow', value: `₹${netInvesting.toLocaleString()}`, color: '#d32f2f', trend: -10.2 },
          { label: 'Financing Cash Flow', value: `₹${netFinancing.toLocaleString()}`, color: '#f57c00', trend: 8.7 },
          { label: 'Net Cash Flow', value: `₹${netCashFlow.toLocaleString()}`, color: '#388e3c', trend: 18.2 },
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

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Cash Flow Trend</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cashFlowData}>
            <defs>
              <linearGradient id="opGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/><stop offset="95%" stopColor="#1976d2" stopOpacity={0}/></linearGradient>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#388e3c" stopOpacity={0.3}/><stop offset="95%" stopColor="#388e3c" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
            <Area type="monotone" dataKey="operating" stroke="#1976d2" fill="url(#opGrad)" name="Operating" strokeWidth={2} />
            <Area type="monotone" dataKey="net" stroke="#388e3c" fill="url(#netGrad)" name="Net Cash Flow" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      <Grid container spacing={2}>
        {[
          { title: 'Operating Activities', items: operatingActivities, color: '#1976d2', bgColor: '#e3f2fd', total: netOperating },
          { title: 'Investing Activities', items: investingActivities, color: '#d32f2f', bgColor: '#ffebee', total: netInvesting },
          { title: 'Financing Activities', items: financingActivities, color: '#f57c00', bgColor: '#fff3e0', total: netFinancing },
        ].map((section) => (
          <Grid item xs={12} md={4} key={section.title}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: section.color }}>{section.title}</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableBody>
                  {section.items.map((item) => (
                    <TableRow key={item.item} hover>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{item.item}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: item.amount >= 0 ? '#388e3c' : '#d32f2f', fontSize: '0.8rem' }}>
                        {item.amount >= 0 ? '+' : ''}₹{Math.abs(item.amount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: section.bgColor }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Net {section.title}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: section.total >= 0 ? '#388e3c' : '#d32f2f', fontSize: '0.85rem' }}>
                      {section.total >= 0 ? '+' : ''}₹{Math.abs(section.total).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 2, p: 3, bgcolor: '#e8f5e9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Net Cash Flow for Period</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: netCashFlow >= 0 ? '#2e7d32' : '#c62828' }}>
            {netCashFlow >= 0 ? '+' : ''}₹{Math.abs(netCashFlow).toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
