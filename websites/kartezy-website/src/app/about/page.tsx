"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Divider, Avatar, Grid } from '@mui/material';
import { LocalMall, TrendingUp, RocketLaunch } from '@mui/icons-material';

const AboutPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 600, mb: 2 }}>
          About Kartify
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Learn about our story, mission, and the team behind India's fastest grocery delivery platform
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LocalMall sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
              Who We Are
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Kartify is India's fastest grocery delivery platform, bringing fresh produce, household essentials, and more to your doorstep in minutes. Founded in 2020, we've grown to serve over 10 cities with a network of 500+ stores and 5000+ delivery partners.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Our Journey
            </Typography>
            <Stack spacing={3}>
              {[
                { year: '2020', text: 'Founded in Bangalore with a mission to revolutionize grocery delivery' },
                { year: '2021', text: 'Expanded to 5 cities and launched our mobile app' },
                { year: '2022', text: 'Reached 1 million+ users and introduced Kartify Plus membership' },
                { year: '2023', text: 'Expanded to 10 cities and launched sustainability initiative' },
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: '50%', bgcolor: 'primary.main',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Typography sx={{ color: 'white', fontWeight: 700 }}>{item.year}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, pt: 1 }}>
                    <Typography variant="body1" color="text.secondary">{item.text}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Our Mission & Vision
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <TrendingUp sx={{ fontSize: 32, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Our Mission
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    To make grocery shopping effortless, affordable, and sustainable for every Indian household through lightning-fast delivery and exceptional service.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <RocketLaunch sx={{ fontSize: 32, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Our Vision
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    To be India's most trusted and loved grocery platform, connecting local stores with customers through technology and innovation.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Meet Our Team
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={4}>
            {[
              { initials: 'AR', name: 'Arjun Reddy', role: 'Founder & CEO', desc: 'Visionary leader with 10+ years in e-commerce and logistics' },
              { initials: 'PS', name: 'Priya Sharma', role: 'Chief Technology Officer', desc: 'Tech expert specializing in scalable platforms and AI' },
              { initials: 'VK', name: 'Vikram Khanna', role: 'Chief Operations Officer', desc: 'Operations leader with expertise in supply chain and delivery networks' },
              { initials: 'NG', name: 'Neha Gupta', role: 'Head of Marketing', desc: 'Marketing strategist with a passion for brand building and customer engagement' },
            ].map((member, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%' }}>
                  <CardContent>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mb: 2, mx: 'auto', fontSize: 32 }}>
                      {member.initials}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AboutPage;
