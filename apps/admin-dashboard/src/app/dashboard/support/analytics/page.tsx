"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, TrendingUp, TrendingDown, Analytics, AccessTime,
Group, ConfirmationNumber, SentimentSatisfiedAlt, BarChart, Timeline,
Download, CalendarMonth,
} from '@mui/icons-material';
const analyticsCards = [
{ title: 'Ticket Volume', value: '1,245', change: '+12%', isUp: true, subtitle: 'vs last month', color: 'primary.main', icon: <ConfirmationNumber /> },
{ title: 'Avg Resolution Time', value: '4.2h', change: '-8%', isUp: false, subtitle: 'vs last month', color: 'success.main', icon: <AccessTime /> },
{ title: 'First Response Time', value: '3.8m', change: '-15%', isUp: false, subtitle: 'Improved', color: 'info.main', icon: <Timeline /> },
{ title: 'CSAT Score', value: '4.3', change: '+0.2', isUp: true, subtitle: 'vs last month', color: 'secondary.main', icon: <SentimentSatisfiedAlt /> },
{ title: 'Tickets per Agent', value: '28', change: '+5%', isUp: true, subtitle: 'Today avg', color: 'warning.main', icon: <Group /> },
{ title: 'SLA Compliance', value: '94.2%', change: '+2.1%', isUp: true, subtitle: 'This month', color: 'success.main', icon: <BarChart /> },
];
const topIssues = [
{ issue: 'Delivery Delay', count: 234, percent: 18.8, trend: 'up' },
{ issue: 'Payment Failed', count: 189, percent: 15.2, trend: 'up' },
{ issue: 'Wrong Item', count: 145, percent: 11.6, trend: 'down' },
{ issue: 'Refund Status', count: 123, percent: 9.9, trend: 'up' },
{ issue: 'Account Access', count: 98, percent: 7.9, trend: 'stable' },
{ issue: 'App Crash', count: 87, percent: 7.0, trend: 'down' },
{ issue: 'Merchant Onboarding', count: 67, percent: 5.4, trend: 'stable' },
{ issue: 'Address Change', count: 54, percent: 4.3, trend: 'down' },
];
const channelPerformance = [
{ channel: 'Live Chat', volume: 412, csat: 4.5, response: '1.2m', resolution: '15m', sla: 98 },
{ channel: 'Phone', volume: 324, csat: 4.2, response: '0.8m', resolution: '8m', sla: 95 },
{ channel: 'Email', volume: 298, csat: 4.0, response: '45m', resolution: '4h', sla: 88 },
{ channel: 'WhatsApp', volume: 156, csat: 4.3, response: '5m', resolution: '30m', sla: 92 },
{ channel: 'Portal', volume: 55, csat: 3.8, response: '2h', resolution: '6h', sla: 78 },
];
export default function SupportAnalytics() {
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Support Analytics</Typography>
<Typography variant="body2" color="text.secondary">Comprehensive support performance metrics</Typography>
</Box>
<Box sx={{ display: 'flex', gap: 1 }}>
<Button variant="outlined" startIcon={<CalendarMonth />}>This Month</Button>
<Button variant="outlined" startIcon={<Download />}>Export</Button>
</Box>
</Box>
<Grid container spacing={2} sx={{ mb: 3 }}>
{analyticsCards.map((card) => (
<Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
<Card sx={{ '&:hover': { transform: 'translateY(-2px)', boxShadow: 3, transition: '0.3s' } }}>
<CardContent>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
<Box>
<Typography variant="body2" color="text.secondary">{card.title}</Typography>
<Typography variant="h4" sx={{ fontWeight: 700, color: card.color }}>{card.value}</Typography>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
{card.isUp ? <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} /> : <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />}
<Typography variant="caption" color={card.isUp ? 'success.main' : 'error.main'}>{card.change}</Typography>
<Typography variant="caption" color="text.secondary">{card.subtitle}</Typography>
</Box>
</Box>
<Avatar sx={{ bgcolor: `${card.color}15`, color: card.color }}>{card.icon}</Avatar>
</Box>
</CardContent>
</Card>
</Grid>
))}
</Grid>
<Grid container spacing={3}>
<Grid size={{ xs: 12, md: 5 }}>
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2 }}>Top Issues</Typography>
<Stack spacing={1}>
{topIssues.map((issue) => (
<Box key={issue.issue}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
<Typography variant="body2">{issue.issue}</Typography>
{issue.trend === 'up' && <TrendingUp sx={{ fontSize: 14, color: 'error.main' }} />}
{issue.trend === 'down' && <TrendingDown sx={{ fontSize: 14, color: 'success.main' }} />}
</Box>
<Typography variant="body2" sx={{ fontWeight: 600 }}>{issue.count} ({issue.percent}%)</Typography>
</Box>
<LinearProgress variant="determinate" value={issue.percent * 5} sx={{ height: 6, borderRadius: 3 }}
color={issue.trend === 'up' ? 'error' : issue.trend === 'down' ? 'success' : 'info'} />
</Box>
))}
</Stack>
</Paper>
</Grid>
<Grid size={{ xs: 12, md: 7 }}>
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2 }}>Channel Performance</Typography>
<TableContainer>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Channel</TableCell>
<TableCell align="right">Volume</TableCell>
<TableCell align="right">CSAT</TableCell>
<TableCell align="right">Response Time</TableCell>
<TableCell align="right">Resolution Time</TableCell>
<TableCell align="right">SLA %</TableCell>
</TableRow>
</TableHead>
<TableBody>
{channelPerformance.map((ch) => (
<TableRow key={ch.channel} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{ch.channel}</Typography></TableCell>
<TableCell align="right">{ch.volume}</TableCell>
<TableCell align="right"><Chip label={ch.csat.toFixed(1)} color={ch.csat >= 4.3 ? 'success' : ch.csat >= 4 ? 'warning' : 'error'} size="small" /></TableCell>
<TableCell align="right">{ch.response}</TableCell>
<TableCell align="right">{ch.resolution}</TableCell>
<TableCell align="right">
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
<LinearProgress variant="determinate" value={ch.sla} sx={{ width: 50, height: 6, borderRadius: 3 }} color={ch.sla >= 95 ? 'success' : ch.sla >= 85 ? 'warning' : 'error'} />
<Typography variant="caption">{ch.sla}%</Typography>
</Box>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</Paper>
</Grid>
</Grid>
</Container>
);
}

