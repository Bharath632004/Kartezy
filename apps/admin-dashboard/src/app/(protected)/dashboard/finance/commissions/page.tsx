"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, IconButton, Grid, Card, CardContent } from '@mui/material';
import { Add, Settings } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function CommissionsPage() {
  const { commissionData, loading, fetchCommissionData } = useFinanceStore();

  useEffect(() => {
    fetchCommissionData({});
  }, [fetchCommissionData]);

  const commissionRules = (commissionData || []).slice(0, 10).map((item: any, idx: number) => ({
    id: item.id || idx + 1,
    ruleName: item.ruleName || item.name || `Commission Rule ${idx + 1}`,
    type: item.type || 'PERCENTAGE_OF_ORDER',
    merchant: item.merchant || item.merchantName || 'All',
    category: item.category || 'All',
    percentage: item.percentage || item.rate || 0,
    minAmount: item.minAmount || 0,
    maxAmount: item.maxAmount || 0,
    priority: item.priority || idx + 1,
    status: item.status || 'ACTIVE',
    effectiveFrom: item.effectiveFrom || item.createdAt?.split('T')[0] || '-',
  }));

  const activeRules = commissionRules.filter((r: any) => r.status === 'ACTIVE').length;
  const totalCommission = commissionData?.reduce((s: number, i: any) => s + (i.amount || 0), 0) || 0;

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
          { label: 'Active Rules', value: activeRules || 0, color: '#388e3c' },
          { label: 'Commissions (MTD)', value: `₹${totalCommission.toLocaleString() || '0'}`, color: '#1976d2' },
          { label: 'Total Rules', value: commissionRules.length, color: '#7b1fa2' },
          { label: 'Commissions Pending', value: commissionData?.filter((i: any) => i.status === 'PENDING').length || 0, color: '#f57c00' },
        ].map((stat) => (
          <Grid size={{ xs: 3 }} key={stat.label}>
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
      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading commission rules...</Typography>
      ) : (
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
              {commissionRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No commission rules configured.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                commissionRules.map((rule: any) => (
                  <TableRow key={rule.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{rule.ruleName}</TableCell>
                    <TableCell><Chip label={rule.type.replace('_', ' ')} size="small" /></TableCell>
                    <TableCell>{rule.merchant}</TableCell>
                    <TableCell>{rule.category}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{rule.percentage > 0 ? `${rule.percentage}%` : rule.minAmount > 0 ? `₹${rule.minAmount}` : '-'}</TableCell>
                    <TableCell>{rule.maxAmount > 0 ? `Up to ₹${rule.maxAmount}` : '-'}</TableCell>
                    <TableCell>{rule.priority}</TableCell>
                    <TableCell><Chip label={rule.status} size="small" color={rule.status === 'ACTIVE' ? 'success' : 'default'} /></TableCell>
                    <TableCell>
                      <IconButton size="small" color="info"><Settings fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
