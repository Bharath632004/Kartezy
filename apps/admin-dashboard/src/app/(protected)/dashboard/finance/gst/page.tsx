"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, TextField } from '@mui/material';
import { Download } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

export default function GSTPage() {
  const { overview, loading, fetchOverview } = useFinanceStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const totalRevenue = overview?.totalRevenue || 0;
  const outputGst = Math.round(totalRevenue * 0.18);
  const inputCredit = Math.round(totalRevenue * 0.05);
  const netPayable = outputGst - inputCredit;

  const gstReturns = [
    { period: 'Current', type: 'GSTR-3B', status: 'PENDING', dueDate: '-', outputGst, inputGst: inputCredit, netPayable, filedDate: '-' },
  ];

  const gstBreakdown = [
    { type: 'CGST', collected: Math.round(outputGst / 2), paid: Math.round(inputCredit / 2), credit: Math.round(netPayable / 2) },
    { type: 'SGST', collected: Math.round(outputGst / 2), paid: Math.round(inputCredit / 2), credit: Math.round(netPayable / 2) },
    { type: 'IGST', collected: 0, paid: 0, credit: 0 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>GST Management</Typography>
          <Typography variant="body2" color="text.secondary">GST returns, input credit, and compliance</Typography>
        </Box>
        <Button startIcon={<Download />} variant="outlined">Download GSTR-2A</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Output GST', value: `₹${outputGst.toLocaleString()}`, color: '#d32f2f' },
          { label: 'Total Input Credit', value: `₹${inputCredit.toLocaleString()}`, color: '#388e3c' },
          { label: 'Net GST Payable', value: `₹${netPayable.toLocaleString()}`, color: '#f57c00' },
          { label: 'Pending Returns', value: overview ? '1' : '0', color: '#1976d2' },
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

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading GST data...</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>GST Returns</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Return</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Output GST</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Input Credit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Net Payable</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gstReturns.map((r) => (
                    <TableRow key={r.period} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{r.period}</TableCell>
                      <TableCell><Chip label={r.type} size="small" /></TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#d32f2f' }}>₹{(r.outputGst || 0).toLocaleString()}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#388e3c' }}>₹{(r.inputGst || 0).toLocaleString()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#f57c00' }}>₹{(r.netPayable || 0).toLocaleString()}</TableCell>
                      <TableCell>{r.dueDate}</TableCell>
                      <TableCell><Chip label={r.status} size="small" color="warning" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>GST Breakdown</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Collected</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Input</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Net</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gstBreakdown.map((g) => (
                    <TableRow key={g.type} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{g.type}</TableCell>
                      <TableCell sx={{ color: '#d32f2f' }}>₹{(g.collected || 0).toLocaleString()}</TableCell>
                      <TableCell sx={{ color: '#388e3c' }}>₹{(g.paid || 0).toLocaleString()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#f57c00' }}>₹{(g.credit || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
