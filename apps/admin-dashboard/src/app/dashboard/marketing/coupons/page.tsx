import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, TextField as MuiTextField, InputLabel, MenuItem, FormControl, Select, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import * as React from 'react';
import { useMarketingStore } from '@/store/marketingStore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function CouponsPage() {
  const { coupons, loading, error, fetchCoupons, createCoupon, updateCoupon, deleteCoupon } = useMarketingStore();
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [selectedCoupon, setSelectedCoupon] = React.useState(null);
  const [filters, setFilters] = React.useState({
    status: '',
    type: '',
    search: '',
  });

  React.useEffect(() => {
    fetchCoupons(filters);
  }, [filters, fetchCoupons]);

  const handleCreateClick = () => {
    setSelectedCoupon(null);
    setOpenCreateDialog(true);
  };

  const handleEditClick = (coupon: any) => {
    setSelectedCoupon(coupon);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id);
        // Refresh after deletion
        fetchCoupons(filters);
      } catch (err) {
        console.error('Error deleting coupon:', err);
      }
    }
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setSelectedCoupon(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedCoupon(null);
  };

  if (loading) return <Box p={4}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box p={4}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box p={4}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Coupons Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
            Create Coupon
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Search"
            value={filters.search || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            sx={{ width: 200 }}
          />
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="used_up">Used Up</option>
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
            <option value="percentage">Percentage</option>
            <option value="fixed_amount">Fixed Amount</option>
            <option value="free_shipping">Free Shipping</option>
          </TextField>
          <Button variant="contained" onClick={() => fetchCoupons(filters)}>
            Apply Filters
          </Button>
        </Stack>
      </Box>

      {!coupons || coupons.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography variant="body2">No coupons available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Coupons List
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="coupons table">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">Type</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="center">Usage</TableCell>
                    <TableCell align="center">Valid From</TableCell>
                    <TableCell align="center">Valid Until</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {coupons.map((coupon: any) => (
                    <TableRow key={coupon.id}>
                      <TableCell>{coupon.code}</TableCell>
                      <TableCell>{coupon.description}</TableCell>
                      <TableCell align="center">
                        {coupon.type === 'percentage' ? (
                          <span>%</span>
                        ) : coupon.type === 'fixed_amount' ? (
                          <span>$</span>
                        ) : (
                          <span>🚚</span>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {coupon.type === 'percentage' ? (
                          `${coupon.value}%`
                        ) : (
                          `${coupon.value}`
                        )}
                      </TableCell>
                      <TableCell align="center">{coupon.usedCount}/{coupon.usageLimit}</TableCell>
                      <TableCell align="center">{coupon.validFrom}</TableCell>
                      <TableCell align="center">{coupon.validUntil}</TableCell>
                      <TableCell align="center">
                        <span sx={{
                          bgcolor: coupon.status === 'active' ? 'success.main' :
                                   coupon.status === 'expired' ? 'error.main' : 'warning.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {coupon.status}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="text" onClick={() => handleEditClick(coupon)}>
                          <EditIcon fontSize="small" />
                        </Button>
                        <Button size="small" variant="text" onClick={() => handleDeleteClick(coupon.id)} sx={{ ml: 1 }}>
                          <DeleteIcon fontSize="small" />
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

      {/* Create Coupon Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="sm">
        <DialogTitle>Create New Coupon</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">Coupon Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="coupon-type-select"
              value={selectedCoupon?.type || ''}
              label="Coupon Type"
              onChange={(e) => {
                if (selectedCoupon) {
                  setSelectedCoupon({ ...selectedCoupon, type: e.target.value });
                } else {
                  setSelectedCoupon({ ...(selectedCoupon || {}), type: e.target.value });
                }
              }}
            >
              <MenuItem value="percentage">Percentage (%)</MenuItem>
              <MenuItem value="fixed_amount">Fixed Amount ($)</MenuItem>
              <MenuItem value="free_shipping">Free Shipping</MenuItem>
            </Select>
          </FormControl>

          {!selectedCoupon?.type || selectedCoupon.type !== 'free_shipping' && (
            <TextField
              label="Value"
              type="number"
              value={selectedCoupon?.value || ''}
              onChange={(e) => {
                if (selectedCoupon) {
                  setSelectedCoupon({ ...selectedCoupon, value: parseFloat(e.target.value) || 0 });
                } else {
                  setSelectedCoupon({ ...(selectedCoupon || {}), value: parseFloat(e.target.value) || 0 });
                }
              }}
              InputProps={{
                startAdornment: selectedCoupon?.type === 'percentage' ? (
                  <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}>%</span>
                ) : selectedCoupon?.type === 'fixed_amount' ? (
                  <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}>$ </span>
                ) : null
              }}
            />
          )}

          <TextField
            label="Code"
            value={selectedCoupon?.code || ''}
            onChange={(e) => {
              if (selectedCoupon) {
                setSelectedCoupon({ ...selectedCoupon, code: e.target.value });
              } else {
                setSelectedCoupon({ ...(selectedCoupon || {}), code: e.target.value });
              }
            }}
          />

          <TextField
            label="Description"
            value={selectedCoupon?.description || ''}
            onChange={(e) => {
              if (selectedCoupon) {
                setSelectedCoupon({ ...selectedCoupon, description: e.target.value });
              } else {
                setSelectedCoupon({ ...(selectedCoupon || {}), description: e.target.value });
              }
            }}
          />

          <TextField
            label="Usage Limit"
            type="number"
            value={selectedCoupon?.usageLimit || ''}
            onChange={(e) => {
              if (selectedCoupon) {
                setSelectedCoupon({ ...selectedCoupon, usageLimit: parseInt(e.target.value) || 0 });
              } else {
                setSelectedCoupon({ ...(selectedCoupon || {}), usageLimit: parseInt(e.target.value) || 0 });
              }
            }}
          />

          <TextField
            label="Valid From (YYYY-MM-DD)"
            type="date"
            value={selectedCoupon?.validFrom || ''}
            onChange={(e) => {
              if (selectedCoupon) {
                setSelectedCoupon({ ...selectedCoupon, validFrom: e.target.value });
              } else {
                setSelectedCoupon({ ...(selectedCoupon || {}), validFrom: e.target.value });
              }
            }}
          />

          <TextField
            label="Valid Until (YYYY-MM-DD)"
            type="date"
            value={selectedCoupon?.validUntil || ''}
            onChange={(e) => {
              if (selectedCoupon) {
                setSelectedCoupon({ ...selectedCoupon, validUntil: e.target.value });
              } else {
                setSelectedCoupon({ ...(selectedCoupon || {}), validUntil: e.target.value });
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedCoupon) {
              try {
                await createCoupon(selectedCoupon);
                setOpenCreateDialog(false);
                setSelectedCoupon(null);
                // Refresh after creation
                fetchCoupons(filters);
              } catch (err) {
                console.error('Error creating coupon:', err);
              }
            }
          }}>
            Create Coupon
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Coupon Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm">
        <DialogTitle>Edit Coupon</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">Coupon Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="coupon-type-select"
              value={selectedCoupon?.type || ''}
              label="Coupon Type"
              onChange={(e) => {
                if (selectedCoupon) {
                  setSelectedCoupon({ ...selectedCoupon, type: e.target.value });
                }
              }}
            >
              <MenuItem value="percentage">Percentage (%)</MenuItem>
              <MenuItem value="fixed_amount">Fixed Amount ($)</MenuItem>
              <MenuItem value="free_shipping">Free Shipping</MenuItem>
            </Select>
          </FormControl>

          {!selectedCoupon?.type || selectedCoupon.type !== 'free_shipping' && (
            <TextField
              label="Value"
              type="number"
              value={selectedCoupon?.value || ''}
              onChange={(e) => {
                if (selectedCoupon) {
                  setSelectedCoupon({ ...selectedCoupon, value: parseFloat(e.target.value) || 0 });
                }
              }}
              InputProps={{
                startAdornment: selectedCoupon?.type === 'percentage' ? (
                  <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}>%</span>
                ) : selectedCoupon?.type === 'fixed_amount' ? (
                  <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}>$ </span>
                ) : null
              }}
            />
          )}

          <TextField
            label="Code"
            value={selectedCoupon?.code || ''}
            onChange={(e) => {
              if (selectedCoupon) {
                setSelectedCoupon({ ...selectedCoupon, code: e.target.value });
              }
            }}
          />

          <TextField
            label="Description"
            value={selectedCoupon?.description || ''}
            onChange={(e) => {
              if (selectedCoupon) {
                setSelectedCoupon({ ...selectedCoupon, description: e.target.value });
              }
            }}
          />

          <TextField
            label="Usage Limit"
            type="number"
            value={selectedCoupon?.usageLimit || ''}
            onChange={(e) => {
              if (selectedCoupon) {
                setSelectedCoupon({ ...selectedCoupon, usageLimit: parseInt(e.target.value) || 0 });
              }
            }}
          />

          <TextField
            label="Valid From (YYYY-MM-DD)"
            type="date"
            value={selectedCoupon?.validFrom || ''}
            onChange={(e) => {
              if (selectedCoupon) {
                setSelectedCoupon({ ...selectedCoupon, validFrom: e.target.value });
              }
            }}
          />

          <TextField
            label="Valid Until (YYYY-MM-DD)"
            type="date"
            value={selectedCoupon?.validUntil || ''}
            onChange={(e) => {
              if (selectedCoupon) {
                setSelectedCoupon({ ...selectedCoupon, validUntil: e.target.value });
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedCoupon) {
              try {
                await updateCoupon(selectedCoupon.id, selectedCoupon);
                setOpenEditDialog(false);
                setSelectedCoupon(null);
                // Refresh after update
                fetchCoupons(filters);
              } catch (err) {
                console.error('Error updating coupon:', err);
              }
            }
          }}>
            Update Coupon
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}