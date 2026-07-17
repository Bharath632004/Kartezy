"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, Add, Edit, Timer, CheckCircle, WarningAmber, ErrorOutlined, Speed,
} from '@mui/icons-material';
const slaPolicies = [
{ id: 'SLA-001', name: 'Critical Ticket Response', type: 'response', target: 15, unit: 'min', compliance: 97.2, breaches: 3, priority: 'critical', status: 'active', scope: 'All Tickets' },
{ id: 'SLA-002', name: 'High Priority Resolution', type: 'resolution', target: 4, unit: 'hours', compliance: 93.5, breaches: 7, priority: 'high', status: 'active', scope: 'All Tickets' },
{ id: 'SLA-003', name: 'Standard Ticket Response', type: 'response', target: 1, unit: 'hour', compliance: 91.8, breaches: 12, priority: 'medium', status: 'active', scope: 'All Tickets' },
{ id: 'SLA-004', name: 'VIP Customer Response', type: 'response', target: 5, unit: 'min', compliance: 99.1, breaches: 1, priority: 'critical', status: 'active', scope: 'VIP Customers' },
{ id: 'SLA-005', name: 'Merchant Issue Resolution', type: 'resolution', target: 8, unit: 'hours', compliance: 88.4, breaches: 15, priority: 'high', status: 'active', scope: 'Merchant Tickets' },
{ id: 'SLA-006', name: 'Delivery Issue Response', type: 'response', target: 30, unit: 'min', compliance: 95.6, breaches: 5, priority: 'high', status: 'active', scope: 'Delivery Tickets' },
{ id: 'SLA-007', name: 'Bulk Order SLA', type: 'resolution', target: 24, unit: 'hours', compliance: 85.2, breaches: 8, priority: 'medium', status: 'inactive', scope: 'Bulk Orders' },
];
export default function SLAPage() {
const [search, setSearch] = useState('');
const filtered = slaPolicies.filter(s =>
s.name.toLowerCase().includes(search.toLowerCase()) ||
s.priority.toLowerCase().includes(search.toLowerCase())
);
const overallCompliance = slaPolicies.filter(s => s.status === 'active').reduce((a, s) => a + s.compliance, 0) /
Math.max(slaPolicies.filter(s => s.status === 'active').length, 1);
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>SLA Policies</Typography>
<Typography variant="body2" color="text.secondary">{slaPolicies.length} policies defined</Typography>
</Box>
<Box sx={{ display: 'flex', gap: 1 }}>
<Button variant="contained" startIcon={<Add />}>New SLA</Button>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
</Box>
<TextField fullWidth size="small" placeholder="Search SLA policies..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<Grid container spacing={2} sx={{ mb: 3 }}>
<Grid size={{ xs: 12, sm: 3 }}>
<Card sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
<CardContent>
<Typography variant="body2" color="text.secondary">Overall Compliance</Typography>
<Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>{overallCompliance.toFixed(1)}%</Typography>
<LinearProgress variant="determinate" value={overallCompliance} sx={{ mt: 1, height: 8, borderRadius: 4 }}
color={overallCompliance >= 95 ? 'success' : overallCompliance >= 90 ? 'warning' : 'error'} />
</CardContent>
</Card>
</Grid>
<Grid size={{ xs: 6, sm: 3 }}>
<Card sx={{ borderLeft: 4, borderColor: 'success.main', height: '100%' }}>
<CardContent>
<Typography variant="body2" color="text.secondary">Active SLAs</Typography>
<Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>{slaPolicies.filter(s => s.status === 'active').length}</Typography>
</CardContent>
</Card>
</Grid>
<Grid size={{ xs: 6, sm: 3 }}>
<Card sx={{ borderLeft: 4, borderColor: 'error.main', height: '100%' }}>
<CardContent>
<Typography variant="body2" color="text.secondary">Total Breaches</Typography>
<Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>{slaPolicies.reduce((a, s) => a + s.breaches, 0)}</Typography>
</CardContent>
</Card>
</Grid>
<Grid size={{ xs: 6, sm: 3 }}>
<Card sx={{ borderLeft: 4, borderColor: 'warning.main', height: '100%' }}>
<CardContent>
<Typography variant="body2" color="text.secondary">Below 90%</Typography>
<Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>{slaPolicies.filter(s => s.compliance < 90).length}</Typography>
</CardContent>
</Card>
</Grid>
</Grid>
<TableContainer component={Paper}>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>SLA Name</TableCell>
<TableCell>Type</TableCell>
<TableCell>Target</TableCell>
<TableCell>Priority</TableCell>
<TableCell>Scope</TableCell>
<TableCell align="right">Compliance</TableCell>
<TableCell align="right">Breaches</TableCell>
<TableCell>Status</TableCell>
<TableCell align="right">Toggle</TableCell>
<TableCell align="right">Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((sla) => (
<TableRow key={sla.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{sla.name}</Typography></TableCell>
<TableCell><Chip label={sla.type} size="small" variant="outlined" /></TableCell>
<TableCell>{sla.target} {sla.unit}</TableCell>
<TableCell><Chip label={sla.priority} color={sla.priority === 'critical' ? 'error' : sla.priority === 'high' ? 'warning' : 'info'} size="small" /></TableCell>
<TableCell>{sla.scope}</TableCell>
<TableCell align="right">
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
<LinearProgress variant="determinate" value={sla.compliance} sx={{ width: 60, height: 8, borderRadius: 4 }}
color={sla.compliance >= 95 ? 'success' : sla.compliance >= 90 ? 'warning' : 'error'} />
<Typography variant="caption">{sla.compliance}%</Typography>
</Box>
</TableCell>
<TableCell align="right"><Chip label={sla.breaches} color={sla.breaches > 10 ? 'error' : sla.breaches > 5 ? 'warning' : 'success'} size="small" /></TableCell>
<TableCell><Chip label={sla.status} color={sla.status === 'active' ? 'success' : 'default'} size="small" /></TableCell>
<TableCell align="right"><Switch checked={sla.status === 'active'} size="small" /></TableCell>
<TableCell align="right"><IconButton size="small"><Edit /></IconButton></TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</Container>
);
}

