"use client";

import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, IconButton, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Search, Add, Edit, Visibility, Delete } from '@mui/icons-material';

const mockVendors = [
  { id: 1, code: 'VND-20260601-001', name: 'Dairy Fresh Ltd', contact: 'Rajesh Kumar', email: 'rajesh@dairyfresh.com', phone: '+91-9876543210', gstin: '27AABCU1234D1Z1', city: 'Mumbai', outstanding: 45000, status: 'ACTIVE', creditDays: 30 },
  { id: 2, code: 'VND-20260605-002', name: 'Samsung India', contact: 'Priya Sharma', email: 'priya@samsung.com', phone: '+91-9876543211', gstin: '07AABCU5678E1Z1', city: 'Delhi', outstanding: 105020, status: 'ACTIVE', creditDays: 45 },
  { id: 3, code: 'VND-20260610-003', name: 'Green Valley Farms', contact: 'Amit Singh', email: 'amit@greenvalley.com', phone: '+91-9876543212', gstin: '29AABCU9012F1Z1', city: 'Pune', outstanding: 37760, status: 'ACTIVE', creditDays: 30 },
  { id: 4, code: 'VND-20260615-004', name: 'ITC Limited', contact: 'Suresh Patel', email: 'suresh@itc.in', phone: '+91-9876543213', gstin: '24AABCU3456G1Z1', city: 'Kolkata', outstanding: 0, status: 'INACTIVE', creditDays: 60 },
  { id: 5, code: 'VND-20260620-005', name: 'Mother Dairy', contact: 'Neha Kapoor', email: 'neha@motherdairy.com', phone: '+91-9876543214', gstin: '27AABCU7890H1Z1', city: 'Mumbai', outstanding: 53100, status: 'ACTIVE', creditDays: 30 },
];

export default function VendorsPage() {
  const [openCreate, setOpenCreate] = useState(false);

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
          <TextField size="small" placeholder="Search by name, code, or GSTIN..." sx={{ flex: 1 }} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} />
        </Box>
      </Paper>

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
            {mockVendors.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{v.code}</Typography></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{v.name}</TableCell>
                <TableCell>
                  <Typography variant="body2">{v.contact}</Typography>
                  <Typography variant="caption" color="text.secondary">{v.email}</Typography>
                </TableCell>
                <TableCell><Chip label={v.gstin} size="small" variant="outlined" /></TableCell>
                <TableCell>{v.city}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: v.outstanding > 0 ? '#f57c00' : '#388e3c' }}>₹{v.outstanding.toLocaleString()}</TableCell>
                <TableCell>{v.creditDays} days</TableCell>
                <TableCell><Chip label={v.status} size="small" color={v.status === 'ACTIVE' ? 'success' : 'default'} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  <IconButton size="small" color="info"><Edit fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
