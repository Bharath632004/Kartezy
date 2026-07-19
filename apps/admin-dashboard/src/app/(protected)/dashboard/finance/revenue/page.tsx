"use client";

import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const monthlyRevenue = [
  { month: 'Jan', commission: 85000, platformFee: 25000, deliveryFee: 65000, total: 175000 },
  { month: 'Feb', commission: 95000, platformFee: 28000, deliveryFee: 72000, total: 195000 },
  { month: 'Mar', commission: 110000, platformFee: 32000, deliveryFee: 80000, total: 222000 },
  { month: 'Apr', commission: 105000, platformFee: 30000, deliveryFee: 78000, total: 213000 },
  { month: 'May', commission: 130000, platformFee: 38000, deliveryFee: 95000, total: 263000 },
  { month: 'Jun', commission: 155000, platformFee: 42000, deliveryFee: 108000, total: 305000 },
];

const revenueBreakdown = [
  { name: 'Commission', value: 680000, color: '#1976d2' },
  { name: 'Platform Fees', value: 195000, color: '#388e3c' },
  { name: 'Delivery Fees', value: 498000, color: '#f57c00' },
  { name: 'Interest', value: 25000, color: '#7b1fa2' },
  { name: 'Other', value: 15000, color: '#00838f' },
];

export default function RevenuePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Revenue Tracking</Typography>
        <Typography variant="body2" color="text.secondary">Monitor revenue streams, commission income, and platform earnings</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Revenue (YTD)', value: '₹14,13,000', trend: 18.5, color: '#1976d2' },
          { label: 'Commission Revenue', value: '₹6,80,000', trend: 22.3, color: '#388e3c' },
          { label: 'Platform Fees', value: '₹1,95,000', trend: 12.8, color: '#f57c00' },
          { label: 'Delivery Fees', value: '₹4,98,000', trend: 15.2, color: '#7b1fa2' },
        ].map((stat) => (
          <Grid item xs={3} key={stat.label}>
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

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Revenue Trends</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="commission" fill="#1976d2" name="Commission" stackId="a" />
                <Bar dataKey="platformFee" fill="#388e3c" name="Platform Fees" stackId="a" />
                <Bar dataKey="deliveryFee" fill="#f57c00" name="Delivery Fees" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Revenue Breakdown</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={revenueBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {revenueBreakdown.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
