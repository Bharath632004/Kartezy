"use client";

import { Box, Grid, Card, CardContent, Typography, Chip, Paper, Button } from '@mui/material';
import { PeopleAlt, Store, TrendingUp, Campaign, EmojiEvents, Loyalty, Groups, BarChart } from '@mui/icons-material';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const metrics = [
  { label: 'Total Customers', value: '12,458', change: '+18.2%', icon: <PeopleAlt />, color: '#1976d2' },
  { label: 'Active Merchants', value: '1,234', change: '+8.5%', icon: <Store />, color: '#388e3c' },
  { label: 'Running Campaigns', value: '8', change: '+2', icon: <Campaign />, color: '#f57c00' },
  { label: 'Leads (MTD)', value: '342', change: '+24.1%', icon: <TrendingUp />, color: '#7b1fa2' },
];

const segmentData = [
  { name: 'High Value', value: 1245, color: '#388e3c' },
  { name: 'Active', value: 4560, color: '#1976d2' },
  { name: 'At Risk', value: 892, color: '#f57c00' },
  { name: 'New', value: 2345, color: '#7b1fa2' },
  { name: 'Churned', value: 3416, color: '#d32f2f' },
];

const campaignPerformance = [
  { channel: 'Email', sent: 45000, opened: 18500, clicked: 5200, converted: 890 },
  { channel: 'SMS', sent: 28000, opened: 14000, clicked: 3200, converted: 450 },
  { channel: 'WhatsApp', sent: 15000, opened: 10500, clicked: 3800, converted: 620 },
  { channel: 'Push', sent: 35000, opened: 12000, clicked: 2800, converted: 340 },
];

const quickActions = [
  { name: 'Create Campaign', href: '/dashboard/crm/campaigns', color: '#1976d2' },
  { name: 'View Leads', href: '/dashboard/crm/leads', color: '#7b1fa2' },
  { name: 'Manage Segments', href: '/dashboard/crm/segments', color: '#388e3c' },
  { name: 'Loyalty Rewards', href: '/dashboard/crm/loyalty', color: '#f57c00' },
  { name: 'Referral Program', href: '/dashboard/crm/referrals', color: '#00838f' },
  { name: 'Campaign Analytics', href: '/dashboard/crm/analytics', color: '#c62828' },
];

export default function CrmDashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Enterprise CRM</Typography>
          <Typography variant="body2" color="text.secondary">Customer relationship management, campaigns, and marketing automation</Typography>
        </Box>
        <Button variant="contained" startIcon={<Campaign />}>New Campaign</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {metrics.map((m) => (
          <Grid size={{ xs: 3 }} key={m.label}>
            <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{m.label}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: m.color }}>{m.value}</Typography>
                    <Typography variant="caption" color={m.change.startsWith('+') ? 'success.main' : 'error.main'}>{m.change}</Typography>
                  </Box>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${m.color}15` }}>{m.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Customer Segments</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={segmentData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={(entry: any) => `${entry.name} ${entry.percent ? (entry.percent*100).toFixed(0) : 0}%`}>
                  {segmentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Campaign Performance by Channel</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <ReBarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#1976d2" name="Sent" />
                <Bar dataKey="opened" fill="#388e3c" name="Opened" />
                <Bar dataKey="clicked" fill="#f57c00" name="Clicked" />
              </ReBarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Quick Actions</Typography>
      <Grid container spacing={2}>
        {quickActions.map((action) => (
          <Grid size={{ xs: 6, sm: 4, md: 2 }} key={action.name}>
            <Card sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3, borderColor: action.color }, border: '2px solid transparent' }} onClick={() => window.location.href = action.href}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: action.color }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{action.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
