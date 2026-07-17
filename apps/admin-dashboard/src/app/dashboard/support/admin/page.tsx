"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, Add, Edit, Group, AutoFixHigh, Settings, Person,
Delete, ContentCopy, Security,
} from '@mui/icons-material';
const supportTeams = [
{ id: 'T-01', name: 'Tier 1 Support', members: 8, leads: 1, tickets: 124, avgResponse: '3.2m', csat: 4.3, status: 'active' },
{ id: 'T-02', name: 'Tier 2 Support', members: 5, leads: 1, tickets: 67, avgResponse: '8.5m', csat: 4.6, status: 'active' },
{ id: 'T-03', name: 'Merchant Support', members: 4, leads: 1, tickets: 45, avgResponse: '5.1m', csat: 4.4, status: 'active' },
{ id: 'T-04', name: 'Technical Support', members: 3, leads: 1, tickets: 32, avgResponse: '12.3m', csat: 4.1, status: 'active' },
{ id: 'T-05', name: 'Night Shift', members: 4, leads: 1, tickets: 56, avgResponse: '6.8m', csat: 4.0, status: 'active' },
];
const automationRules = [
{ id: 'AR-01', name: 'Auto-assign VIP Customers', trigger: 'Ticket created by VIP', action: 'Assign to Tier 2', status: 'active', executions: 145 },
{ id: 'AR-02', name: 'Priority escalation', trigger: 'Ticket unassigned > 2h', action: 'Escalate to Team Lead', status: 'active', executions: 78 },
{ id: 'AR-03', name: 'Urgent keyword routing', trigger: 'Subject contains "urgent"', action: 'Set priority to High', status: 'active', executions: 234 },
{ id: 'AR-04', name: 'SLA breach notification', trigger: 'SLA at 80% time', action: 'Notify team lead', status: 'inactive', executions: 0 },
{ id: 'AR-05', name: 'Auto-close resolved tickets', trigger: 'Resolved > 24h', action: 'Close ticket', status: 'active', executions: 567 },
];
export default function AdminSupport() {
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Admin Support</Typography>
<Typography variant="body2" color="text.secondary">Teams, automation &amp; settings</Typography>
</Box>
<Box sx={{ display: 'flex', gap: 1 }}>
<Button variant="contained" startIcon={<Add />}>New Team</Button>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
</Box>
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'Support Teams', value: supportTeams.length, color: 'primary.main', icon: <Group /> },
{ label: 'Total Agents', value: supportTeams.reduce((a, t) => a + t.members, 0), color: 'success.main', icon: <Person /> },
{ label: 'Auto Rules', value: `${automationRules.filter(r => r.status === 'active').length} active`, color: 'info.main', icon: <AutoFixHigh /> },
{ label: 'Tickets Today', value: supportTeams.reduce((a, t) => a + t.tickets, 0), color: 'warning.main', icon: <Settings /> },
].map(s => (
<Grid size={{ xs: 6, sm: 3 }} key={s.label}>
<Card sx={{ '&:hover': { transform: 'translateY(-2px)', boxShadow: 3, transition: '0.3s' } }}>
<CardContent>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<Box>
<Typography variant="body2" color="text.secondary">{s.label}</Typography>
<Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
</Box>
<Avatar sx={{ bgcolor: `${s.color}15`, color: s.color }}>{s.icon}</Avatar>
</Box>
</CardContent>
</Card>
</Grid>
))}
</Grid>
<Grid container spacing={3}>
<Grid size={{ xs: 12, md: 7 }}>
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2 }}>Support Teams</Typography>
<TableContainer>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Team</TableCell>
<TableCell align="right">Members</TableCell>
<TableCell align="right">Tickets</TableCell>
<TableCell align="right">Avg Response</TableCell>
<TableCell align="right">CSAT</TableCell>
<TableCell>Status</TableCell>
<TableCell align="right">Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
{supportTeams.map((t) => (
<TableRow key={t.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{t.name}</Typography></TableCell>
<TableCell align="right">{t.members}</TableCell>
<TableCell align="right">{t.tickets}</TableCell>
<TableCell align="right">{t.avgResponse}</TableCell>
<TableCell align="right"><Chip label={t.csat.toFixed(1)} color={t.csat >= 4.3 ? 'success' : 'warning'} size="small" /></TableCell>
<TableCell><Chip label={t.status} color="success" size="small" /></TableCell>
<TableCell align="right"><IconButton size="small"><Edit /></IconButton></TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</Paper>
</Grid>
<Grid size={{ xs: 12, md: 5 }}>
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2 }}>Automation Rules</Typography>
<TableContainer>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Rule</TableCell>
<TableCell>Active</TableCell>
<TableCell align="right">Executions</TableCell>
</TableRow>
</TableHead>
<TableBody>
{automationRules.map((r) => (
<TableRow key={r.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell>
<Typography variant="body2" sx={{ fontWeight: 600 }}>{r.name}</Typography>
<Typography variant="caption" color="text.secondary">{r.trigger} &rarr; {r.action}</Typography>
</TableCell>
<TableCell><Switch checked={r.status === 'active'} size="small" /></TableCell>
<TableCell align="right">{r.executions}</TableCell>
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

