"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { CheckCircle, Warning, Sync, PlayArrow } from '@mui/icons-material';

const reconciliationItems = [
  { id: 1, bankTxn: 'HDFC-20260701-001', bankDesc: 'Payment from ORD-45678', bankAmount: 53100, sysRef: 'PAY-20260701-001', sysAmount: 53100, diff: 0, matchType: 'EXACT', status: 'MATCHED' },
  { id: 2, bankTxn: 'HDFC-20260630-001', bankDesc: 'Settlement - FreshMart', bankAmount: 400000, sysRef: 'STL-20260630-001', sysAmount: 397944, diff: 2056, matchType: 'PARTIAL', status: 'PARTIALLY_MATCHED' },
  { id: 3, bankTxn: 'HDFC-20260629-001', bankDesc: 'Commission deposit', bankAmount: 28500, sysRef: 'COM-20260629-001', sysAmount: 28500, diff: 0, matchType: 'EXACT', status: 'MATCHED' },
  { id: 4, bankTxn: 'HDFC-20260628-001', bankDesc: 'GST payment', bankAmount: 68430, sysRef: 'GST-202606-001', sysAmount: 68430, diff: 0, matchType: 'EXACT', status: 'MATCHED' },
  { id: 5, bankTxn: 'HDFC-20260627-001', bankDesc: 'Unknown credit', bankAmount: 12500, sysRef: '-', sysAmount: 0, diff: 12500, matchType: null, status: 'UNMATCHED' },
];

export default function ReconciliationPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Payment Reconciliation</Typography>
          <Typography variant="body2" color="text.secondary">Reconcile bank transactions with system records</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Sync />} variant="outlined">Import Bank Data</Button>
          <Button startIcon={<PlayArrow />} variant="contained">Auto-Reconcile</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Matched', value: 3, amount: '₹1,50,030', color: '#388e3c' },
          { label: 'Partial Match', value: 1, amount: '₹2,056 diff', color: '#f57c00' },
          { label: 'Unmatched', value: 1, amount: '₹12,500', color: '#d32f2f' },
          { label: 'Match Rate', value: '75%', color: '#1976d2' },
        ].map((stat) => (
          <Grid item xs={3} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color, mt: 0.5 }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.amount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Bank Transaction</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Bank Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>System Ref</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>System Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Difference</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Match Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reconciliationItems.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.bankTxn}</Typography></TableCell>
                <TableCell>{r.bankDesc}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>₹{r.bankAmount.toLocaleString()}</TableCell>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.sysRef}</Typography></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>₹{r.sysAmount.toLocaleString()}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: r.diff === 0 ? '#388e3c' : '#d32f2f' }}>{r.diff === 0 ? '-' : `₹${r.diff.toLocaleString()}`}</TableCell>
                <TableCell>{r.matchType && <Chip label={r.matchType} size="small" color={r.matchType === 'EXACT' ? 'success' : 'warning'} />}</TableCell>
                <TableCell><Chip label={r.status.replace('_', ' ')} size="small" color={r.status === 'MATCHED' ? 'success' : r.status === 'PARTIALLY_MATCHED' ? 'warning' : 'error'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
