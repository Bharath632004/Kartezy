"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, WarningAmber, ArrowUpward, CheckCircle, AccessTime,
Person, Assignment,
} from '@mui/icons-material';
const escalations = [
{ id: 'ESC-001', reason: 'Order not delivered for 3 days', level: 2, priority: 'urgent', status: 'investigating', customer: 'Rajesh K.', assignedTo: 'Sarah J.', raisedBy: 'Agent Emily', created: '2h ago', sla: 'Breached' },
{ id: 'ESC-002', reason: 'Multiple failed payment attempts', level: 1, priority: 'high', status: 'acknowledged', customer: 'FreshMart', assignedTo: 'Mike C.', raisedBy: 'System', created: '4h ago', sla: '1h left' },
{ id: 'ESC-003', reason: 'Merchant account hijacked', level: 3, priority: 'critical', status: 'open', customer: 'TechGadgets', assignedTo: 'Unassigned', raisedBy: 'Security', created: '30m ago', sla: 'Overdue' },
{ id: 'ESC-004', reason: 'Driver safety incident', level: 2, priority: 'urgent', status: 'resolved', customer: 'Driver Suresh', assignedTo: 'Alex K.', raisedBy: 'Fleet Ops', created: '1d ago', sla: 'Met' },
{ id: 'ESC-005', reason: 'Legal notice received', level: 3, priority: 'critical', status: 'investigating', customer: 'Legal', assignedTo: 'Legal Team', raisedBy: 'CEO Office', created: '1h ago', sla: '2h left' },
{ id: 'ESC-006', reason: 'Bulk order cancellation', level: 1, priority: 'medium', status: 'resolved', customer: 'BigBazaar', assignedTo: 'Lisa P.', raisedBy: 'Merchant Support', created: '2d ago', sla: 'Met' },
];
const levelColors: Record<number, 'info' | 'warning' | 'error'> = { 1: 'info', 2: 'warning', 3: 'error' };
const priorityColors: Record<string, 'error' | 'warning' | 'info'> = { critical: 'error', urgent: 'error', high: 'warning', medium: 'info', low: 'info' };
const statusColors: Record<string, 'warning' | 'info' | 'primary' | 'success'> = { open: 'warning', acknowledged: 'info', investigating: 'primary', resolved: 'success' };
export default function EscalationWorkflow() {
const [search, setSearch] = useState('');
const filtered = escalations.filter(e =>
e.reason.toLowerCase().includes(search.toLowerCase()) ||
e.customer.toLowerCase().includes(search.toLowerCase()) ||
e.id.toLowerCase().includes(search.toLowerCase())
);
const urgentCount = escalations.filter(e => e.priority === 'critical' || e.priority === 'urgent').length;
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Escalation Workflow</Typography>
<Typography variant="body2" color="text.secondary">{escalations.length} active escalations</Typography>
</Box>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
{urgentCount > 0 && (
<Alert severity="error" sx={{ mb: 2 }}>
<AlertTitle>{urgentCount} Urgent/Critical Escalations</AlertTitle>
</Alert>
)}
<TextField fullWidth size="small" placeholder="Search escalations..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'L1 Escalations', value: escalations.filter(e => e.level === 1).length, color: 'info.main' },
{ label: 'L2 Escalations', value: escalations.filter(e => e.level === 2).length, color: 'warning.main' },
{ label: 'L3 Escalations', value: escalations.filter(e => e.level === 3).length, color: 'error.main' },
{ label: 'Pending', value: escalations.filter(e => e.status !== 'resolved').length, color: 'warning.main' },
].map(s => (
<Grid size={{ xs: 6, sm: 3 }} key={s.label}>
<Card sx={{ borderLeft: 4, borderColor: s.color }}><CardContent>
<Typography variant="body2" color="text.secondary">{s.label}</Typography>
<Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
</CardContent></Card>
</Grid>
))}
</Grid>
<TableContainer component={Paper}>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Escalation</TableCell>
<TableCell>Reason</TableCell>
<TableCell>Level</TableCell>
<TableCell>Priority</TableCell>
<TableCell>Status</TableCell>
<TableCell>Customer</TableCell>
<TableCell>Assigned To</TableCell>
<TableCell>Raised By</TableCell>
<TableCell>SLA</TableCell>
<TableCell align="right">Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((e) => (
<TableRow key={e.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Chip label={e.id} size="small" variant="outlined" /></TableCell>
<TableCell><Typography noWrap sx={{ maxWidth: 200, fontWeight: 600 }}>{e.reason}</Typography></TableCell>
<TableCell><Chip label={`L${e.level}`} color={levelColors[e.level]} size="small" /></TableCell>
<TableCell><Chip label={e.priority} color={priorityColors[e.priority] ?? 'default'} size="small" /></TableCell>
<TableCell><Chip label={e.status} color={statusColors[e.status] ?? 'default'} size="small" /></TableCell>
<TableCell>{e.customer}</TableCell>
<TableCell>{e.assignedTo}</TableCell>
<TableCell>{e.raisedBy}</TableCell>
<TableCell>
<Chip label={e.sla} color={e.sla === 'Breached' || e.sla === 'Overdue' ? 'error' : e.sla === 'Met' ? 'success' : 'warning'} size="small" variant="outlined" />
</TableCell>
<TableCell align="right">
<IconButton size="small"><Assignment /></IconButton>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</Container>
);
}

