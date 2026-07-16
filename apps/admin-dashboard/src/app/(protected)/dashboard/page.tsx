"use client";

import { Box, Card, CardContent, Typography, Container, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const dashboardStore = useDashboardStore();
  const analyticsStore = useAnalyticsStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dashboardStore.fetchStats();
        await analyticsStore.fetchRevenueTrend('month');
        await analyticsStore.fetchOrdersTrend('month');
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardSx = { height: '100%', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' };
  const gridSx = { display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
          <Box sx={gridSx}>
            {Array.from({ length: 16 }).map((_, i) => (
              <Card key={i} sx={cardSx}>
                <CardContent>
                  <Skeleton variant="rectangular" width="60%" height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width="40%" height={24} />
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Trends</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Typography variant="h5" gutterBottom>Revenue Trend</Typography>
                <Skeleton variant="rectangular" width="100%" height={200} />
              </Box>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Typography variant="h5" gutterBottom>Orders Trend</Typography>
                <Skeleton variant="rectangular" width="100%" height={200} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    );
  }

  const MetricCard = ({ label, value, prefix = '' }: { label: string; value: number | string | null | undefined; prefix?: string }) => (
    <Card sx={cardSx}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h4">{value ? `${prefix}${typeof value === 'number' ? value.toLocaleString() : value}` : '0'}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
        <Box sx={gridSx}>
          <MetricCard label="GMV" value={dashboardStore.gmv} prefix="₹" />
          <MetricCard label="Revenue" value={dashboardStore.revenue} prefix="₹" />
          <MetricCard label="Total Orders" value={dashboardStore.totalOrders} />
          <MetricCard label="Active Orders" value={dashboardStore.activeOrders} />
          <MetricCard label="Customers" value={dashboardStore.customers} />
          <MetricCard label="Merchants" value={dashboardStore.merchants} />
          <MetricCard label="Delivery Partners" value={dashboardStore.deliveryPartners} />
          <MetricCard label="Products" value={dashboardStore.products} />
          <MetricCard label="Categories" value={dashboardStore.categories} />
          <MetricCard label="Inventory Alerts" value={dashboardStore.inventoryAlerts} />
          <MetricCard label="Refund Requests" value={dashboardStore.refundRequests} />
          <MetricCard label="Support Tickets" value={dashboardStore.supportTickets} />
          <MetricCard label="Wallet Balance" value={dashboardStore.walletBalance} />
          <MetricCard label="Active Promotions" value={dashboardStore.activePromotions} />
          <MetricCard label="Today Sales" value={dashboardStore.todaySales} />
          <MetricCard label="Monthly Revenue" value={dashboardStore.monthlyRevenue} prefix="₹" />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>Trends</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
              <Typography variant="h5" gutterBottom>Revenue Trend</Typography>
              {analyticsStore.revenueTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analyticsStore.revenueTrend}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>Loading revenue trend...</Typography>
              )}
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
              <Typography variant="h5" gutterBottom>Orders Trend</Typography>
              {analyticsStore.ordersTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analyticsStore.ordersTrend}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>Loading orders trend...</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
