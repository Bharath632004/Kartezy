"use client";

import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, Stack, Switch, Alert, AlertTitle,
} from '@mui/material';
import {
  Search, RefreshOutlined, Add, Edit, Delete, AccountTree, PlayArrow, Science, ToggleOn, ToggleOff,
} from '@mui/icons-material';
import { useOperationsStore } from '@/store/operationsStore';

const domainColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'> = {
  DELIVERY: 'primary', INVENTORY: 'secondary', PRICING: 'success', ALLOCATION: 'warning',
  DISPATCH: 'info', MERCHANT: 'error', CUSTOMER: 'info', PROMOTION: 'warning',
};

const ruleStatusColors: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
  ACTIVE: 'success', INACTIVE: 'warning', DRAFT: 'info', DEPRECATED: 'error',
};

export default function BusinessRulesEngine() {
  const { businessRules, ruleLoading, fetchBusinessRules, createBusinessRule, updateBusinessRule, deleteBusinessRule, toggleRuleStatus, evaluateRule } = useOperationsStore();
  const [search, setSearch] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; rule: any | null }>({ open: false, rule: null });
  const [newRule, setNewRule] = useState({ name: '', description: '', domain: 'DELIVERY', type: 'THRESHOLD', condition: '', action: '', priority: 1 });
  const [testDialog, setTestDialog] = useState<{ open: boolean; result: string | null }>({ open: false, result: null });

  useEffect(() => { fetchBusinessRules(); }, [fetchBusinessRules]);

  const filtered = businessRules.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.domain.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = businessRules.filter(r => r.status === 'ACTIVE').length;
  const totalTriggers = businessRules.reduce((a, r) => a + r.triggerCount, 0);

  if (ruleLoading && businessRules.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Business Rules Engine</Typography>
          <Typography variant="body2" color="text.secondary">{businessRules.length} rules &middot; {activeCount} active &middot; {totalTriggers} total triggers</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialog(true)}>Create Rule</Button>
          <Tooltip title="Refresh"><IconButton onClick={() => fetchBusinessRules()}><RefreshOutlined /></IconButton></Tooltip>
        </Box>
      </Box>

      <TextField fullWidth size="small" placeholder="Search rules..." value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active', value: activeCount, color: 'success.main' },
          { label: 'Delivery', value: businessRules.filter(r => r.domain === 'DELIVERY').length, color: 'primary.main' },
          { label: 'Inventory', value: businessRules.filter(r => r.domain === 'INVENTORY').length, color: 'secondary.main' },
          { label: 'Pricing / Promo', value: businessRules.filter(r => r.domain === 'PRICING' || r.domain === 'PROMOTION').length, color: 'success.main' },
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
              <TableCell>Rule Name</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell align="right">Evaluations</TableCell>
              <TableCell align="right">Triggers</TableCell>
              <TableCell align="right">Last Triggered</TableCell>
              <TableCell align="center">Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((rule) => (
              <TableRow key={rule.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>{rule.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{rule.description}</Typography>
                </TableCell>
                <TableCell><Chip label={rule.domain} color={domainColors[rule.domain] ?? 'default'} size="small" /></TableCell>
                <TableCell><Chip label={rule.type.replace(/_/g, ' ')} size="small" variant="outlined" /></TableCell>
                <TableCell><Chip label={rule.status} color={ruleStatusColors[rule.status] ?? 'default'} size="small" /></TableCell>
                <TableCell><Chip label={rule.priority} size="small" variant="outlined" /></TableCell>
                <TableCell align="right">{rule.evaluationCount}</TableCell>
                <TableCell align="right">{rule.triggerCount}</TableCell>
                <TableCell align="right">{rule.lastTriggeredAt ? new Date(rule.lastTriggeredAt).toLocaleString() : 'Never'}</TableCell>
                <TableCell align="center">
                  <Switch checked={rule.status === 'ACTIVE'} onChange={() => toggleRuleStatus(rule.id)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Evaluate Now">
                    <IconButton size="small" onClick={() => evaluateRule(rule.id)}><PlayArrow fontSize="small" /></IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={() => setEditDialog({ open: true, rule })}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={async () => {
                    if (confirm('Delete this rule?')) await deleteBusinessRule(rule.id);
                  }}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={10} align="center"><Typography color="text.secondary">No business rules found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Rule Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Business Rule</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Rule Name" fullWidth size="small" value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} />
            <TextField label="Description" fullWidth size="small" multiline rows={2} value={newRule.description} onChange={(e) => setNewRule({ ...newRule, description: e.target.value })} />
            <FormControl fullWidth size="small"><InputLabel>Domain</InputLabel>
              <Select value={newRule.domain} label="Domain" onChange={(e) => setNewRule({ ...newRule, domain: e.target.value })}>
                <MenuItem value="DELIVERY">Delivery</MenuItem><MenuItem value="INVENTORY">Inventory</MenuItem>
                <MenuItem value="PRICING">Pricing</MenuItem><MenuItem value="ALLOCATION">Allocation</MenuItem>
                <MenuItem value="DISPATCH">Dispatch</MenuItem><MenuItem value="MERCHANT">Merchant</MenuItem>
                <MenuItem value="CUSTOMER">Customer</MenuItem><MenuItem value="PROMOTION">Promotion</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small"><InputLabel>Rule Type</InputLabel>
              <Select value={newRule.type} label="Rule Type" onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}>
                <MenuItem value="THRESHOLD">Threshold</MenuItem><MenuItem value="ELIGIBILITY">Eligibility</MenuItem>
                <MenuItem value="PRIORITY">Priority</MenuItem><MenuItem value="ALLOCATION">Allocation</MenuItem>
                <MenuItem value="DISCOUNT">Discount</MenuItem><MenuItem value="ROUTING">Routing</MenuItem>
                <MenuItem value="CUSTOM">Custom</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Condition (e.g., stock_level < reorder_point)" fullWidth size="small" value={newRule.condition}
              onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })} />
            <TextField label="Action (e.g., trigger_reorder)" fullWidth size="small" value={newRule.action}
              onChange={(e) => setNewRule({ ...newRule, action: e.target.value })} />
            <TextField label="Priority (1 = highest)" fullWidth size="small" type="number" value={newRule.priority}
              onChange={(e) => setNewRule({ ...newRule, priority: Number(e.target.value) })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            await createBusinessRule(newRule as any);
            setCreateDialog(false);
            setNewRule({ name: '', description: '', domain: 'DELIVERY', type: 'THRESHOLD', condition: '', action: '', priority: 1 });
          }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, rule: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Rule: {editDialog.rule?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small"><InputLabel>Status</InputLabel>
              <Select value={editDialog.rule?.status ?? 'ACTIVE'} label="Status"
                onChange={(e) => setEditDialog({ ...editDialog, rule: { ...editDialog.rule, status: e.target.value } })}>
                <MenuItem value="ACTIVE">Active</MenuItem><MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem><MenuItem value="DEPRECATED">Deprecated</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Priority" fullWidth size="small" type="number" value={editDialog.rule?.priority ?? 1}
              onChange={(e) => setEditDialog({ ...editDialog, rule: { ...editDialog.rule, priority: Number(e.target.value) } })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, rule: null })}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (editDialog.rule) {
              await updateBusinessRule(editDialog.rule.id, { status: editDialog.rule.status, priority: editDialog.rule.priority });
              setEditDialog({ open: false, rule: null });
            }
          }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Test Rule Dialog */}
      <Dialog open={testDialog.open} onClose={() => setTestDialog({ open: false, result: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Rule Evaluation Result</DialogTitle>
        <DialogContent>
          <Typography>{testDialog.result || 'Rule evaluated successfully'}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialog({ open: false, result: null })}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
