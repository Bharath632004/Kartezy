'use client';

import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import * as React from 'react';
import { useMarketingStore } from '@/store/marketingStore';

export default function ReferralCampaignsPage() {
  const { referralsData, loading, error, fetchReferralsData, createReferral, updateReferral, deleteReferral } = useMarketingStore() as any;
  const [filters, setFilters] = React.useState({
    status: '',
    type: '',
    startDate: '',
    endDate: ''
  });
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [selectedReferral, setSelectedReferral] = React.useState<any>(null);

  React.useEffect(() => {
    fetchReferralsData(filters);
  }, [filters, fetchReferralsData]);

  const handleToggleCreateDialog = () => {
    setOpenCreateDialog(!openCreateDialog);
    setSelectedReferral(null);
  };

  const handleToggleEditDialog = (referral: any = null) => {
    setSelectedReferral(referral ? { ...referral } : null);
    setOpenEditDialog(!openEditDialog);
  };

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Referral Programs Overview
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            label="Status"
            select
            id="status-select"
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            slotProps={{ select: { MenuProps: { sx: { width: 200 } } } }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </TextField>
          <TextField
            label="Type"
            select
            id="type-select"
            value={filters.type || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            slotProps={{ select: { MenuProps: { sx: { width: 200 } } } }}
          >
            <option value="">All Types</option>
            <option value="standard">Standard Referral</option>
            <option value="tiered">Tiered Referral</option>
            <option value="affiliate">Affiliate Program</option>
          </TextField>
          <TextField
            label="Start Date"
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            sx={{ width: 150 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            sx={{ width: 150 }}
          />
          <Button variant="contained" onClick={() => fetchReferralsData(filters)}>
            Apply Filters
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleToggleCreateDialog}>
            Create Referral Program
          </Button>
        </Stack>
      </Box>

      {!referralsData || referralsData.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No referral programs available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Referral Programs List
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="referral programs table">
                <TableHead>
                  <TableRow>
                    <TableCell>Program Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Referrer Reward</TableCell>
                    <TableCell align="right">Referee Reward</TableCell>
                    <TableCell align="right">Total Referrals</TableCell>
                    <TableCell align="right">Conversion Rate</TableCell>
                    <TableCell align="right">Total Rewards Paid</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {referralsData.map((referral: any) => (
                    <TableRow key={referral.id}>
                      <TableCell>{referral.name}</TableCell>
                      <TableCell>{referral.type}</TableCell>
                      <TableCell align="right">${referral.referrerReward?.toFixed(2) ?? '0.00'}</TableCell>
                      <TableCell align="right">${referral.refereeReward?.toFixed(2) ?? '0.00'}</TableCell>
                      <TableCell align="right">{referral.totalReferrals?.toLocaleString() ?? '0'}</TableCell>
                      <TableCell align="right">{referral.conversionRate?.toFixed(1) ?? '0'}%</TableCell>
                      <TableCell align="right">${referral.totalRewardsPaid?.toFixed(2) ?? '0.00'}</TableCell>
                      <TableCell>
                        <Box component="span" sx={{
                          bgcolor: referral.status.toLowerCase() === 'active' ? 'success.main' :
                                   referral.status.toLowerCase() === 'paused' ? 'warning.main' :
                                   referral.status.toLowerCase() === 'completed' ? 'info.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {referral.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" sx={{ color: 'primary.main' }} onClick={() => handleToggleEditDialog(referral)}>
                          Edit
                        </Button>
                        <Button size="small" variant="text" sx={{ color: 'error.main', ml: 1 }} onClick={() => deleteReferral(referral.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      )}

      {/* Create Referral Program Dialog */}
      <Dialog open={openCreateDialog} onClose={handleToggleCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Referral Program</DialogTitle>
        <DialogContent>
          <TextField
            label="Program Name"
            value={selectedReferral?.name || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, name: e.target.value });
              } else {
                setSelectedReferral({ ...(selectedReferral || {}), name: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={selectedReferral?.description || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, description: e.target.value });
              } else {
                setSelectedReferral({ ...(selectedReferral || {}), description: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            select
            id="referral-type-select"
            value={selectedReferral?.type || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, type: e.target.value });
              } else {
                setSelectedReferral({ ...(selectedReferral || {}), type: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="standard">Standard Referral</MenuItem>
            <MenuItem value="tiered">Tiered Referral</MenuItem>
            <MenuItem value="affiliate">Affiliate Program</MenuItem>
          </TextField>
          <TextField
            label="Referrer Reward ($)"
            type="number"
            value={selectedReferral?.referrerReward || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, referrerReward: parseFloat(e.target.value) || 0 });
              } else {
                setSelectedReferral({ ...(selectedReferral || {}), referrerReward: parseFloat(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Referee Reward ($)"
            type="number"
            value={selectedReferral?.refereeReward || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, refereeReward: parseFloat(e.target.value) || 0 });
              } else {
                setSelectedReferral({ ...(selectedReferral || {}), refereeReward: parseFloat(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={selectedReferral?.startDate || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, startDate: e.target.value });
              } else {
                setSelectedReferral({ ...(selectedReferral || {}), startDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            value={selectedReferral?.endDate || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, endDate: e.target.value });
              } else {
                setSelectedReferral({ ...(selectedReferral || {}), endDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Maximum Referrals"
            type="number"
            value={selectedReferral?.maxReferrals || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, maxReferrals: parseInt(e.target.value) || 0 });
              } else {
                setSelectedReferral({ ...(selectedReferral || {}), maxReferrals: parseInt(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleCreateDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedReferral) {
              try {
                await createReferral(selectedReferral);
                setOpenCreateDialog(false);
                setSelectedReferral(null);
                // Refresh after creation
                fetchReferralsData(filters);
              } catch (err) {
                console.error('Error creating referral program:', err);
              }
            }
          }}>
            Create Referral Program
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Referral Program Dialog */}
      <Dialog open={openEditDialog} onClose={handleToggleEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Referral Program</DialogTitle>
        <DialogContent>
          <TextField
            label="Program Name"
            value={selectedReferral?.name || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, name: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={selectedReferral?.description || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, description: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            select
            id="edit-referral-type-select"
            value={selectedReferral?.type || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, type: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="standard">Standard Referral</MenuItem>
            <MenuItem value="tiered">Tiered Referral</MenuItem>
            <MenuItem value="affiliate">Affiliate Program</MenuItem>
          </TextField>
          <TextField
            label="Referrer Reward ($)"
            type="number"
            value={selectedReferral?.referrerReward || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, referrerReward: parseFloat(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Referee Reward ($)"
            type="number"
            value={selectedReferral?.refereeReward || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, refereeReward: parseFloat(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={selectedReferral?.startDate || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, startDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            value={selectedReferral?.endDate || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, endDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Maximum Referrals"
            type="number"
            value={selectedReferral?.maxReferrals || ''}
            onChange={(e) => {
              if (selectedReferral) {
                setSelectedReferral({ ...selectedReferral, maxReferrals: parseInt(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedReferral) {
              try {
                await updateReferral(selectedReferral.id, selectedReferral);
                setOpenEditDialog(false);
                setSelectedReferral(null);
                // Refresh after update
                fetchReferralsData(filters);
              } catch (err) {
                console.error('Error updating referral program:', err);
              }
            }
          }}>
            Update Referral Program
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}