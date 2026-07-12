import { Box, Container, Typography, Card, CardContent, Grid, CircularProgress, Divider, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { productsService } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsService.getProducts({ limit: 10 });
        setProducts(response.data.content || response.data.products || []);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Products Management
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Products Management
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom mb={4}>
        Products Management
      </Typography>

      <Grid container spacing={3}>
        {products.map(product => (
          <Grid key={product.id} item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku || 'N/A'}
                </Typography>
                <Divider />
                <Typography variant="body2">
                  Price: ${product.price?.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="body2">
                  Stock: {product.stock?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" color={product.status === 'active' ? 'success.main' : 'error.main'}>
                  Status: {product.status?.toUpperCase() || 'INACTIVE'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}