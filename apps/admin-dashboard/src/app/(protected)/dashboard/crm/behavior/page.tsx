"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent } from '@mui/material';
import { Timeline, DeviceHub, Language, TrendingUp } from '@mui/icons-material';

const events = [
  { id: 1, customer: 'Rahul Sharma', eventType: 'PAGE_VIEW', page: '/products/mobiles', sessionId: 'SESS-001', device: 'MOBILE', platform: 'ANDROID', duration: 145, timestamp: '2026-07-01 14:32:00' },
  { id: 2, customer: 'Priya Patel', eventType: 'SEARCH', query: 'fresh vegetables', sessionId: 'SESS-002', device: 'MOBILE', platform: 'IOS', duration: 30, timestamp: '2026-07-01 14:28:00' },
  { id: 3, customer: 'Vikram Kumar', eventType: 'ADD_TO_CART', product: 'iPhone 15 Pro', sessionId: 'SESS-003', device: 'DESKTOP', platform: 'WINDOWS', duration: 60, timestamp: '2026-07-01 14:15:00' },
  { id: 4, customer: 'Neha Gupta', eventType: 'ORDER_PLACED', orderId: 'ORD-1204', sessionId: 'SESS-004', device: 'MOBILE', platform: 'ANDROID', duration: 300, timestamp: '2026-07-01 13:50:00' },
  { id: 5, customer: 'Amit Singh', eventType: 'REVIEW_SUBMITTED', product: 'Samsung TV', sessionId: 'SESS-005', device: 'DESKTOP', platform: 'MACOS', duration: 180, timestamp: '2026-07-01 13:20:00' },
  { id: 6, customer: 'Sneha R.', eventType: 'CART_ABANDONED', product: 'Wireless Earbuds', sessionId: 'SESS-006', device: 'MOBILE', platform: 'IOS', duration: 420, timestamp: '2026-07-01 12:45:00' },
  { id: 7, customer: 'Deepa Nair', eventType: 'WISHLIST_ADD', product: 'Smart Watch', sessionId: 'SESS-007', device: 'TABLET', platform: 'ANDROID', duration: 90, timestamp: '2026-07-01 12:30:00' },
];

const eventColors: Record<string, string> = {
  PAGE_VIEW: '#1976d2', SEARCH: '#388e3c', ADD_TO_CART: '#f57c00', ORDER_PLACED: '#7b1fa2', REVIEW_SUBMITTED: '#00838f', CART_ABANDONED: '#d32f2f', WISHLIST_ADD: '#4e342e',
};

const platformIcons: Record<string, string> = {
  ANDROID: '📱', IOS: '🍎', WINDOWS: '💻', MACOS: '🖥️',
};

export default function BehaviorPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Behavior Tracking</Typography>
        <Typography variant="body2" color="text.secondary">Track customer behavior events across platforms and sessions</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Events Today', value: '12,450', color: '#1976d2', icon: <Timeline /> },
          { label: 'Active Sessions', value: '342', color: '#388e3c', icon: <DeviceHub /> },
          { label: 'Conversion Rate', value: '3.2%', color: '#7b1fa2', icon: <TrendingUp /> },
          { label: 'Avg Session (sec)', value: '185', color: '#f57c00', icon: <Language /> },
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
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Event Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Device</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{e.customer}</TableCell>
                <TableCell><Chip label={e.eventType.replace('_', ' ')} size="small" sx={{ bgcolor: `${eventColors[e.eventType as keyof typeof eventColors]}20`, color: eventColors[e.eventType as keyof typeof eventColors], fontWeight: 600 }} /></TableCell>
                <TableCell><Typography variant="caption">{e.page || e.query || e.product || e.orderId || ''}</Typography></TableCell>
                <TableCell><Typography variant="caption">{platformIcons[e.platform as keyof typeof platformIcons] || ''} {e.device} / {e.platform}</Typography></TableCell>
                <TableCell>{e.duration}s</TableCell>
                <TableCell><Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: 11 }}>{e.timestamp}</Typography></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
