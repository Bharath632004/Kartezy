"use client";

import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Paper, Chip,
  Button
} from '@mui/material';
import {
  TrendingUp, TrendingDown, AccountBalance, Payment,
  CurrencyRupee, Refresh, Download
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinanceStore } from '@/store/financeStore';

const StatCard = ({ title, value, trend, icon, color, subtitle }: any) => (
  <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>{value}</Typography>
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
  const { overview, revenueData, loading, fetchOverview, fetchRevenueData } = useFinanceStore();

  useEffect(() => {
    fetchOverview();
    fetchRevenueData({ dateRange: 'year' });
  }, [fetchOverview, fetchRevenueData]);

  const revenueTrend = (revenueData || []).length > 0 ? revenueData : [];
  const totalRevenue = overview?.totalRevenue || 0;
  const netRevenue = overview?.netRevenue || 0;
  const pendingSettlements = overview?.pendingPayouts || 0;
  const totalExpenses = totalRevenue - netRevenue;

  const modules = [
    { name: 'Settlements', path: '/dashboard/finance/settlements', color: '#1976d2' },
    { name: 'Vendors', path: '/dashboard/finance/vendors', color: '#388e3c' },
    { name: 'Suppliers', path: '/dashboard/finance/suppliers', color: '#f57c00' },
    { name: 'Purchase Orders', path: '/dashboard/finance/purchase-orders', color: '#7b1fa2' },
    { name: 'Invoices', path: '/dashboard/finance/invoices', color: '#c62828' },
    { name: 'GST', path: '/dashboard/finance/gst', color: '#00838f' },
    { name: 'Taxes', path: '/dashboard/finance/taxes', color: '#4e342e' },
    { name: 'Accounting', path: '/dashboard/finance/accounting', color: '#1565c0' },
    { name: 'Revenue', path: '/dashboard/finance/revenue', color: '#2e7d32' },
    { name: 'P&L', path: '/dashboard/finance/profit-loss', color: '#6a1b9a' },
    { name: 'Cash Flow', path: '/dashboard/finance/cash-flow', color: '#00695c' },
    { name: 'Ledger', path: '/dashboard/finance/ledger', color: '#37474f' },
    { name: 'Wallet', path: '/dashboard/finance/wallet-accounting', color: '#e65100' },
    { name: 'Refunds', path: '/dashboard/finance/refunds', color: '#b71c1c' },
    { name: 'Commission', path: '/dashboard/finance/commissions', color: '#4a148c' },
    { name: 'Reports', path: '/dashboard/finance/reports', color: '#1b5e20' },
    { name: 'Banks', path: '/dashboard/finance/banks', color: '#0d47a1' },
    { name: 'Reconciliation', path: '/dashboard/finance/reconciliation', color: '#bf360c' },
    { name: 'Audit Trail', path: '/dashboard/finance/audit-trail', color: '#263238' },
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

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading financial data...</Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard title="Total Revenue (MTD)" value={`₹${totalRevenue.toLocaleString()}`} color="#1976d2" icon={<CurrencyRupee sx={{ color: '#1976d2' }} />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard title="Total Expenses (MTD)" value={`₹${totalExpenses.toLocaleString()}`} color="#d32f2f" icon={<TrendingDown sx={{ color: '#d32f2f' }} />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard title="Net Profit (MTD)" value={`₹${netRevenue.toLocaleString()}`} color="#388e3c" icon={<AccountBalance sx={{ color: '#388e3c' }} />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard title="Pending Settlements" value={`₹${pendingSettlements.toLocaleString()}`} color="#f57c00" icon={<Payment sx={{ color: '#f57c00' }} />} />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Revenue vs Expenses Trend</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueTrend.length > 0 ? revenueTrend : []}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/><stop offset="95%" stopColor="#1976d2" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d32f2f" stopOpacity={0.3}/><stop offset="95%" stopColor="#d32f2f" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip formatter={(v: any) => v ? `₹${Number(v).toLocaleString()}` : ''} />
                    <Area type="monotone" dataKey="revenue" stroke="#1976d2" fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stroke="#d32f2f" fill="url(#colorExpenses)" strokeWidth={2} name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Key Metrics</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { label: 'Total Outstanding', value: `₹${(overview?.totalTransactions ? overview.totalTransactions * 1000 : 0).toLocaleString()}`, color: '#f57c00' },
                    { label: 'Net Revenue', value: `₹${netRevenue.toLocaleString()}`, color: '#388e3c' },
                    { label: 'Wallet Balance', value: `₹${(overview?.walletBalance || 0).toLocaleString()}`, color: '#1976d2' },
                    { label: 'Transactions', value: `${overview?.totalTransactions || 0}`, color: '#00838f' },
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
        </>
      )}

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>ERP Modules</Typography>
      <Grid container spacing={2}>
        {modules.map((mod) => (
          <Grid size={{ xs: 6, sm: 4, md: 2, lg: 1.5 }} key={mod.name}>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
