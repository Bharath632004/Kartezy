"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, Visibility, PlayArrow, BarChart } from '@mui/icons-material';

const campaigns = [
  { id: 1, name: 'Summer Sale 2026', channel: 'EMAIL', status: 'RUNNING', sent: 12500, opened: 5200, clicked: 1800, conversions: 234, revenue: '₹4,56,000', scheduled: '2026-07-01 10:00' },
  { id: 2, name: 'Flash Deal Alert', channel: 'SMS', status: 'COMPLETED', sent: 25000, opened: 12500, clicked: 3200, conversions: 456, revenue: '₹8,90,000', scheduled: '2026-06-28 14:00' },
  { id: 3, name: 'Weekend Special', channel: 'WHATSAPP', status: 'SCHEDULED', sent: 0, opened: 0, clicked: 0, conversions: 0, revenue: '₹0', scheduled: '2026-07-03 09:00' },
  { id: 4, name: 'Loyalty Rewards', channel: 'EMAIL', status: 'DRAFT', sent: 0, opened: 0, clicked: 0, conversions: 0, revenue: '₹0', scheduled: '-' },
  { id: 5, name: 'New User Onboarding', channel: 'PUSH_NOTIFICATION', status: 'DRAFT', sent: 0, opened: 0, clicked: 0, conversions: 0, revenue: '₹0', scheduled: '-' },
  { id: 6, name: 'Monsoon Specials', channel: 'EMAIL', status: 'RUNNING', sent: 8500, opened: 3400, clicked: 1200, conversions: 156, revenue: '₹3,20,000', scheduled: '2026-07-01 11:00' },
];

const channelColors: Record<string, string> = {
  EMAIL: '#1976d2', SMS: '#388e3c', WHATSAPP: '#25D366', PUSH_NOTIFICATION: '#f57c00',
};

const statusColors: Record<string, string> = {
  DRAFT: '#757575', SCHEDULED: '#1976d2', RUNNING: '#388e3c', COMPLETED: '#f57c00', CANCELLED: '#d32f2f',
};

export default function CampaignsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Campaigns</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage multi-channel marketing campaigns</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">Create Campaign</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Running', value: 2, color: '#388e3c' },
          { label: 'Scheduled', value: 1, color: '#1976d2' },
          { label: 'Drafts', value: 2, color: '#757575' },
          { label: 'Total Sent (MTD)', value: '46,000', color: '#f57c00' },
        ].map((s) => (
          <Grid size={{ xs: 3 }} key={s.label}>
            <Card><CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Campaign</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Channel</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sent</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Open Rate</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Click Rate</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Conversions</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Revenue</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Scheduled</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                <TableCell><Chip label={c.channel.replace('_', ' ')} size="small" sx={{ bgcolor: `${channelColors[c.channel] || '#757575'}20`, color: channelColors[c.channel] || '#757575', fontWeight: 600 }} /></TableCell>
                <TableCell>{c.sent.toLocaleString()}</TableCell>
                <TableCell>{c.sent > 0 ? `${((c.opened/c.sent)*100).toFixed(1)}%` : '-'}</TableCell>
                <TableCell>{c.sent > 0 ? `${((c.clicked/c.sent)*100).toFixed(1)}%` : '-'}</TableCell>
                <TableCell>{c.conversions}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{c.revenue}</TableCell>
                <TableCell><Typography variant="caption">{c.scheduled}</Typography></TableCell>
                <TableCell><Chip label={c.status} size="small" sx={{ bgcolor: `${statusColors[c.status]}20`, color: statusColors[c.status], fontWeight: 600 }} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  {c.status === 'DRAFT' && <IconButton size="small" color="success"><PlayArrow fontSize="small" /></IconButton>}
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
