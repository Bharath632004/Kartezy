"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, Stack, LinearProgress,
} from '@mui/material';
import {
  Search, Edit, RefreshOutlined, Warehouse, Inventory2, People as PeopleIcon,
  Speed, Storefront, LinearScale, LocationOn,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const warehouseStatusColors: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
  ACTIVE: 'success', MAINTENANCE: 'warning', INACTIVE: 'info', CLOSED: 'error',
};

const warehouseTypeColors: Record<string, 'primary' | 'secondary' | 'info' | 'warning'> = {
  PRIMARY: 'primary', SECONDARY: 'secondary', MICRO: 'info', DARK_STORE: 'warning',
};

export default function WarehouseOperations() {
  const { warehouses, warehouseLoading, fetchWarehouses, updateWarehouse } = useOperationsStore();
  const [search, setSearch] = useState('');
  const [editDialog, setEditDialog] = useState<{ open: boolean; warehouse: any | null }>({ open: false, warehouse: null });

  useEffect(() => { fetchWarehouses(); }, [fetchWarehouses]);

  const filtered = warehouses.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.code.toLowerCase().includes(search.toLowerCase()) ||
    w.cityName.toLowerCase().includes(search.toLowerCase())
  );

  if (warehouseLoading && warehouses.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Warehouse Operations</Typography>
          <Typography variant="body2" color="text.secondary">{warehouses.length} warehouses across all cities</Typography>
        </Box>
        <Tooltip title="Refresh"><IconButton onClick={() => fetchWarehouses()}><RefreshOutlined /></IconButton></Tooltip>
      </Box>

      <TextField fullWidth size="small" placeholder="Search warehouses..." value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Warehouses', value: warehouses.length, color: 'primary.main', icon: <Warehouse /> },
          { label: 'Active', value: warehouses.filter(w => w.status === 'ACTIVE').length, color: 'success.main', icon: <Warehouse /> },
          { label: 'Total Capacity', value: `${warehouses.reduce((a, w) => a + w.capacity, 0).toLocaleString()} units`, color: 'info.main', icon: <Inventory2 /> },
          { label: 'Total Staff', value: warehouses.reduce((a, w) => a + w.totalStaff, 0), color: 'warning.main', icon: <PeopleIcon /> },
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
              <TableCell>Warehouse</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>City / Zone</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Capacity Used</TableCell>
              <TableCell align="right">SKUs</TableCell>
              <TableCell align="right">Staff</TableCell>
              <TableCell align="right">Active Orders</TableCell>
              <TableCell align="right">Avg Processing</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((w) => {
              const capacityPercent = w.capacity > 0 ? Math.round((w.utilizedCapacity / w.capacity) * 100) : 0;
              return (
                <TableRow key={w.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                  <TableCell><Typography fontWeight={600}>{w.name}</Typography></TableCell>
                  <TableCell><Chip label={w.code} size="small" variant="outlined" /></TableCell>
                  <TableCell>{w.cityName}{w.zoneName ? ` / ${w.zoneName}` : ''}</TableCell>
                  <TableCell><Chip label={w.type.replace('_', ' ')} color={warehouseTypeColors[w.type] ?? 'default'} size="small" /></TableCell>
                  <TableCell><Chip label={w.status} color={warehouseStatusColors[w.status] ?? 'default'} size="small" /></TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress variant="determinate" value={capacityPercent} sx={{ width: 60, height: 8, borderRadius: 4 }} color={capacityPercent > 85 ? 'error' : capacityPercent > 65 ? 'warning' : 'success'} />
                      <Typography variant="caption">{capacityPercent}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{w.totalSKUs}</TableCell>
                  <TableCell align="right">{w.totalStaff}</TableCell>
                  <TableCell align="right">{w.activeOrders}</TableCell>
                  <TableCell align="right">{w.avgProcessingTime} min</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setEditDialog({ open: true, warehouse: w })}><Edit /></IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={11} align="center"><Typography color="text.secondary">No warehouses found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, warehouse: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Warehouse: {editDialog.warehouse?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={editDialog.warehouse?.status ?? 'ACTIVE'} label="Status"
                onChange={(e) => setEditDialog({ ...editDialog, warehouse: { ...editDialog.warehouse, status: e.target.value } })}>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, warehouse: null })}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (editDialog.warehouse) {
              await updateWarehouse(editDialog.warehouse.id, { status: editDialog.warehouse.status });
              setEditDialog({ open: false, warehouse: null });
            }
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function Avatar({ children, sx }: { children: React.ReactNode; sx?: any }) {
  return (
    <Box sx={{
      width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx,
    }}>{children}</Box>
  );
}
