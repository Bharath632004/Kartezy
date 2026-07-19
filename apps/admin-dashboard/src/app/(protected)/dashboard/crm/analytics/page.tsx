"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, People, Campaign, ShowChart } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function CrmAnalyticsPage() {
  const { overview, revenueData, loading, fetchOverview, fetchRevenueData } = useFinanceStore();

  useEffect(() => {
    fetchOverview();
    fetchRevenueData({ dateRange: 'year' });
  }, [fetchOverview, fetchRevenueData]);

  const monthlyData = (revenueData || []).length > 0 
    ? revenueData.map((item: any, idx: number) => ({
        month: item.month || `M${idx + 1}`,
        customers: item.customers || Math.round((item.total || item.revenue || 0) / 1000),
        campaigns: item.campaigns || 0,
        leads: item.leads || 0,
        revenue: item.total || item.revenue || 0,
      }))
    : [];

  const channelPerformance = [
    { channel: 'Email', openRate: 0, clickRate: 0, conversionRate: 0, roi: 0 },
    { channel: 'SMS', openRate: 0, clickRate: 0, conversionRate: 0, roi: 0 },
    { channel: 'WhatsApp', openRate: 0, clickRate: 0, conversionRate: 0, roi: 0 },
    { channel: 'Push', openRate: 0, clickRate: 0, conversionRate: 0, roi: 0 },
  ];

  const customerGrowth = overview?.totalTransactions || 0;
  const totalRevenue = overview?.totalRevenue || 0;
  const campaignRoi = totalRevenue > 0 ? `${Math.round((overview?.netRevenue || 0) / totalRevenue * 100)}%` : 'N/A';

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>CRM Analytics</Typography>
        <Typography variant="body2" color="text.secondary">Campaign performance, customer growth, and marketing ROI</Typography>
      </Box>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading analytics data...</Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Customer Growth (MTD)', value: `+${customerGrowth}`, color: '#1976d2' },
              { label: 'Campaign ROI', value: campaignRoi, color: '#388e3c' },
              { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: '#7b1fa2' },
              { label: 'Net Revenue', value: `₹${(overview?.netRevenue || 0).toLocaleString()}`, color: '#f57c00' },
            ].map((s) => (
              <Grid size={{ xs: 3 }} key={s.label}>
                <Card><CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: s.color, my: 0.5 }}>{s.value}</Typography>
                </CardContent></Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Growth Trend</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData.length > 0 ? monthlyData : []}>
                    <defs><linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/><stop offset="95%" stopColor="#1976d2" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area yAxisId="left" type="monotone" dataKey="customers" stroke="#1976d2" fill="url(#cGrad)" name="Customers" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#388e3c" name="Revenue" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Channel Performance</Typography>
                {channelPerformance.map((ch) => (
                  <Box key={ch.channel} sx={{ mb: 2, p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{ch.channel}</Typography>
                      <Chip label={`ROI: ${ch.roi}%`} size="small" color="default" variant="outlined" />
                    </Box>
                    <Typography variant="caption" color="text.secondary">Open: {ch.openRate}% | Click: {ch.clickRate}% | Conv: {ch.conversionRate}%</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Monthly Comparison</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData.length > 0 ? monthlyData : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1976d2" name="Revenue" />
                <Bar dataKey="customers" fill="#7b1fa2" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Box>
  );
}
