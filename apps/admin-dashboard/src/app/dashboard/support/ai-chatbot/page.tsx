"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, SmartToy, TrendingUp, ThumbUp, ThumbDown,
Speed, School, Edit, Psychology, AutoFixHigh,
} from '@mui/icons-material';
const botIntents = [
{ id: 'INT-001', name: 'Order Status', utterances: 245, confidence: 94, matches: 230, status: 'active', lastTrained: '2h ago' },
{ id: 'INT-002', name: 'Refund Request', utterances: 189, confidence: 88, matches: 166, status: 'active', lastTrained: '2h ago' },
{ id: 'INT-003', name: 'Delivery Issue', utterances: 312, confidence: 91, matches: 284, status: 'active', lastTrained: '2h ago' },
{ id: 'INT-004', name: 'Cancel Order', utterances: 156, confidence: 96, matches: 150, status: 'active', lastTrained: '5h ago' },
{ id: 'INT-005', name: 'Change Address', utterances: 98, confidence: 85, matches: 83, status: 'active', lastTrained: '1d ago' },
{ id: 'INT-006', name: 'Payment Issue', utterances: 134, confidence: 78, matches: 105, status: 'needs_training', lastTrained: '3d ago' },
{ id: 'INT-007', name: 'Merchant Onboarding', utterances: 67, confidence: 72, matches: 48, status: 'needs_training', lastTrained: '1w ago' },
{ id: 'INT-008', name: 'Complaint', utterances: 201, confidence: 82, matches: 165, status: 'active', lastTrained: '1d ago' },
];
export default function AIChatbot() {
const [search, setSearch] = useState('');
const filtered = botIntents.filter(i =>
i.name.toLowerCase().includes(search.toLowerCase())
);
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>AI Chatbot</Typography>
<Typography variant="body2" color="text.secondary">AI-powered support automation &middot; {botIntents.length} intents</Typography>
</Box>
<Box sx={{ display: 'flex', gap: 1 }}>
<Button variant="contained" startIcon={<School />}>Train Model</Button>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
</Box>
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'Conversations Today', value: '1,256', icon: <SmartToy />, color: 'primary.main' },
{ label: 'Resolved by Bot', value: '892 (71%)', icon: <AutoFixHigh />, color: 'success.main' },
{ label: 'Avg Confidence', value: '87%', icon: <Psychology />, color: 'info.main' },
{ label: 'Escalated to Human', value: '364 (29%)', icon: <TrendingUp />, color: 'warning.main' },
].map(s => (
<Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
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
<Grid container spacing={3} sx={{ mb: 3 }}>
<Grid size={{ xs: 12, md: 4 }}>
<Card sx={{ p: 2, textAlign: 'center' }}>
<SmartToy sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
<Typography variant="h3" sx={{ fontWeight: 700 }} color="primary.main">87%</Typography>
<Typography variant="body2" color="text.secondary">Overall Bot Resolution Rate</Typography>
<LinearProgress variant="determinate" value={87} sx={{ mt: 2, height: 10, borderRadius: 5 }} />
<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
<Typography variant="caption" color="success.main"><ThumbUp fontSize="inherit" /> 92% satisfaction</Typography>
<Typography variant="caption" color="warning.main"><ThumbDown fontSize="inherit" /> 8% escalations</Typography>
</Box>
</Card>
</Grid>
<Grid size={{ xs: 12, md: 8 }}>
<Paper sx={{ p: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
<Typography variant="h6">Bot Intents</Typography>
<TextField size="small" placeholder="Search intents..." value={search} onChange={(e) => setSearch(e.target.value)}
slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
</Box>
<TableContainer>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Intent</TableCell>
<TableCell align="right">Utterances</TableCell>
<TableCell align="right">Confidence</TableCell>
<TableCell align="right">Matches</TableCell>
<TableCell>Status</TableCell>
<TableCell>Last Trained</TableCell>
<TableCell align="right">Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((intent) => (
<TableRow key={intent.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{intent.name}</Typography></TableCell>
<TableCell align="right">{intent.utterances}</TableCell>
<TableCell align="right">
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
<LinearProgress variant="determinate" value={intent.confidence} sx={{ width: 50, height: 6, borderRadius: 3 }}
color={intent.confidence >= 90 ? 'success' : intent.confidence >= 80 ? 'warning' : 'error'} />
<Typography variant="caption">{intent.confidence}%</Typography>
</Box>
</TableCell>
<TableCell align="right">{intent.matches}</TableCell>
<TableCell><Chip label={intent.status.replace('_', ' ')} color={intent.status === 'active' ? 'success' : 'warning'} size="small" /></TableCell>
<TableCell>{intent.lastTrained}</TableCell>
<TableCell align="right"><IconButton size="small"><Edit /></IconButton></TableCell>
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

