"use client";

export const dynamic = 'force-dynamic';

import { Box, Container, Stack, Typography, Card, CardContent, Button, Chip, TextField, CircularProgress } from '@mui/material';
import { Search, Person, CalendarToday } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { getBlogPosts } from '@/lib/services';

const BlogHomePage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await getBlogPosts({ search: search || undefined });
        setPosts(response?.data || []);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, [search]);

  const handleReadMore = (slug: string) => {
    alert(`Reading post: ${slug}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 600, mb: 2 }}>
          Kartify Blog
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stay updated with the latest news, tips, and stories
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Latest Articles
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Search blogs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ width: 250 }}
                  slotProps={{
                    input: {
                      startAdornment: <Search fontSize="small" />,
                    },
                  }}
                />
                <Button variant="outlined" color="primary" size="medium" sx={{ px: 4, py: 2 }}>
                  Filter by Category
                </Button>
              </Box>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="error.main">
                {error}
              </Typography>
            </Box>
          ) : posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary">
                No blog posts found
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 4 }}>
              {posts.map((post: any) => (
                <Card key={post.id} sx={{ borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' } }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 2 }}>
                      {post.categories?.map((category: string) => (
                        <Chip
                          key={category}
                          label={category}
                          size="small"
                          sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', mr: 0.5 }}
                        />
                      ))}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarToday fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Person fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          By {post.author?.name || 'Anonymous'}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ px: 2, py: 1 }}
                      onClick={() => handleReadMore(post.slug)}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default BlogHomePage;
