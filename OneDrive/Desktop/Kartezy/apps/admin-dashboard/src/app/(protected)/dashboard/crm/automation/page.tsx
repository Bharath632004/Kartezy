"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent, Switch, IconButton } from '@mui/material';
import { AutoAwesome, PlayArrow, Pause, Edit, Visibility, Add, Schedule } from '@mui/icons-material';

const rules = [
  { id: 1, name: 'Welcome Series', trigger: 'SIGNUP', action: 'SEND_EMAIL_CAMPAIGN', campaign: 'Welcome Email', status: 'ACTIVE', runs: 1245, lastRun: '2026-07-01 08:00' },
  { id: 2, name: 'Abandoned Cart', trigger: 'CART_ABANDONED_24H', action: 'SEND_WHATSAPP', campaign: 'Cart Recovery', status: 'ACTIVE', runs: 456, lastRun: '2026-07-01 09:15' },
  { id: 3, name: 'Birthday Reward', trigger: 'BIRTHDAY', action: 'AWARD_LOYALTY_POINTS', campaign: 'Birthday Bonus 100pts', status: 'ACTIVE', runs: 89, lastRun: '2026-07-01 06:00' },
  { id: 4, name: 'High Value Lapsing', trigger: 'INACTIVE_30D_HIGH_VALUE', action: 'SEND_EMAIL', campaign: 'Come Back - 10% Off', status: 'ACTIVE', runs: 234, lastRun: '2026-06-30 10:00' },
  { id: 5, name: 'Order Follow-up', trigger: 'ORDER_DELIVERED', action: 'SEND_SMS', campaign: 'Rate Your Experience', status: 'INACTIVE', runs: 0, lastRun: '-' },
  { id: 6, name: 'Referral Bonus', trigger: 'REFERRAL_CONVERTED', action: 'AWARD_BONUS', campaign: 'Referral Reward', status: 'ACTIVE', runs: 156, lastRun: '2026-07-01 07:30' },
  { id: 7, name: 'Feedback Request', trigger: 'ORDER_COMPLETED_7D', action: 'SEND_PUSH', campaign: 'Feedback Campaign', status: 'DRAFT', runs: 0, lastRun: '-' },
];

const triggerColors: Record<string, string> = {
  SIGNUP: '#388e3c', CART_ABANDONED_24H: '#f57c00', BIRTHDAY: '#7b1fa2', INACTIVE_30D_HIGH_VALUE: '#d32f2f', ORDER_DELIVERED: '#1976d2', REFERRAL_CONVERTED: '#00838f', ORDER_COMPLETED_7D: '#4e342e',
};

const actionColors: Record<string, string> = {
  SEND_EMAIL_CAMPAIGN: '#1976d2', SEND_WHATSAPP: '#25D366', AWARD_LOYALTY_POINTS: '#7b1fa2', SEND_EMAIL: '#1976d2', SEND_SMS: '#388e3c', AWARD_BONUS: '#00838f', SEND_PUSH: '#f57c00',
};

const statusColors: Record<string, string> = {
  ACTIVE: '#388e3c', INACTIVE: '#757575', DRAFT: '#1976d2',
};

export default function AutomationPage() {
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
          { label: 'Active Rules', value: 5, color: '#388e3c', icon: <AutoAwesome /> },
          { label: 'Inactive', value: 1, color: '#757575', icon: <Pause /> },
          { label: 'Drafts', value: 1, color: '#1976d2', icon: <Schedule /> },
          { label: 'Total Executions (MTD)', value: '2,180', color: '#f57c00', icon: <PlayArrow /> },
        ].map((s) => (
          <Grid item xs={3} key={s.label}>
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
            {rules.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>
                <TableCell><Chip label={r.trigger.replace(/_/g, ' ')} size="small" sx={{ bgcolor: `${triggerColors[r.trigger as keyof typeof triggerColors] || '#757575'}20`, color: triggerColors[r.trigger as keyof typeof triggerColors] || '#757575', fontWeight: 600, fontSize: 10 }} /></TableCell>
                <TableCell><Chip label={r.action.replace(/_/g, ' ')} size="small" sx={{ bgcolor: `${actionColors[r.action as keyof typeof actionColors] || '#757575'}20`, color: actionColors[r.action as keyof typeof actionColors] || '#757575', fontWeight: 600, fontSize: 10 }} /></TableCell>
                <TableCell>{r.campaign}</TableCell>
                <TableCell>{r.runs.toLocaleString()}</TableCell>
                <TableCell><Typography variant="caption">{r.lastRun}</Typography></TableCell>
                <TableCell><Chip label={r.status} size="small" sx={{ bgcolor: `${statusColors[r.status]}20`, color: statusColors[r.status], fontWeight: 600 }} /></TableCell>
                <TableCell>
                  <Switch checked={r.status === 'ACTIVE'} size="small" />
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
