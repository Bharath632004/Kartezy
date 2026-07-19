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
} from '@mui/material';
import { merchantService } from '@/lib/api';

export default function MerchantDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const {
    data: merchant,
    isLoading: merchantLoading,
    error: merchantError,
  } = useQuery({
    queryKey: ['merchant', id],
    queryFn: () => merchantService.getDetail(id),
  });

  const {
    data: kycData,
    isLoading: kycLoading,
    error: kycError,
  } = useQuery({
    queryKey: ['kyc', id],
    queryFn: () => merchantService.getKYC(id),
    enabled: !!id,
  });

  const {
    data: documents,
    isLoading: documentsLoading,
    error: documentsError,
  } = useQuery({
    queryKey: ['documents', id],
    queryFn: () => merchantService.getDocuments(id),
    enabled: !!id,
  });

  const {
    data: storeDetails,
    isLoading: storeLoading,
    error: storeError,
  } = useQuery({
    queryKey: ['store', id],
    queryFn: () => merchantService.getStoreDetails(id),
    enabled: !!id,
  });

  const {
    data: ratings,
    isLoading: ratingsLoading,
    error: ratingsError,
  } = useQuery({
    queryKey: ['ratings', id],
    queryFn: () => merchantService.getRatings(id),
    enabled: !!id,
  });

  const {
    data: revenue,
    isLoading: revenueLoading,
    error: revenueError,
  } = useQuery({
    queryKey: ['revenue', id],
    queryFn: () => merchantService.getRevenue(id),
    enabled: !!id,
  });

  const {
    data: commission,
    isLoading: commissionLoading,
    error: commissionError,
  } = useQuery({
    queryKey: ['commission', id],
    queryFn: () => merchantService.getCommission(id),
    enabled: !!id,
  });

  if (
    merchantLoading ||
    kycLoading ||
    documentsLoading ||
    storeLoading ||
    ratingsLoading ||
    revenueLoading ||
    commissionLoading
  ) {
    return <div>Loading...</div>;
  }

  if (
    merchantError ||
    kycError ||
    documentsError ||
    storeError ||
    ratingsError ||
    revenueError ||
    commissionError
  ) {
    return <div>Error loading merchant data</div>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Merchant Details
      </Typography>
      <Divider />
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6">
            {merchant.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {merchant.email}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Phone
            </Typography>
            <Typography>{merchant.phoneNumber}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Status
            </Typography>
            <Typography>
              {merchant.status}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Rating
            </Typography>
            <Typography>
              {merchant.rating?.toFixed(1)} ⭐
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Revenue
            </Typography>
            <Typography>
              ${parseFloat(merchant.revenue || 0).toFixed(2)}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Tabs value={0} aria-label="merchant details tabs">
          <Tab label="Details" />
          <Tab label="KYC" />
          <Tab label="Documents" />
          <Tab label="Store" />
          <Tab label="Ratings" />
          <Tab label="Revenue" />
          <Tab label="Commission" />
        </Tabs>
        <TabPanelContent value={0} index={0}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Merchant Information
            </Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{merchant.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{merchant.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>{merchant.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Phone</TableCell>
                  <TableCell>{merchant.phoneNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>{merchant.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Created At</TableCell>
                  <TableCell>
                    {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </TabPanelContent>
        <TabPanelContent value={1} index={1}>
          <Box>
            <Typography variant="h5" gutterBottom>
              KYC Status
            </Typography>
            {kycData ? (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>{kycData.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Submitted At</TableCell>
                    <TableCell>
                      {kycData.submittedAt ? new Date(kycData.submittedAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Verified At</TableCell>
                    <TableCell>
                      {kycData.verifiedAt ? new Date(kycData.verifiedAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                  {kycData.notes && (
                    <>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="body2" fontWeight="medium">
                            Notes
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography>{kycData.notes}</Typography>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Typography>No KYC data available</Typography>
            )}
          </Box>
        </TabPanelContent>
        <TabPanelContent value={2} index={2}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Documents
            </Typography>
            {documents?.length ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Uploaded At</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents.map((doc: any) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>
                          {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>{doc.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No documents found</Typography>
            )}
          </Box>
        </TabPanelContent>
        <TabPanelContent value={3} index={3}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Store Details
            </Typography>
            {storeDetails ? (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Store Name</TableCell>
                    <TableCell>{storeDetails.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>
                      {storeDetails.address.line1}, {storeDetails.address.line2}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>City</TableCell>
                    <TableCell>{storeDetails.address.city}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>State</TableCell>
                    <TableCell>{storeDetails.address.state}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Zip Code</TableCell>
                    <TableCell>{storeDetails.address.zipCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Phone</TableCell>
                    <TableCell>{storeDetails.phone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{storeDetails.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Website</TableCell>
                    <TableCell>{storeDetails.website}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Opening Hours</TableCell>
                    <TableCell>{storeDetails.openingHours}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <Typography>No store details available</Typography>
            )}
          </Box>
        </TabPanelContent>
        <TabPanelContent value={4} index={4}>
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
        </TabPanelContent>
        <TabPanelContent value={5} index={5}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Revenue
            </Typography>
            {revenue ? (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Revenue</TableCell>
                    <TableCell align="right">
                      ${parseFloat(revenue.total || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Monthly Revenue</TableCell>
                    <TableCell align="right">
                      ${parseFloat(revenue.monthly || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Yearly Revenue</TableCell>
                    <TableCell align="right">
                      ${parseFloat(revenue.yearly || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {revenue.breakdown && (
                    <>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="body2" fontWeight="medium">
                            Revenue Breakdown
                          </Typography>
                        </TableCell>
                      </TableRow>
                      {revenue.breakdown.map((item: any) => (
                        <TableRow key={item.type}>
                          <TableCell>{item.type}</TableCell>
                          <TableCell align="right">
                            ${parseFloat(item.amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Typography>No revenue data available</Typography>
            )}
          </Box>
        </TabPanelContent>
        <TabPanelContent value={6} index={6}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Commission
            </Typography>
            {commission ? (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Commission</TableCell>
                    <TableCell align="right">
                      ${parseFloat(commission.total || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Commission Rate</TableCell>
                    <TableCell align="right">
                      {commission.rade}% // Note: assuming the field is 'rate'
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Last Calculated</TableCell>
                    <TableCell>
                      {commission.lastCalculated ? new Date(commission.lastCalculated).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <Typography>No commission data available</Typography>
            )}
          </Box>
        </TabPanelContent>
      </Stack>
    </Container>
  );
}

function TabPanelContent(props: {
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