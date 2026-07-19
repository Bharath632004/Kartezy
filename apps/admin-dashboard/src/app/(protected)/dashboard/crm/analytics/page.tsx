"use client";

import { Box, Typography, Paper, Grid, Card, CardContent, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, People, Campaign, ShowChart } from '@mui/icons-material';

const monthlyData = [
  { month: 'Jan', customers: 120, campaigns: 5, leads: 45, revenue: 125000 },
  { month: 'Feb', customers: 145, campaigns: 7, leads: 52, revenue: 148000 },
  { month: 'Mar', customers: 168, campaigns: 8, leads: 68, revenue: 185000 },
  { month: 'Apr', customers: 195, campaigns: 6, leads: 72, revenue: 210000 },
  { month: 'May', customers: 225, campaigns: 10, leads: 89, revenue: 268000 },
  { month: 'Jun', customers: 250, campaigns: 12, leads: 95, revenue: 325000 },
];

const channelPerformance = [
  { channel: 'Email', openRate: 41.2, clickRate: 11.5, conversionRate: 2.0, roi: 320 },
  { channel: 'SMS', openRate: 50.0, clickRate: 11.4, conversionRate: 1.6, roi: 280 },
  { channel: 'WhatsApp', openRate: 70.0, clickRate: 25.3, conversionRate: 4.1, roi: 450 },
  { channel: 'Push', openRate: 34.3, clickRate: 8.0, conversionRate: 1.0, roi: 180 },
];

export default function CrmAnalyticsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>CRM Analytics</Typography>
        <Typography variant="body2" color="text.secondary">Campaign performance, customer growth, and marketing ROI</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Customer Growth (MTD)', value: '+250', trend: 18.5, color: '#1976d2' },
          { label: 'Campaign ROI', value: '342%', trend: 12.3, color: '#388e3c' },
          { label: 'Lead Conversion', value: '24.5%', trend: 5.2, color: '#7b1fa2' },
          { label: 'Avg Open Rate', value: '48.9%', trend: 3.8, color: '#f57c00' },
        ].map((s) => (
          <Grid item xs={3} key={s.label}>
            <Card><CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: s.color, my: 0.5 }}>{s.value}</Typography>
              <Typography variant="caption" color={s.trend >= 0 ? 'success.main' : 'error.main'}>
                {s.trend >= 0 ? '+' : ''}{s.trend}% vs last month
              </Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Growth Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
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
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Channel Performance</Typography>
            {channelPerformance.map((ch) => (
              <Box key={ch.channel} sx={{ mb: 2, p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{ch.channel}</Typography>
                  <Chip label={`ROI: ${ch.roi}%`} size="small" color="success" />
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
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="campaigns" fill="#1976d2" name="Campaigns" />
            <Bar dataKey="leads" fill="#7b1fa2" name="Leads" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
