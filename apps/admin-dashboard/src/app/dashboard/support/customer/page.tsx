"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import { Search, RefreshOutlined, People, Chat, Feedback, WarningAmber } from '@mui/icons-material';
const customerIssues = [
{ id: 'C-001', name: 'Rajesh Kumar', email: 'rajesh@email.com', tickets: 3, openTickets: 1, lastContact: '2h ago', sentiment: 'negative', segment: 'VIP', priority: 'high' },
{ id: 'C-002', name: 'Priya Sharma', email: 'priya@email.com', tickets: 1, openTickets: 0, lastContact: '1d ago', sentiment: 'positive', segment: 'Regular', priority: 'low' },
{ id: 'C-003', name: 'Amit Patel', email: 'amit@email.com', tickets: 5, openTickets: 2, lastContact: '30m ago', sentiment: 'negative', segment: 'Premium', priority: 'urgent' },
{ id: 'C-004', name: 'Sneha Reddy', email: 'sneha@email.com', tickets: 2, openTickets: 1, lastContact: '4h ago', sentiment: 'neutral', segment: 'Regular', priority: 'medium' },
{ id: 'C-005', name: 'Vikram Singh', email: 'vikram@email.com', tickets: 0, openTickets: 0, lastContact: '5d ago', sentiment: 'positive', segment: 'New', priority: 'low' },
{ id: 'C-006', name: 'Ananya Gupta', email: 'ananya@email.com', tickets: 8, openTickets: 3, lastContact: '15m ago', sentiment: 'negative', segment: 'VIP', priority: 'critical' },
{ id: 'C-007', name: 'Rohit Joshi', email: 'rohit@email.com', tickets: 1, openTickets: 0, lastContact: '3d ago', sentiment: 'positive', segment: 'Regular', priority: 'low' },
{ id: 'C-008', name: 'Neha Kapoor', email: 'neha@email.com', tickets: 4, openTickets: 1, lastContact: '1h ago', sentiment: 'neutral', segment: 'Premium', priority: 'high' },
];
const sentimentColors: Record<string, 'error' | 'warning' | 'success'> = {
negative: 'error', neutral: 'warning', positive: 'success',
};
export default function CustomerSupport() {
const [search, setSearch] = useState('');
const filtered = customerIssues.filter(c =>
c.name.toLowerCase().includes(search.toLowerCase()) ||
c.email.toLowerCase().includes(search.toLowerCase())
);
const atRisk = customerIssues.filter(c => c.sentiment === 'negative').length;
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Customer Support</Typography>
<Typography variant="body2" color="text.secondary">{customerIssues.length} active customers &middot; {atRisk} at risk</Typography>
</Box>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
{atRisk > 0 && (
<Paper sx={{ p: 2, mb: 3, bgcolor: 'error.main', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
<WarningAmber />
<Typography>{atRisk} customers with negative sentiment need immediate attention</Typography>
</Paper>
)}
<TextField fullWidth size="small" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'Total Customers', value: customerIssues.length, color: 'info.main' },
{ label: 'Open Issues', value: customerIssues.reduce((a, c) => a + c.openTickets, 0), color: 'warning.main' },
{ label: 'VIP Customers', value: customerIssues.filter(c => c.segment === 'VIP').length, color: 'secondary.main' },
{ label: 'At Risk', value: atRisk, color: 'error.main' },
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
<TableCell>Customer</TableCell>
<TableCell>Email</TableCell>
<TableCell>Segment</TableCell>
<TableCell>Total Tickets</TableCell>
<TableCell>Open</TableCell>
<TableCell>Sentiment</TableCell>
<TableCell>Priority</TableCell>
<TableCell>Last Contact</TableCell>
<TableCell align="right">Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((c) => (
<TableRow key={c.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{c.name}</Typography></TableCell>
<TableCell>{c.email}</TableCell>
<TableCell><Chip label={c.segment} color={c.segment === 'VIP' ? 'secondary' : c.segment === 'Premium' ? 'primary' : 'default'} size="small" variant="outlined" /></TableCell>
<TableCell>{c.tickets}</TableCell>
<TableCell><Chip label={c.openTickets} color={c.openTickets > 0 ? 'warning' : 'success'} size="small" /></TableCell>
<TableCell><Chip label={c.sentiment} color={sentimentColors[c.sentiment] ?? 'default'} size="small" /></TableCell>
<TableCell><Chip label={c.priority} color={c.priority === 'critical' || c.priority === 'urgent' ? 'error' : c.priority === 'high' ? 'warning' : 'success'} size="small" /></TableCell>
<TableCell>{c.lastContact}</TableCell>
<TableCell align="right">
<IconButton size="small"><Chat /></IconButton>
<IconButton size="small"><Feedback /></IconButton>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</Container>
);
}

