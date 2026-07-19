"use client";

import { Box, Grid, Card, CardContent, Typography, Paper, Chip, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Add, Visibility, Edit } from '@mui/icons-material';

const cities = [
  { name: 'Mumbai', zone: 'West', warehouses: 6, merchants: 1240, deliveries: 45200, status: 'active', growth: '+12.5%' },
  { name: 'Delhi', zone: 'North', warehouses: 8, merchants: 1580, deliveries: 52100, status: 'active', growth: '+15.2%' },
  { name: 'Bangalore', zone: 'South', warehouses: 5, merchants: 980, deliveries: 38400, status: 'active', growth: '+18.7%' },
  { name: 'Chennai', zone: 'South', warehouses: 4, merchants: 720, deliveries: 28500, status: 'active', growth: '+8.3%' },
  { name: 'Kolkata', zone: 'East', warehouses: 3, merchants: 560, deliveries: 19800, status: 'active', growth: '+6.1%' },
  { name: 'Hyderabad', zone: 'South', warehouses: 4, merchants: 890, deliveries: 31200, status: 'active', growth: '+22.4%' },
  { name: 'Pune', zone: 'West', warehouses: 3, merchants: 650, deliveries: 22400, status: 'active', growth: '+14.8%' },
  { name: 'Ahmedabad', zone: 'West', warehouses: 2, merchants: 480, deliveries: 16200, status: 'active', growth: '+9.2%' },
  { name: 'Jaipur', zone: 'North', warehouses: 2, merchants: 320, deliveries: 11800, status: 'active', growth: '+11.5%' },
  { name: 'Lucknow', zone: 'North', warehouses: 2, merchants: 290, deliveries: 10200, status: 'active', growth: '+7.8%' },
  { name: 'Chandigarh', zone: 'North', warehouses: 1, merchants: 180, deliveries: 6800, status: 'active', growth: '+16.3%' },
  { name: 'Bhopal', zone: 'Central', warehouses: 1, merchants: 160, deliveries: 5400, status: 'active', growth: '+5.9%' },
];

const zoneData = [
  { zone: 'North', cities: 4, merchants: 2420, deliveries: 80900, coverage: 95 },
  { zone: 'South', cities: 3, merchants: 2590, deliveries: 98100, coverage: 92 },
  { zone: 'West', cities: 3, merchants: 2370, deliveries: 83800, coverage: 90 },
  { zone: 'East', cities: 1, merchants: 560, deliveries: 19800, coverage: 75 },
  { zone: 'Central', cities: 1, merchants: 160, deliveries: 5400, coverage: 60 },
];

export default function CitiesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>City Operations</Typography>
          <Typography variant="body2" color="text.secondary">Manage cities, zones, and regional operations</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>Add City</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Cities</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>12</Typography>
              <Typography variant="caption" color="success.main">+2 this quarter</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Active Zones</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#388e3c' }}>5</Typography>
              <Typography variant="caption" color="success.main">All operational</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Merchants</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00' }}>8,050</Typography>
              <Typography variant="caption" color="success.main">Across all cities</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Monthly Deliveries</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#7b1fa2' }}>278K</Typography>
              <Typography variant="caption" color="success.main">+12.4% growth</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Zone Coverage</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Zone</TableCell>
                    <TableCell align="right">Cities</TableCell>
                    <TableCell align="right">Merchants</TableCell>
                    <TableCell align="right">Coverage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {zoneData.map((z) => (
                    <TableRow key={z.zone}>
                      <TableCell><Typography sx={{ fontWeight: 600 }}>{z.zone}</Typography></TableCell>
                      <TableCell align="right">{z.cities}</TableCell>
                      <TableCell align="right">{z.merchants.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Chip label={`${z.coverage}%`} size="small" color={z.coverage >= 90 ? 'success' : z.coverage >= 75 ? 'warning' : 'error'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>City Directory</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>City</TableCell>
                    <TableCell>Zone</TableCell>
                    <TableCell align="right">Warehouses</TableCell>
                    <TableCell align="right">Merchants</TableCell>
                    <TableCell align="right">Deliveries</TableCell>
                    <TableCell align="right">Growth</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cities.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell><Typography sx={{ fontWeight: 600 }}>{c.name}</Typography></TableCell>
                      <TableCell><Chip label={c.zone} size="small" variant="outlined" /></TableCell>
                      <TableCell align="right">{c.warehouses}</TableCell>
                      <TableCell align="right">{c.merchants.toLocaleString()}</TableCell>
                      <TableCell align="right">{c.deliveries.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>{c.growth}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small"><Visibility fontSize="small" /></IconButton>
                        <IconButton size="small"><Edit fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
