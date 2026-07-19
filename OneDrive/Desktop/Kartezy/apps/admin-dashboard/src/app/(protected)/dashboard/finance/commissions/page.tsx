"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, IconButton, Grid, Card, CardContent } from '@mui/material';
import { Add, Settings, TrendingUp } from '@mui/icons-material';

const commissionRules = [
  { id: 1, ruleName: 'Standard Commission', type: 'PERCENTAGE_OF_ORDER', merchant: 'All', category: 'All', percentage: 5.0, minAmount: 0, maxAmount: 5000, priority: 1, status: 'ACTIVE', effectiveFrom: '2026-01-01' },
  { id: 2, ruleName: 'Premium Merchant - Reduced', type: 'TIERED_PERCENTAGE', merchant: 'FreshMart Grocery', category: 'All', percentage: 3.0, minAmount: 0, maxAmount: 10000, priority: 2, status: 'ACTIVE', effectiveFrom: '2026-03-01' },
  { id: 3, ruleName: 'Electronics Category Fee', type: 'FIXED_AMOUNT', merchant: 'All', category: 'Electronics', percentage: 0, minAmount: 25, maxAmount: 25, priority: 3, status: 'ACTIVE', effectiveFrom: '2026-02-01' },
  { id: 4, ruleName: 'High Volume Discount', type: 'VOLUME_BASED', merchant: 'All', category: 'All', percentage: 0, minAmount: 0, maxAmount: 0, priority: 4, status: 'ACTIVE', effectiveFrom: '2026-04-01' },
];

export default function CommissionsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Commission Engine</Typography>
          <Typography variant="body2" color="text.secondary">Configure commission rules and view calculations</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Settings />} variant="outlined">Manage Rules</Button>
          <Button startIcon={<Add />} variant="contained">Add Rule</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Rules', value: 4, color: '#388e3c' },
          { label: 'Commissions Earned (MTD)', value: '₹1,55,000', color: '#1976d2' },
          { label: 'Avg Commission Rate', value: '4.0%', color: '#7b1fa2' },
          { label: 'Pending Calculations', value: 12, color: '#f57c00' },
        ].map((stat) => (
          <Grid item xs={3} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color, mt: 0.5 }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Commission Rules</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Rule Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Merchant</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rate</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Limits</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commissionRules.map((rule) => (
              <TableRow key={rule.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{rule.ruleName}</TableCell>
                <TableCell><Chip label={rule.type.replace('_', ' ')} size="small" /></TableCell>
                <TableCell>{rule.merchant}</TableCell>
                <TableCell>{rule.category}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{rule.percentage > 0 ? `${rule.percentage}%` : rule.minAmount > 0 ? `₹${rule.minAmount}` : '-'}</TableCell>
                <TableCell>{rule.maxAmount > 0 ? `Up to ₹${rule.maxAmount}` : '-'}</TableCell>
                <TableCell>{rule.priority}</TableCell>
                <TableCell><Chip label={rule.status} size="small" color="success" /></TableCell>
                <TableCell>
                  <IconButton size="small" color="info"><Settings fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
