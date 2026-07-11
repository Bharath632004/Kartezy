import { Box, Typography, Container, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const {
    revenueTrend,
    ordersTrend,
    customerGrowth,
    merchantGrowth,
    categorySales,
    productSales,
    heatMapData,
  } = useAnalyticsStore();

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
            {Array.from({ length: 7 }).map((_, i) => (
              <Box key={i} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Chart Placeholder
                </Typography>
                <Skeleton variant="rectangle" width={300} height={200} sx={{ display: 'block', margin: '0 auto' }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Analytics Overview
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {[{
            title: 'Revenue Trend',
            data: revenueTrend,
            color: '#8884d8',
            xKey: 'date',
          }, {
            title: 'Orders Trend',
            data: ordersTrend,
            color: '#82ca9d',
            xKey: 'date',
          }, {
            title: 'Customer Growth',
            data: customerGrowth,
            color: '#ffc658',
            xKey: 'date',
          }, {
            title: 'Merchant Growth',
            data: merchantGrowth,
            color: '#ff8042',
            xKey: 'date',
          }, {
            title: 'Category Sales',
            data: categorySales,
            color: '#9013fe',
            xKey: 'name',
          }, {
            title: 'Product Sales',
            data: productSales,
            color: '#00b8d9',
            xKey: 'name',
          }].map((chart, idx) => (
            <Box key={idx} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
              <Typography variant="h5" gutterBottom>
                {chart.title}
              </Typography>
              {chart.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chart.data}>
                    <XAxis dataKey={chart.xKey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={chart.color} activeDot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="text.secondary">
                  Loading {chart.title.toLowerCase()} data...
                </Typography>
              )}
            </Box>
          ))}
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
                        {Array.from({ length: 24 }, (_, i) => (
                          <TableCell key={i} align="center">
                            {i}:00
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, _) => (
                        <TableRow key={day}>
                          <TableCell>{day}</TableCell>
                          {Array.from({ length: 24 }, (_, hourIndex) => {
                            const entry = heatMapData.find(d => d.day === day && d.hour === `${hourIndex}:00`);
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