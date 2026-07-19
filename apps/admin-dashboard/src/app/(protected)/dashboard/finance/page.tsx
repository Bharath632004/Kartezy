"use client";

import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Paper, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Tabs, Tab
} from '@mui/material';
import {
  TrendingUp, TrendingDown, AccountBalance, Receipt,
  Payment, PeopleAlt, Store, Warning, CurrencyRupee,
  Refresh, Assessment, Download
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 450000, expenses: 320000, profit: 130000 },
  { month: 'Feb', revenue: 520000, expenses: 340000, profit: 180000 },
  { month: 'Mar', revenue: 610000, expenses: 380000, profit: 230000 },
  { month: 'Apr', revenue: 580000, expenses: 360000, profit: 220000 },
  { month: 'May', revenue: 720000, expenses: 410000, profit: 310000 },
  { month: 'Jun', revenue: 850000, expenses: 450000, profit: 400000 },
];

const StatCard = ({ title, value, trend, icon, color, subtitle }: any) => (
  <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>₹{value.toLocaleString()}</Typography>
          {trend !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {trend >= 0 ? (
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
              )}
              <Typography variant="caption" color={trend >= 0 ? 'success.main' : 'error.main'}>
                {trend >= 0 ? '+' : ''}{trend}% vs last month
              </Typography>
            </Box>
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15`, display: 'flex' }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function FinanceDashboard() {
  const [tabValue, setTabValue] = useState(0);

  const modules = [
    { name: 'Settlements', path: '/dashboard/finance/settlements', count: 42, color: '#1976d2' },
    { name: 'Vendors', path: '/dashboard/finance/vendors', count: 128, color: '#388e3c' },
    { name: 'Suppliers', path: '/dashboard/finance/suppliers', count: 56, color: '#f57c00' },
    { name: 'Purchase Orders', path: '/dashboard/finance/purchase-orders', count: 89, color: '#7b1fa2' },
    { name: 'Invoices', path: '/dashboard/finance/invoices', count: 234, color: '#c62828' },
    { name: 'GST', path: '/dashboard/finance/gst', count: 12, color: '#00838f' },
    { name: 'Taxes', path: '/dashboard/finance/taxes', count: 8, color: '#4e342e' },
    { name: 'Accounting', path: '/dashboard/finance/accounting', count: 0, color: '#1565c0' },
    { name: 'Revenue', path: '/dashboard/finance/revenue', count: 0, color: '#2e7d32' },
    { name: 'P&L', path: '/dashboard/finance/profit-loss', count: 6, color: '#6a1b9a' },
    { name: 'Cash Flow', path: '/dashboard/finance/cash-flow', count: 0, color: '#00695c' },
    { name: 'Ledger', path: '/dashboard/finance/ledger', count: 0, color: '#37474f' },
    { name: 'Wallet', path: '/dashboard/finance/wallet-accounting', count: 0, color: '#e65100' },
    { name: 'Refunds', path: '/dashboard/finance/refunds', count: 34, color: '#b71c1c' },
    { name: 'Commission', path: '/dashboard/finance/commissions', count: 0, color: '#4a148c' },
    { name: 'Reports', path: '/dashboard/finance/reports', count: 0, color: '#1b5e20' },
    { name: 'Banks', path: '/dashboard/finance/banks', count: 3, color: '#0d47a1' },
    { name: 'Reconciliation', path: '/dashboard/finance/reconciliation', count: 0, color: '#bf360c' },
    { name: 'Audit Trail', path: '/dashboard/finance/audit-trail', count: 0, color: '#263238' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Finance & ERP Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive financial overview and management platform
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download />} size="small">Export</Button>
          <Button variant="contained" startIcon={<Refresh />} size="small">Refresh</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Revenue (MTD)" value={3850000} trend={12.5} color="#1976d2" icon={<CurrencyRupee sx={{ color: '#1976d2' }} />} subtitle="vs ₹3,420,000 last month" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Expenses (MTD)" value={2340000} trend={-3.2} color="#d32f2f" icon={<TrendingDown sx={{ color: '#d32f2f' }} />} subtitle="vs ₹2,417,000 last month" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Net Profit (MTD)" value={1510000} trend={18.7} color="#388e3c" icon={<AccountBalance sx={{ color: '#388e3c' }} />} subtitle="Profit margin: 39.2%" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Settlements" value={456000} trend={0} color="#f57c00" icon={<Payment sx={{ color: '#f57c00' }} />} subtitle="47 merchants pending" />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Revenue vs Expenses Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/><stop offset="95%" stopColor="#1976d2" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d32f2f" stopOpacity={0.3}/><stop offset="95%" stopColor="#d32f2f" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stroke="#1976d2" fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#d32f2f" fill="url(#colorExpenses)" strokeWidth={2} name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Key Metrics</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: 'Total Outstanding Invoices', value: '₹1,24,500', color: '#f57c00' },
                { label: 'Vendor Payables', value: '₹3,56,000', color: '#d32f2f' },
                { label: 'GST Payable', value: '₹67,800', color: '#00838f' },
                { label: 'Cash in Bank', value: '₹28,50,000', color: '#388e3c' },
                { label: 'Wallet Balance', value: '₹4,56,000', color: '#1976d2' },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: item.color }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>ERP Modules</Typography>
      <Grid container spacing={2}>
        {modules.map((mod) => (
          <Grid item xs={6} sm={4} md={2} lg={1.5} key={mod.name}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 3, borderColor: mod.color },
                border: '2px solid transparent',
                height: '100%',
              }}
              onClick={() => window.location.href = mod.path}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: `${mod.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: mod.color }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{mod.name}</Typography>
                {mod.count > 0 && (
                  <Chip label={mod.count} size="small" sx={{ mt: 0.5, height: 20, fontSize: '0.65rem', bgcolor: `${mod.color}15`, color: mod.color }} />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
