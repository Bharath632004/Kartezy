"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function RevenuePage() {
  const { revenueData, loading, fetchRevenueData } = useFinanceStore();

  useEffect(() => {
    fetchRevenueData({ dateRange: 'year' });
  }, [fetchRevenueData]);

  const monthlyRevenue = (revenueData || []).length > 0
    ? revenueData
    : [];

  const totalRevenue = monthlyRevenue.reduce((sum: number, r: any) => sum + (r.total || r.revenue || 0), 0);
  const commissionTotal = monthlyRevenue.reduce((sum: number, r: any) => sum + (r.commission || 0), 0);
  const platformFeeTotal = monthlyRevenue.reduce((sum: number, r: any) => sum + (r.platformFee || r.platform_fee || 0), 0);
  const deliveryFeeTotal = monthlyRevenue.reduce((sum: number, r: any) => sum + (r.deliveryFee || r.delivery_fee || 0), 0);

  const revenueBreakdown = (commissionTotal || platformFeeTotal || deliveryFeeTotal)
    ? [
        { name: 'Commission', value: commissionTotal, color: '#1976d2' },
        { name: 'Platform Fees', value: platformFeeTotal, color: '#388e3c' },
        { name: 'Delivery Fees', value: deliveryFeeTotal, color: '#f57c00' },
        { name: 'Other', value: 0, color: '#00838f' },
      ]
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Revenue Tracking</Typography>
        <Typography variant="body2" color="text.secondary">Monitor revenue streams, commission income, and platform earnings</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Revenue (YTD)', value: `₹${totalRevenue.toLocaleString()}`, trend: 18.5, color: '#1976d2' },
          { label: 'Commission Revenue', value: `₹${commissionTotal.toLocaleString()}`, trend: 22.3, color: '#388e3c' },
          { label: 'Platform Fees', value: `₹${platformFeeTotal.toLocaleString()}`, trend: 12.8, color: '#f57c00' },
          { label: 'Delivery Fees', value: `₹${deliveryFeeTotal.toLocaleString()}`, trend: 15.2, color: '#7b1fa2' },
        ].map((stat) => (
          <Grid size={{ xs: 3 }} key={stat.label}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color, my: 1 }}>{stat.value}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {stat.trend >= 0 ? <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} /> : <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />}
                  <Typography variant="caption" color={stat.trend >= 0 ? 'success.main' : 'error.main'}>
                    {stat.trend >= 0 ? '+' : ''}{stat.trend}% vs last period
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading revenue data...</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Revenue Trends</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyRevenue.length > 0 ? monthlyRevenue : [{ month: 'N/A', commission: 0, platformFee: 0, deliveryFee: 0, total: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: any) => v ? `₹${Number(v).toLocaleString()}` : ''} />
                  <Bar dataKey="commission" fill="#1976d2" name="Commission" stackId="a" />
                  <Bar dataKey="platformFee" fill="#388e3c" name="Platform Fees" stackId="a" />
                  <Bar dataKey="deliveryFee" fill="#f57c00" name="Delivery Fees" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Revenue Breakdown</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={revenueBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {revenueBreakdown.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => v ? `₹${Number(v).toLocaleString()}` : ''} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
