"use client";

import { Box, Card, CardContent, Typography, Container, Grid } from '@mui/material';
import { useState } from 'react';

export default function OperationsOverview() {
  const [fleetMetrics] = useState({ totalDrivers: 0, availableDrivers: 0, onTripDrivers: 0, offlineDrivers: 0 });

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Operations Overview</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
