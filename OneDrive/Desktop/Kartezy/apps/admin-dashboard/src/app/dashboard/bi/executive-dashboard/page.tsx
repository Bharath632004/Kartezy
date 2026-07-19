"use client";
import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Chip, Alert } from '@mui/material';
import { TrendingUp, TrendingDown, LocalMall, People, Store, DeliveryDining, AttachMoney } from '@mui/icons-material';
import { useBiStore } from '@/store/biStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const StatCard = ({ title, value, icon: Icon, color, prefix }: any) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" variant="body2">{title}</Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>{prefix || ''}{value?.toLocaleString() ?? '—'}</Typography>
        </Box>
        <Box sx={{ bgcolor: color + '20', borderRadius: 2, p: 1 }}><Icon sx={{ color }} /></Box>
      </Box>
    </CardContent>
  </Card>
);

export default function ExecutiveDashboard() {
  const { executiveDashboard, dateRange, setDateRange, fetchExecutiveDashboard, loading, error } = useBiStore();
  useEffect(() => { fetchExecutiveDashboard(); }, [dateRange]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Executive Dashboard</Typography>
        <Chip label={dateRange.preset} color="primary" variant="outlined" />
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && !executiveDashboard ? (<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Total Revenue" value={executiveDashboard?.totalRevenue} icon={AttachMoney} color="#4CAF50" prefix="$" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Total Orders" value={executiveDashboard?.totalOrders} icon={LocalMall} color="#2196F3" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Active Customers" value={executiveDashboard?.activeCustomers} icon={People} color="#FF9800" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="New Customers" value={executiveDashboard?.newCustomers} icon={TrendingUp} color="#9C27B0" /></Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card><CardContent><Typography variant="h6" gutterBottom>Revenue Trend</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={executiveDashboard?.revenueTrend || []}>
                    <XAxis dataKey="date" /><YAxis /><Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card><CardContent><Typography variant="h6" gutterBottom>Revenue by Category</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={executiveDashboard?.revenueByCategory || []} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                    {(executiveDashboard?.revenueByCategory || []).map((_: any, i: number) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
                  </Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12}>
              <Card><CardContent><Typography variant="h6" gutterBottom>City Performance</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={executiveDashboard?.cityPerformance || []}>
                    <XAxis dataKey="city" /><YAxis /><Tooltip /><Legend />
                    <Bar dataKey="orders" fill="#8884d8" /><Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent></Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
