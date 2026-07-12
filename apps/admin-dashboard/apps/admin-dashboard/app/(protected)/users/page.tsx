import {
  Box,
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Tooltip,
  IconButton,
  EditIcon,
  DeleteIcon,
  RefreshIcon,
  AddIcon,
  SearchIcon,
  Chip,
  MenuItem,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { usersService } from '@/lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await usersService.getUsers({
          page,
          limit,
          search: searchTerm || undefined,
          role: selectedRole || undefined,
        });
        setUsers(response.data.content || response.data.users || []);
        setTotalPages(response.data.totalPages || Math.ceil((response.data.totalElements || response.data.total) / limit));
      } catch (err: any) {
        console.error('Failed to fetch users:', err);
        setError(err?.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit, searchTerm, selectedRole]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersService.deleteUser(id);
        // Remove deleted user from list
        setUsers(users.filter(user => user.id !== id));
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Users Management
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Users Management
        </Typography>
        <Alert severity="error" sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom mb={4}>
        Users Management
      </Typography>

      {/* Search and Filter Controls */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Search users"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            label="Role"
            select
            labelId="role-select"
            id="role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            SelectProps={{
              MenuProps: {
                className: 'demo-menuHeight',
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              },
            }}
          >
            <MenuItem value="">
              <em>All Roles</em>
            </MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="merchant">Merchant</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="delivery_partner">Delivery Partner</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setSearchTerm('');
              setSelectedRole('');
              setPage(1);
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            href="/users/new"
          >
            Add New User
          </Button>
        </Stack>
      </Box>

      {/* Users Table */}
      {users.length > 0 ? (
        <>
          <Card>
            <CardHeader title="User List" subtitle={`Showing ${users.length} of ${totalPages * limit || users.length} users`} />
            <CardContent>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left">Email</TableCell>
                      <TableCell align="center">Role</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Joined</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell component="th" scope="row">
                          {user.id}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {user.firstName} {user.lastName}
                          </Typography>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="center">
                          <Tooltip title={user.role}>
                            <Box sx={{ textTransform: 'capitalize' }}>{user.role}</Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Badge
                            badgeContent={user.isActive ? 'Active' : 'Inactive'}
                            color={user.isActive ? 'success' : 'error'}
                            overlap="rectangle"
                          >
                            <Chip
                              label={user.isActive ? 'Active' : 'Inactive'}
                              size="small"
                              color={user.isActive ? 'success' : 'error'}
                            />
                          </Badge>
                        </TableCell>
                        <TableCell align="center">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              href={`/users/${user.id}/edit`}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(user.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Page {page} of {totalPages}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))}
                <Button
                  variant="outlined"
                  size="small"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No users found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            mt={2}
            href="/users/new"
          >
            Add First User
          </Button>
        </Box>
      )}
    </Container>
  );
}