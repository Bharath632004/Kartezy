"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, SentimentSatisfiedAlt, SentimentNeutral, SentimentDissatisfied,
ThumbUp, ThumbDown, TrendingUp, TrendingDown, Star,
} from '@mui/icons-material';
const feedbackData = [
{ id: 'FB-001', customer: 'Rajesh K.', ticket: 'TKT-1001', rating: 5, comment: 'Excellent support! Very helpful.', category: 'Support', agent: 'Sarah J.', date: '2h ago' },
{ id: 'FB-002', customer: 'FreshMart', ticket: 'TKT-1004', rating: 3, comment: 'Resolved but took too long.', category: 'Merchant', agent: 'Mike C.', date: '4h ago' },
{ id: 'FB-003', customer: 'Priya S.', ticket: 'TKT-1002', rating: 5, comment: 'Very quick response, thank you!', category: 'Delivery', agent: 'Emily D.', date: '6h ago' },
{ id: 'FB-004', customer: 'TechGadgets', ticket: 'TKT-1003', rating: 2, comment: 'Still not fully resolved.', category: 'Technical', agent: 'Alex K.', date: '1d ago' },
{ id: 'FB-005', customer: 'Sneha M.', ticket: 'TKT-1005', rating: 4, comment: 'Good service overall.', category: 'Billing', agent: 'Lisa P.', date: '1d ago' },
{ id: 'FB-006', customer: 'BigBazaar', ticket: 'TKT-1007', rating: 5, comment: 'Very professional team!', category: 'Support', agent: 'Sarah J.', date: '2d ago' },
{ id: 'FB-007', customer: 'Lakshmi Tiffins', ticket: 'TKT-1008', rating: 4, comment: 'Issue was resolved satisfactorily.', category: 'Billing', agent: 'Lisa P.', date: '2d ago' },
{ id: 'FB-008', customer: 'Amit P.', ticket: 'TKT-1003', rating: 1, comment: 'Very poor experience!', category: 'Delivery', agent: 'Unassigned', date: '3d ago' },
];
const csatByCategory = [
{ category: 'Support', score: 4.6, responses: 45 },
{ category: 'Delivery', score: 4.2, responses: 38 },
{ category: 'Merchant', score: 4.0, responses: 28 },
{ category: 'Billing', score: 3.8, responses: 22 },
{ category: 'Technical', score: 3.5, responses: 18 },
{ category: 'Account', score: 4.3, responses: 15 },
];
export default function FeedbackCSAT() {
const [search, setSearch] = useState('');
const filtered = feedbackData.filter(f =>
f.customer.toLowerCase().includes(search.toLowerCase()) ||
f.category.toLowerCase().includes(search.toLowerCase()) ||
f.agent.toLowerCase().includes(search.toLowerCase())
);
const avgRating = feedbackData.reduce((a, f) => a + f.rating, 0) / feedbackData.length;
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Feedback &amp; CSAT</Typography>
<Typography variant="body2" color="text.secondary">{feedbackData.length} responses &middot; Avg {avgRating.toFixed(1)}/5</Typography>
</Box>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
<TextField fullWidth size="small" placeholder="Search feedback..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<Grid container spacing={2} sx={{ mb: 3 }}>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
<Card sx={{ p: 2, textAlign: 'center' }}>
<SentimentSatisfiedAlt sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
<Typography variant="h3" sx={{ fontWeight: 700 }} color="success.main">{avgRating.toFixed(1)}</Typography>
<Typography variant="body2" color="text.secondary">Overall CSAT / 5.0</Typography>
<Rating value={avgRating} precision={0.5} readOnly sx={{ mt: 0.5 }} />
</Card>
</Grid>
<Grid size={{ xs: 6, sm: 3 }}>
<Card sx={{ borderLeft: 4, borderColor: 'success.main', height: '100%' }}>
<CardContent>
<Typography variant="body2" color="text.secondary">Promoters (4-5)</Typography>
<Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
{feedbackData.filter(f => f.rating >= 4).length}
</Typography>
<Typography variant="caption" color="text.secondary">{Math.round(feedbackData.filter(f => f.rating >= 4).length / feedbackData.length * 100)}%</Typography>
</CardContent>
</Card>
</Grid>
<Grid size={{ xs: 6, sm: 3 }}>
<Card sx={{ borderLeft: 4, borderColor: 'warning.main', height: '100%' }}>
<CardContent>
<Typography variant="body2" color="text.secondary">Passive (3)</Typography>
<Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
{feedbackData.filter(f => f.rating === 3).length}
</Typography>
</CardContent>
</Card>
</Grid>
<Grid size={{ xs: 6, sm: 3 }}>
<Card sx={{ borderLeft: 4, borderColor: 'error.main', height: '100%' }}>
<CardContent>
<Typography variant="body2" color="text.secondary">Detractors (1-2)</Typography>
<Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
{feedbackData.filter(f => f.rating <= 2).length}
</Typography>
</CardContent>
</Card>
</Grid>
</Grid>
<Grid container spacing={3} sx={{ mb: 3 }}>
<Grid size={{ xs: 12, md: 5 }}>
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2 }}>CSAT by Category</Typography>
<Stack spacing={1.5}>
{csatByCategory.map((c) => (
<Box key={c.category}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
<Typography variant="body2">{c.category}</Typography>
<Typography variant="body2" sx={{ fontWeight: 600 }}>{c.score.toFixed(1)} ({c.responses})</Typography>
</Box>
<LinearProgress variant="determinate" value={c.score / 5 * 100} sx={{ height: 8, borderRadius: 4 }}
color={c.score >= 4.3 ? 'success' : c.score >= 3.8 ? 'warning' : 'error'} />
</Box>
))}
</Stack>
</Paper>
</Grid>
<Grid size={{ xs: 12, md: 7 }}>
<TableContainer component={Paper}>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Customer</TableCell>
<TableCell>Rating</TableCell>
<TableCell>Comment</TableCell>
<TableCell>Category</TableCell>
<TableCell>Agent</TableCell>
<TableCell>Date</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((f) => (
<TableRow key={f.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{f.customer}</Typography></TableCell>
<TableCell>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
<Rating value={f.rating} readOnly size="small" />
<Typography variant="caption">{f.rating}</Typography>
</Box>
</TableCell>
<TableCell><Typography variant="caption" noWrap sx={{ maxWidth: 200 }}>{f.comment}</Typography></TableCell>
<TableCell><Chip label={f.category} size="small" variant="outlined" /></TableCell>
<TableCell>{f.agent}</TableCell>
<TableCell>{f.date}</TableCell>
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

