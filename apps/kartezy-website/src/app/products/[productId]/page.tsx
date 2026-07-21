"use client";
import { Box, Container, Grid, Typography, Card, CardContent, CardMedia, Stack, Button, Chip, Badge, IconButton } from '@mui/material';
import { Favorite, Visibility } from '@mui/icons-material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getProductById } from '@/lib/services';

export default function ProductDetailsPage({ params }: { params: { productId: string } }) {
  const { productId } = params;
  const router = useRouter();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  if (isLoading) return <div>Loading product details...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  const handleQuantityChange = (change: number) => {
    const newQty = quantity + change;
    if (newQty >= 1) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    alert('Proceeding to checkout...');
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Back to products link */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          size="small"
          onClick={() => router.push('/products')}
          sx={{ color: 'text.secondary', textTransform: 'none', p: 0 }}
        >
          ← Back to Products
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            {product.images && product.images.length > 0 ? (
              <CardMedia
                component="img"
                height="400"
                image={product.images[0]}
                alt={product.name}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  No image available
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Product Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ px: 4, py: 4 }}>
              <Stack spacing={3}>
                {/* Product Name and Rating */}
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {product.name}
                </Typography>

                {/* Rating */}
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {product.rating ?? 0} ★
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({product.reviewCount ?? 0} reviews)
                  </Typography>
                </Stack>

                {/* Price */}
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 600 }} color="primary.main">
                    ₹{product.price}
                  </Typography>
                  {product.originalPrice && (
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ₹{product.originalPrice}
                    </Typography>
                  )}
                </Stack>

                {/* Description */}
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>

                {/* Quantity Selector */}
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Quantity:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(-1)}
                      sx={{ border: '1px solid', borderColor: 'grey.400' }}
                    >
                      -
                    </IconButton>
                    <Box sx={{ minWidth: 40, textAlign: 'center', fontWeight: 500 }}>
                      {quantity}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(1)}
                      sx={{ border: '1px solid', borderColor: 'grey.400' }}
                    >
                      +
                    </IconButton>
                  </Stack>
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ flexGrow: 1, py: 1.5, fontWeight: 600 }}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{ flexGrow: 1, py: 1.5, fontWeight: 600 }}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
