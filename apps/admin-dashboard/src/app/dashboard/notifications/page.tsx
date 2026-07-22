"use client";

import { useState } from 'react';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton, Tooltip,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, TablePagination, Stack,
  Alert, Divider, Card, CardContent, Grid, Avatar, LinearProgress,
  Switch, FormControlLabel,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Notifications as NotifIcon, Delete, CheckCircle, Refresh,
  Send, Warning, Info, CheckCircleOutline, ErrorOutline,
  Schedule, FilterList,
} from '@mui/icons-material';
import { notificationService } from '@/lib/api';

const typeColors: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

const typeIcons: Record<string, React.ReactNode> = {
  info: <Info />,
  success: <CheckCircleOutline />,
  warning: <Warning />,
  error: <ErrorOutline />,
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [typeFilter, setTypeFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendForm, setSendForm] = useState({ userId: '', title: '', message: '', type: 'info' as const, channel: 'IN_APP' as const });

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['notifications', page, rowsPerPage, typeFilter, readFilter],
    queryFn: () => notificationService.getNotifications({
      page, size: rowsPerPage,
      type: typeFilter === 'all' ? undefined : typeFilter,
      read: readFilter === 'all' ? undefined : readFilter === 'read',
    }),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const sendMutation = useMutation({
    mutationFn: () => notificationService.getNotifications({}),
    onSuccess: () => { setSendDialogOpen(false); queryClient.invalidateQueries({ queryKey: ['notifications'] }); },
  });

  const notifications = response?.data?.content || response?.content || [];
  const totalElements = response?.data?.totalElements || response?.totalElements || 0;

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Notifications</Typography>
          <Button variant="contained" startIcon={<Send />} onClick={() => setSendDialogOpen(true)}>
            Send Notification
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card><CardContent sx={{ textAlign: 'center' }}>
              <NotifIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{totalElements}</Typography>
              <Typography variant="body2" color="text.secondary">Total</Typography>
            </CardContent></Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card><CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {notifications.filter((n: any) => n.read).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Read</Typography>
            </CardContent></Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card><CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {notifications.filter((n: any) => !n.read).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Unread</Typography>
            </CardContent></Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} label="Type" onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={readFilter} label="Status" onChange={(e) => { setReadFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['notifications'] })}>
              <Refresh />
            </IconButton>
          </Stack>
        </Paper>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>Failed to load notifications.</Alert>}

        {/* Notifications Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No notifications found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  notifications.map((notif: any) => (
                    <TableRow key={notif.id} hover sx={{ bgcolor: notif.read ? 'inherit' : 'action.hover' }}>
                      <TableCell>
                        <Chip
                          icon={typeIcons[notif.type] || <Info />}
                          label={notif.type}
                          size="small"
                          color={typeColors[notif.type] || 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 600 }}>
                          {notif.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{
                          maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {notif.message}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">{notif.userId?.substring(0, 8) || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={notif.read ? 'Read' : 'Unread'}
                          size="small"
                          color={notif.read ? 'default' : 'primary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {!notif.read && (
                          <Tooltip title="Mark as Read">
                            <IconButton size="small" onClick={() => markReadMutation.mutate(notif.id)}>
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => deleteMutation.mutate(notif.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>

        {/* Send Notification Dialog */}
        <Dialog open={sendDialogOpen} onClose={() => setSendDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="User ID"
                value={sendForm.userId}
                onChange={(e) => setSendForm({ ...sendForm, userId: e.target.value })}
                placeholder="Leave empty for all users"
                fullWidth
              />
              <TextField
                label="Title"
                value={sendForm.title}
                onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })}
                fullWidth required
              />
              <TextField
                label="Message"
                value={sendForm.message}
                onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                multiline rows={3}
                fullWidth required
              />
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select value={sendForm.type} label="Type" onChange={(e) => setSendForm({ ...sendForm, type: e.target.value as any })}>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Channel</InputLabel>
                <Select value={sendForm.channel} label="Channel" onChange={(e) => setSendForm({ ...sendForm, channel: e.target.value as any })}>
                  <MenuItem value="IN_APP">In-App</MenuItem>
                  <MenuItem value="PUSH">Push</MenuItem>
                  <MenuItem value="EMAIL">Email</MenuItem>
                  <MenuItem value="SMS">SMS</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSendDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => sendMutation.mutate()} disabled={!sendForm.title || !sendForm.message}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
