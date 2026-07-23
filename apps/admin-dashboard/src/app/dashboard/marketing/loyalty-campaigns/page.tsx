'use client';

import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import * as React from 'react';
import { useMarketingStore } from '@/store/marketingStore';

export default function LoyaltyCampaignsPage() {
  const { loyaltyData, loading, error, fetchLoyaltyData, createLoyalty, updateLoyalty, deleteLoyalty } = useMarketingStore() as any;
  const [filters, setFilters] = React.useState({
    status: '',
    tier: '',
    startDate: '',
    endDate: ''
  });
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [selectedLoyalty, setSelectedLoyalty] = React.useState<any>(null);

  React.useEffect(() => {
    fetchLoyaltyData(filters);
  }, [filters, fetchLoyaltyData]);

  const handleToggleCreateDialog = () => {
    setOpenCreateDialog(!openCreateDialog);
    setSelectedLoyalty(null);
  };

  const handleToggleEditDialog = (loyalty: any = null) => {
    setSelectedLoyalty(loyalty ? { ...loyalty } : null);
    setOpenEditDialog(!openEditDialog);
  };

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Loyalty Programs Overview
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
            <option value="maintenance">Maintenance</option>
          </TextField>
          <TextField
            label="Tier"
            select
            id="tier-select"
            value={filters.tier || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, tier: e.target.value }))}
            slotProps={{ select: { MenuProps: { sx: { width: 200 } } } }}
          >
            <option value="">All Tiers</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
            <option value="diamond">Diamond</option>
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
          <Button variant="contained" onClick={() => fetchLoyaltyData(filters)}>
            Apply Filters
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleToggleCreateDialog}>
            Create Loyalty Program
          </Button>
        </Stack>
      </Box>

      {!loyaltyData || loyaltyData.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No loyalty programs available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Loyalty Programs List
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="loyalty programs table">
                <TableHead>
                  <TableRow>
                    <TableCell>Program Name</TableCell>
                    <TableCell>Tier</TableCell>
                    <TableCell align="right">Points per Dollar</TableCell>
                    <TableCell align="right">Minimum Points for Reward</TableCell>
                    <TableCell align="right">Active Members</TableCell>
                    <TableCell align="right">Total Points Issued</TableCell>
                    <TableCell align="right">Total Points Redeemed</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {loyaltyData.map((loyalty: any) => (
                    <TableRow key={loyalty.id}>
                      <TableCell>{loyalty.name}</TableCell>
                      <TableCell>{loyalty.tier}</TableCell>
                      <TableCell align="right">{loyalty.pointsPerDollar}</TableCell>
                      <TableCell align="right">{loyalty.minPointsForReward}</TableCell>
                      <TableCell align="right">{loyalty.activeMembers?.toLocaleString() ?? '0'}</TableCell>
                      <TableCell align="right">{loyalty.totalPointsIssued?.toLocaleString() ?? '0'}</TableCell>
                      <TableCell align="right">{loyalty.totalPointsRedeemed?.toLocaleString() ?? '0'}</TableCell>
                      <TableCell>
                        <Box component="span" sx={{
                          bgcolor: loyalty.status.toLowerCase() === 'active' ? 'success.main' :
                                   loyalty.status.toLowerCase() === 'paused' ? 'warning.main' :
                                   loyalty.status.toLowerCase() === 'maintenance' ? 'info.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {loyalty.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" sx={{ color: 'primary.main' }} onClick={() => handleToggleEditDialog(loyalty)}>
                          Edit
                        </Button>
                        <Button size="small" variant="text" sx={{ color: 'error.main', ml: 1 }} onClick={() => deleteLoyalty(loyalty.id)}>
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

      {/* Create Loyalty Program Dialog */}
      <Dialog open={openCreateDialog} onClose={handleToggleCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Loyalty Program</DialogTitle>
        <DialogContent>
          <TextField
            label="Program Name"
            value={selectedLoyalty?.name || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, name: e.target.value });
              } else {
                setSelectedLoyalty({ ...(selectedLoyalty || {}), name: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={selectedLoyalty?.description || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, description: e.target.value });
              } else {
                setSelectedLoyalty({ ...(selectedLoyalty || {}), description: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tier"
            select
            id="loyalty-tier-select"
            value={selectedLoyalty?.tier || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, tier: e.target.value });
              } else {
                setSelectedLoyalty({ ...(selectedLoyalty || {}), tier: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="bronze">Bronze</MenuItem>
            <MenuItem value="silver">Silver</MenuItem>
            <MenuItem value="gold">Gold</MenuItem>
            <MenuItem value="platinum">Platinum</MenuItem>
            <MenuItem value="diamond">Diamond</MenuItem>
          </TextField>
          <TextField
            label="Points per Dollar Spent"
            type="number"
            value={selectedLoyalty?.pointsPerDollar || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, pointsPerDollar: parseInt(e.target.value) || 0 });
              } else {
                setSelectedLoyalty({ ...(selectedLoyalty || {}), pointsPerDollar: parseInt(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Minimum Points for Reward"
            type="number"
            value={selectedLoyalty?.minPointsForReward || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, minPointsForReward: parseInt(e.target.value) || 0 });
              } else {
                setSelectedLoyalty({ ...(selectedLoyalty || {}), minPointsForReward: parseInt(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={selectedLoyalty?.startDate || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, startDate: e.target.value });
              } else {
                setSelectedLoyalty({ ...(selectedLoyalty || {}), startDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            value={selectedLoyalty?.endDate || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, endDate: e.target.value });
              } else {
                setSelectedLoyalty({ ...(selectedLoyalty || {}), endDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reward Tiers"
            value={selectedLoyalty?.rewardTiers || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, rewardTiers: e.target.value });
              } else {
                setSelectedLoyalty({ ...(selectedLoyalty || {}), rewardTiers: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleCreateDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedLoyalty) {
              try {
                await createLoyalty(selectedLoyalty);
                setOpenCreateDialog(false);
                setSelectedLoyalty(null);
                // Refresh after creation
                fetchLoyaltyData(filters);
              } catch (err) {
                console.error('Error creating loyalty program:', err);
              }
            }
          }}>
            Create Loyalty Program
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Loyalty Program Dialog */}
      <Dialog open={openEditDialog} onClose={handleToggleEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Loyalty Program</DialogTitle>
        <DialogContent>
          <TextField
            label="Program Name"
            value={selectedLoyalty?.name || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, name: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={selectedLoyalty?.description || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, description: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tier"
            select
            id="edit-loyalty-tier-select"
            value={selectedLoyalty?.tier || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, tier: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="bronze">Bronze</MenuItem>
            <MenuItem value="silver">Silver</MenuItem>
            <MenuItem value="gold">Gold</MenuItem>
            <MenuItem value="platinum">Platinum</MenuItem>
            <MenuItem value="diamond">Diamond</MenuItem>
          </TextField>
            <TextField
            label="Points per Dollar Spent"
            type="number"
            value={selectedLoyalty?.pointsPerDollar || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, pointsPerDollar: parseInt(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Minimum Points for Reward"
            type="number"
            value={selectedLoyalty?.minPointsForReward || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, minPointsForReward: parseInt(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={selectedLoyalty?.startDate || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, startDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            value={selectedLoyalty?.endDate || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, endDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reward Tiers"
            value={selectedLoyalty?.rewardTiers || ''}
            onChange={(e) => {
              if (selectedLoyalty) {
                setSelectedLoyalty({ ...selectedLoyalty, rewardTiers: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedLoyalty) {
              try {
                await updateLoyalty(selectedLoyalty.id, selectedLoyalty);
                setOpenEditDialog(false);
                setSelectedLoyalty(null);
                // Refresh after update
                fetchLoyaltyData(filters);
              } catch (err) {
                console.error('Error updating loyalty program:', err);
              }
            }
          }}>
            Update Loyalty Program
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}