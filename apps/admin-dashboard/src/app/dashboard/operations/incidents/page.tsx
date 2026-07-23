"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, Stack, LinearProgress,
  Alert, AlertTitle,
} from '@mui/material';
import {
  Search, RefreshOutlined, Add, Edit, ReportProblem, CheckCircle, WarningAmber,
  ErrorOutlined, BugReport, Security, Storage, Devices,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const severityColors: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  BLOCKER: 'error', CRITICAL: 'error', HIGH: 'warning', MEDIUM: 'info', LOW: 'success',
};

const incidentStatusColors: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
  DETECTED: 'warning', ACKNOWLEDGED: 'info', INVESTIGATING: 'primary', MITIGATING: 'warning', RESOLVED: 'success', CLOSED: 'default',
};

const categoryIcons: Record<string, React.ReactNode> = {
  INFRASTRUCTURE: <Storage />, APPLICATION: <BugReport />, DELIVERY: <WarningAmber />,
  PAYMENT: <WarningAmber />, SECURITY: <Security />, MERCHANT: <Devices />, CUSTOMER: <Devices />, THIRD_PARTY: <Devices />,
};

export default function IncidentTracking() {
  const { incidents, incidentLoading, fetchIncidents, createIncident, acknowledgeIncident, resolveIncident, selectedIncident, setSelectedIncident, fetchIncidentById } = useOperationsStore();
  const [search, setSearch] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [detailDialog, setDetailDialog] = useState<{ open: boolean; incident: any | null }>({ open: false, incident: null });
  const [resolveDialog, setResolveDialog] = useState<{ open: boolean; incidentId: string; resolution: string; rootCause: string }>({ open: false, incidentId: '', resolution: '', rootCause: '' });
  const [newIncident, setNewIncident] = useState({ title: '', description: '', severity: 'HIGH', category: 'APPLICATION', source: 'MONITORING' });

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  const filtered = incidents.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase()) ||
    (i.assignedToName || '').toLowerCase().includes(search.toLowerCase())
  );

  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'BLOCKER').length;
  const activeCount = incidents.filter(i => !['RESOLVED', 'CLOSED'].includes(i.status)).length;

  if (incidentLoading && incidents.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Incident Tracking</Typography>
          <Typography variant="body2" color="text.secondary">{activeCount} active &middot; {criticalCount} critical</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialog(true)}>Report Incident</Button>
          <Tooltip title="Refresh"><IconButton onClick={() => fetchIncidents()}><RefreshOutlined /></IconButton></Tooltip>
        </Box>
      </Box>

      {criticalCount > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>{criticalCount} Critical/Blocker {criticalCount === 1 ? 'Incident' : 'Incidents'} - Immediate Action Required</AlertTitle>
        </Alert>
      )}

      <TextField fullWidth size="small" placeholder="Search incidents..." value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active', value: activeCount, color: 'warning.main' },
          { label: 'Investigating', value: incidents.filter(i => i.status === 'INVESTIGATING').length, color: 'primary.main' },
          { label: 'Resolved Today', value: incidents.filter(i => i.status === 'RESOLVED').length, color: 'success.main' },
          { label: 'Total This Month', value: incidents.length, color: 'info.main' },
        ].map((stat) => (
          <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
            <Card sx={{ borderLeft: 4, borderColor: stat.color }}>
              <CardContent><Typography variant="body2" color="text.secondary">{stat.label}</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography></CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="right">Detected</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((inc) => (
              <TableRow key={inc.id} sx={{ '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }} onClick={() => { fetchIncidentById(inc.id); setDetailDialog({ open: true, incident: inc }); }}>
                <TableCell><Typography sx={{ fontWeight: 600 }} noWrap sx={{ maxWidth: 250 }}>{inc.title}</Typography></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {categoryIcons[inc.category] ?? <BugReport fontSize="small" />}
                    <Typography variant="caption">{inc.category.replace('_', ' ')}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Chip label={inc.severity} color={severityColors[inc.severity] ?? 'default'} size="small" /></TableCell>
                <TableCell><Chip label={inc.status.replace(/_/g, ' ')} color={incidentStatusColors[inc.status] ?? 'default'} size="small" /></TableCell>
                <TableCell><Chip label={inc.source.replace('_', ' ')} size="small" variant="outlined" /></TableCell>
                <TableCell>{inc.assignedToName || 'Unassigned'}</TableCell>
                <TableCell align="right">{new Date(inc.detectedAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  {inc.resolvedAt
                    ? `${Math.round((new Date(inc.resolvedAt).getTime() - new Date(inc.detectedAt).getTime()) / 60000)} min`
                    : '-'}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); setDetailDialog({ open: true, incident: inc }); }}>
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={9} align="center"><Typography color="text.secondary">No incidents found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Incident Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report Incident</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" fullWidth size="small" value={newIncident.title} onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })} />
            <TextField label="Description" fullWidth size="small" multiline rows={3} value={newIncident.description} onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })} />
            <FormControl fullWidth size="small"><InputLabel>Severity</InputLabel>
              <Select value={newIncident.severity} label="Severity" onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}>
                <MenuItem value="LOW">Low</MenuItem><MenuItem value="MEDIUM">Medium</MenuItem><MenuItem value="HIGH">High</MenuItem><MenuItem value="CRITICAL">Critical</MenuItem><MenuItem value="BLOCKER">Blocker</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small"><InputLabel>Category</InputLabel>
              <Select value={newIncident.category} label="Category" onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}>
                <MenuItem value="INFRASTRUCTURE">Infrastructure</MenuItem><MenuItem value="APPLICATION">Application</MenuItem>
                <MenuItem value="DELIVERY">Delivery</MenuItem><MenuItem value="PAYMENT">Payment</MenuItem>
                <MenuItem value="SECURITY">Security</MenuItem><MenuItem value="MERCHANT">Merchant</MenuItem>
                <MenuItem value="CUSTOMER">Customer</MenuItem><MenuItem value="THIRD_PARTY">Third Party</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small"><InputLabel>Source</InputLabel>
              <Select value={newIncident.source} label="Source" onChange={(e) => setNewIncident({ ...newIncident, source: e.target.value })}>
                <MenuItem value="MONITORING">Monitoring</MenuItem><MenuItem value="ALERT">Alert</MenuItem>
                <MenuItem value="CUSTOMER_REPORT">Customer Report</MenuItem><MenuItem value="MERCHANT_REPORT">Merchant Report</MenuItem>
                <MenuItem value="TEAM">Team</MenuItem><MenuItem value="AUTOMATED">Automated</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            await createIncident(newIncident as any);
            setCreateDialog(false);
            setNewIncident({ title: '', description: '', severity: 'HIGH', category: 'APPLICATION', source: 'MONITORING' });
          }}>Report</Button>
        </DialogActions>
      </Dialog>

      {/* Incident Detail Dialog */}
      <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, incident: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {detailDialog.incident?.title}
            <Chip label={detailDialog.incident?.severity} color={severityColors[detailDialog.incident?.severity as string] ?? 'default'} size="small" />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}><Typography variant="caption" color="text.secondary">Category</Typography><Typography>{detailDialog.incident?.category?.replace(/_/g, ' ')}</Typography></Grid>
              <Grid size={{ xs: 4 }}><Typography variant="caption" color="text.secondary">Status</Typography><Chip label={detailDialog.incident?.status?.replace(/_/g, ' ')} color={incidentStatusColors[detailDialog.incident?.status as string] ?? 'default'} size="small" /></Grid>
              <Grid size={{ xs: 4 }}><Typography variant="caption" color="text.secondary">Source</Typography><Typography>{detailDialog.incident?.source?.replace(/_/g, ' ')}</Typography></Grid>
              <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Detected At</Typography><Typography>{detailDialog.incident?.detectedAt ? new Date(detailDialog.incident.detectedAt).toLocaleString() : '-'}</Typography></Grid>
              <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Assigned To</Typography><Typography>{detailDialog.incident?.assignedToName || 'Unassigned'}</Typography></Grid>
              {detailDialog.incident?.rootCause && <Grid size={12}><Typography variant="caption" color="text.secondary">Root Cause</Typography><Typography>{detailDialog.incident.rootCause}</Typography></Grid>}
              {detailDialog.incident?.resolution && <Grid size={12}><Typography variant="caption" color="text.secondary">Resolution</Typography><Typography>{detailDialog.incident.resolution}</Typography></Grid>}
            </Grid>
            <Box><Typography variant="caption" color="text.secondary">Description</Typography><Typography variant="body2">{detailDialog.incident?.description}</Typography></Box>
            {detailDialog.incident?.affectedServices && detailDialog.incident.affectedServices.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary">Affected Services</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  {detailDialog.incident.affectedServices.map((s: string) => <Chip key={s} label={s} size="small" variant="outlined" />)}
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          {detailDialog.incident?.status === 'DETECTED' && (
            <Button onClick={async () => {
              if (detailDialog.incident) {
                await acknowledgeIncident(detailDialog.incident.id);
                setDetailDialog({ ...detailDialog, incident: { ...detailDialog.incident, status: 'ACKNOWLEDGED' } });
              }
            }} startIcon={<CheckCircle />}>Acknowledge</Button>
          )}
          {(detailDialog.incident?.status === 'ACKNOWLEDGED' || detailDialog.incident?.status === 'INVESTIGATING' || detailDialog.incident?.status === 'MITIGATING') && (
            <Button variant="contained" color="success" onClick={() => {
              if (detailDialog.incident) {
                setResolveDialog({ open: true, incidentId: detailDialog.incident.id, resolution: '', rootCause: '' });
              }
            }} startIcon={<CheckCircle />}>Resolve</Button>
          )}
          <Button onClick={() => setDetailDialog({ open: false, incident: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Resolve Incident Dialog */}
      <Dialog open={resolveDialog.open} onClose={() => setResolveDialog({ ...resolveDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>Resolve Incident</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Root Cause" fullWidth size="small" multiline rows={2} value={resolveDialog.rootCause}
              onChange={(e) => setResolveDialog({ ...resolveDialog, rootCause: e.target.value })} />
            <TextField label="Resolution Summary" fullWidth size="small" multiline rows={3} value={resolveDialog.resolution}
              onChange={(e) => setResolveDialog({ ...resolveDialog, resolution: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveDialog({ ...resolveDialog, open: false })}>Cancel</Button>
          <Button variant="contained" color="success" onClick={async () => {
            await resolveIncident(resolveDialog.incidentId, resolveDialog.resolution, resolveDialog.rootCause);
            setResolveDialog({ open: false, incidentId: '', resolution: '', rootCause: '' });
            setDetailDialog({ open: false, incident: null });
          }}>Resolve</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
