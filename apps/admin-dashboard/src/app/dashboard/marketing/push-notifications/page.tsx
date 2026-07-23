'use client';

import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import * as React from 'react';
import { useMarketingStore } from '@/store/marketingStore';

export default function PushNotificationsPage() {
  const { notificationsData, loading, error, fetchNotificationsData, createNotification, updateNotification, deleteNotification } = useMarketingStore() as any;
  const [filters, setFilters] = React.useState({
    status: '',
    type: '',
    startDate: '',
    endDate: ''
  });
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<any>(null);

  React.useEffect(() => {
    fetchNotificationsData(filters);
  }, [filters, fetchNotificationsData]);

  const handleToggleCreateDialog = () => {
    setOpenCreateDialog(!openCreateDialog);
    setSelectedNotification(null);
  };

  const handleToggleEditDialog = (notification: any = null) => {
    setSelectedNotification(notification ? { ...notification } : null);
    setOpenEditDialog(!openEditDialog);
  };

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Push Notifications Overview
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
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
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
            <option value="promotional">Promotional</option>
            <option value="transactional">Transactional</option>
            <option value="engagement">Engagement</option>
            <option value="announcement">Announcement</option>
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
          <Button variant="contained" onClick={() => fetchNotificationsData(filters)}>
            Apply Filters
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleToggleCreateDialog}>
            Create Notification
          </Button>
        </Stack>
      </Box>

      {!notificationsData || notificationsData.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No notifications available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications List
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="notifications table">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Scheduled Time</TableCell>
                    <TableCell align="right">Sent Time</TableCell>
                    <TableCell align="right">Recipients</TableCell>
                    <TableCell align="right">Delivery Rate</TableCell>
                    <TableCell align="right">Click Rate</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {notificationsData.map((notification: any) => (
                    <TableRow key={notification.id}>
                      <TableCell>{notification.title}</TableCell>
                      <TableCell>{notification.type}</TableCell>
                      <TableCell align="right">{notification.scheduledTime || '-'}</TableCell>
                      <TableCell align="right">{notification.sentTime || '-'}</TableCell>
                      <TableCell align="right">{notification.recipients?.toLocaleString() ?? '0'}</TableCell>
                      <TableCell align="right">{notification.deliveryRate?.toFixed(1) ?? '0'}%</TableCell>
                      <TableCell align="right">{notification.clickRate?.toFixed(1) ?? '0'}%</TableCell>
                      <TableCell>
                        <Box component="span" sx={{
                          bgcolor: notification.status.toLowerCase() === 'sent' ? 'success.main' :
                                   notification.status.toLowerCase() === 'scheduled' ? 'warning.main' :
                                   notification.status.toLowerCase() === 'draft' ? 'info.main' : 'error.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {notification.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" sx={{ color: 'primary.main' }} onClick={() => handleToggleEditDialog(notification)}>
                          Edit
                        </Button>
                        <Button size="small" variant="text" sx={{ color: 'error.main', ml: 1 }} onClick={() => deleteNotification(notification.id)}>
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

      {/* Create Notification Dialog */}
      <Dialog open={openCreateDialog} onClose={handleToggleCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Notification</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={selectedNotification?.title || ''}
            onChange={(e) => {
              if (selectedNotification) {
                setSelectedNotification({ ...selectedNotification, title: e.target.value });
              } else {
                setSelectedNotification({ ...(selectedNotification || {}), title: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Message"
            value={selectedNotification?.message || ''}
            onChange={(e) => {
              if (selectedNotification) {
                setSelectedNotification({ ...selectedNotification, message: e.target.value });
              } else {
                setSelectedNotification({ ...(selectedNotification || {}), message: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Type"
            select
            id="notification-type-select"
            value={selectedNotification?.type || ''}
            onChange={(e) => {
              if (selectedNotification) {
                setSelectedNotification({ ...selectedNotification, type: e.target.value });
              } else {
                setSelectedNotification({ ...(selectedNotification || {}), type: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="promotional">Promotional</MenuItem>
            <MenuItem value="transactional">Transactional</MenuItem>
            <MenuItem value="engagement">Engagement</MenuItem>
            <MenuItem value="announcement">Announcement</MenuItem>
          </TextField>
          <TextField
            label="Target Audience"
            select
            id="target-audience-select"
            value={selectedNotification?.targetAudience || ''}
            onChange={(e) => {
              if (selectedNotification) {
                setSelectedNotification({ ...selectedNotification, targetAudience: e.target.value });
              } else {
                setSelectedNotification({ ...(selectedNotification || {}), targetAudience: e.target.value });
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
            label="Scheduled Time"
            type="datetime-local"
            value={selectedNotification?.scheduledTime || ''}
            onChange={(e) => {
              if (selectedNotification) {
                setSelectedNotification({ ...selectedNotification, scheduledTime: e.target.value });
              } else {
                setSelectedNotification({ ...(selectedNotification || {}), scheduledTime: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleCreateDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedNotification) {
              try {
                await createNotification(selectedNotification);
                setOpenCreateDialog(false);
                setSelectedNotification(null);
                // Refresh after creation
                fetchNotificationsData(filters);
              } catch (err) {
                console.error('Error creating notification:', err);
              }
            }
          }}>
            Create Notification
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Notification Dialog */}
      <Dialog open={openEditDialog} onClose={handleToggleEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Notification</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={selectedNotification?.title || ''}
            onChange={(e) => {
              if (selectedNotification) {
                setSelectedNotification({ ...selectedNotification, title: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Message"
            value={selectedNotification?.message || ''}
            onChange={(e) => {
              if (selectedNotification) {
                setSelectedNotification({ ...selectedNotification, message: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Type"
            select
            id="edit-notification-type-select"
            value={selectedNotification?.type || ''}
            onChange={(e) => {
              if (selectedNotification) {
                setSelectedNotification({ ...selectedNotification, type: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="promotional">Promotional</MenuItem>
            <MenuItem value="transactional">Transactional</MenuItem>
            <MenuItem value="engagement">Engagement</MenuItem>
            <MenuItem value="announcement">Announcement</MenuItem>
          </TextField>
          <TextField
            label="Target Audience"
            select
            id="edit-target-audience-select"
            value={selectedNotification?.targetAudience || ''}
            onChange={(e) => {
              if (selectedNotification) {
                setSelectedNotification({ ...selectedNotification, targetAudience: e.target.value });
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
            label="Scheduled Time"
            type="datetime-local"
            value={selectedNotification?.scheduledTime || ''}
            onChange={(e) => {
              if (selectedNotification) {
                setSelectedNotification({ ...selectedNotification, scheduledTime: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedNotification) {
              try {
                await updateNotification(selectedNotification.id, selectedNotification);
                setOpenEditDialog(false);
                setSelectedNotification(null);
                // Refresh after update
                fetchNotificationsData(filters);
              } catch (err) {
                console.error('Error updating notification:', err);
              }
            }
          }}>
            Update Notification
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}