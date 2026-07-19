"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Add, Email, Send, Visibility, BarChart } from '@mui/icons-material';

const campaigns = [
  { id: 1, name: 'Monthly Newsletter - July', subject: 'July Specials & New Arrivals', sent: 45000, opened: 18500, clicked: 5200, status: 'RUNNING', scheduled: '2026-07-01 10:00' },
  { id: 2, name: 'Welcome Series #3', subject: 'Welcome to Kartezy!', sent: 3200, opened: 2400, clicked: 980, status: 'COMPLETED', scheduled: '2026-06-30 09:00' },
  { id: 3, name: 'Flash Sale Announcement', subject: '50% Off - Today Only!', sent: 48000, opened: 22000, clicked: 8500, status: 'SCHEDULED', scheduled: '2026-07-03 08:00' },
  { id: 4, name: 'Abandoned Cart Recovery', subject: 'Complete Your Order', sent: 1200, opened: 680, clicked: 320, status: 'DRAFT', scheduled: '-' },
  { id: 5, name: 'Weekend Specials', subject: 'Weekend Deals Just For You', sent: 35000, opened: 14000, clicked: 4200, status: 'COMPLETED', scheduled: '2026-06-27 10:00' },
];

const statusColors: Record<string, string> = {
  DRAFT: '#757575', SCHEDULED: '#1976d2', RUNNING: '#388e3c', COMPLETED: '#f57c00',
};

export default function EmailCampaignsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Email Campaigns</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage email marketing campaigns</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">New Email Campaign</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Sent (MTD)', value: '1,32,200', color: '#1976d2', icon: <Send /> },
          { label: 'Avg Open Rate', value: '45.2%', color: '#388e3c', icon: <Email /> },
          { label: 'Avg Click Rate', value: '14.8%', color: '#7b1fa2', icon: <BarChart /> },
          { label: 'Bounce Rate', value: '2.1%', color: '#f57c00', icon: <Email /> },
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
              <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sent</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Opened</TableCell>
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
                <TableCell><Typography variant="caption">{c.subject}</Typography></TableCell>
                <TableCell>{c.sent.toLocaleString()}</TableCell>
                <TableCell>{c.opened.toLocaleString()} ({c.sent > 0 ? `${((c.opened / c.sent) * 100).toFixed(1)}%` : '-'})</TableCell>
                <TableCell>{c.clicked.toLocaleString()} ({c.sent > 0 ? `${((c.clicked / c.sent) * 100).toFixed(1)}%` : '-'})</TableCell>
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
