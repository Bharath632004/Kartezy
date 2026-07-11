import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField, Typography as MuiTypography } from '@mui/material';
import * as React from 'react';
import { useMarketingStore } from '@/store/marketingStore';

export default function CampaignsPage() {
  const { campaignsData, loading, error, fetchCampaignsData, createCampaign, updateCampaign, deleteCampaign } = useMarketingStore();
  const [filters, setFilters] = React.useState({
    status: '',
    type: '',
    startDate: '',
    endDate: ''
  });
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [selectedCampaign, setSelectedCampaign] = React.useState(null);

  React.useEffect(() => {
    fetchCampaignsData(filters);
  }, [filters, fetchCampaignsData]);

  const handleToggleCreateDialog = () => {
    setOpenCreateDialog(!openCreateDialog);
    setSelectedCampaign(null);
  };

  const handleToggleEditDialog = (campaign: any = null) => {
    setSelectedCampaign(campaign ? { ...campaign } : null);
    setOpenEditDialog(!openEditDialog);
  };

  if (loading) return <Box p={4}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box p={4}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box p={4}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Marketing Campaigns Overview
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Status"
            select
            labelId="status-label"
            id="status-select"
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            select
            MenuProps={{ MenuProps: { sx: { width: 200 } } }}
            labelWidth={100}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </TextField>
          <TextField
            label="Type"
            select
            labelId="type-label"
            id="type-select"
            value={filters.type || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            select
            MenuProps={{ MenuProps: { sx: { width: 200 } } }}
            labelWidth={100}
          >
            <option value="">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="push">Push Notification</option>
            <option value="social">Social Media</option>
            <option value="search">Search Ads</option>
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
            sx={{ width: 15: width: 150 }
          />
          <Button variant="contained" onClick={() => fetchCampaignsData(filters)}>
            Apply Filters
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleToggleCreateDialog}>
            Create Campaign
          </Button>
        </Stack>
      </Box>

      {!campaignsData || campaignsData.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography variant="body2">No campaigns available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Campaigns List
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="campaigns table">
                <TableHead>
                  <TableRow>
                    <TableCell>Campaign Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Start Date</TableCell>
                    <TableCell align="right">End Date</TableCell>
                    <TableCell align="right">Budget</TableCell>
                    <TableCell align="right">Spend</TableCell>
                    <TableCell align="right">ROI</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {campaignsData.map((campaign: any) => (
                    <TableRow key={campaign.id}>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.type}</TableCell>
                      <TableCell align="right">{campaign.startDate}</TableCell>
                      <TableCell align="right">{campaign.endDate}</TableCell>
                      <TableCell align="right">${campaign.budget?.toFixed(2) ?? '0.00'}</TableCell>
                      <TableCell align="right">${campaign.spend?.toFixed(2) ?? '0.00'}</TableCell>
                      <TableCell align="right">{campaign.roi?.toFixed(2) ?? '0.00'}x</TableCell>
                      <TableCell>
                        <span sx={{
                          bgcolor: campaign.status.toLowerCase() === 'active' ? 'success.main' :
                                   campaign.status.toLowerCase() === 'paused' ? 'warning.main' :
                                   campaign.status.toLowerCase() === 'completed' ? 'info.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {campaign.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" sx={{ color: 'primary.main' }} onClick={() => handleToggleEditDialog(campaign)}>
                          Edit
                        </Button>
                        <Button size="small" variant="text" sx={{ color: 'error.main', ml: 1 }} onClick={() => deleteCampaign(campaign.id)}>
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

      {/* Create Campaign Dialog */}
      <Dialog open={openCreateDialog} onClose={handleToggleCreateDialog} maxWidth="sm">
        <DialogTitle>Create Campaign</DialogTitle>
        <DialogContent>
          <TextField
            label="Campaign Name"
            value={selectedCampaign?.name || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, name: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), name: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={selectedCampaign?.description || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, description: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), description: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            select
            labelId="campaign-type-label"
            id="campaign-type-select"
            value={selectedCampaign?.type || ''}
            onChange={(e) => {
              if (selectedCampign) {
                setSelectedCampaign({ ...selectedCampaign, type: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), type: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="sms">SMS</MenuItem>
            <MenuItem value="push">Push Notification</MenuItem>
            <MenuItem value="social">Social Media</MenuItem>
            <MenuItem value="search">Search Ads</MenuItem>
          </TextField>
          <TextField
            label="Start Date"
            type="date"
            value={selectedCampaign?.startDate || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, startDate: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), startDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            value={selectedCampaign?.endDate || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, endDate: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), endDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Budget ($)"
            type="number"
            value={selectedCampaign?.budget || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, budget: parseFloat(e.target.value) || 0 });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), budget: parseFloat(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Target Audience"
            value={selectedCampaign?.targetAudience || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, targetAudience: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), targetAudience: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleCreateDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedCampaign) {
              try {
                await createCampaign(selectedCampaign);
                setOpenCreateDialog(false);
                setSelectedCampaign(null);
                // Refresh after creation
                fetchCampaignsData(filters);
              } catch (err) {
                console.error('Error creating campaign:', err);
              }
            }
          }}>
            Create Campaign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={openEditDialog} onClose={handleToggleEditDialog} maxWidth="sm">
        <DialogTitle>Edit Campaign</DialogTitle>
        <DialogContent>
          <TextField
            label="Campaign Name"
            value={selectedCampaign?.name || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, name: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={selectedCampaign?.description || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, description: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            select
            labelId="edit-campaign-type-label"
            id="edit-campaign-type-select"
            value={selectedCampaign?.type || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, type: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="sms">SMS</MenuItem>
            <MenuItem value="push">Push Notification</MenuItem>
            <MenuItem value="social">Social Media</MenuItem>
            <MenuItem value="search">Search Ads</MenuItem>
          </TextField>
          <TextField
            label="Start Date"
            type="date"
            value={selectedCampaign?.startDate || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, startDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            value={selectedCampaign?.endDate || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, endDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Budget ($)"
            type="number"
            value={selectedCampaign?.budget || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, budget: parseFloat(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Target Audience"
            value={selectedCampaign?.targetAudience || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, targetAudience: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedCampaign) {
              try {
                await updateCampaign(selectedCampaign.id, selectedCampaign);
                setOpenEditDialog(false);
                setSelectedCampaign(null);
                // Refresh after update
                fetchCampaignsData(filters);
              } catch (err) {
                console.error('Error updating campaign:', err);
              }
            }
          }}>
            Update Campaign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}