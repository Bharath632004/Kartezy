"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, TextField } from '@mui/material';
import { Download, Assessment } from '@mui/icons-material';

const gstReturns = [
  { period: '06/2026', type: 'GSTR-3B', status: 'PENDING', dueDate: '2026-07-20', outputGst: 126780, inputGst: 58350, netPayable: 68430, filedDate: '-' },
  { period: '05/2026', type: 'GSTR-3B', status: 'FILED', dueDate: '2026-06-20', outputGst: 112450, inputGst: 45230, netPayable: 67220, filedDate: '2026-06-18' },
  { period: '04/2026', type: 'GSTR-3B', status: 'FILED', dueDate: '2026-05-20', outputGst: 98300, inputGst: 42100, netPayable: 56200, filedDate: '2026-05-19' },
  { period: '03/2026', type: 'GSTR-3B', status: 'FILED', dueDate: '2026-04-20', outputGst: 87600, inputGst: 38900, netPayable: 48700, filedDate: '2026-04-18' },
];

const gstBreakdown = [
  { type: 'CGST', collected: 63400, paid: 29175, credit: 34225 },
  { type: 'SGST', collected: 63400, paid: 29175, credit: 34225 },
  { type: 'IGST', collected: 0, paid: 0, credit: 0 },
];

export default function GSTPage() {
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
          { label: 'Total Output GST (MTD)', value: '₹1,26,780', color: '#d32f2f' },
          { label: 'Total Input Credit (MTD)', value: '₹58,350', color: '#388e3c' },
          { label: 'Net GST Payable', value: '₹68,430', color: '#f57c00' },
          { label: 'Pending Returns', value: '1 (Jun 2026)', color: '#1976d2' },
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

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>GST Returns History</Typography>
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
                  <TableCell sx={{ fontWeight: 600 }}>Filed On</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gstReturns.map((r) => (
                  <TableRow key={r.period} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{r.period}</TableCell>
                    <TableCell><Chip label={r.type} size="small" /></TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#d32f2f' }}>₹{r.outputGst.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#388e3c' }}>₹{r.inputGst.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#f57c00' }}>₹{r.netPayable.toLocaleString()}</TableCell>
                    <TableCell>{r.dueDate}</TableCell>
                    <TableCell>{r.filedDate}</TableCell>
                    <TableCell><Chip label={r.status} size="small" color={r.status === 'FILED' ? 'success' : 'warning'} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>GST Breakdown (MTD)</Typography>
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
                    <TableCell sx={{ color: '#d32f2f' }}>₹{g.collected.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#388e3c' }}>₹{g.paid.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#f57c00' }}>₹{g.credit.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
