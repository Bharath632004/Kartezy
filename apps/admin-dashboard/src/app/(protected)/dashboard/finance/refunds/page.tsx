"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Visibility, CheckCircle, Cancel } from '@mui/icons-material';

const refunds = [
  { id: 1, refNo: 'RFD-20260701-001', orderNo: 'ORD-45678', merchant: 'FreshMart Grocery', customer: 'Rahul S.', reason: 'Item damaged during delivery', amount: 1200, commissionRev: 60, deliveryRev: 50, netRefund: 1090, method: 'ORIGINAL', status: 'COMPLETED', date: '2026-07-01' },
  { id: 2, refNo: 'RFD-20260630-001', orderNo: 'ORD-45612', merchant: 'TechZone', customer: 'Priya K.', reason: 'Wrong product delivered', amount: 8900, commissionRev: 445, deliveryRev: 100, netRefund: 8355, method: 'WALLET', status: 'APPROVED', date: '2026-06-30' },
  { id: 3, refNo: 'RFD-20260628-001', orderNo: 'ORD-45589', merchant: 'BookWorld', customer: 'Amit S.', reason: 'Missing items in order', amount: 345, commissionRev: 17, deliveryRev: 0, netRefund: 328, method: 'ORIGINAL', status: 'PENDING_APPROVAL', date: '2026-06-28' },
  { id: 4, refNo: 'RFD-20260625-001', orderNo: 'ORD-45500', merchant: 'Organic Foods', customer: 'Neha M.', reason: 'Quality issues', amount: 2500, commissionRev: 125, deliveryRev: 50, netRefund: 2325, method: 'WALLET', status: 'PROCESSING', date: '2026-06-25' },
  { id: 5, refNo: 'RFD-20260620-001', orderNo: 'ORD-45421', merchant: 'Daily Needs', customer: 'Vikram J.', reason: 'Delayed delivery beyond SLA', amount: 800, commissionRev: 40, deliveryRev: 30, netRefund: 730, method: 'ORIGINAL', status: 'COMPLETED', date: '2026-06-20' },
];

export default function RefundsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Refund Accounting</Typography>
          <Typography variant="body2" color="text.secondary">Track and process refunds with commission reversals</Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Refunds (MTD)', value: '₹16,828', color: '#d32f2f' },
          { label: 'Pending Approval', value: 1, amount: '₹328', color: '#f57c00' },
          { label: 'Commission Reversed', value: '₹687', color: '#7b1fa2' },
          { label: 'Completion Rate', value: '60%', color: '#388e3c' },
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

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Refund #</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Merchant</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Net Refund</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refunds.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.refNo}</Typography></TableCell>
                <TableCell>{r.orderNo}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{r.merchant}</TableCell>
                <TableCell variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.reason}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>₹{r.amount.toLocaleString()}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#d32f2f' }}>₹{r.netRefund.toLocaleString()}</TableCell>
                <TableCell><Chip label={r.method} size="small" /></TableCell>
                <TableCell><Chip label={r.status.replace('_', ' ')} size="small" color={r.status === 'COMPLETED' ? 'success' : r.status === 'PENDING_APPROVAL' ? 'warning' : 'info'} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  {r.status === 'PENDING_APPROVAL' && <IconButton size="small" color="success"><CheckCircle fontSize="small" /></IconButton>}
                  {r.status === 'APPROVED' && <IconButton size="small" color="info"><CheckCircle fontSize="small" /></IconButton>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
