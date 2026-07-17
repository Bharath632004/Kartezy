"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, Stack, Avatar, LinearProgress,
} from '@mui/material';
import {
  Add, Search, Edit, RefreshOutlined, Map, LocationCity, Delete, LocalShipping,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const zoneTypeColors: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  HOT: 'error', WARM: 'warning', COLD: 'info', EXPANDING: 'success',
};

const demandColors: Record<string, 'error' | 'warning' | 'success'> = {
  HIGH: 'error', MEDIUM: 'warning', LOW: 'success',
};

export default function ZoneManagement() {
  const { zones, zoneLoading, fetchZones, createZone, updateZone } = useOperationsStore();
  const { cities, fetchCities } = useOperationsStore();
  const [search, setSearch] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; zone: any | null }>({ open: false, zone: null });
  const [newZone, setNewZone] = useState({ name: '', cityId: '', type: 'WARM' as string });

  useEffect(() => {
    fetchZones();
    if (cities.length === 0) fetchCities();
  }, [fetchZones, fetchCities, cities.length]);

  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(search.toLowerCase()) ||
    z.cityName.toLowerCase().includes(search.toLowerCase())
  );

  if (zoneLoading && zones.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Zone Management</Typography>
          <Typography variant="body2" color="text.secondary">{zones.length} zones across all cities</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialog(true)}>Create Zone</Button>
          <Tooltip title="Refresh"><IconButton onClick={() => fetchZones()}><RefreshOutlined /></IconButton></Tooltip>
        </Box>
      </Box>

      <TextField
        fullWidth size="small" placeholder="Search zones..." value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Hot Zones', count: zones.filter(z => z.type === 'HOT').length, color: 'error.main' as const },
          { label: 'Warm Zones', count: zones.filter(z => z.type === 'WARM').length, color: 'warning.main' as const },
          { label: 'Cold Zones', count: zones.filter(z => z.type === 'COLD').length, color: 'info.main' as const },
          { label: 'Expanding', count: zones.filter(z => z.type === 'EXPANDING').length, color: 'success.main' as const },
        ].map((stat) => (
          <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.count}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Zone Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Demand</TableCell>
              <TableCell align="right">Orders</TableCell>
              <TableCell align="right">Merchants</TableCell>
              <TableCell align="right">Drivers</TableCell>
              <TableCell align="right">Avg Delivery</TableCell>
              <TableCell align="right">Coverage (km²)</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredZones.map((zone) => (
              <TableRow key={zone.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell><Typography fontWeight={600}>{zone.name}</Typography></TableCell>
                <TableCell>{zone.cityName}</TableCell>
                <TableCell><Chip label={zone.type} color={zoneTypeColors[zone.type] ?? 'default'} size="small" /></TableCell>
                <TableCell><Chip label={zone.status} color={zone.status === 'ACTIVE' ? 'success' : zone.status === 'SUSPENDED' ? 'error' : 'warning'} size="small" /></TableCell>
                <TableCell><Chip label={zone.demandLevel} color={demandColors[zone.demandLevel] ?? 'default'} size="small" variant="outlined" /></TableCell>
                <TableCell align="right">{zone.totalOrders}</TableCell>
                <TableCell align="right">{zone.totalMerchants}</TableCell>
                <TableCell align="right">{zone.totalDrivers}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress variant="determinate" value={Math.min((zone.avgDeliveryTime / 30) * 100, 100)} sx={{ width: 50, height: 6, borderRadius: 3 }} color={zone.avgDeliveryTime < 15 ? 'success' : zone.avgDeliveryTime < 25 ? 'warning' : 'error'} />
                    <Typography variant="caption">{zone.avgDeliveryTime} min</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{zone.coverageArea}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setEditDialog({ open: true, zone })}><Edit /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredZones.length === 0 && (
              <TableRow><TableCell colSpan={11} align="center"><Typography color="text.secondary">No zones found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Zone Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Zone</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Zone Name" fullWidth size="small" value={newZone.name} onChange={(e) => setNewZone({ ...newZone, name: e.target.value })} />
            <FormControl fullWidth size="small">
              <InputLabel>City</InputLabel>
              <Select value={newZone.cityId} label="City" onChange={(e) => setNewZone({ ...newZone, cityId: e.target.value })}>
                {cities.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Zone Type</InputLabel>
              <Select value={newZone.type} label="Zone Type" onChange={(e) => setNewZone({ ...newZone, type: e.target.value })}>
                <MenuItem value="HOT">Hot</MenuItem>
                <MenuItem value="WARM">Warm</MenuItem>
                <MenuItem value="COLD">Cold</MenuItem>
                <MenuItem value="EXPANDING">Expanding</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            await createZone(newZone as any);
            setCreateDialog(false);
            setNewZone({ name: '', cityId: '', type: 'WARM' });
          }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Zone Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, zone: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Zone: {editDialog.zone?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={editDialog.zone?.status ?? 'ACTIVE'} label="Status"
                onChange={(e) => setEditDialog({ ...editDialog, zone: { ...editDialog.zone, status: e.target.value } })}>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Demand Level</InputLabel>
              <Select value={editDialog.zone?.demandLevel ?? 'MEDIUM'} label="Demand Level"
                onChange={(e) => setEditDialog({ ...editDialog, zone: { ...editDialog.zone, demandLevel: e.target.value } })}>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, zone: null })}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (editDialog.zone) {
              await updateZone(editDialog.zone.id, { status: editDialog.zone.status, demandLevel: editDialog.zone.demandLevel });
              setEditDialog({ open: false, zone: null });
            }
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
