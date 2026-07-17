"use client";

import { Box, Container, Typography, Card, CardContent, Button, Chip, TextField, CircularProgress } from '@mui/material';
import { Folder, Person, CalendarToday } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { getBlogPosts } from '@/lib/services';

interface Category {
  name: string;
  count: number;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  createdAt: string;
  categories: string[];
  author: { name: string };
}

const BlogCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getBlogPosts();
        const allPosts: BlogPost[] = response?.data || [];
        setPosts(allPosts);

        const uniqueCategories = [...new Set(allPosts.flatMap(post => post.categories || []))];
        setCategories(
          uniqueCategories.map(category => ({
            name: category,
            count: allPosts.filter(post => (post.categories || []).includes(category)).length,
          }))
        );
      } catch (err) {
        setError('Failed to load blog categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter(post => (post.categories || []).includes(selectedCategory))
    : [];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Blog Categories
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse articles by topic
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
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
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                  All Categories
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 3 }}>
                  {categories.map((category) => (
                    <Card
                      key={category.name}
                      sx={{
                        borderRadius: 4,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Folder sx={{ fontSize: 32, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.count} posts
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>

              {selectedCategory && (
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                      Articles in &quot;{selectedCategory}&quot;
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ color: 'primary.main', mb: 2 }}
                      onClick={() => setSelectedCategory(null)}
                    >
                      Back to All Categories
                    </Button>
                  </Box>
                  {filteredPosts.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h5" color="text.secondary">
                        No posts found in this category
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 4 }}>
                      {filteredPosts.map((post) => (
                        <Card key={post.id} sx={{ borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' } }}>
                          <CardContent sx={{ p: 4 }}>
                            <Box sx={{ mb: 2 }}>
                              <Chip
                                label={selectedCategory}
                                size="small"
                                sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                              />
                            </Box>
                            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
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
                              onClick={() => alert(`Read post: ${post.title}`)}
                            >
                              Read More
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default BlogCategoriesPage;
