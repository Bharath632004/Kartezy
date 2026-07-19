"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Download, Assessment, Receipt, AttachMoney, AccountBalance, ShowChart, Description } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

const reportTemplates = [
  { name: 'Profit & Loss Statement', icon: <Assessment />, color: '#1976d2', desc: 'Revenue, expenses, and net profit summary' },
  { name: 'Financial Summary', icon: <AccountBalance />, color: '#388e3c', desc: 'Overall financial health snapshot' },
  { name: 'Revenue Report', icon: <ShowChart />, color: '#f57c00', desc: 'Revenue breakdown by source and period' },
  { name: 'Transaction Log', icon: <Receipt />, color: '#7b1fa2', desc: 'All financial transactions' },
  { name: 'Tax Summary', icon: <AttachMoney />, color: '#00838f', desc: 'GST, TDS, and other tax summaries' },
  { name: 'Commission Report', icon: <Description />, color: '#c62828', desc: 'Commission earnings breakdown' },
];

export default function ReportsPage() {
  const { overview, loading, fetchOverview } = useFinanceStore();
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    if (overview) {
      setRecentReports([
        { name: 'Financial Summary', type: 'FINANCIAL_SUMMARY', generated: new Date().toISOString().split('T')[0], by: 'System (Auto)', status: 'GENERATED' },
      ]);
    }
  }, [overview]);

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
        {reportTemplates.map((r) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.name}>
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
      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading reports...</Typography>
      ) : (
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
              {recentReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No reports generated yet. Generate a report from templates above.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recentReports.map((r, idx) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
