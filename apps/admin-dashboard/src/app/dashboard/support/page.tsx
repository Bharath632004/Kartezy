"use client"
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
RefreshOutlined, HeadsetMic, ConfirmationNumber, CheckCircle, ErrorOutlined,
AccessTime, SentimentSatisfiedAlt, TrendingUp, Speed, People, Forum, SmartToy,
WarningAmber, Phone, Email,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
const metricCardSx = {
transition: 'all 0.3s ease-in-out',
'&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
};
function StatCard({ title, value, icon, color, subtitle }: {
title: string; value: string | number; icon: React.ReactNode; color: string; subtitle?: string;
}) {
return (
<Card sx={metricCardSx}>
<CardContent>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
<Box>
<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{title}</Typography>
<Typography variant="h4" sx={{ fontWeight: 700, color }}>{value}</Typography>
{subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
</Box>
<Avatar sx={{ bgcolor: `${color}15`, color, width: 48, height: 48 }}>{icon}</Avatar>
</Box>
</CardContent>
</Card>
);
}
const supportKPIs = {
openTickets: 47,
unassignedTickets: 12,
urgentTickets: 5,
avgResponseTime: 4.2,
avgResolutionTime: 28,
csatScore: 4.3,
npsScore: 72,
slaCompliance: 94.5,
activeChats: 8,
botHandled: 156,
knowledgeArticles: 342,
agentOnline: 14,
agentTotal: 22,
};
const channelData = [
{ channel: 'Phone', count: 124, percent: 28, color: '#4CAF50' },
{ channel: 'Email', count: 98, percent: 22, color: '#2196F3' },
{ channel: 'Live Chat', count: 112, percent: 25, color: '#FF9800' },
{ channel: 'WhatsApp', count: 45, percent: 10, color: '#25D366' },
{ channel: 'Portal', count: 67, percent: 15, color: '#9C27B0' },
];
export default function SupportDashboard() {
const theme = useTheme();
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Support Dashboard</Typography>
<Typography variant="body2" color="text.secondary">Enterprise support overview &middot; Real-time metrics</Typography>
</Box>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
{/* Urgent Alert */}
{supportKPIs.urgentTickets > 0 && (
<Paper sx={{ p: 2, mb: 3, bgcolor: 'error.main', color: 'white' }}>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
<WarningAmber />
<Typography>{supportKPIs.urgentTickets} urgent tickets require immediate attention</Typography>
</Box>
</Paper>
)}
{/* KPI Cards */}
<Grid container spacing={2} sx={{ mb: 3 }}>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
<StatCard title="Open Tickets" value={supportKPIs.openTickets} icon={<ConfirmationNumber />} color={theme.palette.warning.main} subtitle={`${supportKPIs.unassignedTickets} unassigned`} />
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
<StatCard title="SLA Compliance" value={`${supportKPIs.slaCompliance}%`} icon={<Speed />} color={theme.palette.success.main} subtitle="Last 24 hours" />
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
<StatCard title="CSAT Score" value={supportKPIs.csatScore.toFixed(1)} icon={<SentimentSatisfiedAlt />} color={theme.palette.info.main} subtitle="/ 5.0" />
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
<StatCard title="NPS Score" value={supportKPIs.npsScore} icon={<TrendingUp />} color={supportKPIs.npsScore >= 70 ? 'success.main' : 'warning.main'} subtitle="Promoters: 45%" />
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
<StatCard title="Avg Response" value={`${supportKPIs.avgResponseTime} min`} icon={<AccessTime />} color={theme.palette.primary.main} />
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
<StatCard title="Active Chats" value={supportKPIs.activeChats} icon={<Forum />} color={theme.palette.secondary.main} subtitle="3 waiting" />
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
<StatCard title="Bot Handled" value={supportKPIs.botHandled} icon={<SmartToy />} color={theme.palette.success.main} subtitle="Today" />
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
<StatCard title="Agents Online" value={`${supportKPIs.agentOnline}/${supportKPIs.agentTotal}`} icon={<People />} color={theme.palette.info.main} />
</Grid>
</Grid>
{/* Channel Distribution + Agent Performance */}
<Grid container spacing={3} sx={{ mb: 3 }}>
<Grid size={{ xs: 12, md: 5 }}>
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2 }}>Support Channels</Typography>
<Stack spacing={1.5}>
{channelData.map((ch) => (
<Box key={ch.channel}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
<Typography variant="body2">{ch.channel}</Typography>
<Typography variant="body2" sx={{ fontWeight: 600 }}>{ch.count} ({ch.percent}%)</Typography>
</Box>
<LinearProgress variant="determinate" value={ch.percent} sx={{ height: 8, borderRadius: 4, bgcolor: `${ch.color}20`, '& .MuiLinearProgress-bar': { bgcolor: ch.color } }} />
</Box>
))}
</Stack>
</Paper>
</Grid>
<Grid size={{ xs: 12, md: 7 }}>
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2 }}>Agent Performance</Typography>
<TableContainer>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Agent</TableCell>
<TableCell align="right">Tickets</TableCell>
<TableCell align="right">Resolved</TableCell>
<TableCell align="right">Avg Response</TableCell>
<TableCell align="right">CSAT</TableCell>
<TableCell align="right">Status</TableCell>
</TableRow>
</TableHead>
<TableBody>
{[
{ name: 'Sarah Johnson', tickets: 24, resolved: 21, response: 3.2, csat: 4.8, status: 'online' },
{ name: 'Mike Chen', tickets: 18, resolved: 16, response: 4.1, csat: 4.5, status: 'online' },
{ name: 'Emily Davis', tickets: 15, resolved: 14, response: 5.3, csat: 4.2, status: 'away' },
{ name: 'Alex Kumar', tickets: 12, resolved: 10, response: 6.7, csat: 3.9, status: 'online' },
{ name: 'Lisa Park', tickets: 8, resolved: 8, response: 2.8, csat: 5.0, status: 'online' },
].map((agent) => (
<TableRow key={agent.name} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{agent.name}</Typography></TableCell>
<TableCell align="right">{agent.tickets}</TableCell>
<TableCell align="right">{agent.resolved}</TableCell>
<TableCell align="right">{agent.response} min</TableCell>
<TableCell align="right"><Chip label={agent.csat.toFixed(1)} color={agent.csat >= 4.5 ? 'success' : agent.csat >= 4 ? 'warning' : 'error'} size="small" /></TableCell>
<TableCell align="right"><Chip label={agent.status} color={agent.status === 'online' ? 'success' : 'warning'} size="small" /></TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</Paper>
</Grid>
</Grid>
{/* Quick Actions / Stats */}
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2 }}>Support at a Glance</Typography>
<Grid container spacing={2}>
<Grid size={{ xs: 6, sm: 3 }}>
<Box sx={{ textAlign: 'center', p: 1 }}>
<ConfirmationNumber sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
<Typography variant="h5" sx={{ fontWeight: 700 }}>{supportKPIs.openTickets}</Typography>
<Typography variant="caption" color="text.secondary">Open Tickets</Typography>
</Box>
</Grid>
<Grid size={{ xs: 6, sm: 3 }}>
<Box sx={{ textAlign: 'center', p: 1 }}>
<Email sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
<Typography variant="h5" sx={{ fontWeight: 700 }}>98</Typography>
<Typography variant="caption" color="text.secondary">Email Today</Typography>
</Box>
</Grid>
<Grid size={{ xs: 6, sm: 3 }}>
<Box sx={{ textAlign: 'center', p: 1 }}>
<Phone sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
<Typography variant="h5" sx={{ fontWeight: 700 }}>45</Typography>
<Typography variant="caption" color="text.secondary">Calls Today</Typography>
</Box>
</Grid>
<Grid size={{ xs: 6, sm: 3 }}>
<Box sx={{ textAlign: 'center', p: 1 }}>
<HeadsetMic sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
<Typography variant="h5" sx={{ fontWeight: 700 }}>92%</Typography>
<Typography variant="caption" color="text.secondary">SLA Met</Typography>
</Box>
</Grid>
</Grid>
</Paper>
</Container>
);
}

