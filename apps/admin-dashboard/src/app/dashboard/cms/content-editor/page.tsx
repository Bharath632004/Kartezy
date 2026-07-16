"use client";

import { Box, Typography, TextField, Button, Stack, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel } from '@mui/material';
import * as React from 'react';
import { useCMSStore } from '@/store/cmsStore';

interface PageData {
  id?: string;
  title?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  content?: string;
  seoKeywords?: string[];
  isPublished?: boolean;
}

export default function ContentEditorPage() {
  const { pages, loading, error, fetchPages, createPage, updatePage, deletePage } = useCMSStore();
  const [filters, setFilters] = React.useState({
    status: '',
    startDate: '',
    endDate: ''
  });
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState<PageData | null>(null);

  React.useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleToggleCreateDialog = () => {
    setOpenCreateDialog(!openCreateDialog);
    setSelectedPage(null);
  };

  const handleToggleEditDialog = (page: any = null) => {
    setSelectedPage(page ? { ...page } : null);
    setOpenEditDialog(!openEditDialog);
  };

  if (loading) return <Box sx={{ p: 4 }}><Typography variant="body2">Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography variant="body2" color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Content Editor
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            label="Status"
            select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            sx={{ minWidth: 150 }}
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </TextField>
          <TextField
            label="Start Date"
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            sx={{ width: 150 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            sx={{ width: 150 }}
          />
          <Button variant="contained" onClick={() => fetchPages()}>
            Apply Filters
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleToggleCreateDialog}>
            Create Page
          </Button>
        </Stack>
      </Box>

      {!pages || pages.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2">No pages available</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pages List
            </Typography>
            <Stack direction="column" spacing={2}>
              {pages.map((page: any) => (
                <Paper key={page.id} elevation={2} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" component="div">
                        {page.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {page.slug}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button size="small" variant="text" sx={{ color: 'primary.main' }} onClick={() => handleToggleEditDialog(page)}>
                        Edit
                      </Button>
                      <Button size="small" variant="text" sx={{ color: 'error.main', ml: 1 }} onClick={() => deletePage(page.id)}>
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
      )}

      {/* Create Page Dialog */}
      <Dialog open={openCreateDialog} onClose={handleToggleCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Page</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={selectedPage?.title || ''}
            onChange={(e) => {
              if (selectedPage) {
                setSelectedPage({ ...selectedPage, title: e.target.value });
              } else {
                setSelectedPage({ ...(selectedPage || {}), title: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Slug"
            value={selectedPage?.slug || ''}
            onChange={(e) => {
              if (selectedPage) {
                setSelectedPage({ ...selectedPage, slug: e.target.value });
              } else {
                setSelectedPage({ ...(selectedPage || {}), slug: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Meta Title"
            value={selectedPage?.metaTitle || ''}
            onChange={(e) => {
              if (selectedPage) {
                setSelectedPage({ ...selectedPage, metaTitle: e.target.value });
              } else {
                setSelectedPage({ ...(selectedPage || {}), metaTitle: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Meta Description"
            value={selectedPage?.metaDescription || ''}
            onChange={(e) => {
              if (selectedPage) {
                setSelectedPage({ ...selectedPage, metaDescription: e.target.value });
              } else {
                setSelectedPage({ ...(selectedPage || {}), metaDescription: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            label="Content"
            value={selectedPage?.content || ''}
            onChange={(e) => {
              if (selectedPage) {
                setSelectedPage({ ...selectedPage, content: e.target.value });
              } else {
                setSelectedPage({ ...(selectedPage || {}), content: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={10}
          />
          <TextField
            label="SEO Keywords"
            value={selectedPage?.seoKeywords || ''}
            onChange={(e) => {
              if (selectedPage) {
                const keywords = (e.target.value as string).split(',').map(k => k.trim()).filter(Boolean);
                setSelectedPage({ ...selectedPage, seoKeywords: keywords });
              } else {
                const keywords = (e.target.value as string).split(',').map(k => k.trim()).filter(Boolean);
                setSelectedPage({ ...(selectedPage || {}), seoKeywords: keywords });
              }
            }}
            fullWidth
            margin="normal"
          />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <FormControlLabel
              control={<Switch
                checked={selectedPage?.isPublished ?? false}
                onChange={(e) => {
                  if (selectedPage) {
                    setSelectedPage({ ...selectedPage, isPublished: e.target.checked });
                  } else {
                    setSelectedPage({ ...(selectedPage || {}), isPublished: e.target.checked });
                  }
                }}
              />}
              label="Published"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleCreateDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedPage) {
              try {
                await createPage(selectedPage);
                setOpenCreateDialog(false);
                setSelectedPage(null);
                // Refresh after creation
                fetchPages();
              } catch (err) {
                console.error('Error creating page:', err);
              }
            }
          }}>
            Create Page
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Page Dialog */}
      <Dialog open={openEditDialog} onClose={handleToggleEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Page</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={selectedPage?.title || ''}
            onChange={(e) => {
              if (selectedPage) {
                setSelectedPage({ ...selectedPage, title: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Slug"
            value={selectedPage?.slug || ''}
            onChange={(e) => {
              if (selectedPage) {
                setSelectedPage({ ...selectedPage, slug: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Meta Title"
            value={selectedPage?.metaTitle || ''}
            onChange={(e) => {
              if (selectedPage) {
                setSelectedPage({ ...selectedPage, metaTitle: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Meta Description"
            value={selectedPage?.metaDescription || ''}
            onChange={(e) => {
              if (selectedPage) {
                setSelectedPage({ ...selectedPage, metaDescription: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            label="Content"
            value={selectedPage?.content || ''}
            onChange={(e) => {
              if (selectedPage) {
                setSelectedPage({ ...selectedPage, content: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={10}
          />
          <TextField
            label="SEO Keywords"
            value={selectedPage?.seoKeywords || ''}
            onChange={(e) => {
              if (selectedPage) {
                const keywords = (e.target.value as string).split(',').map(k => k.trim()).filter(Boolean);
                setSelectedPage({ ...selectedPage, seoKeywords: keywords });
              }
            }}
            fullWidth
            margin="normal"
          />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <FormControlLabel
              control={<Switch
                checked={selectedPage?.isPublished ?? false}
                onChange={(e) => {
                  if (selectedPage) {
                    setSelectedPage({ ...selectedPage, isPublished: e.target.checked });
                  }
                }}
              />}
              label="Published"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (selectedPage && selectedPage.id) {
              try {
                await updatePage(selectedPage.id, selectedPage);
                setOpenEditDialog(false);
                setSelectedPage(null);
                fetchPages();
              } catch (err) {
                console.error('Error updating page:', err);
              }
            }
          }}>
            Update Page
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}