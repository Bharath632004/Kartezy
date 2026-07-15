"use client";

import { Box, Typography, Container, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await useAnalyticsStore.getState().fetchAll('month');
      } catch (error) {
        console.error('Failed to fetch analytics data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h3" gutterBottom>
            Analytics Overview
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {/* Skeletons for each chart */}
            {Array.from({ length: 7 }).map((_, index) => (
              <Box key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Chart Placeholder
                </Typography>
                <Skeleton variant="rectangular" width={300} height={200} sx={{ display: 'block', margin: '0 auto' }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    );
  }

  const {
    revenueTrend,
    ordersTrend,
    customerGrowth,
    merchantGrowth,
    categorySales,
    productSales,
    heatMapData,
  } = useAnalyticsStore();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Analytics Overview
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {/* Revenue Trend Chart */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Revenue Trend
            </Typography>
            {revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">
                Loading revenue trend data...
              </Typography>
            )}
          </Box>
          {/* Orders Trend Chart */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Orders Trend
            </Typography>
            {ordersTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ordersTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">
                Loading orders trend data...
              </Typography>
            )}
          </Box>
          {/* Customer Growth Chart */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Customer Growth
            </Typography>
            {customerGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={customerGrowth}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ffc658" activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">
                Loading customer growth data...
              </Typography>
            )}
          </Box>
          {/* Merchant Growth Chart */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Merchant Growth
            </Typography>
            {merchantGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={merchantGrowth}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ff8042" activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">
                Loading merchant growth data...
              </Typography>
            )}
          </Box>
          {/* Category Sales Chart */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Category Sales
            </Typography>
            {categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={categorySales}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#9013fe" activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">
                Loading category sales data...
              </Typography>
            )}
          </Box>
          {/* Product Sales Chart */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Product Sales
            </Typography>
            {productSales.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={productSales}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#00b8d9" activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">
                Loading product sales data...
              </Typography>
            )}
          </Box>
          {/* Heat Map Table */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Heat Map (Orders by Day/Hour)
            </Typography>
            {heatMapData.length > 0 ? (
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Day/Hour</TableCell>
                        {/* Generate hour headers (0-23) */}
                        {Array.from({ length: 24 }, (_, i) => (
                          <TableCell key={i} align="center">
                            {i}:00
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Days of the week */}
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, dayIndex) => (
                        <TableRow key={day}>
                          <TableCell>{day}</TableCell>
                          {/* Hours for this day */}
                          {Array.from({ length: 24 }, (_, hourIndex) => {
                            // Find the value for this day and hour
                            const entry = heatMapData.find(
                              d => d.day === day && d.hour === `${hourIndex}:00`
                            );
                            return (
                              <TableCell key={hourIndex} align="center">
                                {entry ? entry.value : '-'}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ) : (
              <Typography color="text.secondary">
                Loading heat map data...
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}