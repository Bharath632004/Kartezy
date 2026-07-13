"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, Link } from '@mui/material';
import { Blog, LocalMall, Person, Category, CalendarToday, Label, Comment, Share, Favorite, BookmarkBorder } from '@mui/icons-material';
import { useState } from 'react';
import { useEffect } from 'react';
import { getBlogPostBySlug } from '@/lib/services';
import { useParams } from 'next/navigation';

const BlogPostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // In a real app, fetch from API

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        setLoading(true);
        const response = await getBlogPostBySlug(slug);
        setPost(response.data);
        // In a real app, we would also fetch comments
        // For now, we'll use mock comments
        setComments([
          {
            id: 1,
            author: { name: 'John Doe', avatar: '' },
            text: 'Great article! Very informative.',
            date: '2023-05-15',
          },
          {
            id: 2,
            author: { name: 'Jane Smith', avatar: '' },
            text: 'I learned a lot from this. Thanks for sharing.',
            date: '2023-05-14',
          },
        ]);
      } catch (err) {
        setError('Failed to load blog post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlogPost();
    }
  }, [slug]);

  if (loading) return <div>Loading blog post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Blog post not found</div>;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          {post.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {new Date(post.createdAt).toLocaleDateString()} •
          <Person fontSize="small" sx={{ mr: 1 }} />
          {post.author?.name || 'Anonymous'} •
          <Category fontSize="small" sx={{ mr: 1 }} />
          {post.category || 'General'}
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          {post.coverImage && (
            <Box sx={{ mb: 4 }}>
              <img src={post.coverImage} alt={post.title} sx={{ width: '100%', borderRadius: 4 }} />
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {post.content}
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Tags
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          {post.tags?.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ backgroundColor: '#f5f5f5' }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Comments ({comments.length})
        </Typography>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', alignItems: 'flex-start', px: 3, py: 2, borderBottom: comment.id !== comments[comments.length - 1].id ? '1px solid #f0f0f0' : 'none' }}>
              <Box sx={{ flexShrink: 0, mr: 3 }}>
                <Avatar sx={{ width: 32, height: 32, bgColor: 'primary.main' }} >
                  {comment.author.name?.[0]}
                </Avatar>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  {comment.author.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {new Date(comment.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  {comment.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 4 }}>
          <TextField
            label="Add a comment..."
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              sx={{ px: 4, py: 2 }}
            >
              Post Comment
            </Button>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Share this article
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            sx={{ px: 4, py: 2 }}
            startIcon={<Facebook fontSize="medium" />}
          >
            Facebook
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            sx={{ px: 4, py: 2 }}
            startIcon={<Twitter fontSize="medium" />}
          >
            Twitter
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            sx={{ px: 4, py: 2 }}
            startIcon={<LinkedIn fontSize="medium" />}
          >
            LinkedIn
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            sx={{ px: 4, py: 2 }}
            startIcon={<WhatsApp fontSize="medium" />}
          >
            WhatsApp
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            sx={{ px: 4, py: 2 }}
            startIcon={<BookmarkBorder fontSize="medium" />}
          >
            Bookmark
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Related Articles
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 3 }}>
          {/* In a real app, we would fetch related articles based on tags or category */}
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 8px rgba(0, 0,0.08', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                How to Save Money on Groceries
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Learn smart shopping tips to reduce your grocery bill
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ px: 2, py: 1 }}
              >
                Read More
              </Button>
            </Card>
          </Card>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Top 10 Healthy Snacks for Kids
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Nutritious and tasty snack ideas for your little ones
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ px: 2, py: 1 }}
              >
                Read More
              </Button>
            </Card>
          </Card>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                The Benefits of Organic Food
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Why choosing organic can be better for your health and the environment
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ px: 2, py: 1 }}
              >
                Read More
              </Button>
            </Card>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default BlogPostDetailPage;