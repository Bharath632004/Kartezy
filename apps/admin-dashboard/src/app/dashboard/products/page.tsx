"use client";

import { useState } from 'react';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Button, IconButton,
  Tooltip, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, TablePagination, Avatar,
  Grid, Card, CardContent, LinearProgress, Stack, Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Add, Edit, Delete, Search, FilterList, Inventory2Outlined,
  WarningAmber, Refresh, MoreVert, CloudUpload,
} from '@mui/icons-material';
import { productService } from '@/lib/api';

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  active: 'success',
  inactive: 'warning',
  discontinued: 'error',
  out_of_stock: 'error',
};

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['products', search, statusFilter, page, rowsPerPage],
    queryFn: () => productService.getList({
      search: search || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page,
      size: rowsPerPage,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteDialogOpen(false);
    },
  });

  const products = response?.data?.content || response?.content || [];
  const totalElements = response?.data?.totalElements || response?.totalElements || 0;
  const totalPages = response?.data?.totalPages || response?.totalPages || 0;

  const lowStockCount = products.filter((p: any) => p.stock <= (p.minStockLevel || 5)).length;
  const outOfStockCount = products.filter((p: any) => p.stock === 0).length;

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Products</Typography>
          <Button variant="contained" startIcon={<Add />}>
            Add Product
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Inventory2Outlined sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{products.length}</Typography>
                <Typography variant="body2" color="text.secondary">Total Products</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderColor: 'warning.main' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <WarningAmber sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>{lowStockCount}</Typography>
                <Typography variant="body2" color="text.secondary">Low Stock</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderColor: 'error.main' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <WarningAmber sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>{outOfStockCount}</Typography>
                <Typography variant="body2" color="text.secondary">Out of Stock</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CloudUpload sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Bulk Import</Typography>
                <Typography variant="body2" color="text.secondary">CSV / Excel</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search & Filters */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              sx={{ minWidth: 280 }}
              InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="discontinued">Discontinued</MenuItem>
                <MenuItem value="out_of_stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}>
              <Refresh />
            </IconButton>
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load products. Please try again.
          </Alert>
        )}

        {/* Loading */}
        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Products Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No products found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product: any) => (
                    <TableRow key={product.id} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            src={product.images?.[0]}
                            variant="rounded"
                            sx={{ width: 48, height: 48, bgcolor: 'grey.100' }}
                          >
                            {product.name?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {product.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {product.id?.substring(0, 8)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell><Typography variant="body2">{product.sku}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{product.categoryName || '—'}</Typography></TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{product.price?.toFixed(2)}
                        </Typography>
                        {product.comparePrice && (
                          <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            ₹{product.comparePrice.toFixed(2)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={product.stock}
                          size="small"
                          color={product.stock === 0 ? 'error' : product.stock <= (product.minStockLevel || 5) ? 'warning' : 'success'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.status}
                          size="small"
                          color={statusColors[product.status] || 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit"><IconButton size="small"><Edit fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => { setSelectedProduct(product); setDeleteDialogOpen(true); }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More"><IconButton size="small"><MoreVert fontSize="small" /></IconButton></Tooltip>
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
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogContent>
            Are you sure you want to delete <strong>{selectedProduct?.name}</strong>? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => selectedProduct && deleteMutation.mutate(selectedProduct.id)}
              color="error"
              variant="contained"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
