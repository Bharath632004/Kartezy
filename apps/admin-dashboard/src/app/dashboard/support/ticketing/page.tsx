"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, Add, Edit, FilterList, ConfirmationNumber,
CheckCircle, ErrorOutlined, AccessTime, Assignment,
} from '@mui/icons-material';
const priorityColors: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
critical: 'error', urgent: 'error', high: 'warning', medium: 'info', low: 'success',
};
const statusColors: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
open: 'warning', in_progress: 'primary', pending: 'info', resolved: 'success', closed: 'error',
};
const sampleTickets = [
{ id: 'TKT-1001', subject: 'Payment not processed', type: 'billing', priority: 'urgent', status: 'open', requester: 'Rajesh K.', channel: 'Phone', agent: 'Unassigned', created: '2026-07-17', sla: 'Overdue' },
{ id: 'TKT-1002', subject: 'Delivery delayed by 2 hours', type: 'delivery', priority: 'high', status: 'in_progress', requester: 'Priya S.', channel: 'Chat', agent: 'Sarah J.', created: '2026-07-17', sla: '1h left' },
{ id: 'TKT-1003', subject: 'Wrong item received', type: 'order', priority: 'high', status: 'open', requester: 'Amit P.', channel: 'Email', agent: 'Unassigned', created: '2026-07-16', sla: '2h left' },
{ id: 'TKT-1004', subject: 'Merchant account suspension', type: 'account', priority: 'critical', status: 'in_progress', requester: 'FreshMart', channel: 'Portal', agent: 'Mike C.', created: '2026-07-16', sla: 'Breached' },
{ id: 'TKT-1005', subject: 'Refund not processed', type: 'billing', priority: 'medium', status: 'pending', requester: 'Sneha M.', channel: 'WhatsApp', agent: 'Emily D.', created: '2026-07-15', sla: '4h left' },
{ id: 'TKT-1006', subject: 'Driver app crash', type: 'technical', priority: 'high', status: 'resolved', requester: 'Driver Kumar', channel: 'Phone', agent: 'Alex K.', created: '2026-07-15', sla: 'Met' },
{ id: 'TKT-1007', subject: 'Feature request: bulk upload', type: 'feature', priority: 'low', status: 'open', requester: 'BigBazaar', channel: 'Email', agent: 'Unassigned', created: '2026-07-14', sla: '12h left' },
{ id: 'TKT-1008', subject: 'Invoice discrepancy', type: 'billing', priority: 'medium', status: 'in_progress', requester: 'Lakshmi Tiffins', channel: 'Portal', agent: 'Lisa P.', created: '2026-07-14', sla: '3h left' },
];
export default function TicketingSystem() {
const [search, setSearch] = useState('');
const [createDialog, setCreateDialog] = useState(false);
const [detailDialog, setDetailDialog] = useState<{ open: boolean; ticket: any | null }>({ open: false, ticket: null });
const filtered = sampleTickets.filter(t =>
t.subject.toLowerCase().includes(search.toLowerCase()) ||
t.id.toLowerCase().includes(search.toLowerCase()) ||
t.requester.toLowerCase().includes(search.toLowerCase())
);
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Ticketing System</Typography>
<Typography variant="body2" color="text.secondary">{sampleTickets.length} tickets &middot; {sampleTickets.filter(t => t.status === 'open').length} open</Typography>
</Box>
<Box sx={{ display: 'flex', gap: 1 }}>
<Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialog(true)}>New Ticket</Button>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
</Box>
<TextField fullWidth size="small" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'Open', value: sampleTickets.filter(t => t.status === 'open').length, color: 'warning.main' },
{ label: 'In Progress', value: sampleTickets.filter(t => t.status === 'in_progress').length, color: 'primary.main' },
{ label: 'Urgent/Critical', value: sampleTickets.filter(t => t.priority === 'urgent' || t.priority === 'critical').length, color: 'error.main' },
{ label: 'Resolved Today', value: sampleTickets.filter(t => t.status === 'resolved').length, color: 'success.main' },
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
<TableCell>Ticket</TableCell>
<TableCell>Subject</TableCell>
<TableCell>Type</TableCell>
<TableCell>Priority</TableCell>
<TableCell>Status</TableCell>
<TableCell>Requester</TableCell>
<TableCell>Channel</TableCell>
<TableCell>Agent</TableCell>
<TableCell align="right">SLA</TableCell>
<TableCell align="right">Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((t) => (
<TableRow key={t.id} sx={{ '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }}
onClick={() => setDetailDialog({ open: true, ticket: t })}>
<TableCell><Chip label={t.id} size="small" variant="outlined" /></TableCell>
<TableCell><Typography noWrap sx={{ maxWidth: 200, fontWeight: 600 }}>{t.subject}</Typography></TableCell>
<TableCell>{t.type}</TableCell>
<TableCell><Chip label={t.priority} color={priorityColors[t.priority] ?? 'default'} size="small" /></TableCell>
<TableCell><Chip label={t.status.replace('_', ' ')} color={statusColors[t.status] ?? 'default'} size="small" /></TableCell>
<TableCell>{t.requester}</TableCell>
<TableCell>{t.channel}</TableCell>
<TableCell>{t.agent}</TableCell>
<TableCell align="right">
<Chip label={t.sla} color={t.sla === 'Breached' || t.sla === 'Overdue' ? 'error' : t.sla === 'Met' ? 'success' : 'warning'} size="small" variant="outlined" />
</TableCell>
<TableCell align="right">
<IconButton size="small" onClick={(e) => { e.stopPropagation(); setDetailDialog({ open: true, ticket: t }); }}><Edit /></IconButton>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
<Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, ticket: null })} maxWidth="md" fullWidth>
<DialogTitle>{detailDialog.ticket?.id}: {detailDialog.ticket?.subject}</DialogTitle>
<DialogContent>
<Stack spacing={2} sx={{ mt: 1 }}>
<Grid container spacing={2}>
<Grid size={{ xs: 4 }}><Typography variant="caption">Priority</Typography><Chip label={detailDialog.ticket?.priority} color={priorityColors[detailDialog.ticket?.priority as string] ?? 'default'} size="small" /></Grid>
<Grid size={{ xs: 4 }}><Typography variant="caption">Status</Typography><Chip label={detailDialog.ticket?.status?.replace(/_/g, ' ')} color={statusColors[detailDialog.ticket?.status as string] ?? 'default'} size="small" /></Grid>
<Grid size={{ xs: 4 }}><Typography variant="caption">SLA</Typography><Typography>{detailDialog.ticket?.sla}</Typography></Grid>
<Grid size={{ xs: 6 }}><Typography variant="caption">Requester</Typography><Typography>{detailDialog.ticket?.requester}</Typography></Grid>
<Grid size={{ xs: 6 }}><Typography variant="caption">Channel</Typography><Typography>{detailDialog.ticket?.channel}</Typography></Grid>
<Grid size={{ xs: 12 }}><Typography variant="caption">Description</Typography><Typography variant="body2">{detailDialog.ticket?.subject} - Detailed issue description would appear here with full context from the customer.</Typography></Grid>
</Grid>
</Stack>
</DialogContent>
<DialogActions>
<Button startIcon={<Assignment />}>Assign to Me</Button>
<Button variant="contained" color="success" startIcon={<CheckCircle />}>Resolve</Button>
<Button onClick={() => setDetailDialog({ open: false, ticket: null })}>Close</Button>
</DialogActions>
</Dialog>
</Container>
);
}

