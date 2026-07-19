"use client";

import { Box, Grid, Card, CardContent, Typography, Paper, Button } from '@mui/material';
import { 
  LocationCity, Map, Warehouse, Store, Inventory, LocalShipping, 
  People, SupportAgent, Warning, Timelapse, ReportProblem, 
  Rule, Dashboard, TrendingUp
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const metrics = [
  { label: 'Active Cities', value: '12', change: '+2', icon: <LocationCity />, color: '#1976d2' },
  { label: 'Active Warehouses', value: '24', change: '+3', icon: <Warehouse />, color: '#388e3c' },
  { label: 'Open Tickets', value: '47', change: '-12%', icon: <SupportAgent />, color: '#f57c00' },
  { label: 'SLA Breaches (MTD)', value: '8', change: '-5', icon: <Warning />, color: '#d32f2f' },
  { label: 'Live Deliveries', value: '186', change: '+22', icon: <LocalShipping />, color: '#7b1fa2' },
  { label: 'Inventory Health', value: '94%', change: '+2.1%', icon: <Inventory />, color: '#00838f' },
];

const healthData = [
  { name: 'Healthy', value: 68, color: '#388e3c' },
  { name: 'Low Stock', value: 18, color: '#f57c00' },
  { name: 'Out of Stock', value: 10, color: '#d32f2f' },
  { name: 'Overflow', value: 4, color: '#7b1fa2' },
];

const weeklyOrders = [
  { day: 'Mon', deliveries: 145, onTime: 132 },
  { day: 'Tue', deliveries: 162, onTime: 148 },
  { day: 'Wed', deliveries: 158, onTime: 140 },
  { day: 'Thu', deliveries: 184, onTime: 165 },
  { day: 'Fri', deliveries: 210, onTime: 188 },
  { day: 'Sat', deliveries: 198, onTime: 175 },
  { day: 'Sun', deliveries: 175, onTime: 158 },
];

const supportPriorityData = [
  { name: 'Critical', count: 8, color: '#d32f2f' },
  { name: 'High', count: 15, color: '#f57c00' },
  { name: 'Medium', count: 32, color: '#1976d2' },
  { name: 'Low', count: 22, color: '#757575' },
];

const quickActions = [
  { name: 'City Ops', href: '/dashboard/ops/cities', color: '#1976d2', icon: <LocationCity /> },
  { name: 'Zones', href: '/dashboard/ops/zones', color: '#388e3c', icon: <Map /> },
  { name: 'Warehouses', href: '/dashboard/ops/warehouses', color: '#f57c00', icon: <Warehouse /> },
  { name: 'Merchants', href: '/dashboard/ops/merchants', color: '#7b1fa2', icon: <Store /> },
  { name: 'Inventory', href: '/dashboard/ops/inventory', color: '#00838f', icon: <Inventory /> },
  { name: 'Deliveries', href: '/dashboard/ops/deliveries', color: '#c62828', icon: <LocalShipping /> },
  { name: 'Incidents', href: '/dashboard/ops/incidents', color: '#e91e63', icon: <ReportProblem /> },
  { name: 'Rules', href: '/dashboard/ops/rules', color: '#1565c0', icon: <Rule /> },
];

export default function OpsDashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Operations Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Real-time operations monitoring and management platform</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Timelapse />}>SLA Check</Button>
          <Button variant="contained" startIcon={<Dashboard />}>Snapshot</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {metrics.map((m) => (
          <Grid item xs={6} sm={4} md={2} key={m.label}>
            <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{m.label}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: m.color }}>{m.value}</Typography>
                    <Typography variant="caption" color={m.change.startsWith('+') ? 'success.main' : 'error.main'}>{m.change}</Typography>
                  </Box>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${m.color}15`, display: 'flex' }}>{m.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Weekly Delivery Performance</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deliveries" fill="#1976d2" name="Total Deliveries" />
                <Bar dataKey="onTime" fill="#388e3c" name="On Time" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Inventory Health</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={healthData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {healthData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Support Tickets by Priority</Typography>
              {supportPriorityData.map((s) => (
                <Box key={s.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color }} />
                    <Typography variant="caption">{s.name}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: s.color }}>{s.count}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Quick Access</Typography>
      <Grid container spacing={2}>
        {quickActions.map((action) => (
          <Grid item xs={6} sm={3} md={1.5} key={action.name}>
            <Card sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3, borderColor: action.color }, border: '2px solid transparent' }} onClick={() => window.location.href = action.href}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ color: action.color, mb: 1, display: 'flex', justifyContent: 'center' }}>{action.icon}</Box>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{action.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
