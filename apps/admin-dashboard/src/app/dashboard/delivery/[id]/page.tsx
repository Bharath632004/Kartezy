import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Tabs,
  Tab,
  TabPanel,
  Chip,
  Button,
  Tooltip,
  IconButton,
} from '@mui/material';
import { StarBorder } from '@mui/icons-material';
import { deliveryService } from '@/lib/api';

export default function DriverDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const {
    data: driver,
    isLoading: driverLoading,
    error: driverError,
  } = useQuery({
    queryKey: ['driver', id],
    queryFn: () => deliveryService.getDetail(id),
  });

  const {
    data: vehicleDetails,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useQuery({
    queryKey: ['driver-vehicle', id],
    queryFn: () => deliveryService.getVehicleDetails(id),
    enabled: !!id,
  });

  const {
    data: kycInfo,
    isLoading: kycLoading,
    error: kycError,
  } = useQuery({
    queryKey: ['driver-kyc', id],
    queryFn: () => deliveryService.getKYC(id),
    enabled: !!id,
  });

  const {
    data: ratings,
    isLoading: ratingsLoading,
    error: ratingsError,
  } = useQuery({
    queryKey: ['driver-ratings', id],
    queryFn: () => deliveryService.getRatings(id),
    enabled: !!id,
  });

  const {
    data: earnings,
    isLoading: earningsLoading,
    error: earningsError,
  } = useQuery({
    queryKey: ['driver-earnings', id],
    queryFn: () => deliveryService.getEarnings(id),
    enabled: !!id,
  });

  const {
    data: performance,
    isLoading: performanceLoading,
    error: performanceError,
  } = useQuery({
    queryKey: ['driver-performance', id],
    queryFn: () => deliveryService.getPerformance(id),
    enabled: !!id,
  });

  const {
    data: liveLocation,
    isLoading: locationLoading,
    error: locationError,
  } = useQuery({
    queryKey: ['driver-location', id],
    queryFn: () => deliveryService.getLiveLocation(id),
    enabled: !!id,
  });

  if (
    driverLoading ||
    vehicleLoading ||
    kycLoading ||
    ratingsLoading ||
    earningsLoading ||
    performanceLoading ||
    locationLoading
  ) {
    return <div>Loading...</div>;
  }

  if (
    driverError ||
    vehicleError ||
    kycError ||
    ratingsError ||
    earningsError ||
    performanceError ||
    locationError
  ) {
    return <div>Error loading driver data</div>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Driver Details
      </Typography>
      <Divider />
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6">
            {driver.firstName} {driver.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {driver.email}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Phone
            </Typography>
            <Typography>{driver.phoneNumber}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Status
            </Typography>
            <Typography>
              {driver.status}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Tabs value={0} aria-label="driver details tabs">
          <Tab label="Details" />
          <Tab label="Vehicle" />
          <Tab label="KYC" />
          <Tab label="Ratings" />
          <Tab label="Earnings" />
          <Tab label="Performance" />
          <Tab label="Location" />
        </Tabs>
        <TabPanel value={0} index={0}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Driver Information
            </Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{driver.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>{driver.firstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Name</TableCell>
                  <TableCell>{driver.lastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>{driver.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Phone</TableCell>
                  <TableCell>{driver.phoneNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>{driver.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Created At</TableCell>
                  <TableCell>
                    {driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </TabPanel>
        <TabPanel value={1} index={1}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Vehicle Details
            </Typography>
            {vehicleDetails ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Vehicle Type
                  </Typography>
                  <Typography>{vehicleDetails.vehicleType}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Make & Model
                  </Typography>
                  <Typography>{`${vehicleDetails.make} ${vehicleDetails.model}`}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Year
                  </Typography>
                  <Typography>{vehicleDetails.year}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    License Plate
                  </Typography>
                  <Typography>{vehicleDetails.licensePlate}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Color
                  </Typography>
                  <Typography>{vehicleDetails.color}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Capacity
                  </Typography>
                  <Typography>{vehicleDetails.capacity} persons</Typography>
                </Box>
              </Box>
            ) : (
              <Typography>Vehicle information not available</Typography>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={2} index={2}>
          <Box>
            <Typography variant="h5" gutterBottom>
              KYC & Verification
            </Typography>
            {kycInfo ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Status
                  </Toolbar>
                  <Typography>
                    <Chip
                      label={kycInfo.status}
                      size="small"
                      color={kycInfo.status === 'approved' ? 'success' :
                             kcInfo.status === 'pending' ? 'warning' :
                             kcInfo.status === 'rejected' ? 'error' : 'default'}
                    />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Document Type
                  </Typography>
                  <Typography>{kycInfo.documentType}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    ID Number
                  </Typography>
                  <Typography>{kycInfo.idNumber}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Expiry Date
                  </Typography>
                  <Typography>{kycInfo.expiryDate ? new Date(kycInfo.expiryDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Background Check
                  </Typography>
                  <Typography>{kycInfo.backgroundCheck ? 'Passed' : 'Pending'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Vehicle Inspection
                  </Typography>
                  <Typography>{kycInfo.vehicleInspection ? 'Passed' : 'Pending'}</Typography>
                </Box>
              </Box>
            ) : (
              <Typography>KYC information not available</Typography>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={3} index={3}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Ratings
            </Typography>
            {ratings?.length ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ratings.map((rating: any) => (
                      <TableRow key={rating.id}>
                        <TableCell>{rating.customerName}</TableCell>
                        <TableCell align="right">
                          {rating.rating} ⭐
                        </TableCell>
                        <TableCell>{rating.comment}</TableCell>
                        <TableCell>
                          {rating.createdAt ? new Date(rating.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No ratings available</Typography>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={4} index={4}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Earnings
            </Typography>
            {earnings ? (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Earnings</TableCell>
                    <TableCell align="right">
                      ${parseFloat(earnings.total || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Weekly Earnings</TableCell>
                    <TableCell align="right">
                      ${parseFloat(earnings.weekly || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Monthly Earnings</TableCell>
                    <TableCell align="right">
                      ${parseFloat(earnings.monthly || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <Typography>No earnings data available</Typography>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={5} index={5}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Performance
            </Typography>
            {performance ? (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Trips</TableCell>
                    <TableCell>{performance.totalTrips}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Completed Trips</TableCell>
                    <TableCell>{performance.completedTrips}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cancellation Rate</TableCell>
                    <TableCell align="right">
                      {(performance.cancellationRate || 0)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Acceptance Rate</TableCell>
                    <TableCell align="right">
                      {(performance.acceptanceRate || 0)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <Typography>No performance data available</Typography>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={6} index={6}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Live Location & Tracking
            </Typography>
            {liveLocation ? (
              <Box>
                <Typography variant="body2">
                  Current Location: {liveLocation.latitude}, {liveLocation.longitude}
                </Typography>
                <Typography variant="body2">
                  Last Updated: {liveLocation.timestamp ? new Date(liveLocation.timestamp).toLocaleTimeString() : 'Never'}
                </Typography>
                <Typography variant="body2">
                  Speed: {liveLocation.speed} km/h
                </Typography>
                <Typography variant="body2">
                  Heading: {liveLocation.heading}°
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    // In a real app, this would open a map or start live tracking
                    alert('Live tracking feature would be implemented here');
                  }
                >
                    // In a real app, this would open a map or start live tracking
                    alert('Live tracking feature would be implemented here');
                  }
                >
                  View Live Location on Map
                </Button>
              </Box>
            ) : (
              <Typography>Live location not available</Typography>
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