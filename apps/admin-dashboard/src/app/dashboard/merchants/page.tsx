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
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  EditOutlined,
  FilterAltOutlined,
  RefreshOutlined,
  Block,
  RestoreAltOutlined,
  CheckCircleOutlined,
  CancelOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@mui/icons-material';
import { merchantService } from '@/lib/api';

const MerchantList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  const [openSuspendDialog, setOpenSuspendDialog] = useState(false);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['merchants', search, statusFilter, page, rowsPerPage],
    queryFn: () =>
      merchantService.getList({
        search,
        page,
        size: rowsPerPage,
      }),
  });

  const handleSuspendClick = (id: string) => {
    setSelectedMerchantId(id);
    setOpenSuspendDialog(true);
  };

  const handleActivateClick = (id: string) => {
    setSelectedMerchantId(id);
    setOpenActivateDialog(true);
  };

  const handleRejectClick = (id: string) => {
    setSelectedMerchantId(id);
    setOpenRejectDialog(true);
  };

  const handleApproveClick = (id: string) => {
    setSelectedMerchantId(id);
    setOpenApproveDialog(true);
  };

  const handleSuspendConfirm = async () => {
    if (selectedMerchantId) {
      try {
        await merchantService.suspend(selectedMerchantId);
        setOpenSuspendDialog(false);
        setSelectedMerchantId(null);
      } catch (err) {
        console.error('Error suspending merchant:', err);
      }
    }
  };

  const handleActivateConfirm = async () => {
    if (selectedMerchantId) {
      try {
        await merchantService.activate(selectedMerchantId);
        setOpenActivateDialog(false);
        setSelectedMerchantId(null);
      } catch (err) {
        console.error('Error activating merchant:', err);
      }
    }
  };

  const handleRejectConfirm = async () => {
    if (selectedMerchantId) {
      try {
        await merchantService.reject(selectedMerchantId);
        setOpenRejectDialog(false);
        setSelectedMerchantId(null);
      } catch (err) {
        console.error('Error rejecting merchant:', err);
      }
    }
  };

  const handleApproveConfirm = async () => {
    if (selectedMerchantId) {
      try {
        await merchantService.approve(selectedMerchantId);
        setOpenApproveDialog(false);
        setSelectedMerchantId(null);
      } catch (err) {
        console.error('Error approving merchant:', err);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading merchants</div>;

  const merchants = response?.content || [];
  const totalPages = response?.totalPages || 0;
  const totalElements = response?.totalElements || 0;

  return (
    <Box sx={{ py: 3 }}>
      <Toolbar>
        <Typography variant="h6" gutterBottom>
          Merchant Management
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
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
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
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">Revenue</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {merchants.map((merchant: any) => (
              <TableRow key={merchant.id}>
                <TableCell component="th" scope="row">
                  <Link href={`/dashboard/merchants/${merchant.id}`} underline="hover" color="inherit">
                    {merchant.name}
                  </Link>
                </TableCell>
                <TableCell align="right">{merchant.email}</TableCell>
                <TableCell align="right">{merchant.phoneNumber}</TableCell>
                <TableCell align="right">
                  {merchant.status}
                </TableCell>
                <TableCell align="right">
                  {merchant.rating?.toFixed(1)} ⭐
                </TableCell>
                <TableCell align="right">
                  ${parseFloat(merchant.revenue || 0).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {/* Action buttons based on status */}
                  {merchant.status === 'pending' && (
                    <>
                      <Tooltip title="Approve">
                        <IconButton onClick={() => handleApproveClick(merchant.id)}>
                          <CheckCircleOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton onClick={() => handleRejectClick(merchant.id)}>
                          <CancelOutlined />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {merchant.status === 'approved' && (
                    <>
                      <Tooltip title="Suspend">
                        <IconButton onClick={() => handleSuspendClick(merchant.id)}>
                          <PauseCircleOutlined />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {merchant.status === 'suspended' && (
                    <Tooltip title="Activate">
                      <IconButton onClick={() => handleActivateClick(merchant.id)}>
                        <PlayCircleOutlined />
                      </IconButton>
                    </Tooltip>
                  )}
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
                setRowsPerPage(parseInt(e.target.value));
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
        <DialogTitle>Suspend Merchant</DialogTitle>
        <DialogContent>
          Are you sure you want to suspend this merchant?
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
        <DialogTitle>Activate Merchant</DialogTitle>
        <DialogContent>
          Are you sure you want to activate this merchant?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenActivateDialog(false)}>Cancel</Button>
          <Button onClick={handleActivateConfirm} color="success">
            Activate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
        <DialogTitle>Reject Merchant</DialogTitle>
        <DialogContent>
          Are you sure you want to reject this merchant?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleRejectConfirm} color="error">
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Approve Merchant</DialogTitle>
        <DialogContent>
          Are you sure you want to approve this merchant?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button onClick={handleApproveConfirm} color="success">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MerchantList;