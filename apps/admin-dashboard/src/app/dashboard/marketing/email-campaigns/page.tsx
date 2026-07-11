import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField, Typography as MuiTypography } from '@mui/material';
import * as React from 'react';
import { useMarketingStore } from '@/store/marketingStore';

export default function EmailCampaignsPage() {
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
          Email Campaigns Overview
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
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
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
            <option value="newsletter">Newsletter</option>
            <option value="promotional">Promotional</option>
            <option value="transactional">Transactional</option>
            <option value="autoresponder">Autoresponder</option>
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
          <Button variant="contained" onClick={() => fetchCampaignsData(filters)}>
            Apply Filters
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleToggleCreateDialog}>
            Create Email Campaign
          </Button>
        </Stack>
      </Box>

      {!campaignsData || campaignsData.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography variant="body2">No email campaigns available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Email Campaigns List
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="email campaigns table">
                <TableHead>
                  <TableRow>
                    <TableCell>Campaign Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Send Time</TableCell>
                    <TableCell align="right">Recipients</TableCell>
                    <TableCell align="right">Open Rate</TableCell>
                    <TableCell align="right">Click Rate</TableCell>
                    <TableCell align="right">Conversion Rate</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {campaignsData.map((campaign: any) => (
                    <TableRow key={campaign.id}>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.type}</TableCell>
                      <TableCell align="right">{campaign.sendTime}</TableCell>
                      <TableCell align="right">{campaign.recipients?.toLocaleString() ?? '0'}</TableCell>
                      <TableCell align="right">{campaign.openRate?.toFixed(1) ?? '0'}%</TableCell>
                      <TableCell align="right">{campaign.clickRate?.toFixed(1) ?? '0'}%</TableCell>
                      <TableCell align="right">{campaign.conversionRate?.toFixed(1) ?? '0'}%</TableCell>
                      <TableCell>
                        <span sx={{
                          bgcolor: campaign.status.toLowerCase() === 'sent' ? 'success.main' :
                                   campaign.status.toLowerCase() === 'scheduled' ? 'warning.main' :
                                   campaign.status.toLowerCase() === 'draft' ? 'info.main' : 'error.main',
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

      {/* Create Email Campaign Dialog */}
      <Dialog open={openCreateDialog} onClose={handleToggleCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Email Campaign</DialogTitle>
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
            label="Subject"
            value={selectedCampaign?.subject || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, subject: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), subject: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Preheader"
            value={selectedCampaign?.preheader || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, preheader: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), preheader: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email Content"
            value={selectedCampaign?.content || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, content: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), content: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={6}
          />
          <TextField
            label="Type"
            select
            labelId="email-type-label"
            id="email-type-select"
            value={selectedCampaign?.type || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, type: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), type: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="newsletter">Newsletter</MenuItem>
            <MenuItem value="promotional">Promotional</MenuItem>
            <MenuItem value="transactional">Transactional</MenuItem>
            <MenuItem value="autoresponder">Autoresponder</MenuItem>
          </TextField>
          <TextField
            label="Target Audience"
            select
            labelId="target-audience-label"
            id="target-audience-select"
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
          >
            <MenuItem value="all_users">All Users</MenuItem>
            <MenuItem value="active_users">Active Users (Last 30 days)</MenuItem>
            <MenuItem value="new_users">New Users (Last 7 days)</MenuItem>
            <MenuItem value="inactive_users">Inactive Users (Last 30+ days)</MenuItem>
            <MenuItem value="high_value">High Value Users</MenuItem>
            <MenuItem value="custom_segment">Custom Segment</MenuItem>
          </TextField>
          <TextField
            label="Send Time"
            type="datetime-local"
            value={selectedCampaign?.sendTime || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, sendTime: e.target.value });
              } else {
                setSelectedCampaign({ ...(selectedCampaign || {}), sendTime: e.target.value });
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
                console.error('Error creating email campaign:', err);
              }
            }
          }}>
            Create Email Campaign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Email Campaign Dialog */}
      <Dialog open={openEditDialog} onClose={handleToggleEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Email Campaign</DialogTitle>
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
            label="Subject"
            value={selectedCampaign?.subject || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, subject: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Preheader"
            value={selectedCampaign?.preheader || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, preheader: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email Content"
            value={selectedCampaign?.content || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, content: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={6}
          />
          <TextField
            label="Type"
            select
            labelId="edit-email-type-label"
            id="edit-email-type-select"
            value={selectedCampaign?.type || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, type: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="newsletter">Newsletter</MenuItem>
            <MenuItem value="promotional">Promotional</MenuItem>
            <MenuItem value="transactional">Transactional</MenuItem>
            <MenuItem value="autoresponder">Autoresponder</MenuItem>
          </TextField>
          <TextField
            label="Target Audience"
            select
            labelId="edit-target-audience-label"
            id="edit-target-audience-select"
            value={selectedCampaign?.targetAudience || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, targetAudience: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="all_users">All Users</MenuItem>
            <MenuItem value="active_users">Active Users (Last 30 days)</MenuItem>
            <MenuItem value="new_users">New Users (Last 7 days)</MenuItem>
            <MenuItem value="inactive_users">Inactive Users (Last 30+ days)</MenuItem>
            <MenuItem value="high_value">High Value Users</MenuItem>
            <MenuItem value="custom_segment">Custom Segment</MenuItem>
          </TextField
            label="Send Time"
            type="datetime-local"
            value={selectedCampaign?.sendTime || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, sendTime: e.target.value });
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
                console.error('Error updating email campaign:', err);
              }
            }
          }}>
            Update Email Campaign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}