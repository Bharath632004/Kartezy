"use client";
import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useBiStore } from '@/store/biStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

export default function MarketingAnalytics() {
  const { marketingAnalytics, fetchMarketingAnalytics, loading, error } = useBiStore();
  useEffect(() => { fetchMarketingAnalytics(); }, []);

  if (loading && !marketingAnalytics) return (<Container sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Container>);
  const m = marketingAnalytics || {};

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Marketing Analytics</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h5" color="primary">${m.customerAcquisitionCost?.toFixed(2) || '—'}</Typography><Typography variant="body2" color="text.secondary">Customer Acquisition Cost</Typography></CardContent></Card></Grid>
        <Grid item xs={6}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h5" color="success.main">{m.ltvToCacRatio?.toFixed(1) || '—'}x</Typography><Typography variant="body2" color="text.secondary">LTV:CAC Ratio</Typography></CardContent></Card></Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Campaign ROI</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small"><TableHead><TableRow><TableCell>Campaign</TableCell><TableCell align="right">Spend</TableCell><TableCell align="right">Revenue</TableCell><TableCell align="right">ROI</TableCell></TableRow></TableHead>
              <TableBody>{(m.campaignROI || []).map((c: any, i: number) => (
                <TableRow key={i}><TableCell>{c.campaign}</TableCell><TableCell align="right">${(c.spend || 0).toLocaleString()}</TableCell><TableCell align="right">${(c.revenue || 0).toLocaleString()}</TableCell><TableCell align="right">{c.roi}x</TableCell></TableRow>
              ))}</TableBody></Table>
            </TableContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
}
