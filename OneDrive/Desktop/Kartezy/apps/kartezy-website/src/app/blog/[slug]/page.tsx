"use client";

import { Box, Container, Typography, Card, CardContent, Button, Divider, Chip, Avatar, TextField } from '@mui/material';
import { Person, Category, CalendarToday, Comment, Share, Favorite, BookmarkBorder } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { getBlogPostBySlug } from '@/lib/services';
import { useParams } from 'next/navigation';

const BlogPostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments] = useState<any[]>([
    { id: 1, author: { name: 'John Doe' }, text: 'Great article! Very informative.', date: '2023-05-15' },
    { id: 2, author: { name: 'Jane Smith' }, text: 'I learned a lot from this. Thanks for sharing.', date: '2023-05-14' },
  ]);

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        setLoading(true);
        const response = await getBlogPostBySlug(slug as string);
        setPost(response.data);
      } catch (err) {
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };
    if (slug) loadBlogPost();
  }, [slug]);

  if (loading) return <Container sx={{ py: 4, textAlign: 'center' }}>Loading blog post...</Container>;
  if (error) return <Container sx={{ py: 4, textAlign: 'center' }}>Error: {error}</Container>;
  if (!post) return <Container sx={{ py: 4, textAlign: 'center' }}>Blog post not found</Container>;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>{post.title}</Typography>
        <Typography variant="body1" color="text.secondary">
          {new Date(post.createdAt).toLocaleDateString()} &bull; {post.author?.name || 'Anonymous'} &bull; {post.category || 'General'}
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 4, mb: 4 }}>
        <CardContent>
          {post.coverImage && (
            <Box sx={{ mb: 4, '& img': { width: '100%', borderRadius: 2 } }}>
              <img src={post.coverImage} alt={post.title} />
            </Box>
          )}
          <Typography variant="body1">{post.content}</Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Tags</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
          {post.tags?.map((tag: string) => (
            <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: '#f5f5f5' }} />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Comments ({comments.length})</Typography>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', p: 2, borderBottom: '1px solid #f0f0f0' }}>
              <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
                {comment.author.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>{comment.author.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {new Date(comment.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">{comment.text}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 4 }}>
          <TextField label="Add a comment..." multiline rows={3} fullWidth sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" sx={{ px: 4 }}>Post Comment</Button>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Share this article</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<Share />}>Share</Button>
          <Button variant="outlined" startIcon={<Favorite />}>Like</Button>
          <Button variant="outlined" startIcon={<BookmarkBorder />}>Bookmark</Button>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Related Articles</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 3 }}>
          {['How to Save Money on Groceries', 'Top 10 Healthy Snacks for Kids', 'The Benefits of Organic Food'].map((title) => (
            <Card key={title} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>{title}</Typography>
                <Button variant="outlined" size="small">Read More</Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default BlogPostDetailPage;
