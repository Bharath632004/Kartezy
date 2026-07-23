"use client";

import { useState } from 'react';
import { Box, Typography, Container, Stack, Button, TextField, MenuItem } from '@mui/material';
import { useMarketingStore } from '@/store/marketingStore';

export default function EmailCampaignsPage() {
  const { campaigns, loading, error, fetchCampaigns } = useMarketingStore();
  const [filters, setFilters] = useState({ status: '', type: '', startDate: '', endDate: '' });

  if (loading) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography color="error">Error: {error}</Typography></Box>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Email Campaigns</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField label="Status" value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} select sx={{ minWidth: 150 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
        <Button variant="contained" onClick={() => fetchCampaigns(filters)}>Apply</Button>
      </Stack>
      <Box>
        {campaigns?.length > 0 ? campaigns.map((c: any) => (
          <Box key={c.id} sx={{ p: 2, mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="h6">{c.name}</Typography>
            <Typography variant="body2" color="text.secondary">{c.type} - {c.status}</Typography>
          </Box>
        )) : (
          <Typography>No email campaigns found</Typography>
        )}
      </Box>
    </Container>
  );
}
