import { Box, Container, Stack, Typography, Card, CardMedia, CardContent, CardActions, Button, Divider, TextField, InputAdornment, Chip, Badge, IconButton } from '@mui/material';
import { Search as SearchIcon, Favorite, Visibility, Share, AddShoppingCart, LocalOffer, AccessTime, RemoveIcon, AddIcon } from '@mui/icons/material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { getProductById } from '@/lib/services';

export default function ProductDetailsPage({ params }: { params: { productId: string } }) {
  const { productId } = params;
  const router = useRouter();
  const pathname = usePathname();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  if (isLoading) return <div>Loading product details...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleQuantityChange = (change: number) => {
    const newQty = quantity + change;
    if (newQty >= 1) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    // In a real app, we would add to cart via API or state management
    // Cart addition handled by cart service
    // Show success message or update cart count
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    // Redirect to checkout with this product
    // For now, just show a message
    alert('Proceeding to checkout...');
    // router.push(`/checkout?product=${productId}&qty=${quantity}`);
  };

  return (
    <Container maxWidth="lx" sx={{ py: { xs: 4, md: 6 } }}>
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
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            {product.images && product.images.length > 0 ? (
              <>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  {product.images.map((image: string, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        width: 60,
                        height: 60,
                        border: `2px solid ${selectedVariant === index ? 'primary.main' : 'transparent'}`,
                        borderRadius: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                        onClick: () => setSelectedVariant(index),
                      }}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Stack>
                <CardMedia
                  component="img"
                  height="400"
                  image={product.images[selectedVariant ?? 0] ?? product.image}
                  alt={product.name}
                  sx={{ borderRadius: 2 }}
                />
              </>
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
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ px: 4, py: 4 }}>
              <Stack spacing={3}>
                {/* Product Name and Rating */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h4" fontWeight={600} sx={{ flexGrow: 1 }}>
                    {product.name}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= (product.rating ?? 0) ? '★' : '☆'}
                      </span>
                    ))}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.rating} · {product.reviewCount ?? 0} reviews)
                    </Typography>
                  </Stack>
                </Stack>

                {/* Price */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h3" fontWeight={600} color="primary.main">
                    ₹{product.price}
                  </Typography>
                  {product.originalPrice && (
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        ₹{product.originalPrice}
                      </Typography>
                      <Badge badgeContent={Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} color="error">
                        <Chip label="OFF" size="small" sx={{ backgroundColor: 'error.light', color: 'error.dark' }} />
                      </Badge>
                    </>
                  )}
                </Stack>

                {/* Availability */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4caf50' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    In Stock
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usually ships in {product.deliveryTime || '1-2 days'}
                  </Typography>
                </Stack>

                {/* Description */}
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Product Description
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {product.description}
                </Typography>

                {/* Variants (if any) */}
                {product.variants && product.variants.length > 0 && (
                  <>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      Choose Variant
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      {product.variants.map((variant: any, index: number) => (
                        <Button
                          key={variant.id}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: selectedVariant === variant.id ? 'primary.main' : 'grey.400',
                            color: selectedVariant === variant.id ? 'primary.main' : 'text.secondary',
                            '&:hover': {
                              borderColor: selectedVariant === variant.id ? 'primary.main' : 'grey.500',
                            }
                          }}
                          onClick={() => setSelectedVariant(variant.id)}
                        >
                          {variant.name}
                        </Button>
                      ))}
                    </Stack>
                  </>
                )}

                {/* Quantity Selector */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Quantity:
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      variant="outlined"
                      onClick={() => handleQuantityChange(-1)}
                      sx={{
                        borderColor: 'grey.400',
                        '&:hover': {
                          backgroundColor: 'grey.100',
                        }
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ minWidth: 40, textAlign: 'center', fontWeight: 500 }}>
                      {quantity}
                    </Box>
                    <IconButton
                      size="small"
                      variant="outlined"
                      onClick={() => handleQuantityChange(1)}
                      sx={{
                        borderColor: 'grey.400',
                        '&:hover': {
                          backgroundColor: 'grey.100',
                        }
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      flexGrow: 1,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#e55a2b',
                      }
                    }}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{
                      flexGrow: 1,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      border: '2px solid',
                      '&:hover': {
                        backgroundColor: 'rgba(25,118,210,0.05)',
                      }
                    }}
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