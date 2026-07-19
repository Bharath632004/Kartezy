"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, Switch, IconButton } from '@mui/material';
import { AutoAwesome, PlayArrow, Pause, Edit, Add, Schedule } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

const triggerColors: Record<string, string> = {
  SIGNUP: '#388e3c', CART_ABANDONED_24H: '#f57c00', BIRTHDAY: '#7b1fa2', INACTIVE_30D_HIGH_VALUE: '#d32f2f', ORDER_DELIVERED: '#1976d2', REFERRAL_CONVERTED: '#00838f', ORDER_COMPLETED_7D: '#4e342e',
};

const statusColors: Record<string, string> = {
  ACTIVE: '#388e3c', INACTIVE: '#757575', DRAFT: '#1976d2',
};

export default function AutomationPage() {
  const { transactionsData, loading, fetchTransactionsData } = useFinanceStore();

  useEffect(() => {
    fetchTransactionsData({});
  }, [fetchTransactionsData]);

  const rules = (transactionsData || []).slice(0, 8).map((t: any, idx: number) => ({
    id: t.id || idx + 1,
    name: t.description || t.type || `Automation Rule ${idx + 1}`,
    trigger: idx === 0 ? 'SIGNUP' : idx === 1 ? 'CART_ABANDONED_24H' : idx === 2 ? 'BIRTHDAY' : idx === 3 ? 'ORDER_DELIVERED' : 'REFERRAL_CONVERTED',
    action: idx === 0 ? 'SEND_EMAIL_CAMPAIGN' : idx === 1 ? 'SEND_WHATSAPP' : idx === 2 ? 'AWARD_LOYALTY_POINTS' : 'SEND_EMAIL',
    campaign: `Campaign ${idx + 1}`,
    status: t.status === 'failed' ? 'INACTIVE' : 'ACTIVE',
    runs: Math.round((t.amount || 100) / 10),
    lastRun: t.createdAt || '-',
  }));

  const activeCount = rules.filter((r: any) => r.status === 'ACTIVE').length;
  const inactiveCount = rules.filter((r: any) => r.status === 'INACTIVE').length;
  const draftCount = rules.filter((r: any) => r.status === 'DRAFT').length;
  const totalRuns = rules.reduce((s: number, r: any) => s + r.runs, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Marketing Automation</Typography>
          <Typography variant="body2" color="text.secondary">Automate marketing workflows based on triggers and customer behavior</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">Create Rule</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Rules', value: activeCount, color: '#388e3c', icon: <AutoAwesome /> },
          { label: 'Inactive', value: inactiveCount, color: '#757575', icon: <Pause /> },
          { label: 'Drafts', value: draftCount, color: '#1976d2', icon: <Schedule /> },
          { label: 'Total Executions (MTD)', value: totalRuns.toLocaleString(), color: '#f57c00', icon: <PlayArrow /> },
        ].map((s) => (
          <Grid size={{ xs: 3 }} key={s.label}>
            <Card><CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              </Box>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">Loading automation rules...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Rule Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trigger</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Campaign</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Executions</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Run</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No automation rules configured.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((r: any) => (
                  <TableRow key={r.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>
                    <TableCell><Chip label={r.trigger.replace(/_/g, ' ')} size="small" sx={{ bgcolor: `${triggerColors[r.trigger] || '#757575'}20`, color: triggerColors[r.trigger] || '#757575', fontWeight: 600, fontSize: 10 }} /></TableCell>
                    <TableCell><Chip label={r.action.replace(/_/g, ' ')} size="small" sx={{ bgcolor: `#1976d220`, color: '#1976d2', fontWeight: 600, fontSize: 10 }} /></TableCell>
                    <TableCell>{r.campaign}</TableCell>
                    <TableCell>{r.runs.toLocaleString()}</TableCell>
                    <TableCell><Typography variant="caption">{r.lastRun}</Typography></TableCell>
                    <TableCell><Chip label={r.status} size="small" sx={{ bgcolor: `${statusColors[r.status]}20`, color: statusColors[r.status], fontWeight: 600 }} /></TableCell>
                    <TableCell>
                      <Switch checked={r.status === 'ACTIVE'} size="small" />
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
