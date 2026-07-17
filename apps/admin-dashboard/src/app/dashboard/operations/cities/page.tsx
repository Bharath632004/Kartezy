"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, Stack, Avatar, LinearProgress,
} from '@mui/material';
import {
  Add, Search, Edit, RefreshOutlined, LocationCity, TrendingUp, Storefront,
  LocalShipping, People, MonetizationOn, Speed,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const cityStatusColors: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
  ACTIVE: 'success', LAUNCHING: 'info', INACTIVE: 'warning', SUSPENDED: 'error',
};

export default function CityOperations() {
  const { cities, cityLoading, fetchCities, updateCity, createZone } = useOperationsStore();
  const [search, setSearch] = useState('');
  const [editDialog, setEditDialog] = useState<{ open: boolean; city: any | null }>({ open: false, city: null });
  const [zoneDialog, setZoneDialog] = useState(false);

  useEffect(() => { fetchCities(); }, [fetchCities]);

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  if (cityLoading && cities.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>City Operations</Typography>
          <Typography variant="body2" color="text.secondary">{cities.length} cities across all zones</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => setZoneDialog(true)}>Add Zone</Button>
          <Tooltip title="Refresh"><IconButton onClick={() => fetchCities()}><RefreshOutlined /></IconButton></Tooltip>
        </Box>
      </Box>

      <TextField
        fullWidth size="small" placeholder="Search cities..." value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {filteredCities.slice(0, 4).map((city) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={city.id}>
            <Card sx={{ transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationCity color="primary" />
                    <Typography variant="h6">{city.name}</Typography>
                  </Box>
                  <Chip label={city.status} color={cityStatusColors[city.status] ?? 'default'} size="small" />
                </Box>
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">{city.state} &middot; Zone: {city.zone}</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                    <Chip icon={<Storefront />} label={`${city.totalMerchants}`} size="small" variant="outlined" />
                    <Chip icon={<LocalShipping />} label={`${city.totalDrivers}`} size="small" variant="outlined" />
                    <Chip icon={<People />} label={`${city.totalCustomers}`} size="small" variant="outlined" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">Avg Delivery: <strong>{city.avgDeliveryTime} min</strong></Typography>
                    <Typography variant="body2">Revenue: <strong>₹{city.revenue.toLocaleString()}</strong></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <TrendingUp fontSize="small" color={city.growthRate >= 0 ? 'success' : 'error'} />
                    <Typography variant="caption" color={city.growthRate >= 0 ? 'success.main' : 'error.main'}>
                      {city.growthRate >= 0 ? '+' : ''}{city.growthRate}% growth
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Orders</TableCell>
              <TableCell align="right">Merchants</TableCell>
              <TableCell align="right">Drivers</TableCell>
              <TableCell align="right">Customers</TableCell>
              <TableCell align="right">Avg Delivery</TableCell>
              <TableCell align="right">Revenue</TableCell>
              <TableCell align="right">Growth</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCities.map((city) => (
              <TableRow key={city.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell><Typography fontWeight={600}>{city.name}</Typography></TableCell>
                <TableCell>{city.state}</TableCell>
                <TableCell>{city.zone}</TableCell>
                <TableCell><Chip label={city.status} color={cityStatusColors[city.status] ?? 'default'} size="small" /></TableCell>
                <TableCell align="right">{city.totalOrders}</TableCell>
                <TableCell align="right">{city.totalMerchants}</TableCell>
                <TableCell align="right">{city.totalDrivers}</TableCell>
                <TableCell align="right">{city.totalCustomers}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress variant="determinate" value={Math.min((city.avgDeliveryTime / 40) * 100, 100)} sx={{ width: 50, height: 6, borderRadius: 3 }} color={city.avgDeliveryTime < 20 ? 'success' : city.avgDeliveryTime < 30 ? 'warning' : 'error'} />
                    <Typography variant="caption">{city.avgDeliveryTime} min</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">₹{city.revenue.toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Chip icon={<TrendingUp />} label={`${city.growthRate >= 0 ? '+' : ''}${city.growthRate}%`} color={city.growthRate >= 0 ? 'success' : 'error'} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setEditDialog({ open: true, city })}><Edit /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredCities.length === 0 && (
              <TableRow><TableCell colSpan={12} align="center"><Typography color="text.secondary">No cities found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit City Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, city: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit City: {editDialog.city?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={editDialog.city?.status ?? 'ACTIVE'} label="Status"
                onChange={(e) => setEditDialog({ ...editDialog, city: { ...editDialog.city, status: e.target.value } })}>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="LAUNCHING">Launching</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, city: null })}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (editDialog.city) {
              await updateCity(editDialog.city.id, { status: editDialog.city.status });
              setEditDialog({ open: false, city: null });
            }
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
