import { Box, Container, Typography } from '@mui/material';

export default function BlogsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Blogs Management
        </Typography>
        <Typography variant="body1">
          Create and manage blog posts and articles.
        </Typography>
      </Container>
    </Box>
  );
}