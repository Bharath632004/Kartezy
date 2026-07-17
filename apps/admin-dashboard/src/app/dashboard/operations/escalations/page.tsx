"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Stack, Alert, AlertTitle,
} from '@mui/material';
import {
  Search, RefreshOutlined, CheckCircle, Visibility, AddCommentOutlined,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const escalationPriorityColors: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  CRITICAL: 'error', URGENT: 'error', HIGH: 'warning', MEDIUM: 'info', LOW: 'success',
};

const escalationStatusColors: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
  OPEN: 'warning', ACKNOWLEDGED: 'info', INVESTIGATING: 'primary', RESOLVED: 'success', CLOSED: 'error',
};

const levelLabels: Record<number, string> = { 1: 'L1', 2: 'L2', 3: 'L3' };

export default function EscalationManagement() {
  const { escalations, escalationLoading, fetchEscalations, acknowledgeEscalation, resolveEscalation, addEscalationNote } = useOperationsStore();
  const [search, setSearch] = useState('');
  const [detailDialog, setDetailDialog] = useState<{ open: boolean; escalation: any | null }>({ open: false, escalation: null });
  const [resolveDialog, setResolveDialog] = useState<{ open: boolean; id: string; summary: string }>({ open: false, id: '', summary: '' });
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; id: string; content: string }>({ open: false, id: '', content: '' });

  useEffect(() => { fetchEscalations(); }, [fetchEscalations]);

  const filtered = escalations.filter((e) =>
    e.customerName.toLowerCase().includes(search.toLowerCase()) ||
    e.reason.toLowerCase().includes(search.toLowerCase()) ||
    (e.assignedToName || '').toLowerCase().includes(search.toLowerCase())
  );

  const urgentCount = escalations.filter(e => e.priority === 'URGENT' || e.priority === 'CRITICAL').length;
  const openCount = escalations.filter(e => e.status === 'OPEN').length;

  if (escalationLoading && escalations.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Escalation Management</Typography>
          <Typography variant="body2" color="text.secondary">{openCount} open &middot; {urgentCount} urgent</Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={() => fetchEscalations()}><RefreshOutlined /></IconButton>
        </Tooltip>
      </Box>

      {urgentCount > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>{urgentCount} Urgent/Critical Escalations</AlertTitle>
          {filtered.filter(e => e.priority === 'URGENT' || e.priority === 'CRITICAL').slice(0, 3).map((e) => (
            <Typography key={e.id} variant="body2" sx={{ mb: 0.5 }}>&bull; {e.reason} - {e.customerName} (Level {e.level})</Typography>
          ))}
        </Alert>
      )}

      <TextField
        fullWidth size="small" placeholder="Search escalations..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Open', value: openCount, color: 'warning.main' },
          { label: 'Investigating', value: escalations.filter(e => e.status === 'INVESTIGATING').length, color: 'primary.main' },
          { label: 'L3 Escalations', value: escalations.filter(e => e.level === 3).length, color: 'error.main' },
          { label: 'Resolved', value: escalations.filter(e => e.status === 'RESOLVED').length, color: 'success.main' },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
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
              <TableCell>Escalation</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Raised By</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="right">Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((esc) => (
              <TableRow
                key={esc.id} sx={{ '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }}
                onClick={() => setDetailDialog({ open: true, escalation: esc })}
              >
                <TableCell><Chip label={`#${esc.id.slice(0, 8)}`} size="small" variant="outlined" /></TableCell>
                <TableCell><Typography fontWeight={600} noWrap sx={{ maxWidth: 200 }}>{esc.reason}</Typography></TableCell>
                <TableCell>
                  <Chip
                    label={levelLabels[esc.level] ?? `L${esc.level}`}
                    color={esc.level === 3 ? 'error' : esc.level === 2 ? 'warning' : 'info'}
                    size="small"
                  />
                </TableCell>
                <TableCell><Chip label={esc.priority} color={escalationPriorityColors[esc.priority] ?? 'default'} size="small" /></TableCell>
                <TableCell><Chip label={esc.status.replace(/_/g, ' ')} color={escalationStatusColors[esc.status] ?? 'default'} size="small" /></TableCell>
                <TableCell>{esc.customerName}</TableCell>
                <TableCell>{esc.raisedByName}</TableCell>
                <TableCell>{esc.assignedToName || 'Unassigned'}</TableCell>
                <TableCell align="right">{new Date(esc.createdAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex' }}>
                    {esc.status === 'OPEN' && (
                      <Tooltip title="Acknowledge">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); acknowledgeEscalation(esc.id); }}>
                          <CheckCircle fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {esc.status !== 'RESOLVED' && esc.status !== 'CLOSED' && (
                      <Tooltip title="Add Note">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setNoteDialog({ open: true, id: esc.id, content: '' }); }}>
                          <AddCommentOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); setDetailDialog({ open: true, escalation: esc }); }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={10} align="center"><Typography color="text.secondary">No escalations found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, escalation: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Escalation Details
            <Chip label={detailDialog.escalation?.priority} color={escalationPriorityColors[detailDialog.escalation?.priority as string] ?? 'default'} size="small" />
            <Chip label={detailDialog.escalation?.status?.replace(/_/g, ' ')} color={escalationStatusColors[detailDialog.escalation?.status as string] ?? 'default'} size="small" />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">Level</Typography>
                <Typography>{levelLabels[detailDialog.escalation?.level as number] ?? `L${detailDialog.escalation?.level}`}</Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">Customer</Typography>
                <Typography>{detailDialog.escalation?.customerName}</Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                <Typography>{detailDialog.escalation?.assignedToName || 'Unassigned'}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">Reason</Typography>
                <Typography>{detailDialog.escalation?.reason}</Typography>
              </Grid>
              {detailDialog.escalation?.resolutionSummary && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">Resolution</Typography>
                  <Typography>{detailDialog.escalation.resolutionSummary}</Typography>
                </Grid>
              )}
            </Grid>
            {detailDialog.escalation?.notes && detailDialog.escalation.notes.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Notes</Typography>
                {detailDialog.escalation.notes.map((note: any) => (
                  <Paper key={note.id} sx={{ p: 1.5, mb: 1, bgcolor: 'grey.50' }}>
                    <Typography variant="body2">{note.content}</Typography>
                    <Typography variant="caption" color="text.secondary">{note.authorName} &middot; {new Date(note.createdAt).toLocaleString()}</Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          {detailDialog.escalation?.status === 'OPEN' && (
            <Button
              onClick={async () => {
                if (detailDialog.escalation) {
                  await acknowledgeEscalation(detailDialog.escalation.id);
                  setDetailDialog({ ...detailDialog, escalation: { ...detailDialog.escalation, status: 'ACKNOWLEDGED' } });
                }
              }}
              startIcon={<CheckCircle />}
            >
              Acknowledge
            </Button>
          )}
          {detailDialog.escalation?.status !== 'RESOLVED' && detailDialog.escalation?.status !== 'CLOSED' && (
            <>
              <Button
                onClick={() => {
                  if (detailDialog.escalation) setNoteDialog({ open: true, id: detailDialog.escalation.id, content: '' });
                }}
                startIcon={<AddCommentOutlined />}
              >
                Add Note
              </Button>
              <Button
                variant="contained" color="success"
                onClick={() => {
                  if (detailDialog.escalation) setResolveDialog({ open: true, id: detailDialog.escalation.id, summary: '' });
                }}
                startIcon={<CheckCircle />}
              >
                Resolve
              </Button>
            </>
          )}
          <Button onClick={() => setDetailDialog({ open: false, escalation: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialog.open} onClose={() => setResolveDialog({ open: false, id: '', summary: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>Resolve Escalation</DialogTitle>
        <DialogContent>
          <TextField
            label="Resolution Summary" fullWidth multiline rows={3} sx={{ mt: 1 }}
            value={resolveDialog.summary}
            onChange={(e) => setResolveDialog({ ...resolveDialog, summary: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveDialog({ open: false, id: '', summary: '' })}>Cancel</Button>
          <Button
            variant="contained" color="success"
            onClick={async () => {
              await resolveEscalation(resolveDialog.id, resolveDialog.summary);
              setResolveDialog({ open: false, id: '', summary: '' });
              setDetailDialog({ open: false, escalation: null });
            }}
          >
            Resolve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={noteDialog.open} onClose={() => setNoteDialog({ open: false, id: '', content: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            label="Note" fullWidth multiline rows={3} sx={{ mt: 1 }}
            value={noteDialog.content}
            onChange={(e) => setNoteDialog({ ...noteDialog, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialog({ open: false, id: '', content: '' })}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await addEscalationNote(noteDialog.id, noteDialog.content);
              setNoteDialog({ open: false, id: '', content: '' });
            }}
          >
            Add Note
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
