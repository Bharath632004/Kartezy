"use client";

import { useState } from 'react';
import {
  Box, Container, Typography, Button, IconButton, Tooltip,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Stack, Alert, Card, CardContent, Grid, Switch,
  FormControlLabel, Paper,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Add, Edit, Delete, Visibility, Image as ImageIcon,
  CalendarMonth, CheckCircle,
} from '@mui/icons-material';
import { cmsService } from '@/lib/api';

export default function BannersPage() {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: banners, isLoading, error } = useQuery({
    queryKey: ['cms-banners'],
    queryFn: () => cmsService.getBanners(),
    select: (res: any) => res.data || res || [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cmsService.deleteBanner(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['cms-banners'] }); setDeleteDialogOpen(false); },
  });

  const bannerList = Array.isArray(banners) ? banners : [];

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Banners Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialogOpen(true)}>
            Create Banner
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card><CardContent sx={{ textAlign: 'center' }}>
              <ImageIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{bannerList.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Banners</Typography>
            </CardContent></Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card><CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {bannerList.filter((b: any) => b.isActive !== false).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Active</Typography>
            </CardContent></Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card><CardContent sx={{ textAlign: 'center' }}>
              <CalendarMonth sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {bannerList.filter((b: any) => b.scheduledAt && new Date(b.scheduledAt) > new Date()).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Scheduled</Typography>
            </CardContent></Card>
          </Grid>
        </Grid>

        {isLoading && <Typography>Loading...</Typography>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>Failed to load banners.</Alert>}

        <Grid container spacing={2}>
          {bannerList.length === 0 && !isLoading ? (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <ImageIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No banners created yet</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create your first promotional banner to display on the platform.
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialogOpen(true)}>
                  Create Banner
                </Button>
              </Paper>
            </Grid>
          ) : (
            bannerList.map((banner: any) => (
              <Grid key={banner.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ position: 'relative', '&:hover': { boxShadow: 4 } }}>
                  <Box sx={{ position: 'relative', height: 160, bgcolor: 'grey.100' }}>
                    {banner.imageUrl ? (
                      <Box
                        component="img"
                        src={banner.imageUrl}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <ImageIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                      </Box>
                    )}
                    <Chip
                      label={banner.isActive !== false ? 'Active' : 'Inactive'}
                      size="small"
                      color={banner.isActive !== false ? 'success' : 'default'}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{banner.title || 'Untitled Banner'}</Typography>
                    {banner.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {banner.description}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                      <Chip label={banner.type || 'Home'} size="small" variant="outlined" />
                      {banner.linkUrl && <Chip label="Has Link" size="small" color="info" variant="outlined" />}
                    </Stack>
                    <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title="Edit"><IconButton size="small"><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Preview"><IconButton size="small"><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => { setSelectedBanner(banner); setDeleteDialogOpen(true); }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Banner</DialogTitle>
          <DialogContent>
            Are you sure you want to delete <strong>{selectedBanner?.title || 'this banner'}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => selectedBanner && deleteMutation.mutate(selectedBanner.id)} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Banner</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Title" fullWidth required />
              <TextField label="Description" multiline rows={2} fullWidth />
              <TextField label="Image URL" placeholder="https://..." fullWidth />
              <TextField label="Link URL" placeholder="https://..." fullWidth />
              <TextField label="Sort Order" type="number" defaultValue={0} fullWidth />
              <FormControlLabel control={<Switch defaultChecked />} label="Active" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button variant="contained">Create</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}