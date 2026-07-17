"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, Stack, LinearProgress, Rating,
} from '@mui/material';
import {
  Search, Edit, RefreshOutlined, Storefront, Star, TrendingUp, Block, CheckCircle, AccessTime,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const merchantStatusColors: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  ACTIVE: 'success', PENDING: 'warning', ONBOARDING: 'info', INACTIVE: 'default', SUSPENDED: 'error',
};

const liveStatusColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  OPEN: 'success', BUSY: 'warning', CLOSED: 'error', HOLIDAY: 'info',
};

export default function MerchantOperations() {
  const { opsMerchants, opsMerchantLoading, fetchOpsMerchants, updateOpsMerchant } = useOperationsStore();
  const [search, setSearch] = useState('');
  const [editDialog, setEditDialog] = useState<{ open: boolean; merchant: any | null }>({ open: false, merchant: null });

  useEffect(() => { fetchOpsMerchants(); }, [fetchOpsMerchants]);

  const filtered = opsMerchants.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.storeName.toLowerCase().includes(search.toLowerCase()) ||
    m.cityName.toLowerCase().includes(search.toLowerCase())
  );

  if (opsMerchantLoading && opsMerchants.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Merchant Operations</Typography>
          <Typography variant="body2" color="text.secondary">{opsMerchants.length} merchants monitored</Typography>
        </Box>
        <Tooltip title="Refresh"><IconButton onClick={() => fetchOpsMerchants()}><RefreshOutlined /></IconButton></Tooltip>
      </Box>

      <TextField fullWidth size="small" placeholder="Search merchants..." value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active', value: opsMerchants.filter(m => m.status === 'ACTIVE').length, color: 'success.main', icon: <CheckCircle /> },
          { label: 'Open Now', value: opsMerchants.filter(m => m.liveStatus === 'OPEN').length, color: 'success.main', icon: <Storefront /> },
          { label: 'Suspended', value: opsMerchants.filter(m => m.status === 'SUSPENDED').length, color: 'error.main', icon: <Block /> },
          { label: 'Avg Prep Time', value: `${Math.round(opsMerchants.reduce((a, m) => a + m.avgPrepTime, 0) / (opsMerchants.length || 1))} min`, color: 'info.main', icon: <AccessTime /> },
        ].map((stat) => (
          <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
            <Card sx={{ '&:hover': { transform: 'translateY(-2px)', boxShadow: 3, transition: '0.3s' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color }}>{stat.icon}</Avatar>
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
              <TableCell>Store</TableCell>
              <TableCell>Merchant</TableCell>
              <TableCell>City / Zone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Live</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell align="right">Orders</TableCell>
              <TableCell align="right">Revenue</TableCell>
              <TableCell align="right">Fulfillment</TableCell>
              <TableCell align="right">Cancellation</TableCell>
              <TableCell align="right">Prep Time</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell><Typography fontWeight={600}>{m.storeName}</Typography></TableCell>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.cityName}{m.zoneName ? ` / ${m.zoneName}` : ''}</TableCell>
                <TableCell><Chip label={m.status} color={merchantStatusColors[m.status] ?? 'default'} size="small" /></TableCell>
                <TableCell><Chip label={m.liveStatus} color={liveStatusColors[m.liveStatus] ?? 'default'} size="small" variant="outlined" /></TableCell>
                <TableCell><Chip label={m.tier} size="small" variant="outlined" /></TableCell>
                <TableCell align="right">{m.totalOrders}</TableCell>
                <TableCell align="right">₹{m.totalRevenue.toLocaleString()}</TableCell>
                <TableCell align="right">
                  <LinearProgress variant="determinate" value={m.fulfillmentRate * 100} sx={{ width: 60, height: 6, borderRadius: 3 }} color={m.fulfillmentRate >= 0.95 ? 'success' : m.fulfillmentRate >= 0.85 ? 'warning' : 'error'} />
                </TableCell>
                <TableCell align="right">{(m.cancellationRate * 100).toFixed(1)}%</TableCell>
                <TableCell align="right">{m.avgPrepTime} min</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ fontSize: 14, color: 'warning.main' }} />
                    <Typography variant="caption">{m.rating.toFixed(1)}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setEditDialog({ open: true, merchant: m })}><Edit /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={13} align="center"><Typography color="text.secondary">No merchants found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, merchant: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Merchant: {editDialog.merchant?.storeName}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={editDialog.merchant?.status ?? 'ACTIVE'} label="Status"
                onChange={(e) => setEditDialog({ ...editDialog, merchant: { ...editDialog.merchant, status: e.target.value } })}>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                <MenuItem value="ONBOARDING">Onboarding</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Live Status</InputLabel>
              <Select value={editDialog.merchant?.liveStatus ?? 'OPEN'} label="Live Status"
                onChange={(e) => setEditDialog({ ...editDialog, merchant: { ...editDialog.merchant, liveStatus: e.target.value } })}>
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="BUSY">Busy</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
                <MenuItem value="HOLIDAY">Holiday</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, merchant: null })}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (editDialog.merchant) {
              await updateOpsMerchant(editDialog.merchant.id, { status: editDialog.merchant.status, liveStatus: editDialog.merchant.liveStatus });
              setEditDialog({ open: false, merchant: null });
            }
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function Avatar({ children, sx }: { children: React.ReactNode; sx?: any }) {
  return <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }}>{children}</Box>;
}
