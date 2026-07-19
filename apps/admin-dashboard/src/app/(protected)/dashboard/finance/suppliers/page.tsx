"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, IconButton, Card, CardContent, Grid2 } from '@mui/material';
import { Search, Add, Edit, Visibility, Star } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function SuppliersPage() {
  const { payoutsData, loading, fetchPayoutsData } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayoutsData({});
  }, [fetchPayoutsData]);

  const displayedSuppliers = payoutsData?.length > 0
    ? payoutsData
        .filter((s: any) => 
          !searchTerm || 
          (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (s.code && s.code.includes(searchTerm))
        )
        .slice(0, 10)
    : [];

  const activeSuppliers = displayedSuppliers.filter((s: any) => s.status !== 'INACTIVE').length;
  const preferredCount = displayedSuppliers.filter((s: any) => s.isPreferred || s.preferred).length;
  const expiringSoon = displayedSuppliers.filter((s: any) => s.contractEnd && new Date(s.contractEnd) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Suppliers</Typography>
          <Typography variant="body2" color="text.secondary">Manage direct suppliers and contracts</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">Add Supplier</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Suppliers', value: activeSuppliers || 0, color: '#388e3c' },
          { label: 'Preferred Partners', value: preferredCount || 0, color: '#f57c00' },
          { label: 'Expiring Soon', value: expiringSoon || 0, color: '#d32f2f' },
          { label: 'Avg Rating', value: displayedSuppliers.length > 0 ? 'N/A' : '-', color: '#7b1fa2' },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 3 }}>
            <Card>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField 
          size="small" 
          placeholder="Search suppliers..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }} 
          InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} 
        />
      </Paper>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading suppliers...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contract End</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No suppliers found. Add a supplier to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedSuppliers.map((s: any) => (
                  <TableRow key={s.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.code || s.payoutId || `SUP-${String(s.id).padStart(6, '0')}`}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.name || s.merchantName || 'Supplier'}</Typography>
                      <Typography variant="caption" color="text.secondary">{s.contact || '-'}</Typography>
                    </TableCell>
                    <TableCell>{s.company || '-'}</TableCell>
                    <TableCell><Chip label={s.category || 'General'} size="small" /></TableCell>
                    <TableCell>{s.rating ? '★'.repeat(s.rating) + '☆'.repeat(5 - s.rating) : '-'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color={s.contractEnd && new Date(s.contractEnd) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) ? 'error' : 'text.primary'}>
                        {s.contractEnd || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={s.status || 'ACTIVE'} size="small" color={(s.status || 'ACTIVE') === 'ACTIVE' ? 'success' : 'default'} />
                      {s.isPreferred && <Star sx={{ fontSize: 14, color: '#f57c00', ml: 0.5 }} />}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                      <IconButton size="small" color="info"><Edit fontSize="small" /></IconButton>
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
