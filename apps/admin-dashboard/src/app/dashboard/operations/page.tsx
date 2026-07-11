"use client";

import { Box, Card, CardContent, Chip, Container, Grid, Typography, CircularProgress } from '@mui/material';

const OperationsDashboard = () => {
  // Mock data for demonstration
  const mockData = {
    loadOrders: [],
    storeMetrics: { totalStores: 10, openStores: 8, closedStores: 1, maintenanceStores: 1 },
    fleetMetrics: { totalDrivers: 50, availableDrivers: 30, onTripDrivers: 15, offlineDrivers: 5 },
    inventoryAlerts: [
      { id: 1, productName: 'Product A', alertType: 'Low Stock', message: 'Only 5 left' },
      { id: 2, productName: 'Product B', alertType: 'Out of Stock', message: 'Out of stock' },
    ],
    fraudAlerts: [
      { id: 1, orderId: '1001', fraudType: 'Stolen Card', description: 'Attempted transaction with stolen card' },
    ],
    escalations: [
      { id: 1, type: 'Delivery Issue', description: 'Late delivery', priority: 'High' },
    ],
  };

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
              <div style={{ height: 200, overflowY: 'auto' }}>
                {mockData.loadOrders.length > 0 ? (
                  <ul>
                    {mockData.loadOrders.slice(0, 5).map((order: any) => (
                      <li key={order.id}>
                        Order #{order.id} - {order.customerName} - ${order.total}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No live orders</p>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Store Monitoring */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Store Monitoring</Typography>
              {mockData.storeMetrics.totalStores !== undefined ? (
                <>
                  <p>Total Stores: {mockData.storeMetrics.totalStores}</p>
                  <p>Open: {mockData.storeMetrics.openStores}</p>
                  <p>Closed: {mockData.storeMetrics.closedStores}</p>
                  <p>Under Maintenance: {mockData.storeMetrics.maintenanceStores}</p>
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
              {mockData.fleetMetrics.totalDrivers !== undefined ? (
                <>
                  <p>Total Drivers: {mockData.fleetMetrics.totalDrivers}</p>
                  <p>Available: {mockData.fleetMetrics.availableDrivers}</p>
                  <p>On Trip: {mockData.fleetMetrics.onTripDrivers}</p>
                  <p>Offline: {mockData.fleetMetrics.offlineDrivers}</p>
                </>
              ) : (
                <p>No data available</p>
              )
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Alerts */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Inventory Alerts</Typography>
              <div style={{ height: 150, overflowY: 'auto' }}>
                {mockData.inventoryAlerts.length > 0 ? (
                  <ul>
                    {mockData.inventoryAlerts.map((alert: any) => (
                      <li key={alert.id}>
                        <strong>{alert.productName}</strong> - {alert.alertType}: {alert.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No alerts</p>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Fraud Alerts */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Fraud Alerts</Typography>
              <div style={{ height: 150, overflowY: 'auto' }}>
                {mockData.fraudAlerts.length > 0 ? (
                  <ul>
                    {mockData.fraudAlerts.map((alert: any) => (
                      <li key={alert.id}>
                        Order #{alert.orderId} - {alert.fraudType}: {alert.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No alerts</p>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Escalations */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Escalations</Typography>
              <div style={{ height: 150, overflowY: 'auto' }}>
                {mockData.escalations.length > 0 ? (
                  <ul>
                    {mockData.escalations.map((esc: any) => (
                      <li key={esc.id}>
                        <strong>{esc.type}</strong>: {esc.description} ({esc.priority})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No escalations</p>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OperationsDashboard;
