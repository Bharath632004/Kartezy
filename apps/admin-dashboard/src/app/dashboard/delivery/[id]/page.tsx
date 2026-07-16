"use client";

import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { deliveryService } from '@/lib/api';

export default function DriverDetails({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: driver, isLoading, error } = useQuery({
    queryKey: ['driver', id],
    queryFn: () => deliveryService.getDetail(id),
    select: (response: any) => response.data,
  });

  const { data: vehicle } = useQuery({
    queryKey: ['driver-vehicle', id],
    queryFn: () => deliveryService.getVehicleDetails(id),
    enabled: !!id,
    select: (response: any) => response.data,
  });

  const { data: kycInfo } = useQuery({
    queryKey: ['driver-kyc', id],
    queryFn: () => deliveryService.getKYC(id),
    enabled: !!id,
    select: (response: any) => response.data,
  });

  const { data: earnings } = useQuery({
    queryKey: ['driver-earnings', id],
    queryFn: () => deliveryService.getEarnings(id),
    enabled: !!id,
    select: (response: any) => response.data,
  });

  const { data: performance } = useQuery({
    queryKey: ['driver-performance', id],
    queryFn: () => deliveryService.getPerformance(id),
    enabled: !!id,
    select: (response: any) => response.data,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading driver data</div>;

  if (!driver) {
    return <div>No driver data available</div>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Driver Details</Typography>
      <Divider />
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6">{driver.firstName} {driver.lastName}</Typography>
          <Typography variant="body2" color="text.secondary">{driver.email}</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Phone</Typography>
            <Typography>{driver.phoneNumber}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Status</Typography>
            <Chip label={driver.status} size="small" color={driver.status === 'ACTIVE' ? 'success' : 'error'} />
          </Box>
        </Box>
        <Divider />
        {vehicle && (
          <Box>
            <Typography variant="h5" gutterBottom>Vehicle Details</Typography>
            <Paper>
              <Table>
                <TableBody>
                  <TableRow><TableCell>Model</TableCell><TableCell>{vehicle.model}</TableCell></TableRow>
                  <TableRow><TableCell>Plate</TableCell><TableCell>{vehicle.plateNumber}</TableCell></TableRow>
                  <TableRow><TableCell>Type</TableCell><TableCell>{vehicle.type}</TableCell></TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
