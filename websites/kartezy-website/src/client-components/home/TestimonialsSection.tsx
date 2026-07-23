import { Box, Container, Stack, Typography, Card, CardContent, Avatar, Divider } from '@mui/material';
import { Star } from '@mui/icons-material';

export default function TestimonialsSection({ data }: { data?: any } = {}) {
  // Default data if none provided
  const defaultData = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "Kartezy has completely changed how I shop for groceries. The 15-minute delivery is incredible, and the quality of produce is always top-notch.",
    },
    {
      id: 2,
      name: "Rahul Mehta",
      location: "Delhi",
      rating: 5,
      text: "As a working professional, I don't have time to go grocery shopping. Kartezy delivers everything I need - from fresh vegetables to essentials.",
    },
    {
      id: 3,
      name: "Anita Desai",
      location: "Bangalore",
      rating: 4,
      text: "I love the wide variety of products available. From international ingredients to local favorites, I can find everything I need.",
    }
  ];

  const testimonials = data || defaultData;

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
            What Our Customers Say
          </Typography>

          <Stack spacing={4} direction={{ xs: 'column', md: 'row' }} justifyContent="center">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                sx={{
                  flexGrow: 1,
                  maxWidth: 400,
                  borderRadius: 5,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  backgroundColor: 'white',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 48, height: 48, marginRight: 2 }}>
                      {testimonial.name[0]}
                    </Avatar>
                    <Stack>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.location}
                      </Typography>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, minHeight: 80 }}>
                    "{testimonial.text}"
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <Star
                        key={index}
                        fontSize="small"
                        color={index < testimonial.rating ? 'warning' : 'disabled'}
                      />
                    ))}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {testimonial.rating}/5
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}