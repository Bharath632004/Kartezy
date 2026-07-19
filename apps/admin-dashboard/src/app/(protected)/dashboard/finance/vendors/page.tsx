"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Search, Add, Edit, Visibility } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function VendorsPage() {
  const { payoutsData, loading, fetchPayoutsData } = useFinanceStore();
  const [openCreate, setOpenCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayoutsData({});
  }, [fetchPayoutsData]);

  const displayedVendors = payoutsData?.length > 0
    ? payoutsData
        .filter((v: any) => 
          !searchTerm || 
          (v.name && v.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (v.code && v.code.includes(searchTerm))
        )
        .slice(0, 10)
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Vendors</Typography>
          <Typography variant="body2" color="text.secondary">Manage vendors and supplier relationships</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" onClick={() => setOpenCreate(true)}>Add Vendor</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField 
            size="small" 
            placeholder="Search by name, code, or GSTIN..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }} 
            slotProps={{ input: { startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> } }} 
          />
        </Box>
      </Paper>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading vendors...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Vendor Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>GSTIN</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Outstanding</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Credit</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No vendors found. Add a vendor to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedVendors.map((v: any) => (
                  <TableRow key={v.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{v.code || v.payoutId || `VND-${String(v.id).padStart(6, '0')}`}</Typography></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{v.name || v.merchantName || 'Vendor'}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{v.contact || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">{v.email || '-'}</Typography>
                    </TableCell>
                    <TableCell><Chip label={v.gstin || 'N/A'} size="small" variant="outlined" /></TableCell>
                    <TableCell>{v.city || '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: (v.amount || v.outstanding || 0) > 0 ? '#f57c00' : '#388e3c' }}>
                      ₹{((v.amount || v.outstanding || 0)).toLocaleString()}
                    </TableCell>
                    <TableCell>{v.creditDays || 30} days</TableCell>
                    <TableCell><Chip label={v.status || 'ACTIVE'} size="small" color={(v.status || 'ACTIVE') === 'ACTIVE' ? 'success' : 'default'} /></TableCell>
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

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vendor</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField size="small" label="Vendor Name" fullWidth />
            <TextField size="small" label="Contact Person" fullWidth />
            <TextField size="small" label="Email" fullWidth />
            <TextField size="small" label="Phone" fullWidth />
            <TextField size="small" label="GSTIN" fullWidth />
            <FormControl fullWidth size="small">
              <InputLabel>Credit Terms</InputLabel>
              <Select label="Credit Terms">
                <MenuItem value={15}>15 Days</MenuItem>
                <MenuItem value={30}>30 Days</MenuItem>
                <MenuItem value={45}>45 Days</MenuItem>
                <MenuItem value={60}>60 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenCreate(false)}>Save Vendor</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
