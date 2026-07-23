"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, Stack, LinearProgress,
  Alert, AlertTitle, Switch,
} from '@mui/material';
import {
  Search, RefreshOutlined, Add, Edit, Timer, CheckCircle, WarningAmber, ErrorOutlined, Speed,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const slaPriorityColors: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  CRITICAL: 'error', HIGH: 'warning', MEDIUM: 'info', LOW: 'success',
};

export default function SLAMonitoring() {
  const { slaConfigs, slaLoading, fetchSLAConfigs, createSLAConfig, updateSLAConfig, toggleSLAStatus } = useOperationsStore();
  const [search, setSearch] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [newSLA, setNewSLA] = useState({ name: '', description: '', type: 'RESPONSE', target: 30, priority: 'MEDIUM', scope: 'ALL' });
  const [editDialog, setEditDialog] = useState<{ open: boolean; sla: any | null }>({ open: false, sla: null });

  useEffect(() => { fetchSLAConfigs(); }, [fetchSLAConfigs]);

  const filtered = slaConfigs.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalBreaches = slaConfigs.reduce((a, s) => a + (s.metrics?.breachesToday ?? 0), 0);
  const overallCompliance = slaConfigs.length > 0
    ? slaConfigs.reduce((a, s) => a + (s.metrics?.complianceRate ?? 0), 0) / slaConfigs.length
    : 0;

  if (slaLoading && slaConfigs.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>SLA Monitoring</Typography>
          <Typography variant="body2" color="text.secondary">{slaConfigs.length} SLA configurations &middot; {totalBreaches} breaches today</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialog(true)}>New SLA</Button>
          <Tooltip title="Refresh"><IconButton onClick={() => fetchSLAConfigs()}><RefreshOutlined /></IconButton></Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Overall Compliance</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>{(overallCompliance * 100).toFixed(1)}%</Typography>
              <LinearProgress variant="determinate" value={overallCompliance * 100} sx={{ mt: 1, height: 8, borderRadius: 4 }}
                color={overallCompliance >= 0.95 ? 'success' : overallCompliance >= 0.85 ? 'warning' : 'error'} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'error.main' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Breaches Today</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>{totalBreaches}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Active SLAs</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>{slaConfigs.filter(s => s.status === 'ACTIVE').length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderLeft: 4, borderColor: 'success.main' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Critical Breaches</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>{slaConfigs.filter(s => s.metrics?.breachesToday && s.priority === 'CRITICAL').length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>SLA Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Scope</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Compliance</TableCell>
              <TableCell align="right">Avg Response</TableCell>
              <TableCell align="right">Breaches Today</TableCell>
              <TableCell align="right">Breaches This Month</TableCell>
              <TableCell align="right">Toggle</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((sla) => (
              <TableRow key={sla.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell><Typography sx={{ fontWeight: 600 }}>{sla.name}</Typography></TableCell>
                <TableCell><Chip label={sla.type} size="small" variant="outlined" /></TableCell>
                <TableCell><Chip label={sla.priority} color={slaPriorityColors[sla.priority] ?? 'default'} size="small" /></TableCell>
                <TableCell>{sla.scope}{sla.scopeValue ? `: ${sla.scopeValue}` : ''}</TableCell>
                <TableCell>{sla.target} min</TableCell>
                <TableCell><Chip label={sla.status} color={sla.status === 'ACTIVE' ? 'success' : sla.status === 'PAUSED' ? 'warning' : 'default'} size="small" /></TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress variant="determinate" value={(sla.metrics?.complianceRate ?? 0) * 100} sx={{ width: 60, height: 8, borderRadius: 4 }}
                      color={(sla.metrics?.complianceRate ?? 0) >= 0.95 ? 'success' : (sla.metrics?.complianceRate ?? 0) >= 0.85 ? 'warning' : 'error'} />
                    <Typography variant="caption">{((sla.metrics?.complianceRate ?? 0) * 100).toFixed(0)}%</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{sla.metrics?.avgResponseTime ?? '-'} min</TableCell>
                <TableCell align="right">
                  <Chip label={sla.metrics?.breachesToday ?? 0} color={(sla.metrics?.breachesToday ?? 0) > 0 ? 'error' : 'success'} size="small" />
                </TableCell>
                <TableCell align="right">{sla.metrics?.breachesThisMonth ?? 0}</TableCell>
                <TableCell align="right">
                  <Switch checked={sla.status === 'ACTIVE'} onChange={() => toggleSLAStatus(sla.id)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setEditDialog({ open: true, sla })}><Edit /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={12} align="center"><Typography color="text.secondary">No SLA configurations found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create SLA Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New SLA Configuration</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="SLA Name" fullWidth size="small" value={newSLA.name} onChange={(e) => setNewSLA({ ...newSLA, name: e.target.value })} />
            <TextField label="Description" fullWidth size="small" multiline rows={2} value={newSLA.description} onChange={(e) => setNewSLA({ ...newSLA, description: e.target.value })} />
            <FormControl fullWidth size="small"><InputLabel>Type</InputLabel>
              <Select value={newSLA.type} label="Type" onChange={(e) => setNewSLA({ ...newSLA, type: e.target.value })}>
                <MenuItem value="RESPONSE">Response Time</MenuItem><MenuItem value="RESOLUTION">Resolution Time</MenuItem>
                <MenuItem value="FULFILLMENT">Fulfillment</MenuItem><MenuItem value="DELIVERY">Delivery</MenuItem>
                <MenuItem value="SUPPORT">Support</MenuItem><MenuItem value="CUSTOM">Custom</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Target (minutes)" fullWidth size="small" type="number" value={newSLA.target} onChange={(e) => setNewSLA({ ...newSLA, target: Number(e.target.value) })} />
            <FormControl fullWidth size="small"><InputLabel>Priority</InputLabel>
              <Select value={newSLA.priority} label="Priority" onChange={(e) => setNewSLA({ ...newSLA, priority: e.target.value })}>
                <MenuItem value="LOW">Low</MenuItem><MenuItem value="MEDIUM">Medium</MenuItem><MenuItem value="HIGH">High</MenuItem><MenuItem value="CRITICAL">Critical</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small"><InputLabel>Scope</InputLabel>
              <Select value={newSLA.scope} label="Scope" onChange={(e) => setNewSLA({ ...newSLA, scope: e.target.value })}>
                <MenuItem value="ALL">All</MenuItem><MenuItem value="ZONE">Zone</MenuItem><MenuItem value="CITY">City</MenuItem><MenuItem value="MERCHANT">Merchant</MenuItem><MenuItem value="CUSTOMER_TIER">Customer Tier</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            await createSLAConfig(newSLA as any);
            setCreateDialog(false);
            setNewSLA({ name: '', description: '', type: 'RESPONSE', target: 30, priority: 'MEDIUM', scope: 'ALL' });
          }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
