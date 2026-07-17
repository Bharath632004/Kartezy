"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, Stack, Button, TextField, MenuItem,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, IconButton, Chip, LinearProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Avatar, Divider, Alert, Tooltip,
} from '@mui/material';
import { useCRMStore, type Lead } from '@/store/crmStore';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import ConversionIcon from '@mui/icons-material/TaskAlt';

const statusColors: Record<string, string> = {
  NEW: '#2196f3',
  CONTACTED: '#ff9800',
  QUALIFIED: '#9c27b0',
  PROPOSAL: '#00bcd4',
  NEGOTIATION: '#ff5722',
  WON: '#4caf50',
  LOST: '#f44336',
};

const sourceIcons: Record<string, string> = {
  WEBSITE: '🌐',
  REFERRAL: '👥',
  SOCIAL: '📱',
  EMAIL: '📧',
  ADS: '📢',
  ORGANIC: '🔍',
};

export default function LeadsPage() {
  const {
    leads, leadLoading, leadError,
    fetchLeads, createLead, updateLead, deleteLead,
  } = useCRMStore();

  const [filters, setFilters] = useState({ search: '', status: '', source: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Partial<Lead> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { fetchLeads(filters); }, [filters, fetchLeads]);

  const handleOpenCreate = () => {
    setEditingLead({
      name: '', email: '', phone: '', source: 'WEBSITE', status: 'NEW',
      score: 0, tags: [], notes: '',
    });
    setIsEdit(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setEditingLead({ ...lead });
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingLead) return;
    try {
      if (isEdit && editingLead.id) {
        await updateLead(editingLead.id, editingLead);
      } else {
        await createLead(editingLead);
      }
      setDialogOpen(false);
      setEditingLead(null);
      fetchLeads(filters);
    } catch (err) {
      console.error('Error saving lead:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      setConfirmDelete(null);
      fetchLeads(filters);
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  if (leadError) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" action={<Button onClick={() => fetchLeads()} size="small">Retry</Button>}>
          {leadError}
        </Alert>
      </Container>
    );
  }

  const wonLeads = leads.filter(l => l.status === 'WON');
  const conversionRate = leads.length > 0 ? (wonLeads.length / leads.length) * 100 : 0;
  const avgScore = leads.length > 0 ? leads.reduce((s, l) => s + l.score, 0) / leads.length : 0;

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Lead Management</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Add Lead
          </Button>
        </Stack>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Leads</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{leads.length}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                    <PeopleIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">Conversion Rate</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: 'success.main' }}>
                      {conversionRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                    <ConversionIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">Avg Score</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{avgScore.toFixed(0)}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'secondary.light', width: 48, height: 48 }}>
                    <TrendingUpIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">Won</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: 'success.main' }}>
                      {wonLeads.length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                    <TrendingUpIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pipeline Kanban-style */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Pipeline Overview</Typography>
          <Grid container spacing={1.5}>
            {['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'].map((status) => {
              const count = leads.filter(l => l.status === status).length;
              const total = leads.length;
              return (
                <Grid key={status} size={{ xs: 12, sm: 6, md: 12 / 7 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5, borderRadius: 2, textAlign: 'center',
                      borderLeft: 3, borderColor: statusColors[status],
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600, color: statusColors[status] }}>
                      {status}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5 }}>{count}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={total > 0 ? (count / total) * 100 : 0}
                      sx={{ borderRadius: 2, height: 4, bgcolor: `${statusColors[status]}20` }}
                      color={getScoreColor(count > 0 ? 80 : 0)}
                    />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        {/* Filters */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              size="small" placeholder="Search leads..."
              value={filters.search}
              onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
              sx={{ minWidth: 250 }}
              slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
            />
            <TextField
              select size="small" label="Status" value={filters.status}
              onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'].map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField
              select size="small" label="Source" value={filters.source}
              onChange={(e) => setFilters(p => ({ ...p, source: e.target.value }))}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Sources</MenuItem>
              {['WEBSITE', 'REFERRAL', 'SOCIAL', 'EMAIL', 'ADS', 'ORGANIC'].map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </Paper>

        {/* Leads Table */}
        {leadLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography color="text.secondary">Loading leads...</Typography>
          </Box>
        ) : leads.length === 0 ? (
          <Paper elevation={1} sx={{ py: 6, textAlign: 'center', borderRadius: 2 }}>
            <PersonAddIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No leads found</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>Start by adding your first lead</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>Add Lead</Button>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Lead</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Score</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
                            {lead.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{lead.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{lead.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {sourceIcons[lead.source] || '📌'} {lead.source}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={lead.status}
                          size="small"
                          sx={{ bgcolor: statusColors[lead.status], color: '#fff', fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={`Score: ${lead.score}/100`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate" value={lead.score}
                              color={getScoreColor(lead.score)}
                              sx={{ width: 60, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{lead.score}</Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{lead.createdAt}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{lead.assignedTo || '-'}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <IconButton size="small" onClick={() => handleOpenEdit(lead)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => setConfirmDelete(lead.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{isEdit ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Name" fullWidth value={editingLead?.name || ''}
                onChange={(e) => setEditingLead(p => ({ ...p!, name: e.target.value }))} />
              <TextField label="Email" fullWidth value={editingLead?.email || ''}
                onChange={(e) => setEditingLead(p => ({ ...p!, email: e.target.value }))} />
              <TextField label="Phone" fullWidth value={editingLead?.phone || ''}
                onChange={(e) => setEditingLead(p => ({ ...p!, phone: e.target.value }))} />
              <TextField select label="Source" fullWidth value={editingLead?.source || 'WEBSITE'}
                onChange={(e) => setEditingLead(p => ({ ...p!, source: e.target.value }))}>
                {['WEBSITE', 'REFERRAL', 'SOCIAL', 'EMAIL', 'ADS', 'ORGANIC', 'OTHER'].map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
              <TextField select label="Status" fullWidth value={editingLead?.status || 'NEW'}
                onChange={(e) => setEditingLead(p => ({ ...p!, status: e.target.value }))}>
                {['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'].map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
              <TextField label="Lead Score (0-100)" type="number" fullWidth value={editingLead?.score || 0}
                onChange={(e) => setEditingLead(p => ({ ...p!, score: parseInt(e.target.value) || 0 }))} />
              <TextField label="Assigned To" fullWidth value={editingLead?.assignedTo || ''}
                onChange={(e) => setEditingLead(p => ({ ...p!, assignedTo: e.target.value }))} />
              <TextField label="Notes" fullWidth multiline rows={3} value={editingLead?.notes || ''}
                onChange={(e) => setEditingLead(p => ({ ...p!, notes: e.target.value }))} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {isEdit ? 'Update Lead' : 'Create Lead'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} maxWidth="xs">
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this lead? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={() => confirmDelete && handleDelete(confirmDelete)}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
