import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  Table,
 0,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  CircularProgress,
  Tabs,
  Tab,
  TabPanel,
} from '@mui/material';
import { userService } from '@/lib/api';

export default function CustomerDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const {
    data: customer,
    isLoading: customerLoading,
    error: customerError,
  } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => userService.getDetail(id),
  });

  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
  } = useQuery({
    queryKey: ['wallet', id],
    queryFn: () => userService.getWallet(id),
    enabled: !!id,
  });

  const {
    data: walletTransactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ['wallet-transactions', id],
    queryFn: () => userService.getWalletTransactions(id),
    enabled: !!id,
  });

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ['customer-orders', id],
    queryFn: () => userService.getOrders(id),
    enabled: !!id,
  });

  const {
    data: loginHistory,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ['login-history', id],
    queryFn: () => userService.getLoginHistory(id),
    enabled: !!id,
  });

  const {
    data: addresses,
    isLoading: addressesLoading,
    error: addressesError,
  } = useQuery({
    queryKey: ['customer-addresses', id],
    queryFn: () => userService.getAddresses(id),
    enabled: !!id,
  });

  if (customerLoading || walletLoading || transactionsLoading || ordersLoading || historyLoading || addressesLoading) {
    return <div>Loading...</div>;
  }

  if (customerError || walletError || transactionsError || ordersError || historyError || addressesError) {
    return <div>Error loading customer data</div>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Customer Details
      </Typography>
      <Divider />
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6">
            {customer.firstName} {customer.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {customer.email}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Phone
            </Typography>
            <Typography>{customer.phoneNumber}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Status
            </Typography>
            <Typography>
              {customer.isBlocked ? 'Blocked' : 'Active'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Wallet Balance
            </Typography>
            <Typography>
              ${parseFloat(customer.walletBalance || 0).toFixed(2)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Total Orders
            </Typography>
            <Typography>{customer.totalOrders}</Typography>
          </Box>
        </Box>
        <Divider />
        <Tabs value={0} aria-label="customer details tabs">
          <Tab label="Wallet" />
          <Tab label="Orders" />
          <Tab label="Addresses" />
          <Tab label="Login History" />
        </Tabs>
        <TabPanel value={0} index={0}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Wallet Balance
            </Typography>
            <Typography variant="h4">
              ${parseFloat(walletData?.balance || 0).toFixed(2)} {walletData?.currency || 'USD'}
            </Typography>
          </Box>
          <Box mt={3}>
            <Typography variant="h5" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {walletTransactions?.map((tx: any) => (
                    <TableRow key={tx.id}>
                      <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell align="right">
                        {tx.type === 'credit' ? `+${tx.amount}` : `-${tx.amount}`}
                      </TableCell>
                      <TableCell align="right">
                        <span
                          sx={{
                            color: tx.type === 'credit' ? 'success.main' : 'error.main',
                          }}
                        >
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
        <TabPanel value={1} index={1}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Recent Orders
            </Typography>
            {orders?.length ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          ${parseFloat(order.totalAmount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span
                            sx={{
                              textTransform: 'capitalize',
                            }}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No orders found</Typography>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={2} index={2}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Addresses
            </Typography>
            {addresses?.length ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>Zip Code</TableCell>
                      <TableCell>Default</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {addresses.map((addr: any) => (
                      <TableRow key={addr.id}>
                        <TableCell>{addr.type}</TableCell>
                        <TableCell>{addr.line1}, {addr.line2}</TableCell>
                        <TableCell>{addr.city}</TableCell>
                        <TableCell>{addr.state}</TableCell>
                        <TableCell>{addr.zipCode}</TableCell>
                        <TableCell align="center">
                          {addr.isDefault ? (
                            <span sx={{ color: 'success.main' }}>Yes</span>
                          ) : (
                            <span sx={{ color: 'error.main' }}>No</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No addresses found</Typography>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={3} index={3}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Login History
            </Typography>
            {loginHistory?.length ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Device</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loginHistory.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(loginTimestamp).toLocaleString()}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell>{log.device}</TableCell>
                        <TableCell>{log.location}</TableCell>
                        <TableCell>
                          <span
                            sx={{
                              textTransform: 'capitalize',
                            }}
                          >
                            {log.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No login history found</Typography>
            )}
          </Box>
        </TabPanel>
      </Stack>
    </Container>
  );
}

function TabPanel(props: {
  value: number;
  index: number;
  children: React.ReactNode;
}) {
  const { value, index, children } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`panel-${id}-${index}`}
      aria-labelledby={`tab-${id}-${index}`}
    >
      {value === index && (
        <Box p={3}>{children}</Box>
      )}
    </div>
  );
}
