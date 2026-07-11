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