"use client"
import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip, CircularProgress, Paper, Avatar, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Divider, Switch, Rating, Badge, Alert, AlertTitle } from '@mui/material';
import { Search, RefreshOutlined, LocalShipping, WarningAmber, Star, Phone } from '@mui/icons-material';
const driverIssues = [
{ id: 'D-001', name: 'Suresh Rai', vehicle: 'Bike - PB01AB1234', tickets: 2, openTickets: 1, rating: 4.5, deliveries: 145, status: 'active', lastActive: '10m ago', earnings: '₹12,500' },
{ id: 'D-002', name: 'Mohan Lal', vehicle: 'Scooty - DL02XY5678', tickets: 0, openTickets: 0, rating: 4.8, deliveries: 89, status: 'active', lastActive: '2m ago', earnings: '₹8,200' },
{ id: 'D-003', name: 'Ravi Kumar', vehicle: 'Bike - HR03CD9012', tickets: 4, openTickets: 2, rating: 3.8, deliveries: 210, status: 'suspended', lastActive: '2d ago', earnings: '₹18,000' },
{ id: 'D-004', name: 'Vijay Singh', vehicle: 'Cycle - DL04EF3456', tickets: 1, openTickets: 0, rating: 4.2, deliveries: 67, status: 'active', lastActive: '1h ago', earnings: '₹5,800' },
{ id: 'D-005', name: 'Amit Verma', vehicle: 'Bike - UP05GH7890', tickets: 3, openTickets: 1, rating: 4.0, deliveries: 178, status: 'active', lastActive: '30m ago', earnings: '₹15,300' },
{ id: 'D-006', name: 'Deepak Joshi', vehicle: 'EV - KA06IJ1234', tickets: 5, openTickets: 3, rating: 3.5, deliveries: 56, status: 'active', lastActive: '5m ago', earnings: '₹4,200' },
];
export default function DeliverySupport() {
const [search, setSearch] = useState('');
const filtered = driverIssues.filter(d =>
d.name.toLowerCase().includes(search.toLowerCase()) ||
d.vehicle.toLowerCase().includes(search.toLowerCase())
);
return (
<Container maxWidth="xl" sx={{ py: 2 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>Delivery Support</Typography>
<Typography variant="body2" color="text.secondary">{driverIssues.length} delivery partners</Typography>
</Box>
<Tooltip title="Refresh"><IconButton><RefreshOutlined /></IconButton></Tooltip>
</Box>
<TextField fullWidth size="small" placeholder="Search drivers..." value={search} onChange={(e) => setSearch(e.target.value)}
sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
<Grid container spacing={2} sx={{ mb: 3 }}>
{[
{ label: 'Active Drivers', value: driverIssues.filter(d => d.status === 'active').length, color: 'success.main' },
{ label: 'Open Issues', value: driverIssues.reduce((a, d) => a + d.openTickets, 0), color: 'warning.main' },
{ label: 'Suspended', value: driverIssues.filter(d => d.status === 'suspended').length, color: 'error.main' },
{ label: 'Avg Rating', value: (driverIssues.reduce((a, d) => a + d.rating, 0) / driverIssues.length).toFixed(1), color: 'info.main' },
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
<TableCell>Driver</TableCell>
<TableCell>Vehicle</TableCell>
<TableCell>Status</TableCell>
<TableCell align="right">Tickets</TableCell>
<TableCell align="right">Open</TableCell>
<TableCell align="right">Deliveries</TableCell>
<TableCell align="right">Rating</TableCell>
<TableCell align="right">Earnings</TableCell>
<TableCell>Last Active</TableCell>
</TableRow>
</TableHead>
<TableBody>
{filtered.map((d) => (
<TableRow key={d.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
<TableCell><Typography sx={{ fontWeight: 600 }}>{d.name}</Typography></TableCell>
<TableCell><Typography variant="caption">{d.vehicle}</Typography></TableCell>
<TableCell><Chip label={d.status} color={d.status === 'active' ? 'success' : 'error'} size="small" /></TableCell>
<TableCell align="right">{d.tickets}</TableCell>
<TableCell align="right"><Chip label={d.openTickets} color={d.openTickets > 0 ? 'warning' : 'success'} size="small" /></TableCell>
<TableCell align="right">{d.deliveries}</TableCell>
<TableCell align="right"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Star sx={{ fontSize: 14, color: 'warning.main' }} />{d.rating.toFixed(1)}</Box></TableCell>
<TableCell align="right">{d.earnings}</TableCell>
<TableCell>{d.lastActive}</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</Container>
);
}

