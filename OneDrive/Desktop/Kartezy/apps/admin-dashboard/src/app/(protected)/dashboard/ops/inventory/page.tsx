"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent } from '@mui/material';
import { Inventory as InvIcon, Warning, CheckCircle, Error as ErrorIcon, Refresh } from '@mui/icons-material';

const invData = [
  { id: 1, warehouse: 'WH-MUM-01', merchant: 'Priya Foods', totalSku: 1240, active: 1180, outOfStock: 28, lowStock: 32, health: 'HEALTHY', accuracy: 98.5 },
  { id: 2, warehouse: 'WH-DEL-01', merchant: 'Delhi Bazaar', totalSku: 980, active: 860, outOfStock: 45, lowStock: 75, health: 'LOW_STOCK', accuracy: 92.3 },
  { id: 3, warehouse: 'WH-BLR-01', merchant: 'TechMart', totalSku: 2100, active: 1950, outOfStock: 62, lowStock: 88, health: 'WARNING', accuracy: 95.1 },
  { id: 4, warehouse: 'WH-MUM-02', merchant: 'Spice Junction', totalSku: 560, active: 520, outOfStock: 18, lowStock: 22, health: 'HEALTHY', accuracy: 99.2 },
  { id: 5, warehouse: 'WH-HYD-01', merchant: 'Hyderabad Hub', totalSku: 1500, active: 1320, outOfStock: 85, lowStock: 95, health: 'CRITICAL', accuracy: 88.0 },
];

const healthColors: Record<string, string> = {
  HEALTHY: '#388e3c', LOW_STOCK: '#f57c00', WARNING: '#e65100', CRITICAL: '#d32f2f',
};

export default function InventoryOpsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Inventory Operations</Typography>
          <Typography variant="body2" color="text.secondary">Monitor inventory health, stock levels, and accuracy</Typography>
        </Box>
        <Button startIcon={<Refresh />} variant="contained">Run Audit</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Healthy', value: '2', color: '#388e3c', icon: <CheckCircle /> },
          { label: 'Low Stock', value: '1', color: '#f57c00', icon: <Warning /> },
          { label: 'Warning', value: '1', color: '#e65100', icon: <Warning /> },
          { label: 'Critical', value: '1', color: '#d32f2f', icon: <ErrorIcon /> },
        ].map((s) => (
          <Grid item xs={3} key={s.label}>
            <Card><CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              </Box>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Warehouse</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Merchant</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total SKUs</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Active</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Out of Stock</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Low Stock</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Accuracy</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Health</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invData.map((inv) => (
              <TableRow key={inv.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{inv.warehouse}</TableCell>
                <TableCell>{inv.merchant}</TableCell>
                <TableCell>{inv.totalSku.toLocaleString()}</TableCell>
                <TableCell>{inv.active.toLocaleString()}</TableCell>
                <TableCell><Typography color="error" sx={{ fontWeight: 600 }}>{inv.outOfStock}</Typography></TableCell>
                <TableCell><Typography color="warning.main" sx={{ fontWeight: 600 }}>{inv.lowStock}</Typography></TableCell>
                <TableCell>{inv.accuracy}%</TableCell>
                <TableCell><Chip label={inv.health} size="small" sx={{ bgcolor: `${healthColors[inv.health]}20`, color: healthColors[inv.health], fontWeight: 600 }} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
