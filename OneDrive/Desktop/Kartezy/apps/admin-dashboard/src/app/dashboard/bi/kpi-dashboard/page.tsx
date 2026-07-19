"use client";
import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, LocalMall, People, AttachMoney, Warning, Star } from '@mui/icons-material';
import { useBiStore } from '@/store/biStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const KpiCard = ({ title, value, icon: Icon, color, prefix, trend }: any) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" variant="caption">{title}</Typography>
          <Typography variant="h4" fontWeight={700}>{prefix || ''}{value?.toLocaleString() ?? '—'}</Typography>
          {trend !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              {trend >= 0 ? <TrendingUp fontSize="small" color="success" /> : <TrendingDown fontSize="small" color="error" />}
              <Typography variant="caption" color={trend >= 0 ? 'success.main' : 'error.main'} sx={{ ml: 0.5 }}>{Math.abs(trend)}%</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ bgcolor: color + '20', borderRadius: 2, p: 1 }}><Icon sx={{ color }} /></Box>
      </Box>
    </CardContent>
  </Card>
);

export default function KpiDashboard() {
  const { executiveDashboard, dateRange, setDateRange, fetchExecutiveDashboard, loading, error } = useBiStore();
  useEffect(() => { fetchExecutiveDashboard(); }, [dateRange]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>KPI Dashboard</Typography>
        <Chip label={dateRange.preset} color="primary" variant="outlined" />
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && !executiveDashboard ? (<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>Core Business KPIs</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { title: 'Revenue', value: executiveDashboard?.totalRevenue, icon: AttachMoney, color: '#4CAF50', prefix: '$', trend: 12.5 },
              { title: 'Orders', value: executiveDashboard?.totalOrders, icon: LocalMall, color: '#2196F3', trend: 8.3 },
              { title: 'Active Cust.', value: executiveDashboard?.activeCustomers, icon: People, color: '#FF9800', trend: 5.1 },
              { title: 'New Cust.', value: executiveDashboard?.newCustomers, icon: People, color: '#9C27B0', trend: 15.2 },
              { title: 'Churned', value: executiveDashboard?.churnedCustomers, icon: Warning, color: '#f44336', trend: -3.2 },
              { title: 'Avg Order', value: executiveDashboard?.totalRevenue && executiveDashboard?.totalOrders ? Math.round(executiveDashboard.totalRevenue / executiveDashboard.totalOrders) : 0, icon: Star, color: '#00bcd4', prefix: '$', trend: 4.8 },
            ].map((kpi, i) => (
              <Grid key={i} item xs={6} sm={4} md={2}><KpiCard {...kpi} /></Grid>
            ))}
          </Grid>
          <Typography variant="h6" sx={{ mb: 2 }}>Revenue Performance</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card><CardContent>
                <Typography variant="h6" gutterBottom>Daily Revenue & Orders</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={executiveDashboard?.revenueTrend || []}>
                    <XAxis dataKey="date" /><YAxis /><Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Revenue" />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent></Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
