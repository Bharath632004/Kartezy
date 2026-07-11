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
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  DeleteOutlined,
  EditOutlined,
  FilterAltOutlined,
  RefreshOutlined,
} from '@mui/icons-material';
import { orderService } from '@/lib/api';

const OrdersList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [openReplacementDialog, setOpenReplacementDialog] = useState(false);
  const [openAssignDriverDialog, setOpenAssignDriverDialog] = useState(false);
  const [driverIdForAssignment, setDriverIdForAssignment] = useState<string>('');

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders', search, statusFilter, page, rowsPerPage],
    queryFn: () =>
      orderService.getList({
        search,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        size: rowsPerPage,
      }),
  });

  const handleCancelClick = (id: string) => {
    setSelectedOrderId(id);
    setOpenCancelDialog(true);
  };

  const handleRefundClick = (id: string) => {
    setSelectedOrderId(id);
    setOpenRefundDialog(true);
  };

  const handleReturnClick = (id: string) => {
    setSelectedOrderId(id);
    setOpenReturnDialog(true);
  };

  const handleReplacementClick = (id: string) => {
    setSelectedOrderId(id);
    setOpenReplacementDialog(true);
  };

  const handleAssignDriverClick = (id: string) => {
    setSelectedOrderId(id);
    setOpenAssignDriverDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (selectedOrderId) {
      try {
        await orderService.cancelOrder(selectedOrderId);
        setOpenCancelDialog(false);
        setSelectedOrderId(null);
      } catch (err) {
        console.error('Error cancelling order:', err);
      }
    }
  };

  const handleRefundConfirm = async () => {
    if (selectedOrderId) {
      try {
        await orderService.refundOrder(selectedOrderId);
        setOpenRefundDialog(false);
        setSelectedOrderId(null);
      } catch (err) {
        console.error('Error refunding order:', err);
      }
    }
  };

  const handleReturnConfirm = async () => {
    if (selectedOrderId) {
      try {
        await orderService.returnOrder(selectedOrderId);
        setOpenReturnDialog(false);
        setSelectedOrderId(null);
      } catch (err) {
        console.error('Error returning order:', err);
      }
    }
  };

  const handleReplacementConfirm = async () => {
    if (selectedOrderId) {
      try {
        await orderService.replacementOrder(selectedOrderId);
        setOpenReplacementDialog(false);
        setSelectedOrderId(null);
      } catch (err) {
        console.error('Error creating replacement order:', err);
      }
    }
  };

  const handleAssignDriverConfirm = async () => {
    if (selectedOrderId && driverIdForAssignment) {
      try {
        await orderService.assignDriver(selectedOrderId, driverIdForAssignment);
        setOpenAssignDriverDialog(false);
        setSelectedOrderId(null);
        setDriverIdForAssignment('');
      } catch (err) {
        console.error('Error assigning driver:', err);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  const orders = response?.content || [];
  const totalPages = response?.totalPages || 0;
  const totalElements = response?.totalElements || 0;

  return (
    <Box sx={{ py: 3 }}>
      <Toolbar>
        <Typography variant="h6" gutterBottom>
          Order Management
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <TextField
          label="Search"
          placeholder="Search by order ID, customer name, or items"
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
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
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
              <TableCell>Order ID</TableCell>
              <TableCell align="right">Customer</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Assigned Driver</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell component="th" scope="row">
                  {order.id}
                </TableCell>
                <TableCell align="right">
                  {order.customerName}
                </TableCell>
                <TableCell align="right">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  {order.status}
                </TableCell>
                <TableCell align="right">
                  ${parseFloat(order.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {order.driverName || 'Unassigned'}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Assign Driver">
                    <IconButton onClick={() => handleAssignDriverClick(order.id)}>
                      <PersonAddAltOutlined />
                    </IconButton>
                  </Tooltip>
                  {order.status === 'pending' || order.status === 'confirmed' ? (
                    <>
                      <Tooltip title="Cancel">
                        <IconButton onClick={() => handleCancelClick(order.id)}>
                          <CloseOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Refund">
                        <IconButton onClick={() => handleRefundClick(order.id)}>
                          <MoneyOffOutlined />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : order.status === 'delivered' ? (
                    <>
                      <Tooltip title="Return">
                        <IconButton onClick={() => handleReturnClick(order.id)}>
                          <RestoreOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Replacement">
                        <IconButton onClick={() => handleReplacementClick(order.id)}>
                          <RefreshOutlined />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <>
              Showing
              &nbsp;<strong>{page * rowsPerPage + 1}</strong>&nbsp;-
              &nbsp;<strong>{Math.min((page + 1) * rowsPerPage, totalElements)}</strong>&nbsp;of&nbsp;
              &nbsp;<strong>{totalElements}</strong>&nbsp;
            </>
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

      {/* Assign Driver Dialog */}
      <Dialog open={openAssignDriverDialog} onClose={() => setOpenAssignDriverDialog(false)}>
        <DialogTitle>Assign Driver</DialogTitle>
        <DialogContent>
          <TextField
            label="Driver ID"
            value={driverIdForAssignment}
            onChange={(e) => setDriverIdForAssignment(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDriverDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignDriverConfirm} color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Cancel</Button>
          <Button onClick={handleCancelConfirm} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={openRefundDialog} onClose={() => setOpenRefundDialog(false)}>
        <DialogTitle>Refund Order</DialogTitle>
        <DialogContent>
          Are you sure you want to refund this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRefundDialog(false)}>Cancel</Button>
          <Button onClick={handleRefundConfirm} color="error">
            Refund
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)}>
        <DialogTitle>Return Order</DialogTitle>
        <DialogContent>
          Are you sure you want to accept the return for this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReturnDialog(false)}>Cancel</Button>
          <Button onClick={handleReturnConfirm} color="warning">
            Accept Return
          </Button>
        </DialogActions>
      </Dialog>

      {/* Replacement Dialog */}
      <Dialog open={openReplacementDialog} onClose={() => setOpenReplacementDialog(false)}>
        <DialogTitle>Replacement Order</DialogTitle>
        <DialogContent>
          Are you sure you want to create a replacement order?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReplacementDialog(false)}>Cancel</Button>
          <Button onClick={handleReplacementConfirm} color="warning">
            Create Replacement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersList;