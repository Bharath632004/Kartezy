"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, Add, Edit, Email, Send, Visibility, Delete, ContentCopy,
} from '@mui/icons-material';
const emailTemplates = [
{ id: 'EM-001', name: 'Welcome Email', subject: 'Welcome to Kartezy!', category: 'Onboarding', opens: 89, clicks: 45, status: 'active', lastUsed: '1h ago' },
{ id: 'EM-002', name: 'Order Confirmation', subject: 'Your order {id} confirmed', category: 'Orders', opens: 97, clicks: 12, status: 'active', lastUsed: '5m ago' },
{ id: 'EM-003', name: 'Delivery Delay Notice', subject: 'Update on your order {id}', category: 'Delivery', opens: 95, clicks: 23, status: 'active', lastUsed: '30m ago' },
{ id: 'EM-004', name: 'Refund Processed', subject: 'Refund for order {id}', category: 'Billing', opens: 92, clicks: 8, status: 'active', lastUsed: '2h ago' },
{ id: 'EM-005', name: 'Support Ticket Confirmation', subject: 'Ticket {ticket} received', category: 'Support', opens: 88, clicks: 15, status: 'active', lastUsed: '10m ago' },
{ id: 'EM-006', name: 'CSAT Survey', subject: 'How was your experience?', category: 'Feedback', opens: 45, clicks: 28, status: 'active', lastUsed: '1d ago' },
{ id: 'EM-007', name: 'NPS Survey', subject: 'Help us improve!', category: 'Feedback', opens: 38, clicks: 22, status: 'draft', lastUsed: 'Never' },
{ id: 'EM-008', name: 'Merchant Monthly Report', subject: 'Your monthly performance', category: 'Merchant', opens: 76, clicks: 52, status: 'active', lastUsed: '3d ago' },
];
const emailLogs = [
{ id: 'LOG-001', to: 'rajesh@email.com', template: 'Order Confirmation', status: 'delivered', sentAt: '2m ago', opens: 1 },
{ id: 'LOG-002', to: 'freshmart@email.com', template: 'Support Ticket', status: 'delivered', sentAt: '5m ago', opens: 0 },
{ id: 'LOG-003', to: 'priya@email.com', template: 'Delivery Delay', status: 'delivered', sentAt: '10m ago', opens: 2 },
{ id: 'LOG-004', to: 'tech@email.com', template: 'Refund Processed', status: 'failed', sentAt: '15m ago', opens: 0 },
{ id: 'LOG-005', to: 'sneha@email.com', template: 'CSAT Survey', status: 'delivered', sentAt: '1h ago', opens: 0 },
];
export default function EmailSupport() {
const [search, setSearch] = useState('');
const filtered = emailTemplates.filter(t =>
t.name.toLowerCase().includes(search.toLowerCase()) ||
t.category.toLowerCase().includes(search.toLowerCase())
);
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Email Support</Typography>
<Typography variant="body2" color="text.secondary">{emailTemplates.length} templates &middot; {emailLogs.length} recent logs</Typography>
</Box>
<Box sx={{ display: 'flex', gap: 1 }}>
<Button variant="contained" startIcon={<Add />}>New Template</Button>
<Button variant="outlined" startIcon={<Send />}>Test Email</Button>
</Box>
</Box>
<TextField fullWidth size="small" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'Templates', value: emailTemplates.length, color: 'primary.main' },
{ label: 'Active', value: emailTemplates.filter(t => t.status === 'active').length, color: 'success.main' },
{ label: 'Avg Open Rate', value: '77%', color: 'info.main' },
{ label: 'Avg Click Rate', value: '25%', color: 'warning.main' },
].map(s => (
<Grid size={{ xs: 6, sm: 3 }} key={s.label}>
<Card sx={{ borderLeft: 4, borderColor: s.color }}><CardContent>
<Typography variant="body2" color="text.secondary">{s.label}</Typography>
<Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
</CardContent></Card>
</Grid>
))}
</Grid>
<Typography variant="h6" sx={{ mb: 2 }}>Email Templates</Typography>
<TableContainer component={Paper} sx={{ mb: 3 }}>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Template</TableCell>
<TableCell>Subject</TableCell>
<TableCell>Category</TableCell>
<TableCell align="right">Open Rate</TableCell>
<TableCell align="right">Click Rate</TableCell>
<TableCell>Status</TableCell>
<TableCell>Last Used</TableCell>
<TableCell align="right">Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((t) => (
<TableRow key={t.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{t.name}</Typography></TableCell>
<TableCell><Typography variant="caption">{t.subject}</Typography></TableCell>
<TableCell><Chip label={t.category} size="small" variant="outlined" /></TableCell>
<TableCell align="right">{t.opens}%</TableCell>
<TableCell align="right">{t.clicks}%</TableCell>
<TableCell><Chip label={t.status} color={t.status === 'active' ? 'success' : 'warning'} size="small" /></TableCell>
<TableCell>{t.lastUsed}</TableCell>
<TableCell align="right">
<IconButton size="small"><Edit /></IconButton>
<IconButton size="small"><ContentCopy /></IconButton>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
<Typography variant="h6" sx={{ mb: 2 }}>Recent Email Logs</Typography>
<TableContainer component={Paper}>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>To</TableCell>
<TableCell>Template</TableCell>
<TableCell>Status</TableCell>
<TableCell align="right">Opens</TableCell>
<TableCell>Sent At</TableCell>
</TableRow>
</TableHead>
<TableBody>
{emailLogs.map((log) => (
<TableRow key={log.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell>{log.to}</TableCell>
<TableCell>{log.template}</TableCell>
<TableCell><Chip label={log.status} color={log.status === 'delivered' ? 'success' : 'error'} size="small" /></TableCell>
<TableCell align="right">{log.opens}</TableCell>
<TableCell>{log.sentAt}</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</Container>
);
}

