"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  Toolbar,
  Typography,
  Stack,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { userService } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CustomersPage() {
  const router = useRouter();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  // Define columns
  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'name', headerName: 'Name', width: 150 },
      { field: 'email', headerName: 'Email', width: 200 },
      { field: 'phone', headerName: 'Phone', width: 120 },
      { field: 'status', headerName: 'Status', width: 120 },
      { field: 'createdAt', headerName: 'Joined', width: 150, type: 'date' },
      { field: 'actions', headerName: 'Actions', width: 150, sortable: false },
    ],
    []
  );

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: searchText,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: page + 1, // API might use 1-based page
        limit: pageSize,
      };
      const response = await userService.getList(params);
      const { data, total, page: currentPage, limit } = response.data;
      setRows(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchText, statusFilter, page, pageSize]);

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(0); // reset to first page
  };

  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(e.target.value as string);
    setPage(0);
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setPageSize(Number(e.target.value));
    setPage(0);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle row actions
  const handleBlock = async (id: string) => {
    try {
      await userService.blockUser(id);
      await fetchCustomers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to block user');
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      await userService.unblockUser(id);
      await fetchCustomers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unblock user');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        await fetchCustomers();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  // Render actions cell
  const renderActions = (_: any, row: any) => {
    const isBlocked = row.status === 'blocked';
    return (
      <Stack direction="row" spacing={2}>
        {isBlocked ? (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => handleUnblock(row.id)}
          >
            Unblock
          </Button>
        ) : (
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => handleBlock(row.id)}
          >
            Block
          </Button>
        )}
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => handleDelete(row.id)}
        >
          Delete
        </Button>
      </Stack>
    );
  };

  // Prepare rows with actions
  const rowsWithActions = useMemo(() => {
    return rows.map((row) => ({
      ...row,
      actions: null, // placeholder for the actions column
    }));
  }, [rows]);

  // Fetch data on mount and when search/filter/page changes
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers, searchText, statusFilter, page, pageSize]);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box color="error">{error}</Box>;

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" flex={1}>
            Customers
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Search"
              placeholder="Search by name, email, or phone"
              value={searchText}
              onChange={handleSearchChange}
              size="small"
              sx={{ width: 250 }}
            />
            <Select
              label="Status"
              value={statusFilter}
              onChange={handleStatusChange}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
            <Select
              label="Rows per page"
              value={pageSize}
              onChange={handlePageSizeChange}
              size="small"
              sx={{ minWidth: 100 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
            <Button variant="contained" size="small" onClick={() => router.push('/dashboard/customers/create')}>
              Add Customer
            </Button>
          </Stack>
        </Toolbar>
        <Box sx={{ mt: 2 }}>
          <DataGrid
            rows={rowsWithActions}
            columns={columns}
            page={page}
            pageSize={pageSize}
            checkboxSelection
            disableSelectionOnClick
            loading={loading}
            getRowId={(row) => row.id?.toString() || ''}
            components={{
              Toolbar: GridToolbar,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: false,
              },
            }}
          >
          </DataGrid>
        </Box>
      </Container>
    </Box>
  );
}
