"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinanceStore } from '@/store/financeStore';

export default function CashFlowPage() {
  const { overview, revenueData, loading, fetchOverview, fetchRevenueData } = useFinanceStore();

  useEffect(() => {
    fetchOverview();
    fetchRevenueData({ dateRange: 'year' });
  }, [fetchOverview, fetchRevenueData]);

  const cashFlowData = (revenueData || []).length > 0
    ? revenueData.map((r: any) => ({
        month: r.month || '',
        operating: r.revenue || r.total || 0,
        investing: -(r.revenue || r.total || 0) * 0.25,
        financing: (r.revenue || r.total || 0) * 0.15,
        net: (r.revenue || r.total || 0) - ((r.revenue || r.total || 0) * 0.25) + ((r.revenue || r.total || 0) * 0.15),
      }))
    : [];

  const netOperating = cashFlowData.reduce((s: number, i: any) => s + i.operating, 0);
  const netInvesting = cashFlowData.reduce((s: number, i: any) => s + i.investing, 0);
  const netFinancing = cashFlowData.reduce((s: number, i: any) => s + i.financing, 0);
  const netCashFlow = netOperating + netInvesting + netFinancing;

  const summarySection = (title: string, items: any[], color: string, bgColor: string, total: number) => (
    <Grid size={{ xs: 12, md: 4 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color }}>{title}</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            {items.map((item: any) => (
              <TableRow key={item.item} hover>
                <TableCell sx={{ fontSize: '0.8rem' }}>{item.item}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: item.amount >= 0 ? '#388e3c' : '#d32f2f', fontSize: '0.8rem' }}>
                  {item.amount >= 0 ? '+' : ''}₹{Math.abs(item.amount).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: bgColor }}>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Net {title}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: total >= 0 ? '#388e3c' : '#d32f2f', fontSize: '0.85rem' }}>
                {total >= 0 ? '+' : ''}₹{Math.abs(total).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Cash Flow Statement</Typography>
        <Typography variant="body2" color="text.secondary">Cash flow analysis</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Operating Cash Flow', value: `₹${netOperating.toLocaleString()}`, color: '#1976d2' },
          { label: 'Investing Cash Flow', value: `₹${netInvesting.toLocaleString()}`, color: '#d32f2f' },
          { label: 'Financing Cash Flow', value: `₹${netFinancing.toLocaleString()}`, color: '#f57c00' },
          { label: 'Net Cash Flow', value: `₹${netCashFlow.toLocaleString()}`, color: '#388e3c' },
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
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading cash flow data...</Typography>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Cash Flow Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData.length > 0 ? cashFlowData : []}>
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
            {summarySection('Operating Activities', cashFlowData.map((d: any) => ({ item: `${d.month} Operating`, amount: d.operating })), '#1976d2', '#e3f2fd', netOperating)}
            {summarySection('Investing Activities', cashFlowData.map((d: any) => ({ item: `${d.month} Investing`, amount: d.investing })), '#d32f2f', '#ffebee', netInvesting)}
            {summarySection('Financing Activities', cashFlowData.map((d: any) => ({ item: `${d.month} Financing`, amount: d.financing })), '#f57c00', '#fff3e0', netFinancing)}
          </Grid>

          <Paper sx={{ mt: 2, p: 3, bgcolor: netCashFlow >= 0 ? '#e8f5e9' : '#ffebee' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Net Cash Flow for Period</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: netCashFlow >= 0 ? '#2e7d32' : '#c62828' }}>
                {netCashFlow >= 0 ? '+' : ''}₹{Math.abs(netCashFlow).toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
