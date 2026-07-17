"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, TrendingUp, TrendingDown, SentimentSatisfiedAlt,
SentimentNeutral, SentimentDissatisfied, Group, Download, Send,
} from '@mui/icons-material';
const npsResponses = [
{ id: 'NPS-001', customer: 'Rajesh K.', score: 9, category: 'Promoter', segment: 'VIP Customer', comment: 'Love the service!', date: '1h ago' },
{ id: 'NPS-002', customer: 'FreshMart', score: 7, category: 'Passive', segment: 'Premium Merchant', comment: 'Good but can improve delivery time.', date: '3h ago' },
{ id: 'NPS-003', customer: 'Priya S.', score: 10, category: 'Promoter', segment: 'Regular Customer', comment: 'Excellent platform!', date: '5h ago' },
{ id: 'NPS-004', customer: 'TechGadgets', score: 4, category: 'Detractor', segment: 'Premium Merchant', comment: 'Very disappointed with support.', date: '1d ago' },
{ id: 'NPS-005', customer: 'Ananya G.', score: 8, category: 'Promoter', segment: 'VIP Customer', comment: 'Quick resolution every time.', date: '1d ago' },
{ id: 'NPS-006', customer: 'Amit P.', score: 6, category: 'Passive', segment: 'Regular Customer', comment: 'Okay experience.', date: '2d ago' },
{ id: 'NPS-007', customer: 'BigBazaar', score: 9, category: 'Promoter', segment: 'Enterprise Client', comment: 'Great partnership!', date: '2d ago' },
{ id: 'NPS-008', customer: 'Sneha M.', score: 3, category: 'Detractor', segment: 'Regular Customer', comment: 'Poor refund experience.', date: '3d ago' },
{ id: 'NPS-009', customer: 'Lakshmi Tiffins', score: 8, category: 'Promoter', segment: 'Standard Merchant', comment: 'Satisfied with the service.', date: '3d ago' },
{ id: 'NPS-010', customer: 'Driver Suresh', score: 5, category: 'Detractor', segment: 'Delivery Partner', comment: 'App needs improvement.', date: '4d ago' },
];
const npsBySegment = [
{ segment: 'VIP Customers', score: 85, responses: 45, color: 'secondary.main' },
{ segment: 'Enterprise Clients', score: 78, responses: 28, color: 'primary.main' },
{ segment: 'Premium Merchants', score: 62, responses: 35, color: 'warning.main' },
{ segment: 'Regular Customers', score: 55, responses: 120, color: 'info.main' },
{ segment: 'Standard Merchants', score: 48, responses: 40, color: 'warning.main' },
{ segment: 'Delivery Partners', score: 42, responses: 25, color: 'error.main' },
];
const currentNPS = Math.round(
((npsResponses.filter(r => r.category === 'Promoter').length / npsResponses.length) -
(npsResponses.filter(r => r.category === 'Detractor').length / npsResponses.length)) * 100
);
export default function NPSPage() {
const [search, setSearch] = useState('');
const filtered = npsResponses.filter(r =>
r.customer.toLowerCase().includes(search.toLowerCase()) ||
r.segment.toLowerCase().includes(search.toLowerCase())
);
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Net Promoter Score (NPS)</Typography>
<Typography variant="body2" color="text.secondary">{npsResponses.length} responses this period</Typography>
</Box>
<Box sx={{ display: 'flex', gap: 1 }}>
<Button variant="contained" startIcon={<Send />}>Send Survey</Button>
<Button variant="outlined" startIcon={<Download />}>Export</Button>
</Box>
</Box>
{/* NPS Hero */}
<Paper sx={{ p: 3, mb: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
<Typography variant="overline">Current NPS Score</Typography>
<Typography variant="h2" sx={{ fontWeight: 700, my: 1 }}>{currentNPS}</Typography>
<Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
<Box>
<SentimentSatisfiedAlt sx={{ fontSize: 32, color: '#4CAF50' }} />
<Typography variant="h6">{npsResponses.filter(r => r.category === 'Promoter').length}</Typography>
<Typography variant="caption">Promoters</Typography>
</Box>
<Box>
<SentimentNeutral sx={{ fontSize: 32, color: '#FF9800' }} />
<Typography variant="h6">{npsResponses.filter(r => r.category === 'Passive').length}</Typography>
<Typography variant="caption">Passive</Typography>
</Box>
<Box>
<SentimentDissatisfied sx={{ fontSize: 32, color: '#f44336' }} />
<Typography variant="h6">{npsResponses.filter(r => r.category === 'Detractor').length}</Typography>
<Typography variant="caption">Detractors</Typography>
</Box>
</Box>
</Paper>
<Grid container spacing={3} sx={{ mb: 3 }}>
<Grid size={{ xs: 12, md: 4 }}>
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2 }}>NPS by Segment</Typography>
<Stack spacing={1.5}>
{npsBySegment.map((s) => (
<Box key={s.segment}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
<Typography variant="body2">{s.segment}</Typography>
<Typography variant="body2" sx={{ fontWeight: 600 }}>{s.score} ({s.responses})</Typography>
</Box>
<LinearProgress variant="determinate" value={s.score} sx={{ height: 8, borderRadius: 4 }}
color={s.score >= 70 ? 'success' : s.score >= 50 ? 'warning' : 'error'} />
</Box>
))}
</Stack>
</Paper>
</Grid>
<Grid size={{ xs: 12, md: 8 }}>
<TextField fullWidth size="small" placeholder="Search responses..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 2 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<TableContainer component={Paper}>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Customer</TableCell>
<TableCell align="right">Score</TableCell>
<TableCell>Category</TableCell>
<TableCell>Segment</TableCell>
<TableCell>Comment</TableCell>
<TableCell>Date</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((r) => (
<TableRow key={r.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{r.customer}</Typography></TableCell>
<TableCell align="right"><Typography variant="h6" sx={{ fontWeight: 700 }} color={r.score >= 9 ? 'success.main' : r.score >= 7 ? 'warning.main' : 'error.main'}>{r.score}</Typography></TableCell>
<TableCell><Chip label={r.category} color={r.category === 'Promoter' ? 'success' : r.category === 'Passive' ? 'warning' : 'error'} size="small" /></TableCell>
<TableCell>{r.segment}</TableCell>
<TableCell><Typography variant="caption" noWrap sx={{ maxWidth: 200 }}>{r.comment}</Typography></TableCell>
<TableCell>{r.date}</TableCell>
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

