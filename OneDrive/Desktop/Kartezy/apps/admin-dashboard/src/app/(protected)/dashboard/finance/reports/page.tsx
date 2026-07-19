"use client";

import { Box, Typography, Paper, Grid, Card, CardContent, Button, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Download, Assessment, Receipt, AttachMoney, AccountBalance, ShowChart, Description } from '@mui/icons-material';

const reportTypes = [
  { name: 'Profit & Loss Statement', icon: <Assessment />, color: '#1976d2', desc: 'Revenue, expenses, and net profit summary' },
  { name: 'Balance Sheet', icon: <AccountBalance />, color: '#388e3c', desc: 'Assets, liabilities, and equity snapshot' },
  { name: 'Cash Flow Statement', icon: <AttachMoney />, color: '#f57c00', desc: 'Operating, investing, and financing activities' },
  { name: 'Revenue Report', icon: <ShowChart />, color: '#7b1fa2', desc: 'Revenue breakdown by source and period' },
  { name: 'Tax Summary', icon: <Receipt />, color: '#00838f', desc: 'GST, TDS, and other tax summaries' },
  { name: 'Vendor Aging', icon: <Description />, color: '#c62828', desc: 'Accounts payable aging analysis' },
];

const recentReports = [
  { name: 'P&L Statement - June 2026', type: 'PROFIT_LOSS', generated: '2026-07-01', by: 'System (Auto)', status: 'GENERATED' },
  { name: 'Balance Sheet - As of Jun 2026', type: 'BALANCE_SHEET', generated: '2026-07-01', by: 'System (Auto)', status: 'GENERATED' },
  { name: 'Cash Flow - June 2026', type: 'CASH_FLOW', generated: '2026-07-01', by: 'System (Auto)', status: 'GENERATED' },
  { name: 'GST Summary - Q2 2026', type: 'TAX', generated: '2026-06-30', by: 'finance@kartezy.com', status: 'APPROVED' },
  { name: 'Monthly Revenue Report - Jun', type: 'REVENUE', generated: '2026-06-30', by: 'finance@kartezy.com', status: 'APPROVED' },
];

export default function ReportsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Finance Reports</Typography>
          <Typography variant="body2" color="text.secondary">Generate and download financial reports</Typography>
        </Box>
        <Button startIcon={<Download />} variant="contained">Download All</Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Report Templates</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {reportTypes.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.name}>
            <Card sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${r.color}15`, display: 'flex' }}>
                    {r.icon}
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: r.color }}>{r.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.desc}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button size="small" variant="contained" sx={{ bgcolor: r.color, '&:hover': { bgcolor: r.color } }}>
                    Generate
                  </Button>
                  <Button size="small" variant="outlined">Schedule</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Recent Reports</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Report Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Generated</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>By</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentReports.map((r, idx) => (
              <TableRow key={idx} hover>
                <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>
                <TableCell><Chip label={r.type.replace('_', ' ')} size="small" /></TableCell>
                <TableCell>{r.generated}</TableCell>
                <TableCell>{r.by}</TableCell>
                <TableCell><Chip label={r.status} size="small" color={r.status === 'APPROVED' ? 'success' : 'info'} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><Download fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
