"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, Phone, PhoneInTalk, PhoneMissed, HeadsetMic,
AccessTime, Timeline, Settings, RecordVoiceOver,
} from '@mui/icons-material';
const callLogs = [
{ id: 'CALL-001', caller: 'Rajesh K.', number: '+91-9876543210', agent: 'Sarah J.', duration: '4:32', status: 'completed', type: 'inbound', time: '2m ago' },
{ id: 'CALL-002', caller: 'FreshMart Store', number: '+91-9876543211', agent: 'Mike C.', duration: '8:15', status: 'completed', type: 'inbound', time: '5m ago' },
{ id: 'CALL-003', caller: 'Unknown', number: '+91-9876543212', agent: 'IVR', duration: '1:05', status: 'missed', type: 'inbound', time: '8m ago' },
{ id: 'CALL-004', caller: 'Ananya G.', number: '+91-9876543213', agent: 'Emily D.', duration: '12:45', status: 'completed', type: 'inbound', time: '15m ago' },
{ id: 'CALL-005', caller: 'Support Team', number: '+91-9876543214', agent: 'Alex K.', duration: '3:20', status: 'completed', type: 'outbound', time: '20m ago' },
{ id: 'CALL-006', caller: 'Priya S.', number: '+91-9876543215', agent: 'Lisa P.', duration: '6:50', status: 'completed', type: 'inbound', time: '30m ago' },
{ id: 'CALL-007', caller: 'TechGadgets', number: '+91-9876543216', agent: '-', duration: '0:30', status: 'missed', type: 'inbound', time: '45m ago' },
{ id: 'CALL-008', caller: 'Rohit J.', number: '+91-9876543217', agent: 'Sarah J.', duration: '2:15', status: 'completed', type: 'inbound', time: '1h ago' },
];
const queueData = [
{ position: 1, caller: 'Driver Suresh', waitTime: '4:30', issue: 'Payment issue' },
{ position: 2, caller: 'BigBazaar', waitTime: '3:15', issue: 'Bulk order' },
{ position: 3, caller: 'Amit P.', waitTime: '1:45', issue: 'Delivery delay' },
];
export default function CallCenter() {
const [search, setSearch] = useState('');
const filtered = callLogs.filter(c =>
c.caller.toLowerCase().includes(search.toLowerCase()) ||
c.agent.toLowerCase().includes(search.toLowerCase())
);
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Call Center</Typography>
<Typography variant="body2" color="text.secondary">{callLogs.length} calls today</Typography>
</Box>
<Button variant="contained" startIcon={<Settings />}>IVR Settings</Button>
</Box>
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'Calls Today', value: callLogs.length, color: 'primary.main', icon: <Phone /> },
{ label: 'In Queue', value: queueData.length, color: 'warning.main', icon: <PhoneInTalk /> },
{ label: 'Missed Calls', value: callLogs.filter(c => c.status === 'missed').length, color: 'error.main', icon: <PhoneMissed /> },
{ label: 'Avg Duration', value: '5:32', color: 'info.main', icon: <AccessTime /> },
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
<Grid size={{ xs: 12, md: 4 }}>
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
<PhoneInTalk color="warning" /> Call Queue ({queueData.length})
</Typography>
<Stack spacing={1.5}>
{queueData.map((q) => (
<Paper key={q.position} variant="outlined" sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<Box>
<Typography variant="body2" sx={{ fontWeight: 600 }}>{q.caller}</Typography>
<Typography variant="caption" color="text.secondary">{q.issue}</Typography>
</Box>
<Chip label={q.waitTime} size="small" color="warning" variant="outlined" />
</Paper>
))}
</Stack>
</Paper>
</Grid>
<Grid size={{ xs: 12, md: 8 }}>
<TextField fullWidth size="small" placeholder="Search calls..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 2 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<TableContainer component={Paper}>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Caller</TableCell>
<TableCell>Number</TableCell>
<TableCell>Agent</TableCell>
<TableCell>Type</TableCell>
<TableCell>Status</TableCell>
<TableCell align="right">Duration</TableCell>
<TableCell>Time</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((c) => (
<TableRow key={c.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{c.caller}</Typography></TableCell>
<TableCell>{c.number}</TableCell>
<TableCell>{c.agent}</TableCell>
<TableCell><Chip label={c.type} color={c.type === 'inbound' ? 'info' : 'primary'} size="small" variant="outlined" /></TableCell>
<TableCell><Chip label={c.status} color={c.status === 'completed' ? 'success' : 'error'} size="small" /></TableCell>
<TableCell align="right">{c.duration}</TableCell>
<TableCell>{c.time}</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</Grid>
</Grid>
</Container>
);
}

