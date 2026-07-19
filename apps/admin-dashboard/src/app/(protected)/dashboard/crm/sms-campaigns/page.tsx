"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, Sms, Send, Visibility, BarChart } from '@mui/icons-material';

const campaigns = [
  { id: 1, name: 'Flash Deal Alert', message: '🔥 Flash Sale! 50% off on all orders today! Use code FLASH50', sent: 28000, delivered: 25400, clicked: 3200, status: 'COMPLETED', scheduled: '2026-06-28 14:00' },
  { id: 2, name: 'Order Confirmation SMS', message: 'Your order #ORD-1201 has been confirmed! Track: tinyurl.com/track', sent: 4500, delivered: 4450, clicked: 1800, status: 'RUNNING', scheduled: '2026-07-01 10:00' },
  { id: 3, name: 'Weekend Offer', message: 'Weekend Special! Free delivery on orders above ₹299!', sent: 0, delivered: 0, clicked: 0, status: 'SCHEDULED', scheduled: '2026-07-03 09:00' },
  { id: 4, name: 'Abandoned Cart SMS', message: 'You left items in your cart! Complete your order now and get 10% off!', sent: 1200, delivered: 1180, clicked: 340, status: 'DRAFT', scheduled: '-' },
];

const statusColors: Record<string, string> = {
  DRAFT: '#757575', SCHEDULED: '#1976d2', RUNNING: '#388e3c', COMPLETED: '#f57c00',
};

export default function SmsCampaignsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>SMS Campaigns</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage SMS marketing campaigns</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">New SMS Campaign</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Sent (MTD)', value: '33,700', color: '#388e3c', icon: <Send /> },
          { label: 'Delivery Rate', value: '96.2%', color: '#1976d2', icon: <Sms /> },
          { label: 'Click Rate', value: '9.8%', color: '#7b1fa2', icon: <BarChart /> },
          { label: 'Cost (MTD)', value: '₹8,425', color: '#f57c00', icon: <Sms /> },
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
              <TableCell sx={{ fontWeight: 600 }}>Message Preview</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sent</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Delivered</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Clicked</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Scheduled</TableCell>
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
                <TableCell>{c.clicked.toLocaleString()}</TableCell>
                <TableCell><Typography variant="caption">{c.scheduled}</Typography></TableCell>
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
