import { Box, Container, Stack, Typography, Card, CardContent, Avatar, Divider } from '@mui/material';
import { 
  Star, 
  Person 
} from '@mui/icons-material';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "Kartezy has completely changed how I shop for groceries. The 15-minute delivery is incredible, and the quality of produce is always top-notch. I haven't visited a physical grocery store in months!",
      avatar: "/avatars/priya.jpg"
    },
    {
      id: 2,
      name: "Rahul Mehta",
      location: "Delhi",
      rating: 5,
      text: "As a working professional, I don't have time to go grocery shopping. Kartzezy delivers everything I need - from fresh vegetables to household essentials - right to my doorstep. The app is super easy to use!",
      avatar: "/avatars/rahul.jpg"
    },
    {
      id: 3,
      name: "Anita Desai",
      location: "Bangalore",
      rating: 4,
      text: "I love the wide variety of products available. From international ingredients to local favorites, I can find everything I need. The prices are competitive too!",
      avatar: "/avatars/anita.jpg"
    }
  ];

  return (
    <section sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 4 }}>
            What Our Customers Say
          </Typography>
          
          <Stack spacing={4} direction={{ xs: 'column', sm: 'row', md: 'row' }} flexWrap="wrap">
            {testimonials.map((testimonial) => (
              <Card 
                key={testimonial.id} 
                sx={{
                  minWidth: 280,
                  flexGrow: 1,
                  maxWidth: 340,
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  backgroundColor: 'white',
                }}
              >
                <CardContent sx={{ p: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar 
                      sx={{ width: 48, height: 48, marginRight: 2 }}
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    >
                      {testimonial.name.split(' ')[0][0]}{testimonial.name.split(' ')[1]?.[0]}
                    </Avatar>
                    <Stack spacing={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.location}
                      </Typography>
                    </Stack>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    "{testimonial.text}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <Star 
                        key={index} 
                        fontSize="small" 
                        color={index < testimonial.rating ? 'warning.main' : 'grey.400'}
                      />
                    ))}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      {testimonial.rating}/5
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </section>
  );
};
