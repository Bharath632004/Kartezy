import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { customerService } from '@/lib/api';

export default function CustomerDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const {
    data: customer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getDetail(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading customer</div>;

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
            <Typography>${parseFloat(customer.walletBalance || 0).toFixed(2)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Total Orders
            </Typography>
            <Typography>{customer.totalOrders}</Typography>
          </Box>
        </Box>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Wallet
        </Typography>
        <Box>
          <Typography variant="body2">
            Balance: ${parseFloat(customer.wallet?.balance || 0).toFixed(2)}
          </Typography>
          <Typography variant="body2">
            Currency: {customer.wallet?.currency}
          </Typography>
        </Box>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Recent Orders
        </Typography>
        {/* We would fetch orders here, but for simplicity we skip */}
        <Typography>Recent orders would be listed here.</Typography>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Addresses
        </Typography>
        {/* Addresses list */}
        <Typography>Addresses would be listed here.</Typography>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Login History
        </Typography>
        {/* Login history list */}
        <Typography>Login history would be listed here.</Typography>
      </Stack>
    </Container>
  );
}
