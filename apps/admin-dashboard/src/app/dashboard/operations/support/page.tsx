"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, Stack, Alert, AlertTitle,
  Avatar, LinearProgress,
} from '@mui/material';
import {
  Search, RefreshOutlined, Add, Edit, HeadsetMic, CheckCircle, ErrorOutlined, Assignment, Phone, Email, Chat,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const ticketPriorityColors: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  CRITICAL: 'error', URGENT: 'error', HIGH: 'warning', MEDIUM: 'info', LOW: 'success',
};

const ticketStatusColors: Record<string, 'warning' | 'info' | 'success' | 'error' | 'primary'> = {
  OPEN: 'warning', ASSIGNED: 'info', IN_PROGRESS: 'primary', WAITING_ON_CUSTOMER: 'warning', RESOLVED: 'success', CLOSED: 'default',
};

const channelIcons: Record<string, React.ReactNode> = {
  PHONE: <Phone fontSize="small" />, EMAIL: <Email fontSize="small" />, CHAT: <Chat fontSize="small" />,
  WHATSAPP: <Chat fontSize="small" />, PORTAL: <HeadsetMic fontSize="small" />, SOCIAL: <Chat fontSize="small" />,
};

export default function SupportOperations() {
  const { supportTickets, supportLoading, fetchSupportTickets, createSupportTicket, updateSupportTicket, assignTicket, resolveTicket } = useOperationsStore();
  const [search, setSearch] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', type: 'ORDER', priority: 'MEDIUM', channel: 'PORTAL', description: '' });
  const [detailDialog, setDetailDialog] = useState<{ open: boolean; ticket: any | null }>({ open: false, ticket: null });

  useEffect(() => { fetchSupportTickets(); }, [fetchSupportTickets]);

  const filtered = supportTickets.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
    t.ticketNumber.toLowerCase().includes(search.toLowerCase())
  );

  const urgentTickets = supportTickets.filter(t => t.priority === 'CRITICAL' || t.priority === 'URGENT').length;
  const openTickets = supportTickets.filter(t => t.status === 'OPEN').length;

  if (supportLoading && supportTickets.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Support Operations</Typography>
          <Typography variant="body2" color="text.secondary">{supportTickets.length} tickets &middot; {openTickets} open</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialog(true)}>New Ticket</Button>
          <Tooltip title="Refresh"><IconButton onClick={() => fetchSupportTickets()}><RefreshOutlined /></IconButton></Tooltip>
        </Box>
      </Box>

      {urgentTickets > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>{urgentTickets} Urgent/Critical Tickets Requiring Immediate Attention</AlertTitle>
        </Alert>
      )}

      <TextField fullWidth size="small" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Open', value: openTickets, color: 'warning.main' },
          { label: 'In Progress', value: supportTickets.filter(t => t.status === 'IN_PROGRESS').length, color: 'primary.main' },
          { label: 'Resolved Today', value: supportTickets.filter(t => t.status === 'RESOLVED').length, color: 'success.main' },
          { label: 'Avg Satisfaction', value: (supportTickets.filter(t => t.satisfactionScore).reduce((a, t) => a + (t.satisfactionScore ?? 0), 0) / Math.max(supportTickets.filter(t => t.satisfactionScore).length, 1)).toFixed(1), color: 'info.main' },
        ].map((stat) => (
          <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
            <Card sx={{ borderLeft: 4, borderColor: stat.color }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ticket</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="right">Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id} sx={{ '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }} onClick={() => setDetailDialog({ open: true, ticket: t })}>
                <TableCell><Chip label={t.ticketNumber} size="small" variant="outlined" /></TableCell>
                <TableCell><Typography fontWeight={600} noWrap sx={{ maxWidth: 200 }}>{t.subject}</Typography></TableCell>
                <TableCell>{t.customerName}</TableCell>
                <TableCell><Chip label={t.type} size="small" variant="outlined" /></TableCell>
                <TableCell><Chip label={t.priority} color={ticketPriorityColors[t.priority] ?? 'default'} size="small" /></TableCell>
                <TableCell><Chip label={t.status.replace(/_/g, ' ')} color={ticketStatusColors[t.status] ?? 'default'} size="small" /></TableCell>
                <TableCell>{t.assignedToName || 'Unassigned'}</TableCell>
                <TableCell align="right">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); setDetailDialog({ open: true, ticket: t }); }}>
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={9} align="center"><Typography color="text.secondary">No tickets found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Ticket Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Support Ticket</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Subject" fullWidth size="small" value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} />
            <TextField label="Description" fullWidth size="small" multiline rows={3} value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} />
            <FormControl fullWidth size="small"><InputLabel>Type</InputLabel>
              <Select value={newTicket.type} label="Type" onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}>
                <MenuItem value="ORDER">Order</MenuItem><MenuItem value="PAYMENT">Payment</MenuItem><MenuItem value="DELIVERY">Delivery</MenuItem>
                <MenuItem value="MERCHANT">Merchant</MenuItem><MenuItem value="ACCOUNT">Account</MenuItem><MenuItem value="TECHNICAL">Technical</MenuItem><MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small"><InputLabel>Priority</InputLabel>
              <Select value={newTicket.priority} label="Priority" onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}>
                <MenuItem value="LOW">Low</MenuItem><MenuItem value="MEDIUM">Medium</MenuItem><MenuItem value="HIGH">High</MenuItem><MenuItem value="URGENT">Urgent</MenuItem><MenuItem value="CRITICAL">Critical</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small"><InputLabel>Channel</InputLabel>
              <Select value={newTicket.channel} label="Channel" onChange={(e) => setNewTicket({ ...newTicket, channel: e.target.value })}>
                <MenuItem value="PHONE">Phone</MenuItem><MenuItem value="EMAIL">Email</MenuItem><MenuItem value="CHAT">Chat</MenuItem><MenuItem value="WHATSAPP">WhatsApp</MenuItem><MenuItem value="PORTAL">Portal</MenuItem><MenuItem value="SOCIAL">Social</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            await createSupportTicket(newTicket as any);
            setCreateDialog(false);
            setNewTicket({ subject: '', type: 'ORDER', priority: 'MEDIUM', channel: 'PORTAL', description: '' });
          }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, ticket: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={detailDialog.ticket?.ticketNumber} size="small" variant="outlined" />
            {detailDialog.ticket?.subject}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}><Typography variant="caption" color="text.secondary">Type</Typography><Typography>{detailDialog.ticket?.type}</Typography></Grid>
              <Grid size={{ xs: 4 }}><Typography variant="caption" color="text.secondary">Priority</Typography><Chip label={detailDialog.ticket?.priority} color={ticketPriorityColors[detailDialog.ticket?.priority as string] ?? 'default'} size="small" /></Grid>
              <Grid size={{ xs: 4 }}><Typography variant="caption" color="text.secondary">Status</Typography><Chip label={detailDialog.ticket?.status?.replace(/_/g, ' ')} color={ticketStatusColors[detailDialog.ticket?.status as string] ?? 'default'} size="small" /></Grid>
              <Grid size={{ xs: 4 }}><Typography variant="caption" color="text.secondary">Customer</Typography><Typography>{detailDialog.ticket?.customerName}</Typography></Grid>
              <Grid size={{ xs: 4 }}><Typography variant="caption" color="text.secondary">Channel</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>{channelIcons[detailDialog.ticket?.channel as string]}{detailDialog.ticket?.channel}</Box></Grid>
              <Grid size={{ xs: 4 }}><Typography variant="caption" color="text.secondary">Assigned To</Typography><Typography>{detailDialog.ticket?.assignedToName || 'Unassigned'}</Typography></Grid>
            </Grid>
            <Box><Typography variant="caption" color="text.secondary">Description</Typography><Typography variant="body2">{detailDialog.ticket?.description}</Typography></Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          {detailDialog.ticket?.status !== 'RESOLVED' && detailDialog.ticket?.status !== 'CLOSED' && (
            <>
              <Button onClick={async () => {
                if (detailDialog.ticket) {
                  await assignTicket(detailDialog.ticket.id, 'current-agent');
                  setDetailDialog({ ...detailDialog, ticket: { ...detailDialog.ticket, assignedTo: 'current-agent', assignedToName: 'Current Agent', status: 'ASSIGNED' } });
                }
              }} startIcon={<Assignment />}>Assign to Me</Button>
              <Button variant="contained" color="success" onClick={async () => {
                if (detailDialog.ticket) {
                  await resolveTicket(detailDialog.ticket.id);
                  setDetailDialog({ ...detailDialog, ticket: { ...detailDialog.ticket, status: 'RESOLVED' } });
                }
              }} startIcon={<CheckCircle />}>Resolve</Button>
            </>
          )}
          <Button onClick={() => setDetailDialog({ open: false, ticket: null })}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
