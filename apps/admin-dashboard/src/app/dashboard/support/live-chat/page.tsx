"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, Forum, Send, AttachFile, MoreVert, Assignment,
CheckCircle, AccessTime, Person,
} from '@mui/icons-material';
const activeConversations = [
{ id: 'CH-001', customer: 'Rajesh K.', type: 'customer', message: 'My order hasn\'t arrived yet', agent: 'Sarah J.', status: 'active', time: '2m', unread: 2, sentiment: 'negative' },
{ id: 'CH-002', customer: 'FreshMart', type: 'merchant', message: 'Need help with bulk upload', agent: 'Mike C.', status: 'active', time: '5m', unread: 1, sentiment: 'neutral' },
{ id: 'CH-003', customer: 'Driver Suresh', type: 'driver', message: 'GPS not working', agent: 'Unassigned', status: 'waiting', time: '8m', unread: 3, sentiment: 'negative' },
{ id: 'CH-004', customer: 'Priya S.', type: 'customer', message: 'Thanks for the help!', agent: 'Emily D.', status: 'active', time: '1m', unread: 0, sentiment: 'positive' },
{ id: 'CH-005', customer: 'TechGadgets', type: 'merchant', message: 'Payment settlement delay', agent: 'Alex K.', status: 'active', time: '12m', unread: 1, sentiment: 'negative' },
{ id: 'CH-006', customer: 'Ananya G.', type: 'customer', message: 'Can I change delivery address?', agent: 'Lisa P.', status: 'waiting', time: '15m', unread: 4, sentiment: 'neutral' },
];
export default function LiveChat() {
const [search, setSearch] = useState('');
const [selectedChat, setSelectedChat] = useState<string | null>(null);
const [message, setMessage] = useState('');
const filtered = activeConversations.filter(c =>
c.customer.toLowerCase().includes(search.toLowerCase()) ||
c.agent.toLowerCase().includes(search.toLowerCase())
);
const selected = activeConversations.find(c => c.id === selectedChat);
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Live Chat</Typography>
<Typography variant="body2" color="text.secondary">{activeConversations.length} active conversations</Typography>
</Box>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'Active', value: activeConversations.filter(c => c.status === 'active').length, color: 'success.main' },
{ label: 'Waiting', value: activeConversations.filter(c => c.status === 'waiting').length, color: 'warning.main' },
{ label: 'Unassigned', value: activeConversations.filter(c => c.agent === 'Unassigned').length, color: 'error.main' },
{ label: 'Avg Wait Time', value: '4.2 min', color: 'info.main' },
].map(s => (
<Grid size={{ xs: 6, sm: 3 }} key={s.label}>
<Card sx={{ borderLeft: 4, borderColor: s.color }}><CardContent>
<Typography variant="body2" color="text.secondary">{s.label}</Typography>
<Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
</CardContent></Card>
</Grid>
))}
</Grid>
<Grid container spacing={2}>
<Grid size={{ xs: 12, md: 5 }}>
<TextField fullWidth size="small" placeholder="Search conversations..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 2 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<Paper sx={{ maxHeight: 500, overflow: 'auto' }}>
{filtered.map((c) => (
<Box key={c.id} sx={{
p: 2, borderBottom: '1px solid', borderColor: 'divider', cursor: 'pointer',
bgcolor: selectedChat === c.id ? 'action.selected' : 'transparent',
'&:hover': { bgcolor: 'action.hover' },
}} onClick={() => setSelectedChat(c.id)}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
<Badge color={c.status === 'active' ? 'success' : 'warning'} variant="dot" overlap="circular">
<Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>{c.customer[0]}</Avatar>
</Badge>
<Box>
<Typography variant="body2" sx={{ fontWeight: 600 }}>{c.customer}</Typography>
<Typography variant="caption" color="text.secondary">{c.type} &middot; {c.time} ago</Typography>
</Box>
</Box>
{c.unread > 0 && <Chip label={c.unread} size="small" color="primary" />}
</Box>
<Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', mt: 0.5, ml: 5 }}>
{c.message}
</Typography>
</Box>
))}
</Paper>
</Grid>
<Grid size={{ xs: 12, md: 7 }}>
{selected ? (
<Paper sx={{ height: 560, display: 'flex', flexDirection: 'column' }}>
<Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
<Avatar>{selected.customer[0]}</Avatar>
<Box>
<Typography variant="body2" sx={{ fontWeight: 600 }}>{selected.customer}</Typography>
<Typography variant="caption" color="text.secondary">{selected.type} &middot; {selected.agent}</Typography>
</Box>
</Box>
<Box sx={{ display: 'flex', gap: 0.5 }}>
<IconButton size="small"><Assignment /></IconButton>
<IconButton size="small"><MoreVert /></IconButton>
</Box>
</Box>
<Box sx={{ flexGrow: 1, p: 2, overflow: 'auto', bgcolor: 'grey.50' }}>
<Stack spacing={1.5}>
<Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-start' }}>
<Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>{selected.customer[0]}</Avatar>
<Paper sx={{ p: 1.5, bgcolor: 'white', maxWidth: '80%' }}>
<Typography variant="body2">{selected.message}</Typography>
<Typography variant="caption" color="text.secondary">{selected.time} ago</Typography>
</Paper>
</Box>
<Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
<Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main' }}>A</Avatar>
<Paper sx={{ p: 1.5, bgcolor: 'primary.main', color: 'white', maxWidth: '80%' }}>
<Typography variant="body2">I'll look into this right away. Let me check the order status.</Typography>
<Typography variant="caption" sx={{ opacity: 0.8 }}>1m ago</Typography>
</Paper>
</Box>
<Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-start' }}>
<Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>{selected.customer[0]}</Avatar>
<Paper sx={{ p: 1.5, bgcolor: 'white', maxWidth: '80%' }}>
<Typography variant="body2">Okay, please check quickly. It's been delayed by 30 minutes.</Typography>
<Typography variant="caption" color="text.secondary">30s ago</Typography>
</Paper>
</Box>
</Stack>
</Box>
<Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
<TextField fullWidth size="small" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
<IconButton><AttachFile /></IconButton>
<Button variant="contained" endIcon={<Send />} disabled={!message}>Send</Button>
</Box>
</Paper>
) : (
<Paper sx={{ height: 560, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
<Box sx={{ textAlign: 'center' }}>
<Forum sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
<Typography color="text.secondary">Select a conversation to start chatting</Typography>
</Box>
</Paper>
)}
</Grid>
</Grid>
</Container>
);
}

