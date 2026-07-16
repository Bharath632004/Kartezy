"use client";

import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Toolbar,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Badge,

} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircleOutlined,
  EditOutlined,
  FilterAltOutlined,
  RefreshOutlined,
  Block,
  RestoreOutlined,
  StarBorder,
} from '@mui/icons-material';
import { deliveryService } from '@/lib/api';

const DeliveryList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [openSuspendDialog, setOpenSuspendDialog] = useState(false);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['drivers', search, statusFilter, page, rowsPerPage],
    queryFn: () =>
      deliveryService.getList({
        search,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        size: rowsPerPage,
      }),
    select: (res: any) => res.data,
  });

  const handleSuspendClick = (id: string) => {
    setSelectedDriverId(id);
    setOpenSuspendDialog(true);
  };

  const handleActivateClick = (id: string) => {
    setSelectedDriverId(id);
    setOpenActivateDialog(true);
  };

  const handleApproveClick = (id: string) => {
    setSelectedDriverId(id);
    setOpenApproveDialog(true);
  };

  const handleApproveConfirm = async () => {
    if (selectedDriverId) {
      try {
        await deliveryService.approve(selectedDriverId);
        setOpenApproveDialog(false);
        setSelectedDriverId(null);
      } catch (err) {
        console.error('Error approving driver:', err);
      }
    }
  };

  const handleSuspendConfirm = async () => {
    if (selectedDriverId) {
      try {
        await deliveryService.suspend(selectedDriverId);
        setOpenSuspendDialog(false);
        setSelectedDriverId(null);
      } catch (err) {
        console.error('Error suspending driver:', err);
      }
    }
  };

  const handleActivateConfirm = async () => {
    if (selectedDriverId) {
      try {
        await deliveryService.activate(selectedDriverId);
        setOpenActivateDialog(false);
        setSelectedDriverId(null);
      } catch (err) {
        console.error('Error activating driver:', err);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading drivers</div>;

  const drivers = response?.content || [];
  const totalPages = response?.totalPages || 0;
  const totalElements = response?.totalElements || 0;

  return (
    <Box sx={{ py: 3 }}>
      <Toolbar>
        <Typography variant="h6" gutterBottom>
          Driver Management
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <TextField
          label="Search"
          placeholder="Search by name, email, or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 250, marginRight: 2 }}
        />
        <FormControl sx={{ marginRight: 2 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={() => setPage(0)} size="large" aria-label="refresh">
          <RefreshOutlined />
        </IconButton>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Vehicle</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">Earnings</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver: any) => (
              <TableRow key={driver.id}>
                <TableCell component="th" scope="row">
                  <Link href={`/dashboard/delivery/${driver.id}`} underline="hover" color="inherit">
                    {driver.firstName} {driver.lastName}
                  </Link>
                </TableCell>
                <TableCell align="right">{driver.email}</TableCell>
                <TableCell align="right">{driver.phoneNumber}</TableCell>
                <TableCell align="right">
                  {driver.status === 'ACTIVE' ? (
                    <Badge badgeContent="Active" color="success" />
                  ) : (
                    <Badge badgeContent="Suspended" color="error" />
                  )}
                </TableCell>
                <TableCell align="right">{driver.vehicle?.model}</TableCell>
                <TableCell align="right">
                  {driver.rating?.toFixed(1)} &nbsp;<StarBorder fontSize="small" color="warning" />
                </TableCell>
                <TableCell align="right">
                  ${parseFloat(driver.earnings || 0).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {/* Approve Button */}
                  {driver.status === 'PENDING' && (
                    <Tooltip title="Approve Driver">
                      <IconButton
                        onClick={() => handleApproveClick(driver.id)}
                        disabled={driver.status !== 'PENDING'}
                      >
                        {driver.status !== 'PENDING' ? null : <CheckCircleOutlined />}
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Suspend Driver">
                    <IconButton
                      onClick={() => handleSuspendClick(driver.id)}
                      disabled={driver.status !== 'ACTIVE'}
                    >
                      {driver.status !== 'ACTIVE' ? null : <Block />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Activate Driver">
                    <IconButton
                      onClick={() => handleActivateClick(driver.id)}
                      disabled={driver.status !== 'SUSPENDED'}
                    >
                      {driver.status !== 'SUSPENDED' ? null : <RestoreOutlined />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {totalElements > 0 && (
            <>
              Showing
              &nbsp;<strong>{page * rowsPerPage + 1}</strong>&nbsp;-
              &nbsp;<strong>{Math.min((page + 1) * rowsPerPage, totalElements)}</strong>&nbsp;of&nbsp;
              &nbsp;<strong>{totalElements}</strong>&nbsp;
            </>
          )}
        </Box>
        <Box>
          {totalPages > 1 && (
            <Select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value as number);
                setPage(0);
              }}
              inputProps={{
                'aria-label': 'rows per page',
              }}
            >
              {[5, 10, 25].map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </Select>
          )}
        </Box>
        <Box>
          {totalPages > 1 && (
            <>
              <Button
                size="small"
                onClick={() => {
                  if (page > 0) setPage(page - 1);
                }}
                disabled={page === 0}
              >
                Previous
              </Button>
              &nbsp;
              <Button
                size="small"
                onClick={() => {
                  if (page < totalPages - 1) setPage(page + 1);
                }}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Suspend Dialog */}
      <Dialog open={openSuspendDialog} onClose={() => setOpenSuspendDialog(false)}>
        <DialogTitle>Suspend Driver</DialogTitle>
        <DialogContent>
          Are you sure you want to suspend this driver?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuspendDialog(false)}>Cancel</Button>
          <Button onClick={handleSuspendConfirm} color="error">
            Suspend
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activate Dialog */}
      <Dialog open={openActivateDialog} onClose={() => setOpenActivateDialog(false)}>
        <DialogTitle>Activate Driver</DialogTitle>
        <DialogContent>
          Are you sure you want to activate this driver?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenActivateDialog(false)}>Cancel</Button>
          <Button onClick={handleActivateConfirm} color="success">
            Activate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryList;