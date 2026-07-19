"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, Notifications, Send, Visibility, BarChart } from '@mui/icons-material';

const campaigns = [
  { id: 1, name: 'Order Status Update', title: 'Your order is on the way!', sent: 12500, delivered: 11800, opened: 6200, status: 'RUNNING', platform: 'ALL' },
  { id: 2, name: 'Flash Sale Alert', title: '⚡ 50% Off Flash Sale!', sent: 35000, delivered: 32000, opened: 14500, status: 'COMPLETED', platform: 'ALL' },
  { id: 3, name: 'New Feature Announcement', title: 'Try our new Express Delivery!', sent: 8000, delivered: 7600, opened: 3400, status: 'SCHEDULED', platform: 'ANDROID' },
  { id: 4, name: 'Re-engagement Campaign', title: 'We miss you! Here\'s ₹100 off', sent: 0, delivered: 0, opened: 0, status: 'DRAFT', platform: 'IOS' },
];

const statusColors: Record<string, string> = {
  DRAFT: '#757575', SCHEDULED: '#1976d2', RUNNING: '#388e3c', COMPLETED: '#f57c00',
};

export default function PushCampaignsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Push Campaigns</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage push notification campaigns</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">New Push Campaign</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Sent (MTD)', value: '55,500', color: '#f57c00', icon: <Send /> },
          { label: 'Delivery Rate', value: '92.8%', color: '#1976d2', icon: <Notifications /> },
          { label: 'Open Rate', value: '48.2%', color: '#7b1fa2', icon: <BarChart /> },
          { label: 'Opt-out Rate', value: '3.2%', color: '#d32f2f', icon: <Notifications /> },
        ].map((s) => (
          <Grid size={{ xs: 3 }} key={s.label}>
            <Card><CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              </Box>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Campaign</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Platform</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sent</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Delivered</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Opened</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                <TableCell><Typography variant="caption">{c.title}</Typography></TableCell>
                <TableCell><Chip label={c.platform} size="small" variant="outlined" /></TableCell>
                <TableCell>{c.sent.toLocaleString()}</TableCell>
                <TableCell>{c.delivered.toLocaleString()}</TableCell>
                <TableCell>{c.opened.toLocaleString()} ({c.delivered > 0 ? `${((c.opened / c.delivered) * 100).toFixed(0)}%` : '-'})</TableCell>
                <TableCell><Chip label={c.status} size="small" sx={{ bgcolor: `${statusColors[c.status]}20`, color: statusColors[c.status], fontWeight: 600 }} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  <IconButton size="small" color="info"><BarChart fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
