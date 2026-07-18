import { Box, Container, Typography, Card, CardContent, Toolbar, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

export default function RevenueReport() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Revenue Report
        </Typography>
        <Toolbar>
          <span>Date Range: </span>
          <select>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button>Export</button>
        </Toolbar>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Trend
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="text.secondary">Real-time chart data will render here from API</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue by Category
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="text.secondary">Real-time pie chart will render here from API</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-01-15</TableCell>
                    <TableCell align="right">$125.00</TableCell>
                    <TableCell align="right">Completed</TableCell>
                    <TableCell align="right">Credit Card</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-14</TableCell>
                    <TableCell align="right">$89.50</TableCell>
                    <TableCell align="right">Pending</TableCell>
                    <TableCell align="right">PayPal</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}