"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import { Search, RefreshOutlined, Storefront, CheckCircle, ErrorOutlined, WarningAmber, Star } from '@mui/icons-material';
const merchantIssues = [
{ id: 'M-001', name: 'FreshMart', email: 'freshmart@email.com', tickets: 8, openTickets: 2, status: 'active', tier: 'premium', revenue: '₹45,000', fulfillment: 97, lastActive: '5m ago' },
{ id: 'M-002', name: 'Punjab Dhaba', email: 'pdhaba@email.com', tickets: 3, openTickets: 0, status: 'active', tier: 'standard', revenue: '₹12,000', fulfillment: 92, lastActive: '1h ago' },
{ id: 'M-003', name: 'TechGadgets', email: 'tech@email.com', tickets: 12, openTickets: 4, status: 'suspended', tier: 'premium', revenue: '₹78,000', fulfillment: 68, lastActive: '1d ago' },
{ id: 'M-004', name: 'Organic Basket', email: 'organic@email.com', tickets: 2, openTickets: 1, status: 'active', tier: 'basic', revenue: '₹8,500', fulfillment: 85, lastActive: '2h ago' },
{ id: 'M-005', name: 'BakeHouse', email: 'bake@email.com', tickets: 5, openTickets: 1, status: 'active', tier: 'standard', revenue: '₹22,000', fulfillment: 94, lastActive: '30m ago' },
{ id: 'M-006', name: 'FashionHub', email: 'fashion@email.com', tickets: 7, openTickets: 3, status: 'active', tier: 'premium', revenue: '₹56,000', fulfillment: 78, lastActive: '15m ago' },
];
export default function MerchantSupport() {
const [search, setSearch] = useState('');
const filtered = merchantIssues.filter(m =>
m.name.toLowerCase().includes(search.toLowerCase()) ||
m.email.toLowerCase().includes(search.toLowerCase())
);
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Merchant Support</Typography>
<Typography variant="body2" color="text.secondary">{merchantIssues.length} merchants tracked</Typography>
</Box>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
<TextField fullWidth size="small" placeholder="Search merchants..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'Active Merchants', value: merchantIssues.filter(m => m.status === 'active').length, color: 'success.main' },
{ label: 'Open Issues', value: merchantIssues.reduce((a, m) => a + m.openTickets, 0), color: 'warning.main' },
{ label: 'Suspended', value: merchantIssues.filter(m => m.status === 'suspended').length, color: 'error.main' },
{ label: 'Premium Tier', value: merchantIssues.filter(m => m.tier === 'premium').length, color: 'secondary.main' },
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
<TableCell>Merchant</TableCell>
<TableCell>Status</TableCell>
<TableCell>Tier</TableCell>
<TableCell align="right">Tickets</TableCell>
<TableCell align="right">Open</TableCell>
<TableCell align="right">Revenue</TableCell>
<TableCell align="right">Fulfillment</TableCell>
<TableCell>Last Active</TableCell>
<TableCell align="right">Priority</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((m) => (
<TableRow key={m.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{m.name}</Typography></TableCell>
<TableCell><Chip label={m.status} color={m.status === 'active' ? 'success' : m.status === 'suspended' ? 'error' : 'warning'} size="small" /></TableCell>
<TableCell><Chip label={m.tier} size="small" variant="outlined" color={m.tier === 'premium' ? 'secondary' : 'default'} /></TableCell>
<TableCell align="right">{m.tickets}</TableCell>
<TableCell align="right"><Chip label={m.openTickets} color={m.openTickets > 2 ? 'error' : m.openTickets > 0 ? 'warning' : 'success'} size="small" /></TableCell>
<TableCell align="right">{m.revenue}</TableCell>
<TableCell align="right">
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
<LinearProgress variant="determinate" value={m.fulfillment} sx={{ width: 50, height: 6, borderRadius: 3 }} color={m.fulfillment >= 90 ? 'success' : m.fulfillment >= 80 ? 'warning' : 'error'} />
<Typography variant="caption">{m.fulfillment}%</Typography>
</Box>
</TableCell>
<TableCell>{m.lastActive}</TableCell>
<TableCell align="right">
<Chip label={m.openTickets >= 3 ? 'High' : m.openTickets >= 1 ? 'Med' : 'Low'} color={m.openTickets >= 3 ? 'error' : m.openTickets >= 1 ? 'warning' : 'success'} size="small" />
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</Container>
);
}

