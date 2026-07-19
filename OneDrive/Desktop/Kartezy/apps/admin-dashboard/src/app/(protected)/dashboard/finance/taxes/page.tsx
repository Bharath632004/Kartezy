"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent } from '@mui/material';
import { Download, Receipt } from '@mui/icons-material';

const tdsRecords = [
  { id: 1, section: '194C', vendor: 'Rajesh Transport', entityId: 'PO-20260701-001', date: '2026-07-01', amount: 450000, tdsRate: 1.0, tdsAmount: 4500, status: 'DEDUCTED', dueDate: '2026-08-07' },
  { id: 2, section: '194C', vendor: 'Quick Logistics', entityId: 'PO-20260628-002', date: '2026-06-28', amount: 320000, tdsRate: 1.0, tdsAmount: 3200, status: 'DEPOSITED', dueDate: '2026-07-07' },
  { id: 3, section: '194J', vendor: 'Tech Solutions Pvt Ltd', entityId: 'INV-20260625-001', date: '2026-06-25', amount: 150000, tdsRate: 10.0, tdsAmount: 15000, status: 'DEDUCTED', dueDate: '2026-07-07' },
  { id: 4, section: '194H', vendor: 'Agency Network', entityId: 'INV-20260620-002', date: '2026-06-20', amount: 85000, tdsRate: 5.0, tdsAmount: 4250, status: 'DEDUCTED', dueDate: '2026-07-07' },
];

export default function TaxesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Tax Management</Typography>
          <Typography variant="body2" color="text.secondary">TDS, tax deductions, and compliance tracking</Typography>
        </Box>
        <Button startIcon={<Download />} variant="outlined">Download TDS Certificates</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'TDS Deducted (MTD)', value: '₹27,200', color: '#d32f2f' },
          { label: 'TDS Deposited', value: '₹3,200', color: '#388e3c' },
          { label: 'TDS Pending Deposit', value: '₹24,000', color: '#f57c00' },
          { label: 'Active Deductions', value: '3 sections', color: '#1976d2' },
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

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>TDS Records</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Section</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Deductee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Bill Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rate</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>TDS Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tdsRecords.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell><Chip label={r.section} size="small" color="primary" /></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{r.vendor}</TableCell>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.entityId}</Typography></TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>₹{r.amount.toLocaleString()}</TableCell>
                <TableCell>{r.tdsRate}%</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#d32f2f' }}>₹{r.tdsAmount.toLocaleString()}</TableCell>
                <TableCell>{r.dueDate}</TableCell>
                <TableCell><Chip label={r.status} size="small" color={r.status === 'DEPOSITED' ? 'success' : 'warning'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
