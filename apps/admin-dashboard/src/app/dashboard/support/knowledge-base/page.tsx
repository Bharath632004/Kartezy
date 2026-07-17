"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import {
Search, RefreshOutlined, Add, Edit, MenuBook, Visibility, ThumbUp, Article, Category,
} from '@mui/icons-material';
const kbArticles = [
{ id: 'KB-001', title: 'How to track your order', category: 'Orders', views: 4560, helpful: 423, notHelpful: 37, status: 'published', author: 'Sarah J.', updated: '2d ago' },
{ id: 'KB-002', title: 'Return and refund policy', category: 'Returns', views: 3210, helpful: 298, notHelpful: 45, status: 'published', author: 'Mike C.', updated: '1w ago' },
{ id: 'KB-003', title: 'Setting up your merchant store', category: 'Merchant', views: 1890, helpful: 176, notHelpful: 12, status: 'published', author: 'Emily D.', updated: '3d ago' },
{ id: 'KB-004', title: 'Driver app troubleshooting', category: 'Delivery', views: 2340, helpful: 210, notHelpful: 34, status: 'published', author: 'Alex K.', updated: '5d ago' },
{ id: 'KB-005', title: 'Payment gateway integration', category: 'Technical', views: 980, helpful: 85, notHelpful: 22, status: 'draft', author: 'Lisa P.', updated: '1h ago' },
{ id: 'KB-006', title: 'How to contact support', category: 'General', views: 5670, helpful: 534, notHelpful: 41, status: 'published', author: 'Sarah J.', updated: '1w ago' },
{ id: 'KB-007', title: 'Bulk product upload guide', category: 'Merchant', views: 1450, helpful: 128, notHelpful: 18, status: 'published', author: 'Mike C.', updated: '4d ago' },
{ id: 'KB-008', title: 'Fleet management best practices', category: 'Delivery', views: 760, helpful: 65, notHelpful: 8, status: 'draft', author: 'Alex K.', updated: '2h ago' },
];
const categories = ['Orders', 'Returns', 'Merchant', 'Delivery', 'Technical', 'General', 'Billing', 'Account'];
export default function KnowledgeBase() {
const [search, setSearch] = useState('');
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
const filtered = kbArticles.filter(a => {
const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
a.category.toLowerCase().includes(search.toLowerCase());
const matchesCategory = !selectedCategory || a.category === selectedCategory;
return matchesSearch && matchesCategory;
});
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Knowledge Base</Typography>
<Typography variant="body2" color="text.secondary">{kbArticles.length} articles &middot; {categories.length} categories</Typography>
</Box>
<Box sx={{ display: 'flex', gap: 1 }}>
<Button variant="contained" startIcon={<Add />}>New Article</Button>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
</Box>
<TextField fullWidth size="small" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
<Chip label="All" variant={!selectedCategory ? 'filled' : 'outlined'} color="primary" onClick={() => setSelectedCategory(null)} />
{categories.map(cat => (
<Chip key={cat} label={cat} variant={selectedCategory === cat ? 'filled' : 'outlined'}
onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)} />
))}
</Stack>
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'Total Articles', value: kbArticles.length, color: 'primary.main', icon: <Article /> },
{ label: 'Published', value: kbArticles.filter(a => a.status === 'published').length, color: 'success.main', icon: <Visibility /> },
{ label: 'Drafts', value: kbArticles.filter(a => a.status === 'draft').length, color: 'warning.main', icon: <Edit /> },
{ label: 'Total Views', value: kbArticles.reduce((a, art) => a + art.views, 0).toLocaleString(), color: 'info.main', icon: <ThumbUp /> },
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
<TableContainer component={Paper}>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>Article</TableCell>
<TableCell>Category</TableCell>
<TableCell>Status</TableCell>
<TableCell align="right">Views</TableCell>
<TableCell align="right">Helpful %</TableCell>
<TableCell>Author</TableCell>
<TableCell>Updated</TableCell>
<TableCell align="right">Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((a) => {
const helpfulPercent = a.helpful + a.notHelpful > 0 ? Math.round((a.helpful / (a.helpful + a.notHelpful)) * 100) : 0;
return (
<TableRow key={a.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell>
<Typography noWrap sx={{ maxWidth: 250, fontWeight: 600 }}>{a.title}</Typography>
<Typography variant="caption" color="text.secondary">{a.id}</Typography>
</TableCell>
<TableCell><Chip label={a.category} size="small" variant="outlined" /></TableCell>
<TableCell><Chip label={a.status} color={a.status === 'published' ? 'success' : 'warning'} size="small" /></TableCell>
<TableCell align="right">{a.views.toLocaleString()}</TableCell>
<TableCell align="right">
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
<LinearProgress variant="determinate" value={helpfulPercent} sx={{ width: 50, height: 6, borderRadius: 3 }} color={helpfulPercent >= 90 ? 'success' : 'warning'} />
<Typography variant="caption">{helpfulPercent}%</Typography>
</Box>
</TableCell>
<TableCell>{a.author}</TableCell>
<TableCell>{a.updated}</TableCell>
<TableCell align="right">
<IconButton size="small"><Edit /></IconButton>
</TableCell>
</TableRow>
);
})}
</TableBody>
</Table>
</TableContainer>
</Container>
);
}

