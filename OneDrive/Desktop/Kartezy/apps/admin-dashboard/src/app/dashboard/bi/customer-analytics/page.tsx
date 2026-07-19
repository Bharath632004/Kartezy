"use client";
import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useBiStore } from '@/store/biStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function CustomerAnalytics() {
  const { customerAnalytics, cohortData, funnelData, clvData, churnData, dateRange, fetchCustomerAnalytics, fetchCohortAnalysis, fetchFunnelAnalysis, fetchCLV, fetchChurnPrediction, loading, error } = useBiStore();
  useEffect(() => { fetchCustomerAnalytics(); fetchCohortAnalysis(); fetchFunnelAnalysis(); fetchCLV(); fetchChurnPrediction(); }, [dateRange]);

  if (loading && !customerAnalytics) return (<Container sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Container>);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Customer Analytics</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Customer Growth Trend</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={customerAnalytics?.growthTrend || []}>
                <XAxis dataKey="date" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="newRegistrations" stroke="#8884d8" name="New" />
                <Line type="monotone" dataKey="activeCustomers" stroke="#82ca9d" name="Active" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Customer Lifetime Value</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={clvData?.clvByCohort || []}>
                <XAxis dataKey="cohort" /><YAxis /><Tooltip />
                <Bar dataKey="clv" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Churn Prediction</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead><TableRow><TableCell>Segment</TableCell><TableCell align="right">Users</TableCell><TableCell align="right">Churn Rate</TableCell></TableRow></TableHead>
                <TableBody>{(churnData?.churnBySegment || []).map((s: any, i: number) => (
                  <TableRow key={i}><TableCell>{s.segment}</TableCell><TableCell align="right">{s.users}</TableCell><TableCell align="right">{s.churnRate}%</TableCell></TableRow>
                ))}</TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
              <Box textAlign="center"><Typography variant="h5" color="error">{churnData?.overallChurnRate || '—'}%</Typography><Typography variant="caption">Overall Churn Rate</Typography></Box>
              <Box textAlign="center"><Typography variant="h5" color="warning.main">{churnData?.predictedChurnNextMonth || '—'}</Typography><Typography variant="caption">At Risk (Next Month)</Typography></Box>
            </Box>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Customer Funnel</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={funnelData ? Object.values(funnelData) : []} layout="vertical">
                <XAxis type="number" /><YAxis type="category" dataKey="name" width={120} /><Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Cohort Retention Analysis</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead><TableRow>
                  <TableCell>Cohort</TableCell><TableCell>Size</TableCell>
                  {[0,1,2,3,4,5,6].map(p => (<TableCell key={p} align="right">Period {p}</TableCell>))}
                </TableRow></TableHead>
                <TableBody>{(cohortData || []).map((c: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell>{c.cohortDate}</TableCell><TableCell>{c.cohortSize}</TableCell>
                    {(c.retentionRates || []).slice(0,7).map((r: number, j: number) => (
                      <TableCell key={j} align="right" sx={{ color: r > 0.5 ? 'success.main' : r > 0.3 ? 'warning.main' : 'error.main' }}>{(r * 100).toFixed(1)}%</TableCell>
                    ))}
                  </TableRow>
                ))}</TableBody>
              </Table>
            </TableContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
}
