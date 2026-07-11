"use client";

import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from '@mui/material';
import { operationsService } from '@/lib/api';

const OperationsDashboard = () => {
  const {
    data: liveOrders,
    isLoading: liveOrdersLoading,
    error: liveOrdersError,
  } = useQuery({
    queryKey: ['live-orders'],
    queryFn: () => operationsService.getLiveOrders(),
  });

  const {
    data: storeMetrics,
    isLoading: storeMetricsLoading,
    error: storeMetricsError,
  } = useQuery({
    queryKey: ['store-metrics'],
    queryFn: () => operationsService.getStoreMonitoring(),
  });

  const {
    data: fleetMetrics,
    isLoading: fleetMetricsLoading,
    error: fleetMetricsError,
  } = useQuery({
    queryKey: ['fleet-metrics'],
    queryFn: () => operationsService.getFleetMonitoring(),
  });

  const {
    data: inventoryAlerts,
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: () => operationsService.getInventoryAlerts(),
  });

  const {
    data: fraudAlerts,
    isLoading: fraudLoading,
    error: fraudError,
  } = useQuery({
    queryKey: ['fraud-alerts'],
    queryFn: () => operationsService.getFraudAlerts(),
  });

  const {
    data: escalations,
    isLoading: escalationsLoading,
    error: escalationsError,
  } = useQuery({
    queryKey: ['escalations'],
    queryFn: () => operationsService.getEscalations(),
  });

  const isLoading =
    liveOrdersLoading ||
    storeMetricsLoading ||
    fleetMetricsLoading ||
    inventoryLoading ||
    fraudLoading ||
    escalationsLoading;
  const hasError =
    liveOrdersError ||
    storeMetricsError ||
    fleetMetricsError ||
    inventoryError ||
    fraudError ||
    escalationsError;

  if (hasError) {
    return (
      <Box sx={{ py: 3, color: 'error' }}>
        <Typography variant="h4" gutterBottom>
          Operations Dashboard
        </Typography>
        <Typography>Error loading dashboard data</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Operations Dashboard
        </Typography>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Operations Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Live Orders */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Live Orders</Typography>
              <TableContainer component={Paper} sx={{ height: 250, overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order #</TableCell>
                      <TableCell align="right">Customer</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {liveOrders?.length > 0 ? (
                      liveOrders.slice(0, 5).map((order: any) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell align="right">{order.customerName}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={order.status}
                              size="small"
                              color={order.status === 'delivered' ? 'success' :
                                     order.status === 'processing' ? 'warning' :
                                     order.status === 'pending' ? 'info' : 'default'}
                            />
                          </TableCell>
                          <TableCell align="right">${parseFloat(order.totalAmount || 0).toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No live orders
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Store Monitoring */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Store Monitoring</Typography>
              {storeMetrics ? (
                <>
                  <p>Total Stores: {storeMetrics.totalStores}</p>
                  <p>Open: {storeMetrics.openStores}</p>
                  <p>Closed: {storeMetrics.closedStores}</p>
                  <p>Under Maintenance: {storeMetrics.maintenanceStores}</p>
                </>
              ) : (
                <p>No data available</p>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Fleet Monitoring */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Fleet Monitoring</Typography>
              {fleetMetrics ? (
                <>
                  <p>Total Drivers: {fleetMetrics.totalDrivers}</p>
                  <p>Available: {fleetMetrics.availableDrivers}</p>
                  <p>On Trip: {fleetMetrics.onTripDrivers}</p>
                  <p>Offline: {fleetMetrics.offlineDrivers}</p>
                </>
              ) : (
                <p>No data available</p>
              ))
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Alerts */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Inventory Alerts</Typography>
              <TableContainer component={Paper} sx={{ height: 200, overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Alert Type</TableCell>
                      <TableCell>Message</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryAlerts?.length > 0 ? (
                      inventoryAlerts.map((alert: any) => (
                        <TableRow key={alert.id}>
                          <TableCell>{alert.productName}</TableCell>
                          <TableCell>
                            <Chip
                              label={alert.alertType}
                              size="small"
                              color={alert.alertType === 'Out of Stock' ? 'error' :
                                     alert.alertType === 'Low Stock' ? 'warning' : 'info'}
                            />
                          </TableCell>
                          <TableCell>{alert.message}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No alerts
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Fraud Alerts */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Fraud Alerts</Typography>
              <TableContainer component={Paper} sx={{ height: 200, overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order #</TableCell>
                      <TableCell>Fraud Type</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fraudAlerts?.length > 0 ? (
                      fraudAlerts.map((alert: any) => (
                        <TableRow key={alert.id}>
                          <TableCell>#{alert.orderId}</TableCell>
                          <TableCell>
                            <Chip
                              label={alert.fraudType}
                              size="small"
                              color="error"
                            />
                          </TableCell>
                          <TableCell>{alert.description}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No alerts
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Escalations */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Escalations</Typography>
              <TableContainer component={Paper} sx={{ height: 200, overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Priority</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {escalations?.length > 0 ? (
                      escalations.map((esc: any) => (
                        <TableRow key={esc.id}>
                          <TableCell>{esc.type}</TableCell>
                          <TableCell>{esc.description}</TableCell>
                          <TableCell>
                            <Chip
                              label={esc.priority}
                              size="small"
                              color={esc.priority === 'High' ? 'error' :
                                     esc.priority === 'Medium' ? 'warning' : 'info'}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No escalations
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OperationsDashboard;