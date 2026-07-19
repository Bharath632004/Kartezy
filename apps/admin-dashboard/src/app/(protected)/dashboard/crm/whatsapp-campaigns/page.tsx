"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, WhatsApp, Send, Visibility, BarChart } from '@mui/icons-material';

const campaigns = [
  { id: 1, name: 'Weekend Special Menu', message: '🍕 Weekend Special! Order your favorite pizza and get 20% off!', sent: 15000, delivered: 14800, read: 10500, clicked: 3800, status: 'COMPLETED' },
  { id: 2, name: 'New Store Opening', message: '🎉 New store opened in your area! First order free delivery!', sent: 8000, delivered: 7900, read: 6200, clicked: 2400, status: 'RUNNING' },
  { id: 3, name: 'Order Update', message: 'Your order #ORD-1201 is out for delivery! ETA: 15 mins', sent: 4500, delivered: 4480, read: 4100, clicked: 1200, status: 'RUNNING' },
  { id: 4, name: 'Loyalty Reward Alert', message: '🌟 You have 5000 points! Redeem now for exclusive rewards!', sent: 0, delivered: 0, read: 0, clicked: 0, status: 'SCHEDULED' },
];

const statusColors: Record<string, string> = {
  DRAFT: '#757575', SCHEDULED: '#1976d2', RUNNING: '#388e3c', COMPLETED: '#f57c00',
};

export default function WhatsAppCampaignsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>WhatsApp Campaigns</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage WhatsApp business messaging campaigns</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1da851' } }}>New WhatsApp Campaign</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Sent (MTD)', value: '27,500', color: '#25D366', icon: <Send /> },
          { label: 'Read Rate', value: '78.5%', color: '#1976d2', icon: <WhatsApp /> },
          { label: 'Click Rate', value: '28.4%', color: '#7b1fa2', icon: <BarChart /> },
          { label: 'Delivery Rate', value: '98.8%', color: '#388e3c', icon: <WhatsApp /> },
        ].map((s) => (
          <Grid item xs={3} key={s.label}>
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
              <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sent</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Delivered</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Read</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Clicked</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                <TableCell sx={{ maxWidth: 250 }}><Typography variant="caption" noWrap>{c.message}</Typography></TableCell>
                <TableCell>{c.sent.toLocaleString()}</TableCell>
                <TableCell>{c.delivered.toLocaleString()}</TableCell>
                <TableCell>{c.read.toLocaleString()}</TableCell>
                <TableCell>{c.clicked.toLocaleString()}</TableCell>
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
