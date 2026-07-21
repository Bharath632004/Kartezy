'use client';

import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Stack, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import * as React from 'react';
import { useMarketingStore } from '@/store/marketingStore';

export default function SponsoredProductsPage() {
  const { sponsoredProductsData, loading, error, fetchSponsoredProductsData, createSponsoredProduct, updateSponsoredProduct, deleteSponsoredProduct } = useMarketingStore();
  const [filters, setFilters] = React.useState({
    status: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  React.useEffect(() => {
    fetchSponsoredProductsData(filters);
  }, [filters, fetchSponsoredProductsData]);

  const handleToggleCreateDialog = () => {
    setOpenCreateDialog(!openCreateDialog);
    setSelectedProduct(null);
  };

  const handleToggleEditDialog = (product: any = null) => {
    setSelectedProduct(product ? { ...product } : null);
    setOpenEditDialog(!openEditDialog);
  };

  if (loading) return <Box p={4}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box p={4}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box p={4}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Sponsored Products Overview
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
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </TextField>
          <TextField
            label="Category"
            select
            labelId="category-label"
            id="category-select"
            value={filters.category || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            select
            MenuProps={{ MenuProps: { sx: { width: 200 } } }}
            labelWidth={100}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home-garden">Home & Garden</option>
            <option value="beauty">Beauty</option>
            <option value="sports">Sports</option>
            <option value="automotive">Automotive</option>
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
          <Button variant="contained" onClick={() => fetchSponsoredProductsData(filters)}>
            Apply Filters
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleToggleCreateDialog}>
            Create Sponsored Product
          </Button>
        </Stack>
      </Box>

      {!sponsoredProductsData || sponsoredProductsData.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography variant="body2">No sponsored products available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Sponsored Products List
            </Typography>
            <TableContainer>
              <Table stickyHeader aria-label="sponsored products table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Bid Amount</TableCell>
                    <TableCell align="right">Daily Budget</TableCell>
                    <TableCell align="right">Impressions</TableCell>
                    <TableCell align="right">Clicks</TableCell>
                    <TableCell align="right">CTR</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {sponsoredProductsData.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell align="right">${product.bidAmount?.toFixed(2) ?? '0.00'}</TableCell>
                      <TableCell align="right">${product.dailyBudget?.toFixed(2) ?? '0.00'}</TableCell>
                      <TableCell align="right">{product.impressions?.toLocaleString() ?? '0'}</TableCell>
                      <TableCell align="right">{product.clicks?.toLocaleString() ?? '0'}</TableCell>
                      <TableCell align="right">{product.ctr?.toFixed(2) ?? '0'}%</TableCell>
                      <TableCell>
                        <span sx={{
                          bgcolor: product.status.toLowerCase() === 'active' ? 'success.main' :
                                   product.status.toLowerCase() === 'paused' ? 'warning.main' :
                                   product.status.toLowerCase() === 'expired' ? 'error.main' : 'info.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}>
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" sx={{ color: 'primary.main' }} onClick={() => handleToggleEditDialog(product)}>
                          Edit
                        </Button>
                        <Button size="small" variant="text" sx={{ color: 'error.main', ml: 1 }} onClick={() => deleteSponsoredProduct(product.id)}>
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

      {/* Create Sponsored Product Dialog */}
      <Dialog open={openCreateDialog} onClose={handleToggleCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Sponsored Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            value={selectedProduct?.name || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, name: e.target.value });
              } else {
                setSelectedProduct({ ...(selectedProduct || {}), name: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={selectedProduct?.description || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, description: e.target.value });
              } else {
                setSelectedProduct({ ...(selectedProduct || {}), description: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category"
            select
            labelId="sponsored-category-label"
            id="sponsored-category-select"
            value={selectedProduct?.category || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, category: e.target.value });
              } else {
                setSelectedProduct({ ...(selectedProduct || {}), category: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="fashion">Fashion</MenuItem>
            <MenuItem value="home-garden">Home & Garden</MenuItem>
            <MenuItem value="beauty">Beauty</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
            <MenuItem value="automotive">Automotive</MenuItem>
          </TextField>
          <TextField
            label="Product Image URL"
            value={selectedProduct?.imageUrl || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, imageUrl: e.target.value });
              } else {
                setSelectedProduct({ ...(selectedProduct || {}), imageUrl: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Landing Page URL"
            value={selectedProduct?.landingUrl || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, landingUrl: e.target.value });
              } else {
                setSelectedProduct({ ...(selectedProduct || {}), landingUrl: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bid Amount ($)"
            type="number"
            value={selectedProduct?.bidAmount || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, bidAmount: parseFloat(e.target.value) || 0 });
              } else {
                setSelectedProduct({ ...(selectedProduct || {}), bidAmount: parseFloat(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Daily Budget ($)"
            type="number"
            value={selectedProduct?.dailyBudget || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, dailyBudget: parseFloat(e.target.value) || 0 });
              } else {
                setSelectedProduct({ ...(selectedProduct || {}), dailyBudget: parseFloat(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={selectedProduct?.startDate || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, startDate: e.target.value });
              } else {
                setSelectedProduct({ ...(selectedProduct || {}), startDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            value={selectedProduct?.endDate || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, endDate: e.target.value });
              } else {
                setSelectedProduct({ ...(selectedProduct || {}), endDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Target Keywords"
            value={selectedProduct?.targetKeywords || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, targetKeywords: e.target.value });
              } else {
                setSelectedProduct({ ...(selectedProduct || {}), targetKeywords: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleCreateDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedProduct) {
              try {
                await createSponsoredProduct(selectedProduct);
                setOpenCreateDialog(false);
                setSelectedProduct(null);
                // Refresh after creation
                fetchSponsoredProductsData(filters);
              } catch (err) {
                console.error('Error creating sponsored product:', err);
              }
            }
          }}>
            Create Sponsored Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Sponsored Product Dialog */}
      <Dialog open={openEditDialog} onClose={handleToggleEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Sponsored Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            value={selectedProduct?.name || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, name: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={selectedProduct?.description || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, description: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category"
            select
            labelId="edit-sponsored-category-label"
            id="edit-sponsored-category-select"
            value={selectedProduct?.category || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, category: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="fashion">Fashion</MenuItem>
            <MenuItem value="home-garden">Home & Garden</MenuItem>
            <MenuItem value="beauty">Beauty</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
            <MenuItem value="automotive">Automotive</MenuItem>
          </TextField>
          <TextField
            label="Product Image URL"
            value={selectedProduct?.imageUrl || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, imageUrl: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Landing Page URL"
            value={selectedProduct?.landingUrl || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, landingUrl: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bid Amount ($)"
            type="number"
            value={selectedProduct?.bidAmount || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, bidAmount: parseFloat(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Daily Budget ($)"
            type="number"
            value={selectedProduct?.dailyBudget || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, dailyBudget: parseFloat(e.target.value) || 0 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={selectedProduct?.startDate || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, startDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            value={selectedProduct?.endDate || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, endDate: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Target Keywords"
            value={selectedProduct?.targetKeywords || ''}
            onChange={(e) => {
              if (selectedProduct) {
                setSelectedProduct({ ...selectedProduct, targetKeywords: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedProduct) {
              try {
                await updateSponsoredProduct(selectedProduct.id, selectedProduct);
                setOpenEditDialog(false);
                setSelectedProduct(null);
                // Refresh after update
                fetchSponsoredProductsData(filters);
              } catch (err) {
                console.error('Error updating sponsored product:', err);
              }
            }
          }}>
            Update Sponsored Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}