"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, LinearProgress, Stack,
} from '@mui/material';
import {
  Search, RefreshOutlined, Inventory2, WarningAmber, CheckCircle, ErrorOutlined, TrendingUp,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const stockStatusColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  IN_STOCK: 'success', LOW_STOCK: 'warning', OUT_OF_STOCK: 'error', OVERSTOCKED: 'info', DISCONTINUED: 'default',
};

export default function InventoryOperations() {
  const { inventoryItems, inventoryLoading, fetchInventoryItems } = useOperationsStore();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchInventoryItems(); }, [fetchInventoryItems]);

  const filtered = inventoryItems.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase()) ||
    i.warehouseName.toLowerCase().includes(search.toLowerCase())
  );

  if (inventoryLoading && inventoryItems.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  const stockSummary = {
    inStock: inventoryItems.filter(i => i.status === 'IN_STOCK').length,
    lowStock: inventoryItems.filter(i => i.status === 'LOW_STOCK').length,
    outOfStock: inventoryItems.filter(i => i.status === 'OUT_OF_STOCK').length,
    overstocked: inventoryItems.filter(i => i.status === 'OVERSTOCKED').length,
    totalValue: inventoryItems.reduce((a, i) => a + i.totalValue, 0),
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Inventory Operations</Typography>
          <Typography variant="body2" color="text.secondary">{inventoryItems.length} items tracked</Typography>
        </Box>
        <Tooltip title="Refresh"><IconButton onClick={() => fetchInventoryItems()}><RefreshOutlined /></IconButton></Tooltip>
      </Box>

      <TextField fullWidth size="small" placeholder="Search by name, SKU or warehouse..." value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'success.main' }}>
            <CardContent><Typography variant="body2" color="text.secondary">In Stock</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>{stockSummary.inStock}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
            <CardContent><Typography variant="body2" color="text.secondary">Low Stock</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>{stockSummary.lowStock}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'error.main' }}>
            <CardContent><Typography variant="body2" color="text.secondary">Out of Stock</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>{stockSummary.outOfStock}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'info.main' }}>
            <CardContent><Typography variant="body2" color="text.secondary">Overstocked</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>{stockSummary.overstocked}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
            <CardContent><Typography variant="body2" color="text.secondary">Total Value</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>₹{stockSummary.totalValue.toLocaleString()}</Typography></CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Current</TableCell>
              <TableCell align="right">Reserved</TableCell>
              <TableCell align="right">Available</TableCell>
              <TableCell align="right">Min / Max</TableCell>
              <TableCell align="right">Stock Level</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item) => {
              const stockPercent = item.maximumStock > 0 ? (item.currentStock / item.maximumStock) * 100 : 0;
              return (
                <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                  <TableCell><Chip label={item.sku} size="small" variant="outlined" /></TableCell>
                  <TableCell><Typography fontWeight={600}>{item.name}</Typography></TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.warehouseName}</TableCell>
                  <TableCell><Chip label={item.status.replace('_', ' ')} color={stockStatusColors[item.status] ?? 'default'} size="small" /></TableCell>
                  <TableCell align="right">{item.currentStock}</TableCell>
                  <TableCell align="right">{item.reservedStock}</TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600} color={item.availableStock <= 0 ? 'error.main' : 'text.primary'}>{item.availableStock}</Typography>
                  </TableCell>
                  <TableCell align="right">{item.minimumStock} / {item.maximumStock}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress variant="determinate" value={Math.min(stockPercent, 100)} sx={{ width: 60, height: 8, borderRadius: 4 }}
                        color={stockPercent < 20 ? 'error' : stockPercent < 50 ? 'warning' : stockPercent > 90 ? 'info' : 'success'} />
                      <Typography variant="caption">{Math.round(stockPercent)}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">₹{item.unitPrice}</TableCell>
                  <TableCell align="right">₹{item.totalValue.toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={12} align="center"><Typography color="text.secondary">No inventory items found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
